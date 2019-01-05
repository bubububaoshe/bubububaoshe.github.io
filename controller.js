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
    model.reset();
    delayedFunc(function(){
      model.restart();
    });
  }
  activate(){
    var char = model.player1.hand.getChar(this.id);
    model.activate(char);
  }
  obtain(){
    var handc = model.activeChar;
    var poolc = model.pool.getChar(this.id);
    model.activate(handc);
    model.obtain(model.player1, handc, poolc);
    view.blockGame();
    delayedFunc(function(){
      model.dealOne();
      delayedFunc(function(){
        controller.opponentObtain();
      }, 2);
    }
  );
  };
  opponentObtain(){
    var pick = model.aiPick();
    if(pick == null){
      if(model.needRedeal()){
        model.redeal();
        controller.opponentObtain();
      }
      else {
        model.discard(model.player0, model.aiDiscard());
        controller.opponentObtain();
      }
    }
    else {
      model.obtain(model.player0, pick[0], pick[1]);
      delayedFunc(function(){
        if(model.player0.hand.getSize()+model.player1.hand.getSize() == 0)
          //game end
          messenger.notifyFinal();
        else{
          model.dealOne();
          model.checkMatch1();
          view.unblockGame();
        }
      });
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
}
