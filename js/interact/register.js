/**
 * Register module for user register and login
 */
var loginStatus = false;
/**
 * Check cookie and send auth to server to confirm login status,
 * If fail, clear avatar cookie
 */
function checkCookieAndLogin(){
    authToken(getCookie('nickname')[0], getCookie('token')[0]);
}

/**
 * Auth the username and token, if succeed maintain login status
 */
function authToken(username, token){
    let AuthPromise = sendAuthRequest(username, token);
    AuthPromise.then(authResponse=>{
        if(authResponse['status'] === status_succeed) {
            updateLoginRelatedInfo();
        } else {
            switchAvatarAndLoginPanel(false);
        }
    });
}

/**
 * Logoff the current user
 */
function logoff() {
    loginStatus = false;
    document.getElementById('vs_ai').disabled = null;
    removeCookie('nickname');
    removeCookie('token');
    switchConnectButton(false);
    switchAvatarAndLoginPanel(false);
    switchMultiPlayerButtons(loginStatus);
    switchLobbyStatus(loginStatus);
    if(socket!==null && socket !== undefined){
        //TODO centralize with versus-client disconect
        if (socket !== undefined) {
            socket.removeAllListeners();
        }
        if (socket !== undefined && socket.connected === true) {
            socket.disconnect();
        }
        socket.close();
        socket = null;
    }
}

/**
 * Switch multi player components display
 * @param isActive
 */
function switchMultiPlayerButtons(isActive) {
    document.getElementById('multiplayerButtons').style.display = isActive?'block':'none';
}

/**
 * Switch lobby message display
 * @param isActive
 */
function switchLobbyStatus(isActive) {
    document.getElementById('lobbystatus').style.display = isActive?'block':'none';
    document.getElementById('reconnect').style.display = isActive?'block':'none';
}
/**
 * Update ui components:
 *  connection_button
 *  win_lose_title_panel
 *  avatar_nickame_panel
 *  @param isAnonymous{boolean}
 */
function updateLoginRelatedInfo(isAnonymous = false){
    loginStatus = true;
    nickname_disp.textContent = avatar.GetNickname();
    switchAvatarAndLoginPanel(true);
    switchConnectButton(true);
    switchMultiPlayerButtons(loginStatus && socket!=null && socket.connected === true);
    switchLobbyStatus(loginStatus);
    getUserWinAndLostInfo(isAnonymous);
    ConnectToServer();
}

/**
 * Pop the register / login window for input username & password
 * @param isLogin true means login mode, false means register mode
 */
function popRegisterWindow(isLogin) {
    let registerWindow = document.getElementById('register_window');
    let confirmPwdWindow = document.getElementById('confirm_password_block');
    let registerSubmit = document.getElementById('register_submit');
    let loginSubmit = document.getElementById('login_submit');
    let anonymousLoginSubmit = document.getElementById('anonymous_login_submit');
    confirmPwdWindow.style.display = isLogin?'none':'';
    loginSubmit.style.display = isLogin?'':'none';
    anonymousLoginSubmit.style.display = isLogin?'':'none';
    registerSubmit.style.display = isLogin?'none':'';
    registerWindow.style.height = "45vh";
}

/**
 * Close the register / login window ( by set height to 0  =  =...).
 */
function closeRegisterWindow(){
    let registerWindow = document.getElementById('register_window');
    registerWindow.style.height = "0";
}

/**
 * Send register / login request.
 * @Param isLogin, if true call login process, or call register process
 */
