class Controller{
  constructor(){
  }
  hand1CardClick(){
    var id = parseInt(this.id.substr(4));
    model.setHand1Active(id);
  }
}
