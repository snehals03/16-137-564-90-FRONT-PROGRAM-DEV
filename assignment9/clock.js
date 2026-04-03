"use strict";
/**
 * Name: Snehal Sinha
 * File Name: clock.ts
 * Date: March 26, 2026
 */
// Clock class stores the data and methods needed to display the current time and date
var Clock = /** @class */ (function () {
    // Constructor runs when a new Clock object is created
    // It connects the class to the HTML element using its id
    function Clock(clockId, dateId) {
        this.clockElement = document.getElementById(clockId);
        this.dateElement = document.getElementById(dateId);
    }
    // Adds a leading zero if the number is less than 10
    Clock.prototype.pad = function (num) {
        return num < 10 ? "0" + num : num.toString();
    };
    // Gets the current time and formats it as HH:MM:SS
    Clock.prototype.getCurrentTimeString = function () {
        var current = new Date();
        var hours = this.pad(current.getHours());
        var minutes = this.pad(current.getMinutes());
        var seconds = this.pad(current.getSeconds());
        return "".concat(hours, ":").concat(minutes, ":").concat(seconds);
    };
    // Gets the current date as a readable string
    Clock.prototype.getCurrentDateString = function () {
        var current = new Date();
        return current.toDateString();
    };
    // Updates the HTML element with the current time and date
    Clock.prototype.updateClock = function () {
        if (!this.clockElement || !this.dateElement) {
            console.error("One or more clock elements not found");
            return;
        }
        this.clockElement.textContent = this.getCurrentTimeString();
        this.dateElement.textContent = this.getCurrentDateString();
    };
    // Starts the clock by updating it immediately
    // and then refreshing it every second
    Clock.prototype.startClock = function () {
        var _this = this;
        this.updateClock();
        setInterval(function () { return _this.updateClock(); }, 1000);
    };
    return Clock;
}());
var myClock = new Clock("clockDisplay", "dateDisplay");
myClock.startClock();
