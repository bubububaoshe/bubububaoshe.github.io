// 选取头像的面板
PopulateAvatarChoicePanel(document.getElementById('avatar_choices'));
avatar = new Avatar(0, 'url("avatars/avatar1.png")');
avatar.LoadFromCookie();
UpdateAvatarPreview();

{
  var h = window.location.href;
  console.log('window.location.href = ' + h);
  if (h.indexOf('http://localhost/') == 0) {
    document.getElementById('serverselect').style.display="block";
    document.getElementById('servername1').disabled = null;
    document.getElementById('servername1').click();
  } else if (h.indexOf('http://edgeofmap.com') == 0) {
    g_resource_prefix = "https://quadpixels.github.io/";
  }
}

// New variables for multiplayer mode
var socket = null;
var is_my_move = false;
var g_my_player_id = -999;
var is_multiplayer = false;
var versus_rank = -999; // 1:先手选取特殊牌／发牌 0:后手
var remoteObtainActions = null;

var g_game_id = -999; // 所连上的游戏ID
var g_nicknames = ['', ''];
var g_avataridxes = [0, 0];

// Test
var is_verify_per_round = false;
var combo_notify_method = 1; // 1: 双方都显示全屏大通知
                             // 2: 发起方显示大通知，接收方显示小通知

// 这个Barrier用来同步所有的选择特殊牌的目标的动作，免得还没记下选项就送出去了：
//                                         | Barrier
//                                         |
//      _-----selectCopy()---Thread 2----> |
//     /                                   |
// obtain ------------Thread 1-----------> | ----> 送出
//
var turnActionCount = 0;
function IncrementActionBarrier() {
  turnActionCount += 1;
  if (turnActionCount == 1)
    console.log('>>> 行动开始 barrier=1');
}
function DecrementActionBarrier() {
  if (is_multiplayer != true) return;
  turnActionCount -= 1;
  if (turnActionCount == 0) {
    console.log('<<< 行动完了 barrier=0');
    if (is_verify_per_round == true) {
      socket.emit('Game_ObtainEnd', model.getSnapshot());
    }
    else {
      socket.emit('Game_ObtainEnd');
    }
  }
}

// 按键事件
document.getElementById("refresh_lobbystatus").addEventListener("click", function() {
  socket.emit('Info_RefreshOnlinePlayerCount');
});
document.getElementById("cancel_match").addEventListener("click", function(){
  socket.emit('Match_CancelMatch');
  lobbystatus.textContent = "你取消了匹配";
  document.getElementById("start_match").style.display = "inline-block";
  document.getElementById("confirm_match").style.display = "none";
  document.getElementById("cancel_match").style.display = "none";
  document.getElementById('find_opponent').style.display = 'block';
  HideOpponentAvatarPreview();
});
//document.getElementById("multiplayertype1").addEventListener("click", function(){
//  SetMultiplayerMode(1);
//});
//document.getElementById("multiplayertype2").addEventListener("click", function(){
//  SetMultiplayerMode(2);
//});

function SetGameMode(m) {
  var x1 = document.getElementById('comfirmSetting');
  var x3 = document.getElementById('aiinput');
  var x4 = document.getElementById('spinput');
  var x6 = document.getElementById('multiplayerinfo');
  var x7 = document.getElementById('serverselect');
  var x8 = document.getElementById('reconfig_caption');
  if (m == 1) { // 单人模式
    x1.style.display = 'block';
    x3.style.display = 'block';
    x4.style.display = 'block';
    x6.style.display = 'none';
    x7.style.display = 'none';
    is_multiplayer = false;
    // 显示“重新设置”
    x8.textContent = '重新设置';
  } else { // 对战模式
    x1.style.display = 'none';
    x3.style.display = 'none';
    x4.style.display = 'none';
    x6.style.display = 'block';
    x7.style.display = 'block';
    is_multiplayer = true;
    x8.textContent = '重新设置';
  }
}
function SetMultiplayerMode(m) {
  ShowMultiplayerStep2();
}

// 多人的Step1:选择是邀请指定玩家还是随机寻找对手

// 多人的Step2：如果是邀请 就需要输入对方ID
//            如果是随机 就要按一下”随机寻找对手“
function ShowMultiplayerStep2() {
  //document.getElementById("room_buttons").style.display = "none";
  document.getElementById("match_buttons").style.display = "block";
}

function HideMultiplayerStep2() {
  //document.getElementById("room_buttons").style.display = "none";
}

function ShowMultiplayerStep3() {
  document.getElementById('match_buttons').style.display = "block";
}

function HideMultiplayerStep3() {
  document.getElementById('match_buttons').style.display = "none";
}

// 开始匹配或开始等人时就不能改设置了
function FixMultiplayerRoomSettings() {
  document.getElementById('prestriction1').disabled = true;
  document.getElementById('prestriction2').disabled = true;
}
function UnfixMultiplayerRoomSettings() {
  document.getElementById('prestriction1').disabled = false;
  document.getElementById('prestriction2').disabled = false;
}

