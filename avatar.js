// This file includes the methods, classes for manipulating the avatar & nickname

AVATAR_PREFIX = "avatars/";
AVATAR_FILENAMES = [
  "avatar1.png", "avatar2.png", "avatar3.png", "avatar5.png",  "avatar6.png",
  "avatar8.png", "avatar9.png", "avatar10.png", "avatar11.png", "avatar31.png",
  "avatar12.png", "avatar26.png", "avatar27.png",
  "avatar28.png", "avatar29.png", "avatar30.png",
  "avatar15.png", "avatar16.png", "avatar17.png", "avatar18.png", "avatar19.png", "avatar20.png",
  "avatar21.png",
  "avatar32.png", "avatar33.png", "avatar34.png", "avatar35.png",
  "avatar36.png", "avatar37.png", "avatar38.png", "avatar39.png",
  "avatar40.png", "avatar41.png", "avatar42.png", "avatar44.png",
  "avatar45.png", "avatar46.png", "avatar47.png", "avatar48.png",
  "avatar49.png", "avatar50.png", "avatar51.png", "avatar52.png",
  "avatar53.png", "avatar54.png", "avatar55.png",
  "avatar56.png",
  "avatar57.png", "avatar58.png", "avatar59.png", "avatar71.png", "avatar60.png", "avatar72.png", "avatar61.png", "avatar73.png",
  "avatar62.png", "avatar63.png", "avatar64.png", "avatar65.png", "avatar66.png",

  "avatar74.png", "avatar75.png", "avatar76.png",
  "avatar77.png", "avatar78.png", "avatar79.png",
  "avatar80.png", "avatar81.png", "avatar82.png",
  "avatar83.png", "avatar84.png", "avatar85.png",
  "avatar86.png", "avatar87.png", "avatar88.png",
  "avatar89.png", "avatar90.png", "avatar91.png",


  "avatar67.png", "avatar68.png", "avatar69.png", "avatar70.png",
  "avatar43.png",
];
AVATAR_NAMES = [
  "太华山・鼎剑峰", "百草谷", "补天岭", "江都", "长安",
  "飞天鼠・汤泉",   "金刚力士・不要打雷", "金刚力士・无敌", "砰・无敌", "砰・盯",
  "剑心・壹", "剑心・贰", "剑心・叁",
  "陈年女儿红", "玉女元参", "玉兔",
  "兔叽", "咯咯哒", "蜚兽", "泥偶", "呱呱・警觉", "呱呱・沉稳",
  "玄甲壳",
  "龙小企", "龙小美", "龙小程", "龙小囧",
  "木灵灵", "龙星", "乘云", "通宝",
  "酱肘子", "小笼包", "诡异的光",  "青龙环",
  "太极八卦镜", "瑶山水镜", "冰丝玉剑穗", "含香紫玉珠",
  "挖宝魔镜", "百兽镂金囊", "玉泉酿", "炎火盔",
  "小龙人・沉思", "小龙人・欢颜", "小龙人·乖巧",
  "七夕・相逢",
  "萌兔", "团子", "乐无异", "闻人羽", "夏夷则", "阿阮", "江看花", "阿绵",
  "神一道天", "雷霆震", "熙焰焚", "雪翎", "彤绡",
  "天罡・昔时", "天罡・旧颜", "虎啸",
  "斩风・昔时", "斩风・旧颜", "狼嗥",
  "御剑・昔时", "御剑・旧颜", "鹤唳",
  "妙法・昔时", "妙法・旧颜", "鹿鸣",
  "司命・昔时", "司命・旧颜", "鸾鸣",
  "咒隐・昔时", "咒隐・旧颜", "蛇音",

  "己亥・新禧", "己亥・庆岁", "己亥・大壮", "碧油唧",
  "古剑奇谭",
];

function GetAvatarUrlByIdx(idx) {
  return 'url("' + g_resource_prefix + AVATAR_PREFIX + AVATAR_FILENAMES[idx] + '")';
}

function SetCurrentSelectedAvatar(avatar_preview) {
  var b = avatar_preview.bkimgurl;
  console.log(b);
  document.getElementById('curr_avatar').style.backgroundImage = b;
  avatar.bkimgurl = b;
  avatar.idx = avatar_preview.idx;
  avatar.SaveToCookie();
}

function CloseAvatarSelectionMenu() {
  var s = document.getElementById('avatarselection');
  var b = document.getElementById('avatarselection_blocker');
  s.style.height=0;
  b.style.display = 'none';
}

