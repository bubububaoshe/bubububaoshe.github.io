COMMONCHARLIST = [
  [0, "沈夜", 4, "冬"],
  [1, "沈曦", 4, "春"],
  [2, "流月城", 4, "冬"],
  [3, "夏夷则", 4, "冬"],
  [4, "太华山", 4, "冬"],
  [5, "华月", 4, "冬"],
  [6, "天墉城", 4, "夏"],
  [7, "黑龙鳞片", 4, "夏"],
  [8, "北洛", 4, "春"],
  [9, "云无月", 4, "冬"],
  [10, "岑婴", 4, "夏"],
  [11, "司危", 4, "春"],
  [12, "玄戈", 4, "秋"],
  [13, "霓商", 4, "夏"],
  [14, "姬轩辕", 4, "秋"],
  [15, "缙云", 4, "夏"],
  [16, "半魂莲", 4, "秋"],
  [17, "天鹿", 4, "秋"],
  [18, "巫炤", 4, "冬"],
  [19, "太岁", 4, "春"],
  [20, "蜃珠", 4, "夏"],
  [21, "无名之地", 4, "冬"],
  [22, "天鹿城", 4, "秋"],
  [23, "巫之国", 4, "冬"],
  [24, "西陵", 4, "春"],
  [25, "嫘祖", 4, "夏"],
  [26, "陵越", 4, "冬"],
  [27, "悭臾", 4, "夏"],
  [28, "风晴雪", 4, "春"],
  [29, "昭明", 4, "春"],
  [30, "古剑焚寂", 4, "夏"],
  [31, "阿阮", 4, "春"],
  [32, "禺期", 4, "夏"],
  [33, "乐无异", 4, "夏"],
  [34, "忘川", 4, "冬"],
  [35, "露草", 4, "春"],
  [36, "紫榕林", 4, "秋"],
  [37, "清和真人", 4, "秋"],
  [38, "巽芳", 4, "春"],
  [39, "古剑红玉", 4, "夏"],
  [40, "青玉司南佩", 4, "春"],
  [41, "无名之剑", 4, "秋"],
  [42, "长安", 4, "春"],
  [43, "古剑晗光", 4, "冬"],
  [44, "金麒麟", 4, "秋"],
  [45, "襄铃", 4, "夏"],
  [46, "通天之器", 4, "秋"],
  [47, "巫山", 4, "夏"],
  [48, "风里沙", 4, "秋"],
  [49, "凌星见", 4, "春"],
  [50, "闻人羽", 4, "秋"],
  [51, "百草谷", 4, "夏"]
];
PLAYERSPECIALS = [
  [214],
  [203, 200]
];