// 从【似乎没有连上】来此
function ReShowConnect() {
  document.getElementById('serverselect').style.display = 'block';
  document.getElementById('connect_to_server').style.display = 'block';
  document.getElementById('reconnect').style.display = 'none';
  lobbystatus.textContent = '';
}

// 邀请指定玩家
// 如果邀请成功就当作匹配成功来处理...
document.getElementById("invitebutton").addEventListener("click", function(){
  var key = document.getElementById("invitedid").value;
  //console.log('Invite ' + invited_id);
  //socket.emit('Match_InvitePlayer', invited_id);
  console.log('FindOpponent ' + key);
  socket.emit('Match_FindOpponent', key);
});

// 开始匹配
document.getElementById("start_match").addEventListener("click", function() {
  document.getElementById('find_opponent').style.display = 'none';
  socket.emit('Match_ReadyToMatch', avatar.idx);
});
document.getElementById("confirm_match").addEventListener("click", function() {
  socket.emit('Match_ConfirmMatch');
});
// 来自服务器的消息
var lobbystatus = document.getElementById("lobbystatus");
// Cross domain

function DisableConnectButton() {
  var x = document.getElementById('connect_to_server');
}

function ConnectToServer(is_reconnect = false) {
  if (is_reconnect == false) {
    document.getElementById('vs_ai').disabled="disabled";
    document.getElementById('avatar_nickname_hint').innerHTML = "<br/><br/>";
    lobbystatus.textContent = '连线中・・・';
    if (socket != null && socket.connected == true) {
      lobbystatus.textContent = '已经连线啦。不用再连啦。';
      return;
    }

    { // Hide UI elements
      var ids = ['serverselect', 'connect_to_server'];
      for (var i=0; i<ids.length; i++)
        document.getElementById(ids[i]).style.display = 'none';
    }

    delayedFunc(function() {
      if (socket.connected == false) {
        lobbystatus.textContent = '似乎没有连上...'
        document.getElementById('reconnect').style.display = 'block';
        document.getElementById('vs_ai').disabled = null;
        document.getElementById('avatar_nickname_hint').opacity = 1;
      }
    }, 10);
  }

  var s = 'localhost:3000';
  if (document.getElementById('servername2').checked == true) s = '47.75.12.130:3000';
  console.log('server:' + s);
  socket = io(s);
  console.log(socket);

  // Set callbacks
  socket.on('Info_OnlinePlayerCount', function(n) {
    lobbystatus.innerHTML = "当前人数："+n;
  });

  socket.on('Info_MyPlayerId', function(pid) {
    g_my_player_id = pid;
    document.getElementById('myplayerid').textContent = '临时ID: ' + pid;
    // Respond = my avatar idx & nickname
    g_nicknames[1] = avatar.GetNickname(); // TODO: 把上次的nickname也恢复了
    g_avataridxes[1] = avatar.idx;
    socket.emit('Info_PlayerInfo', avatar.GetNickname(), avatar.idx);
  });

  socket.on('Match_ReadyToMatchAck', function() {
    document.getElementById("start_match").style.display = "none";
    document.getElementById("confirm_match").style.display = "none";
    document.getElementById("cancel_match").style.display = "inline-block";
    lobbystatus.innerHTML = "正在寻找同伴中";
  });

  // o: [ID, Nickname, AvatarIdx]
  socket.on('Match_FindOpponentResult', function(o) {
    console.log('FindOpponentResult:');
    console.log(o);
    PopulateFoundOpponentList(o);
  });

  socket.on('Match_FoundMatch', function(oppo_nickname, oppo_avataridx, reason) {
    // 邀请模式下，如果找到了被邀请的人，也走这里
    HideMultiplayerStep2();
    ShowMultiplayerStep3();
    document.getElementById('find_opponent').style.display='none';
    document.getElementById("start_match").style.display = "none";
    document.getElementById("confirm_match").style.display = "inline-block";
    document.getElementById("cancel_match").style.display = "inline-block";
    lobbystatus.innerHTML = reason;
    CloseOpponentFinderMenu();
    ShowOpponentAvatarPreview(oppo_nickname, oppo_avataridx);
    g_nicknames[0] = oppo_nickname;
    g_avataridxes[0] = oppo_avataridx;
  });

  socket.on('Match_ConfirmMatchAck', function(msg) {
    lobbystatus.innerHTML = msg;
  });

  socket.on('Match_OtherPlayerConfirmed', function() {
    lobbystatus.innerHTML = "对方玩家已确认";
  });

  var AUTOTEST = true;
  socket.on('Room_PlayerDisconnected', () => {
    console.log('对方玩家已离线');
    ShowGenericDialog('游戏状态改变','对方玩家已离线，只有双方都再连线时游戏才会继续')
  });

  socket.on('Room_PlayerReconnected', () => {
    HideGenericDialog();
  });

  socket.on('Match_OtherPlayerCancelsMatch', () => {
    HideMultiplayerStep3();
    ShowMultiplayerStep2();
    document.getElementById('lobbystatus').textContent = '对方取消了匹配';
    document.getElementById("start_match").style.display = "inline-block";
    document.getElementById("confirm_match").style.display = "none";
    document.getElementById("cancel_match").style.display = "none";
    document.getElementById('find_opponent').style.display = 'block';
    HideOpponentAvatarPreview();
  });

  socket.on('Match_InvalidInvitation', (reason) => {
    lobbystatus.textContent = reason;
    console.log('邀请不成功' + reason);
  });

  // sp evts
  socket.on('Match_GameSetupOffensive', () => { // 先手开局
    console.log('[先手选取特殊牌]');
    versus_rank = 1;
    setup();
    controller.configure();
    ShowVotePlayAgainForNewRound(true);
  });

  socket.on('Match_GameSetupDefensive', (p0c, p1c, poolc, repoc) => { // 后手开局
    console.log('[后手选取特殊牌]');
    versus_rank = 0;
    setup();
    controller.configure();
    ShowVotePlayAgainForNewRound(true);
  });

  socket.on('Match_GameInitOffensive', (other_sp, snapshot, game_id) => {
    console.log('[先手开局] other_sp='+other_sp);
    HideWaitMessage();
    messenger.hideFinalNotice(); // If from restart
    OtherPlayerSpecialCardFixup(other_sp);
    model.player1.SpecialFixup();

    g_game_id = game_id;
    SaveGameIDAndRankToCookie();
    PopulateAndShowAvatarBoxes();
  });

  socket.on('Match_GameInitDefensive', (other_sp, snapshot, game_id) => {
    console.log('[后手开局], other_sp=' + other_sp);
    HideWaitMessage();
    messenger.hideFinalNotice(); // if from restart

    //       p0sp中的0表示后手          后一个1表示自己
    snapshot.p0sp = model.player1.specialIDs;
    console.log(snapshot)

    // 后手也要fixup，因为只有过了barrier，两边才都知道对方和自己的特殊牌。
    controller.gamestartDefensive(snapshot);
    OtherPlayerSpecialCardFixup(other_sp);
    model.player1.SpecialFixup();

    g_game_id = game_id;
    SaveGameIDAndRankToCookie();
    PopulateAndShowAvatarBoxes();
  });

  socket.on('Game_SelfTurn', (turn_idx) => {
    is_my_move = true;
    var delay = 0;
    // 2 turns = 1回合
    delayedFunc(function() {
      messenger.note('[第'+Math.floor((turn_idx+1)/2)+'回合]该你出牌了');
    }, delay);
    model.checkMatch1(); // 压力测试时发现似乎要加一下这个？头有点晕 @_@
    view.unblockGame();
    console.log('>>> 我方行动');
  });

  // barrier: 这个要等待对方的动作都播放完成
  socket.on('Game_OpponentTurn', (turn_idx) => {
    view.blockGame();
    is_my_move = false;

    var delay = 0;
    delayedFunc(function() {
      messenger.note('[第'+Math.floor((turn_idx+1)/2)+'回合]对方出牌');
    }, delay);

    console.log('>>> 对方行动');
  });


  // Will replay a whole sequce of actions
  socket.on('Game_OpponentObtain', (obtain_actions) => {
    console.log('对方obtain有 ' + obtain_actions.length + ' 个动作');
    remoteObtainActions = obtain_actions;
    // 如果延迟执行opponentObtain中的redeal()，那么“播放对方动作”
    // 的事件将由OpponentObtain触发。

    var obtain_ids = GetNextObtainAction(obtain_actions);
    controller.opponentObtain(obtain_ids[0], obtain_ids[1]);
  });

  socket.on('Game_OpponentDiscardOne', (discarded_id, added_id) => {
    console.log('OpponentDiscardOne ' + discarded_id + ", " + added_id);
    model.opponentDiscard(discarded_id, added_id);
  });

  socket.on('Game_OpponentRedeal', (pool_ids, repo_ids) => {
    model.redeal(pool_ids, repo_ids);
  });

  socket.on('Game_RedealEcho', (pool_ids, repo_ids) => {
    model.redeal(pool_ids, repo_ids);
  });

  socket.on('Game_OpponentPostObtainDealOne', (dealt_id) => {
    console.log("[Opponent's postObtain DealOne] " + dealt_id);
    model.dealOne(model.player0, dealt_id);
  });

  socket.on('Game_OpponentGameEnd', () => {
    messenger.notifyFinal();
  });

  socket.on('connect', () => {
    document.getElementById('reconnect').style.display = 'none';
    document.getElementById('multiplayerButtons').style.display = 'block';
  });

  socket.on('disconnect', () => {
    ShowWaitMessage('啊！你好像离线了。请刷新页面并重新连接来恢复目前的游戏。');
  });

  socket.on('Game_GotoMainMenu', () => {
    document.getElementById('vote_playagain_msg').textContent = '因为大家没有都选继续，所以就返回主界面啦。';
    delayedFunc(function() {
      GotoMainMenu();
      ShowVotePlayAgainForNewRound(false)
    }, 7);
  });

  socket.on('Game_RestoreGameState', (game_id, snapshot, action_seq) => {
    console.log('[RestoreGameState] game_id='+game_id);
    console.log(snapshot);
    ShowGenericDialog('正在恢复游戏状态', '恢复完后才可继续操作');
    ApplySnapshot(snapshot);
    ApplyActionSequence(action_seq);
    // TODO: 把对方的头像与名字恢复一下
  });

  // Last game restore
  socket.on('Game_SnapshotExists', () => {
    ShowRestoreSnapshotDialog();
  });

  LoadGameIDAndRankFromCookie();
  socket.emit('Game_QuerySnapshotExists', g_game_id, versus_rank);

} // End ConnectToServer

