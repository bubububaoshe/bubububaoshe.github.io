// 服务端
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// 包含游戏的Model
Model = require("./model.js");
SPManager = require("./spmanager.js");

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

g_all_sockets = [];
g_serial = 1;

class PlayerMatcher {
	constructor() {
		this.match_queue = []; // 所有连上来的玩家
		this.matched_pairs = []; // 
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
			p0.emit("Match_FoundMatch", "已找到对手，请确认：");
			p1.emit("Match_FoundMatch", "已找到对手，请确认：");
		}
	}
	
	// P0 找 P1
	BringTwoPlayersIntoPair(p0, p1) {
	  this.matched_pairs.push([p0, p1]);
	  p0.emit("Match_FoundMatch", "找到了这位小伙伴，请等待ta确认：");
	  p1.emit("Match_FoundMatch", "玩家"+p0.player_id+"邀请你来一局，请确认是否开始：");
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
    this.curr_player = 0;
    this.initsp = [[], []]; // 初始时的特殊牌
    this.snapshot = null;    // 游戏状态的快照
    console.log("Game.Ctor, Player id: "+p0.player_id + ","+p1.player_id);
  }
  
  Setup() { // 两个玩家该gamesetup()
    this.snapshot = null;
    this.players[0].game = this;
    this.players[1].game = this;
    this.players[0].state = "setup";
    this.players[1].state = "setup";
    this.players[0].emit('Match_GameSetupOffensive');
    this.players[1].emit('Match_GameSetupDefensive');
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
        this.players[0].emit('Match_GameInitOffensive', this.initsp[1], this.snapshot);
        this.players[1].emit('Match_GameInitDefensive', this.initsp[0], this.snapshot);
      }
    }
  }
};

FindGameBySocket = function(socket) {
  return socket.game;
}

// 抓到一个新连接
io.on('connection', function(socket) {
	g_all_sockets.push(socket);
	socket.player_id = g_serial;
	socket.match_confirmed = false;
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

	socket.on('Match_ReadyToMatch', () => {
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
});

http.listen(3000, function() {
	console.log("Listening on port 3000");
});