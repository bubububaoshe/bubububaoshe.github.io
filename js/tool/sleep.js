/**
 * Mock up sleep for test
 * @param delay
 */
function mockSleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
}