// 服务端
var express = require('express');
var app = express();
var http = require('http').Server(app);
var os = require("os");
var hostname = os.hostname();
console.log('Hostname: '+hostname);
var allowed_origins = 'edgeofmap.com:*,bubububaoshe.github.io:*,localhost:*';
if (hostname == "xps-9550") { allowed_origins = '*:*' }
var io = require('socket.io')(http, { origins: allowed_origins });

app.get('/', function(req, res){
	res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname)); // 让app能够回传各种静态资源

// https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.RemovePair = function(x) {
  if (x == null) return;
  while (true) {
    var found = false;
    for (var i=0; i<this.length; i++) {
      if (this[i][0] == x[0] &&
          this[i][1] == x[1]) {
        this.splice(i, 1);
        found = true;
        break;
      }
    }
    if (found == false) break;
  }
}

var g_all_sockets = [];
var g_serial = 1;
var g_is_verify = true;

class PlayerMatcher {
	constructor() {
		this.match_queue = []; // 所有连上来的玩家
		this.matched_pairs = []; 
	}

	OnNewPlayerReadyToMatch(p0) {
		this.match_queue.push(p0);
		p0.emit('Match_ReadyToMatchAck');
	}

	MatchOnePair() {
		if (this.match_queue.length >= 2) {
			var p0 = this.match_queue.pop();
			var p1 = this.match_queue.pop();
			this.matched_pairs.push([p0, p1]);
			p0.can_be_found = false;
			p1.can_be_found = false;
			p0.matched = true;
			p0.emit("Match_FoundMatch", p1.nickname, p1.avataridx, "已找到对手，请确认：");
			p1.emit("Match_FoundMatch", p0.nickname, p0.avataridx, "已找到对手，请确认：");
		}
	}
	
	// P0 找 P1
	BringTwoPlayersIntoPair(p0, p1) {
	  this.matched_pairs.push([p0, p1]);
	  p0.can_be_found = false;
	  p1.can_be_found = false;
	  p0.emit("Match_FoundMatch", p1.nickname, p1.avataridx, "找到了这位小伙伴，请等待ta确认：");
	  p1.emit("Match_FoundMatch", p0.nickname, p0.avataridx, "玩家"+p0.player_id+"邀请你来一局，请确认是否开始：");
	}

	FindPairByPlayer(p) {
		var ret = null;
		for (var i=0; i<this.matched_pairs.length; i++) {
			if (this.matched_pairs[i][0] == p ||
			    this.matched_pairs[i][1] == p) {
				ret = this.matched_pairs[i];
				break;
			}
		}
		return ret;
	}

	OnPlayerCancelsMatch(p) {
	  this.match_queue.remove(p);
		this.matched_pairs.RemovePair(this.FindPairByPlayer(p));
	}

	OnPlayerConfirmsMatch(p) {
		var pair = this.FindPairByPlayer(p);
		var other = null;
		if (pair == null) {
			console.log("Error: player confirms match but is not in any pair");
			return;
		}
		if (pair[0] == p) other = pair[1]; else other = pair[0];
		if (p.match_confirmed != true) {
		  var msg = "";
		  if (other.match_confirmed != true) {
		    msg = "请等待对方玩家确认";
		  } else {
		    msg = "对方玩家也已确认";
		  }
			p.emit("Match_ConfirmMatchAck", msg);
		}
		p.match_confirmed = true;
		if (other.match_confirmed == true) {
			this.SetupGame(pair);
		} else {
			other.emit("Match_OtherPlayerConfirmed");
		}
	}
	
	OnPlayerCancelsMatch(p) {
	  var pair = this.FindPairByPlayer(p);
	  this.match_queue.remove(p);
	  if (pair != null) {
	    var other = null;
	    if (pair[0] == p) other = pair[1]; else other = pair[0];
	    other.emit('Match_OtherPlayerCancelsMatch');
	    pair[0].can_be_found = true;
	    pair[1].can_be_found = true;
	  }
	}
	
	SetupGame(pair) {
	  console.log("Should start a game now");
	  this.matched_pairs.RemovePair(pair);
	  var g = new Game(pair[0], pair[1]);
	  g_all_games.push(g);
	  g.Setup();
	}
	
	IsPlayerInMatchQueueOrMatched(p) {
	  if (p in this.match_queue) return true;
	  else if (this.FindPairByPlayer(p) != null) return true;
	  else return false;
	}
}

g_playermatcher = new PlayerMatcher();
g_all_games = [];

