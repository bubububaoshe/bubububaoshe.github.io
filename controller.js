function delayedFunc(func, timeUnits){
  if (timeUnits == null)
  timeUnits = 1;
  setTimeout(function() {
    func.call();
  }, Math.floor(OPERATION_DELAY * timeUnits));
}
function getInput(inputsID){
  var inputs = document.getElementById(inputsID).getElementsByTagName("input");
  for(var i=0; i<inputs.length; i++)
    if(inputs[i].checked){
      return inputs[i].id;
    }
}
class Controller{
  constructor(){
  }
  restart(){
    messenger.hideFinalNotice();
    var id = this.id;
    delayedFunc(function(){
      model.clear();
      if(id == "restart")
        controller.gameinit();
      else
        showPage("configurator");
    }, 2);
  }
  activate(){
    var char = model.player1.hand.getChar(this.id);
    model.activate(char);
  }
  obtain(){
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
  postObtain(pid){
    delayedFunc(function(){
      if(pid == 1){
        model.dealOne(model.player1);
        delayedFunc(function(){
          controller.opponentObtain();
        }, 2);
      }
      else{
        if(model.player1.hand.getSize() == 0){
          //game end
          messenger.notifyFinal();
        }
        else {
          model.dealOne(model.player0);
          model.checkMatch1();
          view.unblockGame();
        }
      }
    });
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
      if(playerinfo.specialsPanelOn())
        playerinfo.exitSpecialsPanel();
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
      if(playerinfo.specialsPanelOn())
        playerinfo.exitSpecialsPanel();
      playerinfo.hide();
      oppoinfo.show();
    }
  }
  checkPlayerSpecials(){
    if(playerinfo.specialsPanelOn())
      playerinfo.exitSpecialsPanel();
    else{
      if(playerinfo.visible()) playerinfo.exit();
      if(oppoinfo.visible()) oppoinfo.exit();
      playerinfo.showSpecialsPanel();
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
        var target = model.aiSelectCopy(trick);
        obtainVector.setTrickTarget(type, target);
        if(target != null)
          messenger.notifyOppoAction(type, controller.confirmPreObtain);
        else
          controller.handleCopies();
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
        var target = model.aiSelectSwap();
        obtainVector.setTrickTarget(type, target);
        if(target != null)
          messenger.notifyOppoAction(type, controller.confirmPreObtain);
        else
          controller.handleCopies();
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
        var target = model.aiSelectBan(trick);
        obtainVector.setTrickTarget(type, target);
        if(target != null)
          messenger.notifyOppoAction(type, controller.confirmBan);
        else
          controller.handleBans();
      }
      else
        view.obtain();
    }
  }
  handleReveals(){
    obtainVector.performReveal();
    view.blockGame();
    view.obtain();
  }
  confirmPreObtain(){
    messenger.exitNotifyOppoAction(controller.confirmPreObtain);
    controller.handleCopies();
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
    controller.handleCopies();
  }
  selectBan(){
    oppoinfo.exitSelectionPanel();
    var type = "UnnamedBanTrick";
    obtainVector.setTrickTarget(type, model.player0.table.getChar(this.id));
    controller.handleBans();
  }
  doNothing(){
  }
  spPick(){
    model.player1.specialIDs.push(this.id);
    document.getElementById("sppick").appendChild(this);
    playerinfo.updateSPPick();
    sound.activate();
    this.removeEventListener("click", controller.spPick);
    this.addEventListener("click", controller.spUnpick);
  }
  spUnpick(){
    var idx = model.player1.specialIDs.indexOf(this.id);
    model.player1.specialIDs.splice(idx, 1);
    document.getElementById("sprepo").appendChild(this);
    playerinfo.updateSPPick();
    sound.activate();
    this.removeEventListener("click", controller.spUnpick);
    this.addEventListener("click", controller.spPick);
  }
  configure(){
    var pack = getInput("packinput");
    var p1 = parseInt(pack.charAt(1));
    var p2 = parseInt(pack.charAt(2));
    model.setPack(p1, p2);
    var ai = getInput("aiinput");
    AI_LEVEL = parseInt(ai.charAt(2));
    COMBO_VOICE = getInput("voiceinput");
    var sp = getInput("spinput");
    SP_CARDS = parseInt(sp.charAt(2));
    setCookie("configurations", [pack, ai, COMBO_VOICE, sp]);
    spmanager.setup();
    controller.gameinit();
  }
  gameinit(){
    if(spmanager.userSpecialRepoIDs.length == 0)
      controller.gamestart();
    else{
      playerinfo.showSpecialsPick();
      showPage("spselection");
      document.getElementById("gamestart").addEventListener("click", controller.gamestart);
    }
  }
  gamestart(){
    if(spmanager.userSpecialRepoIDs.length > 0)
      spmanager.saveSpecials();
    spmanager.setAISpecials();
    playerinfo.exitSpecialsPick();
    showPage("main");
    model.init();
  }
}
