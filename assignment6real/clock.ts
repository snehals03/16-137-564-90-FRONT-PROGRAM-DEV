/**
 * Name: Snehal Sinha
 * File Name: clock.js
 * Date: March 1st, 2026.
 */

function pad(num: number): string {
  //converts 1 to 01
  return num < 10 ? "0" + num : "" + num;
}

function getCurrentTimeString(): string {
  const now: Date = new Date();
  const hours: string = pad(now.getHours());
  const minutes: string = pad(now.getMinutes());
  const seconds: string = pad(now.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

function getCurrentDateString(): string {
  const now = new Date();
  return now.toDateString();
}

function updateClock(): void {
  const clockElement = document.getElementById("clockDisplay");
  if (clockElement) {
    clockElement.innerHTML = `${getCurrentTimeString()}<br>${getCurrentDateString()}`;
  }
}
// updating immediately and then every sec
updateClock();
setInterval(updateClock, 1000);

