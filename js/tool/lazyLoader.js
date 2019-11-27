/**
 * Load all images to cache
 */
function loadAllResources(){
    let hosts = [g_resource_prefix, g_resource_prefix, g_resource_prefix, g_resource_prefix];
    if(online){
        hosts = [
            "https://qianqiuxi.net/game/",
            "https://server.amadues.cn:3233/"
        ];
    }
    new Image().src = g_resource_prefix + "img/" +  "back" + ".jpg";
    for(let genIndex = 0; genIndex <COMMON_CHAR_LIST.length; genIndex++){
        for(let charIndex = 0; charIndex < COMMON_CHAR_LIST[genIndex].length; charIndex++ ){
            new Image().src = hosts[charIndex%hosts.length]
                + "img/" + COMMON_CHAR_LIST[genIndex][charIndex][0] + ".jpg";
        }
    }
    for(let genIndex = 0; genIndex <SPECIAL_CHAR_LIST.length; genIndex++){
        for(let charIndex = 0; charIndex < SPECIAL_CHAR_LIST[genIndex].length; charIndex++ ){
            new Image().src = hosts[charIndex%hosts.length]
                + "img/" + SPECIAL_CHAR_LIST[genIndex][charIndex] + ".jpg";
        }
    }
    for(let comboIndex=0; comboIndex <COMBO_LIST.length; comboIndex++){
        new Audio(hosts[comboIndex%hosts.length] + 'combomp3/' + COMBO_LIST[comboIndex][3] + '.mp3')
    }
}
