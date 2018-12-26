var OPERATIONDELAY = 500; //delay in milliseconds between machine operations

function getCardID(div){
  return parseInt(div.id.substr(4));
}
class Controller{
  constructor(){
  }
  hand1CardClick(){
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

    model.dealOne(null);
    //model.handleNoMatch(model.getPlayer0());
    model.makeOpponentPick();
    model.dealOne(null);
    model.handlePlayer1NoMatch();
    /*
    setTimeout(function(){
      model.dealOne(null);
      model.handleNoMatch(model.getPlayer0());
    }, OPERATIONDELAY);
    setTimeout(function(){
      model.makeOpponentPick();
    }, OPERATIONDELAY*2);
    setTimeout(function(){
      model.dealOne(null);
      log(1);
      model.handleNoMatch(model.getPlayer1());
    }, OPERATIONDELAY*3);*/
  }

  discardCardClick(){
    var id = getCardID(this);
    var char = model.getPlayer1().getHand().getChar(id);
    model.discardCard(model.getPlayer1(), char);
    model.handlePlayer1NoMatch();
  }
}
