/*
maximum combo name size: 8
maximum combo size: 6
*/
INIT_CARD_NUM_HAND = 10;
INIT_CARD_NUM_POOL = 8;
POOL_CAPACITY = INIT_CARD_NUM_POOL + 2;
BONUS_THRESHOLDS = [170, 140, 110];
MAX_SP_NUM = 15;

DEFAULT_CHAR_POEM = "";
COMMON_CHAR_LIST = [
  [
    ['ly1','陵越',2,'冬','剑意御风凌山月，\n往事伴烛映霜雪。'],
    ['qy1','悭臾',2,'夏','东海祖州识命魂，\n不周山下多古意。'],
    ['fqx1','风晴雪',2,'春','青丝银栉别样梳，\n天付婆娑入画图。'],
    ['tyc1','天墉城',2,'夏','昆仑山巅修至道，\n剑御四野灵空明。'],
    ['hllp1','黑龙鳞片',2,'夏','浮云一别未虚掷，\n光阴荏冉故人来。'],
    ['gjfj1','古剑焚寂',2,'夏','琴心剑魄今何在，\n留见星虹贯九天。'],
    ['zrl1','紫榕林',2,'秋','湖天春色归路迷，\n幼狐梦醒眼迷离。'],
    ['xf1','巽芳',2,'春','芳华如梦佳期逝，\n蓦然回首柔情旧。'],
    ['gjhy1','古剑红玉',2,'夏','枫落龙渊宿此间，\n青锋不再伴恨眠。'],
    ['qysnp1','青玉司南佩',2,'春','曲终人散心不悔，\n一魂一魄永相随。'],
    ['xl1','襄铃',2,'夏','额前未肯点胭脂，\n懒把相思细细知。'],
    ['blts1','百里屠苏',2,'冬','古剑铁衣映清辉，\n百劫阎浮一念微。'],
    ['fls1','方兰生',2,'春','嫏嬛久觅紫云乡，\n半枕清风鹤梦长。'],
    ['yqs1','尹千觞',2,'秋','江湖肝胆风波促，\n万里云山醉梦真。'],
    ['hy1','红玉',2,'秋','九重环佩艳琳琅，\n一段红绡旖旎长。'],
    ['oysg1','欧阳少恭',2,'秋','风前独坐弄琴筝，\n明灭蓬山九万程。'],
    ['qyt1','青玉坛',2,'秋','试心桥上分阴阳，\n魂兮魄兮难辨章。'],
    ['ys1','榣山',2,'秋','沧海桑田新几度，\n月明还照旧容颜。'],
    ['pl1','蓬莱',2,'夏','青阶似洗驻岁华，\n蓬山曲径情无暇。'],
    ['qc1','琴川',2,'春','杏花微雨沾衣湿，\n陌路少年檐下识。'],
    ['al1','安陆',2,'秋','醉白楼旁杏林黄，\n岁首辞君别无恙。'],
    ['thg1','桃花谷',2,'春','花开花落蜂蝶舞，\n日出日落泉叮咚。'],
    ['yd1','幽都',2,'冬','娲皇故里聚先贤，\n风雨如晦葬龙渊。'],
    ['jt1','焦炭',2,'夏','天地为炉生妙物，\n阴阳为炭造化功。'],
    ['fl1','凤来',2,'春','神识邈邈拂丝弦，\n人间离散月又圆。'],
    ['bsd1','百胜刀',2,'冬','白刃出鞘饮煞气，\n世事斗转换乾坤。']],
  [
    ['sy2','沈夜',2,'冬','时烬未烬陷永夜，\n归期无期月寒沉。'],
    ['sx2','沈曦',2,'春','梦呓短歌消长夜，\n吉光片羽碎琉璃。'],
    ['lyc2','流月城',2,'冬','月冷千山孤城悬，\n神木凋零远人间。'],
    ['xyz2','夏夷则',2,'冬','八极乘龙巡碧落，\n一襟风雪载昆仑。'],
    ['ths2','太华山',2,'冬','巍巍云巅鹤长唳，\n亭亭尘外山色霁。'],
    ['hy2','华月',2,'冬','元月夜下箜篌引，\n不负相思不负君。'],
    ['zm2','昭明',2,'春','星屑玉魄结剑还，\n光耀四野止寒夜。'],
    ['ar2','阿阮',2,'春','楚梦沉醉朝复暮，\n清歌远上巫山低。'],
    ['yq2','禺期',2,'夏','一世仙身为剑痴，\n晗光蕴灵万事知。'],
    ['ywy2','乐无异',2,'夏','杨柳风前歌玉树，\n黄金堂下卧麒麟。'],
    ['wc2','忘川',2,'冬','寂灭幻断前缘尽，\n旋刺斩决君子心。'],
    ['lc2','露草',2,'春','天地灵韵凝霜骨，\n剑心支离相思苦。'],
    ['qhzr2','清和真人',2,'秋','明哲通达出太华，\n山河秀丽诗酒花。'],
    ['wmzj2','无名之剑',2,'秋','上古威仪难复现，\n敛光为华唤明心。'],
    ['ca2','长安',2,'春','众人揽胜逐朝霞，\n游子笑折一枝花。'],
    ['gjhg2','古剑晗光',2,'冬','传世利刃寒光荧，\n千秋凡铁宿魂灵。'],
    ['jql2','金麒麟',2,'秋','江上熏风鸳鸯游，\n两小无猜赠麒麟。'],
    ['ttzq2','通天之器',2,'秋','天道浩瀚难穷尽，\n若涉渊水正道心。'],
    ['ws2','巫山',2,'夏','风飖轻举降暮雨，\n碧峭绵延匿神女。'],
    ['wry2','闻人羽',2,'秋','朱颜流落东风里，\n月满千山倚筑歌。'],
    ['bcg2','百草谷',2,'夏','横戈盘马草如茵，\n介胄执袍郁成阴。'],
    ['tzbz2','兔子抱枕',2,'秋','长长折耳护稚童，\n圆圆黑眸沐春风。'],
    ['xy2','谢衣',2,'夏','花落庭前浮图现，\n人间尽是晚晴天。'],
    ['jsh2','静水湖',2,'春','水天一色洗尘嚣，\n帘栊垂落与神交。'],
    ['snm2','神女墓',2,'冬','神农座下披华藻，\n行云带雨香陨早。'],
    ['hykh2','华月箜篌',2,'冬','凝音织梦倚阑珊，\n清商抚羽月沉沦。']],
  [
    ["sw3", "司危", 2, "春", ""],
    ["bl3", "北洛", 2, "春", ""],
    ["ywy3", "云无月", 2, "冬", ""],
    ["cy3", "岑婴", 2, "夏", ""],
    ["xg3", "玄戈", 2, "秋", ""],
    ["ns3", "霓商", 2, "夏", ""],
    ["jxy3", "姬轩辕", 2, "秋", ""],
    ["jy3", "缙云", 2, "夏", ""],
    ["bhl3", "半魂莲", 2, "秋", ""],
    ["tl3", "天鹿", 2, "秋", ""],
    ["wz3", "巫炤", 2, "冬", ""],
    ["ts3", "太岁", 2, "春", ""],
    ["sz3", "蜃珠", 2, "夏", ""],
    ["wmzd3", "无名之地", 2, "冬", ""],
    ["tlc3", "天鹿城", 2, "秋", ""],
    ["wzg3", "巫之国", 2, "冬", ""],
    ["xl3", "西陵", 2, "春", ""],
    ["lz3", "嫘祖", 2, "夏", ""],
    ["fls3", "风里沙", 2, "秋", ""],
    ["lxj3", "凌星见", 2, "春", ""],
    ["wyzl3", "乌衣长老", 2, "春", ""],
    ["sj3", "鸤鸠", 2, "冬", ""],
    ["yts3", "原天柿", 2, "秋", ""],
    ["ycg3", "夜长庚", 2, "冬", ""],
    ["gd3", "骨笛", 2, "冬", ""],
    ["z3", "磔", 2, "夏", ""],
    ["ys3", "玉梳", 2, "冬", ""],
    ["mhz3", "梦魂枝", 2, "秋", ""]
  ]
];
COMBO_LIST  = [
  //[char name list], comboname, score, comboid, audio duration(ms)
  [['风晴雪','焦炭','谢衣'],'厨房功夫',10,'cfgj',1097.143],
  [['谢衣','乐无异'],'春风雨',4,'cfy',2351.02],
  [['谢衣','静水湖'],'重山隐',4,'csy',1880.816],
  [['谢衣','沈夜'],'孤月寒灯',4,'gyhd',2690.6119999999996],
  [['谢衣','忘川'],'别破军',4,'bpj',2037.5510000000002],
  [['谢衣','通天之器'],'空留忆',4,'kly',1645.714],
  [['流月城','谢衣'],'胡不归',4,'hbg',1776.327],
  [['流月城','沈夜'],'永夜寒沉',4,'yyhc',2351.02],
  [['沈曦','沈夜'],'三日遥',4,'sry',2560],
  [['流月城','沈曦'],'月中生',4,'yzssx',2063.6730000000002],
  [['兔子抱枕','沈曦'],'伴长眠',4,'bcm',679.184],
  [['华月箜篌','华月'],'廉贞曲',4,'lzq',1854.694],
  [['流月城','华月'],'月之殇',4,'yzshy',2377.1429999999996],
  [['华月','沈夜'],'护孤城',4,'hgc',2768.98],
  [['谢衣','沈夜','沈曦','华月'],'烈山遗族',20,'lsyz',2037.5510000000002],
  [['谢衣','沈夜','沈曦','流月城','华月'],'红月',40,'hy',2298.7760000000003],
  [['古剑晗光','乐无异'],'家传宝贝',5,'jcbb',1671.837],
  [['禺期','古剑晗光','乐无异'],'剑主之谊',10,'jjzy',1933.061],
  [['长安','乐无异'],'玉京游',4,'yjy',2533.878],
  [['百草谷','闻人羽'],'星海天罡',5,'xhtg',2324.898],
  [['闻人羽','乐无异'],'比肩行',5,'bjx',1149.3880000000001],
  [['金麒麟','闻人羽','乐无异'],'长相忆',10,'cxy',2246.531],
  [['夏夷则','太华山'],'逸尘',5,'yc',1488.98],
  [['夏夷则','露草'],'待佳期',4,'lc',1280],
  [['太华山','清和真人'],'太华山人',4,'thsr',1619.5919999999999],
  [['夏夷则','清和真人'],'严师胜父',4,'yssf',2351.02],
  [['夏夷则','阿阮'],'光逐影',5,'gzy',1280],
  [['夏夷则','太华山','清和真人'],'温茶相待',10,'wcxd',1906.9389999999999],
  [['露草','阿阮'],'共株生',4,'gzs',2089.7960000000003],
  [['昭明','阿阮'],'芳草心',4,'fcx',1593.469],
  [['巫山','阿阮'],'山鬼',5,'sg',1828.571],
  [['神女墓','巫山'],'神女静眠',4,'snjm',2455.5099999999998],
  [['巫山','露草','阿阮'],'露草流萤',10,'lcly',2168.163],
  [['巫山','露草','阿阮','神女墓'],'巫山神女',20,'wssn',2089.7960000000003],
  [['禺期','红玉'],'古剑剑灵',4,'gjjl',2481.633],
  [['禺期','昭明'],'铸剑仙师',4,'zjxs',1410.612],
  [['禺期','无名之剑'],'历劫重生',4,'ljcs',2690.6119999999996],
  [['禺期','古剑晗光'],'未成之剑',4,'wczj',2089.7960000000003],
  [['昭明','无名之剑','古剑晗光'],'千年一器',10,'qnyq',2821.224],
  [['昭明','无名之剑','古剑晗光','禺期'],'天地熔炉',20,'tdrl',2246.531],
  [['昭明','无名之剑','古剑焚寂','古剑红玉','古剑晗光'],'古剑奇谭',40,'gjqt',2429.388],
  [['夏夷则','阿阮','闻人羽','乐无异'],'蓝衫偃师记',20,'lsysj',2037.5510000000002],
  [['欧阳少恭','青玉坛'],'丹芷长老',4,'dzzl',1985.306],
  [['欧阳少恭','凤来'],'揽琴独照',4,'lqdz',2742.857],
  [['巽芳','欧阳少恭'],'仙山眷侣',4,'xsjl',2351.02],
  [['榣山','欧阳少恭'],'故地重回',4,'gdch',2612.2450000000003],
  [['悭臾','欧阳少恭'],'榣山遗韵',4,'ysyy',2664.49],
  [['欧阳少恭','蓬莱'],'栖身之所',4,'xszs',2272.6530000000002],
  [['巽芳','蓬莱'],'蓬莱公主',4,'plgz',2795.102],
  [['巽芳','蓬莱','欧阳少恭'],'芳华如梦',10,'fhrm',1645.714],
  [['黑龙鳞片','悭臾'],'应龙信物',4,'ylxw',2246.531],
  [['榣山','悭臾'],'水虺醉琴',4,'shzq',2351.02],
  [['欧阳少恭','方兰生'],'琴川友',4,'qcy',2324.898],
  [['琴川','方兰生'],'望乡',4,'wx',1985.306],
  [['方兰生','青玉司南佩'],'永相随',4,'yxs',2194.286],
  [['百胜刀','方兰生'],'无情客',4,'wqk',1724.0819999999999],
  [['安陆','红玉'],'明月青霜',4,'myqs',2795.102],
  [['古剑红玉','红玉'],'剑舞红袖',4,'jwhx',1488.98],
  [['天墉城','红玉'],'千古剑灵',4,'qgjl',1645.714],
  [['紫榕林','襄铃'],'故林栖',4,'glx',1071.02],
  [['风晴雪','百里屠苏','桃花谷'],'桃花幻梦',10,'thhm',1776.327],
  [['风晴雪','百里屠苏'],'与子成说',3,'gycs',2246.531],
  [['百里屠苏','悭臾'],'乘龙归',3,'clg',1828.571],
  [['百里屠苏','天墉城'],'云涌昆仑',3,'yykl',2168.163],
  [['天墉城','陵越'],'天墉掌门',4,'tyzm',2298.7760000000003],
  [['百里屠苏','陵越','天墉城'],'天墉旧事',10,'tyjs',2977.959],
  [['百里屠苏','古剑焚寂'],'焚焰血戮',3,'fyxl',2533.878],
  [['黑龙鳞片','百里屠苏'],'故友赠礼',3,'gyzl',2298.7760000000003],
  [['百里屠苏','欧阳少恭'],'琴心剑魄',3,'qxjp',2899.592],
  [['尹千觞','欧阳少恭'],'醉梦江湖',4,'zmjh',1645.714],
  [['尹千觞','幽都'],'幽都巫咸',4,'ydwx',2533.878],
  [['风晴雪','尹千觞'],'陌相逢',4,'mxf',2011.429],
  [['风晴雪','幽都'],'幽都灵女',4,'ydln',2142.0409999999997],
  [['风晴雪','尹千觞','幽都'],'幽夜苍茫',10,'yycm',2899.592],
  [['风晴雪','方兰生','百里屠苏','红玉','尹千觞','襄铃'],'黑衣少侠传',60,'hysxz',1750.2040000000002]
  /*
  [ ["巫炤", "司危"], "西陵毒唯", 4],
  [ ["巫炤", "西陵"], "炤不保西", 3],
  [ ["巫炤", "无名之地"], "千年老尸", 3],
  [ ["巫炤", "巫之国"], "梦乡", 3],
  [ ["巫炤", "司危","半魂莲"], "搞事情", 10],
  [ ["巫炤", "司危", "嫘祖", "西陵"], "倾城", 20],
  [ ["巫炤", "缙云"], "意难平", 4],
  [ ["巫炤", "欧阳少恭"], "放弃治疗", 4]
  */
];