function ShowAvatarSelectionMenu() {
  //TODO need hide the avatar selection panel instead of short drop here
  if (socket != undefined && socket.connected == true) return;
  if (avatar.nickname === "无名之人") return;
  if(avatarLoaded === false){
      PopulateAvatarChoicePanel(document.getElementById('avatar_choices'));
  }
  var s = document.getElementById('avatarselection');
  var b = document.getElementById('avatarselection_blocker');
  var avatars = document.getElementById('avatar_choices').children;
  for (var i=0; i<avatars.length; i++) {
    var w = avatars[i];
    if (w.idx == avatar.idx) {
      w.children[0].classList.add('glow');
    } else {
      w.children[0].classList.remove('glow');
    }
  }
  s.style.height="40vw";
  b.style.display = 'block';
}

function ShowGenericDialog(title="title", content="content") {
  var b = document.getElementById('avatarselection_blocker');
  var d = document.getElementById('genericdialog');
  var t = document.getElementById('genericdialog_title');
  var c = document.getElementById('genericdialog_content');
  d.style.display = 'block';
  b.style.display = 'block';
  t.textContent = title;
  c.textContent = content;
}

function HideGenericDialog() {
  var b = document.getElementById('avatarselection_blocker');
  var d = document.getElementById('genericdialog');
  b.style.display = 'none';
  d.style.display = 'none';
}

//TODO move the var binding to scoped function
var nickname_input = document.getElementById('nickname_input');
var nickname_disp  = document.getElementById('nickname_disp');
var nickname_input_done = document.getElementById('nickname_input_done');

function StartEditingNickname() {
  //TODO need hide the avatar selection panel instead of short drop here
  if (socket != undefined && socket.connected == true) return;
  nickname_input.style.display = 'block';
  nickname_input.value = avatar.GetNickname();
  nickname_input_done.style.display = 'block';

  var s = document.getElementById('nicknameinputwindow');
  var b = document.getElementById('avatarselection_blocker');
  s.style.height  = "12vw";
  b.style.display = 'block';
}
function EndEditingNickname() {
  avatar.SetNickname(nickname_input.value);
  nickname_input.style.display = 'none';
  nickname_input_done.style.display = 'none';
  document.getElementById('curr_avatar').style.backgroundImage = avatar.bkimgurl;
  nickname_disp.textContent = avatar.GetNickname();
  avatar.SaveToCookie();

  var s = document.getElementById('nicknameinputwindow');
  var b = document.getElementById('avatarselection_blocker');
  s.style.height  = "0vw";
  b.style.display = 'none';
}

function NicknameInputKeypressEvent(event) {
  if (event.which == 13) EndEditingNickname();
}

function PopulateAvatarChoicePanel(insert_point) {
  const N = AVATAR_NAMES.length;
  for (var i=0; i<N; i++) {
    var w = document.createElement('div');
    w.classList.add('avatarsmallwrapper');
    var p = document.createElement('div');
    p.classList.add('avatarpreview');
    var bkimgurl = 'url("' + g_resource_prefix + AVATAR_PREFIX + AVATAR_FILENAMES[i] +'")';
    p.style.backgroundImage = bkimgurl;
    var t = document.createElement('div');
    t.textContent = AVATAR_NAMES[i];
    w.appendChild(p);
    w.appendChild(t);
    insert_point.appendChild(w);

    w.bkimgurl = bkimgurl; // used for callback below
    w.idx = i;
    w.addEventListener('click', function() {
      //console.log(this); // this = the Wrapper
      SetCurrentSelectedAvatar(this);
      CloseAvatarSelectionMenu();
    });

    w.avatar = new Avatar(i);
  }
}

function UpdateAvatarPreview() {
  document.getElementById('curr_avatar').style.backgroundImage = avatar.bkimgurl;
  document.getElementById('nickname_disp').textContent = avatar.nickname;
}

