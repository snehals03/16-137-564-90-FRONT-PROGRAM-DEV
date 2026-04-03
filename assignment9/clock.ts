/**
 * Name: Snehal Sinha
 * File Name: clock.ts
 * Date: March 26, 2026
 */


// Clock class stores the data and methods needed to display the current time and date
class Clock {
  // References to the HTML elements where we display the time and date
  private clockElement: HTMLElement | null;
  private dateElement: HTMLElement | null;
  

  // Constructor runs when a new Clock object is created
  // It connects the class to the HTML element using its id
  constructor(clockId: string, dateId: string) {
    this.clockElement = document.getElementById(clockId);
    this.dateElement = document.getElementById(dateId);
  }

  // Adds a leading zero if the number is less than 10
  private pad(num: number): string {
    return num < 10 ? "0" + num : num.toString();
  }

  // Gets the current time and formats it as HH:MM:SS
  private getCurrentTimeString(): string {
    const current: Date = new Date();
    const hours: string = this.pad(current.getHours());
    const minutes: string = this.pad(current.getMinutes());
    const seconds: string = this.pad(current.getSeconds());

    return `${hours}:${minutes}:${seconds}`;
  }

  // Gets the current date as a readable string
  private getCurrentDateString(): string {
    const current: Date = new Date();
    return current.toDateString();
  }

  // Updates the HTML element with the current time and date
  public updateClock(): void {
    if (!this.clockElement || !this.dateElement) {
      console.error("One or more clock elements not found");
      return;
    }

    this.clockElement.textContent = this.getCurrentTimeString();
    this.dateElement.textContent = this.getCurrentDateString();
  }

  // Starts the clock by updating it immediately
  // and then refreshing it every second
  public startClock(): void {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }
}

const myClock = new Clock("clockDisplay", "dateDisplay");
myClock.startClock();