class Game {
  constructor(p0, p1) {
    this.players = [p0, p1]; // Player's Sockets
    this.curr_player = 1;  // 先手看自己ID=1
    this.initsp = [[], []]; // 初始时的特殊牌
    this.snapshot = null;    // 游戏状态的快照
    this.obtain_actions = [[], []];
    this.snapshots = [ null, null ];
    this.turns = [ 0, 0 ];
    console.log("Game.Ctor, Player id: "+p0.player_id + ","+p1.player_id);
    this.flag_dealone = false;
    this.flag_oppo_obtain_redeal = false;
    this.turn_num = 1;
    this.round_num = 1;
  }
  
  Setup() { // 两个玩家该gamesetup()
    this.snapshot = null;
    this.players[0].game = this;
    this.players[1].game = this;
    this.players[0].state = "setup";
    this.players[1].state = "setup";
    this.players[0].emit('Match_GameSetupDefensive');
    this.players[1].emit('Match_GameSetupOffensive');
    // Statistics
    this.turns[0] = 0;
    this.turns[1] = 0;
    this.snapshots[0] = null; // For verification
    this.snapshots[1] = null; // For verification
    this.flag_dealone = false;
    this.flag_oppo_obtain_redeal = false;
    this.turn_num = 1;
  }
  
  GetPlayerIndexBySocket(socket) {
    if (socket == this.players[0]) return 0;
    else if (socket == this.players[1]) return 1;
    else {
      console.log('Error: GetPlayerIndexBySocket returns -1; socket.player_id='
        + socket.player_id);
      if (this.players[0] != undefined)
        console.log('player0 id is ' + this.players[0].player_id);
      if (this.players[1] != undefined)
        console.log('player1 id is ' + this.players[1].player_id);
      return -1;
    }
  }
  
  OnPlayerDisconnectedOrCanceled(p) {
    var pidx = this.GetPlayerIndexBySocket(p);
    console.log('[OnPlayerDisconnectedOrCanceled] player_id='+p.player_id);
    if (pidx != -1) {
      g_all_games.remove(this);
      var other_socket = this.players[1-pidx];
      other_socket.emit('Room_PlayerDisconnected');
    }
  }
  
  // 选好了特殊牌，存于sp中
  OnPlayerSetupComplete(p, sp, snapshot) {
    var pidx = this.GetPlayerIndexBySocket(p);
    this.initsp[pidx] = sp.slice(); // Clone
    console.log('[OnPlayerFinishedSetup] player_id='+p.player_id+', specials='+sp);
    
    if ((snapshot != null) && (this.snapshot == null)) {
      this.snapshot = snapshot;
      console.log('[OnPlayerFinishedSetup] snpashot saved');
    }
    
    if (pidx != -1) {
      p.state = "setup_complete";
      var other = this.players[1 - pidx]; 
      if (other.state == "setup") {
        other.emit('Game_OtherPlayerSetupComplete');
      } else {
        console.log('[both player finished]');
        this.players[0].state = 'in_game';
        this.players[1].state = 'in_game';
        this.players[1].emit('Match_GameInitOffensive', this.initsp[0], this.snapshot);
        this.players[0].emit('Match_GameInitDefensive', this.initsp[1], this.snapshot);
        this.OnStartOfTurn();
      }
    }
  }
  
  IsTurnEndBarrierReached() {
    if (this.flag_dealone == true && this.flag_oppo_obtain_redeal == true) return true;
    else return false;
  }
  
  OnStartOfTurn() {
    console.log('-------------------------Turn ' + this.turn_num + 
      ', Round ' + this.round_num + ' ---------------');
    this.flag_dealone = false;
    this.flag_oppo_obtain_redeal = false;
    
    this.players[this.curr_player].emit('Game_SelfTurn', this.turn_num);
    this.players[1-this.curr_player].emit('Game_OpponentTurn', this.turn_num);
    
    this.turn_num += 1;
  }
  
