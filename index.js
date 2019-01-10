// 服务端
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// 包含游戏的Model
Model = require("./model.js");

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
			p0.emit("Match_FoundMatch");
			p1.emit("Match_FoundMatch");
		}
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
			this.StartGame(pair);
		} else {
			other.emit("Match_OtherPlayerConfirmed");
		}
	}
	
	StartGame(pair) {
	  console.log("Should start a game now");
	  this.matched_pairs.RemovePair(pair);
	  var g = new Game(pair[0], pair[1]);
	  g_all_games.push(g);
	  g.Start();
	}
}

g_playermatcher = new PlayerMatcher();
g_all_games = [];

// 现在想的就是服务端存着一个Model，两边的玩家都得以它为准
class Game {
  constructor(p0, p1) {
    this.players = [p0, p1]; // Player's Sockets
    this.model_players = []; // Player's Model representations
    this.curr_player = 0;
    console.log("Game.Ctor, Player id: "+p0.player_id + ","+p1.player_id);
  }
  
  Start() {
    // TODO: pack 1 selection (in room?)
    var pack = [1, 2];
    if (this.model != undefined) {
      this.model.reset_server();
    }
    this.model = new Model(pack[0], pack[1]);
    var m = this.model;
    {
      m.init_server();
      // Check match 1 ??
      this.model_players = [];
      this.model_players.push(m.player0);
      this.model_players.push(m.player1);
    }
    
    this.players[0].game = this;
    this.players[1].game = this;
    
    this.players[0].emit('Match_GameStart', m.player0, m.player1, m.pool, pack);
    this.players[1].emit('Match_GameStart', m.player1, m.player0, m.pool, pack);
    
    this.players[this.curr_player].emit('Game_MakeTurn');
    this.players[1-this.curr_player].emit('Game_OpponentTurn');
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
  
  OnPlayerObtain(p, handc_id, poolc_id) {
    var pidx = this.GetPlayerIndexBySocket(p);
    console.log('[OnPlayerObtain] '+handc_id+", "+poolc_id + " pidx="+pidx
      + " id="+p.player_id);
    
    if (pidx != -1) {
      var other_socket = this.players[1-pidx];
      this.model.activate_server(handc);
      
      var handc = this.model_players[pidx].hand.getChar(handc_id);
      var poolc = this.model.pool.getChar(poolc_id);
      
      //console.log('[OnPlayerObtain] handc:');
      //console.log(handc);
      //console.log('[OnPlayerObtain] poolc:');
      //console.log(poolc);
      
      this.model.obtain_server(this.model_players[pidx], handc, poolc);
      
      var deal_cid = this.model.dealOne_server();
                 p.emit('Game_DealOne', deal_cid);
      other_socket.emit('Game_DealOne', deal_cid);
      
      other_socket.emit('Game_OpponentObtainPair', handc_id, poolc_id);
      other_socket.emit('Game_MakeTurn');
      p.emit('Game_OpponentTurn');
    }
  }
  // 这里的Discard似乎在单机模式中是既可以表示自己弃牌也可以表示对方弃牌的？
  OnPlayerSeesDiscard(p, local_player_id, char_id, newchar_id) {
    var pidx = this.GetPlayerIndexBySocket(p);
    console.log('[OnPlayerSeesDiscard] char='+char_id+', newchar='+newchar_id);
    if (pidx != -1) {
      var other_socket = this.players[1-pidx];
      var this_mp = this.model_players[pidx],
          other_mp = this.model_players[1-pidx]; // mp = Model Player
      var the_mp = (local_player_id == 0) ? other_mp : this_mp;
      
      { // Server-side bookkeeping.
        var char = the_mp.hand.getChar(char_id);
        var newchar = this.model.commonRepository.getChar(newchar_id);
        this.model.discard_server(the_mp, char, newchar);
      }
      
      if (local_player_id == 1) {
        other_socket.emit('Game_OppoDiscard', char_id, newchar_id);
      } else {
        console.log('[OnPlayerSeesDiscard] Do not know how to deal with this case')
      }
    }
  }
  
  OnPlayerRedeal(p, pool_cids) {
    var pidx = this.GetPlayerIndexBySocket(p);
    console.log('[OnPlayerRedeal] pidx=' + pidx);
    if (pidx != -1) {
      
      { // Server-side bookkeeping.
        this.model.oppoRedeal_server(pool_cids);
      }
      
      var other_socket = this.players[1-pidx];
      other_socket.emit('Game_OppoRedeal', pool_cids);
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
	
	var bcast = true;
	socket.emit('Info_OnlinePlayerCount', g_all_sockets.length);
	if (bcast) socket.broadcast.emit('Info_OnlinePlayerCount', g_all_sockets.length);
	
	console.log("player " + socket.player_id + " joined, " +
	  g_all_sockets.length + " sockets, " + g_all_games.length + " games");

	// 离线
	socket.on('disconnect', () => {
		g_playermatcher.OnPlayerCancelsMatch(socket);
		g_all_sockets.remove(socket);
		var g = FindGameBySocket(socket);
	  g_all_games.remove(g);
		console.log("player " + socket.player_id + " left, " +
		  g_all_sockets.length + " sockets, " + g_all_games.length + " games");
	});

	socket.on('Match_ReadyToMatch', () => {
		g_playermatcher.OnNewPlayerReadyToMatch(socket);
		g_playermatcher.MatchOnePair();
	});
	
	socket.on('Match_ConfirmMatch', () => {
	  g_playermatcher.OnPlayerConfirmsMatch(socket);
	});
	
	socket.on('Game_ObtainPair', (handc_id, poolc_id) => {
	  var g = FindGameBySocket(socket);
	  if (g != null) {
	    g.OnPlayerObtain(socket, handc_id, poolc_id);
	  } else {
	    console.log('[Game_ObtainPair] [Error] game is null');
	  }
	});
	
	socket.on('Game_Discard', (local_player_id, char_id, newchar_id) => {
	  var g = FindGameBySocket(socket);
	  if (g != null) {
	    g.OnPlayerSeesDiscard(socket, local_player_id, char_id, newchar_id);
	  } else {
	    console.log('[Game_Discard] [Error] game is null');
	  }
	});
	
	// One player has redeal'ed, sync the redeal'ed pool to the other player
	socket.on('Game_Redeal', (pool_cids) => {
	  var g = FindGameBySocket(socket);
	  if (g != null) {
	    g.OnPlayerRedeal(socket, pool_cids);
	  } else {
	    console.log('[Game_Redeal] [Error] game is null');
	  }
	});
	
	socket.on('Game_StartNewRound', () => {
	  var g = FindGameBySocket(socket);
	  if (g != null) {
	    g.Start();
	  } else {
	    console.log('[Game_StartNewRound] [Error] game is null');
	  } 
	});
	
	socket.on('Info_RefreshOnlinePlayerCount', () => {
	  socket.emit('Info_OnlinePlayerCount', g_all_sockets.length);
	});
});

http.listen(3000, function() {
	console.log("Listening on port 3000");
});