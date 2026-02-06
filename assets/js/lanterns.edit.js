/* ==========================================================
   LANTERNS — EDIT MODE (FINAL)
   ========================================================== */

document.documentElement.classList.add("lantern-editing");

const isMobile = window.innerWidth < 768;
const storageKey = isMobile ? "lanternConfig_mobile" : "lanternConfig_desktop";
const layer = document.getElementById("lantern-layer");

layer.style.pointerEvents = "auto";
layer.style.zIndex = "30";

/* ---------- STATE ---------- */

let lanternState = [];
let selectedId = null;
let idCounter = 1;

/* ---------- HELPERS ---------- */

const rand = (a, b) => Math.random() * (b - a) + a;

function makeDefaults() {
    idCounter = 1;

    const anchors = isMobile
        ? [{ x: 30, y: 18 }, { x: 70, y: 22 }, { x: 50, y: 55 }]
        : [{ x: 20, y: 14 }, { x: 50, y: 18 }, { x: 80, y: 16 }];

    const out = [];
    anchors.forEach(a => {
        for (let i = 0; i < 3; i++) {
            out.push({
                id: idCounter++,
                x: a.x + rand(-6, 6),
                y: a.y + rand(-5, 5),
                size: rand(isMobile ? 45 : 65, isMobile ? 65 : 95),
                rotation: rand(-10, 10),
                depth: rand(0.15, 0.35),
                z: out.length,
                speed: "",
                glow: true
            });
        }
    });
    return out;
}

function loadConfig() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return makeDefaults();
    try {
        const parsed = JSON.parse(raw);
        parsed.forEach(l => {
            if (!l.id) l.id = idCounter++;
            if (l.z == null) l.z = 0;
        });
        return parsed;
    } catch {
        return makeDefaults();
    }
}

function saveConfig() {
    localStorage.setItem(storageKey, JSON.stringify(lanternState));
    flash("Saved");
}

function flash(txt) {
    const el = document.createElement("div");
    el.textContent = txt;
    el.style.cssText = `
        position:fixed;top:16px;right:16px;
        background:#000c;color:#fff;
        padding:6px 10px;border-radius:6px;
        z-index:9999`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
}

/* ---------- RENDER ---------- */

function renderAll() {
    layer.innerHTML = "";
    lanternState
        .sort((a, b) => a.z - b.z)
        .forEach(l => {
            const el = document.createElement("img");
            el.src = "./assets/lantern.png";
            el.className = "lantern lantern-main";
            el.dataset.id = l.id;
            el.tabIndex = 0;

            el.style.cssText = `
                position:absolute;
                left:${l.x}%;
                top:${l.y}%;
                width:${l.size}px;
                transform:translate(-50%,0) rotate(${l.rotation}deg);
                z-index:${l.z};
                cursor:grab;
            `;

            layer.appendChild(el);
        });

    attachInteractions();
    updateInspector();
}

function applyState(l) {
    const el = layer.querySelector(`[data-id="${l.id}"]`);
    if (!el) return;

    el.style.left = l.x + "%";
    el.style.top = l.y + "%";
    el.style.width = l.size + "px";
    el.style.zIndex = l.z;
    el.style.transform = `translate(-50%,0) rotate(${l.rotation}deg)`;
}

/* ---------- SELECTION ---------- */

function select(id) {
    selectedId = id;
    layer.querySelectorAll(".lantern-main").forEach(el => {
        el.style.outline =
            el.dataset.id == id
                ? "2px solid rgba(255,255,255,.6)"
                : "none";
    });
    updateInspector();
}

function deselect() {
    selectedId = null;
    layer.querySelectorAll(".lantern-main").forEach(el => {
        el.style.outline = "none";
    });
    updateInspector();
}

/* ---------- INTERACTION ---------- */

function attachInteractions() {
    layer.querySelectorAll(".lantern-main").forEach(el => {
        el.onpointerdown = e => {
            e.preventDefault();
            const s = lanternState.find(l => l.id == el.dataset.id);
            if (!s) return;

            select(s.id);
            el.setPointerCapture(e.pointerId);

            const rect = layer.getBoundingClientRect();
            const sx = e.clientX, sy = e.clientY;
            const ox = s.x, oy = s.y;

            function move(ev) {
                s.x = Math.max(0, Math.min(100, ox + (ev.clientX - sx) / rect.width * 100));
                s.y = Math.max(0, Math.min(100, oy + (ev.clientY - sy) / rect.height * 100));
                applyState(s);
                updateInspector(false);
            }

            function up() {
                el.releasePointerCapture(e.pointerId);
                window.removeEventListener("pointermove", move);
                window.removeEventListener("pointerup", up);
            }

            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up);
        };
    });
}

