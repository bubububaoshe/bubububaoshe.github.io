const playerPrefix='你说:';
const opponentPrefix='对方说:';
/**
 * Switch the display of chat panel.
 */
function popChatPanel(){
    let chatPanel = document.getElementById("chat_panel");
    document.getElementById("chat_signal").style.display = 'none';
    chatPanel.style.display = (chatPanel.style.display === 'none' ?'':'none');
}

/**
 * Get content from <id>chat_input and append to <id>chat_history_panel.
 */
function sendChat(){
    let chatHistory = document.getElementById("chat_history_panel");
    let chatInput = document.getElementById("chat_input");
    chatHistory.innerHTML = chatHistory.innerHTML
        + '<br>'
        +  '<span class="my_chat">'
        +       playerPrefix + chatInput.value
        +  '</span>';
    sendChat2Server(chatInput.value);
    chatInput.value = "";
    //TODO send to server
}

/**
 * Send chat content to server.
 * @param content
 */
function sendChat2Server(content){
    if(socket!==null && socket!== undefined) {
        socket.emit('Chat_Send', content);
    }
}

/**
 * Receive other chat and show in panel.
 */
function receiveChat(speaker, content){
    //if panel not displayed, show the signal
    if(document.getElementById("chat_panel").style.display === 'none'){
        document.getElementById("chat_signal").style.display = '';
    }
    let chatHistory = document.getElementById("chat_history_panel");
    chatHistory.innerHTML = chatHistory.innerHTML
        + '<br>'
        +  '<span class="opponent_chat">'
        +       opponentPrefix + content
        +  '</span>';
}
