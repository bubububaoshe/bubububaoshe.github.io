class TableInfoView{
  constructor(id){
    if(id==0)
      this.container = document.getElementsByClassName("tableinfocontainer")[0];
    else if(id==1)
      this.container = document.getElementsByClassName("tableinfocontainer")[1];
    else
      alert("Invalid player ID: " + id);
    this.container.addEventListener("dblclick", controller.hideInfo);
    var divs = this.container.firstElementChild.childNodes;
    for(var i=0; i<divs.length; i++)
      divs[i].addEventListener("click", controller.selectInfo);
  }
  reset(){
    this.container.querySelector('.charinfocontainer').textContent = "";
  }
  addChar(char){
    this.addSmallCard(char);
  }
  addSmallCard(char){
    var sc = document.createElement("div");
    sc.classList.add("smallcard");
    var inn = document.createElement("div");
    sc.appendChild(inn);
    inn.style.backgroundImage = char.getPortrait();
    inn = document.createElement("p");
    sc.appendChild(inn);
    inn.textContent = "基础分：" + char.score;
    this.container.querySelector('.charinfocontainer').appendChild(sc);
  }
  show(){
    this.container.style.display = "block";
    messenger.note("双击返回牌局");
  }
  hide(){
    this.container.style.display = null;
    messenger.note("");
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
