const searchParams = new URLSearchParams(window.location.search);
const events = searchParams.get("events") || "all";

const eventsItems = {
    "k": document.getElementById("kalash"),
    "h": document.getElementById("haldi"),
    "s": document.getElementById("sangeet"),
    "m": document.getElementById("mayra"),
    "r": document.getElementById("reception"),
    "sh": document.getElementById("shaadi"),
    "all": document.getElementById("all")
}

for (const [key, element] of Object.entries(eventsItems)) {
    if (!element) {
        console.warn(`Element for key "${key}" not found.`);
        continue;
    }
    if (events === "all" || events.includes(key)) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}