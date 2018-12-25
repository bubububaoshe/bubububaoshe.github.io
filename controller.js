function getCardID(div){
  return parseInt(div.id.substr(4));
}
class Controller{
  constructor(){
  }
<<<<<<< HEAD
  hand1CardClick(){log("hand1CardClick");
    var id = getCardID(this);
    var hc = model.getPlayer1().getHand().getChar(id);
    model.setHand1Active(hc);
  }
  poolCardClick(){
    var id = getCardID(this);
    var pc = model.getPool().getChar(id);
    var hc = model.getActiveChar();
    model.setHand1Active(hc);
    model.pickCard(model.getPlayer1(), hc, pc);
    setTimeout(function(){model.makeOpponentPick();}, OPERATIONDELAY);
    //model.makeOpponentPick();
=======
  hand1CardClick(){
    model.setHand1Active(getCardID(this));
  }
  poolCardClick(){
    var id = getCardID(this);
    model.pickPoolCard(1, id);
>>>>>>> a616528adc5ef783ebd39514219c575cc36679e9
  }
}