function ShowContinueDialog() {
  document.getElementById('avatarselection_blocker').style.display='block';
  ShowVotePlayAgainButtons(true);
  document.getElementById('continuedialog').style.display = 'block';
  delayedFunc(function() {
    document.getElementById('continuedialog').style.height = '17vw';
  }, 0.1);
}

function ShowVotePlayAgainButtons(is_shown) {
  var ids = [ 'vote_play_again', 'vote_not_play_again' ];
  for (var i=0; i<2; i++) {
    if (is_shown == true) {
      document.getElementById(ids[i]).style.display = "block";
    } else {
      document.getElementById(ids[i]).style.display = "none";
    }
  }
}

function ShowVotePlayAgainForNewRound(is_new_round) {
  if (is_new_round == true) {
    document.getElementById('vote_playagain_msg').textContent = '嗯新开一局就这么决定啦！';
  } else {
    document.getElementById('vote_playagain_msg').textContent = '（：';
  }
  ShowVotePlayAgainButtons(false);
  delayedFunc(function() {
    document.getElementById('continuedialog').style.height = '0';
    document.getElementById('vote_playagain_msg').textContent = '';
  }, 4);

  delayedFunc(function() {
    document.getElementById('continuedialog').style.display = 'none';
    document.getElementById('avatarselection_blocker').style.display='none';
    ShowVotePlayAgainButtons(true);
  }, 4.8);
}

