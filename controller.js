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
    if (model.isMultiplayer == false) {
      model.reset();
      delayedFunc(function(){
        model.restart();
      });
    } else {
      socket.emit('Game_StartNewRound');
    }
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
    
    if (model.isMultiplayer == false) {
      delayedFunc(function(){
        model.dealOne();
        delayedFunc(function(){
          controller.opponentObtain();
        }, 2);
      });
    } else {
      console.log('Will emit now');
      var handc_id = handc.id;
      var poolc_id = poolc.id;
      // If I am the last one to make a move ..
      if (model.player0.hand.getSize() + model.player1.hand.getSize() == 0) {
        messenger.notifyFinal();
      }
      socket.emit('Game_ObtainPair', handc_id, poolc_id);
    }
  };
  // opponentObtain may not need 2 be called in multiplayer, does it
  opponentObtain(){
    while(model.overSeason())
      model.redeal();
    var pick = model.aiPick();
    if(pick == null){
      if(model.overSize()){
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
  opponentObtainMultiplayer(handc_id, poolc_id) {
    var handc = model.player0.hand.getChar(handc_id),
        poolc = model.pool.getChar(poolc_id);
    model.obtain(model.player0, handc, poolc);
    if (model.player0.hand.getSize() + model.player1.hand.getSize() == 0) {
      messenger.notifyFinal();
    } else {
      model.checkMatch1();
      view.unblockGame();
    }
  }
  onOpponentTurn() {
    view.blockGame();
    console.log("对方回合");
  }
  onMyTurn() {
    view.unblockGame();
    console.log("我方回合");
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
