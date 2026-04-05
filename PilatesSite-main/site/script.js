document.addEventListener("DOMContentLoaded", function () {
  const classes = [
    {
      title: "PILATES",
      description:
        "Build core strength, improve posture, and move with greater control through low-impact sessions designed for all levels.",
      tags: "Core · Posture · Control",
      image: "media/pilates.png",
      alt: "Pilates class",
      link: "classes.html",
    },
    {
      title: "YOGA",
      description:
        "Slow down, stretch out, and reconnect with your body through calming flows that support balance, breathing, and relaxation.",
      tags: "Flow · Breathe · Relax",
      image: "media/yoga.png",
      alt: "Yoga class",
      link: "classes.html",
    },
    {
      title: "MOBILITY & STRETCH",
      description:
        "Improve flexibility, ease muscle tension, and support recovery with guided stretches and mobility-focused movement.",
      tags: "Recover · Flexibility · Restore",
      image: "media/mobility.png",
      alt: "Mobility and stretch class",
      link: "classes.html",
    },
  ];

  let currentIndex = 0;

  const image = document.getElementById("featured-class-image");
  const title = document.getElementById("featured-class-title");
  const description = document.getElementById("featured-class-description");
  const tags = document.getElementById("featured-class-tags");
  const link = document.getElementById("featured-class-link");
  const prevButton = document.getElementById("prev-slide");
  const nextButton = document.getElementById("next-slide");
  const panel = document.querySelector(".featured-panel");

  function updateSlide(direction) {
    const currentClass = classes[currentIndex];

    image.src = currentClass.image;
    image.alt = currentClass.alt;
    title.textContent = currentClass.title;
    description.textContent = currentClass.description;
    tags.textContent = currentClass.tags;
    link.href = currentClass.link;

    if (panel) {
      panel.classList.remove("slide-left", "slide-right");

      void panel.offsetWidth;

      if (direction === "next") {
        panel.classList.add("slide-left");
      } else if (direction === "prev") {
        panel.classList.add("slide-right");
      }
    }
  }

  nextButton.addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % classes.length;
    updateSlide("next");
  });

  prevButton.addEventListener("click", function () {
    currentIndex = (currentIndex - 1 + classes.length) % classes.length;
    updateSlide("prev");
  });

  updateSlide();
});