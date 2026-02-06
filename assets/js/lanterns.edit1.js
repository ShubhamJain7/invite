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

// HELPERS
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

// Persistence keys per breakpoint
const storageKey = isMobile ? "lanternConfig_mobile" : "lanternConfig_desktop";

// BUILD + Editor
const layer = document.getElementById("lantern-layer");
// ensure the layer allows pointer interactions for editable lanterns
if (layer) {
    layer.classList.remove('pointer-events-none');
    layer.style.pointerEvents = 'auto';
}
const anchors = isMobile ? mobileAnchors : desktopAnchors;
const density = isMobile ? 2.1 : 2.6;

let lanternState = []; // array of lantern objects
let selectedId = null;
let idCounter = 1;

function makeDefaultLanterns() {
    const list = [];
    anchors.forEach(a => {
        for (let i = 0; i < density; i++) {
            const x = a.x + rand(-5, 5);
            const y = a.y + rand(-3.5, 3.5);
            if (insideFocal(x, y)) continue;

            const roll = Math.random();
            let size;
            if (!isMobile && roll > 0.92) {
                size = rand(130, 170);
            } else if (roll > 0.6) {
                size = rand(isMobile ? 42 : 55, isMobile ? 58 : 80);
            } else {
                size = rand(isMobile ? 34 : 45, isMobile ? 48 : 65);
            }

            const speed = roll > 0.85 ? "slow" : roll < 0.25 ? "fast" : "";
            const depth = rand(0.12, 0.38);
            const rotation = rand(-10, 10);

            list.push({
                id: idCounter++,
                x, y,
                size,
                depth,
                rotation,
                speed,
                glow: true
            });
        }
    });
    return list;
}

function loadConfig() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return makeDefaultLanterns();
    try {
        const parsed = JSON.parse(raw);
        // ensure ids
        parsed.forEach(p => {
            if (!p.id) p.id = idCounter++;
        });
        return parsed;
    } catch (e) {
        console.warn('Invalid lantern config, using defaults', e);
        return makeDefaultLanterns();
    }
}

function saveConfig() {
    const toSave = lanternState.map(l => ({ id: l.id, x: l.x, y: l.y, size: l.size, depth: l.depth, rotation: l.rotation, speed: l.speed, glow: l.glow }));
    localStorage.setItem(storageKey, JSON.stringify(toSave));
    flashMessage('Saved');
}

function resetToDefaults() {
    if (confirm('Reset lantern positions to defaults?')) {
        localStorage.removeItem(storageKey);
        init();
    }
}

function flashMessage(text) {
    let el = document.getElementById('lantern-msg');
    if (!el) {
        el = document.createElement('div');
        el.id = 'lantern-msg';
        el.style.position = 'fixed';
        el.style.right = '16px';
        el.style.top = '16px';
        el.style.padding = '6px 10px';
        el.style.background = 'rgba(0,0,0,0.6)';
        el.style.color = '#fff';
        el.style.borderRadius = '6px';
        el.style.zIndex = 60;
        document.body.appendChild(el);
    }
    el.textContent = text;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = '0'; }, 1500);
}

function createLanternElements() {
    layer.innerHTML = '';
    lanternState.forEach(l => {
        // glow
        const glow = document.createElement('img');
        glow.src = './assets/lantern.png';
        glow.className = 'lantern lantern-glow';
        glow.style.width = l.size + 'px';
        glow.style.left = l.x + '%';
        glow.style.top = l.y + '%';
        glow.style.position = 'absolute';
        glow.style.transform = 'translateX(-50%)';
        glow.dataset.depth = l.depth * 0.55;
        glow.dataset.id = l.id;
        // glow should not block pointer events so the main image is clickable
        glow.style.pointerEvents = 'none';

        // main
        const el = document.createElement('img');
        el.src = './assets/lantern.png';
        el.className = 'lantern lantern-main ' + (l.speed || '');
        el.style.width = l.size + 'px';
        el.style.left = l.x + '%';
        el.style.top = l.y + '%';
        el.style.position = 'absolute';
        el.style.setProperty('--r', l.rotation + 'deg');
        el.style.transform = `translate(-50%, ${window.scrollY * l.depth}px) rotate(var(--r))`;
        el.dataset.depth = l.depth;
        el.dataset.id = l.id;

        // selection box (invisible until selected)
        el.style.cursor = 'grab';
        // main should accept pointer events
        el.style.pointerEvents = 'auto';

        layer.appendChild(glow);
        layer.appendChild(el);
    });
}

