//consts
{
MAX_MAIN_RATIO = 2;//max width/height ratio of the main board
MIN_MAIN_RATIO = 1.5;//min width/height ratio of the main board
CARD_RATIO = 182 / 240; //width/height ratio of a card
MAIN_MARGIN = 0.0; //margin of the main board wrt window size
SCOREBOARD_WIDTH = 0.333; //width of the score board wrt main width
SPECIALBOARD_WIDTH = 0.3; //width of the special card board wrt main width
HAND0_HEIGHT = 0.28; //height of player0 hand board wrt table height
HAND1_HEIGHT = 0.345; //height of player1 hand board wrt table height
HAND_LEFT_PADDING = 0.04; //left padding of the hand boards in percent
HAND1_CARD_TOP = 0.7; //top of inactive cards at player1 hand board
HAND1_HOVER_TOP = 0.2; //top of onfocus cards at player1 hand board
HAND1_ACTIVE_TOP = 0.4; //top of active cards at player1 hand board
HAND_CARD_OVERLAP = 0.44; //percent of neighboring cards that overlap in hand board
POOL_CARD_OVERLAP = HAND_CARD_OVERLAP * 1.1; //percent of neighboring cards that overlap in pool board
MAX_POOL_CARD_ROTATION = 12; //max degree of rotation the pool cards turns
MAX_TABLE_CARD_ROTATION = 25; //max degree of rotation the table cards turns
SCORE_HEIGHT = 0.5; //height of #score0 wrt card height
TABLE_TOP = 0.7;//top margin of #table0 wrt scoreboard
SCORE_BELOW_TABLE = 0.1; //distance of #score0 below #table0 in scoreboard wrt scoreboard
CARD_BACK_FILE = "back"; //file name of the back of a card
DUMMY_CARD_NUM = 5; //number of dummy cards in the repository div
}
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
    this.de = new Audio('mp3/select.wav');
    this.co = new Audio('mp3/combo.mp3');
    this.wi = new Audio('mp3/win.mp3');
    this.lo = new Audio('mp3/foolish.mp3');
    this.di = new Audio('mp3/fool.mp3');
  }
  activate(){this.ac.play();}
  deal(){this.de.play();}
  combo(){this.co.play();}
  win(){this.wi.play();}
  lose(){this.lo.play();}
  discard(){this.di.play();}
}
class Card{
  constructor(char) {
    this.controllers = [];
    this.container = document.createElement("div");
    this.div = document.createElement("div");
    this.container.appendChild(this.div);
    this.container.classList.add("cardContainer");
    this.div.classList.add("card");
    this.div.id = char==null?"dummy":char.id;
    this.facedown();
  }
  faceup(){
    this.div.style.backgroundImage = "url('img/" + this.div.id + ".jpg')";
    this.container.classList.add("faceup");
  }
  facedown(){
    this.div.style.backgroundImage = "url('img/" + CARD_BACK_FILE + ".jpg')";
    this.container.classList.remove("faceup");
  }
  activate(){
    this.container.classList.remove("faceup");
    this.container.classList.add("pop");
    this.div.classList.add("glow");
  }
  deactivate(){
    this.container.classList.add("faceup");
    this.container.classList.remove("pop");
    this.div.classList.remove("glow");
  }
  match(){
    this.div.classList.add("glow");
    this.addController(controller.obtain);
  }
  unmatch(){
    this.div.classList.remove("glow");
    this.removeController(controller.obtain);
  }
  setPoolClass(diff){
    if(diff > 0){
      this.container.classList.remove("pooltop");
      this.container.classList.add("poolbottom");
    }
    else {
      this.container.classList.remove("poolbottom");
      this.container.classList.add("pooltop");
    }
  }
  removePoolClass(){
    this.container.classList.remove("pooltop");
    this.container.classList.remove("poolbottom");
  }
  addClass(name){
    this.container.classList.add(name);
  }
  removeClass(name){
    this.container.classList.remove(name);
  }
  rotate(deg){
    this.div.style.transform = 'rotate(' + deg + 'deg)';
  }
  unRotate(){
    this.div.style.transform = 'none';
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
    this.div.addEventListener("click", func);
  }
  removeController(func) {
    this.div.removeEventListener("click", func);
  }
}
class DeckDiv {
  constructor(div, deck) {
    this.firstCard = div.firstElementChild;
    this.offset = 0;
    this.deck = deck;
  }
  init(){
    for(var i=0; i<this.deck.getSize(); i++)
      this.deck.characters[i].card.facedown();
    this.paint();
  }
  paint() {
    var rect = this.firstCard.getBoundingClientRect();
    var left = rect.left;
    var top = rect.top;
    var len = this.deck.getSize();
    for (var i = 0; i < len; i++) {
      var card = this.deck.characters[i].card;
      card.setLeft(left);
      card.setTop(top);
      card.setZ(len - i);
      left += this.offset;
    }
  }
  getRandomRotate(maxRotation) {
    var rand = Math.floor((Math.random() * maxRotation * 2));
    return (rand - maxRotation) % 360;
  }
}
class RepoDiv extends DeckDiv{
  constructor(div, repo) {
    super(div, repo);
  }
  init(){
    var root = document.querySelector("body");
    for(var i=0; i<this.deck.getSize(); i++){
      let card = new Card(this.deck.characters[i]);
      this.deck.characters[i].card = card;
      root.appendChild(card.container);
    }
    this.paint();
  }
}
class Hand1Div extends DeckDiv {
  constructor(div, hand) {
    super(div, hand);
  }
  init(){
    for(var i=0; i<this.deck.getSize(); i++){
      var card = this.deck.characters[i].card;
      card.faceup();
      card.addController(controller.activate);
    }
    this.paint();
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
class TableDiv extends DeckDiv {
  constructor(div, table) {
    super(div, table);
    this.rotates = [];
    this.lefts = [];
    this.tops = [];
  }
  reset(){
    var rect = view.repository.firstCard.getBoundingClientRect();
    var left = rect.left;
    var top = rect.top;
    for(var i=0; i<this.deck.getSize(); i++){
      var card = this.deck.characters[i].card;
      card.unRotate();
      card.facedown();
      card.setLeft(left);
      card.setTop(top);
    }
  }
  init(){
    for (var i = 0; i < INIT_CARD_NUM_HAND*2; i++) {
      this.rotates[i] = this.getRandomRotate(MAX_TABLE_CARD_ROTATION);
        this.lefts[i] = Math.floor((Math.random()-0.5)*this.offset);
        this.tops[i] = Math.floor((Math.random()-0.5)*this.offset);
    }
  }
  paint() {
    var rect = this.firstCard.getBoundingClientRect();
    var left = rect.left;
    var top = rect.top;
    for (var i = 0; i < this.deck.getSize(); i++) {
      var card = this.deck.characters[i].card;
      card.setLeft(left+this.lefts[i]);
      card.setTop(top+this.tops[i]);
      card.setZ(i);
      card.rotate(this.rotates[i]);
    }
  }
}
class PoolDiv extends DeckDiv {
  constructor(div, pool) {
    super(div, pool);
    this.diffTop = 0;
    this.rotates = [];
    for (var i = 0; i < INIT_CARD_NUM_POOL + 5; i++) {
      this.rotates[i] = this.getRandomRotate(MAX_POOL_CARD_ROTATION);
    }
  }
  init(){
    for(var i=0; i<this.deck.getSize(); i++){
      this.deck.characters[i].card.faceup();
      //sound.deal();
    }
    this.paint();
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
  reset(){
    var rect = view.repository.firstCard.getBoundingClientRect();
    var left = rect.left;
    var top = rect.top;
    for(var i=0; i<this.deck.getSize(); i++){
      var card = this.deck.characters[i].card;
      card.unRotate();
      card.removePoolClass();
      card.facedown();
      card.setLeft(left);
      card.setTop(top);
    }
  }
  paint() {
    var rect = this.firstCard.getBoundingClientRect();
    var left = rect.left;
    var top = rect.top;
    var diffT = this.diffTop;
    var len = this.deck.getSize();
    for (var i = 0; i < len; i++) {
      var card = this.deck.characters[i].card;
      card.setLeft(left);
      card.setTop(top+diffT);
      card.setPoolClass(diffT);
      card.setZ(len - i);
      card.rotate(this.rotates[i]);
      left += this.offset;
      diffT = 0 - diffT;
    }
  }
}
class View {
  constructor() {
    this.hand0 = new DeckDiv(document.getElementById("hand0"), model.player0.hand);
    this.hand1 = new Hand1Div(document.getElementById("hand1"), model.player1.hand);
    this.pool = new PoolDiv(document.getElementById("pool"), model.pool);
    this.table0 = new TableDiv(document.getElementById("table0"), model.player0.table);
    this.table1 = new TableDiv(document.getElementById("table1"), model.player1.table);
    this.repository = new RepoDiv(document.getElementById("repository"), model.commonRepository);
    this.score0 = document.getElementById("score0");
    this.score1 = document.getElementById("score1");
    this.blocker = document.getElementById("blocker");
    this.info = document.getElementById("infobox");
  }
  reset(){
    //alert("aaa"+model.player0.score+"bbb");
    view.blocker.removeEventListener("click", controller.restart);
    this.notifyFinal("");
    this.updateScore();
  }
  restart(){
    view.hand0.init();
    view.hand1.init();
    view.pool.init();
  }
  init(){
    this.setSizes();
    this.table0.init();
    this.table1.init();
    var repo = document.getElementById("repository");
    var gap = Math.floor(20/DUMMY_CARD_NUM);
    var left = DUMMY_CARD_NUM * gap;
    for(var i=0; i<DUMMY_CARD_NUM; i++){
      let card = new Card(null);
      card.setTop(0);
      card.setLeft(left+"%");
      left -= gap;
      repo.appendChild(card.container);
    }
    this.repository.init();
    model.commonRepository.container = this.repository;
    model.player0.hand.container = this.hand0;
    model.player0.table.container = this.table0;
    model.player1.hand.container = this.hand1;
    model.player1.table.container = this.table1;
    model.pool.container = this.pool;

    window.addEventListener("resize", this.repaint.bind(this));
  }
  checkMatch1(){
    var len = this.hand1.deck.getSize();
    var chars = this.hand1.deck.characters;
    if(model.player1.matchable){
      this.notifyNoMatch("hidden");
      for (var i = 0; i < len; i++) {
        chars[i].card.removeController(controller.discard);
        chars[i].card.addController(controller.activate);
      }
    }
    else {
      this.notifyNoMatch("show");
      for (var i = 0; i < len; i++) {
        chars[i].card.removeController(controller.activate);
        chars[i].card.addController(controller.discard);
      }
      sound.discard();
    }
  }
  notifyNoMatch(display) {
    if (display == "show")
      this.info.textContent = "无牌可匹配\n需抛弃一张牌\n";
    else if(display == "hidden")
      this.info.textContent = "";
    else {
      this.info.textContent = display;
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
    var hand;
    if (player.id == 0) {
      //hand0 --> pool: show-cover
      //repo --> hand0:
      oldChar.card.faceup();
      hand = view.hand0;
    } else {
      //hand1 --> pool: remove discard listener
      //repo --> hand1: show-cover, add discard listener
      oldChar.card.removeController(controller.discard);
      newChar.card.addController(controller.discard);
      newChar.card.faceup();
      hand = view.hand1;
    }
    view.pool.paint();
    hand.paint();
  }
  redeal(){
    view.pool.init();
    view.repository.paint();
  }
  dealOne(char) {//repo to pool: faceup
    char.card.faceup();
    view.pool.paint();
    sound.deal();
  }
  obtain(player, handChar, poolChar, accomplished) {
    //handChar, poolChar -> table
    //handChar: faceup, remove controller: active
    //poolChar: unrotate
    var hand = player.id == 0 ? this.hand0 : this.hand1;
    var table = player.id == 0 ? this.table0 : this.table1;
    handChar.card.faceup();
    handChar.card.removeController(controller.activate);
    poolChar.card.unRotate();
    poolChar.card.removePoolClass();
    hand.paint();
    this.pool.paint();
    table.paint();
    this.updateScore();
    if(player.id ==1 && accomplished)
      sound.combo();
  }
  activate(oldChar, newChar) {
    this.hand1.activate(oldChar, newChar);
    this.pool.updateMatch(oldChar, newChar);
    if(newChar != null)
      sound.activate();
  }
  repaint(){
    this.setSizes();
    this.hand0.paint();
    this.hand1.paint();
    this.pool.paint();
    this.repository.paint();
    this.table0.paint();
    this.table1.paint();
  }
  setSizes() {
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var mainH = Math.floor(winH - winH * MAIN_MARGIN * 2);
    var mainW = Math.floor(winW - winH * MAIN_MARGIN * 2);
    var MAIN_RATIO = mainW/mainH;
    if(MAIN_RATIO > MAX_MAIN_RATIO)
      MAIN_RATIO = MAX_MAIN_RATIO;
    else if(MAIN_RATIO<MIN_MAIN_RATIO)
      MAIN_RATIO = MIN_MAIN_RATIO;
    if (mainW / mainH > MAIN_RATIO)
      mainW = Math.floor(mainH * MAIN_RATIO);
    else
      mainH = Math.floor(mainW / MAIN_RATIO);
    setCSSInt("--main-height", mainH);
    setCSSInt("--main-width", mainW);
    var tMargin = Math.floor((winH - mainH) / 2);
    setCSSInt("--main-margin", tMargin);
    var scbW = Math.floor(mainH * SCOREBOARD_WIDTH);
    setCSSInt("--scoreboard-width", scbW);
    var spbW = Math.floor(mainH * SPECIALBOARD_WIDTH);
    setCSSInt("--specialboard-width", spbW);
    var gamezoneW = mainW - scbW - spbW;
    setCSSInt("--gamezone-width", gamezoneW);
    var hand0H = Math.floor(mainH * HAND0_HEIGHT);
    setCSSInt("--hand0-height", hand0H);
    var hand1H = Math.floor(mainH * HAND1_HEIGHT);
    setCSSInt("--hand1-height", hand1H);
    var poolH = mainH - hand0H - hand1H;
    setCSSInt("--pool-height", poolH);
    var cardW = Math.floor(gamezoneW * (1 - 3 * HAND_LEFT_PADDING) / (9 * (1 - HAND_CARD_OVERLAP) + 1));
    var maxCardH = Math.floor(poolH/2);
    var cardH = Math.floor(cardW / CARD_RATIO);
    if (cardH > maxCardH) {
      cardH = maxCardH;
      cardW = Math.floor(cardH * CARD_RATIO);
    }
    setCSSInt("--card-width", cardW);
    setCSSInt("--card-height", cardH);
    var repoL = gamezoneW - Math.floor(cardW * 1.3);
    setCSSInt("--repository-left", repoL);
    var hand0CT = Math.floor((hand0H - cardH) / 2);
    setCSSInt("--hand0-card-top", hand0CT);
    var poolCT = Math.floor((poolH - cardH) / 2);
    setCSSInt("--pool-card-top", poolCT);
    var hand1CT = Math.floor((hand1H - cardH) * HAND1_CARD_TOP);
    setCSSInt("--hand1-card-top", hand1CT);
    var cardAT = 0-Math.floor((hand1H - cardH) * HAND1_ACTIVE_TOP);
    setCSSInt("--card-active-top", cardAT);
    var cardHT = Math.floor((hand1H - cardH) * HAND1_HOVER_TOP);
    setCSSInt("--card-hover-top", 0-cardHT);
    var poolHT = Math.floor(cardH/4);
    setCSSInt("--poolbottom-hover-top", poolHT);
    setCSSInt("--pooltop-hover-top", 0-poolHT);
    var scoreH = Math.floor(cardH*SCORE_HEIGHT);
    setCSSInt("--score-height", scoreH);
    var scbTT = Math.floor((mainH/2-cardH-scoreH)*TABLE_TOP);
    setCSSInt("--scoreboard-table-top", scbTT);
    var scbTL = Math.floor((scbW-cardW)/2);
    setCSSInt("--scoreboard-table-left", scbTL);
    var scbST = scbTT+cardH+Math.floor((mainH/2-cardH-scoreH)*SCORE_BELOW_TABLE);
    setCSSInt("--scoreboard-score-top", scbST);
    var blockLP = Math.floor(gamezoneW * HAND_LEFT_PADDING);
    setCSSInt("--block-left-padding", blockLP);

    var handOFS = Math.floor(cardW * (1 - HAND_CARD_OVERLAP));
    this.hand0.offset = handOFS;
    this.hand1.offset = handOFS;
    handOFS = Math.floor(handOFS/3);
    this.table0.offset = handOFS;
    this.table1.offset = handOFS;
    var poolOFS = Math.floor((gamezoneW * (1 - 3 * HAND_LEFT_PADDING)-cardW*2.25)/(INIT_CARD_NUM_POOL+1));
    //poolOFS = Math.floor(cardW * (1 - POOL_CARD_OVERLAP));
    this.pool.offset = poolOFS;
    var diffT = Math.floor(cardH / 4);
    this.pool.diffTop = diffT;
  }
  notifyFinal(msg){
    view.blocker.textContent=msg;
  }
  final(){
    view.blockGame();
    var msg;
    if(model.player1.score > model.player0.score){
      msg = "你赢了ヾ(^▽^*=)>";
      sound.win();
    }
    else if(model.player1.score < model.player0.score){
      msg = "你输了(ノへ￣、=)>";
      sound.lose();
    }
    else
      msg = "平手(;ﾟдﾟ)";
    view.notifyFinal(msg);
    delayedFunc(function(){
      msg += "\n点击牌桌任意位置重新开始";
      view.notifyFinal(msg);
      view.blocker.addEventListener("click", controller.restart);
    })
  }
}
let sound = new Sound();
let combos = new Combos();
let model = new Model();
let controller = new Controller();
let view = new View();
model.init();
