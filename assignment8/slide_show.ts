/**
 * Name: Snehal Sinha
 * File Name: slide_show.ts
 * Date: March 14th, 2026
 * Description: This program creates a simple slide show that cycles through a set of images.
 *              It uses an array to store image file names and captions, and automatically
 *              changes the slides every few seconds.
 *             All images are sourced from unsplash.com and are free to use under the Unsplash License.
 */
interface Slide {
    image: string;
    caption: string;
}

// array holding each slide's image file and caption
const slides: Slide[] = [
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
let currentIndex: number = 0;

// connect to the HTML elements
const slideImage = document.getElementById("slide-image") as HTMLImageElement;
const captionText = document.getElementById("caption") as HTMLParagraphElement;

// display one slide
function showSlide(index: number): void {
    slideImage.src = slides[index].image;
    captionText.textContent = slides[index].caption;
}

// move to the next slide
function nextSlide(): void {
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