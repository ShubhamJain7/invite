import "./preloader.js";
import "./lanterns.js";
import "./customization.js";
import "./countdown.js";

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
    { threshold: 0.15 }
)
revealItems.forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`
    observer.observe(el)
})