var tableviewcount = 0;
class TableInfoView{
  constructor(player){
    if(player.id==0)
      this.container = document.getElementsByClassName("tableinfocontainer")[0];
    else
      this.container = document.getElementsByClassName("tableinfocontainer")[1];
    this.player = player;
    var divs = this.container.firstElementChild.childNodes;
    for(var i=0; i<divs.length; i++)
      divs[i].addEventListener("click", controller.selectInfo);
    this.on = false;
  }
  addSmallCard(char){
    var sc = document.createElement("div");
    sc.classList.add("smallcard");
    var inn = document.createElement("div");
    sc.appendChild(inn);
    inn.style.backgroundImage = char.getPortrait();
    inn = document.createElement("p");
    sc.appendChild(inn);
    inn.textContent = char.score;
    this.container.querySelector('.charinfocontainer').appendChild(sc);
  }
  createCharView(){
    var chars = this.player.table.characters;
    for(var i=0; i<chars.length; i++)
      this.addSmallCard(chars[i]);
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
    chd.textContent = combo.getScore();
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
        document.getElementById("specialboard").addEventListener("click", controller.exitInfo);
        messenger.note("点击此处\n返回牌局");
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
  exit(){
    this.hide();
    if(this.on){
      if(tableviewcount == 1){
        document.getElementById("specialboard").removeEventListener("click", controller.exitInfo);
        messenger.note("");
      }
      this.on = false;
      tableviewcount --;
      //clear view
      this.container.getElementsByClassName("charinfocontainer")[0].textContent="";
      this.container.getElementsByClassName("ccomboinfocontainer")[0].textContent="";
      this.container.getElementsByClassName("icomboinfocontainer")[0].textContent="";
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
