/**
 * Register module for user register and login
 */


function popRegisterWindow(isLogin) {
    let registerWindow = document.getElementById('register_window');
    let confirmPwdWindow = document.getElementById('confirm_password_block');
    if(isLogin){
        confirmPwdWindow.style.display = 'none';
    } else {
        confirmPwdWindow.style.display = '';
    }
    registerWindow.style.height = "34vw";
}

function closeRegisterWindow(){
    let registerWindow = document.getElementById('register_window');
    registerWindow.style.height = "0";
}

function getInputUsernameAndPwdThenRegister(){
    console.log("register");
    let username = document.getElementById("username_input").value;
    let password = document.getElementById("password_input").value;
    let confirmPassword = document.getElementById("confirm_password_input").value;
    if(username.length===0){
        console.log("please input username!");
    } else if(password.length<1){
        console.log("password too short!");
    } else if(password!==confirmPassword){
        console.log("password not match!");
    } else {
        let regMessage = sendRegisterRequest(username, password);
        //if register succeed, cookie would be updated, auto trigger login
        //TODO login need close the register window
        if(regMessage !== undefined && regMessage['succeed'] === true){
            sendLoginRequest(username, password);
        }
        //if register failed, show the fail message
        else{
            document.getElementById("register_message").style.display = '';
            document.getElementById("register_message").innerText = regMessage['message'];
        }
    }
}

/**
 * Register entrance point.
 * @param username
 * @param password
 */
function sendRegisterRequest(username, password){
    //TODO send through socket or restful???
    //TODO maybe CROS
    console.log("Remain send to server");
    return {
        succeed: true,
        message: "connection failed"
    }
}

/**
 * Login entrance point.
 * @param username
 * @param password
 */
function sendLoginRequest(username, password){
    console.log("login");
    let message = {
        succeed: true,
        message: "connection failed"
    };
    //Login succeed, update cookie and close register window / login window
    if(message!==undefined && message['succeed'] === true){
        //TODO set cookie back to browser
        closeRegisterWindow();
    }
}