function getRandom(max){
  //returns random in [0, max-1]
  return Math.floor((Math.random()*max));
}

class Character {
  constructor(id, name, score, season, poem) {
    this.id = id;
    this.name = name;
    this.score = score;
    this.season = season;
    this.poem = poem;
    this.owner = null;//player
    this.disabled = false;
    this.swapped = false;
    this.noswap = false;
  }
  isSpecial() {
    return false;
  }
  getSpecial(specials){
    // special cards won't be upgraded once more
    // note: it does not only get the special, it does everything of an upgrade except assigning the new char
    if(this.isSpecial()) return this;
    if(specials == null) return this;
    var sps = specials.characters;
    for(var i=0; i<sps.length; i++)
      if(sps[i].name == this.name){
        var sp = sps[i];
        sp.inheritFrom(this);
        sps.splice(i, 1);
        specials.view.deleteSpecial(sp);
        return sp;
      }
    return this;
  }
  setOwner(owner) {
    this.owner = owner;
  }
  getPortrait() {
    return "url('img/" + this.id + ".jpg')";
  }
  getDesc() {
    var msg = this.id + "：" + this.name + "，" + this.score + "分，" + this.season + "季, 归属玩家" + (this.owner == null ? "-" : this.owner.id) + "\n";
    return msg;
  }
  performTricks(type, para) {return null;}
  getTrick(type){return null;}
  enabled(){return false;}//common chars has no tricks
  recalculate(player){}
}
class SpecialCharacter extends Character {
  constructor(id, name, nameSuffix, score, season, poem) {
    super(id, name, score, season, poem);
    this.nameSuffix = nameSuffix;
    this.tricks = [];
  }
  inheritFrom(src){
    //inherit game status from its common card
    this.owner = src.owner;
    this.disabled = src.disabled;
    this.swapped = src.swapped;
    src.card.setChar(this);
    this.card = src.card;
  }
  enabled(){
    if (this.disabled || (this.swapped && this.noswap))
      return false;
    return true;
  }
  addTrick(trick) {
    this.tricks.push(trick);
    trick.setOwner(this);
    var noswaps = "SwapTrick,CopyTrick";
    if(noswaps.includes(trick.constructor.name))
      this.noswap = true;
  }
  isSpecial() {
    return true;
  }
  getCommonChar(){
    var repo = model.commonRepository.characters;
    for(var i=0; i<repo.length; i++)
      if(repo[i].name == this.name)
        return repo[i];
    return null;
  }
  setNoswap(){
    this.noswap = true;
  }
  performTricks(type, para) {
    //perform a trick of <type>, only performs one trick
    if(!this.enabled())
      return null;
    for(var i=0; i<this.tricks.length; i++)
      if(this.tricks[i].enabled() && type.includes(this.tricks[i].constructor.name))
        return this.tricks[i].performTrick(para);
    return null;
  }
  getTrick(type) {
    //returns the first enabled trick of <type>
    // if type is null, then returns any enabled trick
    if(!this.enabled())
      return null;
    for(var i=0; i<this.tricks.length; i++){
      if(this.tricks[i].enabled()){
        if(type == null)
          return this.tricks[i];
        else {
          if(type.includes(this.tricks[i].constructor.name))
            return this.tricks[i];
        }
      }
    }
    return null;
  }
  recalculate(player){
    if(!this.enabled()) return;
    for(var i=0; i<this.tricks.length; i++){
      if(this.tricks[i].enabled())
        this.tricks[i].recalculate(player);
    }
  }
  getDesc() {
    var msg = super.getDesc();
    return msg;
  }
}
class Deck {
  constructor() {
    this.characters = [];
    this.view = null;
  }
  init(size, commons, specials, x=null) {
    if (x == null) {
      for (var i = 0; i < size; i++)
        this.addChar(commons.removeRandom());
    } else { // for multiplayer debugging
      size = x.length;
      for (var i=0; i<x.length; i++)
        this.addChar(commons.removeCharByID(x[i]));
    }
    for (var i = 0, idx = 0; i < size; i++){
      var char = this.characters[idx];
      var upg = char.getSpecial(specials);
      if(upg != char){
        this.characters.splice(idx, 1);
        this.characters.push(upg);
        this.view.toSpecial(char, upg);
      }
      else
        idx ++;
    }
  }
  getSize(){
    return this.characters.length;
  }
  addChar(char) {
    this.characters.push(char);
    if(this.view != null)
      this.view.addChar(char);
    return char;
  }
  addRandom(repo, specials) {
    if (repo.characters.length == 0) {
      console.trace();
      alert("Empty deck!");
      return null;
    }
    var char = repo.removeRandom();
    if(specials != null)
      char = char.getSpecial(specials);
    this.addChar(char);
    return char;
  }
  getMatch(char) {
    var s = char.season;

    /////////!!!!!!!!!!!!!!!!!!!!!Modified for testingggggggg!!!!!!!!!!!!!!!!!
    for (var i = 0; i < this.getSize(); i++)
    //for (var i = this.getSize()-1; i >= 0; i--)
      if (this.characters[i].season == s)
        return this.characters[i];
    return null;
  }
  clear(){
    this.characters.length = 0;
    if(this.view != null)
      this.view.clear();
  }
  removeRandom() {
    var i = getRandom(this.characters.length);
    var char = this.characters[i];
    this.characters.splice(i, 1);
    return char;
  }
  removeChar(char) {
    var target = this.characters.indexOf(char);
    if(target < 0) return null;
    this.characters.splice(target, 1);
    return char;
  }
  removeCharByID(id) {
    var target = -1,
      clen = this.characters.length;
    for (var i = 0; i < clen; i++) {
      if (this.characters[i].id == id) {
        target = i;
        break;
      }
    }
    if (target < 0) return null;
    var char = this.characters[target];
    this.characters.splice(target, 1);
    return char;
  }
  getChar(id) {
    var clen = this.characters.length;
    for (var i = 0; i < clen; i++)
      if (this.characters[i].id == id)
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
class CommonRepository extends Deck {
  constructor() {super();}
  init(pack){
    for(var p = 0; p < 2; p++){
      var ids = COMMON_CHAR_LIST[pack[p]-1];
      var len = ids.length;

      for (var i = 0; i < len; i++) {
        var char = new Character(ids[i][0], ids[i][1], ids[i][2], ids[i][3], ids[i][4]);
        char.card = new Card(char);
        this.addChar(char);
      }
    }
  }
}
class SpecialRepository extends Deck {
  constructor() {super();}
  init(ids){
    for(var i=0; i<ids.length; i++) {
      var char = spmanager.createSpecial(ids[i]);
      char.card = new Card(char);
      this.addChar(char);
    }
  }
}
class TabledCombo{
  constructor(char, index){
    this.characters = [char];
    this.index = index;
    this.fullScore = this.getBaseScore;
  }
  addChar(char){
    this.characters.push(char);
  }
  getCompleteSize(){
    return COMBO_LIST[this.index][0].length;
  }
  getChar(name){
    for(var i=0; i<this.characters.length; i++)
      if(this.characters[i].name == name)
        return this.characters[i];
    return null;
  }
  getSize(){
    return this.characters.length;
  }
  getName(){
    return COMBO_LIST[this.index][1];
  }
  getId(){
    return COMBO_LIST[this.index][3];
  }
  getAudioDuration(){
    return COMBO_LIST[this.index][4];
  }
  calculateFullScore(){
    this.fullScore = COMBO_LIST[this.index][2];
    for(var i=0; i<this.getSize(); i++){
      var res = this.characters[i].performTricks("ComboTrick", this);
      if(res != null)
        this.fullScore += res;
    }
    return this.fullScore;
  }
  getFullScore(){
    return this.fullScore;
  }
  getBaseScore(){
    return COMBO_LIST[this.index][2];
  }
  isComplete(){
    return this.getSize()==COMBO_LIST[this.index][0].length;
  }
  getCompleteList(){
    return COMBO_LIST[this.index][0];
  }
  containsChar(char){
    for(var i=0; i<this.characters.length; i++)
      if(this.characters[i] == char)
        return true;
    return false;
  }
  removeChar(char){
    for(var i=0; i<this.characters.length; i++)
      if(this.characters[i] == char){
        this.characters.splice(i, 1);
        return char;
      }
    return null;
  }
  getDesc(){
    var msg = COMBO_LIST[this.index][1];
    // + " : " + COMBO_LIST[this.index][2]
    /* + "\n";
    for(var i=0; i<this.getSize(); i++)
      msg += "[" + this.characters[i].name + "]\n";
    */
    return msg;
  }
}
class Combos{
    constructor(){
      //data format:
      //[[[char_name1, char_name2, ...], combo_name, score], ...]
    }
    getSize(){
      return COMBO_LIST.length;
    }
    getTeamMates(char){
      var mates = [];
      for(var i=0; i<COMBO_LIST.length; i++){
        var names = COMBO_LIST[i][0];
        if(names.includes(char.name)){
          for(var j=0; j<names.length; j++) {
              if(names[j] != char.name && !mates.includes(names[j]))
                mates.push(names[j]);
          }
        }
      }
      return mates;
    }
    getNewCombos(player, char){
      //update player: partialCombos. completeCombos, score
      //return type:
      //completecombocount
      //the updated bombos are at the beginning of partialCombos, completeCombos
      var chars = player.table;
      var pcombos = player.partialCombos;
      var nccount = 0;
      for(var i=0; i<this.getSize(); i++) {
        var combo = COMBO_LIST[i];
        for(var j=0; j<combo[0].length; j++) {
          if(char.name == combo[0][j]) {
            //combo contains char, find the pcombo
            //log(combo[1]);
            var pcombo = null;
            for(var k=0; k<pcombos.length; k++){
                if(pcombos[k].index == i) {
                  pcombo = pcombos[k];
                  pcombo.addChar(char);
                  if(pcombo.isComplete()){
                    //found a new complete combo, move it completeCombos
                    nccount ++;
                    pcombos.splice(k, 1);
                    player.completeCombos.unshift(pcombo);
                    player.score += pcombo.calculateFullScore();
                  }
                  else{
                    //the combo is not complete, move it to the partiallist cardfront
                    pcombos.splice(k, 1);
                    pcombos.unshift(pcombo);
                  }
                  break;
                }
            }
            if(pcombo == null){
              //find a new combo, must be partial
              let pcombo = new TabledCombo(char, i);
              player.partialCombos.unshift(pcombo);
            }
          }
        }
      }
      return nccount;
    }
    evaluateChar(char, partialCombos, oppoPartialCombos, considerOppo){
      /*
         considerOppo: weather or not to sabotage the opponent's potential combos
         returns the weight of char
         weight: base score + combo weight
           for each mathing combo:
           when opponent doesn't have the combo:
            combo weight += (combo score)/(char # to be obtained) (including this char)
           when opponent has part of the combo:
             not consider opponent:
               combo weight += 0, because u cannot complete this combo
             consider opponent:
                when u have part of the combo:
                  combo weight += 0, because neither of u can complete this combo
                when u don't have this combo:
                  combo weight += (combo score)/(char # to be obtained by opponent)
      */
      var weight = char.score;
      var len = COMBO_LIST.length;
      var reside = new Array(len).fill(0);
      var oppoReside = new Array(len).fill(0);
      for(var i=0; i<partialCombos.length; i++)
        reside[partialCombos[i].index] = partialCombos[i].getSize();
      for(var i=0; i<oppoPartialCombos.length; i++)
        oppoReside[oppoPartialCombos[i].index] = oppoPartialCombos[i].getSize();
      for(var i=0; i<len; i++){
        var combo = COMBO_LIST[i];
        var size = combo[0].length;
        for(var j=0; j<size; j++)
          if(char.name == combo[0][j]){
          // a matching combo
            if(oppoReside[i] == 0)
              // opponent has none of the combo chars
                weight += combo[2]/(size - reside[i]);
            else {
              //opponent has part of the combo
              if(considerOppo && reside[i]==0)
                weight += combo[2]/(size - oppoReside[i] + 1)*0.9;
            }
          }
      }
      return weight;
    }
}
class Player {
  constructor(id) {
    this.id = id;
    this.hand = new Deck();
    this.table = new Deck();
    this.specials = new SpecialRepository();
    this.score = 0;
    this.matchable = true;
    this.partialCombos = [];
    this.completeCombos = [];
    this.specialIDs = [];
  }
  clear(){
    this.table.clear();
    this.specials.clear();
    this.hand.clear();
    this.matchable = true;
    this.partialCombos.length = 0;
    this.completeCombos.length = 0;
    this.score = 0;
  }
  init(x=null){
    this.specials.init(this.specialIDs);
    if (x != null) {
      // ADD
      for (var i=0; i<x.length; i++) {
        var c = model.commonRepository.removeCharByID(x[i]);
        var upg = c.getSpecial(this.specials);
        if (c != undefined && c != null)
          this.hand.addChar(c);
      }
      // FIXUP
      SpecialFixup();
    } else {
      this.hand.init(INIT_CARD_NUM_HAND, model.commonRepository, this.specials);
    }
  }
  SpecialFixup() { // For multiplayer !
    for (var i = 0, idx = 0; i < this.hand.characters.length; i++){
      var char = this.hand.characters[idx];
      var upg = char.getSpecial(this.specials);
      if(upg != char){
        this.hand.characters.splice(idx, 1);
        this.hand.characters.push(upg);
        this.hand.view.toSpecial(char, upg);
      }
      else
        idx ++;
    }
  }
  addTableChar(char) {
    //add a char to player's table
    //return: [char score increment, combo count] (weird I know that)
    var prescore = this.score;
    this.table.addChar(char);
    char.setOwner(this);
    var oppo = this.id==0?model.player1:model.player0;
    //am i banned?
    for(var i=0; i<oppo.table.getSize(); i++){
      oppo.table.characters[i].performTricks("NamedBanTrick", char);
    }
    //do i ban someone?
    var trick = char.getTrick("NamedBanTrick");
    if(trick != null)
      for(var i=0; i<oppo.table.getSize(); i++){
        if(trick.performTrick(oppo.table.characters[i]))
          oppo.recalculate(true);
      }
    //do i benefit (from) others?
    for(var i=0; i<this.table.getSize(); i++){
      this.table.characters[i].performTricks("CharTrick", this);
    }
    this.score += char.score;
    var charinc = this.score - prescore;
    var comboCount = combos.getNewCombos(this, char);
    return [charinc, comboCount];
  }
  removeTableChar(char){
    //remove a char from player's table
    char.setOwner(null);
    var chars = this.table.characters;
    for(var i=0; i<chars.length; i++)
      if(chars[i] == char){
        chars.splice(i, 1);
        break;
      }
    var size = this.partialCombos.length;
    for(var i=0, idx = 0; i<size; i++)
      if(this.partialCombos[idx].removeChar(char) != null && this.partialCombos[idx].getSize() == 0)
          this.partialCombos.splice(idx, 1);
      else
        idx ++;
    size = this.completeCombos.length;
    for(var i=0, idx = 0; i<size; i++)
      if(this.completeCombos[idx].removeChar(char) != null){
        this.partialCombos.unshift(this.completeCombos[idx]);
        this.completeCombos.splice(idx, 1);
      }
      else
        idx ++;
    this.recalculate(false);
    return char;
  }
  recalculate(animechange){
    //calculate score for the player
    var preScore = this.score;
    this.score = 0;
    //base score & special card bonus
    var chars = this.table.characters;
    for(var i=0; i<chars.length; i++){
      this.score += chars[i].score;
      chars[i].recalculate(this); //recalculate char bonus
    }
    for(var i=0; i<this.completeCombos.length; i++)
      this.score += this.completeCombos[i].calculateFullScore();
    if(preScore != this.score && animechange)
      messenger.animeScoreInc(this.id, preScore, this.score - preScore);
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
    this.commonRepository = new CommonRepository();
    this.player0 = new Player(0);
    this.player1 = new Player(1);
    this.pool = new Deck();
    this.activeChar = null;
  }
  setPack(p1 ,p2){
    this.pack = [p1, p2];
  }
  init(){
    model.commonRepository.init(this.pack);
    var TEST = false;
    if (TEST) {
      model.player1.init([ "ws2", "xf1", "ca2", "gjfj1", "ys1", "tyc1", "thg1", "ths2", "bsd1" ]);
      model.player0.init([ "hllp1", "hykh2", "wmzj2", "yd1", "qyt1", "xy2", "blts1", "fqx1", "qy1" ]);
      this.pool.init(INIT_CARD_NUM_POOL, this.commonRepository, null, [ "yq2", "jql2", "ar2", "sx2", "gjhy1", "xl1", "fl1", "ttzq2" ]);
    } else {
      model.player1.init();
      model.player0.init();
      this.pool.init(INIT_CARD_NUM_POOL, this.commonRepository);
    }
    view.init();
    model.checkMatch1();
  }
  init_Multiplayer(snapshot) {
    model.commonRepository.init(this.pack);
    view.init();
    
    // LOAD SNAPSHOT
    var my_id = versus_rank, oppo_id = 1-my_id;
    var hands = [ snapshot.p0h, snapshot.p1h ]; // this is from Offender's perspective
    var sps   = [ snapshot.p0sp,snapshot.p1sp];
    var pool  = snapshot.pool;
    
    // Replicates the following functions
    // >> model.player1.init()
    //   >> player.specials.init()
    //   >> player.hand.init()
    
    // Populate MY special cards & 
    var p1_h = hands[my_id], p1_sp = sps[my_id];
    for (var i=0; i<p1_sp.length; i++) {
      var ch = spmanager.createSpecial(p1_sp[i]);
      ch.card = new Card(ch);
      model.player1.specials.addChar(ch);
    }
    for (var i=0; i<p1_h.length;  i++) {
      var ch = model.commonRepository.removeCharByID(p1_h[i]);
      model.player1.hand.addChar(ch);
    }
    
    // Populate Opponent's hand cards which MAY BE SPECIAL CARDS
    // Downgrade temporarily & re-upgrade in the FixUp
    var p0_h = hands[oppo_id], p0_sp = sps[oppo_id];
    for (var i=0; i<p0_h.length;  i++) {
      var ch = model.commonRepository.removeCharByID(p0_h[i]);
      if (ch == null) {
        var id = p0_h[i];
        id = id.substr(0, (id.length-1));
        ch = model.commonRepository.removeCharByID(id);
      }
      model.player0.hand.addChar(ch);
    }
    
    // Populate Pool
    for (var i=0; i<pool.length; i++) {
      var ch = model.commonRepository.removeCharByID(pool[i]);
      model.pool.addChar(ch);
    }
    
    model.checkMatch1();
  }
  clear(){
    model.player1.clear();
    model.player0.clear();
    model.pool.clear();
    model.commonRepository.clear();
    model.activeChar = null;
    view.clear();
  }
  discard(player, char){
    if(char == null)
      char = player.hand.removeRandom();
    else
      player.hand.removeChar(char);
    model.pool.addChar(char);
    var newChar = player.hand.addRandom(model.commonRepository, player.specials);
    console.log(player.id + "号放弃 "+ char.name + " 获得 " + newChar.name);
    if (is_multiplayer) {// for multiplayer -- 如果是特殊牌，要传回对应的普通牌ID
      var orig_id = newChar.id;
      if (newChar.isSpecial()) orig_id = orig_id.substr(0, orig_id.length-1);
      socket.emit('Game_DiscardOne', char.id, orig_id);
    }
  }
  opponentDiscard(discarded_id, added_id) { // Only in multiplayer mode
    var discarded = model.player0.hand.getChar(discarded_id);
    model.player0.hand.removeChar(discarded)
    model.pool.addChar(discarded);
    var added = model.commonRepository.getChar(added_id);
    model.commonRepository.removeChar(added);
    model.player0.hand.addChar(added);
    model.player0.SpecialFixup(); // The card may need to be turned into special card
  }
  overSize(){
    return this.pool.getSize() >= POOL_CAPACITY;
  }
  overSeason(){
    //returns true:
    //if >= 6 cards of a certain season in pool and >= 3 cards of other seasons in pool+repository
    var count = 0;
    var chars = this.pool.characters;
    var seasons = ["春", "夏", "秋", "冬"];
    for(var i=0; i<seasons.length; i++){
      count = 0;
      for(var j=0; j<chars.length; j++)
        if(chars[j].season == seasons[i])
        {
          count ++;
          if(count == 6)
          {
            var others = 0;
            for(var k=0; k<chars.length; k++)
              if(chars[k].season != seasons[i])
                others ++;
            for(var k=0; k<model.commonRepository.getSize(); k++)
              if(model.commonRepository.characters[k].season != seasons[i]) {
                others ++;
                if(others > 2)
                  return true;
              }
            return false;
          }
        }
    }
    return false;
  }
  redeal(pool_ids = null, repo_ids = null){ // Changed for multiplayer
    // Potential for data race here
    //for(var i=0; i<model.pool.getSize(); i++)
    //  model.commonRepository.addChar(model.pool.characters[i]);
    //model.pool.characters.length = 0;
    var chars = model.pool.characters.slice(); // not splice
    for (var i=0; i<chars.length; i++)
      model.commonRepository.addChar(chars[i]);
    model.pool.characters.length = 0;
    
    if (pool_ids == null) { // Changed for multiplayer
      model.pool.init(INIT_CARD_NUM_POOL, model.commonRepository);
      var pool_ids = extractIDs(model.pool.characters);
      socket.emit('Game_Redeal', pool_ids,
                                 extractIDs(model.commonRepository.characters));
      console.log('Self redeal ' + pool_ids);
    } else {
      var diff = false;
      var my_pool_ids = extractIDs(model.pool.characters);
      if (my_pool_ids.length != pool_ids) {
        diff = true;
      } else {
        for (var i=0; i<my_pool_ids.length; i++) {
          if (my_pool_ids[i] != pool_ids[i]) {
            diff = true;
            break;
          }
        }
      }
      if (diff == true) {
        for (var i=0; i<pool_ids.length; i++) {
          var id = pool_ids[i];
          var c = model.commonRepository.removeCharByID(id);
          if (c != null)
            model.pool.addChar(c);
        }
      }
      console.log("Opponent Redeal or Self Redeal Ack" + pool_ids + ', diff=' + diff)
    }
  }
  checkMatch1(){
    while(model.overSeason())
      model.redeal();
    var matchable = model.hasMatch(model.player1);
    if(matchable) {
      if(!model.player1.matchable){
        model.player1.matchable = true;
        view.checkMatch1();
      }
    }
    else {
      if(model.overSize()){
        model.redeal();
        model.checkMatch1();
      }
      else {
        if(model.player1.matchable){
          model.player1.matchable = false;
          view.checkMatch1();
        }
      }
    }
  }
  hasMatch(player){
    var match = this.pickLeft(player);
    return match != null;
  }
  dealOne(player, dealt_id = null) { // changed for multiplayer
    var char = (dealt_id == null) ? obtainVector.performDeal() :
      model.commonRepository.removeCharByID(dealt_id);
    if(char == null)
      char = model.pool.addRandom(model.commonRepository);
    else {
      model.commonRepository.removeChar(char);
      model.pool.addChar(char);
    }
    view.dealOne(char);
    return char.id; // for multiplayer
  }
  pickLeft(player){
      var poolChars = model.pool.characters;
      var poolChar = null;
      var handChar = null;
      for (var i = 0; i < poolChars.length; i++) {
        handChar = player.hand.getMatch(poolChars[i]);
        if (handChar != null) {
          poolChar = poolChars[i];
          return [handChar, poolChar];
        }
      }
      return null;
  }
  pickOptimal(player, oppo, considerOppo){
    //return the optimal [handchar, poolchar] according to combos.evaluateChar()
    var poolChars = model.pool.characters;
    var poolChar = null, handChar = null;
    var maxWeight = 0, optimalPoolChar = null, optimalHandChar = null;
    for (var i = 0; i < poolChars.length; i++) {
      handChar = player.hand.getMatch(poolChars[i]);
      if (handChar != null) {
        poolChar = poolChars[i];
        var weight = combos.evaluateChar(poolChar, player.partialCombos, oppo.partialCombos, considerOppo);
        if(weight > maxWeight) {
          maxWeight = weight;
          optimalPoolChar = poolChar;
          optimalHandChar = handChar;
        }
      }
    }
    if(optimalPoolChar != null)
      return [optimalHandChar, optimalPoolChar];
    return null;
  }
  discardOptimal(player, oppo, considerOppo){
    var minWeight = 9999;
    var pick = null;
    var chars = player.hand.characters;
    for(var i=0; i<chars.length; i++) {
      var weight = combos.evaluateChar(chars[i], player.partialCombos, oppo.partialCombos, considerOppo);
      if(weight < minWeight) {
        minWeight = weight;
        pick = chars[i];
      }
    }
    return pick;
  }
  aiSelectObtain() {
    //returns an array [hand pick, pool pick]
    switch (AI_LEVEL) {
      case 1:
        return model.pickLeft(this.player0);
        break;
      case 2:
        return model.pickOptimal(this.player0, this.player1, false);
        break;
      case 3:
        return model.pickOptimal(this.player0, this.player1, true);
        break;
      default: log("Invalid AI　Level!!!!!!!!");
        return null;
    }
  }
  aiSelectCopy(trick){
      var cans = [];
      var chars = model.player1.table.characters;
      for(var i=0; i<chars.length; i++)
        if(trick.isValidTarget(chars[i]))
          cans.push(chars[i]);
      var size = cans.length;
      if(size == 0) return null;
      return cans[getRandom(size)];
  }
  aiSelectSwap(){
    var size = model.player1.table.getSize();
    if(size == 0) return null;
    return model.player1.table.characters[getRandom(size)];
  }
  aiSelectBan(trick){
    var cans = [];
    var chars = model.player1.table.characters;
    for(var i=0; i<chars.length; i++)
      if(trick.isValidTarget(chars[i]))
        cans.push(chars[i]);
    var size = cans.length;
    if(size == 0) return null;
    return cans[getRandom(size)];
  }
  aiSelectDiscard(){
    switch (AI_LEVEL) {
      case 1:
        return null;
      case 2:
        return this.discardOptimal(model.player0, this.player1, false);
      case 3:
        return this.discardOptimal(model.player0, this.player1, true);
      default: log("Invalid AI　Level!!!!!!!!");
        return null;
    }
  }
  obtain() {
  // controller: pc is upgraded by player.specials and is removed from pool
  // controller: hs, ps are both upgraded by player.specials and are removed from oppo's table
  // hc/pc are specialchars if hs/ps are not null
    var player = obtainVector.player;
    var oppo = player.id==0? model.player1:model.player0;

    console.log(player.id+"号：入手 " + obtainVector.playerTableChars[0].name + " 和 " + obtainVector.playerTableChars[1].name);
    var ac0 = player.addTableChar(obtainVector.playerTableChars[0]);
    var ac1 = player.addTableChar(obtainVector.playerTableChars[1]);
    obtainVector.charScoreInc = ac0[0] + ac1[0];
    obtainVector.comboCount =  ac0[1] + ac1[1];
    controller.handleBans();
  }
  activate(char) {//player1 set a card active
    if (this.activeChar == null || this.activeChar != char) {
      view.activate(this.activeChar, char);
      this.activeChar = char;
    } else {
      view.activate(this.activeChar, null);
      this.activeChar = null;
    }
  }
  getDesc() {
    var msg = this.player0.getDesc();
    msg += this.player1.getDesc();
    msg += "卡池\n" + this.pool.getDesc();
    return msg;
  }
  
  getSnapshot() { // no view; for starting a game
    return {
      'p0h' :extractIDs(model.player0.hand.characters),
      'p0sp':extractIDs(model.player0.specials.characters),
      'p0table':extractIDs(model.player0.table.characters),
      'p1h' :extractIDs(model.player1.hand.characters),
      'p1sp':extractIDs(model.player1.specials.characters),
      'p1table':extractIDs(model.player1.table.characters),
      'pool':extractIDs(model.pool.characters),
      'common_repo':extractIDs(model.commonRepository.characters),
      'special_repo':spmanager.specialRepoIDs,
      'p0score': model.player0.score,
      'p1score': model.player1.score,
    };
  }
}
function extractIDs(characters) {
  var ret = [];
  for (var i=0; i<characters.length; i++)
    ret.push(characters[i].id);
  return ret;
}
function DUMP(what) {
  if (what == 'h0') console.log(extractIDs(model.player0.hand.characters));
  else if (what == 'h1') console.log(extractIDs(model.player1.hand.characters));
  else if (what == 'sp0') console.log(extractIDs(model.player0.specials.characters));
  else if (what == 'sp1') console.log(extractIDs(model.player1.specials.characters));
}