  // Start recording action sequence &&
  // record 'controller.obtain' action (b/c it is emitted from controller.obtain)
  OnObtainStart(socket, handc_id, poolc_id) {
    console.log('[OnObtainStart] player ' + socket.player_id + ' obtained ' +
      handc_id + ' & ' + poolc_id);
    
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      this.obtain_actions[pidx].length = 0;
      this.obtain_actions[pidx].push(['controller.obtain', handc_id, poolc_id]);      
    }
  }
  
  // Record 'CopyTrickTarget' action
  OnSetCopyTrickTarget(socket, tgt_id) {
    console.log('[OnSetCopyTrickTarget] player ' + socket.player_id + ' copies ' +
      tgt_id);
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      this.obtain_actions[pidx].push(['controller.selectCopy', tgt_id]);
    }
  }
  
  // Record 'SwapTrickTarget' action
  OnSetSwapTrickTarget(socket, tgt_id) {
    console.log('[OnSetSwapTrickTarget] player ' + socket.player_id + ' swaps ' +
      tgt_id);
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      this.obtain_actions[pidx].push(['controller.selectSwap', tgt_id]);
    }
  }
  
  // Record 'UnnamedBanTrickTarget' action
  OnSetUnnamedBanTrickTarget(socket, tgt_id) {
    console.log('[OnSetUnnamedBanTrickTarget] player ' + socket.player_id + ' bans ' +
      tgt_id);
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      this.obtain_actions[pidx].push(['controller.selectBan', tgt_id]);
    }
  }
    
  OnTrickWithoutTarget(socket, trick_type) {
    console.log('[OnTrickWithoutTarget] player ' + socket.player_id + ' had a trick ' +
      'without any targets selected');
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      this.obtain_actions[pidx].push(['obtainVector.trickSelector', null]);
    }
  }
  
  // End recording action sequence && forward to the other player
  OnObtainEnd(socket, snapshot) {
    console.log('[OnObtainEnd] player ' + socket.player_id + ' obtain end');
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      var other = this.players[1 - pidx];
      
      if (g_is_verify==true && snapshot != null && snapshot != undefined) {
        this.snapshots[pidx] = snapshot;
      }
      
      other.emit('Game_OpponentObtain', this.obtain_actions[pidx]);
      this.obtain_actions[pidx].length = 0;
    }
  }
  
  OnEndTurn() {
    this.curr_player = 1 - this.curr_player;
  }
  
  OnPostObtainDealOne(socket, dealt_id) {
    console.log('[OnPostObtainDealOne] player ' + socket.player_id + ' ended turn with DealOne');
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      var other = this.players[1 - pidx];
      
      other.emit('Game_OpponentPostObtainDealOne', dealt_id);
      
      this.flag_dealone = true;
      if (this.IsTurnEndBarrierReached()) {
        this.OnEndTurn();
        this.OnStartOfTurn();
      }
    }
  }
  
  OnDiscardOne(socket, discarded_id, added_id) {
    console.log('[OnDiscardOne] player ' + socket.player_id + ' discarded ' +
      discarded_id + ' & added ' + added_id);
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      var other = this.players[1 - pidx];
      other.emit('Game_OpponentDiscardOne', discarded_id, added_id);
    }
  }
  
  OnRedeal(socket, pool_ids, repo_ids) {
    console.log('[OnRedeal] player ' + socket.player_id + ' redeals ');
    console.log('pool_ids:'); console.log(pool_ids);
    console.log('repo_ids:'); console.log(repo_ids);
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      var other = this.players[1 - pidx];
      other.emit('Game_OpponentRedeal', pool_ids, repo_ids);
      socket.emit('Game_RedealEcho', pool_ids, repo_ids);
    }
  }
  
  OnOpponentObtainRedealClear(socket) {
    console.log('[OnOpponentObtainRedealClear] player ' + socket.player_id + ' acknowledged all changes from last turn');
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      this.flag_oppo_obtain_redeal = true;
      if (this.IsTurnEndBarrierReached()) {
        this.OnEndTurn();
        this.OnStartOfTurn();
      }
    }
  }
  
  OnGameEnd(socket) {
    console.log('[OnGameEnd] player ' + socket.player_id + ' says game end');
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      var other = this.players[1 - pidx];
      other.emit('Game_OpponentGameEnd');
    }
    if (g_is_verify) {
      this.VerifySnapshots();
    }
  }
  
  OnVotePlayAgain(socket) {
    console.log('player ' + socket.player_id + ' votes to play again');
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      this.players[pidx].state = "voted_playagain";
      this.CheckRestartState();
    }
  }
  
  OnVoteNotPlayAgain(socket) {
    console.log('player ' + socket.player_id + ' votes to not play again');
    var pidx = this.GetPlayerIndexBySocket(socket);
    if (pidx != -1) {
      this.players[pidx].state = "voted_not_playagain";
      this.CheckRestartState();
    }
  }
  
  CheckRestartState() {
    var state0 = this.players[0].state,
        state1 = this.players[1].state;
    if (state0 == "voted_playagain" && state1 == "voted_playagain") {
      // Switch side & restart game
      console.log('Starting new round');
      var temp = this.players[1];
      this.players[1] = this.players[0];
      this.players[0] = temp;
      this.Setup();
      this.round_num += 1;
    } else if ((state0 == "voted_playagain" && state1 == "voted_not_playagain") ||
               (state0 == "voted_not_playagain" && state1 == "voted_not_playagain") ||
               (state0 == "voted_not_playagain" && state1 == "voted_playagain")) {
      console.log('Will not start new round, game ended.');
      this.players[0].emit('Game_GotoMainMenu');
      this.players[1].emit('Game_GotoMainMenu');
      
      // Destruct self
      // No need to push to g_all_sockets again b/c socket's not removed unless a player gets offline
      g_all_games.remove(this);
      this.players[0].game = null;
      this.players[1].game = null;
      this.players[0].can_be_found = true;
      this.players[1].can_be_found = true;
    }
  }
  
  VerifySnapshots() {
    if (this.snapshots[0] != null && this.snapshots[1] != null) {
      console.log('[VerifySnapshots], P0(id=' + this.players[0].player_id +
        ') vs P1(id=' + this.players[1].player_id);
      console.log('  Score: ' + this.snapshots[0].p0score + ' vs ' + this.snapshots[0].p1score +
        ' | ' + this.snapshots[1].p0score + ' vs ' + this.snapshots[1].p1score);
    }
  }
};

