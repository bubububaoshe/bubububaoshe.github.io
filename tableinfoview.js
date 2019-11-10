//now this indeed counts the views of player tables (max=2)
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
  addSmallCard(char, container, showscore){
    container = container==null?this.container.querySelector('.charinfocontainer'):container;
    var schar = container.appendChild(document.createElement("div"));
    schar.classList.add("smallchar");
    schar.id = char.id;
    var inn = schar.appendChild(document.createElement("div"));
    inn.classList.add("smallcard");
    inn = inn.appendChild(document.createElement("div"));
    inn.style.backgroundImage = char.getPortrait();
    if(showscore == null || showscore){
      inn = schar.appendChild(document.createElement("p"));
      inn.textContent = "基础分:" + char.score;
    }
    schar.appendChild(createFullInfobox(char));
    if(char.isSpecial() && char.getTrick()==null)
      this.enableCard(schar, false);
    return schar;
  }
  enableCard(chardiv, enable){
    if(enable)
      chardiv.firstElementChild.firstElementChild.style.opacity = null;
    else
      chardiv.firstElementChild.firstElementChild.style.opacity = 0.4;
  }
  createCharView(container, trick){
    var chars = this.player.table.characters;
    for(var i=0; i<chars.length; i++)
      if(trick == null || trick.isValidTarget(chars[i]))
        this.addSmallCard(chars[i], container);
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
    this.fadeUnder("tableinfo", true);
    showOpacity(this.container, true);
  }
  exit(){
    this.hide();
    if(this.on){
      if(tableviewcount == 1){
        messenger.note(roundHintMsg);
      }
      this.on = false;
      tableviewcount --;
      //clear view
      this.container.getElementsByClassName("charinfocontainer")[0].textContent="";
      this.container.getElementsByClassName("ccomboinfocontainer")[0].textContent="";
      this.container.getElementsByClassName("icomboinfocontainer")[0].textContent="";
      this.setPane(1);
      this.fadeUnder("tableinfo", false);
    }
  }
  hide(){
    showOpacity(this.container, false);
  }
  exitSelectionPanel(controllerFunc){
    var container = document.getElementsByClassName("tableinfocontainer")[0];
    showOpacity(container, false);
    this.fadeUnder("selectionpanel", false);
    container.getElementsByClassName('charinfocontainer')[0].textContent = "";
    container.getElementsByClassName('charinfocontainer')[1].textContent = "";
    container.getElementsByClassName('charinfocontainer')[1].removeEventListener("click", controllerFunc);
  }
  showSelectionPanel(trick, msg, controllerFunc){
    // this char view is to select a target when a char trick is performed
    var char = trick.owner;
    var container = document.getElementsByClassName("tableinfocontainer")[0];
    var card = this.addSmallCard(char, container.getElementsByClassName('charinfocontainer')[0]);
    card.getElementsByTagName("p")[0].textContent = "从下方选择对方卡牌" + msg;
    var chartable = container.getElementsByClassName('charinfocontainer')[1];
    chartable.addEventListener("click", controllerFunc);
    this.createCharView(chartable, trick);
    var cards = chartable.children;
    //container.style.display = "block";
    showOpacity(container, true);
    this.fadeUnder("selectionpanel", true);
  }
  exitSpecialsPanel(){
    messenger.note(roundHintMsg);
    var container = document.getElementsByClassName("tableinfocontainer")[3];
    showOpacity(container, false);
    this.fadeUnder("tableinfo", false);
    container.getElementsByClassName('charinfocontainer')[0].textContent = "";
  }
  showSpecialsPanel(){
    messenger.note("再次点击牌\n组返回牌局");
    var container = document.getElementsByClassName("tableinfocontainer")[3];
    var chartable = container.querySelector(".charinfocontainer");
    var chars = model.player1.specials.characters;
    for(var i=0; i<chars.length; i++)
      var schar = playerinfo.addSmallCard(chars[i], chartable);
    showOpacity(container, true);
    this.fadeUnder("tableinfo", true);
  }
  specialsPanelOn(){
    var container = document.getElementsByClassName("tableinfocontainer")[3];
    return this.visible(container);
  }
  exitSpecialsPick(){
    document.getElementById("sprepo").textContent = "";
    document.getElementById("sppick").textContent = "";
    document.querySelector("#spselection .cover").style.visibility = null;
    showOpacity(document.getElementById("spselection"), false);
  }
  showSpecialsPick(){
    var repodiv = document.getElementById("sprepo");
    var pickdiv = document.getElementById("sppick");
    var repo = model.specialRepository;
    //this func is called after getsetup and before gameinit
    //so spmanager.userSpecialRepository includes all the special chars that user may have
    for(var i=0; i<spmanager.userSpecialRepository.getSize(); i++){
      var char = spmanager.userSpecialRepository.characters[i];
      if(model.player1.specialIDs.includes(char.id))
        var chardiv = this.addSmallCard(char, pickdiv, false);
      else
        var chardiv = this.addSmallCard(char, repodiv, false);
    }
    this.updateSpecialsPick();
  }
  updateSpecialsPick(){
    this.spDisableDuplicates();
    this.spFullBlock();
  }
  spDisableDuplicates(){
    var schars = document.getElementById("sprepo").children;
    for(var i=0; i<schars.length; i++)
      if(spmanager.hasDuplicates(schars[i].id, model.player1.specialIDs))
        this.enableCard(schars[i], false);
      else
        this.enableCard(schars[i], true);
  }
  spFullBlock(){
    if(model.player1.specialIDs.length >= MAX_SP_NUM)
      document.querySelector("#spselection .cover").style.visibility = "visible";
    else
      document.querySelector("#spselection .cover").style.visibility = null;
  }
  visible(container){
    container = container==null?this.container:container;
    return container.style.opacity != 0;
  }
  fadeUnder(myslef, fade){
    var opacity = fade?0.1:1;
    switch (myslef) {
      case "tableinfo":
        document.getElementById("gamezone").style.opacity = opacity;
        break;
      case "selectionpanel":
        document.getElementById("hand0container").style.opacity = opacity;
        document.getElementById("poolcontainer").style.opacity = opacity;
        document.getElementById("hand1container").style.opacity = opacity;
        break;
      default:
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
