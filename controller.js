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
    if (is_multiplayer != true) { // Changed in multiplayer
      messenger.hideFinalNotice();
      model.init();
      delayedFunc(function(){
        controller.gameinit();
      }, 2);
    } else {
      model.init();
      console.log("Voted to restart");
      socket.emit('Game_VoteRestart'); // Will swap defensive/offensive & restart if BOTH players click this button
    }
  }
  activate(){
    var char = model.player1.hand.getChar(this.id);
    model.activate(char);
  }
  obtain() {
    IncrementActionBarrier(); // 这是用于postObtain里的dealOne的
    IncrementActionBarrier(); // 这是用于obtain()本体的
    var handc = model.activeChar;
    model.activate(handc);
    model.player1.hand.removeChar(handc);
    var orig_poolc_id = this.id; // 这里有个情况：对方玩家可能将此牌变成了特殊牌，所以应该记下原牌的ID
    var poolc = model.pool.removeCharByID(this.id).getSpecial(model.player1.specials);
   
    if (is_multiplayer) { // WebSocket messages are in-order, so server will have entire sequence
      socket.emit('Game_ObtainStart', handc.id, orig_poolc_id);
      console.log('obtain ' + handc.id + ' & ' + orig_poolc_id);
    }
      
    obtainVector.init(model.player1, handc, poolc);
    controller.handleCopies();
    
    // 不太清楚怎么使用轮询（似乎要使用Promise.then()对远端进行比较大的改动），所以暂时采取在发起端记下所有事件的方式
    // 做决定的函数是异步的，所以得要维持一个Counter，降为0时再告知服务器该回合结束了
    // 这其实是一个作用于当前玩家在obtain期间产生的所有线程的barrier
    DecrementActionBarrier();
  }
  opponentObtain(remote_handcid = null, remote_poolcid = null){ // Changed for multiplayer
    console.log('MyCardsCountr: ' + model.getMyCardsCount());
    console.log('[opponentObtain] ' + remote_handcid + ', ' + remote_poolcid);
    while(model.overSeason())
      model.redeal();
    console.log('MyCardsCounte: ' + model.getMyCardsCount());
    var pick = (remote_handcid == null) ? model.aiSelectObtain() : 
      [model.player0.hand.getChar(remote_handcid),
       model.pool.getChar(remote_poolcid)]; // getSpecial 在接下来再调用
    console.log('MyCardsCounst: ' + model.getMyCardsCount());
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
      console.log('M2yCardsCount: ' + model.getMyCardsCount());
      var pc = model.pool.removeChar(pick[1]);
      if (pc == null) {
        console.log("ERROR!!!!  pick[1] is NULL!!!!");
        console.trace();
      }
      pc = pc.getSpecial(model.player0.specials);
      console.log('[opponentObtain] hc='+hc+', pc='+pc);
      obtainVector.init(model.player0, hc, pc);
      controller.handleCopies();
    }
  }
  postObtain(pid){ // changed in multiplayer
    delayedFunc(function(){ 
      if(pid == 1){
        var dealt_id = model.dealOne(model.player1);
        
        if (is_multiplayer == true) {
          socket.emit('Game_DealOne', dealt_id);
          DecrementActionBarrier(); // 对应obtain最开始的Increment
        } else {
          delayedFunc(function(){
            controller.opponentObtain();
          }, 2);
        }
      }
      else{
        if(model.player1.hand.getSize() == 0){
          //game end
          messenger.notifyFinal();
          if (is_multiplayer) {
            socket.emit('Game_GameEnd');
          }
        }
        else {
          if (is_multiplayer != true) { // changed in multiplayer
            model.dealOne(model.player0);
          }
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
    if(obtainVector.player.id == 1) {
      var t = obtainVector.trickSelector(type);
      if(!t)
        controller.handleSwaps();
    }
    else {
      var trick = obtainVector.getNextTrick(type); // looks like const, so reentrant
      if(trick != null){
        var target = null;
        if (is_multiplayer != true) { target = model.aiSelectCopy(trick); } // changed in multiplayer
        else {
          var target_id = GetNextObtainAction();
          target = (target_id == null) ? 
            null :
            model.player1.table.getChar(target_id); // from Table, according to tricks.js
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
        if (is_multiplayer != true) { target = model.aiSelectSwap(); } // changed in multiplayer
        else {
          var target_id = GetNextObtainAction();
          target = (target_id == null) ?
            null :
            model.player1.table.getChar(target_id); // from Table, according to tricks.js
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
        if (is_multiplayer != true) { target = model.aiSelectBan(trick); } // changed in multiplayer
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
  selectCopy(){ // modified in multiplayer
    oppoinfo.exitSelectionPanel();
    var type = "CopyTrick";
    obtainVector.setTrickTarget(type, model.player0.table.getChar(this.id));
    if (is_multiplayer) { // multiplayer
      socket.emit('Game_SetCopyTrickTarget', this.id);
      console.log('CopyTrick ' + this.id);
    }
    controller.handleCopies(); // May increase barrier ?
    DecrementActionBarrier(); // 与trick.selectTarget("CopyTrick")对应
  }
  selectSwap(){
    // user swaps with the opponent
    oppoinfo.exitSelectionPanel();
    var type = "SwapTrick";
    obtainVector.setTrickTarget(type, model.player0.table.getChar(this.id));
    if (is_multiplayer) {
      socket.emit('Game_SetSwapTrickTarget', this.id);
      console.log('SwapTrick ' + this.id);
    }
    controller.handleCopies();
    DecrementActionBarrier();
  }
  selectBan(){
    oppoinfo.exitSelectionPanel();
    var type = "UnnamedBanTrick";
    obtainVector.setTrickTarget(type, model.player0.table.getChar(this.id));
    if (is_multiplayer) {
      socket.emit('Game_SetUnnamedBanTrickTarget', this.id);
      console.log('UnnamedBanTrick ' + this.id);
    }
    controller.handleBans();
    DecrementActionBarrier();
  }
  doNothing(){
  }
  spPick(){
    PLAYER_SPECIALS[1].push(this.id);
    document.getElementById("sppick").appendChild(this);
    playerinfo.updateSPPick();
    sound.activate();
    this.removeEventListener("click", controller.spPick);
    this.addEventListener("click", controller.spUnpick);
  }
  spUnpick(){
    var idx = PLAYER_SPECIALS[1].indexOf(this.id);
    PLAYER_SPECIALS[1].splice(idx, 1);
    document.getElementById("sprepo").appendChild(this);
    playerinfo.updateSPPick();
    sound.activate();
    this.removeEventListener("click", controller.spUnpick);
    this.addEventListener("click", controller.spPick);
  }
  gameinit(){
    if(USER_SPECIAL_REPO.length == 0)
      controller.gamestart();
    else{
      document.getElementById("main").style.display = "none";
      playerinfo.showSpecialsPick();
      showOpacity(document.getElementById("spselection"), true);
      document.getElementById("gamestart").addEventListener("click", controller.gamestart);
    }
  }
  gamestart(){
    var should_skip = false;
    if (is_multiplayer == true && versus_rank == 0)
      should_skip = true; // changed in multiplayer
    
    if (should_skip == false) {
      if(USER_SPECIAL_REPO.length > 0)
        spmanager.saveSpecials();
      spmanager.setAISpecials();
      playerinfo.exitSpecialsPick();
      document.getElementById("main").style.display = "block";
      
      // 初始化一个局面供调试珍稀牌功能用…
      model.start();
    }
    
    if(is_multiplayer == true) {
      if (versus_rank == 1) { // changed for multiplayer
        var s = model.getSnapshot();
        console.log(s);
        socket.emit('Match_SetupComplete', PLAYER_SPECIALS[1], s);
      } else {
        socket.emit('Match_SetupComplete', PLAYER_SPECIALS[1], null);
      }
    }
  }
  // 后手的人开始游戏用。后手玩家需要收到先手玩家的牌局
  gamestartDefensive(snapshot) {
    if(USER_SPECIAL_REPO.length > 0)
      spmanager.saveSpecials();
    playerinfo.exitSpecialsPick();
    document.getElementById("main").style.display = "block";
    model.start(snapshot);
  }
}
