const isMobile = window.innerWidth < 768;
const savedLanterns = isMobile ?
    [{ "id": 2, "x": 13.584877974916518, "y": 0.3300489010625913, "size": 55.601945067974995, "rotation": -5, "depth": 0.16946709664849174, "z": 0, "speed": "", "glow": true }, { "id": 20, "x": 49.69702750762679, "y": 1.5440474381314615, "size": 55.601945067974995, "rotation": -5, "depth": 0.16946709664849174, "z": 1, "speed": "", "glow": true }, { "id": 10, "x": 20.725064890804365, "y": 0.758045975200332, "size": 45, "rotation": 3, "depth": 0.16946709664849174, "z": 2, "speed": "", "glow": true }, { "id": 19, "x": 42.8185228347296, "y": 2.7967017848526825, "size": 45, "rotation": 3, "depth": 0.16946709664849174, "z": 3, "speed": "", "glow": true }, { "id": 11, "x": 75.29515834874829, "y": 5.193361983298423, "size": 75, "rotation": 5, "depth": 0.16946709664849174, "z": 4, "speed": "", "glow": true }, { "id": 12, "x": 79.39796208706605, "y": 6.072343503380255, "size": 50, "rotation": -3, "depth": 0.16946709664849174, "z": 5, "speed": "", "glow": true }, { "id": 16, "x": 62.472728442206225, "y": 5.959159242385087, "size": 50, "rotation": 7, "depth": 0.16946709664849174, "z": 6, "speed": "", "glow": true }, { "id": 13, "x": 31.164317227252965, "y": 8.974312395268436, "size": 50, "rotation": -3, "depth": 0.16946709664849174, "z": 7, "speed": "", "glow": true }, { "id": 15, "x": 71.48207423659875, "y": 10.690836457817865, "size": 50, "rotation": 7, "depth": 0.16946709664849174, "z": 8, "speed": "", "glow": true }, { "id": 17, "x": 71.61291535809407, "y": 15.486940415898458, "size": 40, "rotation": -5, "depth": 0.16946709664849174, "z": 9, "speed": "", "glow": true }, { "id": 18, "x": 22.444691059028646, "y": 13.982146614191437, "size": 40, "rotation": 4, "depth": 0.16946709664849174, "z": 10, "speed": "", "glow": true }, { "id": 14, "x": 34.33254152631839, "y": 10.368704710714942, "size": 32, "rotation": -3, "depth": 0.16946709664849174, "z": 11, "speed": "", "glow": true }]
    : [{ "id": 1, "x": 18.808079833677876, "y": 10.826940164203805, "size": 92.1650064965214, "rotation": 5.760481849713692, "depth": 0.1547371501174831, "z": 0, "speed": "", "glow": true }, { "id": 2, "x": 10.455398981655598, "y": 8.653362924653816, "size": 71.44451559224788, "rotation": 4.9281233408418466, "depth": 0.2197918223839822, "z": 1, "speed": "", "glow": true }, { "id": 3, "x": 16.202054163631214, "y": 5.7208810106339705, "size": 120, "rotation": 7.572209490482095, "depth": 0.2820240343091033, "z": 2, "speed": "", "glow": true }, { "id": 17, "x": 23.280179163631217, "y": 28.613590522105074, "size": 120, "rotation": 3, "depth": 0.2820240343091033, "z": 3, "speed": "", "glow": true }, { "id": 4, "x": 37.62460281556646, "y": 1.5338932338331461, "size": 58, "rotation": -5, "depth": 0.31163138809117924, "z": 4, "speed": "", "glow": true }, { "id": 10, "x": 36.95533198223313, "y": 2.688523484814084, "size": 50, "rotation": 5, "depth": 0.31163138809117924, "z": 5, "speed": "", "glow": true }, { "id": 12, "x": 82.70533198223313, "y": 15.732558587001144, "size": 75, "rotation": -1, "depth": 0.31163138809117924, "z": 6, "speed": "", "glow": true }, { "id": 13, "x": 85.48658198223313, "y": 17.29779700179134, "size": 50, "rotation": 5, "depth": 0.31163138809117924, "z": 7, "speed": "", "glow": true }, { "id": 14, "x": 77.65585281556646, "y": 17.46213697534995, "size": 50, "rotation": 5, "depth": 0.31163138809117924, "z": 8, "speed": "", "glow": true }, { "id": 15, "x": 34.0829361488998, "y": 16.974334571093852, "size": 50, "rotation": 5, "depth": 0.31163138809117924, "z": 9, "speed": "", "glow": true }, { "id": 16, "x": 63.6219986488998, "y": 14.119497238136345, "size": 60, "rotation": -5, "depth": 0.31163138809117924, "z": 10, "speed": "", "glow": true }, { "id": 20, "x": 76.36418614889979, "y": 30.370015680181698, "size": 60, "rotation": 2, "depth": 0.31163138809117924, "z": 11, "speed": "", "glow": true }, { "id": 21, "x": 73.41626948223312, "y": 28.86776957710273, "size": 75, "rotation": -5, "depth": 0.31163138809117924, "z": 12, "speed": "", "glow": true }, { "id": 19, "x": 5.726165315566462, "y": 18.84883385639789, "size": 60, "rotation": -5, "depth": 0.31163138809117924, "z": 13, "speed": "", "glow": true }, { "id": 18, "x": 6.116790315566462, "y": 0.4922335919839682, "size": 60, "rotation": -5, "depth": 0.31163138809117924, "z": 14, "speed": "", "glow": true }, { "id": 6, "x": 72.62376396781447, "y": -1.5, "size": 94.87647814775036, "rotation": -6.558542266139344, "depth": 0.22698258260076323, "z": 15, "speed": "", "glow": true }, { "id": 7, "x": 91.09053834898299, "y": 5.944642563477614, "size": 75, "rotation": -4.5, "depth": 0.33968003567938426, "z": 16, "speed": "", "glow": true }, { "id": 8, "x": 83.22477390486584, "y": 5.479029312847973, "size": 80.68918063119145, "rotation": 8, "depth": 0.1731934092655309, "z": 17, "speed": "", "glow": true }, { "id": 22, "x": 60.94091973819918, "y": 4.549868858847676, "size": 80.68918063119145, "rotation": 5, "depth": 0.1731934092655309, "z": 18, "speed": "", "glow": true }, { "id": 9, "x": 86.78279947159905, "y": 2.4229834547635924, "size": 100, "rotation": -4, "depth": 0.19959586824479567, "z": 19, "speed": "", "glow": true }];