function findStateById(id) {
    return lanternState.find(l => String(l.id) === String(id));
}

function selectLantern(id) {
    selectedId = id;
    document.querySelectorAll('#lantern-layer .lantern-main').forEach(el => {
        if (el.dataset.id == id) {
            el.style.outline = '2px solid rgba(255,255,255,0.6)';
            el.style.zIndex = 55;
        } else {
            el.style.outline = 'none';
            el.style.zIndex = '';
        }
    });
    updateInspector();
}

function deselect() {
    selectedId = null;
    document.querySelectorAll('#lantern-layer .lantern-main').forEach(el => el.style.outline = 'none');
    updateInspector();
}

// Inspector UI
function createInspector() {
    if (document.getElementById('lantern-inspector')) return;
    const panel = document.createElement('div');
    panel.id = 'lantern-inspector';
    panel.style.position = 'fixed';
    panel.style.right = '16px';
    panel.style.bottom = '16px';
    panel.style.background = 'rgba(0,0,0,0.6)';
    panel.style.color = '#fff';
    panel.style.padding = '10px';
    panel.style.borderRadius = '8px';
    panel.style.zIndex = 60;
    panel.style.minWidth = '180px';

    panel.innerHTML = `
        <div style="font-weight:600;margin-bottom:6px">Lantern Editor</div>
        <div id="inspector-controls">
            <div style="display:flex;gap:6px;margin-bottom:6px">
                <button id="dup-btn">Duplicate</button>
                <button id="del-btn">Delete</button>
            </div>
            <div style="display:flex;gap:6px;margin-bottom:6px">
                <button id="save-btn">Save</button>
                <button id="reset-btn">Reset</button>
            </div>
            <div id="props" style="font-size:13px"></div>
        </div>
    `;
    document.body.appendChild(panel);

    panel.querySelector('#dup-btn').addEventListener('click', () => {
        if (!selectedId) return flashMessage('Select a lantern first');
        const src = findStateById(selectedId);
        if (!src) return;
        const copy = Object.assign({}, src, { id: idCounter++, x: Math.min(src.x + 3, 98), y: Math.min(src.y + 3, 98) });
        lanternState.push(copy);
        createLanternElements();
        attachInteractions();
        selectLantern(copy.id);
    });
    panel.querySelector('#del-btn').addEventListener('click', () => {
        if (!selectedId) return flashMessage('Select a lantern first');
        lanternState = lanternState.filter(l => String(l.id) !== String(selectedId));
        selectedId = null;
        createLanternElements();
        attachInteractions();
        updateInspector();
    });
    panel.querySelector('#save-btn').addEventListener('click', saveConfig);
    panel.querySelector('#reset-btn').addEventListener('click', resetToDefaults);
}

function updateInspector() {
    const box = document.getElementById('props');
    if (!box) return;
    if (!selectedId) {
        box.innerHTML = '<div style="opacity:0.8">No lantern selected</div>';
        return;
    }
    const s = findStateById(selectedId);
    if (!s) return;
    box.innerHTML = `
        <div>X: <input id="p-x" type="number" value="${s.x.toFixed(1)}" style="width:60px"></div>
        <div>Y: <input id="p-y" type="number" value="${s.y.toFixed(1)}" style="width:60px"></div>
        <div>Size(px): <input id="p-size" type="number" value="${Math.round(s.size)}" style="width:80px"></div>
        <div>Rot(deg): <input id="p-rot" type="number" value="${Math.round(s.rotation)}" style="width:60px"></div>
    `;
    box.querySelector('#p-x').addEventListener('change', (e) => { s.x = parseFloat(e.target.value); applyStateToDOM(s); });
    box.querySelector('#p-y').addEventListener('change', (e) => { s.y = parseFloat(e.target.value); applyStateToDOM(s); });
    box.querySelector('#p-size').addEventListener('change', (e) => { s.size = parseFloat(e.target.value); applyStateToDOM(s); });
    box.querySelector('#p-rot').addEventListener('change', (e) => { s.rotation = parseFloat(e.target.value); applyStateToDOM(s); });
}