function VotePlayAgain() {
  if (is_multiplayer == true) {
    model.init(); // 在重新开始之前总是要init()一下的
    ShowVotePlayAgainButtons(false);
    document.getElementById('vote_playagain_msg').textContent = '正在等待另一名玩家的决定...';
    socket.emit('Game_VotePlayAgain');
  } else {
    console.log('Restart new round ...');
    ShowVotePlayAgainForNewRound(true);
    gamesetup(false);
  }
}

function VoteNotPlayAgain() {
  if (is_multiplayer == true) {
    ShowVotePlayAgainButtons(false);
    document.getElementById('vote_playagain_msg').textContent = '正在等待另一名玩家的决定...';
    model.init(); // 在重新开始之前总是要init()一下的
    socket.emit('Game_VoteNotPlayAgain');
  }
}

function GotoMainMenu() {
  showOpacity(document.getElementById('main'), false);
  showOpacity(document.getElementById('spselection'), false);
  showOpacity(document.getElementById('configurator'), true);
}

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// StressTesting
async function ScanMyHand() {
  console.log("ScanMyHand()");
  var cc = model.player1.hand.characters;
  var h_cand = undefined, p_cand = undefined, h_cand_idx = -999;
  var done = false;
  if (!is_my_move) return;

  for (var i=0; i<cc.length; i++) {
    var c = cc[i];
    if (c.card.card.classList.contains("glow")) {
      c.card.card.click();
      await sleep(233);
    }
  }

  for (var i=0; i<cc.length; i++) {
    var c = cc[i];

    if (!is_my_move) return;
    await sleep(233);
    c.card.card.click();
    await sleep(233);
    var pc = model.pool.characters;
    for (var j=0; j<pc.length; j++) {
      if (pc[j].card.card.classList.contains("glow")) {
        if (h_cand == undefined) {
          h_cand = c;
          p_cand = pc[j];
          if (!is_my_move) return;
          await sleep(233);
          p_cand.card.card.click();
          done = true;
          break;
        }
      }
    }
    if(done) {
      break;
    } else {
      if (c.card.card.classList.contains("glow")) {
        c.card.card.click();
      }
      await sleep(233);
    }
  }

  console.log(h_cand)
  console.log(p_cand)

  if (done) {
  } else if(false) { // 置换？

    if (h_cand != undefined && p_cand != undefined) {
      h_cand.card.card.click();
      p_cand.card.card.click();
      await sleep(700);
    } else {

      var card1 = model.player1.hand.characters[0];
      await sleep(300);
      card1.card.card.click();
      await sleep(300);
    }
  }
}
var is_autotesting = false;
async function autotest() {
  if (is_autotesting) return;
  else is_autotesting = true;
  if (document.getElementById('finalcontainer').style.display == "block")
    await sleep(2666); // 等游戏结束通知消失
  while (true) {
    await sleep(1000);
    if (is_my_move) {
      if (document.getElementsByClassName('tableinfocontainer')[1].style.display == "block") {
        await sleep(200);
        model.player1.table.characters[0].card.card.click();
        await sleep(200);
      }
      if (document.getElementById('combobanner').style.display == "block") {
        await sleep(100);
        continue;
      } else if (document.getElementById('finalcontainer').style.display == "block") {
        await sleep(2666); // 等游戏结束通知消失
        document.getElementById('finalcontainer').click();
      } else {
        await sleep(300);
        await ScanMyHand();
      }
    }
  }
}

