const targetDate = new Date("2026-03-06T09:00:00").getTime();

function updateCountdown() {
    const now = Date.now();
    const diff = targetDate - now;

    // Stop when countdown reaches zero
    if (diff <= 0) {
        document.getElementById("countdown").textContent = "Countdown complete!";
        clearInterval(timer);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
        (diff % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
        (diff % (1000 * 60)) / 1000
    );

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    // document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

// Initial run + update every second
updateCountdown();
const timer = setInterval(updateCountdown, 1000);