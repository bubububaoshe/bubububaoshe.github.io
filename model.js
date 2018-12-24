/*
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>QQX Model</title>
</head>

<body>
<div>
    <label></label>
    <p style="width:215px;height:287px;"></p>
</div>
</body>
</html>
*/
COMMONCHARLIST = [
  [0, "沈夜", 4, "冬"],
  [1, "沈曦", 4, "春"],
  [2, "流月城", 4, "冬"],
  [3, "夏夷则", 4, "冬"],
  [4, "太华山", 4, "冬"],
  [5, "华月", 4, "冬"],
  [6, "乐无异", 4, "夏"],
  [7, "闻人羽", 4, "秋"]
];
PLAYERSPECIALS = [
  [],
  [201]
];
INITCARDNUMHAND = 2;
INITCARDNUMPOOL = 3

function setMsg(msg, portrait) {
  var para = document.querySelector('label');
  var pt = document.querySelector('p');
  para.setAttribute('style', 'white-space: pre;');
  para.textContent = msg;
  pt.style.backgroundImage = "url('" + portrait + "')";
}
class Trick {
  constructor(description) {
    this.description = description;
  }
  performTrick() {
    return this.description;
  }
}

class Character {
  constructor(id, name, score, season) {
    this.id = id;
    this.name = name;
    this.description = "img/" + id
    this.season = season;
    this.owner = null;
  }
  isSpecial() {
    return false;
  }
  getID(){
    return this.id;
  }
  getName() {
    return this.name;
  }
  getSeason() {
    return this.season;
  }
  getScore() {
    return this.score;
  }
  getPortrait() {
    return this.description + ".jpg";
  }
  getDesc() {
    var msg = this.id + "：" + this.getName() + "，" + this.getScore() + "分，" + this.getSeason() + "季\n";
    return msg;
  }
}

class SpecialCharacter extends Character {
  constructor(id, name, description, score, season) {
    super(id, name, description, score, season);
    this.tricks = [];
  }
  addTrick(trick) {
    this.tricks.push(trick);
  }
  isSpecial() {
    return true;
  }
  performTricks() {
    var msg = "",
      tlen = this.tricks.length;
    for (var i = 0; i < tlen; i++)
      msg += "技能" + (i + 1) + "：" + this.tricks[i].performTrick() + "\n";
    return msg;
  }
  getDesc() {
    var msg = super.getDesc();
    msg += this.performTricks();
    return msg;
  }
}

class Deck {
  constructor() {
    this.characters = [];
  }
  addCharacter(char) {
    this.characters.push(char);
  }
  addRandom(size, repo) {
    for (var i = 0; i < size; i++)
      this.addCharacter(repo.removeRandom());
  }
  clear() {
    this.characters.length = 0;
  }
  getChars(){
    return this.characters;
  }
  removeRandom() {
    var i = Math.floor((Math.random() * this.characters.length));
    var char = this.characters[i];
    this.characters.splice(i, 1);
    return char;
  }
  removeCharacter(char) {
    var target = -1,
      clen = this.characters.length;
    for (var i = 0; i < clen; i++) {
      if (this.characters[i] == char) {
        target = i;
        break;
      }
    }
    if (target < 0) return false;
    this.characters.splice(target, 1);
    return true;
  }
  removeCharacterByID(id) {
    var target = -1,
      clen = this.characters.length;
    for (var i = 0; i < clen; i++) {
      if (this.characters[i].id == id) {
        target = i;
        break;
      }
    }
    if (target < 0) return false;
    var char = this.characters[target];
    this.characters.splice(target, 1);
    return char;
  }
  getDesc() {
    var msg = "",
      clen = this.characters.length;
    for (var i = 0; i < clen; i++) {
      msg += this.characters[i].getDesc();
    }
    return msg;
  }
}
class Repository extends Deck {
  constructor(type) {
    super();
    if (type == "common")
      this.initCommonRepo();
    else if (type == "special")
      this.initSpecialRepo();
    else
      alert("Illegal Repository Type: " + type);
  }
  initCommonRepo() {
    var len = COMMONCHARLIST.length;
    for (var i = 0; i < len; i++) {
      let char = new Character(COMMONCHARLIST[i][0], COMMONCHARLIST[i][1], COMMONCHARLIST[i][2], COMMONCHARLIST[i][3]);
      this.addCharacter(char);
    }
    //let sx = new Character(1, "沈曦", 4, "春");
    //let lyc = new Character(2,"流月城", 4, "冬");
  }
  initSpecialRepo() {
    let sp = new SpecialCharacter(200, "沈夜", 6, "冬");
    let t1 = new Trick("打徒弟"),
      t2 = new Trick("打徒孙");
    sp.addTrick(t1);
    sp.addTrick(t2);
    this.addCharacter(sp);
    sp = new SpecialCharacter(201, "夏夷则", 6, "冬");
    t1 = new Trick("逸尘"), t2 = new Trick("小鱼干");
    sp.addTrick(t1);
    sp.addTrick(t2);
    this.addCharacter(sp);
  }
}
/*
    class Combo{
        constructor(name, score, characters){
            this.name = name;
            this.score = score;
            this.characters = characters;
        }
       getCharList(){return this.characters;}
    }
    */
class Player {
  constructor(id, commonRepo, specialRepo) {
    this.id = id;
    this.hand = new Deck();
    this.hand.addRandom(INITCARDNUMHAND, commonRepo);
    this.table = new Deck();
    this.specials = new Deck();
    this.specials.addRandom(1, specialRepo);
  }
  initSpecials(repo) {
    var slen = PLAYERSPECIALS[this.id].length;
    for (var i = 0; i < slen; i++) {
      this.specials.addCharacter(repo.removeCharacterByID(PLAYERSPECIALS[this.id][i]));
    }
  }
  getHand(){
    return this.hand;
  }
  getDesc() {
    var msg = "玩家" + this.id;
    msg += "\n手牌：\n" + this.hand.getDesc();
    msg += "桌面：\n" + this.table.getDesc();
    msg += "特殊牌：\n" + this.specials.getDesc();
    return msg;
  }
}

class Model {
  constructor() {
    this.commonRepository = new Repository("common");
    this.specialRepository = new Repository("special");
    this.player0 = new Player(0, this.commonRepository, this.specialRepository);
    this.player1 = new Player(1, this.commonRepository, this.specialRepository);
    this.pool = new Deck();
    this.pool.addRandom(INITCARDNUMPOOL, this.commonRepository);
  }
  getPlayer0(){
    return this.player0;
  }
  getPlayer1(){
    return this.player1;
  }
  getPool(){
    return this.pool;
  }
  getDesc() {
    var msg = this.player0.getDesc();
    msg += this.player1.getDesc();
    msg += "卡池\n" + this.pool.getDesc();
    return msg;
  }
}

function mTest() {
  let model = new Model();
  var msg = model.commonRepository.getDesc();
  msg += model.specialRepository.getDesc();
  setMsg(msg, model.player1.hand.characters[0].getPortrait());
}
//mTest();
