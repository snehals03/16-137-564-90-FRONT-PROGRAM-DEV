"use strict";
// array holding each slide's image file and caption
const slides = [
    { image: "images/rose.jpg", caption: "Rose - a symbol of love and beauty." },
    { image: "images/sunflower.jpg", caption: "Sunflower - bright and bold." },
    { image: "images/tulip.jpg", caption: "Tulip - soft petals with a simple but elegant shape." },
    { image: "images/daisy.jpg", caption: "Daisy - cheerful and simple." },
    { image: "images/lily.jpg", caption: "Lily - graceful and fragrant." },
    { image: "images/orchid.jpg", caption: "Orchid - exotic and delicate." },
    { image: "images/daffodil.jpg", caption: "Daffodil - a sign of spring and renewal." },
    { image: "images/lavender.jpg", caption: "Lavender - calming and fragrant." },
    { image: "images/marigold.jpg", caption: "Marigold - vibrant and full of life." },
    { image: "images/peony.jpg", caption: "Peony - lush and romantic." },
    { image: "images/chrysanthemum.jpg", caption: "Chrysanthemum - a symbol of longevity and joy." }
];
// keeps track of the current slide number
let currentIndex = 0;
// connect to the HTML elements
const slideImage = document.getElementById("slide-image");
const captionText = document.getElementById("caption");
// display one slide
function showSlide(index) {
    slideImage.src = slides[index].image;
    captionText.textContent = slides[index].caption;
}
// move to the next slide
function nextSlide() {
    currentIndex++;
    // if it goes past the last slide, go back to the first
    if (currentIndex >= slides.length) {
        currentIndex = 0;
    }
    showSlide(currentIndex);
}
// show the first slide when the page loads
showSlide(currentIndex);
// automatically change slides every 4 seconds
setInterval(nextSlide, 4000);