INITCARDNUMHAND = 10;
INITCARDNUMPOOL = 8;
//configurable settings
var AILEVEL = "巫炤";

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
    this.description = "img/" + id;
    this.score = score;
    this.season = season;
    this.owner = null;
  }
  isSpecial() {
    return false;
  }
  setOwner(owner) {
    this.owner = owner;
  }
  getID() {
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
    return "img/" + this.id + ".jpg";
  }
  getDesc() {
    var msg = this.id + "：" + this.getName() + "，" + this.getScore() + "分，" + this.getSeason() + "季, 归属玩家" + (this.owner == null ? "-" : this.owner.id) + "\n";
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
  addChar(char) {
    this.characters.unshift(char);
  }
  initDeck(size, repo) {
    for (var i = 0; i < size; i++)
      this.addChar(repo.removeRandom());
  }
  addRandom(repo) {
    if (repo.characters.length == 0) {
      log("Empty deck!!!!!!!!!!!!!!!!!");
      return null;
    }
    var char = repo.removeRandom();
    this.addChar(char);
    return char;
  }
  getMatch(char) {
    var s = char.getSeason();
    var len = this.characters.length;
    for (var i = 0; i < len; i++)
      if (this.characters[i].getSeason() == s)
        return this.characters[i];
    return null;
  }
  clear() {
    this.characters.length = 0;
  }
  getChars() {
    return this.characters;
  }
  removeRandom() {
    var i = Math.floor((Math.random() * this.characters.length));
    var char = this.characters[i];
    this.characters.splice(i, 1);
    return char;
  }
  removeChar(char) {
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
  removeCharByID(id) {
    var target = -1,
      clen = this.characters.length;
    for (var i = 0; i < clen; i++) {
      if (this.characters[i].getID() == id) {
        target = i;
        break;
      }
    }
    if (target < 0) return false;
    var char = this.characters[target];
    this.characters.splice(target, 1);
    return char;
  }
  getChar(id) {
    var clen = this.characters.length;
    for (var i = 0; i < clen; i++)
      if (this.characters[i].getID() == id)
        return this.characters[i];
    return null;
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
      this.addChar(char);
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
    this.addChar(sp);
    sp = new SpecialCharacter(203, "夏夷则", 6, "冬");
    t1 = new Trick("逸尘"), t2 = new Trick("小鱼干");
    sp.addTrick(t1);
    sp.addTrick(t2);
    this.addChar(sp);
    sp = new SpecialCharacter(214, "姬轩辕", 6, "秋");
    t1 = new Trick("失忆"), t2 = new Trick("做梦");
    sp.addTrick(t1);
    sp.addTrick(t2);
    this.addChar(sp);
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
    this.hand.initDeck(INITCARDNUMHAND, commonRepo);
    this.table = new Deck();
    this.specials = new Deck();
    this.matchable = true;
    //this.specials.addRandom(1, specialRepo);
  }
  initSpecials(repo) {
    var slen = PLAYERSPECIALS[this.id].length;
    for (var i = 0; i < slen; i++) {
      this.specials.addChar(repo.removeCharacterByID(PLAYERSPECIALS[this.id][i]));
    }
  }
  addChar(char) {
    this.table.addChar(char);
    char.setOwner(this);
  }
  getHand() {
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
    this.pool.initDeck(INITCARDNUMPOOL, this.commonRepository);
    this.activeChar = null;
  }
  discardCard(player, char){
    if(char == null)
      char = player.hand.removeRandom();
    else
      player.hand.removeChar(char);
    this.pool.addChar(char);
    var newChar = player.hand.addRandom(this.commonRepository);
    log((player==this.player0?"AI":"你") +"抛弃「"+char.name+"」换取一只「"+newChar.name+"」");
    view.updateDiscard(player.id, char, newChar);
  }
  needRedeal(){
    return this.pool.getChars().length>=INITCARDNUMPOOL+2;
  }
  redeal(){
    var chars = this.commonRepository.characters;
    this.commonRepository.characters = chars.concat(this.pool.getChars());
    this.pool.clear();
    this.pool.initDeck(INITCARDNUMPOOL, this.commonRepository);
    view.getPool().updateRedeal();
  }
  handlePlayer1NoMatch(){
    if(!this.hasMatch(this.player1)){
      if(this.needRedeal()){
        setTimeout(function(){
          model.redeal();
          model.handlePlayer1NoMatch();
        }, OPERATIONDELAY*2);
        //this.redeal();
        //this.
      }
      else if(this.player1.matchable){
        this.player1.matchable = false;
        notifyNoMatch("show");
        view.getHand1().addDiscardController();
      }
    }
    else if(!this.player1.matchable){
      notifyNoMatch("hidden");
      this.player1.matchable = true;
      view.getHand1().removeDiscardController();
    }
  }
  hasMatch(player){
    var match = this.pickLeft(player);
    return match!=null;
  }
  dealOne(char) {
    if (char == null)
      var char = this.pool.addRandom(this.commonRepository);
    else
      this.pool.addChar(char);//log("发牌:"+char.getDesc());
    view.updateDeal(char);
  }
  pickLeft(player){
      var poolChars = this.pool.getChars();
      var hand = player.getHand();
      var poolChar = null;
      var handChar = null;
      for (var i = poolChars.length -1; i >= 0 ; i--) {
        handChar = hand.getMatch(poolChars[i]);
        if (handChar != null) {
          poolChar = poolChars[i];
          break;
        }
      }
      if (handChar != null)
        return [handChar, poolChar];
      return null;
  }
  aiPick() {
    //returns an array [hand pick, pool pick]
    switch (AILEVEL) {
      case "巫炤":
        return this.pickLeft(this.player0);
        break;
      default: log("Invalid AI　Level!!!!!!!!");
        return null;
    }
  }
  aiDiscard(){
    switch (AILEVEL) {
      case "巫炤":
        return null;
        break;
      default: log("Invalid AI　Level!!!!!!!!");
        return null;
    }
  }
  makeOpponentPick() {
    var pick = this.aiPick();
    if (pick == null) {
      if(this.needRedeal())
        this.redeal();
      else {
        var discard = this.aiDiscard();
        this.discardCard(this.player0, discard);
      }
      this.makeOpponentPick();
    }
    else
    this.pickCard(this.player0, pick[0], pick[1]);
  }
  pickCard(player, handChar, poolChar) {
    this.pool.removeChar(poolChar);
    player.hand.removeChar(handChar);
    player.addChar(poolChar);
    player.addChar(handChar);
    view.updatePickPoolCard(player.id, handChar.id, poolChar.id);
    log((player==this.player0?"AI用「":"你用「")+handChar.name +"」吸引到一只「"+ poolChar.name+"」");
  }
  setHand1Active(char) {
    if (this.activeChar == null || this.activeChar != char) {
      view.updateHand1Active(this.activeChar, char);
      this.activeChar = char;
    } else {
      view.updateHand1Active(this.activeChar, null);
      this.activeChar = null;
    }
  }
  getActiveChar() {
    return this.activeChar;
  }
  getPlayer0() {
    return this.player0;
  }
  getPlayer1() {
    return this.player1;
  }
  getPool() {
    return this.pool;
  }
  getDesc() {
    var msg = this.player0.getDesc();
    msg += this.player1.getDesc();
    msg += "卡池\n" + this.pool.getDesc();
    return msg;
  }
}
