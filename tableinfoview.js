var tableviewcount = 0;
class TableInfoView{
  constructor(player){
    if(player.id==0)
      this.container = document.getElementsByClassName("tableinfocontainer")[1];
    else
      this.container = document.getElementsByClassName("tableinfocontainer")[2];
    this.player = player;
    var divs = this.container.firstElementChild.childNodes;
    for(var i=0; i<divs.length; i++)
      divs[i].addEventListener("click", controller.selectInfo);
    this.on = false;
  }
  addSmallCard(char, container){
    var sc = document.createElement("div");
    sc.classList.add("smallcard");
    sc.id = char.id;
    var inn = document.createElement("div");
    sc.appendChild(inn);
    inn.style.backgroundImage = char.getPortrait();
    inn = document.createElement("p");
    sc.appendChild(inn);
    inn.textContent = "基础分:" + char.score;
    if(container == null)
      this.container.querySelector('.charinfocontainer').appendChild(sc);
    else
      // this char view is for selection when a swaptrick is performed
      container.appendChild(sc);
    return sc;
  }
  createCharView(container, trick){
    var chars = this.player.table.characters;
    for(var i=0; i<chars.length; i++)
      if(trick == null || trick.isValidTarget(chars[i]))
        this.addSmallCard(chars[i], container);
  }
  exitSelectionPanel(controllerFunc){
    var container = document.getElementsByClassName("tableinfocontainer")[0];
    container.style.display = null;
    container.getElementsByClassName('charinfocontainer')[0].textContent = "";
    container.getElementsByClassName('charinfocontainer')[1].textContent = "";
  }
  showSelectionPanel(trick, msg, controllerFunc){
    // this char view is to select a target when a char trick is performed
    var char = trick.owner;
    var container = document.getElementsByClassName("tableinfocontainer")[0];
    var card = this.addSmallCard(char, container.getElementsByClassName('charinfocontainer')[0]);
    card.getElementsByTagName("p")[0].textContent = "从下方选择对方卡牌" + msg;
    var chartable = container.getElementsByClassName('charinfocontainer')[1];
    this.createCharView(chartable, trick);
    var cards = chartable.children;
    for(var i=0; i<cards.length; i++)
      cards[i].addEventListener("click", controllerFunc);
    container.style.display = "block";
  }
  addCombo(combo){
    var div = document.createElement("div");
    div.classList.add("combocard");
    var imagecontainer = document.createElement("div");
    div.appendChild(imagecontainer);
    var divchd = document.createElement("div");
    div.appendChild(divchd);
    var infocontainer = document.createElement("div");
    infocontainer.id = "combocardinfo";
    divchd.appendChild(infocontainer);
    var chd = document.createElement("div");
    chd.textContent = combo.getName();
    infocontainer.appendChild(chd);
    chd = document.createElement("div");
    chd.textContent = combo.isComplete()?combo.getFullScore():combo.getBaseScore();
    infocontainer.appendChild(chd);
    var charscontainer = document.createElement("div");
    charscontainer.id = "combocardchars";
    divchd.appendChild(charscontainer);

    //imagecontainer: thumbnailcard
    //charscontainer: combocardchars
    var cc = combo.getCompleteList();
    for(var i=0; i<cc.length; i++){
      var char = combo.getChar(cc[i]);
      if(char != null){
        var thn = document.createElement("div");
        thn.classList.add("thumbnailcard");
        thn.style.backgroundImage = char.getPortrait();
        imagecontainer.appendChild(thn);
        var cn = document.createElement("span");
        cn.classList.add("ismine");
        cn.textContent = char.name;
        charscontainer.appendChild(cn);
      } else {
        var cn = document.createElement("span");
        cn.classList.add("notmine");
        cn.textContent = cc[i];
        charscontainer.appendChild(cn);
      }
    }
    if(combo.isComplete())
      this.container.getElementsByClassName("ccomboinfocontainer")[0].appendChild(div);
    else
      this.container.getElementsByClassName("icomboinfocontainer")[0].appendChild(div);
  }
  createComboView(){
    var combos = this.player.completeCombos;
    for(var i=0; i<combos.length; i++)
      this.addCombo(combos[i]);
    combos = this.player.partialCombos;
    for(var i=0; i<combos.length; i++)
      this.addCombo(combos[i]);
  }
  show(){
    if(!this.on){
      if(tableviewcount == 0){
        messenger.note("再次点击牌\n组返回牌局");
      }
      this.on = true;
      tableviewcount ++;
      //create view
      this.createCharView();
      this.createComboView();
    }
    this.container.style.display = "block";
  }
  hide(){
    this.container.style.display = null;
  }
  visible(){
    return this.container.style.display != "";
  }
  exit(){
    this.hide();
    if(this.on){
      if(tableviewcount == 1){
        messenger.note("");
      }
      this.on = false;
      tableviewcount --;
      //clear view
      this.container.getElementsByClassName("charinfocontainer")[0].textContent="";
      this.container.getElementsByClassName("ccomboinfocontainer")[0].textContent="";
      this.container.getElementsByClassName("icomboinfocontainer")[0].textContent="";
      this.setPane(1);
    }
  }
  setPane(idx){
    var divs = this.container.children;
    for(var i=1; i<divs.length; i++){
      if(i == idx){
        divs[i].style.display = "flex";
      }
      else
        divs[i].style.display = "none";
    }
  }
}