/* ---------- DESELECT ---------- */

document.addEventListener("pointerdown", e => {
    const lantern = e.target.closest(".lantern-main");
    const inspector = document.getElementById("lantern-inspector");
    if (lantern) return;
    if (inspector && inspector.contains(e.target)) return;
    deselect();
});

/* ---------- INSPECTOR ---------- */

function updateInspector(rebuild = true) {
    const panel = document.getElementById("lantern-inspector");
    if (!panel) return;

    const box = panel.querySelector("#lantern-props");

    if (!selectedId) {
        box.innerHTML = "<em>No selection</em>";
        return;
    }

    const s = lanternState.find(l => l.id === selectedId);
    if (!s || !rebuild) return;

    box.innerHTML = `
        <div class="section">
            <label>X <input type="number" step="0.1" value="${s.x}"></label>
            <label>Y <input type="number" step="0.1" value="${s.y}"></label>
        </div>

        <hr>

        <div class="section">
            <label>Size <input type="number" step="1" value="${s.size}"></label>
            <label>Rotation <input type="number" step="1" value="${s.rotation}"></label>
        </div>

        <hr>

        <div class="section">
            <button id="up">Bring Forward</button>
            <button id="down">Send Back</button>
        </div>

        <hr>

        <div class="section">
            <button id="delete" style="color:#ffb3b3">Delete Lantern</button>
        </div>
    `;

    const inputs = box.querySelectorAll("input");
    inputs[0].oninput = e => { s.x = +e.target.value; applyState(s); };
    inputs[1].oninput = e => { s.y = +e.target.value; applyState(s); };
    inputs[2].oninput = e => { s.size = +e.target.value; applyState(s); };
    inputs[3].oninput = e => { s.rotation = +e.target.value; applyState(s); };

    box.querySelector("#up").onclick = () => { s.z++; normalizeZ(); renderAll(); };
    box.querySelector("#down").onclick = () => { s.z--; normalizeZ(); renderAll(); };

    box.querySelector("#delete").onclick = () => {
        if (!confirm("Delete this lantern?")) return;
        lanternState = lanternState.filter(l => l.id !== s.id);
        selectedId = null;
        normalizeZ();
        renderAll();
    };
}

/* ---------- Z ORDER ---------- */

function normalizeZ() {
    lanternState
        .sort((a, b) => a.z - b.z)
        .forEach((l, i) => l.z = i);
}

/* ---------- UI ---------- */

function makeUI() {
    const ui = document.createElement("div");
    ui.id = "lantern-inspector";
    ui.style.cssText = `
        position:fixed;bottom:16px;right:16px;
        background:#000c;color:#fff;
        padding:10px;border-radius:8px;
        z-index:9999;font-size:13px;
        min-width:180px`;
    ui.innerHTML = `
        <div class="section">
            <button id="reroll">Reroll</button>
            <button id="dup">Duplicate</button>
            <button id="save">Save</button>
        </div>
        <hr>
        <div id="lantern-props"></div>
    `;
    document.body.appendChild(ui);

    ui.querySelector("#reroll").onclick = () => {
        if (!confirm("Generate a new random layout? Unsaved changes will be lost.")) return;
        lanternState = makeDefaults();
        selectedId = null;
        renderAll();
        flash("Rerolled");
    };

    ui.querySelector("#dup").onclick = () => {
        const s = lanternState.find(l => l.id === selectedId);
        if (!s) return;
        lanternState.push({ ...s, id: idCounter++, x: s.x + 2, y: s.y + 2 });
        normalizeZ();
        renderAll();
    };

    ui.querySelector("#save").onclick = saveConfig;
}

/* ---------- INIT ---------- */

lanternState = loadConfig();
lanternState.forEach(l => idCounter = Math.max(idCounter, l.id + 1));
makeUI();
renderAll();
