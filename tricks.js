class ObtainVector{
  // note: player is the one who plays the current turn. it may be AI
  // if player is AI, then oppo is the user
  // user refer to user player of the client
  constructor(){}
  init(player, handChar, poolChar){
    this.player = player;
    this.preScore = player.score;
    this.comboCount = 0;
    this.chars = [handChar, poolChar];
    this.copyChars =[null, null];
    this.swapChars = [null, null];
    // chars indeed tabled by the current player
    this.playerTableChars = [handChar, poolChar];
    // bans of playerTableChars
    this.banChars = [null, null];
    this.allChars = [handChar, poolChar];
  }

  getNextTrick(type){
    var so = this.getTrickSubjectObjectArrays(type);
    var subjects = so[0], objects = so[1];
    for(var i=0; i<subjects.length; i++){
      var trick = subjects[i].getTricks(type);
      if(trick != null && objects[i] == null){console.log("[计划释放技能]"+subjects[i].name+":"+trick.constructor.name);
          return trick;
      }
    }
    return null;
  }
  getTrickSubjectObjectArrays(type){
    var subjects, objects;
    switch(type){
      case "CopyTrick":
        subjects = this.chars;
        objects = this.copyChars;
        break;
      case "SwapTrick":
        subjects = this.chars;
        objects = this.swapChars;
        break;
      case "UnnamedBanTrick":
        subjects = this.playerTableChars;
        objects = this.banChars;
        break;
      case "RevealTrick":
      case "DealTrick":
        subjects = this.allChars;
        objects = null;
        break;
    }
    return [subjects, objects];
  }
  performReveal(){
    var chars = this.getTrickSubjectObjectArrays("RevealTrick")[0];
    for(var i=0; i<chars.length; i++){
      chars[i].performTricks("RevealTrick");
    }
  }
  performDeal(){
    var chars = this.getTrickSubjectObjectArrays("DealTrick")[0];
    for(var i=0; i<chars.length; i++){
      var nextdeal = chars[i].performTricks("DealTrick");
      if(nextdeal != null)
        return nextdeal;
    }
    return null;
  }
  trickSelector(type){
    // only cards obtained by user may invoke a selection panel, AI would just select by algorithm
    // show unfinished selector for tricks of <type>
    // return true if selector is invoked, false otherwise.
    var so = this.getTrickSubjectObjectArrays(type);
    var subjects = so[0], objects = so[1];
    for(var i=0; i<subjects.length; i++){
      var trick = subjects[i].getTricks(type);
      if(trick != null && objects[i] == null)
        if(trick.selectTarget())
          return true;
        else
          trick.performTrick(null);
    }
    return false;
  }
  getHandChar(){return this.chars[0];}
  getPoolChar(){return this.chars[1];}
  getTrickPair(type, idx){
    // preassumption: idx is valid
    var so = this.getTrickSubjectObjectArrays(type);
    var subjects = so[0], objects = so[1];
    if(idx == 0)
      if(objects[0] != null)
        return [subjects[0], objects[0]];
      else
        return [subjects[1], objects[1]];
    else
      return [subjects[1], objects[1]];;
  }
  getLastTrickPair(type){
    // returns the latest trick pair
    var so = this.getTrickSubjectObjectArrays(type);
    var subjects = so[0], objects = so[1];
    for(var i=objects.length-1; i>=0; i--)
      if(objects[i] != null)
        return [subjects[i], objects[i]];
    return null;
  }
  getTrickCount(type){
    var objects = this.getTrickSubjectObjectArrays(type)[1];
    return (objects[0]==null?0:1) (objects[1]==null?0:1);
  }
  /*
  setCopyTarget(target){
    //it's a noswap trick, so the trickplayer must be the current player
    this.setTrickTarget("CopyTrick", this.chars, this.copyChars, target);
  }
  setSwapTarget(target){
    if(this.chars[0].getTricks("SwapTrick") && this.swapChars[0] == null)
      this.swapChars[0] = target;
    else
      this.swapChars[1] = target;
  }
  setBanTarget(target){
    var pid = 1-target.owner.id;
    this.setTrickTarget("UnnamedBanTrick", this.groupedChars[pid], this.banChars[pid], target);
  }
  */
  setTrickTarget(type, target){
    var so = this.getTrickSubjectObjectArrays(type);
    var subjects = so[0], objects = so[1];
    var trick = null;
    for(var i=0; i<subjects.length; i++){
      trick = subjects[i].getTricks(type);
      if(trick != null && objects[i] == null){
        objects[i] = trick.performTrick(target);
        if(type == "SwapTrick"){
          this.playerTableChars[i] = objects[i];
          this.allChars.unshift(objects[i]);
          subjects[i].swapped = true;
          objects[i].swapped = true;
          var oppo = obtainVector.player.id==0?model.player1:model.player0;
          oppo.addTableChar(subjects[i]);
        }
        return;
      }
    }
    if(trick == null)
      console.log("Invalid Trick Target: " + target.name + "[" + type +"]");
  }
}
class Trick {
  constructor(description) {
    this.description = description;
    this.disabled = false;
  }
  enabled(){return !this.disabled;}
  performTrick(para) {
    console.log(this.owner.name + ": " + this.description);
  }
  getDesc(){
    return this.description;
  }
  recalculate(player){}
  setOwner(char){this.owner = char;}
  selectTarget(msg, controllerFunc){
    //show target selection panel
    //returns false if no valid target is found
    if(this.hasValidTarget(model.player0)) {
      oppoinfo.showSelectionPanel(this, msg, controllerFunc);
      return true;
    }
    return false;
  }
  clone(){return null;}
  isValidTarget(char){
    return true;
  }
  hasValidTarget(oppo){
    var chars = oppo.table.characters;
    for(var i=0; i<chars.length; i++)
      if(this.isValidTarget(chars[i]))
        return true;
    return false;
  }
}
class SwapTrick extends Trick{
  constructor(){
    super("交换对方任意一张牌。");
  }
  hasValidTarget(oppo){
    if(oppo.table.getSize() > 0)
      return true;
    return false;
  }
  selectTarget(){return super.selectTarget("与之交换", controller.selectSwap);}
  clone(){
    return new SwapTrick();
  }
  performTrick(char){
    if(char != null){console.log(this.owner.name + " <--> " + char.name);
      var oppo = obtainVector.player.id==0?model.player1:model.player0;
      oppo.removeTableChar(char);
      char = char.getSpecial(obtainVector.player.specials);
    }
    this.disabled = true;
    return char;
  }
}
class RevealTrick extends Trick{
  // reveal cardNumber of cards in opponent's hand
  constructor(number){
    super("随机翻开对手手牌"+number+"张。");
    this.cardNumber = number; //number of cards to reveal
  }
  performTrick() {console.log(this.owner.name+" 翻牌");
    //if player performs reveal trick, opponent's hand cards are revealed
    //if opponent performs reveal trick, player doesn't feel a thing
    if(this.owner.owner == model.player1)
      model.player0.hand.view.reveal(this.cardNumber);
  }
  clone(){return new RevealTrick(this.number);}
}
class DealTrick extends Trick{
  /*  definite =  true:
        the next deal is definitely one from <names> (if applicable)
      definite = false;
        the possibility that the next deal is from <names> is added by 1/2
  */

