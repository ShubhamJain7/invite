const audio = document.getElementById("bg-music");
const logo = document.getElementById("logo");
const enterBtn = document.getElementById("enter");
const preloader = document.getElementById("preloader");
const scene = document.getElementById("scene");
const muteBtn = document.getElementById("mute-btn");

// Set default volume to 75%
if (audio) {
    audio.volume = 0.75;
}

// Mute button handling (bottom-right)
function updateMuteButton() {
    if (!muteBtn || !audio) return;
    const iconOn = muteBtn.querySelector('.on');
    const iconOff = muteBtn.querySelector('.off');
    if (iconOn) iconOn.classList.toggle('hidden', audio.muted);
    if (iconOff) iconOff.classList.toggle('hidden', !audio.muted);
    muteBtn.setAttribute("aria-pressed", audio.muted ? "true" : "false");
}
if (muteBtn && audio) {
    updateMuteButton();
    muteBtn.addEventListener("click", () => {
        audio.muted = !audio.muted;
        updateMuteButton();
    });
}

// Prevent page scrolling while preloader is visible
document.body.classList.add("overflow-hidden");

function waitForImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // fail-soft
    });
}

function waitForAudio(audioEl) {
    return new Promise(resolve => {
        if (audioEl.readyState >= 3) return resolve();
        audioEl.addEventListener("canplaythrough", resolve, { once: true });
    });
}

let entered = false;
function enter() {
    if (entered) return;
    entered = true;
    preloader.classList.add("opacity-0");

    setTimeout(() => {
        preloader.remove();
        document.body.classList.remove("overflow-hidden");
        muteBtn.classList.remove("hidden");
    }, 600);

    audio.play().catch(() => { });
}

Promise.all([
    waitForImage("./assets/hero.png"),
    waitForImage("./assets/hero-sm.png"),
    waitForAudio(audio),
    document.fonts?.ready ?? Promise.resolve(),
]).then(() => {
    preloader.classList.add("cursor-pointer");
    logo.classList.remove("animate-pulse");
    scene.classList.remove("hidden");
    enterBtn.classList.remove("animate-pulse")
    enterBtn.classList.add("animate-bounce");
    enterBtn.innerText = "Tap anywhere to enter";

    // Allow tapping anywhere on the preloader to proceed
    preloader.addEventListener("click", enter, { once: true });
    // Keep the button behavior as well
    enterBtn.addEventListener("click", enter, { once: true });
});