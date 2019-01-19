//consts

MAX_MAIN_RATIO = 2.3;//max width/height ratio of the main board
MIN_MAIN_RATIO = 1.66;//min width/height ratio of the main board
CARD_RATIO = 3 / 4; //width/height ratio of a card
HAND_CARD_OVERLAP = 0.44; //percent of neighboring cards that overlap in hand board
OPERATION_DELAY = 500; //delay in milliseconds between machine operations
MOVE_DURATION = 2; //2 time units (OPERATION_DELAY)

var CARDH=0, CARDW=0, WINW=0, WINH=0, MAINW=0, MAINH=0;

function getCSSInt(name) {
  var cv = getComputedStyle(document.documentElement).getPropertyValue(name);
  return parseInt(cv);
}
function setCSSInt(name, val) {
  document.documentElement.style.setProperty(name, val + "px");
}
function reflow() {
  document.getElementById('main').clientWidth;
}
function showOpacity(div, show){
  if(show){
    //banner.style.zIndex = 999;
    div.style.visibility = "visible";
    div.style.opacity = 1;
  }
  else{
    div.style.opacity = 0;
    div.style.visibility = null;
  }
}

function createInfobox(char){
  var div = document.createElement("div");
  div.classList.add("hoverinfobox", "transitopacity");
  div.appendChild(createNamePanel(char, true));
  div.appendChild(createTeammatePanel(char));
  return div;
}
function createFullInfobox(char){
  var div = document.createElement("div");
  div.classList.add("hoverinfobox", "transitform");
  div.appendChild(createNamePanel(char, false));
  div.appendChild(createPoemPanel(char));
  if(char.isSpecial())
    div.appendChild(createTrickPanel(char));
  else
    div.appendChild(createTeammatePanel(char));
  return div;
}
function createTrickPanel(char){
  var div = document.createElement("div");
  div.classList.add("trickpanel");
  var nos = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  var len = char.tricks.length;
  var i=0;
  for(; i<len; i++){
    div.innerHTML += "<div>技能效果" + nos[i] + "：</div>";
    div.innerHTML += char.tricks[i].description;
  }
  if(char.noswap)
    div.innerHTML += "<div>技能效果" + nos[i] + "：</div>被交换后卡牌技能无效";
  return div;
}
function createTeammatePanel(char){
  var div = document.createElement("div");
  div.classList.add("teammatepanel");
  var mates = combos.getTeamMates(char);
  var len = mates.length;
  div.innerHTML = "<div>可组合的卡牌：</div>";
  for(var i=0; i<len-1; i++)
    div.innerHTML += mates[i] + "、";
  if(len > 0)
    div.innerHTML += mates[len-1];
  return div;
}
function createNamePanel(char, showscore){
  var div = document.createElement("div");
  div.classList.add("namepanel", "bignotice");
  var namediv = document.createElement("div");
  div.appendChild(namediv);
  if(char.isSpecial())
    namediv.innerHTML = char.name + "&middot;" + char.nameSuffix;
  else
    namediv.innerHTML = char.name;
  if(showscore){
    var scorediv = document.createElement("div");
    div.appendChild(scorediv);
    var span = document.createElement("span");
    scorediv.appendChild(span);
    span.textContent = char.score;
    span = document.createElement("span");
    scorediv.appendChild(span);
    span.textContent = "分";
  }
  return div;
}
function createPoemPanel(char){
  var div = document.createElement("div");
  div.classList.add("poempanel", "bignotice");
  div.textContent = char.poem==null?DEFAULT_CHAR_POEM:char.poem;
  return div;
}
class Sound{
  constructor(){
    this.audio = document.getElementById("soundeffect");
    this.ac = new Audio('mp3/activate.mp3');/*
    this.de = new Audio('mp3/deal.wav');
    this.wi = new Audio('mp3/win.mp3');
    this.lo = new Audio('mp3/fool.mp3');
    this.di = new Audio('mp3/discard.mp3');
    this.dr = new Audio('mp3/draw.mp3');*/
  }
  play(name){
    sound.audio.src = "mp3/" + name + ".mp3";
    sound.promisedPlay();
  }
  promisedPlay(){
    //I don't a thing about promises, maybe i will learn about it someday
    const playPromise = sound.audio.play();
    if (playPromise !== null){
        playPromise.catch(() => {//sound.audio.play();
        })
    }
  }
  activate(){this.play("activate");}
  deal(){this.play("deal");}
  win(){this.play("win");}
  lose(){this.play("fool");}
  discard(){this.play("discard");}
  draw(){this.play("draw");}
  combovoice(nextFunc,name){
    var onetimeFunc=function(){
        nextFunc.call();
        sound.audio.removeEventListener("ended", onetimeFunc);
    };
    this.audio.addEventListener("ended", onetimeFunc);
    this.audio.addEventListener("error", onetimeFunc);
    this.audio.src = "combomp3/" + name + ".mp3";
    this.promisedPlay();
  }
}
class Card{
  /*
  container classes:
    pop: active card in hand1
  card classes:
    glow: active cards in hand1 and pool
  */
  constructor(char) {
    this.container = document.createElement("div");
    this.container.classList.add("charcontainer");
    var cardContainer = document.createElement("div");
    this.container.appendChild(cardContainer);
    cardContainer.classList.add("cardContainer", "transitall");
    this.card = document.createElement("div");
    cardContainer.appendChild(this.card);
    this.card.id = char.id;
    this.card.classList.add("card", "transitform");
    var front = document.createElement("div");
    this.card.appendChild(front);
    front.classList.add("cardfront");
    front.style.backgroundImage = char.getPortrait();
    var back = document.createElement("div");
    this.card.appendChild(back);
    back.classList.add("cardback");
    this.container.appendChild(createInfobox(char));
    this.container.addEventListener("click", controller.doNothing);
  }
  setChar(char){
    this.card.id = char.id;
    var front = this.card.querySelector(".cardfront");
    front.style.backgroundImage = char.getPortrait();
    var hvinfo = this.container.querySelector(".hoverinfobox");
    var newName = char.card.container.querySelector(".namepanel");
    hvinfo.replaceChild(newName, hvinfo.firstElementChild);
  }
  moveto(deck){
    var container = this.container;
    container.style.transform = "none";
    container.classList.remove("transitall");

    var rect = container.getBoundingClientRect();
    var l = rect.left;
    var t = rect.top;
    deck.container.appendChild(container);
    rect = container.getBoundingClientRect();
    l = l - rect.left;
    t = t - rect.top;

    container.style.zIndex = 99;
    container.style.transform = "translate(" +l+ "px," +t+ "px)";
    container.style.webkitTransform = "translate(" +l+ "px," +t+ "px)";
    reflow();
    container.classList.add("transitall");
    container.style.transform = null;
    container.style.zIndex = null;
  }
  activate(){
    this.container.firstElementChild.classList.add("pop");
    this.card.classList.add("glow");
  }
  deactivate(){
    this.container.firstElementChild.classList.remove("pop");
    this.card.classList.remove("glow");
  }
  match(){
    this.card.classList.add("glow");
    this.addController(controller.obtain);
  }
  unmatch(){
    this.card.classList.remove("glow");
    this.removeController(controller.obtain);
  }
  faceup(){
    this.container.classList.add("faceup");
  }
  facedown(){
    this.card.classList.remove("faceup");
  }
  isFaceup(){
    this.card.classList.contains("faceup");
  }
  rotate(deg){
    this.container.style.transform = 'rotate(' + deg + 'deg)';
  }
  unRotate(){
    this.container.style.transform = 'none';
  }
  setZ(z){
    this.container.style.zIndex = z;
  }
  setLeft(l){
    this.container.style.left = l;
  }
  setTop(t){
    this.container.style.top = t;
  }
  addController(func) {
    this.card.addEventListener("click", func);
  }
  removeController(func) {
    this.card.removeEventListener("click", func);
  }
}
class DeckDiv {
  constructor(div, deck) {
    this.container = div;
    this.deck = deck;
  }
  init(){
    var chars = this.deck.characters;
    for(var i=0; i<chars.length; i++)
      chars[i].card.moveto(this);
  }
  toSpecial(char, sp){
    char.card.setChar(sp);
    sp.card = char.card;
    var me = this;
    delayedFunc(function(){
      sp.card.moveto(me);
    });
  }
  reset(player){
    var chars = this.deck.characters;
    for(var i=0; i<chars.length; i++)
      if(chars[i].isSpecial())
        chars[i].card.moveto(player.specials.view);
  }
  clear(){
    var chars = this.deck.characters;
    for(var i=0; i<chars.length; i++){
      var card = chars[i].card;
      if(this == view.table0){
        card.removeController(controller.checkOppoInfo);
        card.facedown();
      }
      else if(this == view.table1)
        card.removeController(controller.checkPlayerInfo);
      card.moveto(view.repository);
    }
  }
  destroy(){
    this.container.textContent = "";
  }
}
class RepoDiv extends DeckDiv{
  constructor(div, repo) {
    super(div, repo);
  }
  init(){
    var chars = this.deck.characters;
    for(var i=0; i<chars.length; i++){
      var card = new Card(chars[i]);
      chars[i].card = card;
      this.container.appendChild(card.container);
      if(this == view.specials1)
        card.addController(controller.checkPlayerSpecials);
    }
  }
  deleteSpecial(idx){
    this.container.removeChild(this.container.children[idx]);
  }
}
class Hand0Div extends DeckDiv{
  constructor(div, hand){
    super(div, hand);
  }
  reveal(number){
    var hiddenChars = [];
    var chars = this.deck.characters;
    for(var i=0; i<chars.length; i++)
      if(!chars[i].card.isFaceup())
        hiddenChars.push(chars[i]);
    if(hiddenChars.length<number)
      number = hiddenChars.length;
    for(var i=0; i<number; i++){
      var idx = getRandom(hiddenChars.length);
      hiddenChars[idx].card.faceup();
      hiddenChars.splice(idx, 1);
    }
  }
}
class Hand1Div extends DeckDiv {
  constructor(div, hand) {
    super(div, hand);
  }
  init(){
    super.init();
    for(var i=0; i<this.deck.getSize(); i++){
      this.deck.characters[i].card.addController(controller.activate);
    }
  }
  activate(oldChar, newChar) {
    if (oldChar != null) {
      var card = oldChar.card;
      card.deactivate();
    }
    if (newChar != null) {
      var card = newChar.card;
      card.activate();
    }
  }
}
class PoolDiv extends DeckDiv {
  constructor(div, pool) {
    super(div, pool);
  }
  updateMatch(oldChar, newChar) {
    //update card matchs in pool according to seasons
    //Match: glow, clickable
    var oldSeason = oldChar==null?null:oldChar.season;
    var newSeason = newChar==null?null:newChar.season;
    if (oldSeason != newSeason) {
      for (var i = 0; i < this.deck.getSize(); i++) {
        var char = this.deck.characters[i];
        if (char.season == oldSeason)
          char.card.unmatch();
        else if (char.season == newSeason)
          char.card.match();
      }
    }
  }
}
class Messenger {
  constructor(){
  }
  init(){
    this.note("");
    document.querySelector("#score0 div").textContent = 0;
    document.querySelector("#score1 div").textContent = 0;
  }
  hideFinalNotice(){
    var div = document.getElementById("finalcontainer");
    div.removeEventListener("click", controller.restart);
    div.classList.remove("notransform");
    delayedFunc(function(){
      div.style.visibility = null;
    }, 4);
  }
  note(msg){
    document.getElementById("infobox").firstElementChild.textContent = msg;
  }
  spselectionnote(msg){
    document.getElementById("selectioninfo").firstElementChild.textContent = msg;
  }
  notifyNoMatch(display) {
    if (display == "show")
      messenger.note("无牌可匹配\n需抛弃一张牌");
    else if(display == "hidden")
      messenger.note("");
    else
      console.log("Invalid notifyNoMatch mode:" + display);
  }
  setBannerHeadline(msgs){
    var spans = document.querySelector("#infobanner .bannertext").children;
    for(var i=0; i<5; i++)
      spans[i].textContent = msgs[i];
  }
  createBannerPoster(char){
    var poster = document.createElement("div");
    poster.classList.add("postercard");
    poster.style.backgroundImage = char.getPortrait();
    return poster;
  }
  animeScoreInc(pid, preScore, inc){
    // anime score and score inc
    document.querySelector("#score" + pid +  " div").textContent = preScore + inc;
    if(inc == 0) return;
    var incdiv = document.getElementsByClassName("combobonus")[pid];
    if(inc > 0)
      incdiv.textContent = "+" + inc;
    else
      incdiv.textContent = inc;
    reflow();
    incdiv.classList.add("animebonus");
    delayedFunc(function(){
      incdiv.classList.remove("animebonus");
    });
  }
  notifyPlayerCombo(preScore, comboCount, combos){
    if(comboCount > 0){
      var combo = combos[--comboCount];
      var inc = combo.getFullScore();
      messenger.animeScoreInc(1, preScore, inc);
      var chars = combo.characters;
      var banner = document.getElementById("infobanner");
      var posters = banner.querySelector(".bannercards");
      messenger.setBannerHeadline(["完成组合", combo.getName(), "，获得", inc, "分"]);
      for(var i=0; i<chars.length; i++)
        posters.appendChild(messenger.createBannerPoster(chars[i]));
      showOpacity(banner, true);
      var nextFunc = function(){
        banner.style.opacity = 0;
        delayedFunc(function(){
          banner.style.visibility = "hidden";
          posters.textContent = "";
          messenger.notifyPlayerCombo(preScore+inc, comboCount, combos);
        },1);
      }
      sound.combovoice(nextFunc, COMBO_VOICE == "voiceoff"?"combo":combo.getInit());
    }
    else
      controller.postObtain(1);
  }
  notifyOppoCombo(preScore, comboCount, combos){
    if(comboCount > 0){
      var combo = combos[--comboCount];
      var inc = combo.getFullScore();
      messenger.animeScoreInc(0, preScore, inc);
      messenger.note("对方完成组合\n"+combo.getDesc());
      delayedFunc(function(){
        messenger.notifyOppoCombo(preScore+inc, comboCount, combos);
      });
    }
  }
  notifyFinal(){
    var msg = document.getElementById("finalmsg");
    var div = document.getElementById("finalcontainer");
    if(model.player1.score > model.player0.score){
      if(spmanager.awardSpecials())
        msg.textContent = "千秋戏王";
      else
        msg.textContent = "你赢了";
      sound.win();
    }
    else if(model.player1.score < model.player0.score){
      msg.textContent = "你输了";
      sound.lose();
    }
    else {
      msg.textContent = "平手";
      sound.draw();
    }
    div.addEventListener("click", controller.restart);
    div.style.visibility = "visible";
    div.classList.add("notransform");
  }
  notifyOppoAction(type, nextFunc){
    var chars = obtainVector.getLastTrickPair(type);
    var count = chars.length;
    var banner = document.getElementById("infobanner");
    var posters = banner.querySelector(".bannercards");
    switch (type) {
      case "CopyTrick":
        messenger.setBannerHeadline(["对方用", chars[0].name + " 复制", "了你家", chars[1].name, "的所有技能"]);
        break;
      case "SwapTrick":
        messenger.setBannerHeadline(["对方用", chars[0].name + " 换走", "了你的", chars[1].name, ""]);
        break;
      case "UnnamedBanTrick":
        messenger.setBannerHeadline(["对方用", chars[0].name + " 禁用", "了你家", chars[1].name, "的所有技能"]);
        break;
    }
    for(var i=0; i<count; i++){
      var swapposter = document.createElement("div");
      posters.appendChild(swapposter);
      swapposter.classList.add("swapposter");
      swapposter.appendChild(document.createElement("div"));
      swapposter.appendChild(messenger.createBannerPoster(chars[i]));
    }
    banner.addEventListener("click", nextFunc);
    //reflow();
    //banner.style.opacity = 1;
    showOpacity(banner, true);
  }
  exitNotifyOppoAction(nextFunc){
    var banner = document.getElementById("infobanner");
    banner.removeEventListener("click", nextFunc);
    //banner.style.opacity = 0;
    //banner.style.display = null;
    showOpacity(banner, false);
    banner.querySelector(".bannercards").textContent = "";
  }
  notifyAward(minscore, spid){
    var banner = document.getElementById("infobanner");
    var levels = ["炤", "洛", "危"];
    messenger.setBannerHeadline(["恭喜对战", levels[AI_LEVEL-1]+"级AI", "超过" , minscore,"分，请抱好"]);
    var poster =  banner.querySelector(".bannercards").appendChild(document.createElement("div"));
    poster.classList.add("postercard");
    poster.style.backgroundImage = "url('img/" + spid + ".jpg')";banner.addEventListener("click", function(){
      messenger.exitNotifyOppoAction(controller.doNothing);
    });
    showOpacity(banner, true);
  }
}
class View {
  constructor() {
    this.hand0 = new Hand0Div(document.getElementById("hand0"), model.player0.hand);
    this.hand1 = new Hand1Div(document.getElementById("hand1"), model.player1.hand);
    this.pool = new PoolDiv(document.getElementById("pool"), model.pool);
    this.table0 = new DeckDiv(document.getElementById("table0"), model.player0.table);
    this.table1 = new DeckDiv(document.getElementById("table1"), model.player1.table);
    this.repository = new RepoDiv(document.getElementById("repository"), model.commonRepository);
    this.specials0 = new RepoDiv(document.getElementById("specials0"), model.player0.specials);
    this.specials1 = new RepoDiv(document.getElementById("specials1"), model.player1.specials);
    this.setup();
  }
  start(){
    view.specials0.init();
    view.specials1.init();
    view.hand0.init();
    view.hand1.init();
    view.pool.init();
    view.unblockGame();
  }
  init(){
    view.blockGame();
    messenger.init();
    /*
    this.pool.destroy();
    this.table0.destroy();
    this.table1.destroy();
    this.repository.destroy();
    this.specials0.destroy();
    this.specials1.destroy();
    */
    this.repository.init();
  }
  setup(){
    this.setSizes();
    model.commonRepository.view = this.repository;
    model.player0.hand.view = this.hand0;
    model.player0.table.view = this.table0;
    model.player0.specials.view = this.specials0;
    model.player1.hand.view = this.hand1;
    model.player1.table.view = this.table1;
    model.player1.specials.view = this.specials1;
    model.pool.view = this.pool;
    document.documentElement.style.setProperty("--transition-sec", OPERATION_DELAY + "ms");
    window.addEventListener("resize", this.setSizes);
  }
  checkMatch1(){
    var len = this.hand1.deck.getSize();
    var chars = this.hand1.deck.characters;
    if(model.player1.matchable){
      messenger.notifyNoMatch("hidden");
      for (var i = 0; i < len; i++) {
        chars[i].card.removeController(controller.discard);
        chars[i].card.addController(controller.activate);
      }
    }
    else {
      messenger.notifyNoMatch("show");
      for (var i = 0; i < len; i++) {
        chars[i].card.removeController(controller.activate);
        chars[i].card.addController(controller.discard);
      }
      sound.discard();
    }
  }
  blockGame(){
    document.getElementById("blocker").style.visibility = "visible";
  }
  unblockGame(){
    document.getElementById("blocker").style.visibility = null;
  }
  discard(player, oldChar, newChar) {
    if (player.id == 1) {
      //hand1 --> pool: remove discard listener
      //repo --> hand1: add discard listener
        oldChar.card.removeController(controller.discard);
        newChar.card.addController(controller.discard);
    }
    else {
      //reset revealed cards
      oldChar.card.facedown();
    }
    oldChar.card.moveto(this.pool);
    newChar.card.moveto(player.hand.view);
  }
  dealOne(char) {
    char.card.moveto(view.pool);
    sound.deal();
  }
  swappedObtain(player, char, swapChar){
    var oppo, playerinfo, oppoinfo;
    if(player.id==0){
      oppo = model.player1;
      playerinfo = controller.checkOppoInfo;
      oppoinfo = controller.checkPlayerInfo;
    }
    else {
      oppo = model.player0;
      playerinfo = controller.checkPlayerInfo;
      oppoinfo = controller.checkOppoInfo;
    }
    if(swapChar != null){
      swapChar.card.moveto(player.table.view);
      swapChar.card.removeController(oppoinfo);
      swapChar.card.addController(playerinfo);
      char.card.moveto(oppo.table.view);
      char.card.addController(oppoinfo);
    }
    else{
      char.card.moveto(player.table.view);
      char.card.addController(playerinfo);
    }
  }
  obtain() {
    var player = obtainVector.player;
    var charInc = obtainVector.charScoreInc;
    var comboCount = obtainVector.comboCount;
    view.swappedObtain(player, obtainVector.chars[0], obtainVector.swapChars[0]);
    view.swappedObtain(player, obtainVector.chars[1], obtainVector.swapChars[1]);
    messenger.animeScoreInc(player.id, obtainVector.preScore, charInc);
    if(player.id == 0){
      messenger.notifyOppoCombo(obtainVector.preScore+charInc, comboCount, player.completeCombos);
      controller.postObtain(0);
    }
    else {
      obtainVector.getHandChar().card.removeController(controller.activate);
      messenger.notifyPlayerCombo(obtainVector.preScore+charInc, comboCount, player.completeCombos);
    }
  }
  activate(oldChar, newChar) {
    this.hand1.activate(oldChar, newChar);
    this.pool.updateMatch(oldChar, newChar);
    if(newChar != null)
      sound.activate();
  }
  setSizes() {
    //cardh, cardw, handoffset, pooloffset
    var maindiv = document.getElementById("main");
    WINW = document.documentElement.clientWidth;
    WINH =document.documentElement.clientHeight;
    MAINW = WINW;
    MAINH = WINH;
    if (MAINW / MAINH > MAX_MAIN_RATIO)
      MAINW = MAINH * MAX_MAIN_RATIO;
    else if (MAINW / MAINH < MIN_MAIN_RATIO)
      MAINH = MAINW / MIN_MAIN_RATIO;
    maindiv.style.width = MAINW;
    maindiv.style.height = MAINH;
    maindiv.style.top = (WINH - MAINH)/2;
    maindiv.style.left = (WINW - MAINW)/2;

    CARDW = MAINW *0.66*(1-2*0.028) / (9 * (1 - HAND_CARD_OVERLAP) + 1);
    var maxCardH = MAINH * 0.41 * 12/23;
    CARDH = CARDW / CARD_RATIO;
    if (CARDH > maxCardH) {
      CARDH = maxCardH;
      CARDW = CARDH * CARD_RATIO;
    }
    setCSSInt("--card-width", CARDW);
    setCSSInt("--card-height", CARDH);
    setCSSInt("--main-height", MAINH);
    setCSSInt("--main-width", MAINW);
    setCSSInt("--win-height", WINH);
    //var poolM = (MAINW*0.643*(1-2*0.028)-CARDW*2.5)/(INIT_CARD_NUM_POOL+1)- CARDW;
    var poolM = (MAINW*0.66*(1-2*0.028)-CARDW*1.3)/(INIT_CARD_NUM_POOL+1)- CARDW;
    setCSSInt("--pool-margin", poolM);
  }
}

var sound, combos, model, controller, spmanager, messenger, view, oppoinfo, playerinfo, obtainVector;
var AI_LEVEL, COMBO_VOICE, SP_CARDS;

function gamesetup(){
  var pack = getInput("packinput");
  var p1 = parseInt(pack.charAt(1));
  var p2 = parseInt(pack.charAt(2));
  AI_LEVEL = parseInt(getInput("aiinput").charAt(2));
  COMBO_VOICE = getInput("voiceinput");
  SP_CARDS = parseInt(getInput("spinput").charAt(2));
  sound = new Sound();
  combos = new Combos();
  model = new Model(p1, p2);
  obtainVector = new ObtainVector();
  controller = new Controller();
  spmanager = new SPManager();
  messenger = new Messenger();
  view = new View();
  oppoinfo = new TableInfoView(model.player0);
  playerinfo = new TableInfoView(model.player1);
  showOpacity(document.getElementById("configurator"), false);
  model.setup();
  controller.gameinit();
}
document.getElementById("comfirmSetting").addEventListener("click", gamesetup);