function getInputUsernameAndPwdThenRegister(isLogin){
    let username = document.getElementById("username_input").value;
    let password = document.getElementById("password_input").value;
    let confirmPassword = document.getElementById("confirm_password_input").value;
    if(username.length===0){
        showRegMsg("请输入名字!");
    } else if(password.length<(online?8:1)){
        showRegMsg("密码太短!");
    } else if(password!==confirmPassword && !isLogin){
        showRegMsg("密码不符!");
    } else {
        if(isLogin){
            login(username, password);
        } else {
            let regPromise = sendRegisterRequest(username, password);
            regPromise.then(regMessage => {
                if (regMessage !== undefined && regMessage['status'] === status_succeed) {
                    console.log("register succeed");
                    login(username, password);
                }
                //if register failed, show the fail message
                else {
                    showRegMsg(regMessage['message']);
                }
            });
        }
        //if register succeed, cookie would be updated, auto trigger login
    }
}

/**
 * Login process.
 * @param username
 * @param password
 */
function login(username, password){
    let loginPromise = sendLoginRequest(username, password);
    loginPromise.then(loginResponse=>{
        if(loginResponse['status'] === status_succeed) {
            closeRegisterWindow();
            avatar.SetNickname(username);
            avatar.SaveToCookie();
            setCookie('token', loginResponse['token']);
            // nickname_disp.textContent = avatar.GetNickname();
            // switchAvatarAndLoginPanel(true);
            // switchConnectButton(true);
            updateLoginRelatedInfo()
        } else{
            //if auto login fail, switch to manually login
            let message = loginResponse['message'];
            if(loginResponse['status'] === undefined){
                message = '服务器爆炸啦，请稍后重试!';
            } else {
                message = '用户名或密码错误!';
            }
            showRegMsg(message);
        }
    });
}

/**
 * Login anonymous
 */
function anonymousLogin(){
    logoff();
    closeRegisterWindow();
    avatar.SetNickname("无名之人");
    updateLoginRelatedInfo(true)
}

/**
 * Switch connect_to_server button status
 */
function switchConnectButton(isActive){
    let connectButtonMask = document.getElementById("connect_to_server_mask");
    let connectButton = document.getElementById("connect_to_server");
    connectButtonMask.style.display = isActive?'none':'';
    connectButton.style.display = isActive?'':'none';
}

/**
 * Switch display mode of avatar panel and login panel.
 * @param showAvatar, true to show avatar, false to show login
 */
function switchAvatarAndLoginPanel(showAvatar){
    let avatarPanel = document.getElementById("avatar_panel");
    let loginPanel = document.getElementById("login_panel");
    let winLosePanel = document.getElementById("win_lose_panel");
    avatarPanel.style.display = showAvatar?'':'none';
    winLosePanel.style.display = showAvatar?'':'none';
    loginPanel.style.display = showAvatar?'none':'';
}

/**
 * Mark register_message shown and set text as message.
 * @param regMsg, message to show
 */
function showRegMsg(regMsg){
    let regMsgElement = document.getElementById("register_message");
    regMsgElement.style.display = '';
    regMsgElement.innerText = regMsg;
}

/**
 * Register entrance point.
 * @param username
 * @param password
 */
async function sendRegisterRequest(username, password){
    let response = {
        message: "",
    };
    try {
        response = await postRequest(
            {
                username: username,
                password: password
            }
            , serverHost + '/info/register'
        );
        return response;
    } catch (e) {
        console.error('Register Failed', e);
        response['message'] = 'Server error';
    }
    return response;
}

/**
 * Login entrance point.
 * @param username
 * @param password
 */
async function sendLoginRequest(username, password){
    let response = {
        message: "",
    };
    try {
        response = await postRequest(
            {
                username: username,
                password: password
            }
            , serverHost + '/user/login'
        );
        return response;
    } catch (e) {
        console.error('Login Failed', e);
        response['message'] = 'Server error';
    }
    return response;
}

/**
 * Auth entrance point.
 * @param username
 * @param token
 */
async function sendAuthRequest(username, token){
    let response = {
        message: "",
    };
    try {
        response = await postRequest(
            {
                username: username,
                token: token
            }
            , serverHost + '/user/auth'
        );
        return response;
    } catch (e) {
        console.error('Auth Failed', e);
        response['message'] = 'Server error';
    }
    return response;
}