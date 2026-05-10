const hero = document.querySelector(".hero");
const layerOne = document.querySelector(".layer-one");
const layerTwo = document.querySelector(".layer-two");
const portrait = document.querySelector(".portrait-wrap");
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-button");
const sections = document.querySelectorAll("#achievements, #hobbies");
const parallaxSections = document.querySelectorAll(".content-section");

function updateParallax() {
  if (!hero || !layerOne || !layerTwo || !portrait) {
    return;
  }

  const heroRect = hero.getBoundingClientRect();
  const progress = Math.min(Math.max(-heroRect.top / heroRect.height, 0), 1);

  layerOne.style.setProperty("--parallax-y", `${progress * 90}px`);
  layerTwo.style.setProperty("--parallax-y", `${progress * -130}px`);
  portrait.style.setProperty("--portrait-shift", `${progress * 34}px`);

  parallaxSections.forEach((section) => {
    const sectionRect = section.getBoundingClientRect();
    const sectionProgress =
      (window.innerHeight - sectionRect.top) / (window.innerHeight + sectionRect.height);
    const boundedProgress = Math.min(Math.max(sectionProgress, 0), 1);
    const shift = (boundedProgress - 0.5) * -150;

    section.style.setProperty("--section-shift", `${shift}px`);
  });

}

function updateActiveNav() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;

    if (sectionTop < window.innerHeight * 0.45) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("is-active", isActive);
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  { rootMargin: "0px 0px -10% 0px", threshold: 0.16 }
);

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", targetId);
  });
});

revealItems.forEach((item) => revealObserver.observe(item));
window.addEventListener("scroll", updateParallax, { passive: true });
window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("resize", updateParallax);
updateParallax();
updateActiveNav();
