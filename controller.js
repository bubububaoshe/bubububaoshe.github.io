var OPERATIONDELAY = 500; //delay in milliseconds between machine operations

function getCardID(div){
  return div.id;
}
class Controller{
  constructor(){
  }
  activate(){
    log("activate: " + this.id);
    var char = model.player1.hand.getChar(this.id);
    model.activate(char);
  }
  obtain(){
    var handc = model.activeChar;
    var poolc = model.pool.getChar(this.id);
    model.activate(handc);
    model.obtain(model.player1, handc, poolc);
  }
  discard(){
    log("discard: " + this.id);
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
    blockGame();
    setTimeout(function(){
      model.dealOne(null);
    }, OPERATIONDELAY);
    setTimeout(function(){
      model.makeOpponentPick();
    }, OPERATIONDELAY*3);
    setTimeout(function(){
      model.dealOne(null);
      model.handlePlayer1NoMatch();
      unblockGame();
    }, OPERATIONDELAY*4);
  }
  discardCardClick(){
    var id = getCardID(this);
    var char = model.getPlayer1().getHand().getChar(id);
    model.discardCard(model.getPlayer1(), char);
    model.handlePlayer1NoMatch();
  }
}
