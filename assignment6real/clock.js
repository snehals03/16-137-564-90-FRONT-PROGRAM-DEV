/**
 * Name: Snehal Sinha
 * File Name: clock.js
 * Date: March 1st, 2026.
 */
function pad(num) {
    //converts 1 to 01
    return num < 10 ? "0" + num : "" + num;
}
function getCurrentTimeString() {
    var now = new Date();
    var hours = pad(now.getHours());
    var minutes = pad(now.getMinutes());
    var seconds = pad(now.getSeconds());
    return "".concat(hours, ":").concat(minutes, ":").concat(seconds);
}
function getCurrentDateString() {
    var now = new Date();
    return now.toDateString();
}
function updateClock() {
    var clockElement = document.getElementById("clockDisplay");
    if (clockElement) {
        clockElement.innerHTML = "".concat(getCurrentTimeString(), "<br>").concat(getCurrentDateString());
    }
}
// updating immediately and then every sec
updateClock();
setInterval(updateClock, 1000);
