/**
 * Native ajax call enclosure.
 * To avoid jquery or other 3rd-party library compliance issues
 */

const status_succeed = 'SUCCEED';
const status_fail = 'FAIL';

// const serverHost = "https://server.amadues.cn:8081";
const serverHost = "http://localhost:8080";

/**
 * Post ajax with payload
 * @Param payload, caller payload to send
 * @Param header, header to call with
 * @returns {object} server response
 */
function postRequest(payload, url, header){
    //TODO add compliance for IE6-
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', url);
        xhr.setRequestHeader("Content-type","application/json");
        for(let key in header){
            xhr.setRequestHeader(key, header[key]);
        }
        xhr.send(JSON.stringify(payload));
        xhr.onreadystatechange = function () {
            if(xhr.readyState !== 4) return;
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                console.log(xhr.responseText);
                reject(xhr.responseText);
            }
        }
    });
}

/**
 * Format the input ( maybe a lot of chinese chars ).
 * @param json, json need to be formatted
 * @returns {string} Formatted string
 */
function formatJson(json) {
    let arr = [];
    for (let name in json) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(json[name]));
    }
    return arr.join('&');
}