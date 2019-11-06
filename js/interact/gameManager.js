/**
 * Class for interactive action with server in game process.
 */
class GameManager{

    constructor(){
        this.pendingRequestList = [];
        //start interval to try resend failed requests
        //this.retryInterval = setInterval(this.sendWaitingRequests,30000)
    }

    setCurrentGameToken(gameToken){
        this.gameToken = gameToken;
    }

    getCurrentGameToken(){
        return this.gameToken;
    }

    /**
     * Send current game result immediately.
     * @param opponent
     * @param isWin
     * @param gameToken
     */
    sendGameResult(opponent, isWin, gameToken){
        let resPromise = postRequest(
            {
                //dangerous fetch...
                username: avatar.GetNickname()[0],
                opponent: opponent,
                gameToken: gameToken,
                win: isWin
            }
            ,serverHost + "/infos/update"
            ,{
                token: getCookie('token')[0]
            }
        );
        resPromise.then(regMessage => {
            if (regMessage !== undefined && regMessage['status'] === status_succeed) {
                console.log(regMessage);
                console.log("Send success " + gameToken);
            }
            //if register failed, add into pending request list
            else {
                console.log("Send failed")
                console.log(regMessage);
                this.pendingRequestList.push({
                    opponent: opponent,
                    isWin: isWin,
                    gameToken: gameToken
                });
            }
        });
    }

    /**
     * Polling to send unconfirmed requests, but send one request each time
     */
    sendWaitingRequests(){
        console.log("retrying");
        let currentListLength = this.pendingRequestList.length;
        for(let index = 0; index<currentListLength; index++){
            this.sendGameResult(this.pendingRequestList.shift());
        }
    }

}

const gameManager = new GameManager();