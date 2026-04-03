/**
 * Name: Snehal Sinha
 * File Name: temperature.ts
 * Date: March 7th, 2026
 * Description: This program converts temperatures between Celsius and Fahrenheit. 
 *              It takes user input for either Celsius or Fahrenheit, 
 *              performs the conversion, and displays the result on the webpage.
 */

//conversion functions
function convertToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32;
}

function convertToCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5/9;
}

//getting HTML elements
let celsiusInput = document.getElementById("inputCelsius") as HTMLInputElement;
let fahrenheitInput = document.getElementById("inputFahrenheit") as HTMLInputElement;
let display = document.getElementById("displayTemp") as HTMLParagraphElement;

celsiusInput.onchange = () => {
    // unary plus to convert string to number
    let celsiusValue = +celsiusInput.value;
    let convertedValue = convertToFahrenheit(celsiusValue);
    
    // update Fahrenheit input field
    fahrenheitInput.value = convertedValue.toString();
    // display result
    display.innerHTML = `Temperature in Fahrenheit: ${convertedValue} °F`; 

};

fahrenheitInput.onchange = () => {
    //unary plus to convert string to number
    let fahrenheitValue = +fahrenheitInput.value; 
    let convertedValue = convertToCelsius(fahrenheitValue);
    
    // update Celsius input field
    celsiusInput.value = convertedValue.toString(); 
    // display result
    display.innerHTML = `Temperature in Celsius: ${convertedValue} °C`; 
};