var AutoStartAutoTest = false;
async function autostart() {
  while (true) {
    await sleep(1000);
    var x = document.getElementById('start_match');
    if (x.style.visibility == '') {
      x.click();
      console.log("Start clicked");
      while (true) {
        await sleep(1000);
        var y = document.getElementById('confirm_match');
        if (y.style.display != 'none') {
          y.click();
          console.log("Confirm clicked");
          return;
        }
      }
    }
  }
}

if (AutoStartAutoTest) {
  autostart();
}

// 默认打开多人模式
document.getElementById('vs_player').click();
function OtherPlayerSpecialCardFixup(other_sp) {
  model.player0.specials.init(other_sp);
  model.player0.SpecialFixup();
}

// Action sequence from last turn
// returns null if the buffer hath underfloweth
function GetNextObtainAction() {
  var ret = null;
  if (remoteObtainActions == null) return null;
  if (remoteObtainActions.length < 1) ret = null;
  var a = remoteObtainActions[0];
  console.log('remoteObtainActions=');
  {
    for (var i=0; i<remoteObtainActions.length; i++) {
      console.log(remoteObtainActions[i]);
    }
  }
  if (a == undefined) {
    console.log("BIGERROR!");
  }
  remoteObtainActions.splice(0, 1);
  var titel = '[replay] [' + remoteObtainActions.length + ' left] ';
  if (a[0] == "controller.obtain") {
    console.log(titel + 'controller.obtain ' + a[1] + ", " + a[2]);
    ret = [a[1], a[2]];
  } else if (a[0] == "controller.selectCopy" ||
             a[0] == "controller.selectSwap" ||
             a[0] == "controller.selectBan") {
    console.log(titel + a[0] + ' ' + a[1]);
    ret = a[1];
  } else if (a[0] == "obtainVector.trickSelector") {
    console.log(titel + " null ");
    ret = a[1];
  } else if (a[0] == "controller.postObtain") {
    var dealt_id = a[1];
    console.log("[Opponent's postObtain] " + dealt_id);
    model.dealOne(model.player0, dealt_id);
    ret = '';
  }
  if (remoteObtainActions.length <= 0 && is_my_move) {
    console.log('<<< 对方行动完了');
    view.unblockGame(); // 对方的动画未播放完亦即还没最后deal之前我方不能行动
  }
  return ret;
}
function PeekNextObtainActionType() {
  if (remoteObtainActions.length < 1) return null;
  else return remoteObtainActions[0][0];
}

// AUTO TEST START
//AUTOTEST_autostartmatch();
var autotest_round = 1;
var oppo_combo_notifications = 0;

// ======================= AUTO TEST ==============================
async function AUTOTEST_autostartmatch() {
  var done = false;
  while (done == false) {
    if (socket != undefined && socket.connected == true) {
      done = true; break;
    }
    await sleep(1000);
    // 连接localhost
    document.getElementById('servername1').click();
    await sleep(333);
    document.getElementById('connect_to_server').click();
  }

  done = false;
  while (done == false) {
    await sleep(1000);
    console.log('..');
    var x = document.getElementById('start_match');
    if (x.style.visibility == '') {
      x.click(); // 开始匹配
      console.log('[AUTOTEST] started matching process');
      while (done == false) {
        await sleep(1000);
        var y = document.getElementById('confirm_match');
        if (y.style.display != 'none') {
          y.click();
          console.log('[AUTOTEST] confirmed match');
          AUTOTEST_selectspecial();
          done = true;
        }
      }
    }
  }
}

async function AUTOTEST_selectspecial() {
  console.log('[AUTOTEST] round #' + autotest_round);
  console.log('[AUTOTEST] select special cards');
  var x = document.getElementById('gamestart');
  // Make some choices
  await sleep(1000)
  x.click();
  if (autotest_round == 1)
    document.getElementById('finalcontainer').click();
  delayedFunc(function() {
    AUTOTEST_maingame();
  }, 5);
}

function IsSelectionPanelPresent() {
  var x = document.getElementsByClassName('tableinfocontainer')[0];
  if (x.style.visibility == "visible") return true;
  else return false;
}

function IsInfoBannerPresent() {
  var x = document.getElementById('infobanner');
  if (x.style.visibility == "visible") return true;
  else return false;
}

function IsFinalNoticePresent() {
  if (document.getElementById('finalcontainer').style.visibility == "visible")
    return true;
  else return false;
}

