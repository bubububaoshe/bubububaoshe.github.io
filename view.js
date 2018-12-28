//consts
var MAINRATIO = 1920 / 1080; //width/height ratio of the main board
var CARDRATIO = 182 / 240; //width/height ratio of a card
var MAINMARGINPERCENT = 0.0; //margin of the main board wrt window size
var SCOREBOARDPERCENT = 0.333; //width of the score board wrt main width
var SPECIALBOARDPERCENT = 0.3; //width of the special card board wrt main width
var PLAYER0PERCENT = 0.28; //height of player0 hand board wrt table height
var PLAYER1PERCENT = 0.345; //height of player1 hand board wrt table height
var HANDLEFTPADDINGPERCENT = 0.04; //left padding of the hand boards in percent
var HANDTOPPERCENT = 0.7; //top of inactive cards at player1 hand board
var HANDTOPPERCENT2 = 0.4; //top of onfocus cards at player1 hand board
var HANDTOPPERCENT3 = 0.1; //top of active cards at player1 hand board
var HANDCARDOVERLAPPERCENT = 0.44; //percent of neighboring cards that overlap in hand board
var POOLCARDOVERLAPPERCENT = HANDCARDOVERLAPPERCENT * 0.9; //percent of neighboring cards that overlap in pool board
var MAXCARDROTATION = 15; //max degree of rotation the pool cards turns
var TABLETOPPERCENT = 0.1;//top margin of #table0 wrt scoreboard
var SCOREHEIGHTPERCENT = 0.5; //height of #score0 wrt card height
var SCOREBELOWTABLEPERCENT = 0.05; //distance of #score0 below #table0 in scoreboard wrt scoreboard height
var CARDBACKFILE = "img/back.jpg"; //file name of the back of a card

function blockGame(){
  var div = document.querySelector("#blocker");
  div.style.display = "block";
}
function unblockGame(){
  var div = document.querySelector("#blocker");
  div.style.display = "none";
}
function log(msg) {
  var para = document.querySelector("#scoreboard");
  para.setAttribute('style', 'white-space: pre;');
  para.textContent += msg + "\n";
}

function notifyNoMatch(display) {
  var div = document.querySelector("#infobox");
  if (display == "show")
    div.textContent = "无牌可匹配\n需抛弃一张牌\n";
  else
    div.textContent = "";
}

function notifyScore() {
  var div = document.querySelector("#infobox");
  div.textContent = model.getPlayer0().getScore()+"\n---\n"+model.getPlayer1().getScore();
}
function reflow() {
  document.getElementById('main').clientWidth;
}

function getCSSInt(name) {
  var cv = getComputedStyle(document.documentElement).getPropertyValue(name);
  return parseInt(cv);
}

function setCSSInt(name, val) {
  document.documentElement.style.setProperty(name, val + "px");
}

function createCardDiv(char, display) {
  var div = document.createElement("div");
  div.classList.add("card");
  div.id = char.getID();
  if (display == "show")
    div.style.backgroundImage = "url('" + char.getPortrait() + "')";
  else if (display == "hidden")
    div.style.backgroundImage = "url('" + CARDBACKFILE + "')";
  else
    alert("Invalid card display mode: " + display);
  return div;
}

function removeDiscardController(card) {
  card.removeEventListener("click", controller.discardCardClick);
}

function addDiscardController(card) {
  card.addEventListener("click", controller.discardCardClick);
}

function removeHand1ClickController(card) {
  card.removeEventListener("click", controller.hand1CardClick);
}

function addHand1ClickController(card) {
  card.addEventListener("click", controller.hand1CardClick);
}

function removePoolClickController(card) {
  card.removeEventListener("click", controller.poolCardClick);
}

