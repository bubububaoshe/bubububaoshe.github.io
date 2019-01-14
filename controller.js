var OPERATION_DELAY = 500; //delay in milliseconds between machine operations

function delayedFunc(func, timeUnits){
  if (timeUnits == null)
  timeUnits = 1;
  setTimeout(function() {
    func.call();
  }, Math.floor(OPERATION_DELAY * timeUnits));
}
class Controller{
  constructor(){
  }
  restart(){
    model.init();
  }
  activate(){
    var char = model.player1.hand.getChar(this.id);
    model.activate(char);
  }
  obtain(){
    var handc = model.activeChar;
    model.activate(handc);
    var poolc = model.pool.removeCharByID(this.id).getSpecial(model.player1.specials);
    obtainVector.reset();
    obtainVector.setChars(handc, poolc);
    if(!obtainVector.swapSelector())
      controller.swappedObtain();
  }

  swappedObtain(){
    model.obtain(model.player1);
    view.blockGame();
  }
  opponentObtain(){
    while(model.overSeason())
      model.redeal();
    var pick = model.aiSelectObtain();
    if(pick == null){
      if(model.overSize()){
        model.redeal();
        controller.opponentObtain();
      }
      else {
        model.discard(model.player0, model.aiSelectDiscard());
        controller.opponentObtain();
      }
    }
    else {
      //check swap
      var hc = pick[0];
      var pc = model.pool.removeChar(pick[1]).getSpecial(model.player0.specials);
      obtainVector.reset();
      obtainVector.setChars(hc, pc);
      var swapnum = obtainVector.getTrickCount("SwapTrick");
      for(var i=0; i<swapnum; i++)
        obtainVector.setSwapTarget(model.player1.removeTableChar(model.aiSelectSwap()).getSpecial(model.player0.specials));
      model.obtain(model.player0);
    }
  }
  discard(){
    var char = model.player1.hand.getChar(this.id);
    model.discard(model.player1, char);
    model.checkMatch1();
  }
  checkPlayerInfo(){
    if(playerinfo.visible()){
      playerinfo.exit();
      oppoinfo.exit();
    }
    else {
      oppoinfo.hide();
      playerinfo.show();
    }
  }
  checkOppoInfo(){
    if(oppoinfo.visible()){
      playerinfo.exit();
      oppoinfo.exit();
    }
    else {
      playerinfo.hide();
      oppoinfo.show();
    }
  }
  selectInfo(){
    var header = this.parentNode;
    var nodes = header.children;
    var idx = 0;
    for(;nodes[idx]!=this; idx++);
    if(header == document.getElementsByClassName("infoheader")[0])
      oppoinfo.setPane(idx+1);
    else
      playerinfo.setPane(idx+1);
  }
  selectSwap(){
    // player swaps with the opponent
    oppoinfo.exitSelectionPanel();
    var oppoChar = model.player0.table.getChar(this.id);
    model.player0.removeTableChar(oppoChar);
    obtainVector.setSwapTarget(oppoChar.getSpecial(model.player1.specials));
    if(!obtainVector.swapSelector())
      controller.swappedObtain();
  }
  selectBan(){
    oppoinfo.exitSelectionPanel();
    console.log(this.id);
  }
}
