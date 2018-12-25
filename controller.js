function getCardID(div){
  return parseInt(div.id.substr(4));
}
class Controller{
  constructor(){
  }
  hand1CardClick(){
    model.setHand1Active(getCardID(this));
  }
  poolCardClick(){
    var id = getCardID(this);
    model.pickPoolCard(1, id);
  }
}