  constructor(description, names, definite){
    super(description);
    this.names = names;
    this.definite = definite;
  }
  performTrick() {console.log(this.owner.name+" 发牌");
    //returns a char from <names> with <probility>
    var cans = [];
    var repo = model.commonRepository.characters;
    for(var i=0; i<this.names.length; i++)
      for(var j=0; j<repo.length; j++)
        if(this.names[i] == repo[j].name)
          cans.push(repo[j]);
    if(this.definite || getRandom(2)==1){
      return cans[getRandom(cans.length)];
    }
    return null;
  }
  clone(){return new DealTrick(this.description, this.names, this.definite);}
}
class ComboTrick extends Trick{
  // add <bonus> to combo with <cname>
  constructor(cname, bonus){
    if(cname != null)
      super(cname + "的分数增加" + bonus + "分。");
    else
      super("自身能组成的组合每个增加" + bonus + "分。");
    this.comboName = cname;
    this.bonus = bonus;
  }
  performTrick(combo) {
    // add bonus to <combo> if applicable
    // preassumption: this combo contains the trick owner
    if(this.comboName == null || this.comboName == combo.getName()){console.log(this.owner.name+" 加持 "+combo.getName());
      return this.bonus;}
    return 0;
  }
  clone(){return new ComboTrick(this.comboName, this.bonus);}
}
class CharTrick extends Trick{
  // add <bonus> to tabled char with <cname>
  // note: only benefit chars on one's own side
  constructor(cname, bonus){
    super(cname + "的分数增加" + bonus + "分。");
    this.charName = cname;
    this.bonus = bonus;
  }
  performTrick(player) {
    /* check the players latest tabled char
      if it's me, check all previous tabled chars and add bonus if applicable
      if it's not me, check the last tabled char and add bonus if applicable
    */
    var chars = player.table.characters;
    var last = chars[chars.length -1];
    if(last == this.owner) {
      for(var i=0; i<chars.length-1; i++)
        if(chars[i].name == this.charName){console.log(this.owner.name+" 加持 "+this.charName);
          player.score += this.bonus;
          return;
        }
    }
    else {
      if(last.name == this.charName){console.log(this.owner.name+" 加持 "+this.charName);
        player.score += this.bonus;}
    }
  }
  recalculate(player){
    var chars = player.table.characters;
    for(var i=0; i<chars.length; i++)
      if(chars[i].name == this.charName){
        player.score += this.bonus;
        return;
      }
  }
  clone(){return new CharTrick(this.charName, this.bonus);}
}
class UnnamedBanTrick extends Trick{
  constructor(){
    super("禁用对方任意一张珍稀牌的技能。");
  }
  isValidTarget(char){
    return char.getTricks("ComboTrick,CharTrick") != null;
  }
  selectTarget(){return super.selectTarget("禁用其加分技能", controller.selectBan);}
  performTrick(char){
    if(char != null){
      console.log(this.owner.name + " 禁用 " + char.name);
      char.disabled = true;
      char.owner.recalculate();
    }
    this.disabled = true; //only works once
    return char;
  }
  clone(){return new UnnamedBanTrick();}
}
class NamedBanTrick extends Trick{
  constructor(name){
    super("禁用对方"+name+"珍稀牌的技能。");
    this.targetName = name;
  }
  performTrick(char){
    if(char.name == this.targetName && !char.disabled) {
      console.log(this.owner.name +" 禁用 " + char.name);
      char.disabled = true;
      //this.disabled = true;
      char.owner.recalculate();
      return true;
    }
    return false;
  }
  clone(){return new NamedBanTrick(this.targetName);}
}
class CopyTrick extends Trick{
  constructor(){
    super("复制对方任意一张珍稀牌的技能");
  }
  isValidTarget(char){
    return char.isSpecial() && char.getTricks("CopyTrick")==null;
  }
  selectTarget(){return super.selectTarget("复制其所有技能", controller.selectCopy);}
  performTrick(char){
    if(char != null){
      console.log(this.owner.name + " 复制 " + char.name);
      var tricks = char.tricks;
      for(var i=0; i<tricks.length; i++)
        if(tricks[i].constructor.name != "CopyTrick")
          this.owner.addTrick(tricks[i].clone());
    }
    this.disabled = true;
    return char;
  }
}
