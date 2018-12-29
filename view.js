//consts
{
MAINRATIO = 1920 / 1080; //width/height ratio of the main board
CARDRATIO = 182 / 240; //width/height ratio of a card
MAINMARGINPERCENT = 0.0; //margin of the main board wrt window size
SCOREBOARDPERCENT = 0.333; //width of the score board wrt main width
SPECIALBOARDPERCENT = 0.3; //width of the special card board wrt main width
PLAYER0PERCENT = 0.28; //height of player0 hand board wrt table height
PLAYER1PERCENT = 0.345; //height of player1 hand board wrt table height
HANDLEFTPADDINGPERCENT = 0.04; //left padding of the hand boards in percent
HANDTOPPERCENT = 0.7; //top of inactive cards at player1 hand board
HANDTOPPERCENT2 = 0.4; //top of onfocus cards at player1 hand board
HANDTOPPERCENT3 = 0.1; //top of active cards at player1 hand board
HANDCARDOVERLAPPERCENT = 0.44; //percent of neighboring cards that overlap in hand board
POOLCARDOVERLAPPERCENT = HANDCARDOVERLAPPERCENT * 1.1; //percent of neighboring cards that overlap in pool board
MAXCARDROTATION = 10; //max degree of rotation the pool cards turns
SCOREHEIGHTPERCENT = 0.5; //height of #score0 wrt card height
TABLETOPPERCENT = 0.7;//top margin of #table0 wrt scoreboard
SCOREBELOWTABLEPERCENT = 0.1; //distance of #score0 below #table0 in scoreboard wrt scoreboard
CARDBACKFILE = "back"; //file name of the back of a card
DUMMYCARDNUM = 5; //number of dummy cards in the repository div
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
    this.div.classList.add("faceup");
  }
  facedown(){
    this.div.style.backgroundImage = "url('img/" + CARDBACKFILE + ".jpg')";
    this.div.classList.remove("faceup");
  }
  activate(){
    this.div.classList.add("pop");
    this.div.classList.add("glow");
  }
  deactivate(){
    this.div.classList.remove("pop");
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
    for (var i = 0; i < this.deck.getSize(); i++) {
      var card = this.deck.characters[i].card;
      card.setLeft(left);
      card.setTop(top);
      card.setZ(i);
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
class PoolDiv extends DeckDiv {
  constructor(div, pool) {
    super(div, pool);
    this.diffTop = 0;
    this.rotates = [];
    for (var i = 0; i < INITCARDNUMPOOL + 5; i++) {
      this.rotates[i] = this.getRandomRotate(MAXCARDROTATION);
    }
  }
  init(){
    for(var i=0; i<this.deck.getSize(); i++){
      this.deck.characters[i].card.faceup();
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
  paint() {
    var rect = this.firstCard.getBoundingClientRect();
    var left = rect.left;
    var top = rect.top;
    var diffT = this.diffTop;
    for (var i = 0; i < this.deck.getSize(); i++) {
      var card = this.deck.characters[i].card;
      card.setLeft(left);
      card.setTop(top+diffT);
      card.setZ(i);
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
    this.table0 = new DeckDiv(document.getElementById("table0"), model.player0.table);
    this.table1 = new DeckDiv(document.getElementById("table1"), model.player1.table);
    this.repository = new RepoDiv(document.getElementById("repository"), model.commonRepository);
    this.score0 = document.getElementById("score0");
    this.score1 = document.getElementById("score1");
    this.blocker = document.getElementById("blocker");
    this.info = document.getElementById("infobox");
  }
  init(){
    this.setSizes();
    var repo = document.getElementById("repository");
    var gap = Math.floor(20/DUMMYCARDNUM);
    var left = DUMMYCARDNUM * gap;
    for(var i=0; i<DUMMYCARDNUM; i++){
      let card = new Card(null);
      card.setTop(0);
      card.setLeft(left+"%");
      left -= gap;
      repo.appendChild(card.container);
    }
    this.repository.init();
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
    }
  }
  notifyNoMatch(display) {
    if (display == "show")
      this.info.textContent = "无牌可匹配\n需抛弃一张牌\n";
    else
      this.info.textContent = "";
  }
  blockGame(){
    this.blocker.style.display = "block";
  }
  unblockGame(){
    this.blocker.style.display = "none";
  }
  delayedFunc(func, timeUnits){
    this.blockGame();
    setTimeout(function(){
      func.call();
      this.unblockGame();
    }, Math.floor(OPERATIONDELAY*timeUnits));
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
      hand = this.hand0;
    } else {
      //hand1 --> pool: remove discard listener
      //repo --> hand1: show-cover, add discard listener
      oldChar.card.removeController(controller.discard);
      newChar.card.addController(controller.discard);
      newChar.card.faceup();
      hand = this.hand1;
    }
    this.pool.paint();
    this.delayedFunc(hand.paint);
  }
  dealOne(char) {//repo to pool: faceup
    char.card.faceup();
    this.delayedFunc(view.pool.paint);
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
    hand.paint();
    this.pool.paint();
    table.paint();
    this.updateScore();
  }
  activate(oldChar, newChar) {
    this.hand1.activate(oldChar, newChar);
    this.pool.updateMatch(oldChar, newChar);
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
    var mainH = Math.floor(winH - winH * MAINMARGINPERCENT * 2);
    var mainW = Math.floor(winW - winH * MAINMARGINPERCENT * 2);
    if (MAINRATIO > 0) {
      if (mainW / mainH > MAINRATIO)
        mainW = Math.floor(mainH * MAINRATIO);
      else
        mainH = Math.floor(mainW / MAINRATIO);
    }
    setCSSInt("--main-height", mainH);
    setCSSInt("--main-width", mainW);
    var tMargin = Math.floor((winH - mainH) / 2);
    setCSSInt("--main-margin", tMargin);
    var scbW = Math.floor(mainH * SCOREBOARDPERCENT);
    setCSSInt("--scoreboard-width", scbW);
    var spbW = Math.floor(mainH * SPECIALBOARDPERCENT);
    setCSSInt("--specialboard-width", spbW);
    var gamezoneW = mainW - scbW - spbW;
    setCSSInt("--gamezone-width", gamezoneW);
    var player0H = Math.floor(mainH * PLAYER0PERCENT);
    setCSSInt("--hand0-height", player0H);
    var player1H = Math.floor(mainH * PLAYER1PERCENT);
    setCSSInt("--hand1-height", player1H);
    var poolH = mainH - player0H - player1H;
    setCSSInt("--pool-height", poolH);
    var cardW = Math.floor(gamezoneW * (1 - 3 * HANDLEFTPADDINGPERCENT) / (9 * (1 - HANDCARDOVERLAPPERCENT) + 1));
    setCSSInt("--card-width", cardW);
    var cardH = Math.floor(cardW / CARDRATIO);
    setCSSInt("--card-height", cardH);
    var repoL = gamezoneW - Math.floor(cardW * 1.3);
    setCSSInt("--repository-left", repoL);
    var hand0CT = Math.floor((player0H - cardH) / 2);
    setCSSInt("--hand0-card-top", hand0CT);
    var poolCT = Math.floor((poolH - cardH) / 2);
    setCSSInt("--pool-card-top", poolCT);
    var hand1CT = Math.floor((player1H - cardH) * HANDTOPPERCENT);
    setCSSInt("--hand1-card-top", hand1CT);
    var cardAT = 0-Math.floor((player1H - cardH) * HANDTOPPERCENT2);
    setCSSInt("--card-active-top", cardAT);
    var cardHT = 0-Math.floor((player1H - cardH) * HANDTOPPERCENT3);
    setCSSInt("--card-hover-top", cardHT);
    var scoreH = Math.floor(cardH*SCOREHEIGHTPERCENT);
    setCSSInt("--score-height", scoreH);
    var scbTT = Math.floor((mainH/2-cardH-scoreH)*TABLETOPPERCENT);
    setCSSInt("--scoreboard-table-top", scbTT);
    var scbTL = Math.floor((scbW-cardW)/2);
    setCSSInt("--scoreboard-table-left", scbTL);
    var scbST = scbTT+cardH+Math.floor((mainH/2-cardH-scoreH)*SCOREBELOWTABLEPERCENT);
    setCSSInt("--scoreboard-score-top", scbST);
    var blockLP = Math.floor(gamezoneW * HANDLEFTPADDINGPERCENT);
    setCSSInt("--block-left-padding", blockLP);

    var handOFS = Math.floor(cardW * (1 - HANDCARDOVERLAPPERCENT));
    this.hand0.offset = handOFS;
    this.hand1.offset = handOFS;
    var poolOFS = Math.floor(cardW * (1 - POOLCARDOVERLAPPERCENT));
    this.pool.offset = poolOFS;
    var diffT = Math.floor(cardH / 4);
    this.pool.diffTop = diffT;
  }
}

let model = new Model();
let controller = new Controller();
let view = new View();
model.init();

//model.handlePlayer1NoMatch();