class Avatar {
  constructor(idx, bkimgurl) {
    this.idx = idx; // 只存ID
    this.bkimgurl = bkimgurl;
    this.nickname = "";
  }
  LoadFromCookie() {
    var ix = getCookie('avatar_idx');
    if (ix != "") this.idx = ix;
    else this.idx = 0;

    this.bkimgurl = 'url("' + g_resource_prefix + AVATAR_PREFIX + AVATAR_FILENAMES[this.idx] + '")';

    var n = getCookie('nickname');
    if (n != null && n.length > 0) this.nickname = n;
    else this.nickname = '无名之人';
  }
  SaveToCookie() {
    setCookie('avatar_idx', this.idx);
    setCookie('nickname',   this.nickname);
  }
  CreateView() {
    var ret = document.createElement('div');
    ret.classList.add('avatarpreview');
    ret.style.backgroundImage = this.bkimgurl;
    return ret;
  }
  SetNickname(n) {
    n = n.replace('=', '')
    this.nickname = n;
  }
  GetNickname() { return this.nickname; }
}

function CloseOpponentFinderMenu() {
  var s = document.getElementById('opponentfinder');
  var b = document.getElementById('avatarselection_blocker');
  b.style.display = 'none';
  s.style.height = "0";
}

//TODO move the opponent finder to a single module
function ShowOpponentFinderMenu() {
  var s = document.getElementById('opponentfinder');
  var b = document.getElementById('avatarselection_blocker');
  var v = document.getElementById('oppofind_my_avatar');
  var d1 = document.getElementById('oppofind_my_nickname');
  var d2 = document.getElementById('oppofind_my_playerid');
  s.style.height = "34vw";
  b.style.display = 'block';
  v.style.backgroundImage = GetAvatarUrlByIdx(avatar.idx);
  d1.textContent = avatar.nickname;
  d2.textContent = "临时ID: " + g_my_player_id;
}

// [ [ID, Nickname, AvatarIdx] .. ]
function PopulateFoundOpponentList(l) {
  var info = document.getElementById('find_opponent_info');
  info.textContent = '';
  if (l.length < 1) {
    info.textContent = '未找到满足条件的玩家';
  } else {
    info.textContent = '找到'+l.length+'名玩家';
  }
  var result = document.getElementById('opponentsearchresult');
  result.innerHTML = '';
  for (var i=0; i<l.length; i++) {
    var o=l[i], id=o[0], nickname=o[1], aidx=o[2];
    var w = document.createElement('div');
    w.classList.add('avatarsmallwrapper');
    var p = document.createElement('div');
    p.classList.add('avatarpreview');
    p.style.backgroundImage = GetAvatarUrlByIdx(aidx);
    var t = document.createElement('div');
    t.textContent = nickname;
    w.appendChild(p);
    w.appendChild(t);
    result.appendChild(w);

    w.id = id;
    w.addEventListener('click', function() {
      console.log('Opponent clicked: ID=' + this.id);
      // If glow: confirm
      if (this.children[0].classList.contains('glow')) {
        socket.emit('Match_InvitePlayer', this.id);
      } else {
        // Otherwise: set glow
        var r = document.getElementById('opponentsearchresult').children;
        for (var i=0; i<r.length; i++) {
          var x = r[i];
          if (this != x)
            x.children[0].classList.remove('glow');
        }
        this.children[0].classList.add('glow');
        info.textContent = '再点一下，就会向其发出邀请'
      }
    });
  }
}

// 登陆之前的对手头像
function ShowOpponentAvatarPreview(oppo_nickname, oppo_avataridx) {
  console.log('ShowOpponentAvatarPreview ' + oppo_nickname + ' ' + oppo_avataridx);
  document.getElementById('opponent_avatar_name').style.display = 'block';
  document.getElementById('oppo_avatar').style.backgroundImage = GetAvatarUrlByIdx(oppo_avataridx);
  document.getElementById('oppo_nickname').textContent = oppo_nickname;
}

function HideOpponentAvatarPreview() {
  document.getElementById('opponent_avatar_name').style.display = 'none';
}

// 游戏中的玩家头像与名字
function PopulateAndShowAvatarBoxes() {
  var a0 = document.getElementById('avatarbox0_avatar'),
      a1 = document.getElementById('avatarbox1_avatar'),
      n0 = document.getElementById('avatarbox0_nickname'),
      n1 = document.getElementById('avatarbox1_nickname'),
      ab = document.getElementById('avatarboxes');
  a0.style.backgroundImage = GetAvatarUrlByIdx(g_avataridxes[0]);
  a1.style.backgroundImage = GetAvatarUrlByIdx(g_avataridxes[1]);
  n0.textContent = g_nicknames[0];
  n1.textContent = g_nicknames[1];
  ab.style.display = 'block';
}

function HideAvatarBoxes() {
  var ab = document.getElementById('avatarboxes');
  ab.style.display = 'none';
}