function IsGameBlocked() {
  return (document.getElementById("blocker").style.visibility == "visible") ?
    true : false;
}

async function AUTOTEST_maingame() {
  var state = "in_game";
  while (true) {
    if (is_my_move != true &&
      (IsFinalNoticePresent() == false)) {
      await sleep(1000);
      continue;
    } else if (IsInfoBannerPresent() == true) {
      document.getElementById('infobanner').click();
      await sleep(1000);
      continue;
    } else if (IsGameBlocked() == true && (IsFinalNoticePresent() == false)) {
      await sleep(1000);
      continue;
    } else if (IsSelectionPanelPresent() == true) {
      var s = document.getElementsByClassName('tableinfocontainer')[0];
      var cands = s.children[1].children;
      cands[0].click();

      await sleep(1000);
      continue;
    } else if (IsFinalNoticePresent() == true) {
      var d = 20;

      autotest_round += 1;
      console.log('[AUTOTEST] 第' + autotest_round + '局');
      while (IsInfoBannerPresent() == true) {
        await sleep(1000);
      }
      await sleep(3999);

      var x1 = document.getElementById('vote_play_again'),
          x2 = document.getElementById('finalcontainer');
      if (document.getElementById('vote_play_again').style.display == 'block') {
        x1.click();
      } else {
        console.log('[AUTOTEST] Clicked final container');
        x2.click();
        continue;
      }

      while (document.getElementById('spselection').style.opacity == 0) {
        await sleep(1000);
      }
      console.log('[AUTOTEST] Clicked game start');
      document.getElementById('gamestart').click();
      await sleep(5000);

    } else {

      // 不能在对方的动画还没显示完的时候就点牌，不然会导致数据破损
      // 除非允许一方的点击能够打断另一方正在播放的提示信息
      if (oppo_combo_notifications > 0) {
        console.log('[AUTOTEST] 等对方的动画播完=' + oppo_combo_notifications);
        oppo_combo_notifications -= 1;
        await sleep(500);
        continue;
      }

      await sleep(2333); // 自动测试时这个如果设太短就会按得太急，会boom的
      // If game ended then break

      var mychars = model.player1.hand.characters;
      var handc = null, poolc = null;
      var activated = false;
      for (var i=0; i<mychars.length; i++) {
        model.activate(mychars[i]);
        await sleep(400);
        var p = model.pool.characters;
        for (var j=0; j<p.length; j++) {
          if (p[j].card.card.classList.contains('glow')) {
            poolc = p[j];
            handc = mychars[i];
            activated = true;

            await sleep(200);
            model.activate(mychars[i]); // Deactivate
            await sleep(200);
            mychars[i].card.card.click();
            await sleep(200);
            poolc.card.card.click();
            break;
          }
        }
        if (activated == true) break;
      }
      if (activated == false) { // 可能是只有一张牌且无法打出的情况，点击之
        if (model.player1.hand.characters[0] != undefined)
          model.player1.hand.characters[0].card.card.click();
        await sleep(1000);
      }
      // do we need to select target ?
      await sleep(1000);
    }
    // obtain
  }
}

function ShowWaitMessage(msg = "请等待另一名玩家选择完特殊牌") {
  var ids = ['avatarselection_blocker', 'offensive_wait_msg'];
  for (var i=0; i<ids.length; i++)
    document.getElementById(ids[i]).style.display = 'block';
  document.getElementById('wait_msg_content').textContent = msg;
}

function HideWaitMessage() {
  document.getElementById('avatarselection_blocker').style.display='none';
  document.getElementById('offensive_wait_msg').style.display='none';
}

function SaveGameIDAndRankToCookie() {
  setCookie('last_game_id', g_game_id);
  setCookie('last_game_rank', versus_rank);
  console.log('[versus] Saved game ID=' + g_game_id + ' and rank=' + versus_rank + ' to cookie');
}

function LoadGameIDAndRankFromCookie() {
  var gid = getCookie('last_game_id');
  if (gid.length == 0) { }
  else {
    g_game_id = parseInt(gid[0]);
    console.log('[Loaded Game ID from cookie] last_game_id=' + g_game_id);
  }
  var rk  = getCookie('last_game_rank');
  if (rk.length == 0) { }
  else {
    versus_rank = parseInt(rk[0]);
    console.log('[Loaded Versus Rank from cookie] versus_rank=' + versus_rank);
  }
}

function RestoreGameStateFromStartMenu() {
  model.pack = [1,2]; // TODO: 如果以后有新的pack
  showPage('main');
  socket.emit('Game_RequestSnapshot', g_game_id, versus_rank);
  view.hand1.addController('controller.activate');
}

function TEST_STRESSTEST() {
  for (var i=0; i<15; i++)
    model.redeal();
}

function TEST_GETSNAPSHOT() {
  model.pack = [1,2];
  socket.emit('Game_RequestSnapshot', g_game_id, versus_rank);
}

