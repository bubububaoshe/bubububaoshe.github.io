/**
 * Information module for query info from server
 */

function getUserWinAndLostInfo(){
    getUserInfo(getCookie('nickname')[0], getCookie('token')[0]);
}

/**
 * Update ui win and lost count and title
 */
function updateWinAndLostInfo(winCount, loseCount, title){
    document.getElementById('win_panel').innerText = "胜: " + winCount;
    document.getElementById('lose_panel').innerText = "负: " + loseCount;
    document.getElementById('title_panel').innerText = "称号: [" + title + "]";
}

/**
 * Get user info with username and token
 * @Param username
 * @Param token
 */
//TODO schedule to refresh info
function getUserInfo(username, token){
    let getInfoPromise = sendGetInfoRequest(username, token);
    getInfoPromise.then(infoResponse=>{
        if(infoResponse['status'] === status_succeed) {
            updateWinAndLostInfo(
                infoResponse['info']['win']===undefined?'--':infoResponse['info']['win']
                , infoResponse['info']['lose']===undefined?'--':infoResponse['info']['lose']
                , infoResponse['info']['title']===undefined?'--':infoResponse['info']['title']
            );
        } else {
            //TODO retry ?
            console.log(infoResponse);
        }
    });
}

/**
 * Auth entrance point.
 * @param username
 * @param token
 */
async function sendGetInfoRequest(username, token){
    let response = {
        message: "",
    };
    try {
        response = await postRequest(
            {username: username}
            ,serverHost + '/infos/game'
            ,{token: token}
        );
        return response;
    } catch (e) {
        console.error('Get Info Failed', e);
        response['message'] = 'Server error';
    }
    return response;
}
