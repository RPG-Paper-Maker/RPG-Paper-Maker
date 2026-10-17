(async () => {
const pluginName = "Hearts Bar";

// ---------- bazowe adresy Scripts/ ----------
const bases = [];
try {
    const m = String(new Error().stack).match(/((?:https?|file):\/\/[^\s()]*?\/Scripts\/)/);
    if (m) bases.push(m[1]);
} catch (e) {}
try { bases.push(new URL("Scripts/", document.baseURI).href); } catch (e) {}

async function tryImport(file) {
    for (const b of bases) {
        try { return await import(b + file); } catch (e) {}
    }
    return null;
}

// ---------- dostęp do silnika (wersja web nie ma globalnego RPM) ----------
async function loadRPM() {
    // znane działające moduły, ładowane równolegle (są już w cache silnika)
    const names = ["Core", "Manager", "Scene", "Common", "Graphic"];
    const mods = await Promise.all(names.map(n => tryImport(n + "/index.js")));
    const R = {};
    names.forEach((n, i) => { if (mods[i]) R[n] = mods[i][n] || mods[i]; });
    return (R.Manager && R.Scene) ? R : null;
}

const R = await loadRPM();
if (!R) {
    console.error("[HeartsBar] Nie udało się wczytać modułów silnika (RPM). Plugin nieaktywny.");
    return;
}
const inject = R.Manager.Plugins.inject;
const HEART = "\u2764\uFE0E"; // ❤︎ (wariant tekstowy, nie emoji)

// ---------- konfiguracja (ustawiana komendą "Show Hearts") ----------
const cfg = {
    active: false,
    manualVisible: true,
    hideSwitch: 0,
    fullColor: "#ff0000", emptyColor: "#000000", outlineColor: "#ffffff",
    outlineWidth: 2, size: 20, spacing: 3,
    heartCount: 10,
    x: 0, y: 0,
    commonEventID: 0,
    reactionObj: null,   // gotowy obiekt reakcji (gdy wybrano typ Common reaction)
    deathTriggered: false
};

// ---------- helpery ----------
function val(v, def) {
    if (v === undefined || v === null) return def;
    if (typeof v === "object" && typeof v.getValue === "function") v = v.getValue();
    return (v === undefined || v === null || v === "") ? def : v;
}
const num = (v, def) => { const n = Number(val(v, def)); return isNaN(n) ? def : n; };
const str = (v, def) => String(val(v, def));

// Wartość parametru typu "Common reaction" może być liczbą lub obiektem - wyciągamy ID
function extractId(v) {
    let shown = "?";
    try { shown = JSON.stringify(v); } catch (e) { shown = String(v); }
    console.log("[HeartsBar] commonReactionID raw:", v, "| typ:", typeof v, "| JSON:", shown);
    let x = v;
    for (let i = 0; i < 5 && x !== null && typeof x === "object"; i++) {
        if (typeof x.getValue === "function") { x = x.getValue(); continue; }
        if ("id" in x) { x = x.id; continue; }
        if ("v" in x) { x = x.v; continue; }
        if ("value" in x) { x = x.value; continue; }
        break;
    }
    const n = Number(x);
    const id = isNaN(n) ? 0 : n;
    if (id === 0 && v !== 0 && v !== undefined && v !== null) {
        console.warn("[HeartsBar] Nie udało się odczytać ID common reaction z wartości powyżej.");
    }
    return id;
}

function screenScale() {
    const P = R.Common && R.Common.Platform;
    return (P && typeof P.screenX === "function") ? P.screenX(1) : 1;
}

// ---------- przełącznik "ukryj" (Switch ON = serca ukryte) ----------
// Parametr typu Switch przekazuje indeks zero-bazowy (wybrane ID 2 -> raw 1),
// więc właściwe ID przełącznika to raw + 1.
function readFrom(container, id) {
    if (!container) return undefined;
    const tries = [
        () => typeof container.get === "function" ? container.get(id) : undefined,
        () => container[id]
    ];
    for (const t of tries) {
        try {
            const v = t();
            if (v !== undefined && v !== null) return v;
        } catch (e) {}
    }
    return undefined;
}

function readSwitchAt(id) {
    const g = R.Core.Game.current;
    if (!g) return undefined;
    try {
        if (typeof g.getSwitch === "function") {
            const v = g.getSwitch(id);
            if (v !== undefined && v !== null) return v;
        }
    } catch (e) {}
    let v = readFrom(g.switches, id);
    if (v === undefined) v = readFrom(g.variables, id); // zapas: przełączniki trzymane jak zmienne
    return v;
}

function snapshotOf(c) {
    try {
        return JSON.stringify(Array.isArray(c) ? c.slice(0, 8)
            : (c && typeof c.forEach === "function" ? Array.from(c).slice(0, 8)
            : Object.entries(c || {}).slice(0, 8)));
    } catch (e) { return "błąd: " + e; }
}

let lastHiddenLog;
function isHidden() {
    if (!cfg.manualVisible) return true;
    const raw = cfg.hideSwitch;
    if (raw === undefined || raw === null) return false;
    let on = false, id = null;
    if (typeof raw === "boolean") {
        on = raw;
    } else if (typeof raw === "object" && typeof raw.getValue === "function") {
        on = !!raw.getValue();
    } else if (typeof raw === "number") {
        id = raw + 1;
        let v = readSwitchAt(id);
        if (v === undefined) v = readSwitchAt(raw);
        on = (v === true) || (typeof v === "number" && v !== 0) || (v === "true");
    }
    if (on !== lastHiddenLog) {
        lastHiddenLog = on;
        const g = R.Core.Game.current;
        console.log("[HeartsBar] raw:", raw, "| użyte ID:", id, "| switch ON:", on,
            "| switches:", snapshotOf(g && g.switches), "| variables:", snapshotOf(g && g.variables));
    }
    return on;
}

// ---------- HP bohatera ----------
function getHeroHP() {
    const g = R.Core.Game.current;
    const hero = g && g.teamHeroes && g.teamHeroes[0];
    if (!hero) return null;
    const BS = R.Datas && R.Datas.BattleSystem;
    let hpAbbr = null, maxAbbr = null;
    try {
        hpAbbr = str(R.Manager.Plugins.getParameter(pluginName, "hpAbbreviation"), "") || null;
        maxAbbr = str(R.Manager.Plugins.getParameter(pluginName, "maxHpAbbreviation"), "") || null;
    } catch (e) {}
    try {
        if (BS) {
            if (!hpAbbr) hpAbbr = BS.getStatistic(BS.idHP).abbreviation;
            if (!maxAbbr && BS.idMaxHP !== undefined) maxAbbr = BS.getStatistic(BS.idMaxHP).abbreviation;
        }
    } catch (e) {}
    if (!hpAbbr || typeof hero[hpAbbr] !== "number") {
        hpAbbr = ["hp", "HP", "Hp"].find(k => typeof hero[k] === "number") || hpAbbr;
    }
    if (!maxAbbr || typeof hero[maxAbbr] !== "number") {
        const cands = [hpAbbr && ("max" + hpAbbr), "maxhp", "maxHp", "maxHP", "MaxHP", "hpmax", "mhp"].filter(Boolean);
        maxAbbr = cands.find(k => typeof hero[k] === "number") || maxAbbr;
    }
    const hp = hero[hpAbbr];
    const max = hero[maxAbbr];
    if (typeof hp !== "number" || typeof max !== "number") {
        if (!getHeroHP.warned) {
            console.warn("[HeartsBar] Nie znaleziono HP/MaxHP bohatera. hp:", hpAbbr, "max:", maxAbbr,
                "Pola liczbowe bohatera:", Object.keys(hero).filter(k => typeof hero[k] === "number"));
            getHeroHP.warned = true;
        }
        return null;
    }
    return { hp: hp, max: max };
}

// ---------- common reaction ----------
// Silnik trzyma dane w module Scripts/index.js ({ Data, Model, ... }), nie w R.Datas.
let engineIndex = null;
async function loadEngineIndex() {
    if (!engineIndex) engineIndex = await tryImport("index.js");
    return engineIndex;
}

// Obiekt, na którym uruchamiamy reakcję (bohater na mapie)
function pickHeroObject() {
    const map = R.Scene.Map.current;
    const g = R.Core.Game.current;
    const cands = [
        map && map.user, map && map.user && map.user.object,
        g && g.hero, g && g.hero && g.hero.object
    ].filter(Boolean);
    return cands.find(c => "movingState" in c) || cands[0] || null;
}

// true = obsłużone (także błędem), false = silnik jeszcze niegotowy, spróbuj w następnej klatce
function callCommonEvent(id) {
    try {
        const map = R.Scene.Map.current;
        if (!map) return false;
        let reaction = cfg.reactionObj;
        if (!reaction) {
            const D = engineIndex && engineIndex.Data;
            if (!D || !D.CommonEvents) return false;
            reaction = D.CommonEvents.getCommonReaction(id);
        }
        const obj = pickHeroObject();
        const U = R.Common && R.Common.Utils;
        const params = (U && typeof U.arrayToMap === "function") ? U.arrayToMap([], true) : new Map();
        const it = map.addReaction(obj, reaction, obj, 1, params);
        if (!it) {
            console.warn("[HeartsBar] Common reaction " + id + " nie wystartowała (brak komend w reakcji albo już działa).");
        }
    } catch (e) {
        console.warn("[HeartsBar] Nie udało się wywołać common reaction " + id, e);
    }
    return true;
}

// ---------- rysowanie ----------
function drawHearts() {
    const ctx = R.Common.Platform.ctx;
    const info = getHeroHP();
    if (!info) return;

    // HP <= 0 -> common event (raz)
    if (info.hp <= 0) {
        if (!cfg.deathTriggered && cfg.commonEventID > 0) {
            if (callCommonEvent(cfg.commonEventID)) cfg.deathTriggered = true;
        }
    } else {
        cfg.deathTriggered = false;
    }

    if (isHidden()) return;

    // HP na serce = MaxHP / liczba serc
    const count = Math.min(100, Math.max(1, Math.floor(cfg.heartCount)));
    const perHeart = Math.max(0.0001, info.max / count);

    const k = screenScale();
    const size = cfg.size * k;
    const ow = cfg.outlineWidth * k;
    const gap = cfg.spacing * k;
    const maxWidth = ctx.canvas.width;

    ctx.save();
    ctx.font = size + 'px "Segoe UI Symbol","DejaVu Sans","Arial Unicode MS",Arial,sans-serif';
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.lineJoin = "round";
    const glyphW = ctx.measureText(HEART).width;
    const stepX = glyphW + ow * 2 + gap;   // odstęp poziomy
    const stepY = size + ow * 2 + gap;     // odstęp między wierszami

    let px = cfg.x * k + ow, py = cfg.y * k + ow;
    const startX = px;

    for (let i = 0; i < count; i++) {
        if (px + glyphW > maxWidth && px > startX) { // zawijanie
            px = startX;
            py += stepY;
        }
        if (ow > 0) {
            ctx.lineWidth = ow * 2;
            ctx.strokeStyle = cfg.outlineColor;
            ctx.strokeText(HEART, px, py);
        }
        ctx.fillStyle = cfg.emptyColor;
        ctx.fillText(HEART, px, py);

        const fill = Math.max(0, Math.min(1, info.hp / perHeart - i));
        if (fill > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(px, py - ow, glyphW * fill, size * 1.5 + ow * 2);
            ctx.clip();
            ctx.fillStyle = cfg.fullColor;
            ctx.fillText(HEART, px, py);
            ctx.restore();
        }
        px += stepX;
    }
    ctx.restore();
}

inject(R.Scene.Map, "drawHUD", function() {
    if (!cfg.active) return;
    try {
        drawHearts();
    } catch (e) {
        if (!drawHearts.failed) {
            console.error("[HeartsBar] Błąd rysowania:", e);
            drawHearts.failed = true;
        }
    }
}, false, false, true);

// ---------- komendy (rejestrowane od razu, pod kilkoma wariantami nazwy) ----------
function enableHearts(hideSwitch, fullColor, emptyColor, outlineColor, outlineWidth,
                      heartSize, heartCount, posX, posY, commonReactionID, heartsSpacing) {
    cfg.hideSwitch = hideSwitch;
    cfg.fullColor = str(fullColor, "#ff0000");
    cfg.emptyColor = str(emptyColor, "#000000");
    cfg.outlineColor = str(outlineColor, "#ffffff");
    cfg.outlineWidth = Math.max(0, num(outlineWidth, 2));
    cfg.size = Math.max(1, num(heartSize, 20));
    cfg.heartCount = Math.max(1, Math.min(100, num(heartCount, 10)));
    cfg.x = num(posX, 0);
    cfg.y = num(posY, 0);
    if (commonReactionID && typeof commonReactionID === "object" && typeof commonReactionID.getFirstCommand === "function") {
        cfg.reactionObj = commonReactionID;   // typ "Common reaction": silnik daje gotowy obiekt
        cfg.commonEventID = 1;                // znacznik "włączone"
    } else {
        cfg.reactionObj = null;
        cfg.commonEventID = extractId(commonReactionID);  // typ Number
    }
    cfg.spacing = Math.max(0, num(heartsSpacing, 3));
    cfg.deathTriggered = false;
    cfg.manualVisible = true;
    lastHiddenLog = undefined;
    cfg.active = true;
}

function disableHearts() {
    cfg.active = false;
}

const registered = [];
const pluginNames = [pluginName, "ZeldaHearts"]; // nowa i dawna nazwa pluginu w edytorze
const enableNames = ["Enable Hearts", "Enable hearts", "EnableHearts", "Show Hearts", "Show hearts", "ShowHearts"];
const disableNames = ["Disable Hearts", "Disable hearts", "DisableHearts"];
for (const pn of pluginNames) {
    for (const n of enableNames) {
        try { R.Manager.Plugins.registerCommand(pn, n, enableHearts); registered.push(pn + "/" + n); } catch (e) {}
    }
    for (const n of disableNames) {
        try { R.Manager.Plugins.registerCommand(pn, n, disableHearts); registered.push(pn + "/" + n); } catch (e) {}
    }
}
// ---------- awaryjnie: przypisz funkcje do KAŻDEJ komendy bez funkcji, wg nazwy ----------
try {
    const all = R.Manager.Plugins.plugins || {};
    const report = [];
    for (const pn of Object.keys(all)) {
        const cmds = all[pn] && all[pn].commands;
        if (!cmds) continue;
        for (const cn of Object.keys(cmds)) {
            const missing = (typeof cmds[cn] !== "function");
            report.push(pn + "/" + cn + (missing ? " (brak funkcji)" : ""));
            if (!missing) continue;
            if (/disable|hide|wy[łl]/i.test(cn)) { cmds[cn] = disableHearts; registered.push("auto:" + pn + "/" + cn); }
            else if (/enable|show|hearts|w[łl]/i.test(cn)) { cmds[cn] = enableHearts; registered.push("auto:" + pn + "/" + cn); }
        }
    }
    console.log("[HeartsBar] pluginy/komendy w silniku:", report.join(" | "));
} catch (e) {
    console.warn("[HeartsBar] nie udało się przeszukać komend silnika:", e);
}

console.log("[HeartsBar] załadowany, zarejestrowano:", registered.join(", "));

// ---------- w tle: moduł silnika z danymi (potrzebny tylko do common reaction) ----------
loadEngineIndex().then(m => {
    if (!(m && m.Data && m.Data.CommonEvents)) {
        console.warn("[HeartsBar] Nie znaleziono Data.CommonEvents w Scripts/index.js. Klucze:", m ? Object.keys(m) : null);
    }
});
})();