// FOR REPLAYING
function ApplySnapshot(snapshot) {
  // APPLY SNAPSHOT
  TearDownExistingViews();
  model.player1.clear();
  model.player0.clear();
  model.commonRepository.clear();
  model.pool.clear();
  model.commonRepository.init(model.pack);
  model.player1.specialIDs = snapshot.p1sp.slice();
  model.player1.init(snapshot.p1h);
  model.player0.specialIDs = snapshot.p0sp.slice();
  model.player0.init(snapshot.p0h);
  model.pool.init(-999, model.commonRepository, null, snapshot.pool);
}

// FOR REPLAYING
// 这里应该体现了这个游戏最最基本的循环过程罢。
function ApplyActionSequence(seq) {
  var players = [ model.player0,       model.player1 ];
  var hands   = [ model.player0.hand,  model.player1.hand ];
  var tables  = [ model.player0.table, model.player1.table ];
  var specials= [ model.player0.specials, model.player1.specials ];

  if (seq.length < 1) {
    document.body.classList.remove('notransition');
    delayedFunc(function() {
      document.querySelector("#score0 div").textContent = model.player0.score;
      document.querySelector("#score1 div").textContent = model.player1.score;
      if ((socket != null) && (socket.connected == true)) {
        socket.emit('Game_SnapshotRestored');
      }
      HideGenericDialog();
      view.hand1.addController(controller.activate);
    }, 1);
    return;
  }
  else {
    document.body.classList.add('notransition');
  }

  var a = seq[0];
  var side = ['对方','己方'];
  console.log('Action: ' + side[a[0]] + '(' + a +  ')' + ' SC0:' + model.player0.score + ', SC1:' +
      model.player1.score);


  seq = seq.slice(1);
  var pid = a[0], action = a[1];
  var oppopid = 1 - pid;
  var sp = specials[pid];

  if (action == 'Obtain') {
    var orig_hc = hands[pid].getChar(a[2][0]),
        orig_pc = model.pool.getChar(a[2][1]);
    var hc = orig_hc.getSpecial(sp),
        pc = orig_pc.getSpecial(sp);
    hands[pid].removeChar(orig_hc); // replicate the behavior of controller.obtain
    model.pool.removeChar(orig_pc);
    obtainVector.init(players[pid], hc, pc);
  } else if (action == 'SwapTrick') {
    obtainVector.getNextTrick('SwapTrick');
    obtainVector.setTrickTarget('SwapTrick', tables[oppopid].getChar(a[2]));
  } else if (action == 'ObtainEnd') {
    model.obtain(true);
  } else if (action == 'PostObtainDealOne') {
    model.dealOne(players[pid], a[2]);
  } else if (action == 'Redeal') {
    model.redeal(a[2][0], a[2][1]);
  } else if (action == 'DiscardOne') {
    if (pid == 1) model.discardForReplay(a[2][0], a[2][1]);
    else model.opponentDiscard(a[2][0], a[2][1]);
  }

  delayedFunc(function() {
    ApplyActionSequence(seq);
  }, 0.1);
}