FindGameBySocket = function(socket) {
  return socket.game;
}

FindPlayerByIdOrNickname = function(socket, key) {
  ret = [ ];
  var N = g_all_sockets.length;
  for (var i=0; i<N; i++) {
    var s = g_all_sockets[i];
    if (s == socket) continue;
    else if (s == undefined) continue;
    else if (s.can_be_found == false) continue;
     
    var name_match = (s.nickname.indexOf(key) != -1) || key=="";
    var id_match = (s.player_id == key);
    if (name_match || id_match) {
      ret.push([s.player_id, s.nickname, s.avataridx]);
    }
  }
  return ret;
}

// 抓到一个新连接
io.on('connection', function(socket) {
	g_all_sockets.push(socket);
	socket.player_id = g_serial;
	socket.match_confirmed = false;
	socket.can_be_found = true; // 可否通过ID找到
	g_serial += 1;
	
	socket.emit('Info_OnlinePlayerCount', g_all_sockets.length);
	socket.emit('Info_MyPlayerId', socket.player_id);
	
	var bcast = true;
	if (bcast) socket.broadcast.emit('Info_OnlinePlayerCount', g_all_sockets.length);
	
	console.log("player " + socket.player_id + " joined, " + 
	  g_all_sockets.length + " sockets, " + g_all_games.length + " games");

	// 离线
	socket.on('disconnect', () => {
	  // 若是没开始...
		g_playermatcher.OnPlayerCancelsMatch(socket);
		g_all_sockets.remove(socket);
		// 若是已开始了...
		var g = FindGameBySocket(socket);
		if (g != undefined)
		  g.OnPlayerDisconnectedOrCanceled(socket);
		console.log("player " + socket.player_id + " left, " +
		  g_all_sockets.length + " sockets, " + g_all_games.length + " games");
	});

	socket.on('Info_PlayerInfo', (nickname, avataridx) => {
    socket.nickname = nickname;
	  socket.avataridx = avataridx;
	  console.log('Player Info: ID=' + socket.player_id + 
	    ", nickname=" + nickname +
	    ", avataridx=" + avataridx);
	});
	
	socket.on('Match_ReadyToMatch', (nickname, avataridx) => {
		g_playermatcher.OnNewPlayerReadyToMatch(socket);
		g_playermatcher.MatchOnePair();
	});
	
	socket.on('Match_CancelMatch', () => {
	  g_playermatcher.OnPlayerCancelsMatch(socket);
	});
	
	socket.on('Match_ConfirmMatch', () => {
	  g_playermatcher.OnPlayerConfirmsMatch(socket);
	});
	
	socket.on('Match_GameStartOffensiveAck', (p0c, p1c, poolc, repoc) => {
	  console.log('Player ' + socket.player_id + ' GameStartOffensiveAck');
	  var g = FindGameBySocket(socket);
	  if (g != null) g.PassInitDataToP1(socket, p0c, p1c, poolc, repoc);
	});
	
	socket.on('Info_RefreshOnlinePlayerCount', () => {
	  socket.emit('Info_OnlinePlayerCount', g_all_sockets.length);
	});
	
	socket.on('Match_FindOpponent', (key) => {
	  var ret = FindPlayerByIdOrNickname(socket, key);
	  console.log('FindOpponent [' + key + '] len='+ret.length);
	  socket.emit('Match_FindOpponentResult', ret);
	});
	
	// socket invites another player with iid
	socket.on('Match_InvitePlayer', (iid) => {
	  if (iid == socket.player_id) {
	    socket.emit('Match_InvalidInvitation', '不能邀请自己');
	  } else {
	    var ok = false;
      for (var i=0; i<g_all_sockets.length; i++) {
        var p = g_all_sockets[i];
        console.log('[Invite] checking ' + p.player_id);
        if (p.player_id == iid) {
          if (g_playermatcher.IsPlayerInMatchQueueOrMatched(p)) {
            socket.emit('Match_InvalidInvitation', '对方正在随机匹配队列中');
          } else if (FindGameBySocket(p) != null) {
            socket.emit('Match_InvalidInvitation', '对方正在游戏中');
          } else {
            // Put both players into the matching queue and match them
            g_playermatcher.BringTwoPlayersIntoPair(socket, p);
            ok = true;
            break;
          }
        }
      }
      if (ok == false) {
        socket.emit('Match_InvalidInvitation', '未找到该ID对应的玩家');
      }
    }
	});
	
	socket.on('Match_SetupComplete', (sp, snapshot) => {
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnPlayerSetupComplete(socket, sp, snapshot);
	});
	
	// The following stuff shall reflect the procedures in a turn
	// From: controller.postObtain (?)
	socket.on('Game_DealOne', (dealt_id) => {
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnPostObtainDealOne(socket, dealt_id);  
	});
	
	// From: model.discard
	socket.on('Game_DiscardOne', (discarded, added) => {
	    var g = FindGameBySocket(socket);
	  if (g != null) g.OnDiscardOne(socket, discarded, added);
	});
	
	// From: model.redeal
	socket.on('Game_Redeal', (pool_ids, repo_ids) =>{
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnRedeal(socket, pool_ids, repo_ids);
	});
	
	// From: model.obtain()
	//       Starts recording all actions in 1 turn
	socket.on('Game_ObtainStart', (handc_id, poolc_id) => {
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnObtainStart(socket, handc_id, poolc_id);
	});
	
	// From: controller.selectCopy()
	socket.on('Game_SetCopyTrickTarget', (tgt_id) => {
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnSetCopyTrickTarget(socket, tgt_id);
	});
	
	// From: controller.selectSwap()
	socket.on('Game_SetSwapTrickTarget', (tgt_id) => {
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnSetSwapTrickTarget(socket, tgt_id);
	});
	
	// From: controller.selectBan()
	socket.on('Game_SetUnnamedBanTrickTarget', (tgt_id) => {
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnSetUnnamedBanTrickTarget(socket, tgt_id);
	});
	
	// From: obtainVector.trickSelector(type)
	socket.on('Game_TrickWithoutTarget', (trick_type) => {
    var g = FindGameBySocket(socket);
    if (g != null) g.OnTrickWithoutTarget(socket, trick_type);
	});
	
	// 当ObtainEnd传去时，对方就开始播放有可能稍费时间的动画了。
	socket.on('Game_ObtainEnd', (snapshot) => {
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnObtainEnd(socket, snapshot);
	});
	
	// 一回合结束以postObtain为标志。以下两个消息都是PostObtain发出的。
	// 其会执行一次dealOne或直接宣告游戏结束。故需消息传至对方用以同步。
	socket.on('Game_PostObtain_DealOne', (dealt_id) => {
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnPostObtainDealOne(socket, dealt_id);
	});
	socket.on('Game_PostObtain_GameEnd', () => {
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnGameEnd(socket);
	});
	
	socket.on('Game_OpponentObtainRedealClear', () => {
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnOpponentObtainRedealClear(socket);
	});
	
	socket.on('Game_VotePlayAgain', () => {
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnVotePlayAgain(socket);
	});
	
	socket.on('Game_VoteNotPlayAgain', () => {
	  var g = FindGameBySocket(socket);
	  if (g != null) g.OnVoteNotPlayAgain(socket);
	});
});

http.listen(3000, function() {
	console.log("Listening on port 3000");
});
