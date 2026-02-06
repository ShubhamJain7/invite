import "./preloader.js";
import "./lanterns.js";
// import "./lanterns.edit.js";
import "./customization.js";
import "./countdown.js";
import { initCarousel } from "./carousel.js";

if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

const revealItems = document.querySelectorAll('.reveal')
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return
            entry.target.dataset.visible = 'true'
            observer.unobserve(entry.target)
        })
    },
    { threshold: 0.10 }
)
revealItems.forEach((el, i) => {
    el.style.transitionDelay = `100ms`
    observer.observe(el)
})

// Initialize carousel
initCarousel()