//consts

MAX_MAIN_RATIO = 2;//max width/height ratio of the main board
MIN_MAIN_RATIO = 1.5;//min width/height ratio of the main board
 MIN_MAIN_WIDTH = 500;
CARD_RATIO = 3 / 4; //width/height ratio of a card
MAX_POOL_CARD_ROTATION = 20; //max degree of rotation the pool cards turns
MAX_TABLE_CARD_ROTATION = 25; //max degree of rotation the table cards turns
HAND_CARD_OVERLAP = 0.44; //percent of neighboring cards that overlap in hand board
DUMMY_CARD_NUM = 5; //number of dummy cards in the repository div

var CARDH=0, CARDW=0, WINW=0, WINH=0, MAINW=0, MAINH=0;
var maindiv = document.getElementById("main");

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
    this.ac = new Audio('mp3/sooth.mp3');
    this.de = new Audio('mp3/select.wav');
    this.co = new Audio('mp3/combo.mp3');
    this.wi = new Audio('mp3/win.mp3');
    this.lo = new Audio('mp3/foolish.mp3');
    this.di = new Audio('mp3/discard.mp3');
  }
  activate(){this.ac.play();}
  deal(){this.de.play();}
  combo(){this.co.play();}
  win(){this.wi.play();}
  lose(){this.lo.play();}
  discard(){this.di.play();}
}
class Card{
  /*
  container classes: (deck info)
    faceup: all faceup cards except the active hand card
    poolcardt, poolcardb: the top/bottom cards in pool
    maybe:
    hand1card, table0card, table1card
  div: (effect info)
    glow: active cards in hand1 and pool
    pop: active card in hand1
  */
  constructor(char) {
    this.container = document.createElement("div");
    this.container.classList.add("cardcontainer");
    this.card = document.createElement("div");
    this.container.appendChild(this.card);
    this.card.id = char.id;
    this.card.classList.add("card");
    var front = document.createElement("div");
    this.card.appendChild(front);
    front.classList.add("cardfront");
    front.style.backgroundImage = "url('img/" + char.id + ".jpg')";
    var back = document.createElement("div");
    this.card.appendChild(back);
    back.classList.add("cardback");
  }
  onPoster(){
    this.card.firstElementChild.classList.add("poster");
    this.container.style.width = CARDW*1.2;
    this.container.style.height = CARDH*1.2;
    this.setZ(999);
  }
  offPoster(){
    this.card.firstElementChild.classList.remove("poster");
    this.container.style.width = CARDW;
    this.container.style.height = CARDH;
  }
  activate(){
    this.container.classList.remove("faceup");
    this.container.classList.add("pop");
    this.card.firstElementChild.classList.add("glow");
  }
  deactivate(){
    this.container.classList.add("faceup");
    this.container.classList.remove("pop");
    this.card.firstElementChild.classList.remove("glow");
  }
  match(){
    this.card.firstElementChild.classList.add("glow");
    this.addController(controller.obtain);
  }
  unmatch(){
    this.card.firstElementChild.classList.remove("glow");
    this.removeController(controller.obtain);
  }
  faceup(){
    this.card.style.transform = "rotateY(180deg)";
    this.container.classList.add("faceup");
  }
  facedown(){
    this.card.style.transform = "none";
    this.container.classList.remove("faceup");
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
    var dt = 1;
    for (var i = 0; i < len; i++) {
      var card = this.deck.characters[i].card;
      card.setLeft(left);
      card.setTop(top+dt);
      dt = 0 - dt;
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
  paint(){
    //shift the first few cards,
    var rect = this.firstCard.getBoundingClientRect();
    var left = rect.left;
    var top = rect.top;
    var len = this.deck.getSize();
    this.offset = CARDW/3/(this.deck.getSize());
    for (var i = len-1; i >= 0; i--) {
      var card = this.deck.characters[i].card;
      card.setLeft(left);
      left += this.offset;
      card.setTop(top);
      card.setZ(i);
    }
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
class Messenger {
  constructor(){
    this.banner = document.getElementById("combobanner");
    this.headline =  document.getElementById("combotext");
    this.poster = document.getElementById("combocards");
  }
  vanish(){
    //this.banner.style.right = WINW;
    //this.banner.style.opacity = 0.5;
    this.banner.style.transform = "rotateY(90deg)";
  }
  appear(){
    //this.banner.style.right = 0;
    this.banner.style.transform = "none";
    //this.banner.style.opacity = 1;
  }
  notifyCombo(comboCount, combos){
    if(comboCount > 0){
      var combo = combos[comboCount-1];
      var chars = combo.characters;
      var count = chars.length;
      var offset = CARDW * 1.2 + 10;
      var totalw = CARDW * 1.2 * count + 10*(count -1);
      var left = (WINW - totalw)/2;
      var pcards = this.poster.children;
      pcards[0].style.marginLeft = left;
      for(var i=0; i<count; i++){
        pcards[i].style.display = "block";
        pcards[i].style.backgroundImage = chars[i].getPortrait();
      }
      for(var i=count; i<6; i++)
        pcards[i].style.display = "none";
      this.headline.firstElementChild.textContent = combo.getName();
      this.headline.lastElementChild.textContent = combo.getScore();
      this.appear();
      sound.combo();
      delayedFunc(function(){
        view.messenger.vanish();
        delayedFunc(function(){
          view.messenger.notifyCombo(comboCount-1, combos);
        }, 1.5);
      },2.5);

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
    this.messenger = new Messenger();
  }
  reset(){
    //alert("aaa"+model.player0.score+"bbb");
    view.blocker.removeEventListener("click", controller.restart);
    this.updateScore();
    document.getElementById("finalcontainer").style.opacity = "0";
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
  obtain(player, handChar, poolChar) {
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
    //cardh, cardw, handoffset, pooloffset
    MAINW = window.innerWidth;
    MAINH = window.innerHeight;
    WINH = MAINH;
    WINW = MAINW;
    if(MAINW < MIN_MAIN_WIDTH)
      MAINW =  MIN_MAIN_WIDTH;
    if(MAINH < MIN_MAIN_WIDTH / MAX_MAIN_RATIO)
      MAINH = MIN_MAIN_WIDTH / MAX_MAIN_RATIO;
    if (MAINW / MAINH > MAX_MAIN_RATIO)
      MAINW = MAINH * MAX_MAIN_RATIO;
    else if (MAINW / MAINH < MIN_MAIN_RATIO)
      MAINH = MAINW / MIN_MAIN_RATIO;
    maindiv.style.width = MAINW;
    maindiv.style.height = MAINH;
    maindiv.style.marginTop = (WINH - MAINH)/2;

    CARDW = MAINW * 0.611 / (9 * (1 - HAND_CARD_OVERLAP) + 1);
    var maxCardH = MAINH * 0.206;
    CARDH = CARDW / CARD_RATIO;
    if (CARDH > maxCardH) {
      CARDH = maxCardH;
      CARDW = CARDH * CARD_RATIO;
    }
    setCSSInt("--card-width", CARDW);
    setCSSInt("--card-height", CARDH);
    setCSSInt("--main-height", MAINH);
    setCSSInt("--main-width", MAINW);
    var handOFS = CARDW * (1 - HAND_CARD_OVERLAP);
    this.hand0.offset = handOFS;
    this.hand1.offset = handOFS;
    handOFS = handOFS/3;
    this.table0.offset = handOFS;
    this.table1.offset = handOFS;
    var poolOFS = (MAINW*0.589-CARDW*2.25)/(INIT_CARD_NUM_POOL+1);
    this.pool.offset = poolOFS;
    var diffT = CARDH / 4;
    this.pool.diffTop = diffT;
  }
  final(){
    view.blockGame();
    var msg = document.getElementById("finalmsg");
    var div = document.getElementById("finalcontainer");
    if(model.player1.score > model.player0.score){
      //para.setAttribute('style', 'white-space: pre;');
      msg.textContent = "你赢了";
      sound.win();
    }
    else if(model.player1.score < model.player0.score){
      msg.textContent = "你输了";
      sound.lose();
    }
    else
      msg.textContent = "平手";
//    div.style.display = "block";
    div.style.opacity = "1";
    view.blocker.addEventListener("click", controller.restart);
  }
  combo(combo){
    this.messenger(combo);
    delayedFunc(function(){
      view.pool.paint();
      view.hand1.paint();
      view.table1.paint();
    },3)
  }
}
let sound = new Sound();
let combos = new Combos();
let model = new Model();
let controller = new Controller();
let view = new View();
model.init();
/*
var c = new TabledCombo(model.player1.hand.characters[0], 8);
c.addChar(model.player1.hand.characters[1]);
c.addChar(model.player1.hand.characters[2]);
c.addChar(model.player1.hand.characters[3]);
c.addChar(model.player1.hand.characters[5]);
c.addChar(model.player1.hand.characters[7]);
view.messenger.notifyCombo(c);
*/