//BUILD
const layer = document.getElementById("lantern-layer");

savedLanterns.forEach(l => {
    /* Glow */
    const glow = document.createElement("img");
    glow.src = "./assets/lantern.png";
    glow.className = "lantern lantern-glow";
    glow.style.width = l.size + "px";
    glow.style.left = l.x + "%";
    glow.style.top = l.y + "%";
    glow.style.position = "absolute";
    glow.style.transform = "translateX(-50%)";
    glow.dataset.depth = l.depth * 0.55;

    /* Main */
    const lantern = document.createElement("img");
    lantern.src = "./assets/lantern.png";
    lantern.className = `lantern lantern-main ${l.speed || ""}`;
    lantern.style.setProperty("--r", l.rotation + "deg");
    lantern.style.width = l.size + "px";
    lantern.style.left = l.x + "%";
    lantern.style.top = l.y + "%";
    lantern.style.position = "absolute";
    lantern.style.transform = "translateX(-50%)";
    lantern.dataset.depth = l.depth;

    layer.appendChild(glow);
    layer.appendChild(lantern);
});

window.addEventListener("scroll", () => {
    const s = window.scrollY;
    document.querySelectorAll(".lantern").forEach(el => {
        const d = el.dataset.depth || 0.2;
        el.style.transform =
            `translate(-50%, ${s * d}px) rotate(var(--r))`;
    });
});