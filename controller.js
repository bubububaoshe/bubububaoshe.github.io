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
    view.blockGame();
    var handc = model.activeChar;
    model.activate(handc);
    model.player1.hand.removeChar(handc);
    var poolc = model.pool.removeCharByID(this.id).getSpecial(model.player1.specials);
    obtainVector.init(model.player1, handc, poolc);
    controller.handleCopies();
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
      var hc = model.player0.hand.removeChar(pick[0]);
      var pc = model.pool.removeChar(pick[1]).getSpecial(model.player0.specials);
      obtainVector.init(model.player0, hc, pc);
      controller.handleCopies();
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
  handleCopies(){
    var type = "CopyTrick";
    if(obtainVector.player.id == 1){
      if(!obtainVector.trickSelector(type))
        controller.handleSwaps();
    }
    else {
      var trick = obtainVector.getNextTrick(type);
      if(trick != null){
        obtainVector.setTrickTarget(type, model.aiSelectCopy(trick));
        messenger.notifyOppoAction(type, "复制", controller.confirmCopy);
      }
      else
        controller.handleSwaps();
    }
  }
  handleSwaps(){
    var type = "SwapTrick";
    if(obtainVector.player.id == 1){
      if(!obtainVector.trickSelector(type))
        model.obtain();
    }
    else {
      if(obtainVector.getNextTrick(type) != null){
        obtainVector.setTrickTarget(type, model.aiSelectSwap());
        messenger.notifyOppoAction(type, "换走", controller.confirmSwap);
      }
      else
        model.obtain();
    }
  }
  handleBans(){
    var type = "UnnamedBanTrick";
    if(obtainVector.player.id == 1){
      if(!obtainVector.trickSelector(type))
        controller.handleReveals();
    }
    else {
      var trick = obtainVector.getNextTrick(type);
      if(trick != null){
        obtainVector.setTrickTarget(type, model.aiSelectBan(trick));
        messenger.notifyOppoAction(type, "禁用", controller.confirmBan);
      }
      else
        view.obtain();
    }
  }
  handleReveals(){
    obtainVector.performReveal();
    view.obtain();
  }
  confirmCopy(){
    messenger.exitNotifyOppoAction(controller.confirmCopy);
    controller.handleCopies();
  }
  confirmSwap(){
    messenger.exitNotifyOppoAction(controller.confirmSwap);
    controller.handleSwaps();
  }
  confirmBan(){
    messenger.exitNotifyOppoAction(controller.confirmBan);
    controller.handleBans();
  }
  selectCopy(){
    oppoinfo.exitSelectionPanel();
    var type = "CopyTrick";
    obtainVector.setTrickTarget(type, model.player0.table.getChar(this.id));
    controller.handleCopies();
  }
  selectSwap(){
    // user swaps with the opponent
    oppoinfo.exitSelectionPanel();
    var type = "SwapTrick";
    obtainVector.setTrickTarget(type, model.player0.table.getChar(this.id));
    controller.handleSwaps();
  }
  selectBan(){
    oppoinfo.exitSelectionPanel();
    var type = "UnnamedBanTrick";
    obtainVector.setTrickTarget(type, model.player0.table.getChar(this.id));
    controller.handleBans();
  }
}
