/**
 * Invite process
 *     Player(inviter) click share button <share_button>
 *         -> a url with inviter name generated
 *             -> player(invitee) use the url
 *                 -> invitee parse link
 *                     -> invitee raise invite message to server to invite inviter (Invited_Confirmed)
 *                         -> server search for name online and return different message according to inviter status (Invited_Confirmed_Ack)
 *                            -> if inviter is available, jump to invite process.
 */

const shareHeader = "邀你来玩一局千秋戏！：";
const webUrl = "https://amadeus-lab.club/game/#";
const invitePrefix = "inviter=";

/**
 * Generate share link.
 */
function shareLink(){
    let link = "【"+avatar.nickname+"】" + shareHeader + webUrl + encodeURI(invitePrefix + avatar.GetNickname());
    let tag = document.createElement('input');
    tag.setAttribute('id', 'copy_input');
    tag.value = link;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('copy_input').select();
    document.execCommand('copy');
    document.getElementById('copy_input').remove();
    alert("已复制邀请！");
}

/**
 * Parse invite link and response to server.
 */
function parseLink(){
    //If not connected, retry after 1S
    if(socket === null || socket === undefined) {
        setTimeout(parseLink, 500);
        return;
    }
    let inviter = decodeURI(window.location.hash).split(invitePrefix)[1];
    if(inviter === undefined){
        //TODO alert user url not valid
    } else{
        if(inviter === avatar.GetNickname()[0]){
            //TODO alert cannot invite self.
        }
        //If already login
        else if(avatar.GetNickname()!==undefined && avatar.GetNickname()!==null){
            socket.emit('Invited_Confirmed', inviter)
        }
    }
}