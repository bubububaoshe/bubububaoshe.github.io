//consts

MAX_MAIN_RATIO = 2;//max width/height ratio of the main board
MIN_MAIN_RATIO = 1.65;//min width/height ratio of the main board
CARD_RATIO = 3 / 4; //width/height ratio of a card
HAND_CARD_OVERLAP = 0.44; //percent of neighboring cards that overlap in hand board
MOVE_DURATION = 2; //2 time units (500ms)

var CARDH=0, CARDW=0, WINW=0, WINH=0, MAINW=0, MAINH=0;

function getCSSInt(name) {
  var cv = getComputedStyle(document.documentElement).getPropertyValue(name);
  return parseInt(cv);
}
function setCSSInt(name, val) {
  document.documentElement.style.setProperty(name, val + "px");
}
function log(msg) {
  var para = document.querySelector("#specialboard").firstElementChild;
  para.setAttribute('style', 'white-space: pre;');
  para.textContent += msg + "\n";
}
function reflow() {
  document.getElementById('main').clientWidth;
}
class Sound{
  constructor(){
    this.ac = new Audio('mp3/activate.mp3');
    this.de = new Audio('mp3/deal.wav');
    this.co = new Audio('mp3/combo.mp3');
    this.wi = new Audio('mp3/win.mp3');
    this.lo = new Audio('mp3/fool.mp3');
    this.di = new Audio('mp3/discard.mp3');
    this.dr = new Audio('mp3/draw.mp3');
  }
  activate(){this.ac.play();}
  deal(){this.de.play();}
  combo(){this.co.play();}
  win(){
    this.wi.play();
  }
  lose(){
    this.lo.play();
  }
  discard(){
    this.di.play();
  }
  draw(){
    this.dr.play();
  }
  combovoice(name){
    var mp3 = new Audio('combomp3/' + name +'.mp3');
    mp3.play();
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
    this.container.classList.add("cardcontainer", "transitall");
    this.card = document.createElement("div");
    this.container.appendChild(this.card);
    this.card.id = char.id;
    this.card.classList.add("card", "transitform");
    var front = document.createElement("div");
    this.card.appendChild(front);
    front.classList.add("cardfront");
    front.style.backgroundImage = "url('img/" + char.id + ".jpg')";
    var back = document.createElement("div");
    this.card.appendChild(back);
    back.classList.add("cardback");
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
    this.container.classList.add("pop");
    this.card.classList.add("glow");
  }
  deactivate(){
    this.container.classList.remove("pop");
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
    this.card.style.transform = "rotateY(180deg)";
  }
  facedown(){
    this.card.style.transform = "none";
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
  clear(){
    var chars = this.deck.characters;
    for(var i=0; i<chars.length; i++){
      var card = chars[i].card;
      if(this == view.table0)
        card.removeController(controller.checkOppoInfo);
      else if(this == view.table1)
        card.removeController(controller.checkPlayerInfo);
      card.moveto(view.repository);
    }
  }
  paint(){}
}
class RepoDiv extends DeckDiv{
  constructor(div, repo) {
    super(div, repo);
  }
  init(){
    var chars = this.deck.characters;
    for(var i=0; i<chars.length; i++){
      var card = new Card(this.deck.characters[i]);
      this.deck.characters[i].card = card;
      this.container.appendChild(chars[i].card.container);
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
  reset(){
    this.notifyNoMatch("hidden");
    var div = document.getElementById("finalcontainer");
    div.removeEventListener("click", controller.restart);
    div.style.transform = null;
    div.style.webkitTransform = null;
    delayedFunc(function(){
      div.style.display = null;}, 4);
  }
  note(msg){
    var info = document.getElementById("infobox");
    info.textContent = msg;
  }
  notifyNoMatch(display) {
    var info = document.getElementById("infobox");
    if (display == "show")
      info.textContent = "无牌可匹配\n需抛弃一张牌";
    else if(display == "hidden")
      info.textContent = "";
    else {
      info.textContent = display;
    }
  }
  notifyOppoCombo(comboCount, combos){
    if(comboCount > 0){
      messenger.notifyNoMatch("对方获得\n"+combos[--comboCount].getDesc());
      delayedFunc(function(){
          messenger.notifyOppoCombo(comboCount, combos);
      });
    }
  }
  notifyPlayerCombo(comboCount, combos){
    if(comboCount > 0){
      var combo = combos[--comboCount];
      var chars = combo.characters;
      var count = chars.length;
      var offset = CARDW * 1.2 + 10;
      var totalw = CARDW * 1.2 * count + 10*(count -1);
      var left = (WINW - totalw)/2;
      var banner = document.getElementById("combobanner");
      var headline =  document.getElementById("combotext");
      var poster = document.getElementById("combocards");
      var pcards = poster.children;
      pcards[0].style.marginLeft = left;
      for(var i=0; i<count; i++){
        pcards[i].style.display = "block";
        pcards[i].style.backgroundImage = chars[i].getPortrait();
      }
      for(var i=count; i<6; i++)
        pcards[i].style.display = "none";
      headline.firstElementChild.textContent = combo.getName();
      headline.lastElementChild.textContent = combo.getScore();
      banner.style.display = "block";
      reflow();
      banner.style.opacity = 1;
      //banner.style.transform = "none";
      if(COMBO_VOICE == "voiceoff")
        sound.combo();
      else
        sound.combovoice(combo.getName());
      delayedFunc(function(){
          banner.style.opacity = 0;
          //banner.style.transform = "rotateY(90deg)";
        delayedFunc(function(){
          banner.style.display = "none";
          messenger.notifyPlayerCombo(comboCount, combos);
        }, 1.5);
      },2.5);
    }
  }
  notifyFinal(){
    var msg = document.getElementById("finalmsg");
    var div = document.getElementById("finalcontainer");
    if(model.player1.score > model.player0.score){
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
    div.style.display = "block";
    reflow();
    div.style.transform = "none";
    div.style.webkitTransform = "none";
  }
  
  notifyMyTurn() {
    var info = document.getElementById("infobox1");
    info.innerHTML = '';
  }
  
  notifyOpponentTurn() {
    var info = document.getElementById("infobox1");
    info.innerHTML = '对方行动中';
  }
}
class View {
  constructor() {
    this.hand0 = new DeckDiv(document.getElementById("hand0"), model.player0.hand);
    this.hand1 = new Hand1Div(document.getElementById("hand1"), model.player1.hand);
    this.pool = new PoolDiv(document.getElementById("pool"), model.pool);
    this.table0 = new DeckDiv(document.getElementById("table0"), model.player0.table);
    this.table1 = new DeckDiv(document.getElementById("table1"), model.player1.table);
    this.repository = new RepoDiv(document.getElementById("repository"), model.commonRepository);
    this.score0 = document.getElementById("score0");
    this.score1 = document.getElementById("score1");
    this.blocker = document.getElementById("blocker");
  }
  reset(){
    messenger.reset();
    this.updateScore();
  }
  restart(){
    view.hand0.init();
    view.hand1.init();
    view.pool.init();
    view.unblockGame();
  }
  init(){
    this.setSizes();
    this.repository.init();
    model.commonRepository.view = this.repository;
    model.player0.hand.view = this.hand0;
    model.player0.table.view = this.table0;
    model.player1.hand.view = this.hand1;
    model.player1.table.view = this.table1;
    model.pool.view = this.pool;
    this.updateScore();
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
    view.blocker.style.display = "block";
  }
  unblockGame(){
    view.blocker.style.display = "none";
  }
  updateScore() {
    this.score0.textContent = model.player0.score;
    this.score1.textContent = model.player1.score;
  }
  discard(player, oldChar, newChar) {
    if (player.id == 1) {
      //hand1 --> pool: remove discard listener
      //repo --> hand1: add discard listener
        oldChar.card.removeController(controller.discard);
        newChar.card.addController(controller.discard);
    }
    oldChar.card.moveto(this.pool);
    newChar.card.moveto(player.hand.view);
  }
  dealOne(char) {
    char.card.moveto(view.pool);
    sound.deal();
  }
  obtain(player, handChar, poolChar, comboCount) {
    view.updateScore();
    poolChar.card.moveto(player.table.view);
    handChar.card.moveto(player.table.view);
    if(player.id == 0){
      handChar.card.addController(controller.checkOppoInfo);
      poolChar.card.addController(controller.checkOppoInfo);
      messenger.notifyOppoCombo(comboCount, player.completeCombos);
    }
    else {
      handChar.card.removeController(controller.activate);
      handChar.card.addController(controller.checkPlayerInfo)
      poolChar.card.addController(controller.checkPlayerInfo)
      messenger.notifyPlayerCombo(comboCount, player.completeCombos);
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
    MAINW = window.innerWidth;
    MAINH = window.innerHeight;
    WINH = MAINH;
    WINW = MAINW;
    if (MAINW / MAINH > MAX_MAIN_RATIO)
      MAINW = MAINH * MAX_MAIN_RATIO;
    else if (MAINW / MAINH < MIN_MAIN_RATIO)
      MAINH = MAINW / MIN_MAIN_RATIO;
    maindiv.style.width = MAINW;
    maindiv.style.height = MAINH;
    maindiv.style.top = (WINH - MAINH)/2;
    maindiv.style.left = (WINW - MAINW)/2;

    CARDW = MAINW *0.643*(1-2*0.028) / (9 * (1 - HAND_CARD_OVERLAP) + 1);
    var maxCardH = MAINH * 0.2;
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
    var poolM = (MAINW*0.643*(1-2*0.028)-CARDW*1.3)/(INIT_CARD_NUM_POOL+1)- CARDW;
    setCSSInt("--pool-margin", poolM);
  }
}

var sound, combos, model, controller, messenger, view, oppoinfo, playerinfo;
var AI_LEVEL, COMBO_VOICE;
function gameinit(){
  var inputs = document.getElementById("packinput").getElementsByTagName("input");
  var pack, p1, p2;
  for(var i=0; i<inputs.length; i++)
    if(inputs[i].checked){
      pack = inputs[i].id;
      break;
    }
  p1 = pack.charAt(1);
  p2 = pack.charAt(2);
  inputs = document.getElementById("aiinput").getElementsByTagName("input");
  for(var i=0; i<inputs.length; i++)
    if(inputs[i].checked){
      AI_LEVEL = inputs[i].id;
      break;
    }
  inputs = document.getElementById("voiceinput").getElementsByTagName("input");
  for(var i=0; i<inputs.length; i++)
    if(inputs[i].checked){
      COMBO_VOICE = inputs[i].id;
      break;
    }
  document.getElementById("main").style.display = "block";
  document.getElementById("configurator").style.display = "none";
  sound = new Sound();
  combos = new Combos();
  model = new Model(p1, p2);
  controller = new Controller();
  messenger = new Messenger();
  view = new View();
  oppoinfo = new TableInfoView(model.player0);
  playerinfo = new TableInfoView(model.player1);
  model.init();
}
//gameinit();
document.getElementById("gamestart").addEventListener("click", gameinit);
