
// AUTO TEST START
//AUTOTEST_autostartmatch();
var autotest_round = 1;
var oppo_combo_notifications = 0;

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
