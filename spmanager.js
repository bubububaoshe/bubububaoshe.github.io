SPECIAL_CHAR_LIST = [
  ["blts1b", "fqx1a", "hy1a", "ly1a", "oysg1a", "qy1a","xl1a", "yqs1a", "fls1a", "xf1a", "blts1a", "fqx1b", "fls1b", "xl1b", "hy1b", "yqs1b"],
  ["hy2a", "qhzr2a", "sx2a", "sy2a", "wry2b", "xy2a", "xyz2a", "xyz2b", "ywy2a", "ywy2b", "yq2a", "wry2a", "ar2b", "ar2a"],
  []
];


class SPManager{
  constructor(){}
  setup(){
    this.specialRepoIDs = SPECIAL_CHAR_LIST[model.pack[0]-1].concat(SPECIAL_CHAR_LIST[model.pack[1]-1]);
    this.userSpecialRepoIDs = this.loadSpecials("qqxspecials");
    if(this.userSpecialRepoIDs.length > 0)
      model.player1.specialIDs = this.loadSpecials("qqxspecialpicks");
    else
      this.userSpecialRepoIDs.push(this.specialRepoIDs[getRandom(this.specialRepoIDs.length)]);
    //this.userSpecialRepoIDs = this.specialRepoIDs;
    this.userSpecialRepository = new SpecialRepository();
    this.userSpecialRepository.init(this.userSpecialRepoIDs);
  }
  createSpecial(id) {
    var char, trick;
    switch (id) {
      case "yqs1b":
          char = new SpecialCharacter("yqs1b", "尹千觞", "大狗", 6, "秋", "久把江湖宿，\n落拓年复年，\n唤醪濯尘骨，\n钓月伴酒仙。");
          trick = new ComboTrick("醉梦江湖", 20);
          char.addTrick(trick);
          trick = new RevealTrick(1);
          char.addTrick(trick);
      break;
      case "hy1b":
          char = new SpecialCharacter("hy1b", "红玉", "兔子", 6, "秋", "昔日匣中三尺水，\n曾与明月斗青霜。");
          trick = new ComboTrick("剑舞红袖", 30);
          char.addTrick(trick);
          trick = new UnnamedBanTrick();
          char.addTrick(trick);
      break;
      case "xl1b":
          char = new SpecialCharacter("xl1b", "襄铃", "熊猫", 6, "夏", "笑里秋千轻自语，\n背人斗草弄晴丝。");
          trick = new ComboTrick("黑衣少侠传", 30);
          char.addTrick(trick);
          trick = new DealTrick("下一回合一定出现一个《古剑奇谭一》的主要角色", ["百里屠苏", "风晴雪", "红玉", "尹千觞", "方兰生", "襄铃"], true);
          char.addTrick(trick);
      break;
    case "fls1b":
        char = new SpecialCharacter("fls1b", "方兰生", "蓝鲲", 6, "春", "庭中生嘉树，\n华叶自飘摇，\n温然发秀质，\n馥兰映琼瑶。");
        trick = new ComboTrick("永相随", 20);
        char.addTrick(trick);
        trick = new RevealTrick(1);
        char.addTrick(trick);
    break;
    case "fqx1b":
        char = new SpecialCharacter("fqx1b", "风晴雪", "绵羊", 6, "春", "寿无金石固，\n随时爱景光，\n与君一执手，\n衣袖十年香。");
        trick = new DealTrick("若焦炭在公共卡池中，则下一回合一定出现焦炭则", ["焦炭"], true);
        char.addTrick(trick);
        trick = new ComboTrick("厨房功夫", 20);
        char.addTrick(trick);
    break;
    case "blts1a":
        char = new SpecialCharacter("blts1a", "百里屠苏", "天墉", 4, "冬", "许向长空倾碧血，\n由他业火寸心摧。");
        trick = new CharTrick("古剑焚寂", 15);
        char.addTrick(trick);
        trick = new DealTrick("下一回合一定出现一个《古剑奇谭一》的主要角色", ["百里屠苏", "风晴雪", "红玉", "尹千觞", "方兰生", "襄铃"], true);
        char.addTrick(trick);
    break;
    case "ar2a":
        char = new SpecialCharacter("ar2a", "阿阮", "神女", 4, "春", "云垂水镜参差影，\n十二峰头月欲西。");
        trick = new ComboTrick("露草流萤", 15);
        char.addTrick(trick);
    break;
    case "ar2b":
        char = new SpecialCharacter("ar2b", "阿阮", "山鬼", 6, "春", "崔嵬未起逐风舞，\n羲和停云坠玉露。");
        trick = new DealTrick("若夏夷则在公共卡池中，则下一回合一定出现夏夷则", ["夏夷则"], true);
        char.addTrick(trick);
        trick = new RevealTrick(1);
        char.addTrick(trick);
    break;
      case "wry2a":
          char = new SpecialCharacter("wry2a", "闻人羽", "闺秀", 4, "秋", "塞雪连城堕婆娑，\n云雕怒马走冰河。");
          trick = new DealTrick("增加《古剑奇谭二》主要角色出现的概率", ["闻人羽", "乐无异", "夏夷则", "阿阮"], false);
          char.addTrick(trick);
      break;
      case "xf1a":
          char = new SpecialCharacter("xf1a", "巽芳", "寂桐", 4, "春", "妾心声声唤情郎，\n天涯处处皆苍茫。");
          trick = new DealTrick("若欧阳少恭在公共卡池中，则下一回合一定出现欧阳少恭", ["欧阳少恭"], true);
          char.addTrick(trick);
      break;
      case "fls1a":
          char = new SpecialCharacter("fls1a", "方兰生", "浮灯", 4, "春", "六艺四书全抛却，\n一身尽然素心香。");
          trick = new UnnamedBanTrick();
          char.addTrick(trick);
      break;
      case "yqs1a":
          char = new SpecialCharacter("yqs1a", "尹千觞", "巫咸", 4, "秋", "漫举觥筹殷殷劝，\n石火光隙寄此身。");
          trick = new DealTrick("若风晴雪在公共卡池中，则下一回合一定出现风晴雪", ["风晴雪"], true);
          char.addTrick(trick);
          trick = new UnnamedBanTrick("《古剑奇谭一》", ["百里屠苏", "风晴雪", "红玉", "襄铃", "方兰生","尹千觞"]);
          char.addTrick(trick);
      break;
      case "yq2a":
        char = new SpecialCharacter("yq2a", "禺期", "无名", 4, "夏", "贤者无名入神识， \n一片丹心报苍生。");
        trick = new ComboTrick(null, 10);
        char.addTrick(trick);
        trick = new DealTrick("增加昭明、古剑晗光、无名之剑出现的概率", ["昭明", "古剑晗光", "无名之剑"], false);
        char.addTrick(trick);
      break;
      case "xl1a":
        char = new SpecialCharacter("xl1a", "襄铃", "泉边掬影", 4, "夏", "谁家女儿娇， \n垂发尚年少，\n树下抱香眠，\n泉边掬影笑。");
        trick = new RevealTrick(1);
        char.addTrick(trick);
        trick = new DealTrick("下一回合一定出现一个《古剑奇谭一》的主要角色", ["百里屠苏", "风晴雪", "红玉", "尹千觞", "方兰生", "襄铃"], true);
        char.addTrick(trick);
      break;
      case "qy1a":
        char = new SpecialCharacter("qy1a", "悭臾", "水虺", 4, "夏", "榣山水湄遇长琴， \n通天彻地为知音。");
        trick = new ComboTrick(null, 10);
        char.addTrick(trick);
        trick = new RevealTrick(1);
        char.addTrick(trick);
      break;
      case "blts1b":
          char = new SpecialCharacter("blts1b", "百里屠苏", "黑猫", 6, "冬", "眼底无故人，\n世事冷如铁。\n谁与长相约，\n眉间刺新血。");
          trick = new DealTrick("若古剑焚寂在公共卡池中，则下一回合一定出现古剑焚寂", ["古剑焚寂"], true);
          char.addTrick(trick);
          trick = new ComboTrick("桃花幻梦", 30);
          char.addTrick(trick);
      break;
      case "fqx1a":
          char = new SpecialCharacter("fqx1a", "风晴雪", "凤曦", 4, "春", "好向寒节报花信，\n春风一脉动幽都。");
          trick = new CharTrick("百里屠苏", 15);
          char.addTrick(trick);
      break;
      case "ly1a":
          char = new SpecialCharacter("ly1a", "陵越", "掌门", 4, "冬", "任侠为道守仙门，\n见素抱朴未忘沉。");
          trick = new SwapTrick();
          char.addTrick(trick);
          char.setNoswap();
      break;
      case "oysg1a":
          char = new SpecialCharacter("oysg1a", "欧阳少恭", "蓬莱", 4, "秋", "偏有漏长惊永夜，\n梦魂又觉第几生。");
          trick = new UnnamedBanTrick();
          char.addTrick(trick);
          trick = new ComboTrick("芳华如梦", 20);
          char.addTrick(trick);
      break;
      case "hy1a":
          char = new SpecialCharacter("hy1a", "红玉", "道服", 4, "秋", "霜雪凝精神，\n桃花铸肌骨。\n还报一寸心，\n愿同尘与土。");
          trick = new CopyTrick();
          char.addTrick(trick);
          char.setNoswap();
      break;
      case "sy2a":
          char = new SpecialCharacter("sy2a", "沈夜", "紫微", 4, "冬", "天命难解此中局，\n神血护佑心魔曲。");
          trick = new DealTrick(" 下一回合一定出现一个流月城角色",["华月","沈曦","谢衣", "沈夜"], true);
          char.addTrick(trick);
          trick = new RevealTrick(2);
          char.addTrick(trick);
      break;
      case "sx2a":
          char = new SpecialCharacter("sx2a", "沈曦", "魔化", 4, "春", "稚童新衫犹未裁，\n一点红痕一世哀。");
          trick = new RevealTrick(2);
          char.addTrick(trick);
      break;
      case "xy2a":
          char = new SpecialCharacter("xy2a", "谢衣", "初七", 4, "夏", "霜刃初试驱长夜，\n破云开天相决绝。");
          trick = new ComboTrick("烈山遗族", 20);
          char.addTrick(trick);
          trick = new RevealTrick(1);
          char.addTrick(trick);
      break;
      case "hy2a":
          char = new SpecialCharacter("hy2a", "华月", "魔化", 4, "冬", "戾天狂歌琴声啸，\n朔雪为刃止喧嚣。");
          trick = new SwapTrick();
          char.addTrick(trick);
          char.setNoswap();
      break;
      case "wry2b":
          char = new SpecialCharacter("wry2b", "闻人羽", "天罡", 6, "秋", "天罡夜枕绿沉枪，\n敌血尚温金甲凉。");
          trick = new ComboTrick("蓝衫偃师记", 30);
          char.addTrick(trick);
          char.setNoswap();
      break;
      case "ywy2b":
          char = new SpecialCharacter("ywy2b", "乐无异", "偃师", 6, "夏", "金刚力士舞灵木，\n墨意非攻定乾坤。");
          trick = new RevealTrick(3);
          char.addTrick(trick);
          char.setNoswap();
      break;
      case "xyz2a":
          char = new SpecialCharacter("xyz2a", "夏夷则", "太华", 4, "冬", "江山倦夜眠孤客，\n红堕沾衣冷血痕。");
          trick = new ComboTrick("蓝衫偃师记", 20);
          char.addTrick(trick);
      break;
      case "xyz2b":
          char = new SpecialCharacter("xyz2b", "夏夷则", "鲛人", 6, "冬", "沧海遗珠鲛人泪，\n遗骨托生帝王脉。");
          trick = new UnnamedBanTrick();
          char.addTrick(trick);
          trick = new RevealTrick(2);
          char.addTrick(trick);
      break;
      case "qhzr2a":
          char = new SpecialCharacter("qhzr2a", "清和真人", "温留", 4, "秋", "赤血丹心照夙昔，\n殊途与归执道心。");
          trick = new NamedBanTrick("夏夷则");
          char.addTrick(trick);
          trick = new ComboTrick("温茶相待", 30);
          char.addTrick(trick);
      break;
      case "ywy2a":
          char = new SpecialCharacter("ywy2a", "乐无异", "捐毒", 4, "夏", "长安年少重游侠，\n抱酒弹铗杏花阴。");
          trick = new CopyTrick();
          char.addTrick(trick);
          char.setNoswap();
      break;
    }
    return char;
  }
  setAISpecials(){
      var aisizes = [0, Math.floor(model.player1.specialIDs.length/2), model.player1.specialIDs.length, MAX_SP_NUM];
      model.player0.specialIDs = this.getRandomSubarray(this.userSpecialRepoIDs, aisizes[SP_CARDS]);
  }
  getRandomSubarray(arr, len){
    if(len <= 0)
      return [];
  	var keep = [];
  	var arr = arr.slice(0);
    for(var i=0; i<len && arr.length > 0; i++){
      var val = arr[getRandom(arr.length)];
      keep.push(val);
      this.removeDuplicates(val, arr);
    }
    return keep;
  }
  removeDuplicates(id, ids){
    var id = id.substring(0, id.length - 1);
    var len = ids.length;
    for(var i=0, idx=0; i<len; i++)
      if(ids[idx].startsWith(id))
        ids.splice(idx, 1);
      else
        idx++;
  }
  saveSpecials(type, carray){
    if(type == null){
      this.saveSpecials("qqxspecials",this.userSpecialRepoIDs);
      this.saveSpecials("qqxspecialpicks", model.player1.specialIDs);
      return;
    }
    var arrs = [[],[]];
    for(var i=0; i<carray.length; i++)
      if(carray[i].includes(model.pack[0]))
        arrs[0].push(carray[i]);
      else
        if(carray[i].includes(model.pack[1]))
          arrs[1].push(carray[i]);
        else
          alert("Illegal SPChar ID:" + carray[i]);
    for(var i=0; i<2; i++)
      setCookie(type+model.pack[i], arrs[i]);
  }
  loadSpecials(type){
    return getCookie(type+model.pack[0]).concat(getCookie(type+model.pack[1]));
  }
  awardSpecials(){
    var minscore = BONUS_THRESHOLDS[AI_LEVEL-1] + (model.player1.specialIDs.length - model.player0.specialIDs.length) * 5;
    minscore = minscore>200? 200: minscore;
    if(model.player1.score >= minscore){
      var uspecials = this.userSpecialRepoIDs;
      var ulen = uspecials.length;
      var clen = this.specialRepoIDs.length;
      if(ulen < clen){
        var rand = getRandom(clen - ulen);
        var award;
        for(var i=0, idx=-1; i<clen; i++)
          if(!uspecials.includes(this.specialRepoIDs[i]) && ++idx == rand){
              award = this.specialRepoIDs[i];
              break;
            }
        uspecials.push(award);
        this.userSpecialRepository.addChar(this.createSpecial(award));
        this.saveSpecials("qqxspecials", uspecials);
        messenger.notifyAward(minscore, award);
      }
      return true;
    }
    return false;
  }
  hasDuplicates(id, ids){
    id = id.substring(0, id.length - 1);
    for(var i=0; i<ids.length; i++)
      if(ids[i].startsWith(id)){
        return true;}
    return false;
  }
}
function setCookie(cname, carray, exdays = 9999) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + carray.toString() + "; " + expires;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          var val = c.substring(name.length, c.length);
            if(val.length > 0)
              return val.split(",");
            else
              return [];
        }
    }
    return [];
}
