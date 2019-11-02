/**
 * Register module for user register and login
 */

const status_succeed = 'SUCCEED';
const status_fail = 'FAIL';

/**
 * Check cookie and send auth to server to confirm login status,
 * If fail, clear avatar cookie
 */
function checkCookie(){
    authToken(getCookie('nickname')[0], getCookie('token')[0]);
}

/**
 * Auth the username and token, if succeed maintain login status
 */
function authToken(username, token){
    let AuthPromise = sendAuthRequest(username, token);
    AuthPromise.then(authResponse=>{
        if(authResponse['status'] === status_succeed) {
            switchAvatarAndLoginPanel(true);
            nickname_disp.textContent = avatar.GetNickname();
        }
    });
}

/**
 * Logoff the current user
 */
function logoff() {
    switchAvatarAndLoginPanel(false);
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
    if(isLogin){
        confirmPwdWindow.style.display = 'none';
        loginSubmit.style.display = '';
        registerSubmit.style.display = 'none';
    } else {
        confirmPwdWindow.style.display = '';
        registerSubmit.style.display = '';
        loginSubmit.style.display = 'none';
    }
    registerWindow.style.height = "34vw";
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
    console.log("register");
    let username = document.getElementById("username_input").value;
    let password = document.getElementById("password_input").value;
    let confirmPassword = document.getElementById("confirm_password_input").value;
    if(username.length===0){
        console.log("please input username!");
    } else if(password.length<8){
        console.log("password too short!");
    } else if(password!==confirmPassword){
        console.log("password not match!");
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
            switchAvatarAndLoginPanel(true);
            avatar.SetNickname(username);
            avatar.SaveToCookie();
            setCookie('token', loginResponse['token']);
            nickname_disp.textContent = avatar.GetNickname();
        } else{
            //if auto login fail, switch to manually login
            //TODO show error and recall user to login
            popRegisterWindow(true);
        }
    });
}

/**
 * Switch display mode of avatar panel and login panel.
 * @param showAvatar, true to show avatar, false to show login
 */
function switchAvatarAndLoginPanel(showAvatar){
    let avatarPanel = document.getElementById("avatar_panel");
    let loginPanel = document.getElementById("login_panel");
    avatarPanel.style.display = showAvatar?'':'none';
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

checkCookie();