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
    if (is_multiplayer != true) {
      messenger.hideFinalNotice();
      var id = this.id;
      delayedFunc(function(){
        model.clear();
        if(id == "restart")
          controller.gameinit();
        else
          showPage("configurator");
      }, 2);
    } else {
      ShowContinueDialog();
    }
  }
  activate(event){
    var div = event.target.closest(".charcontainer");
    if (div != null) {
      var char = model.player1.hand.getChar(div.id);
      model.activate(char);
    }
  }
  obtain(event){
    var div = event.target.closest(".charcontainer");
    if (div != null && div.firstElementChild.firstElementChild.classList.contains("glow")) {
      IncrementActionBarrier();
      var handc = model.activeChar;
      model.activate(handc);
      model.player1.hand.removeChar(handc);
      var orig_poolc_id = div.id;
      var poolc = model.pool.removeCharByID(div.id).getSpecial(model.player1.specials);
      if (is_multiplayer) {
        socket.emit('Game_ObtainStart', handc.id, orig_poolc_id);
        console.log('obtain ' + handc.id + ' & ' + orig_poolc_id);
      }
      obtainVector.init(model.player1, handc, poolc);
      controller.handleCopies();
      DecrementActionBarrier();
    }
  }
  opponentObtain(remote_handcid = null, remote_poolcid = null){
    if (is_multiplayer == false) {
      while(model.overSeason())
        model.redeal();
    }
    var pick = (remote_handcid == null) ? model.aiSelectObtain() :
      [model.player0.hand.getChar(remote_handcid),
       model.pool.getChar(remote_poolcid)];
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
      var pc = model.pool.removeChar(pick[1]);
      if (pc == null) {
        console.log("ERROR! pick[1] is NULL!");
        console.trace();
      }
      pc = pc.getSpecial(model.player0.specials);
      obtainVector.init(model.player0, hc, pc);
      controller.handleCopies();
    }

    if (is_multiplayer) { // 移到这里：只有所有对方动作都回放完了时，才回放最后的dealOne
      if (PeekNextObtainActionType() == "controller.postObtain") {
        model.dealOne(model.player0, GetNextObtainAction()[1]);
      }
    }
  }
  postObtain(pid){
    delayedFunc(function(){
      if(model.player0.hand.getSize() == 0 && model.player1.hand.getSize() == 0){
          //game end
          messenger.notifyFinal();
          if (is_multiplayer)
            socket.emit('Game_PostObtain_GameEnd');
      }
      else {
        if(pid == 1){
          var dealt_id = model.dealOne(model.player1);
          if (is_multiplayer == true) {
            socket.emit('Game_PostObtain_DealOne', dealt_id);
            // redeal应该出现在两方行动之间，在对战版中，由opponentObtain()中移至此处
            while (model.overSeason())
              model.redeal();
            socket.emit('Game_OpponentObtainRedealClear'); // changed for multiplayer
          } else {
            delayedFunc(function(){
              controller.opponentObtain();
            }, 2);
          }
        }
        else{
          if (is_multiplayer != true) {// Added in multiplayer
            model.dealOne(model.player0);
            view.unblockGame();
          }
          model.checkMatch1();
        }
      }
    });
  }
  discard(event){
    var div = event.target.closest(".charcontainer");
    if (div != null) {
      var char = model.player1.hand.getChar(div.id);
      model.discard(model.player1, char);
      model.checkMatch1();
    }
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
  handleCopies(seq = null){ // if seq is not null then I am replaying
    var type = "CopyTrick";
    if(obtainVector.player.id == 1){
      if(!obtainVector.trickSelector(type))
        controller.handleSwaps(seq);
    }
    else {
      var trick = obtainVector.getNextTrick(type);
      if(trick != null){
        var target = null;
        if (is_multiplayer != true) target = model.aiSelectCopy(trick); // changed in multiplayer
        else {
          var target_id = GetNextObtainAction();
          target = (target_id == null) ?
            null :
            model.player1.table.getChar(target_id);
        }
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
        var target = null;
        if (is_multiplayer != true) target = model.aiSelectSwap();
        else {
          var target_id = GetNextObtainAction();
          target = (target_id == null) ?
            null :
            model.player1.table.getChar(target_id);
        }
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
        var target = null;
        if (is_multiplayer != true) target = model.aiSelectBan(trick);
        else {
          var target_id = GetNextObtainAction();
          target = (target_id == null) ?
            null :
            model.player1.table.getChar(target_id);
        }
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
  selectCopy(event){
    var div = event.target.closest(".smallchar");
    if (div != null) {
      oppoinfo.exitSelectionPanel(controller.selectCopy);
      var type = "CopyTrick";
      obtainVector.setTrickTarget(type, model.player0.table.getChar(div.id));
      if (is_multiplayer) // changed in multiplayer
        socket.emit('Game_SetCopyTrickTarget', div.id);
      controller.handleCopies();
    }
    DecrementActionBarrier();
  }
  selectSwap(event){
    var div = event.target.closest(".smallchar");
    if (div != null) {
      // user swaps with the opponent
      oppoinfo.exitSelectionPanel(controller.selectSwap);
      var type = "SwapTrick";
      obtainVector.setTrickTarget(type, model.player0.table.getChar(div.id));
      if (is_multiplayer) { // changed in multiplayer
          socket.emit('Game_SetSwapTrickTarget', div.id);
      }
      controller.handleCopies();
      //Need decrement barrier here, or click blank area will trigger decrement as well and trigger issue
      //https://github.com/bubububaoshe/bubububaoshe.github.io/issues/10
      DecrementActionBarrier();
    }
  }
  selectBan(event){
    var div = event.target.closest(".smallchar");
    if (div != null) {
      oppoinfo.exitSelectionPanel(controller.selectBan);
      var type = "UnnamedBanTrick";
      obtainVector.setTrickTarget(type, model.player0.table.getChar(div.id));
      if (is_multiplayer) // changed in multiplayer
        socket.emit('Game_SetUnnamedBanTrickTarget', div.id);
      controller.handleBans();
    }
    DecrementActionBarrier();
  }
  doNothing(){}
  spPick(event){
    var div = event.target.closest(".smallchar");
    // opacity: if not set by js, or set by js =null, style.opacity is 0 (now matter what opacity it is in css)
    // so if the div is not disabled, its opacity=0
    if (div != null && div.firstElementChild.firstElementChild.style.opacity == 0) {
      model.player1.specialIDs.push(div.id);
      document.getElementById("sppick").appendChild(div);
      playerinfo.updateSpecialsPick();
      sound.activate();
    }
  }
  spUnpick(event){
    var div = event.target.closest(".smallchar");
    if (div != null) {
      var idx = model.player1.specialIDs.indexOf(div.id);
      model.player1.specialIDs.splice(idx, 1);
      document.getElementById("sprepo").appendChild(div);
      playerinfo.updateSpecialsPick();
      sound.activate();
    }
  }
  configure(){
    var pack = getInput("packinput");
    if (!is_multiplayer) { // 多人模式下由服务器当时的状态决定
      var p1 = parseInt(pack.charAt(1));
      var p2 = parseInt(pack.charAt(2));
      model.setPack(p1, p2);
    }
    var ai = getInput("aiinput");
    AI_LEVEL = parseInt(ai.charAt(2));
    COMBO_VOICE = getInput("voiceinput");
    var sp = getInput("spinput");
    SP_CARDS = parseInt(sp.charAt(2));
    setCookie("configurations", [pack, ai, COMBO_VOICE, sp]);
    spmanager.setup(is_multiplayer);
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
    window.scrollTo(0,document.body.scrollHeight);
  }
  gamestart(){
    console.log('[controller.gamestart]');
    var should_skip = (is_multiplayer == true) && (versus_rank == 0);

    // 以下情况需要发牌：
    // 1. 单人模式。
    // 2. 多人模式的先选特殊牌的人。
    // 以下情况听从对方发牌：
    // 1. 多人模式的后选特殊牌的人。
    if (should_skip == false) {
      if(spmanager.userSpecialRepoIDs.length > 0)
        spmanager.saveSpecials();
      if (is_multiplayer == false) // changed for multiplayer
        spmanager.setAISpecials();
      playerinfo.exitSpecialsPick();
      showPage("main");
      model.init();
    } else {
      ShowWaitMessage();
    }

    if (is_multiplayer == true) {
      if (versus_rank == 1) {
        socket.emit('Match_SetupComplete', model.player1.specialIDs, model.getSnapshot());
        ShowWaitMessage();
      } else {
        socket.emit('Match_SetupComplete', model.player1.specialIDs, null);
      }
    }
  }
  gamestartDefensive(snapshot) {
    if (spmanager.userSpecialRepoIDs.length > 0)
      spmanager.saveSpecials();
    playerinfo.exitSpecialsPick();
    showPage("main");
    model.init_Multiplayer(snapshot);
  }
}