// SIMULATE
function TEST_RESTORESNAPSHOT(rank = 1) {
  var p1h =  [ 'xl1', 'ws2', 'qysnp1', 'hllp1', 'gjhy1', 'lc2', 'yq2', 'ywy2a', 'xyz2a', 'xy2a' ];
  var p0h =  [ 'jsh2', 'thg1', 'ly1', 'bcg2', 'jql2', 'zm2', 'wry2', 'ths2', 'fls1', 'sx2' ];
  var p1sp = [ 'blts1b', 'fqx1a', 'hy1a', 'ly1a', 'oysg1a', 'hy2a', 'sx2a', 'sy2a', 'wry2b', 'xy2a', 'xyz2a', 'ywy2a' ];
  var p0sp = [  ];
  var pool = [ 'fl1', 'yd1', 'qc1', 'hy2', 'xf1', 'jt1', 'ys1', 'ar2' ];

  var hands = [ p0h,  p1h  ];
  var sps   = [ p0sp, p1sp ];

  var snapshot = {
    'p1h': hands[rank],
    'p0h': hands[1-rank],
    'p1sp': sps[rank],
    'p0sp': sps[1-rank],
    'pool': pool,
  };
  ApplySnapshot(snapshot);

  var action_seq = [
    [ 1, 'Obtain', [ 'xy2a', 'jt1' ] ],
    [ 1, 'ObtainEnd' ],
    [ 1, 'PostObtainDealOne', 'blts1' ],
    [ 0, 'Obtain', [ 'jsh2', 'fl1' ] ],
    [ 0, 'ObtainEnd' ],
    [ 0, 'PostObtainDealOne', 'pl1' ],
    [ 1, 'Obtain', [ 'yq2', 'pl1' ] ],
    [ 1, 'ObtainEnd' ],
    [ 1, 'PostObtainDealOne', 'ttzq2' ],
    [ 0, 'Obtain', [ 'thg1', 'qc1' ] ],
    [ 0, 'ObtainEnd' ],
    [ 0, 'PostObtainDealOne', 'bsd1' ],
    [ 1, 'Obtain', [ 'qysnp1', 'xf1' ] ],
    [ 1, 'ObtainEnd' ],
    [ 1, 'PostObtainDealOne', 'qy1' ],
    [ 0, 'Obtain', [ 'wry2', 'ttzq2' ] ],
    [ 0, 'ObtainEnd' ],
    [ 0, 'PostObtainDealOne', 'al1' ],
    [ 1, 'Obtain', [ 'ywy2a', 'qy1' ] ],
    [ 1, 'TrickWithoutTarget' ],
    [ 1, 'ObtainEnd' ],
    [ 1, 'PostObtainDealOne', 'fqx1' ],
    [ 0, 'Obtain', [ 'ly1', 'hy2' ] ],
    [ 0, 'ObtainEnd' ],
    [ 0, 'PostObtainDealOne', 'tyc1' ],
    [ 1, 'Obtain', [ 'xyz2a', 'bsd1' ] ],
    [ 1, 'ObtainEnd' ],
    [ 1, 'PostObtainDealOne', 'gjfj1' ],
    [ 0, 'Obtain', [ 'bcg2', 'tyc1' ] ],
    [ 0, 'ObtainEnd' ],
    [ 0, 'PostObtainDealOne', 'ca2' ],
    [ 1, 'Obtain', [ 'lc2', 'fqx1' ] ],
    [ 1, 'ObtainEnd' ],
    [ 1, 'PostObtainDealOne', 'oysg1' ],
    [ 0, 'Obtain', [ 'zm2', 'ar2' ] ],
    [ 0, 'ObtainEnd' ],
    [ 0, 'PostObtainDealOne', 'qhzr2' ],
    [ 1, 'Obtain', [ 'gjhy1', 'gjfj1' ] ],
    [ 1, 'ObtainEnd' ],
    [ 1, 'PostObtainDealOne', 'zrl1' ],
    [ 0, 'Obtain', [ 'jql2', 'ys1' ] ],
    [ 0, 'ObtainEnd' ],
    [ 0, 'PostObtainDealOne', 'gjhg2' ],
    [ 1, 'DiscardOne', [ 'ws2', 'wmzj2' ] ],
    [ 1, 'Obtain', [ 'wmzj2', 'qhzr2' ] ],
    [ 1, 'ObtainEnd' ],
    [ 1, 'PostObtainDealOne', 'qyt1' ],
    [ 0, 'Obtain', [ 'ths2', 'yd1' ] ],
    [ 0, 'ObtainEnd' ],
    [ 0, 'PostObtainDealOne', 'sy2' ],
    [ 1, 'Obtain', [ 'xl1', 'ws2' ] ],
    [ 1, 'ObtainEnd' ],
    [ 1, 'PostObtainDealOne', 'hy1' ],
    [ 0, 'Obtain', [ 'fls1', 'ca2' ] ],
    [ 0, 'ObtainEnd' ],
    [ 0, 'PostObtainDealOne', 'tzbz2' ],
    [ 0,
      'Redeal',
      [ [ 'zrl1', 'hy1', 'sy2', 'blts1', 'wc2', 'tzbz2', 'snm2', 'oysg1' ],
        [ 'yqs1', 'lyc2', 'hykh2', 'al1', 'gjhg2', 'qyt1' ] ] ],
    [ 1, 'DiscardOne', [ 'hllp1', 'hykh2' ] ],
    [ 1, 'Obtain', [ 'hykh2', 'wc2' ] ],
    [ 1, 'ObtainEnd' ],
    [ 1, 'PostObtainDealOne', 'qyt1' ],
  ];

  if (rank == 0) {
    for (var i=0; i<action_seq.length; i++) {
      action_seq[i][0] = 1 - action_seq[i][0];
    }
  }

  ApplyActionSequence(action_seq);
}

function ShowRestoreSnapshotDialog(msg = null) {
  var b = document.getElementById('avatarselection_blocker');
  var d = document.getElementById('restore_snapshot_dialog');
  var i = document.getElementById('restore_dialog_info');
  d.style.display = 'block';
  b.style.display = 'block';
  if (msg == null) {
    var side;
    if (versus_rank == 1) side = '，先手';
    else if (versus_rank == 0) side = '，后手';
    else side = '';
    i.textContent = '游戏ID=' + g_game_id + side;
  } else {
    i.textContent = msg;
  }
  delayedFunc(function() {
    document.getElementById('restore_snapshot_dialog').style.height = '17vw';
  }, 0.1);
}

function HideRestoreSnapshotDialog() {
  document.getElementById('restore_snapshot_dialog').style.height = 0;
  delayedFunc(function() {
    document.getElementById('restore_snapshot_dialog').style.display = 'none';
    document.getElementById('avatarselection_blocker').style.display = 'none';
  }, 1);
}

function RestoreSnapshotButtonClicked(choice = no) {
  HideRestoreSnapshotDialog();
  if (choice == true) {
    RestoreGameStateFromStartMenu();
  } else {

  }
}