function applyStateToDOM(state) {
    const mains = layer.querySelectorAll('.lantern-main');
    mains.forEach(el => {
        if (String(el.dataset.id) === String(state.id)) {
            el.style.left = state.x + '%';
            el.style.top = state.y + '%';
            el.style.width = state.size + 'px';
            el.style.setProperty('--r', state.rotation + 'deg');
            el.style.transform = `translate(-50%, ${window.scrollY * state.depth}px) rotate(var(--r))`;
        }
    });
    const glows = layer.querySelectorAll('.lantern-glow');
    glows.forEach(el => {
        if (String(el.dataset.id) === String(state.id)) {
            el.style.left = state.x + '%';
            el.style.top = state.y + '%';
            el.style.width = state.size + 'px';
        }
    });
}

// Interactions: drag + pointer
function attachInteractions() {
    // pointer interactions for main lanterns
    const mains = layer.querySelectorAll('.lantern-main');
    mains.forEach(el => {
        el.onpointerdown = (ev) => {
            ev.preventDefault();
            const id = el.dataset.id;
            selectLantern(id);
            el.setPointerCapture(ev.pointerId);
            const startX = ev.clientX;
            const startY = ev.clientY;
            const rect = layer.getBoundingClientRect();
            const state = findStateById(id);
            const origX = state.x;
            const origY = state.y;

            function moveHandler(e) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                // convert to percent
                const percentX = (origX / 100) * rect.width + dx;
                const percentY = (origY / 100) * rect.height + dy;
                state.x = Math.max(0, Math.min(100, (percentX / rect.width) * 100));
                state.y = Math.max(0, Math.min(100, (percentY / rect.height) * 100));
                applyStateToDOM(state);
                updateInspector();
            }

            function upHandler(e) {
                el.releasePointerCapture(ev.pointerId);
                window.removeEventListener('pointermove', moveHandler);
                window.removeEventListener('pointerup', upHandler);
            }

            window.addEventListener('pointermove', moveHandler);
            window.addEventListener('pointerup', upHandler);
        };
        // double click to quick duplicate
        el.ondblclick = () => {
            const s = findStateById(el.dataset.id);
            const copy = Object.assign({}, s, { id: idCounter++, x: Math.min(s.x + 3, 98), y: Math.min(s.y + 3, 98) });
            lanternState.push(copy);
            createLanternElements();
            attachInteractions();
            selectLantern(copy.id);
        };
    });
}

// Scroll parallax
window.addEventListener('scroll', () => {
    const s = window.scrollY;
    document.querySelectorAll('.lantern').forEach(el => {
        const d = parseFloat(el.dataset.depth) || 0.2;
        const id = el.dataset.id;
        const state = findStateById(id);
        // only main needs rotation update, glow stays rotated at 0deg
        if (el.classList.contains('lantern-main')) {
            el.style.transform = `translate(-50%, ${s * d}px) rotate(var(--r))`;
        } else {
            el.style.transform = `translateX(-50%) translateY(${s * d}px)`;
        }
    });
});

// click outside to deselect
document.addEventListener('pointerdown', (e) => {
    if (!layer.contains(e.target)) {
        // ignore clicks on inspector
        if (document.getElementById('lantern-inspector') && document.getElementById('lantern-inspector').contains(e.target)) return;
        deselect();
    }
});

// init
function init() {
    idCounter = 1;
    lanternState = loadConfig();
    // ensure idCounter > max id
    lanternState.forEach(l => { if (l.id && l.id >= idCounter) idCounter = l.id + 1; });
    createLanternElements();
    createInspector();
    attachInteractions();
    updateInspector();
}

init();
