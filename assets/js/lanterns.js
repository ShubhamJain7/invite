const isMobile = window.innerWidth < 768;
/* Smaller focal zones on mobile */
const focalZones = isMobile
    ? [
        { x: 50, y: 48, r: 10 },
        { x: 50, y: 64, r: 8 }
    ]
    : [
        { x: 50, y: 45, r: 18 },
        { x: 50, y: 62, r: 14 }
    ];

// COMPOSITIONS
const desktopAnchors = [
    { x: 14, y: 8 }, { x: 28, y: 14 }, { x: 72, y: 12 }, { x: 86, y: 18 },
    { x: 20, y: 28 }, { x: 50, y: 32 }, { x: 80, y: 30 },
    { x: 18, y: 44 }, { x: 82, y: 46 },
    { x: 26, y: 60 }, { x: 74, y: 62 },
    { x: 34, y: 76 }, { x: 66, y: 80 },
];
const mobileAnchors = [
    { x: 28, y: 12 }, { x: 72, y: 14 },
    { x: 40, y: 26 }, { x: 60, y: 28 },
    { x: 32, y: 44 }, { x: 68, y: 46 },
    { x: 40, y: 62 }, { x: 60, y: 64 },
    { x: 50, y: 78 },
    { x: 46, y: 92 }, { x: 54, y: 94 }
];

//HELPERS
function rand(min, max) {
    return Math.random() * (max - min) + min;
}
function insideFocal(x, y) {
    return focalZones.some(z => {
        const dx = x - z.x;
        const dy = y - z.y;
        return Math.sqrt(dx * dx + dy * dy) < z.r;
    });
}

//BUILD
const layer = document.getElementById("lantern-layer");
const anchors = isMobile ? mobileAnchors : desktopAnchors;

/* Density */
const density = isMobile ? 2.1 : 2.6;

anchors.forEach(a => {
    for (let i = 0; i < density; i++) {
        const x = a.x + rand(-5, 5);
        const y = a.y + rand(-3.5, 3.5);
        if (insideFocal(x, y)) continue;

        /* Size tiers */
        let size;
        const roll = Math.random();

        if (!isMobile && roll > 0.92) {
            size = rand(130, 170); // hero lanterns (desktop only)
        } else if (roll > 0.6) {
            size = rand(isMobile ? 42 : 55, isMobile ? 58 : 80);
        } else {
            size = rand(isMobile ? 34 : 45, isMobile ? 48 : 65);
        }

        const speed = roll > 0.85 ? "slow" : roll < 0.25 ? "fast" : "";

        const depth = rand(0.12, 0.38);
        const rotation = rand(-10, 10);

        /* Glow */
        const glow = document.createElement("img");
        glow.src = "./assets/lantern.png";
        glow.className = "lantern lantern-glow";
        glow.style.width = size + "px";
        glow.style.left = x + "%";
        glow.style.top = y + "%";
        glow.style.position = "absolute";
        glow.style.transform = "translateX(-50%)";
        glow.dataset.depth = depth * 0.55;

        /* Main */
        const lantern = document.createElement("img");
        lantern.src = "./assets/lantern.png";
        lantern.className = `lantern lantern-main ${speed}`;
        lantern.style.setProperty("--r", rotation + "deg");
        lantern.style.width = size + "px";
        lantern.style.left = x + "%";
        lantern.style.top = y + "%";
        lantern.style.position = "absolute";
        lantern.style.transform = "translateX(-50%)";
        lantern.dataset.depth = depth;

        layer.appendChild(glow);
        layer.appendChild(lantern);
    }
});

window.addEventListener("scroll", () => {
    const s = window.scrollY;
    document.querySelectorAll(".lantern").forEach(el => {
        const d = el.dataset.depth || 0.2;
        el.style.transform =
            `translate(-50%, ${s * d}px) rotate(var(--r))`;
    });
});