function addPoolClickController(card) {
  card.addEventListener("click", controller.poolCardClick);
}
class DeckDiv {
  constructor(div) {
    this.container = div;
    this.offset = 0;
    this.leftPadding = 0;
  }
  setOffset(offset) {
    this.offset = offset;
  }
  setLeftPadding(left) {
    this.leftPadding = left;
  }
  initCards(chars, display) {
    for (var i = 0; i < chars.length; i++)
      this.container.appendChild((createCardDiv(chars[i], display)));
  }
  addCard(card) {
    //assumption: the deck is not empty before insertion
    var prevCard = this.container.firstChild;
    var left;
    if (prevCard) {
      left = parseInt(prevCard.style.left) + this.offset;
      this.container.insertBefore(card, prevCard);
    } else {
      this.container.appendChild(card);
      left = this.leftPadding;
    }
    reflow();
    card.style.left = left + "px";
  }
  removeCard(cid) {
    var card = this.container.querySelector("#" + cid);
    this.container.removeChild(card);
    this.repaint();
    return card;
  }
  repaint() {
    reflow();
    var cards = this.container.childNodes;
    var left = this.leftPadding;
    for (var i = cards.length - 1; i >= 0; i--) {
      cards[i].style.left = left + "px";
      left += this.offset;
    }
  }
}
class Hand0Div extends DeckDiv {
  constructor(div, player) {
    super(div);
    this.player = player;
    this.initCards(this.player.getHand().getChars(), "hidden");
  }
  showCard(card) {
    var id = getCardID(card);
    var char = model.getPool().getChar(id);
    card.style.backgroundImage = "url('" + char.getPortrait() + "')";
  }
}
class Hand1Div extends DeckDiv {
  constructor(div, player) {
    super(div);
    this.player = player;
    this.initCards(this.player.getHand().getChars(), "show");
  }
  addCard(card) {
    super.addCard(card);
    addHand1ClickController(card);
  }
  initCards(chars, display) {
    for (var i = 0; i < chars.length; i++) {
      var card = createCardDiv(chars[i], display);
      this.container.appendChild((card));
      card.addEventListener("click", controller.hand1CardClick);
    }
    //this.addCardController(controller.discardCardClick);
  }
  addDiscardController() {
    var cards = this.container.childNodes;
    for (var i = 0; i < cards.length; i++) {
      removeHand1ClickController(cards[i]);
      addDiscardController(cards[i]);
    }
  }
  removeDiscardController() {
    var cards = this.container.childNodes;
    for (var i = 0; i < cards.length; i++) {
      removeDiscardController(cards[i]);
      addHand1ClickController(cards[i]);
    }
  }
  updateActive(oldChar, newChar) {
    if (oldChar != null) {
      var card = this.container.querySelector("#" + oldChar.getID());
      card.classList.remove("pop");
      card.classList.remove("glow");
    }
    if (newChar != null) {
      var card = this.container.querySelector("#" + newChar.getID());
      card.classList.add("pop");
      card.classList.add("glow");
    }
  }
}
class PoolDiv extends DeckDiv {
  constructor(div, pool, controller) {
    super(div, controller);
    this.pool = pool;
    this.initCards(this.pool.getChars(), "show");
    this.rotates = [];
    for (var i = 0; i < INITCARDNUMPOOL * 2; i++) {
      this.rotates[i] = this.getRandomRotate();
    }
  }
  updateRedeal() {
    while (this.container.lastChild)
      this.container.removeChild(this.container.lastChild);
    this.initCards(this.pool.getChars(), "show");
    reflow();
    this.repaint();
  }
  getRandomRotate() {
    var rand = Math.floor((Math.random() * MAXCARDROTATION * 2));
    return (rand - MAXCARDROTATION) % 360;
  }
  addCard(card) {
    super.addCard(card);
    var i = this.container.childNodes.length - 1;
    var diffTop = Math.floor(getCSSInt("--card-height") / 4);
    var top = getCSSInt("--pool-card-top");
    if (i % 2 == 1)
      card.style.top = top + diffTop;
    else
      card.style.top = top - diffTop;
    this.rotates[i] = this.getRandomRotate();
    card.style.transform = 'rotate(' + this.rotates[i] + 'deg)';
  }
  updateMatch(oldChar, newChar) {
    //update card matchs in pool according to seasons
    //Match: glow, clickable
    var oldSeason, newSeason;
    if (oldChar == null)
      oldSeason = null;
    else
      oldSeason = oldChar.getSeason();
    if (newChar == null)
      newSeason = null;
    else
      newSeason = newChar.getSeason();
    if (oldSeason != newSeason) {
      var cards = this.container.childNodes;
      var chars = this.pool.getChars();
      for (var i = cards.length - 1; i >= 0; i--) {
        if (chars[i].getSeason() == oldSeason) {
          cards[i].classList.remove("glow");
          cards[i].removeEventListener("click", controller.poolCardClick);
        } else if (chars[i].getSeason() == newSeason) {
          cards[i].classList.add("glow");
          cards[i].addEventListener("click", controller.poolCardClick);
        }
      }
    }
  }
  repaint() {
    var cards = this.container.childNodes;
    var diffTop = Math.floor(getCSSInt("--card-height") / 4);
    var top = getCSSInt("--pool-card-top");
    var left = this.leftPadding;
    for (var i = cards.length - 1; i >= 0; i--) {
      cards[i].style.left = left;
      if (i % 2 == 1)
        cards[i].style.top = top + diffTop;
      else
        cards[i].style.top = top - diffTop;
      left += this.offset;
      cards[i].style.transform = 'rotate(' + this.rotates[i] + 'deg)';
    }
  }
}
class View {
  constructor() {
    this.hand0Div = new Hand0Div(document.getElementById("hand0"), model.getPlayer0(), controller);
    this.hand1Div = new Hand1Div(document.getElementById("hand1"), model.getPlayer1(), controller);
    this.poolDiv = new PoolDiv(document.getElementById("pool"), model.getPool(), controller);
    this.repaint();
    window.addEventListener("resize", this.repaint.bind(this));
  }
  updateDiscard(pid, oldChar, newChar) {
    if (pid == 0) {
      //hand0 --> pool: show-cover
      //repo --> hand0: hide-cover
      var hand = this.hand0Div;
      var card = hand.removeCard(oldChar.id);
      hand.showCard(card);
      this.poolDiv.addCard(card);
      card = createCardDiv(newChar, "hidden");
      hand.addCard(card);
    } else {
      //hand1 --> pool: remove discard listener
      //repo --> hand1: show-cover, add discard listener
      var hand = this.hand1Div;
      var card = hand.removeCard(oldChar.id);
      removeDiscardController(card);
      this.poolDiv.addCard(card);
      card = createCardDiv(newChar, "show");
      addDiscardController(card);
      hand.addCard(card);
    }
  }
  updateDeal(char) {
    var card = createCardDiv(char, "show");
    this.poolDiv.addCard(card);
  }
  updatePickPoolCard(pid, hcid, pcid) {
    var hand = pid == 0 ? this.hand0Div : this.hand1Div;
    var card = hand.removeCard(hcid);
    removeHand1ClickController(card);
    card = this.poolDiv.removeCard(pcid);
    removePoolClickController(card);
    notifyScore();
  }
  updateHand1Active(oldChar, newChar) {
    this.hand1Div.updateActive(oldChar, newChar);
    this.poolDiv.updateMatch(oldChar, newChar);
  }
  repaint() {
    this.setSizes();
    this.hand0Div.repaint();
    this.hand1Div.repaint();
    this.poolDiv.repaint();
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
    var tMargin = Math.floor((winH - mainH) / 2);
    var scbW = Math.floor(mainH * SCOREBOARDPERCENT);
    var spbW = Math.floor(mainH * SPECIALBOARDPERCENT);
    var gamezoneW = mainW - scbW - spbW;
    var player0H = Math.floor(mainH * PLAYER0PERCENT);
    var player1H = Math.floor(mainH * PLAYER1PERCENT);
    var poolH = mainH - player0H - player1H;
    var cardW = Math.floor(gamezoneW * (1 - 3 * HANDLEFTPADDINGPERCENT) / (9 * (1 - HANDCARDOVERLAPPERCENT) + 1));
    var cardH = Math.floor(cardW / CARDRATIO);
    var cardIL = gamezoneW - Math.floor(cardW * 1.3);
    var hand0CT = Math.floor((player0H - cardH) / 2);
    var poolCT = Math.floor((poolH - cardH) / 2);
    var hand1CT = Math.floor((player1H - cardH) * HANDTOPPERCENT);
    var hand1CT2 = Math.floor((player1H - cardH) * HANDTOPPERCENT2);
    var hand1CT3 = Math.floor((player1H - cardH) * HANDTOPPERCENT3);

    var scoreH = Math.floor(cardH*SCOREHEIGHTPERCENT);
    var scbTT = Math.floor(mainH*TABLETOPPERCENT);
    var scbTL = Math.floor((scbW-cardW)/2);
    var scbST = scbTT+cardH+Math.floor(mainH*SCOREBELOWTABLEPERCENT);
    setCSSInt("--score-height", scoreH);
    setCSSInt("--scoreboard-table-top", scbTT);
    setCSSInt("--scoreboard-table-left", scbTL);
    setCSSInt("--scoreboard-score-top", scbST);

    var handOFS = Math.floor(cardW * (1 - HANDCARDOVERLAPPERCENT));
    var poolOFS = Math.floor(cardW * (1 - POOLCARDOVERLAPPERCENT));
    var blockLP = Math.floor(gamezoneW * HANDLEFTPADDINGPERCENT);

    setCSSInt("--main-height", mainH);
    setCSSInt("--main-width", mainW);
    setCSSInt("--main-margin", tMargin);
    setCSSInt("--scoreboard-width", scbW);
    setCSSInt("--specialboard-width", spbW);
    setCSSInt("--gamezone-width", gamezoneW);
    setCSSInt("--hand0-height", player0H);
    setCSSInt("--hand1-height", player1H);
    setCSSInt("--pool-height", poolH);
    setCSSInt("--card-width", cardW);
    setCSSInt("--card-height", cardH);
    setCSSInt("--card-init-left", cardIL);
    setCSSInt("--hand0-card-top", hand0CT);
    setCSSInt("--pool-card-top", poolCT);
    setCSSInt("--hand1-card-top", hand1CT);
    setCSSInt("--hand1-card-top2", hand1CT2);
    setCSSInt("--hand1-card-top3", hand1CT3);

    this.hand0Div.setOffset(handOFS);
    this.hand1Div.setOffset(handOFS);
    this.poolDiv.setOffset(poolOFS);
    this.hand0Div.setLeftPadding(blockLP);
    this.hand1Div.setLeftPadding(blockLP);
    this.poolDiv.setLeftPadding(blockLP);
  }

  getHand0() {
    return this.hand0Div;
  }
  getHand1() {
    return this.hand1Div;
  }
  getPool() {
    return this.poolDiv;
  }
}

let model = new Model();
let controller = new Controller();
let view = new View();
model.handlePlayer1NoMatch();
