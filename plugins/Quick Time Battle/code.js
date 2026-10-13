// Quick Time Battle v1.0.0 - RPG Paper Maker 3.0 plugin.
// Hero attacks and skills run a WASD + Enter quick-time challenge; the grade scales damage.
// Press any key just before an enemy hit lands to dodge it. See FULL_INSTRUCTIONS.md.
// Plugins run through `new Function(...)`: no imports. Globals: Common, Core, Data, Manager, Model, Scene.

const pluginName = "Quick Time Battle";

// ---------------------------------------------------------------- config
// Every setting is a plugin parameter. ID -> challenge tables are JSON text; "Advanced Overrides" is merged on top.
const DEFAULT_TABLES = {
	elementThemes: { "1": "fire", "2": "earth", "3": "lightning", "4": "water", "5": "ice", "6": "wind", "7": "shadow", "8": "light" },
	nameThemes: [
		{ match: "heal|bandage|revive|remedy|barrier", theme: "heal" },
		{ match: "power|war cry|resolve|concentration", theme: "light" }
	],
	default: { type: "timing" },
	skills: {},
	heroes: {},
	classes: {}
};

const DEFAULT_CONFIG = Object.assign({
	multipliers: [0.5, 1.0, 1.25, 1.5, 2.0], // Miss, Good, Great, Excellent, Perfect
	failMiss: false, // true: a Miss really fails; false: a Miss just pays the Miss multiplier
	perfectCrit: true, // a Perfect also forces a critical hit
	labels: ["OOPS...", "GOOD", "GREAT", "EXCELLENT!", "PERFECT!!"],
	sound: true,
	volume: 0.5,
	tiering: true, // "Fire 1/2/3" style names get harder challenges
	uiScale: 1, // size of the challenge UI
	uiStyle: "pixel", // "pixel" (chunky, matches the engine) or "polished" (smooth)
	pixelSize: 0, // screen pixels per UI pixel; 0 = automatic
	fxScale: 1.6, // size of particles and bursts
	debug: false,
	battleLog: true, // keeps a rolling log of recent challenge/defense events
	logEntries: 150,
	impactTiming: true, // damage lands on the attacker's slash frame
	overhead: true, // prompts float above the active hero
	hintUses: 4, // text hints fade out after this many uses of each challenge type
	beatPulse: true,
	freezeScale: 1, // impact freeze length multiplier (0 = off)
	lingerMs: 1000, // how long damage/heal numbers stay up
	defense: { enabled: true, windowFrames: 30, cooldown: 0.6, slide: 1, duration: 0.45, keys: ["W", "A", "S", "D", "ENTER"] }
}, DEFAULT_TABLES);

function param(name, fallback) {
	try {
		const v = Manager.Plugins.getParameter(pluginName, name);
		return v === undefined || v === null ? fallback : v;
	} catch (e) {
		return fallback; // parameter missing (older saved plugin settings)
	}
}
function boolParam(name, fb) { const v = param(name, fb); return typeof v === "boolean" ? v : String(v).toLowerCase() === "true"; }
function numParam(name, fb) { const v = Number(param(name, fb)); return isFinite(v) ? v : fb; }
function jsonParam(name, fb) {
	const raw = param(name, null);
	if (typeof raw !== "string" || raw.trim() === "") return fb;
	try { return JSON.parse(raw); } catch (e) {
		console.error('[QTB] Parameter "' + name + '" is not valid JSON, using the default.', e);
		return fb;
	}
}

function loadConfig() {
	const D = DEFAULT_CONFIG;
	let mult = String(param("Multipliers", D.multipliers.join(", "))).split(/[\s,]+/).map(Number).filter(isFinite);
	if (mult.length < 2) mult = D.multipliers.slice();
	while (mult.length < 5) mult.push(mult[mult.length - 1] * 1.33);
	const cfg = {
		multipliers: mult,
		failMiss: boolParam("Fail On Miss", D.failMiss),
		perfectCrit: boolParam("Perfect Crit", D.perfectCrit),
		labels: D.labels,
		sound: boolParam("Sound", D.sound),
		volume: numParam("Volume", D.volume),
		tiering: boolParam("Tiering", D.tiering),
		uiScale: numParam("UI Scale", D.uiScale),
		uiStyle: String(param("UI Style", D.uiStyle)).toLowerCase(),
		pixelSize: numParam("Pixel Size", D.pixelSize),
		fxScale: numParam("Effects Scale", D.fxScale),
		debug: boolParam("Debug", D.debug),
		battleLog: boolParam("Battle Log", D.battleLog),
		logEntries: numParam("Battle Log Entries", D.logEntries),
		impactTiming: boolParam("Damage At Slash Frame", D.impactTiming),
		overhead: boolParam("Prompts Over Head", D.overhead),
		hintUses: numParam("Hint Uses", D.hintUses),
		beatPulse: boolParam("Beat Pulse", D.beatPulse),
		freezeScale: numParam("Impact Freeze Scale", D.freezeScale),
		lingerMs: numParam("Popup Linger", D.lingerMs),
		defense: {
			enabled: boolParam("Defense Enabled", D.defense.enabled),
			windowFrames: numParam("Defense Window Frames", D.defense.windowFrames),
			cooldown: numParam("Defense Cooldown", D.defense.cooldown),
			slide: numParam("Defense Slide Distance", D.defense.slide),
			duration: numParam("Defense Slide Duration", D.defense.duration),
			keys: D.defense.keys
		},
		elementThemes: jsonParam("Element Themes", D.elementThemes),
		nameThemes: jsonParam("Name Themes", D.nameThemes),
		default: jsonParam("Default Challenge", D.default),
		classes: jsonParam("Class Challenges", D.classes),
		heroes: jsonParam("Hero Challenges", D.heroes),
		skills: jsonParam("Skill Challenges", D.skills)
	};
	const over = jsonParam("Advanced Overrides", {});
	for (const k of Object.keys(over)) {
		if (k === "defense") Object.assign(cfg.defense, over.defense);
		else cfg[k] = over[k];
	}
	cfg.uiScale = Math.max(0.2, cfg.uiScale);
	return cfg;
}

let CONFIG = DEFAULT_CONFIG;
let enabled = true;

// Rolling log: the last N events are kept in memory and written to Saves/qtb-log.json (a few KB at most),
// so it never grows over time. With Debug on, events are also printed to the console (Ctrl+Shift+I).
let logBuf = [];
let logDirty = false;
let logLastFlush = 0;
function blog(msg, data) {
	if (CONFIG.debug) console.log("[QTB]", msg, data === undefined ? "" : data);
	if (!CONFIG.battleLog) return;
	let d = data;
	try { d = data === undefined ? undefined : JSON.parse(JSON.stringify(data)); } catch (e) { d = String(data); }
	logBuf.push({ t: new Date().toISOString().slice(11, 23), msg, data: d });
	const max = Math.max(20, CONFIG.logEntries | 0);
	if (logBuf.length > max) logBuf.splice(0, logBuf.length - max);
	logDirty = true;
}
function dbg() { blog([].slice.call(arguments).map(String).join(" ")); }
function flushLog(force) {
	if (!CONFIG.battleLog || !logDirty) return;
	const now = performance.now();
	if (!force && now - logLastFlush < 4000) return;
	logLastFlush = now; logDirty = false;
	try { Common.Platform.writeFile(Common.Paths.SAVES + "/qtb-log.json", { plugin: "Quick Time Battle", entries: logBuf }); } catch (e) { /* logging must never break the game */ }
}

// Priority: hero+skill > class+skill > skill > hero default > class default > global default.
// `false` disables quick-time for that entry. Skills with no damage effect (buffs, status-only)
// only get a challenge when explicitly listed (hero/class/global skills entry).
function resolveChallenge(heroId, classId, skillId, hasDamage) {
	const hero = CONFIG.heroes[heroId], cls = CONFIG.classes[classId];
	if (hero && hero.skills && hero.skills[skillId] !== undefined) return hero.skills[skillId];
	if (cls && cls.skills && cls.skills[skillId] !== undefined) return cls.skills[skillId];
	if (CONFIG.skills[skillId] !== undefined) return CONFIG.skills[skillId];
	if (!hasDamage) return false;
	if (hero && hero.default !== undefined) return hero.default;
	if (cls && cls.default !== undefined) return cls.default;
	return CONFIG.default;
}

// "Fire 1" / "Ice II" / "Wind 3" -> 1..5 (1 when there is no numeral).
function tierOf(name) {
	const m = /(\d+|IV|V?I{1,3})\s*$/i.exec(name || "");
	if (!m) return 1;
	const roman = { I: 1, II: 2, III: 3, IV: 4, V: 5 }[m[1].toUpperCase()];
	return Math.max(1, Math.min(5, roman || parseInt(m[1], 10) || 1));
}

// Harder challenge for higher tiers: tighter windows, longer sequences, bigger mash goals.
function applyTier(def, tier) {
	if (!def || def === true || tier <= 1 || !CONFIG.tiering) return def;
	const k = tier - 1, d = Object.assign({}, def);
	if (d.duration) d.duration *= Math.pow(0.88, k);
	if (d.type === "timing" || d.type === "hold") d.zone = (d.zone || 0.16) * Math.pow(0.82, k);
	if (d.type === "ring" || d.type === "crosshair" || d.type === "combo") d.tolerance = (d.tolerance || 0.1) * Math.pow(0.85, k);
	if (d.type === "sequence") d.length = (d.length || 4) + k;
	if (d.type === "mash") d.count = Math.round((d.count || 12) * (1 + 0.4 * k));
	return d;
}

// ---------------------------------------------------------------- themes
const THEMES = {
	plain:     { accent: "#fd4",    zone: "#4a9",    bar: "#555",    colors: ["#ffffff", "#dfe8ff"],            wave: "square",   style: "sparkle" },
	fire:      { accent: "#ff9a2e", zone: "#c8321e", bar: "#3a1a12", colors: ["#ff5a1e", "#ffb02e", "#ffe27a"], wave: "triangle", style: "rise"    },
	lightning: { accent: "#ffe95c", zone: "#3d5bff", bar: "#1a1f3a", colors: ["#ffffff", "#bfe8ff", "#ffe95c"], wave: "sawtooth", style: "spark"   },
	ice:       { accent: "#a8ecff", zone: "#3b8fd9", bar: "#16283a", colors: ["#ffffff", "#bfeaff", "#7fc8ff"], wave: "sine",     style: "fall"    },
	water:     { accent: "#4fc3ff", zone: "#1f6fd1", bar: "#10243a", colors: ["#9fe0ff", "#4fc3ff", "#ffffff"], wave: "sine",     style: "fall"    },
	earth:     { accent: "#d9a85a", zone: "#7a5a2e", bar: "#2e2216", colors: ["#a67c3d", "#6b4f2a", "#d9a85a"], wave: "triangle", style: "fall"    },
	wind:      { accent: "#9dffc2", zone: "#2fa36b", bar: "#13302a", colors: ["#ffffff", "#c7ffe0", "#9dffc2"], wave: "sine",     style: "streak"  },
	light:     { accent: "#fff3a8", zone: "#e0b84a", bar: "#3a3320", colors: ["#ffffff", "#fff3a8", "#ffe27a"], wave: "sine",     style: "rise"    },
	heal:      { accent: "#7dff9a", zone: "#2fa36b", bar: "#12301f", colors: ["#ffffff", "#b8ffcb", "#7dff9a"], wave: "sine",     style: "rise"    },
	shadow:    { accent: "#c06bff", zone: "#5a2a8a", bar: "#1d1230", colors: ["#7a3fb8", "#c06bff", "#2a1040"], wave: "sawtooth", style: "wisp"    }
};
function themeOf(name) { return THEMES[name] || THEMES.plain; }

// ---------------------------------------------------------------- sound (synthesised, no asset files)
let actx = null;
function audio() {
	if (!CONFIG.sound) return null;
	try {
		if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
		if (actx.state === "suspended") actx.resume();
		return actx;
	} catch (e) { return null; }
}
// Audio must never break the game: bad values are ignored and all calls are guarded.
function tone(freq, dur, type, vol, slideTo, delay) {
	try {
		if (!isFinite(freq) || freq <= 0 || !isFinite(dur) || dur <= 0) return;
		beatAt = performance.now();
		const a = audio();
		if (!a) return;
		const t = a.currentTime + (isFinite(delay) ? delay : 0), o = a.createOscillator(), g = a.createGain();
		o.type = type || "sine";
		o.frequency.setValueAtTime(freq, t);
		if (isFinite(slideTo) && slideTo > 0) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
		g.gain.setValueAtTime(Math.max(0.0001, CONFIG.volume * (isFinite(vol) ? vol : 1) * 0.3), t);
		g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
		o.connect(g); g.connect(a.destination);
		o.start(t); o.stop(t + dur + 0.02);
	} catch (e) { dbg("tone failed", e); }
}
function noise(dur, vol, freq, delay, filterType) {
	try {
		if (!isFinite(dur) || dur <= 0 || !isFinite(freq) || freq <= 0) return;
		const a = audio();
		if (!a) return;
		const t = a.currentTime + (isFinite(delay) ? delay : 0), n = Math.floor(a.sampleRate * dur);
		const buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
		for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
		const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
		src.buffer = buf; f.type = filterType || "bandpass"; f.frequency.value = freq;
		g.gain.setValueAtTime(Math.max(0.0001, CONFIG.volume * (isFinite(vol) ? vol : 1) * 0.4), t);
		g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
		src.connect(f); f.connect(g); g.connect(a.destination);
		src.start(t);
	} catch (e) { dbg("noise failed", e); }
}
const NOTES = [523, 659, 784, 1047, 1319];
function sfxResult(grade, theme) {
	if (grade === 0) { tone(150, 0.35, "sawtooth", 1, 55); return; }
	const notes = Math.min(NOTES.length, Math.min(4, grade) + (grade >= 3 ? 1 : 0));
	for (let i = 0; i < notes; i++) tone(NOTES[i], 0.18, themeOf(theme).wave, 1, null, i * 0.07);
	if (theme === "fire") noise(0.25 + grade * 0.15, 0.8 + grade * 0.3, 700 + grade * 300);
	else if (theme === "lightning") for (let i = 0; i < Math.min(5, grade + (grade === 4 ? 1 : 0)); i++) noise(0.12, 1.2, 3500, i * 0.09, "highpass");
	else if (theme === "ice") for (let i = 0; i < grade; i++) tone(1800 + i * 400, 0.25, "sine", 0.6, null, i * 0.05);
	else if (theme === "heal") for (let i = 0; i < grade + 1; i++) tone(659 + i * 220, 0.35, "sine", 0.6, null, 0.05 + i * 0.07);
	else if (theme === "water") for (let i = 0; i < grade + 1; i++) tone(500, 0.12, "sine", 0.8, 1200, i * 0.07);
	else if (theme === "earth") { tone(90, 0.3 + grade * 0.1, "triangle", 1.2, 45); noise(0.2, 0.8, 300, 0, "lowpass"); }
	else if (theme === "wind") noise(0.3 + grade * 0.15, 0.8, 1500 + grade * 500);
	else if (theme === "light") for (let i = 0; i < grade + 1; i++) tone(1568 + i * 330, 0.3, "sine", 0.6, null, 0.1 + i * 0.06);
	else if (theme === "shadow") { tone(220, 0.5, "sawtooth", 0.7, 55); noise(0.3, 0.6, 400, 0, "lowpass"); }
}
// ---------------------------------------------------------------- visual effects
// Sizes are authored for a 720 px tall canvas and scaled by fxE (screen size x Effects Scale).
let particles = [];
let bolts = [];
let slashes = [];
let rings = [];
let flash = 0;
let flashColor = "255,255,255";
let auras = []; // [{ theme, x, y, power }] glow behind every target while a challenge runs
let fxE = 1; // effects scale
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

function updateScales() {
	const cv = Common.Platform.canvasHUD;
	fxE = (cv.height / 720) * CONFIG.fxScale;
}
function clearFx() { particles = []; bolts = []; slashes = []; rings = []; flash = 0; auras = []; }

function confetti(n, x, y) {
	const cols = ["#ff5a5a", "#ffb02e", "#ffe27a", "#8fe388", "#4fc3ff", "#c58bff", "#ffffff"], E = fxE;
	for (let i = 0; i < n; i++) {
		const a = -Math.PI / 2 + rnd(-1.1, 1.1), sp = rnd(180, 460) * E;
		particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rnd(0.9, 1.6), max: 1.2, size: rnd(7, 13) * E, c: pick(cols), conf: true, rot: rnd(0, 6), vr: rnd(-9, 9) });
	}
}
function emit(theme, x, y, power) { // one ambient particle; power 0..1
	if (theme === "plain") return; // basic attacks: no ambient effects
	const T = themeOf(theme), c = pick(T.colors), E = fxE;
	switch (T.style) {
		case "rise": // flames / light motes
			particles.push({ x: x + rnd(-34, 34) * E, y: y + rnd(0, 24) * E, vx: rnd(-14, 14) * E, vy: rnd(-130, -60) * E * (0.7 + power), life: rnd(0.5, 1.1), max: 1.1, size: rnd(7, 15) * E * (0.7 + power * 0.6), c, add: true, round: true }); break;
		case "spark":
			particles.push({ x: x + rnd(-70, 70) * E, y: y + rnd(-50, 20) * E, vx: rnd(-160, 160) * E, vy: rnd(-160, 60) * E, life: rnd(0.1, 0.25), max: 0.25, size: rnd(2, 5) * E, c, add: true }); break;
		case "fall":
			particles.push({ x: x + rnd(-100, 100) * E, y: y - 90 * E, vx: rnd(-12, 12) * E, vy: rnd(50, 100) * E * (1 + power), life: rnd(0.8, 1.4), max: 1.4, size: rnd(3, 7) * E, c, add: theme === "ice", round: true }); break;
		case "streak":
			particles.push({ x: x - 150 * E, y: y + rnd(-60, 60) * E, vx: rnd(300, 460) * E, vy: rnd(-12, 12) * E, life: rnd(0.4, 0.7), max: 0.7, size: rnd(4, 10) * E, c, add: true }); break;
		case "wisp":
			particles.push({ x: x + rnd(-44, 44) * E, y: y + rnd(0, 30) * E, vx: rnd(-20, 20) * E, vy: rnd(-70, -25) * E, life: rnd(0.8, 1.4), max: 1.4, size: rnd(10, 22) * E * (0.7 + power * 0.6), c, round: true }); break;
		default:
			particles.push({ x: x + rnd(-50, 50) * E, y: y + rnd(-10, 10) * E, vx: rnd(-24, 24) * E, vy: rnd(-60, 0) * E, life: rnd(0.3, 0.7), max: 0.7, size: rnd(3, 6) * E, c, add: true, round: true });
	}
}
function makeBolt(x0, y0, x1, y1) {
	const pts = [[x0, y0]], n = 9, E = fxE;
	for (let i = 1; i < n; i++) {
		const k = i / n;
		pts.push([x0 + (x1 - x0) * k + rnd(-34, 34) * E * (1 - k * 0.5), y0 + (y1 - y0) * k]);
	}
	pts.push([x1, y1]);
	bolts.push({ pts, life: 0.35, max: 0.35 });
}
const FLASH_COLOR = { fire: "255,150,50", lightning: "255,255,255", light: "255,245,190", ice: "190,235,255", shadow: "90,30,140", heal: "150,255,180" };
// big = the hit actually lands (larger than the grade popup that follows the challenge).
function burst(theme, grade, x, y, big) {
	const T = themeOf(theme), E = fxE * (big ? 1.5 : 1);
	const count = Math.round((grade === 0 ? 8 : 20 + grade * 18) * (big ? 1.8 : 1) * (theme === "plain" ? 0.35 : 1));
	const hits = grade === 4 ? 5 : grade;
	if (theme === "lightning" && grade > 0) {
		for (let i = 0; i < hits; i++) makeBolt(x + rnd(-130, 130) * E * (i ? 1 : 0.2), -10, x + rnd(-14, 14) * E, y);
	}
	if (grade >= 2 && FLASH_COLOR[theme]) { flash = Math.max(flash, grade >= 3 ? 0.4 : 0.2); flashColor = FLASH_COLOR[theme]; }
	if (theme === "plain" && grade > 0) { // physical hit: crossing slashes
		for (let i = 0; i < Math.min(4, hits); i++) {
			const a = rnd(-0.6, 0.6) + (i % 2 ? 2.2 : 0.6);
			slashes.push({ x: x + rnd(-14, 14) * E, y: y + rnd(-14, 14) * E, dx: Math.cos(a) * 110 * E, dy: Math.sin(a) * 110 * E, delay: i * 0.07, life: 0.28, max: 0.28 });
		}
	}
	if (grade >= 3 || theme === "heal" || (big && grade >= 1)) {
		rings.push({ x, y, r: 8 * E, life: 0.5, max: 0.5, c: theme === "plain" ? "#fff" : T.accent, grow: (170 + grade * 40) * E });
	}
	if (grade === 4) rings.push({ x, y, r: 8 * E, life: 0.7, max: 0.7, c: "#fff", grow: 280 * E });
	for (let i = 0; i < count; i++) {
		const a = rnd(0, Math.PI * 2), sp = rnd(50, 110 + grade * 70) * E;
		const up = (T.style === "rise" || T.style === "wisp") ? -90 * E : 0;
		const flame = T.style === "rise" || T.style === "wisp";
		particles.push({
			x: x + rnd(-14, 14) * E, y: y + rnd(0, 18) * E,
			vx: Math.cos(a) * sp * (flame ? 0.6 : 1), vy: Math.sin(a) * sp * (flame ? 0.5 : 1) + up,
			life: rnd(0.4, 1.0), max: 1.0,
			size: rnd(5, 11 + grade * 3) * E, c: pick(T.colors), add: T.style !== "wisp", round: true
		});
	}
}
function fxUpdate(dt) {
	for (const p of particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; if (p.conf) { p.vy += 520 * dt * fxE; p.vx *= 1 - 1.2 * dt; p.rot += p.vr * dt; } }
	particles = particles.filter(p => p.life > 0);
	for (const b of bolts) b.life -= dt;
	bolts = bolts.filter(b => b.life > 0);
	for (const sl of slashes) { if (sl.delay > 0) sl.delay -= dt; else sl.life -= dt; }
	slashes = slashes.filter(sl => sl.life > 0);
	for (const r of rings) { r.life -= dt; r.r += r.grow * dt; }
	rings = rings.filter(r => r.life > 0);
	flash = Math.max(0, flash - dt * 1.5);
}
function fxDraw(ctx, w, h) {
	ctx.save();
	for (const aura of auras) { // soft glow behind each target
		const T = themeOf(aura.theme), pulse = 0.85 + 0.15 * Math.sin(performance.now() / 120);
		const r = (70 + 70 * aura.power) * fxE * pulse;
		const g = ctx.createRadialGradient(aura.x, aura.y, 0, aura.x, aura.y, r);
		g.addColorStop(0, T.accent); g.addColorStop(1, "rgba(0,0,0,0)");
		ctx.globalCompositeOperation = "lighter";
		ctx.globalAlpha = 0.25 + 0.3 * aura.power;
		ctx.fillStyle = g;
		ctx.beginPath(); ctx.arc(aura.x, aura.y, r, 0, Math.PI * 2); ctx.fill();
		ctx.globalCompositeOperation = "source-over";
	}
	if (flash > 0) { ctx.globalAlpha = 1; ctx.fillStyle = "rgba(" + flashColor + "," + flash + ")"; ctx.fillRect(0, 0, w, h); }
	for (const p of particles) {
		ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.max));
		ctx.globalCompositeOperation = p.add ? "lighter" : "source-over";
		ctx.fillStyle = p.c;
		if (p.conf) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.cos(p.rot * 2.3)); ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); ctx.restore(); continue; }
		if (p.round) { ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
		else ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
	}
	ctx.globalCompositeOperation = "source-over";
	for (const r of rings) {
		ctx.globalAlpha = Math.max(0, r.life / r.max);
		ctx.strokeStyle = r.c; ctx.lineWidth = 4 * fxE;
		ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
	}
	for (const sl of slashes) {
		if (sl.delay > 0) continue;
		const k = 1 - sl.life / sl.max;
		ctx.globalAlpha = Math.max(0, sl.life / sl.max);
		ctx.strokeStyle = "#fff"; ctx.lineWidth = (6 - 4 * k) * fxE;
		ctx.beginPath();
		ctx.moveTo(sl.x - sl.dx * (0.5 - k * 0.2), sl.y - sl.dy * (0.5 - k * 0.2));
		ctx.lineTo(sl.x + sl.dx * (k + 0.1), sl.y + sl.dy * (k + 0.1));
		ctx.stroke();
	}
	for (const b of bolts) {
		ctx.globalAlpha = Math.max(0, b.life / b.max);
		ctx.shadowColor = "#9fd8ff"; ctx.shadowBlur = 14 * fxE;
		for (const [width, col] of [[7, "#5a9bff"], [3, "#ffffff"]]) {
			ctx.lineWidth = width * fxE; ctx.strokeStyle = col;
			ctx.beginPath();
			b.pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
			ctx.stroke();
		}
		ctx.shadowBlur = 0;
	}
	ctx.restore();
}

// ---------------------------------------------------------------- challenges
const KEYS = ["W", "A", "S", "D"];
const LEAD_IN = 0.45; // seconds shown before input is accepted
const RESULT_TIME = 0.9; // seconds the grade is shown

// d = normalised error (0 = perfect, 1 = edge of the zone).
function gradeFromError(d) {
	if (d <= 0.12) return 4;
	if (d <= 0.35) return 3;
	if (d <= 0.7) return 2;
	if (d <= 1) return 1;
	return 0;
}

// ---------------------------------------------------------------- fading hints
// Text hints show for the first few uses of each challenge type, then fade away. Remembered per player.
let hintCounts = null;
function hintAlphaFor(type) {
	try {
		if (!hintCounts) { try { hintCounts = JSON.parse(localStorage.getItem("qtb-hints") || "{}"); } catch (e) { hintCounts = {}; } }
		const n = hintCounts[type] || 0;
		hintCounts[type] = n + 1;
		try { localStorage.setItem("qtb-hints", JSON.stringify(hintCounts)); } catch (e) { /* ignore */ }
		const uses = Math.max(1, CONFIG.hintUses);
		return n < uses ? Math.max(0.25, 1 - n / uses) : 0;
	} catch (e) { return 0; }
}

// ---------------------------------------------------------------- pixel style
// The whole overlay can be drawn at a low resolution and scaled up with hard edges, so it matches the engine's
// chunky pixel art. Text is drawn from a built-in 5x7 bitmap font (no font files needed).
const GLYPHS = {
	"A": "01110 10001 10001 11111 10001 10001 10001", "B": "11110 10001 10001 11110 10001 10001 11110",
	"C": "01110 10001 10000 10000 10000 10001 01110", "D": "11110 10001 10001 10001 10001 10001 11110",
	"E": "11111 10000 10000 11110 10000 10000 11111", "F": "11111 10000 10000 11110 10000 10000 10000",
	"G": "01110 10001 10000 10111 10001 10001 01111", "H": "10001 10001 10001 11111 10001 10001 10001",
	"I": "01110 00100 00100 00100 00100 00100 01110", "J": "00111 00010 00010 00010 00010 10010 01100",
	"K": "10001 10010 10100 11000 10100 10010 10001", "L": "10000 10000 10000 10000 10000 10000 11111",
	"M": "10001 11011 10101 10101 10001 10001 10001", "N": "10001 11001 10101 10011 10001 10001 10001",
	"O": "01110 10001 10001 10001 10001 10001 01110", "P": "11110 10001 10001 11110 10000 10000 10000",
	"Q": "01110 10001 10001 10001 10101 10010 01101", "R": "11110 10001 10001 11110 10100 10010 10001",
	"S": "01111 10000 10000 01110 00001 00001 11110", "T": "11111 00100 00100 00100 00100 00100 00100",
	"U": "10001 10001 10001 10001 10001 10001 01110", "V": "10001 10001 10001 10001 10001 01010 00100",
	"W": "10001 10001 10001 10101 10101 11011 10001", "X": "10001 10001 01010 00100 01010 10001 10001",
	"Y": "10001 10001 01010 00100 00100 00100 00100", "Z": "11111 00001 00010 00100 01000 10000 11111",
	"0": "01110 10001 10011 10101 11001 10001 01110", "1": "00100 01100 00100 00100 00100 00100 01110",
	"2": "01110 10001 00001 00010 00100 01000 11111", "3": "11110 00001 00001 01110 00001 00001 11110",
	"4": "00010 00110 01010 10010 11111 00010 00010", "5": "11111 10000 11110 00001 00001 10001 01110",
	"6": "00110 01000 10000 11110 10001 10001 01110", "7": "11111 00001 00010 00100 01000 01000 01000",
	"8": "01110 10001 10001 01110 10001 10001 01110", "9": "01110 10001 10001 01111 00001 00010 01100",
	"!": "00100 00100 00100 00100 00100 00000 00100", "?": "01110 10001 00001 00010 00100 00000 00100",
	".": "00000 00000 00000 00000 00000 00110 00110", ",": "00000 00000 00000 00000 00110 00100 01000",
	"'": "00100 00100 01000 00000 00000 00000 00000", ":": "00000 00110 00110 00000 00110 00110 00000",
	"-": "00000 00000 00000 11111 00000 00000 00000", "+": "00000 00100 00100 11111 00100 00100 00000",
	"%": "11001 11010 00010 00100 01000 01011 10011", "(": "00010 00100 01000 01000 01000 00100 00010",
	")": "01000 00100 00010 00010 00010 00100 01000", " ": "00000 00000 00000 00000 00000 00000 00000"
};
const GLYPH_ROWS = {};
for (const k in GLYPHS) GLYPH_ROWS[k] = GLYPHS[k].split(" ");

let pxCanvas = null, pxCtx = null;
function pixelSize(h) { return CONFIG.pixelSize > 0 ? CONFIG.pixelSize : Math.max(2, Math.round(h / 330)); }
function bitmapText(ctx, text, x, y, stroke, P) {
	const m = /(\d+(?:\.\d+)?)px/.exec(ctx.font), size = m ? parseFloat(m[1]) : 16;
	const cell = P * Math.max(1, Math.round(size / 7.5 / P)), str = String(text).toUpperCase(), adv = cell * 6, wTot = str.length * adv - cell;
	let ox = x - (ctx.textAlign === "left" ? 0 : ctx.textAlign === "right" ? wTot : wTot / 2);
	const oy = y - cell * 3.5, grow = stroke ? ctx.lineWidth / 2 : 0;
	ox = Math.round(ox / P) * P;
	for (let i = 0; i < str.length; i++) {
		const rows = GLYPH_ROWS[str[i]] || GLYPH_ROWS["?"];
		for (let r = 0; r < 7; r++) for (let q = 0; q < 5; q++) if (rows[r][q] === "1") {
			const px = ox + i * adv + q * cell, py = oy + r * cell;
			if (stroke) ctx.fillRect(px - grow, py - grow, cell + grow * 2, cell + grow * 2); else ctx.fillRect(px, py, cell, cell);
		}
	}
}
function pixelCtx(w, h) {
	const P = pixelSize(h), cw = Math.ceil(w / P), ch = Math.ceil(h / P);
	if (!pxCanvas || pxCanvas.width !== cw || pxCanvas.height !== ch || pxCanvas.P !== P) {
		pxCanvas = document.createElement("canvas"); pxCanvas.width = cw; pxCanvas.height = ch; pxCanvas.P = P;
		pxCtx = pxCanvas.getContext("2d");
		pxCtx.fillText = function (t, x, y) { const s = this.fillStyle; this.save(); this.fillStyle = s; bitmapText(this, t, x, y, false, P); this.restore(); };
		pxCtx.strokeText = function (t, x, y) { this.save(); this.fillStyle = this.strokeStyle; bitmapText(this, t, x, y, true, P); this.restore(); };
		pxCtx.measureText = function (t) { return { width: String(t).length * 6 * P }; };
	}
	pxCtx.setTransform(1, 0, 0, 1, 0, 0);
	pxCtx.globalAlpha = 1; pxCtx.globalCompositeOperation = "source-over"; pxCtx.shadowBlur = 0;
	pxCtx.clearRect(0, 0, cw, ch);
	pxCtx.setTransform(1 / P, 0, 0, 1 / P, 0, 0);
	return pxCtx;
}
// Hard-edge the low-res layer (no anti-aliasing, limited colours) and blit it up with nearest-neighbour scaling.
function pixelFlush(target, w, h) {
	const c = pxCanvas;
	pxCtx.setTransform(1, 0, 0, 1, 0, 0);
	const img = pxCtx.getImageData(0, 0, c.width, c.height), d = img.data;
	for (let i = 0; i < d.length; i += 4) {
		if (d[i + 3] < 110) { d[i + 3] = 0; continue; }
		d[i + 3] = 255;
		d[i] = Math.round(d[i] / 51) * 51; d[i + 1] = Math.round(d[i + 1] / 51) * 51; d[i + 2] = Math.round(d[i + 2] / 51) * 51;
	}
	pxCtx.putImageData(img, 0, 0);
	target.save(); target.imageSmoothingEnabled = false;
	target.drawImage(c, 0, 0, c.width * c.P, c.height * c.P);
	target.restore();
}

// ---------------------------------------------------------------- ui kit (everything is drawn from shapes: no art files)
// Look: paper-cutout stickers with a dark ink outline, springy pop-ins, themed motifs, confetti for big hits.
const INK = "#2a2036", PAPER = "#fffaf0";
const GRADE_COLORS = ["#9aa3b5", "#8fe388", "#4fc3ff", "#ffb02e", "#ffffff"];
let uiU = 1; // UI unit in pixels (set every frame)
let beatAt = 0; // last time any tick/note played, drives the beat pulse
const clamp01 = t => Math.max(0, Math.min(1, t));
const ease = {
	outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
	outElastic: t => t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1,
	outQuad: t => 1 - (1 - t) * (1 - t),
	inQuad: t => t * t
};
function hexRGB(c) {
	let h = String(c).replace("#", "");
	if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
	const n = parseInt(h, 16) || 0;
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a, b, k) { const A = hexRGB(a), B = hexRGB(b); return "rgb(" + A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",") + ")"; }
function alpha(c, a) { return "rgba(" + hexRGB(c).join(",") + "," + a + ")"; }

function rr(ctx, x, y, w, h, r) {
	r = Math.max(0, Math.min(r, w / 2, h / 2));
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}
function starPath(ctx, cx, cy, ro, ri, n, rot) {
	ctx.beginPath();
	for (let i = 0; i < n * 2; i++) {
		const a = (rot || 0) + i * Math.PI / n - Math.PI / 2, r = i % 2 ? ri : ro;
		if (i) ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); else ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
	}
	ctx.closePath();
}
// Sticker look for the current path: thick ink outline underneath, fill on top.
function sticker(ctx, fill, lw, ink) {
	ctx.lineJoin = "round"; ctx.miterLimit = 2;
	ctx.lineWidth = lw * 2; ctx.strokeStyle = ink || INK; ctx.stroke();
	ctx.fillStyle = fill; ctx.fill();
}
function sparkle(ctx, x, y, s, rot, fill, withInk) {
	starPath(ctx, x, y, s, s * 0.2, 4, rot || 0);
	if (withInk) sticker(ctx, fill, Math.max(1, s * 0.12)); else { ctx.fillStyle = fill; ctx.fill(); }
}
function checkMark(ctx, x, y, s, color) {
	ctx.save(); ctx.translate(x, y);
	ctx.lineCap = "round"; ctx.lineJoin = "round";
	ctx.beginPath(); ctx.moveTo(-s * 0.55, 0); ctx.lineTo(-s * 0.12, s * 0.42); ctx.lineTo(s * 0.6, -s * 0.45);
	ctx.strokeStyle = INK; ctx.lineWidth = s * 0.5; ctx.stroke();
	ctx.strokeStyle = color; ctx.lineWidth = s * 0.28; ctx.stroke();
	ctx.restore();
}
// A small themed emblem (flame, bolt, snowflake...) drawn as a sticker.
function motif(ctx, theme, x, y, s, rot, fill) {
	ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
	ctx.beginPath();
	switch (theme) {
		case "fire":
			ctx.moveTo(0, -s);
			ctx.bezierCurveTo(s * 0.15, -s * 0.55, s * 0.8, -s * 0.15, s * 0.75, s * 0.35);
			ctx.bezierCurveTo(s * 0.7, s * 0.8, s * 0.3, s * 0.95, 0, s * 0.95);
			ctx.bezierCurveTo(-s * 0.4, s * 0.95, -s * 0.8, s * 0.7, -s * 0.7, s * 0.2);
			ctx.bezierCurveTo(-s * 0.65, -s * 0.1, -s * 0.35, -s * 0.2, -s * 0.3, -s * 0.55);
			ctx.bezierCurveTo(-s * 0.1, -s * 0.45, -s * 0.05, -s * 0.75, 0, -s);
			ctx.closePath(); break;
		case "lightning":
			ctx.moveTo(s * 0.25, -s); ctx.lineTo(-s * 0.65, s * 0.15); ctx.lineTo(-s * 0.05, s * 0.15);
			ctx.lineTo(-s * 0.3, s); ctx.lineTo(s * 0.65, -s * 0.25); ctx.lineTo(s * 0.05, -s * 0.25); ctx.closePath(); break;
		case "ice": starPath(ctx, 0, 0, s, s * 0.42, 6, 0); break;
		case "water":
			ctx.moveTo(0, -s);
			ctx.bezierCurveTo(s * 0.2, -s * 0.5, s * 0.8, -s * 0.05, s * 0.8, s * 0.3);
			ctx.bezierCurveTo(s * 0.8, s * 0.8, s * 0.3, s, 0, s);
			ctx.bezierCurveTo(-s * 0.3, s, -s * 0.8, s * 0.8, -s * 0.8, s * 0.3);
			ctx.bezierCurveTo(-s * 0.8, -s * 0.05, -s * 0.2, -s * 0.5, 0, -s);
			ctx.closePath(); break;
		case "earth":
			ctx.moveTo(0, -s); ctx.lineTo(s * 0.85, -s * 0.1); ctx.lineTo(s * 0.55, s * 0.85); ctx.lineTo(-s * 0.55, s * 0.85); ctx.lineTo(-s * 0.85, -s * 0.1); ctx.closePath(); break;
		case "wind":
			ctx.moveTo(-s, 0); ctx.quadraticCurveTo(0, -s * 1.2, s, 0); ctx.quadraticCurveTo(0, s * 1.2, -s, 0); ctx.closePath(); break;
		case "light": starPath(ctx, 0, 0, s, s * 0.55, 8, 0); break;
		case "shadow":
			ctx.arc(0, 0, s, -Math.PI * 0.5, Math.PI * 0.5, false);
			ctx.arc(s * 0.5, 0, s * 0.82, Math.PI * 0.5, -Math.PI * 0.5, true);
			ctx.closePath(); break;
		case "heal":
			ctx.moveTo(0, s * 0.9);
			ctx.bezierCurveTo(-s * 1.3, s * 0.1, -s * 0.7, -s * 0.9, 0, -s * 0.3);
			ctx.bezierCurveTo(s * 0.7, -s * 0.9, s * 1.3, s * 0.1, 0, s * 0.9);
			ctx.closePath(); break;
		default: starPath(ctx, 0, 0, s, s * 0.5, 5, 0);
	}
	sticker(ctx, fill, Math.max(1.5, s * 0.14));
	ctx.restore();
}

// Where a prompt of size pw x ph is drawn: just above the active hero's head (or screen centre when
// "Prompts Over Head" is off). Remembers the panel so the bubble, hint, grade popup and pulse can follow.
function place(c, w, h, u, pw, ph) {
	const m = 12 * u;
	let x = w / 2, y = h * 0.7;
	if (CONFIG.overhead) {
		const o = c.origin;
		x = Math.min(w - m - pw / 2 - 14 * u, Math.max(m + pw / 2 + 14 * u, o.x));
		y = Math.min(h - m - ph / 2, Math.max(m + 78 * u + ph / 2, o.y - 44 * u - ph / 2));
	}
	c.panel = { x, y, top: y - ph / 2, bottom: y + ph / 2, w: pw, h: ph };
	return c.panel;
}

// Paper speech bubble with a tail pointing at the hero, themed corner stickers and a beat-pulse glow.
function bubble(ctx, c, p, u) {
	const T = c.T, pad = 15 * u, r = 16 * u;
	const x = p.x - p.w / 2 - pad, y = p.y - p.h / 2 - pad, w = p.w + pad * 2, h = p.h + pad * 2;
	const tipX = Math.min(x + w - r * 1.2, Math.max(x + r * 1.2, c.origin.x)), tipY = Math.max(y + h + 10 * u, c.origin.y - 12 * u);
	const body = () => {
		rr(ctx, x, y, w, h, r);
		ctx.moveTo(tipX - 11 * u, y + h - 2); ctx.lineTo(tipX, tipY); ctx.lineTo(tipX + 11 * u, y + h - 2); ctx.closePath();
	};
	ctx.save();
	ctx.lineJoin = "round";
	// drop shadow
	ctx.translate(3 * u, 5 * u); body(); ctx.fillStyle = "rgba(25,10,40,0.30)"; ctx.fill(); ctx.translate(-3 * u, -5 * u);
	// beat pulse glow
	if (c.beat > 0) {
		body(); ctx.lineWidth = (6 + 10 * c.beat) * u; ctx.strokeStyle = alpha(T.accent, 0.18 + 0.5 * c.beat); ctx.stroke();
	}
	// outline + paper body
	body(); ctx.lineWidth = 6 * u; ctx.strokeStyle = INK; ctx.stroke();
	const g = ctx.createLinearGradient(0, y, 0, y + h);
	g.addColorStop(0, mix(PAPER, T.accent, 0.22)); g.addColorStop(0.35, PAPER); g.addColorStop(1, mix(PAPER, T.accent, 0.10));
	body(); ctx.fillStyle = g; ctx.fill();
	// inner highlight line
	rr(ctx, x + 5 * u, y + 5 * u, w - 10 * u, h - 10 * u, r - 4 * u);
	ctx.lineWidth = 1.6 * u; ctx.strokeStyle = alpha("#ffffff", 0.9); ctx.stroke();
	// themed corner stickers
	motif(ctx, c.themeName, x + 8 * u, y + 4 * u, 13 * u, -0.35, T.accent);
	motif(ctx, c.themeName, x + w - 8 * u, y + 4 * u, 13 * u, 0.35, T.accent);
	ctx.restore();
}

// Arrow-shaped key sticker: W = house (up), S = down, A = left, D = right, ENTER = wide key.
// opt: { fill, text, glow, check, press (0..1 squash) }
function drawKeyCap(ctx, key, cx, cy, s, opt) {
	opt = opt || {};
	const hf = s / 2, t = s * 0.34, ew = s * 0.95;
	const path = () => {
		ctx.beginPath();
		if (key === "ENTER") { rr(ctx, -ew, -hf, ew * 2, s, s * 0.22); return; }
		if (key === "W") { ctx.moveTo(-hf, hf); ctx.lineTo(-hf, -hf + t * 0.2); ctx.lineTo(0, -hf - t); ctx.lineTo(hf, -hf + t * 0.2); ctx.lineTo(hf, hf); }
		else if (key === "S") { ctx.moveTo(-hf, -hf); ctx.lineTo(hf, -hf); ctx.lineTo(hf, hf - t * 0.2); ctx.lineTo(0, hf + t); ctx.lineTo(-hf, hf - t * 0.2); }
		else if (key === "A") { ctx.moveTo(hf, -hf); ctx.lineTo(hf, hf); ctx.lineTo(-hf + t * 0.2, hf); ctx.lineTo(-hf - t, 0); ctx.lineTo(-hf + t * 0.2, -hf); }
		else if (key === "D") { ctx.moveTo(-hf, -hf); ctx.lineTo(hf - t * 0.2, -hf); ctx.lineTo(hf + t, 0); ctx.lineTo(hf - t * 0.2, hf); ctx.lineTo(-hf, hf); }
		else ctx.rect(-hf, -hf, s, s);
		ctx.closePath();
	};
	const press = opt.press || 0, fill = opt.fill || "#ffffff";
	ctx.save();
	ctx.translate(cx, cy + press * s * 0.1);
	ctx.scale(1 + 0.12 * press, 1 - 0.18 * press);
	ctx.lineJoin = "round"; ctx.miterLimit = 2;
	if (!press) { ctx.save(); ctx.translate(0, s * 0.12); path(); ctx.fillStyle = "rgba(25,10,40,0.32)"; ctx.fill(); ctx.restore(); }
	if (opt.glow) { ctx.shadowColor = opt.glow; ctx.shadowBlur = s * 0.7; }
	path(); ctx.lineWidth = s * 0.2; ctx.strokeStyle = INK; ctx.stroke();
	ctx.shadowBlur = 0;
	const g = ctx.createLinearGradient(0, -hf - t, 0, hf + t);
	g.addColorStop(0, mix(fill, "#ffffff", 0.55)); g.addColorStop(0.5, fill); g.addColorStop(1, mix(fill, "#000000", 0.18));
	path(); ctx.fillStyle = g; ctx.fill();
	ctx.save(); ctx.scale(0.8, 0.8); path(); ctx.lineWidth = s * 0.05; ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.stroke(); ctx.restore();
	if (opt.check) {
		checkMark(ctx, 0, 0, s * 0.42, "#ffffff");
	} else {
		const dark = opt.text === "#fff" || opt.text === "#ffffff";
		ctx.textAlign = "center"; ctx.textBaseline = "middle";
		ctx.font = "900 " + (key === "ENTER" ? s * 0.32 : s * 0.52) + "px 'Trebuchet MS','Arial Black',sans-serif";
		const ty = (key === "W" ? t * 0.4 : key === "S" ? -t * 0.4 : 0) + s * 0.02, tx = key === "A" ? t * 0.35 : key === "D" ? -t * 0.35 : 0;
		const label = key === "ENTER" ? "ENTER" : key;
		if (key === "ENTER" && CONFIG.uiStyle === "pixel") { // return-arrow icon: the bitmap font is too wide for the key
			ctx.lineCap = "butt"; ctx.lineJoin = "miter";
			const arrow = () => { ctx.beginPath(); ctx.moveTo(s * 0.5, -s * 0.28); ctx.lineTo(s * 0.5, s * 0.12); ctx.lineTo(-s * 0.3, s * 0.12); ctx.moveTo(-s * 0.05, -s * 0.13); ctx.lineTo(-s * 0.3, s * 0.12); ctx.lineTo(-s * 0.05, s * 0.37); };
			arrow(); ctx.lineWidth = s * 0.3; ctx.strokeStyle = dark ? INK : "#ffffff"; ctx.stroke();
			arrow(); ctx.lineWidth = s * 0.14; ctx.strokeStyle = opt.text || INK; ctx.stroke();
			ctx.restore(); return;
		}
		if (dark) { ctx.lineWidth = s * 0.14; ctx.strokeStyle = INK; ctx.strokeText(label, tx, ty); }
		ctx.fillStyle = opt.text || INK; ctx.fillText(label, tx, ty);
	}
	ctx.restore();
}

// Concentric target with a rotating dashed tolerance ring.
function bullseye(ctx, cx, cy, r, tol, T, glow, now) {
	ctx.save();
	ctx.lineJoin = "round";
	ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
	ctx.lineWidth = Math.max(2, tol * 2); ctx.strokeStyle = alpha(T.accent, glow ? 0.55 : 0.28); ctx.stroke();
	ctx.setLineDash([r * 0.28, r * 0.2]); ctx.lineDashOffset = 0;
	for (const rad of [r + tol, Math.max(2, r - tol)]) {
		ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2);
		ctx.lineWidth = 3 * uiU; ctx.strokeStyle = INK; ctx.stroke();
		ctx.lineWidth = 1.6 * uiU; ctx.strokeStyle = glow ? "#ffffff" : T.accent; ctx.stroke();
	}
	ctx.setLineDash([]);
	const pulse = glow ? 1.12 : 1;
	sparkle(ctx, cx, cy, Math.max(4, r * 0.55) * pulse, 0, glow ? "#ffffff" : T.accent, true);
	ctx.restore();
}

// Big "GREAT!" style grade banner: ink + white sticker outline, elastic pop, rays and sparkles on high grades.
function drawGrade(ctx, c, x, y, u) {
	const g = c.grade, t = c.resultT, label = CONFIG.labels[g];
	const k = clamp01(t / 0.9), pop = ease.outElastic(clamp01(t / 0.5));
	const fade = k < 0.75 ? 1 : 1 - (k - 0.75) / 0.25;
	const base = (32 + g * 3) * u;
	ctx.save();
	ctx.globalAlpha = Math.max(0, fade);
	ctx.translate(x, y - 30 * u * ease.outQuad(clamp01(t / 0.3)) + (g === 0 ? 24 * u * k : 0));
	if (g >= 3) { // rotating starburst behind the text
		const n = 16, R = (70 + g * 14) * u * pop;
		ctx.save(); ctx.rotate(t * 0.9);
		for (let i = 0; i < n; i++) {
			const a = i * Math.PI * 2 / n, d = Math.PI / n * 0.55;
			ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a - d) * R, Math.sin(a - d) * R); ctx.lineTo(Math.cos(a + d) * R, Math.sin(a + d) * R); ctx.closePath();
			ctx.fillStyle = i % 2 ? alpha(c.T.accent, 0.38) : "rgba(255,255,255,0.32)"; ctx.fill();
		}
		ctx.restore();
	}
	ctx.rotate(g === 0 ? Math.sin(t * 38) * 0.05 * (1 - k) : -0.07);
	ctx.scale(pop, pop * (g === 0 ? 0.88 : 1));
	ctx.font = "900 italic " + base + "px 'Trebuchet MS','Arial Black',Impact,sans-serif";
	ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round"; ctx.miterLimit = 2;
	ctx.shadowColor = "rgba(25,10,40,0.35)"; ctx.shadowOffsetY = 4 * u;
	ctx.lineWidth = base * 0.36; ctx.strokeStyle = INK; ctx.strokeText(label, 0, 0);
	ctx.shadowColor = "transparent"; ctx.shadowOffsetY = 0;
	ctx.lineWidth = base * 0.18; ctx.strokeStyle = "#ffffff"; ctx.strokeText(label, 0, 0);
	const tw = ctx.measureText(label).width;
	if (g === 4) { // rainbow shimmer
		const gr = ctx.createLinearGradient(-tw / 2, 0, tw / 2, 0);
		for (let i = 0; i <= 5; i++) gr.addColorStop(i / 5, "hsl(" + ((t * 260 + i * 55) % 360) + ",95%,62%)");
		ctx.fillStyle = gr;
	} else ctx.fillStyle = GRADE_COLORS[g];
	ctx.fillText(label, 0, 0);
	if (g >= 2) {
		const tw2 = tw / 2;
		sparkle(ctx, tw2 * 0.9, -base * 0.5, base * 0.3 * (0.7 + 0.3 * Math.sin(t * 16)), t * 2, "#ffffff", true);
		if (g >= 3) sparkle(ctx, -tw2 * 0.95, base * 0.25, base * 0.22 * (0.7 + 0.3 * Math.cos(t * 14)), -t * 2, "#ffffff", true);
	}
	ctx.restore();
}


class Challenge {
	constructor(def, theme) {
		this.def = def;
		this.theme = theme;
		this.T = themeOf(theme);
		this.t = 0; // seconds since start
		this.grade = null;
		this.resultT = 0;
		this.finished = false;
		this.fxAcc = 0;
		this.sfxAcc = 0;
		this.intensity = 0.4; // 0..1, drives ambient particles
		this.target = { x: 0, y: 0 }; // screen position of the first target, set every tick
		this.targets = []; // screen positions of every target (area skills)
		this.origin = { x: 0, y: 0 }; // screen position of the user
		this.themeName = theme;
		this.beat = 0;
	}
	get running() { return this.t >= LEAD_IN; }
	resolve(grade) {
		if (this.grade !== null) return;
		this.grade = grade;
		auras = [];
		sfxResult(grade, this.theme);
		this.burstAll(grade);
		if (grade >= 3) { const q = this.lastPanel || this.panel || { x: this.origin.x, top: this.origin.y - 60 }; confetti(grade === 4 ? 55 : 20, q.x, q.top); }
	}
	tick(dt) {
		this.t += dt;
		if (this.grade !== null) {
			this.resultT += dt;
			if (this.resultT >= RESULT_TIME) this.finished = true;
			return;
		}
		const pts = this.targets.length ? this.targets : [this.target];
		auras = this.theme === "plain" ? [] : pts.map(p => ({ theme: this.theme, x: p.x, y: p.y, power: this.intensity }));
		this.fxAcc += dt * (8 + 70 * this.intensity) * Math.min(pts.length, 3) * 0.8;
		while (this.fxAcc >= 1) {
			this.fxAcc -= 1;
			const p = pts[Math.floor(Math.random() * pts.length)];
			emit(this.theme, p.x, p.y, this.intensity);
		}
		this.update(dt);
	}
	burstAll(grade) { // effects play on every target of an area skill
		for (const p of (this.targets.length ? this.targets : [this.target])) burst(this.theme, grade, p.x, p.y, false);
	}
	update() {}
	onKey() {}
	onKeyUp() {}
}

// A marker sweeps across a bar; press Enter inside the zone.
class TimingChallenge extends Challenge {
	constructor(def, theme) {
		super(def, theme);
		this.duration = def.duration || 1.2;
		this.zone = def.zone || 0.16;
		this.center = def.center || 0.75;
		this.wasIn = false;
	}
	get pos() { return Math.min(1, Math.max(0, (this.t - LEAD_IN) / this.duration)); }
	get inZone() { return Math.abs(this.pos - this.center) <= this.zone / 2; }
	update(dt) {
		if (!this.running) return;
		if (this.pos >= 1) { this.resolve(0); return; }
		const inZ = this.inZone;
		this.intensity = inZ ? 1 : 0.3 + 0.4 * this.pos;
		// Rising ticks while approaching; fast high ticks inside the zone.
		this.sfxAcc += dt;
		const interval = inZ ? 0.06 : 0.14;
		if (this.sfxAcc >= interval) {
			this.sfxAcc = 0;
			tone(inZ ? 1320 : 380 + 520 * this.pos, 0.05, this.T.wave, inZ ? 0.9 : 0.5);
		}
		if (inZ && !this.wasIn) tone(1760, 0.12, "sine", 1);
		this.wasIn = inZ;
	}
	onKey(key) {
		if (key !== "ENTER" || !this.running) return;
		this.resolve(gradeFromError(Math.abs(this.pos - this.center) / (this.zone / 2)));
	}
	draw(ctx, w, h, u) {
		const T = this.T, bw = 320 * u, bh = 26 * u, now = performance.now() / 1000;
		const p = place(this, w, h, u, bw, bh + 30 * u); bubble(ctx, this, p, u);
		const x = p.x - bw / 2, y = p.y - bh / 2 + 10 * u, cx = x + this.center * bw, zw = this.zone * bw, inZ = this.inZone && this.grade === null;
		rr(ctx, x, y, bw, bh, bh / 2); ctx.lineWidth = 6 * u; ctx.strokeStyle = INK; ctx.stroke();
		const tg = ctx.createLinearGradient(0, y, 0, y + bh); tg.addColorStop(0, mix(T.bar, "#000000", 0.35)); tg.addColorStop(1, mix(T.bar, "#ffffff", 0.12));
		rr(ctx, x, y, bw, bh, bh / 2); ctx.fillStyle = tg; ctx.fill();
		ctx.fillStyle = "rgba(255,255,255,0.22)";
		for (let i = 1; i < 10; i++) ctx.fillRect(x + bw * i / 10 - 1 * u, y + bh * 0.62, 2 * u, bh * 0.26);
		ctx.save();
		if (inZ) { ctx.shadowColor = T.accent; ctx.shadowBlur = (10 + 8 * Math.sin(now * 18)) * u; }
		for (const [k, col] of [[1, T.zone], [0.62, mix(T.zone, "#ffffff", 0.4)], [0.3, T.accent]]) { rr(ctx, cx - zw * k / 2, y + 3 * u, zw * k, bh - 6 * u, (bh - 6 * u) / 2); ctx.fillStyle = col; ctx.fill(); }
		ctx.restore();
		const bob = Math.sin(now * 5) * 2.5 * u, sk = inZ ? 1.25 : 1;
		starPath(ctx, cx, y - 12 * u + bob, 10 * u * sk, 4.4 * u * sk, 5, now * 0.9); sticker(ctx, "#ffd23f", 1.6 * u);
		const mx = x + this.pos * bw;
		if (this.running && this.grade === null) for (let k = 4; k >= 1; k--) {
			ctx.fillStyle = alpha("#ffffff", 0.07 * (5 - k)); rr(ctx, mx - k * 6 * u - 3 * u, y + 2 * u, 6 * u, bh - 4 * u, 3 * u); ctx.fill();
		}
		rr(ctx, mx - 4 * u, y - 5 * u, 8 * u, bh + 10 * u, 4 * u); sticker(ctx, inZ ? T.accent : "#ffffff", 1.8 * u);
		ctx.beginPath(); ctx.moveTo(mx - 8 * u, y - 18 * u); ctx.lineTo(mx + 8 * u, y - 18 * u); ctx.lineTo(mx, y - 6 * u); ctx.closePath();
		sticker(ctx, inZ ? T.accent : "#ffffff", 1.6 * u);
		return "ENTER IN THE ZONE!";
	}
}

// A ring shrinks onto a target circle; press Enter when they match.
class RingChallenge extends Challenge {
	constructor(def, theme) {
		super(def, theme);
		this.duration = def.duration || 1.1;
		this.targetRatio = 0.6;
		this.tolerance = def.tolerance || 0.1;
	}
	get ratio() { return 1 - Math.min(1, Math.max(0, (this.t - LEAD_IN) / this.duration)); }
	update(dt) {
		if (!this.running) return;
		if (this.ratio <= 0) { this.resolve(0); return; }
		const near = Math.abs(this.ratio - this.targetRatio) <= this.tolerance;
		this.intensity = 0.3 + 0.7 * (1 - this.ratio);
		// Ticks speed up and rise in pitch as the ring closes.
		this.sfxAcc += dt;
		if (this.sfxAcc >= 0.05 + 0.25 * this.ratio) {
			this.sfxAcc = 0;
			tone(near ? 1320 : 300 + 700 * (1 - this.ratio), 0.05, this.T.wave, near ? 0.9 : 0.5);
		}
	}
	onKey(key) {
		if (key !== "ENTER" || !this.running) return;
		this.resolve(gradeFromError(Math.abs(this.ratio - this.targetRatio) / this.tolerance));
	}
	draw(ctx, w, h, u) {
		const T = this.T, r0 = 84 * u, now = performance.now() / 1000;
		const p = place(this, w, h, u, r0 * 2.1, r0 * 2.1); bubble(ctx, this, p, u);
		const cx = p.x, cy = p.y, near = this.running && this.grade === null && Math.abs(this.ratio - this.targetRatio) <= this.tolerance;
		bullseye(ctx, cx, cy, r0 * this.targetRatio, r0 * this.tolerance, T, near, now);
		if (this.running && this.grade === null) {
			const r = Math.max(2, r0 * this.ratio);
			ctx.save();
			if (near) { ctx.shadowColor = T.accent; ctx.shadowBlur = 16 * u; }
			ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.lineWidth = 12 * u; ctx.strokeStyle = INK; ctx.stroke();
			ctx.lineWidth = 6.5 * u; ctx.strokeStyle = near ? T.accent : "#ffffff"; ctx.stroke();
			ctx.restore();
			for (let i = 0; i < 6; i++) {
				const a = now * 2.2 + i * Math.PI / 3;
				ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 3.2 * u, 0, Math.PI * 2); sticker(ctx, T.zone, 1.2 * u);
			}
		}
		return "ENTER WHEN THEY MATCH!";
	}
}

// Press the shown WASD keys in order.
class SequenceChallenge extends Challenge {
	constructor(def, theme) {
		super(def, theme);
		this.limit = def.duration || 2.2;
		const n = def.length || 4;
		this.seq = Array.isArray(def.keys) && def.keys.length
			? def.keys.map(k => String(k).toUpperCase())
			: Array.from({ length: n }, () => KEYS[Math.floor(Math.random() * KEYS.length)]);
		this.index = 0;
		this.mistakes = 0;
	}
	update() {
		if (this.running) this.intensity = 0.3 + 0.7 * (this.index / this.seq.length);
		if (this.running && this.t - LEAD_IN >= this.limit) this.resolve(0);
	}
	onKey(key) {
		if (!this.running || KEYS.indexOf(key) === -1) return;
		if (key === this.seq[this.index]) {
			// Each correct key is a higher note up a pentatonic-ish scale.
			tone(440 * Math.pow(2, [0, 2, 4, 7, 9, 12, 14, 16][Math.min(this.index, 7)] / 12), 0.1, this.T.wave, 1);
			(this.doneAt = this.doneAt || [])[this.index] = this.t;
			this.index++;
			if (this.index >= this.seq.length) {
				const used = (this.t - LEAD_IN) / this.limit;
				if (this.mistakes === 0) this.resolve(used < 0.5 ? 4 : used < 0.65 ? 3 : 2);
				else this.resolve(this.mistakes === 1 ? 1 : 0);
			}
		} else {
			this.mistakes++; this.wrongAt = this.t;
			tone(140, 0.15, "sawtooth", 0.9, 90);
			if (this.mistakes >= 3) this.resolve(0);
		}
	}
	draw(ctx, w, h, u) {
		const T = this.T, size = 46 * u, gap = 36 * u, total = this.seq.length * (size + gap) - gap, now = performance.now() / 1000;
		const p = place(this, w, h, u, total + 14 * u, size * 1.7 + 30 * u); bubble(ctx, this, p, u);
		const shake = this.wrongAt !== undefined ? Math.sin((this.t - this.wrongAt) * 60) * 6 * u * Math.max(0, 1 - (this.t - this.wrongAt) / 0.3) : 0;
		let x = p.x - total / 2 + size / 2 + shake;
		const y = p.y - 10 * u;
		for (let i = 0; i < this.seq.length; i++) {
			const cur = i === this.index && this.grade === null, done = i < this.index;
			let sz = size, yy = y;
			if (cur) { sz = size * 1.18; yy = y - Math.abs(Math.sin(now * 6)) * 5 * u; }
			if (done && this.doneAt && this.doneAt[i] !== undefined) sz = size * (1 + 0.25 * Math.sin(Math.PI * clamp01((this.t - this.doneAt[i]) / 0.25)));
			drawKeyCap(ctx, this.seq[i], x, yy, sz, done ? { fill: T.zone, check: true } : cur ? { fill: T.accent, text: INK, glow: T.accent } : { fill: "#ffffff", text: "#7a7088" });
			x += size + gap;
		}
		if (this.running) {
			const left = Math.max(0, 1 - (this.t - LEAD_IN) / this.limit), fy = p.bottom - 6 * u, fx = p.x - total / 2, fw = total;
			rr(ctx, fx, fy - 5 * u, fw, 10 * u, 5 * u); ctx.lineWidth = 4 * u; ctx.strokeStyle = INK; ctx.stroke();
			rr(ctx, fx, fy - 5 * u, fw, 10 * u, 5 * u); ctx.fillStyle = "rgba(60,45,80,0.55)"; ctx.fill();
			if (left > 0.01) {
				rr(ctx, fx, fy - 5 * u, fw * left, 10 * u, 5 * u);
				ctx.fillStyle = left < 0.25 ? "#ff5a5a" : left < 0.5 ? "#ffb02e" : T.accent; ctx.fill();
				if (this.grade === null) sparkle(ctx, fx + fw * left, fy, (7 + 3 * Math.sin(now * 30)) * u, now * 6, "#ffe27a", true);
			}
		}
		return "KEYS IN ORDER!";
	}
}

// Mash a key (default Enter). Pitch rises with the multiplier tier being reached.
class MashChallenge extends Challenge {
	constructor(def, theme) {
		super(def, theme);
		this.limit = def.duration || 2;
		this.goal = def.count || 12;
		this.key = String(def.key || "ENTER").toUpperCase();
		this.count = 0;
		this.passed100 = false;
	}
	get ratio() { return this.count / this.goal; }
	update() {
		if (!this.running) return;
		this.intensity = Math.min(1, this.ratio / 2);
		if (this.t - LEAD_IN >= this.limit) {
			const r = this.ratio;
			this.resolve(r >= 2 ? 4 : r >= 1.5 ? 3 : r >= 1 ? 2 : r >= 0.6 ? 1 : 0);
		}
	}
	onKey(key) {
		if (!this.running || key !== this.key) return;
		this.count++; this.pressAt = this.t;
		if (this.def.overload && this.count > this.goal * this.def.overload) { // greedy mashing backfires
			tone(120, 0.3, "sawtooth", 1, 50);
			this.resolve(0);
			return;
		}
		// Pitch climbs two octaves-ish across 0..150% of the goal.
		tone(220 * Math.pow(2, Math.min(2, this.ratio) * 1.3), 0.07, this.T.wave, 0.9);
		const r = this.ratio;
		if (!this.passed100 && r >= 1) { this.passed100 = true; tone(1568, 0.2, "sine", 1); }
		this.burstAll(0); // small pop per press
	}
	draw(ctx, w, h, u) {
		const T = this.T, bw = 250 * u, bh = 28 * u, now = performance.now() / 1000;
		const p = place(this, w, h, u, bw + 70 * u, bh + 36 * u); bubble(ctx, this, p, u);
		const x = p.x - bw / 2 + 28 * u, y = p.y - bh / 2 + 10 * u, fill = Math.min(1, this.ratio / 2);
		const danger = this.def.overload && this.ratio > this.def.overload * 0.85;
		rr(ctx, x, y, bw, bh, bh / 2); ctx.lineWidth = 6 * u; ctx.strokeStyle = INK; ctx.stroke();
		rr(ctx, x, y, bw, bh, bh / 2); ctx.fillStyle = mix(T.bar, "#000000", 0.3); ctx.fill();
		if (fill > 0.01) {
			ctx.save(); rr(ctx, x + 2 * u, y + 2 * u, (bw - 4 * u) * fill, bh - 4 * u, (bh - 4 * u) / 2); ctx.clip();
			const c1 = danger && Math.sin(now * 20) > 0 ? "#ff5a5a" : T.accent;
			ctx.fillStyle = c1; ctx.fillRect(x, y, bw, bh);
			ctx.fillStyle = "rgba(255,255,255,0.35)";
			for (let i = -2; i < 24; i++) {
				const sx = x + (i * 22 + (now * 60) % 22) * u;
				ctx.beginPath(); ctx.moveTo(sx, y + bh); ctx.lineTo(sx + 10 * u, y + bh); ctx.lineTo(sx + 20 * u, y); ctx.lineTo(sx + 10 * u, y); ctx.closePath(); ctx.fill();
			}
			ctx.restore();
			ctx.fillStyle = "rgba(255,255,255,0.3)"; rr(ctx, x + 4 * u, y + 3 * u, Math.max(2 * u, (bw - 8 * u) * fill), bh * 0.28, bh * 0.14); ctx.fill();
		}
		for (const [pos, big] of [[0.5, 0.8], [0.75, 0.95], [1, 1.2]]) {
			const lit = fill >= pos - 0.001, sx = x + bw * pos - (pos === 1 ? 4 * u : 0), sy = y - 11 * u;
			ctx.save(); if (lit) { ctx.shadowColor = "#ffd23f"; ctx.shadowBlur = 10 * u; }
			starPath(ctx, sx, sy, 9 * u * big * (lit ? 1.1 : 1), 4 * u * big, 5, 0); sticker(ctx, lit ? "#ffd23f" : "#8c849c", 1.4 * u);
			ctx.restore();
		}
		const press = this.pressAt !== undefined ? clamp01(1 - (this.t - this.pressAt) / 0.12) : 0;
		drawKeyCap(ctx, this.key, p.x - bw / 2 - 20 * u, y + bh / 2, 30 * u, { fill: "#ffffff", text: INK, press });
		return "MASH " + this.key + "!";
	}
}


// Hold Enter to charge a gauge; release inside the zone. Holding past full = backfire.
class HoldChallenge extends Challenge {
	constructor(def, theme) {
		super(def, theme);
		this.duration = def.duration || 1.5;
		this.zone = def.zone || 0.16;
		this.center = def.center || 0.8;
		this.holding = false;
		this.holdStart = 0;
	}
	get gauge() { return this.holding ? Math.min(1, (this.t - this.holdStart) / this.duration) : 0; }
	update(dt) {
		if (!this.running) return;
		if (!this.holding) {
			if (this.t - LEAD_IN > 3) this.resolve(0); // never started
			return;
		}
		const g = this.gauge, inZ = Math.abs(g - this.center) <= this.zone / 2;
		this.intensity = 0.3 + 0.7 * g;
		this.sfxAcc += dt;
		if (this.sfxAcc >= (inZ ? 0.05 : 0.09)) {
			this.sfxAcc = 0;
			tone(200 + 900 * g + (inZ ? 300 : 0), 0.06, this.T.wave, 0.7);
		}
		if (g >= 1) { tone(110, 0.35, "sawtooth", 1, 50); this.resolve(0); }
	}
	onKey(key) {
		if (key !== "ENTER" || !this.running || this.holding) return;
		this.holding = true;
		this.holdStart = this.t;
	}
	onKeyUp(key) {
		if (key !== "ENTER" || !this.holding) return;
		this.resolve(gradeFromError(Math.abs(this.gauge - this.center) / (this.zone / 2)));
	}
	draw(ctx, w, h, u) {
		const T = this.T, bw = 320 * u, bh = 26 * u, now = performance.now() / 1000;
		const p = place(this, w, h, u, bw + 70 * u, bh + 34 * u); bubble(ctx, this, p, u);
		const x = p.x - bw / 2 + 30 * u, y = p.y - bh / 2 + 8 * u, cx = x + this.center * bw, zw = this.zone * bw;
		const inZ = this.holding && this.grade === null && Math.abs(this.gauge - this.center) <= this.zone / 2;
		rr(ctx, x, y, bw, bh, bh / 2); ctx.lineWidth = 6 * u; ctx.strokeStyle = INK; ctx.stroke();
		const tg = ctx.createLinearGradient(0, y, 0, y + bh); tg.addColorStop(0, mix(T.bar, "#000000", 0.35)); tg.addColorStop(1, mix(T.bar, "#ffffff", 0.12));
		rr(ctx, x, y, bw, bh, bh / 2); ctx.fillStyle = tg; ctx.fill();
		ctx.save();
		if (inZ) { ctx.shadowColor = T.accent; ctx.shadowBlur = (10 + 8 * Math.sin(now * 18)) * u; }
		for (const [k, col] of [[1, T.zone], [0.62, mix(T.zone, "#ffffff", 0.4)], [0.3, T.accent]]) { rr(ctx, cx - zw * k / 2, y + 3 * u, zw * k, bh - 6 * u, (bh - 6 * u) / 2); ctx.fillStyle = col; ctx.fill(); }
		ctx.restore();
		if (this.gauge > 0.005) {
			ctx.save(); rr(ctx, x + 2 * u, y + 2 * u, (bw - 4 * u) * this.gauge, bh - 4 * u, (bh - 4 * u) / 2); ctx.clip();
			const fg = ctx.createLinearGradient(0, y, 0, y + bh); fg.addColorStop(0, "rgba(255,255,255,0.85)"); fg.addColorStop(1, alpha(T.accent, 0.55));
			ctx.fillStyle = fg; ctx.fillRect(x, y, bw, bh);
			ctx.restore();
			const ex = x + bw * this.gauge; rr(ctx, ex - 3.5 * u, y - 4 * u, 7 * u, bh + 8 * u, 3.5 * u); sticker(ctx, inZ ? T.accent : "#ffffff", 1.6 * u);
		}
		const bob = Math.sin(now * 5) * 2.5 * u, sk = inZ ? 1.25 : 1;
		starPath(ctx, cx, y - 12 * u + bob, 10 * u * sk, 4.4 * u * sk, 5, now * 0.9); sticker(ctx, "#ffd23f", 1.6 * u);
		drawKeyCap(ctx, "ENTER", p.x - bw / 2 - 22 * u, y + bh / 2, 26 * u, { fill: this.holding ? T.accent : "#ffffff", text: INK, press: this.holding ? 1 : 0 });
		return this.holding ? "RELEASE IN THE ZONE!" : "HOLD ENTER!";
	}
}

// Hold Enter to raise a shot trajectory; release when it lands on the enemy.
class AimChallenge extends Challenge {
	constructor(def, theme) {
		super(def, theme);
		this.duration = def.duration || 1.75;
		this.minA = 5 * Math.PI / 180;
		this.maxA = 45 * Math.PI / 180;
		this.holding = false;
		this.holdStart = 0;
		this.origin = { x: 0, y: 0 };
		this.tolRatio = def.tolerance || 0.1;
	}
	get gauge() { return this.holding ? Math.min(1, (this.t - this.holdStart) / this.duration) : 0; }
	get angle() { return this.minA + (this.maxA - this.minA) * this.gauge; }
	get dist() { return Math.max(80, Math.abs(this.target.x - this.origin.x)); }
	get lmax() { return this.dist * 1.6; }
	get landing() { return this.lmax * Math.sin(2 * this.angle); }
	get err() { return Math.abs(this.landing - this.dist) / (this.dist * this.tolRatio); }
	update(dt) {
		if (!this.running) return;
		if (!this.holding) {
			if (this.t - LEAD_IN > 3) this.resolve(0);
			return;
		}
		const e = this.err;
		this.intensity = 0.3 + 0.7 * this.gauge;
		this.sfxAcc += dt;
		if (this.sfxAcc >= (e <= 1 ? 0.05 : 0.1)) {
			this.sfxAcc = 0;
			tone(220 + 700 * this.gauge + (e <= 1 ? 350 : 0), 0.06, this.T.wave, 0.7); // string tension
		}
		if (this.gauge >= 1) { tone(110, 0.3, "sawtooth", 1, 50); this.resolve(0); } // overdrawn
	}
	onKey(key) {
		if (key !== "ENTER" || !this.running || this.holding) return;
		this.holding = true;
		this.holdStart = this.t;
	}
	onKeyUp(key) {
		if (key !== "ENTER" || !this.holding) return;
		noise(0.12, 0.7, 2500, 0, "highpass"); // release whoosh
		this.resolve(gradeFromError(this.err));
	}
	draw(ctx, w, h, u) {
		const T = this.T, o = this.origin, t = this.target, now = performance.now() / 1000;
		const dir = t.x >= o.x ? 1 : -1, oy = t.y;
		bullseye(ctx, t.x, oy, 20 * u, 9 * u, T, this.holding && this.err <= 1, now);
		if (this.holding || this.running) {
			const th = this.angle, v = Math.sqrt(this.lmax), T2 = 2 * v * Math.sin(th), good = this.err <= 1;
			for (let i = 0; i <= 22; i++) {
				const tt = T2 * i / 22;
				const px = o.x + dir * v * Math.cos(th) * tt;
				const py = oy - (v * Math.sin(th) * tt - 0.5 * tt * tt) * 2.5;
				ctx.beginPath(); ctx.arc(px, py, (2.6 + 2.2 * i / 22) * u, 0, Math.PI * 2); sticker(ctx, good ? T.accent : "#ffffff", 1.2 * u);
			}
			const lx = o.x + dir * this.landing;
			ctx.beginPath(); ctx.arc(lx, oy, 9 * u, 0, Math.PI * 2); ctx.lineWidth = 6 * u; ctx.strokeStyle = INK; ctx.stroke();
			ctx.lineWidth = 3 * u; ctx.strokeStyle = good ? T.accent : "#ffffff"; ctx.stroke();
		}
		const bw = 200 * u, bh = 16 * u, p = place(this, w, h, u, bw, bh + 6 * u); bubble(ctx, this, p, u);
		const x = p.x - bw / 2, y = p.y - bh / 2;
		rr(ctx, x, y, bw, bh, bh / 2); ctx.lineWidth = 5 * u; ctx.strokeStyle = INK; ctx.stroke();
		rr(ctx, x, y, bw, bh, bh / 2); ctx.fillStyle = mix(T.bar, "#000000", 0.3); ctx.fill();
		if (this.gauge > 0.01) { rr(ctx, x + 1.5 * u, y + 1.5 * u, (bw - 3 * u) * this.gauge, bh - 3 * u, (bh - 3 * u) / 2); ctx.fillStyle = T.accent; ctx.fill(); }
		return this.holding ? "ARC ON THE ENEMY!" : "HOLD ENTER!";
	}
}

// Several quick rings in a row (rapid strikes, ricochets). Final grade is the average.
class ComboChallenge extends Challenge {
	constructor(def, theme) {
		super(def, theme);
		this.count = def.count || 3;
		this.subDur = def.duration || 0.6;
		this.gap = 0.2;
		this.tolerance = def.tolerance || 0.12;
		this.targetRatio = 0.3;
		this.results = [];
	}
	subStart(i) { return LEAD_IN + i * (this.subDur + this.gap); }
	get current() { // index of the sub-challenge in progress, or -1
		for (let i = 0; i < this.count; i++) {
			if (this.results[i] === undefined && this.t >= this.subStart(i) && this.t < this.subStart(i) + this.subDur) return i;
		}
		return -1;
	}
	ratioOf(i) { return 1 - (this.t - this.subStart(i)) / this.subDur; }
	finishSub(i, g) {
		this.results[i] = g; (this.doneAt = this.doneAt || [])[i] = this.t;
		if (g > 0) { tone(NOTES[Math.min(3, i)] * (g >= 3 ? 1.5 : 1), 0.12, this.T.wave, 1); this.burstAll(0); }
		else tone(150, 0.12, "sawtooth", 0.8, 90);
		if (this.results.filter(x => x !== undefined).length >= this.count) {
			const avg = this.results.reduce((a, b) => a + b, 0) / this.count;
			this.resolve(Math.round(avg));
		}
	}
	update() {
		for (let i = 0; i < this.count; i++) { // time out missed subs
			if (this.results[i] === undefined && this.t >= this.subStart(i) + this.subDur) this.finishSub(i, 0);
		}
		const c = this.current;
		this.intensity = c < 0 ? 0.3 : 0.5 + 0.5 * (1 - this.ratioOf(c));
	}
	onKey(key) {
		if (key !== "ENTER") return;
		const c = this.current;
		if (c < 0) return;
		this.finishSub(c, gradeFromError(Math.abs(this.ratioOf(c) - this.targetRatio) / this.tolerance));
	}
	draw(ctx, w, h, u) {
		const T = this.T, c = this.current, cx = this.target.x, cy = this.target.y, r0 = 95 * u, now = performance.now() / 1000;
		const near = c >= 0 && Math.abs(this.ratioOf(c) - this.targetRatio) <= this.tolerance;
		bullseye(ctx, cx, cy, r0 * this.targetRatio, r0 * this.tolerance, T, near, now);
		if (c >= 0) {
			const r = Math.max(2, r0 * this.ratioOf(c));
			ctx.save(); if (near) { ctx.shadowColor = T.accent; ctx.shadowBlur = 14 * u; }
			ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.lineWidth = 11 * u; ctx.strokeStyle = INK; ctx.stroke();
			ctx.lineWidth = 6 * u; ctx.strokeStyle = near ? T.accent : "#ffffff"; ctx.stroke(); ctx.restore();
		}
		const pip = 17 * u, gp = 16 * u, total = this.count * (pip * 2 + gp) - gp, p = place(this, w, h, u, total, pip * 2.2); bubble(ctx, this, p, u);
		for (let i = 0; i < this.count; i++) {
			const g = this.results[i], px = p.x - total / 2 + pip + i * (pip * 2 + gp);
			let s = pip; if (g !== undefined && this.doneAt && this.doneAt[i] !== undefined) s = pip * (1 + 0.5 * Math.sin(Math.PI * clamp01((this.t - this.doneAt[i]) / 0.3)));
			starPath(ctx, px, p.y, s, s * 0.48, 5, g === undefined ? 0 : (this.t * 0.6));
			sticker(ctx, g === undefined ? "#e3dcef" : GRADE_COLORS[g], 1.6 * u);
		}
		return "ENTER ON EVERY HIT!";
	}
}

// Crosshair that tightens onto the enemy (gunners).
class CrosshairChallenge extends RingChallenge {
	constructor(def, theme) { super(def, theme); this.targetRatio = 0.3; }
	draw(ctx, w, h, u) {
		const T = this.T, cx = this.target.x, cy = this.target.y, r0 = 95 * u, now = performance.now() / 1000;
		const near = this.running && this.grade === null && Math.abs(this.ratio - this.targetRatio) <= this.tolerance;
		bullseye(ctx, cx, cy, r0 * this.targetRatio, r0 * this.tolerance, T, near, now);
		if (this.running && this.grade === null) {
			const r = Math.max(4, r0 * this.ratio);
			ctx.save(); ctx.lineCap = "round";
			if (near) { ctx.shadowColor = T.accent; ctx.shadowBlur = 16 * u; }
			ctx.translate(cx, cy);
			for (const [wd, col] of [[11 * u, INK], [5.5 * u, near ? T.accent : "#ffffff"]]) {
				ctx.lineWidth = wd; ctx.strokeStyle = col;
				ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
				ctx.beginPath();
				for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; ctx.moveTo(Math.cos(a) * (r + 16 * u), Math.sin(a) * (r + 16 * u)); ctx.lineTo(Math.cos(a) * (r * 0.45), Math.sin(a) * (r * 0.45)); }
				ctx.stroke();
			}
			ctx.restore();
		}
		return "FIRE WHEN LOCKED ON!";
	}
}

const TYPES = { timing: TimingChallenge, ring: RingChallenge, sequence: SequenceChallenge, mash: MashChallenge, hold: HoldChallenge, aim: AimChallenge, combo: ComboChallenge, crosshair: CrosshairChallenge };

function createChallenge(def, theme) {
	if (!def || def === true) def = { type: "timing" };
	const C = TYPES[def.type] || TimingChallenge;
	return new C(def, theme);
}

// ---------------------------------------------------------------- state
let qte = null; // { challenge, anim, last, statusOnly }
let damageMult = 1;
let inDamageEffect = null; // formula string of the damage effect being executed

// ---------------------------------------------------------------- helpers
function isHeroAction(battle) {
	return battle.user && battle.user.player && battle.user.player.kind === Common.CHARACTER_KIND.HERO &&
		!battle.forceAnAction;
}

function hasDamageEffect(content) {
	return content.getEffects().some(e => e.kind === Common.EFFECT_KIND.DAMAGES);
}

function nameOf(content) {
	try { return typeof content.name === "function" ? content.name() : String(content.name || ""); } catch (e) { return ""; }
}

// Per-skill tag, written in the database: Skills > Effects > add a "Script" effect containing a comment:
//   // qtb hold                      -> use the hold challenge
//   // qtb ring theme=fire tolerance=0.08
//   // qtb {"type":"sequence","length":5}
//   // qtb off                       -> no challenge for this skill
//   // qtb                           -> enable with the class/global default (useful for buffs)
// Returns undefined (no tag), false (off) or an object of overrides.
function parseTag(text) {
	const m = /\/\/\s*qtb\b([^\n\r]*)/i.exec(text || "");
	if (!m) return undefined;
	const rest = m[1].trim();
	if (rest === "") return {};
	if (/^(off|false|none|no)$/i.test(rest)) return false;
	if (rest[0] === "{") {
		try { return JSON.parse(rest); } catch (e) { console.warn("[QTB] bad JSON in skill tag:", rest); return {}; }
	}
	const out = {};
	for (const tok of rest.split(/\s+/)) {
		const i = tok.indexOf("=");
		if (i < 0) { out.type = tok; continue; }
		const k = tok.slice(0, i), v = tok.slice(i + 1);
		out[k] = v === "true" ? true : v === "false" ? false : v.indexOf(",") >= 0 ? v.split(",") : (isFinite(v) && v !== "" ? parseFloat(v) : v);
	}
	return out;
}

function tagOf(content) {
	try {
		for (const e of content.getEffects()) {
			if (e.kind === Common.EFFECT_KIND.SCRIPT && e.scriptFormula) {
				const t = parseTag(e.scriptFormula.getValue());
				if (t !== undefined) return t;
			}
		}
	} catch (err) { /* ignore */ }
	return undefined;
}

// First damage element of a skill (database ID) or null; used to pick a theme.
function elementOf(content) {
	try {
		for (const e of content.getEffects()) {
			if (e.kind === Common.EFFECT_KIND.DAMAGES && e.isDamageElement) return e.damageElementID.getValue();
		}
	} catch (err) { /* ignore */ }
	return null;
}

function themeFor(def, info) {
	if (def && def.theme) return def.theme;
	if (info.element !== null && info.element !== undefined && CONFIG.elementThemes[info.element]) return CONFIG.elementThemes[info.element];
	for (const rule of CONFIG.nameThemes) {
		try { if (new RegExp(rule.match, "i").test(info.name || "")) return rule.theme; } catch (e) { /* ignore */ }
	}
	return "plain";
}

// Screen position of a battler's head (falls back to a default spot).
function posOf(battler, w, h, fallbackX, fallbackY) {
	const p = battler && battler.damagePosition;
	if (p && isFinite(p.x) && isFinite(p.y) && p.x >= 0 && p.x <= w && p.y >= 0 && p.y <= h) return { x: p.x, y: p.y };
	return { x: fallbackX, y: fallbackY };
}

// Returns { skillId, hasDamage, element, name } or null when this action takes no challenge.
function describeAction(battle) {
	const K = Common.EFFECT_SPECIAL_ACTION_KIND;
	const fromContent = c => ({ skillId: c.id, hasDamage: hasDamageEffect(c), element: elementOf(c), name: nameOf(c), tag: tagOf(c), firstIsDamage: c.getEffects()[0] && c.getEffects()[0].kind === Common.EFFECT_KIND.DAMAGES });
	try {
		switch (battle.battleCommandKind) {
			case K.APPLY_WEAPONS:
				{
				let tag;
				try { tag = tagOf(Data.Skills.get(1)); } catch (e) { /* ignore */ }
				return { skillId: 1, hasDamage: true, element: null, name: "", tag, firstIsDamage: true };
			}
			case K.OPEN_SKILLS:
				return fromContent(battle.battleStartTurn.active
					? battle.currentSkill
					: battle.windowChoicesSkills.getCurrentContent().system);
			case K.NONE:
				return fromContent(battle.windowChoicesBattleCommands.getContent(battle.user.lastCommandIndex).system);
		}
	} catch (e) {
		console.warn("[QTB] could not resolve action", e);
	}
	return null;
}

// ---------------------------------------------------------------- hooks
const BA = Scene.BattleAnimation.prototype;
const origInitialize = BA.initialize;

// Ranged heroes never run up to the enemy, even when the skill has "Run on Attack" enabled.
// Parameters "Ranged Hero 1".."Ranged Hero 8": set each one to a Variable (the one holding that hero's ID, e.g.
// "001 Lucas ID"), a Hero, or a plain hero ID. They are read at battle time, so variables are always current.
function isRangedHero(battle) {
	const DVK = Common.DYNAMIC_VALUE_KIND || { NONE: 0, VARIABLE: 4 };
	try {
		const u = battle.user, pl = u && u.player;
		if (!pl || pl.kind !== Common.CHARACTER_KIND.HERO) return false;
		for (let i = 1; i <= 8; i++) {
			const dv = Manager.Plugins.getParameters(pluginName)["Ranged Hero " + i];
			// Never evaluate an unset variable slot: the engine pops up an error for variable 0.
			if (!dv || dv.kind === DVK.NONE || (dv.kind === DVK.VARIABLE && !(Number(dv.value) > 0))) continue;
			const v = Number(param("Ranged Hero " + i, 0));
			if (CONFIG.debug) dbg("ranged slot", i, "=", v, "hero id", pl.id, "instance id", pl.instid);
			if (isFinite(v) && v > 0 && (v === Number(pl.instid) || v === Number(pl.id))) return true; // variables usually hold the instance ID
		}
	} catch (e) { /* ignore */ }
	return false;
}
function callInitialize(ba) {
	if (!enabled || !isRangedHero(ba.battle)) return origInitialize.call(ba);
	blog("ranged hero: no run-up", { hero: ba.battle.user.player.name || ba.battle.user.player.id });
	// Swallow the engine's runOnEnemy assignments for this one initialize so the run-up never starts.
	Object.defineProperty(ba, "runOnEnemy", { get: () => false, set: () => {}, configurable: true });
	try { return origInitialize.call(ba); }
	finally { delete ba.runOnEnemy; ba.runOnEnemy = false; }
}
const origUpdate = BA.update;
const origKeyPressed = BA.onKeyPressedStep;
const origKeyReleased = BA.onKeyReleasedStep;
const origDraw = BA.drawHUDStep;

BA.initialize = function () {
	damageMult = 1;
	qte = null;
	if (enabled && isHeroAction(this.battle)) {
		const info = describeAction(this.battle);
		if (info) {
			const player = this.battle.user.player;
			let classId = null;
			try { classId = player.getClass().id; } catch (e) { /* ignore */ }
			let def = resolveChallenge(player.id, classId, info.skillId, info.hasDamage);
			if (info.tag === false) def = false; // skill-level "off"
			else if (info.tag !== undefined) { // skill-level tag overrides the config
				const base = (def && def !== true) ? def : CONFIG.default;
				def = Object.assign({}, base, info.tag);
			}
			def = applyTier(def, tierOf(info.name));
			blog("hero action", { hero: player.name || player.id, skill: info.name || ("#" + info.skillId), skillId: info.skillId, element: info.element, challenge: def === false ? "off" : (def && def.type) || "default", theme: def ? themeFor(def, info) : null });
			if (def !== false && def !== undefined && def !== null) {
				clearFx();
				qte = {
					challenge: createChallenge(def, themeFor(def, info)),
					anim: this,
					last: performance.now(),
					active: false, // starts when the attacker reaches the frame before the slash
					statusOnly: !info.hasDamage || !info.firstIsDamage // result decides whether the effect lands
				};
				callInitialize(this); // run-up and wind-up frames play normally first
				return;
			}
		}
	}
	return callInitialize(this);
};

// Mirrors the engine's own Run-on-Enemy branch: apply the damage effects as soon as the user's
// attack frames / animation finish (the slash frame) instead of after the target animation.
function executeEarly(ba) {
	const b = ba.battle;
	b.currentEffectIndex++;
	for (let l = b.effects.length; b.currentEffectIndex < l; b.currentEffectIndex++) {
		const effect = b.effects[b.currentEffectIndex];
		effect.execute(true);
		if (!effect.canSkip && effect.isAnimated()) {
			if (effect.kind === Common.EFFECT_KIND.STATUS) b.currentTargetIndex = -1;
			break;
		}
	}
	ba.updateTargetsAttacked();
	for (const t of b.targets) t.timeDamage = 0;
}

// True when the attacker has played its wind-up frames and is about to show the slash frame.
function atSlashMoment(ba) {
	const b = ba.battle, u = b.user;
	if (!u || typeof u.isStepAttacking !== "function" || !u.frameAttacking) return true;
	const F = Data.Systems.FRAMES;
	if (b.subStep === 3) return false; // still running up
	if (b.subStep >= 1) return true; // missed it somehow: start now
	if (F <= 1 || !u.isStepAttacking()) return b.subStep === 0 && !u.isRunMoving;
	return u.frameAttacking.value >= F - 2;
}

BA.update = function () {
	if (qte && qte.anim === this) {
		const now = performance.now();
		if (!qte.active) {
			if (atSlashMoment(this)) {
				qte.active = true;
				qte.last = now;
				qte.challenge.hintAlpha = hintAlphaFor((qte.challenge.def && qte.challenge.def.type) || "timing");
				const fa = this.battle.user && this.battle.user.frameAttacking;
				if (fa) {
					qte.frame = fa;
					qte.frameUpdate = fa.update;
					fa.update = () => false; // hold the wind-up pose while the popup runs
				}
			}
		}
		let justReleased = false;
		if (qte.active) {
			const dt = Math.min(0.1, (now - qte.last) / 1000);
			qte.last = now;
			const cv = Common.Platform.canvasHUD, ch = qte.challenge;
			{ // follow the battlers smoothly: the camera pans during attacks, but raw positions are noisy
				const k = ch.latched ? 1 - Math.exp(-dt * 7) : 1, dy = cv.height * 0.045;
				const sm = (cur, raw) => cur && ch.latched ? { x: cur.x + (raw.x - cur.x) * k, y: cur.y + (raw.y - cur.y) * k } : { x: raw.x, y: raw.y };
				const tl = this.battle.targets || [];
				const raws = tl.map(t => { const p = posOf(t, cv.width, cv.height, cv.width / 2, cv.height * 0.35); return { x: p.x, y: p.y + dy }; });
				if (!raws.length) raws.push({ x: cv.width / 2, y: cv.height * 0.35 + dy });
				ch.targets = tl.length ? raws.map((r, i) => sm(ch.targets && ch.targets[i], r)) : [];
				ch.target = sm(ch.target && ch.latched ? ch.target : null, raws[0]);
				ch.origin = sm(ch.latched ? ch.origin : null, posOf(this.battle.user, cv.width, cv.height, cv.width * 0.8, cv.height * 0.5));
				ch.latched = true;
			}
			updateScales();
			ch.tick(dt);
			fxUpdate(dt);
			Manager.Stack.requestPaintHUD = true;
			if (ch.grade !== null && !qte.released) {
				// The moment the challenge resolves, the slash frame plays and damage lands; the grade
				// popup keeps showing over the rest of the animation.
				qte.released = true;
				justReleased = true;
				if (qte.frame) {
					qte.frame.update = qte.frameUpdate;
					try { // show the slash frame right now, not a frame-duration later
						const F = Data.Systems.FRAMES;
						qte.frame.value = F - 1; qte.frame.tick = 0;
						this.battle.user.updateUVs();
					} catch (e) { /* ignore */ }
				}
				applyGrade(this.battle, ch.grade, qte.statusOnly);
				qte.hitUntil = now + [0, 40, 60, 85, 120][ch.grade] * CONFIG.freezeScale;
			}
			if (ch.finished) { qte = null; clearFx(); }
			else if (!qte.released) return; // still frozen on the wind-up frame
			else if (!justReleased && qte && qte.hitUntil && now < qte.hitUntil) return; // impact freeze
		}
	}
	const before = this.battle.subStep, ceiBefore = this.battle.currentEffectIndex;
	const r = origUpdate.call(this);
	const nowMs = performance.now();
	if (ceiBefore < 0 && this.battle.currentEffectIndex >= 0 && before !== 2 && !this._earlyAt) this._earlyAt = nowMs; // engine applied damage early (Run on Enemy)
	if (CONFIG.impactTiming && before === 0 && this.battle.subStep === 1 && !this.runOnEnemy && isHeroAction(this.battle)) {
		try { executeEarly(this); this._earlyAt = nowMs; } catch (e) { console.error("[QTB] early damage failed", e); }
	}
	// Damage landed early, so keep the numbers on screen for the usual time before the turn moves on.
	if (before !== 2 && this.battle.subStep === 2 && this._earlyAt) {
		// The engine only draws the numbers once the target animation is over (unless Run on Enemy), so
		// in that case the linger clock starts now.
		const hiddenUntilAnimEnds = !this.runOnEnemy && this.battle.animationTarget;
		const left = hiddenUntilAnimEnds ? CONFIG.lingerMs : Math.max(0, CONFIG.lingerMs - (nowMs - this._earlyAt));
		this.battle.time = Date.now() - Scene.Battle.TIME_ACTION_ANIMATION + left;
		this._earlyAt = null;
	}
	return r;
};

BA.onKeyPressedStep = function (key) {
	if (qte && qte.anim === this && qte.active && !qte.released) {
		qte.challenge.onKey(key);
		return;
	}
	defensePress(key, this.battle, this);
	return origKeyPressed.call(this, key);
};

BA.onKeyReleasedStep = function (key) {
	if (qte && qte.anim === this && qte.active && !qte.released) {
		qte.challenge.onKeyUp(key);
		return;
	}
	return origKeyReleased.call(this, key);
};

// Early hit during the target animation: the engine hides the numbers until the animation ends, so
// draw them ourselves right away.
function drawEarlyDamages(ba) {
	try {
		if (ba._earlyAt && !ba.runOnEnemy && ba.battle.animationTarget && ba.battle.subStep === 1) {
			for (const t of ba.battle.targets) if (t.damages !== null && t.damages !== undefined) t.drawDamages();
		}
	} catch (e) { /* ignore */ }
}

BA.drawHUDStep = function () {
	if (qte && qte.anim === this && qte.active) {
		origDraw.call(this);
		drawEarlyDamages(this);
		drawOverlay(qte.challenge);
		drawNotices();
		return;
	}
	const r = origDraw.call(this);
	drawEarlyDamages(this);
	drawNotices();
	return r;
};

function applyGrade(battle, grade, statusOnly) {
	blog("challenge result", { grade: CONFIG.labels[grade], multiplier: CONFIG.multipliers[grade], statusOnly });
	damageMult = CONFIG.multipliers[grade];
	if (grade === 0 && CONFIG.failMiss) {
		for (const t of battle.targets) t.tempIsDamagesMiss = true;
	} else if (statusOnly) {
		for (const t of battle.targets) t.tempIsDamagesMiss = false; // success guarantees the effect lands
	}
	if (grade === 4 && CONFIG.perfectCrit) {
		for (const t of battle.targets) t.tempIsDamagesCritical = true;
	}
}

// Scale the main damage/heal formula result (heals are negative, so magnitude scales too).
const EffectProto = Model.Effect.prototype;
const origExecuteDamages = EffectProto.executeDamages;
const origEvaluate = Common.Interpreter.evaluate;

EffectProto.executeDamages = function (user) {
	tryEvade();
	inDamageEffect = this.damageFormula ? this.damageFormula.getValue() : null;
	// The engine only honours a forced miss when the effect has "precision" enabled; force it on.
	let forced = false, savedPrecision = null;
	try {
		const targets = (Scene.Map.current && Scene.Map.current.targets) || [];
		if (!this.isDamagePrecision && targets.some(t => t.tempIsDamagesMiss === true)) {
			forced = true;
			savedPrecision = this.damagePrecisionFormula;
			this.isDamagePrecision = true;
			this.damagePrecisionFormula = { getValue: () => "0" };
		}
	} catch (e) { /* ignore */ }
	try {
		return origExecuteDamages.call(this, user);
	} finally {
		inDamageEffect = null;
		if (forced) { this.isDamagePrecision = false; this.damagePrecisionFormula = savedPrecision; }
		try { dodgeMissed(user); } catch (e) { dbg("dodgeMissed failed", e); }
	}
};

// A hero's attack that misses (by the engine's own math, or a forced miss) makes the enemy sidestep like a dodging hero.
function dodgeMissed(user) {
	if (!enabled || !CONFIG.defense.enabled || !user || !user.player || user.player.kind !== Common.CHARACTER_KIND.HERO) return;
	const map = Scene.Map.current, targets = (map && map.targets) || [];
	const missed = targets.filter(t => t.player && t.player.kind === Common.CHARACTER_KIND.MONSTER && (t.isDamagesMiss === true || t.tempIsDamagesMiss === true));
	if (CONFIG.debug && targets[0]) dbg("target flags", Object.keys(targets[0]).filter(k => /miss|crit|damage/i.test(k)).map(k => k + "=" + targets[0][k]));
	if (!missed.length) return;
	blog("attack missed, enemy dodges", { n: missed.length });
	startSlides(missed, -1);
}

Common.Interpreter.evaluate = function (formula, options) {
	const result = origEvaluate.call(this, formula, options);
	if (damageMult !== 1 && inDamageEffect !== null && formula === inDamageEffect &&
		typeof result === "number" && result !== 0) {
		return result * damageMult;
	}
	return result;
};


// ---------------------------------------------------------------- defense (evade enemy attacks)
// No on-screen prompt: press any WASD/Enter key shortly before an enemy's hit lands and the targeted
// heroes sidestep and the hit misses. A press that is too early (or late) does nothing at all.
// Status effects are never evaded. Impact time is predicted from the attacker's sprite frames.
let evade = { armedUntil: 0, lockUntil: 0 };
let slides = []; // { b, baseX, baseZ, dx, dz, t, dur, wasRun }
let lateMark = null; // last unevaded enemy hit: { t, battlers }
let notices = []; // floating "LATE!" style labels: { text, x, y, t, color }
function addNotice(text, battlers, color) {
	const cv = Common.Platform.canvasHUD;
	for (const b of battlers) { const p = posOf(b, cv.width, cv.height, -1, -1); if (p.x >= 0) notices.push({ text, x: p.x, y: p.y, t: 0, color }); }
	Manager.Stack.requestPaintHUD = true;
}
function drawNotices() {
	if (!notices.length) return;
	const cv = Common.Platform.canvasHUD, px = CONFIG.uiStyle === "pixel", ctx = px ? pixelCtx(cv.width, cv.height) : Common.Platform.ctx, u = (cv.height / 480) * 0.55 * CONFIG.uiScale;
	ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
	for (const n of notices) {
		const k = Math.min(1, n.t / 0.9), pop = ease.outBack(clamp01(n.t / 0.2));
		ctx.globalAlpha = k < 0.6 ? 1 : Math.max(0, 1 - (k - 0.6) / 0.4);
		ctx.save(); ctx.translate(n.x, n.y - 50 * u - 26 * u * ease.outQuad(k)); ctx.rotate(-0.06); ctx.scale(pop, pop);
		ctx.font = "900 italic " + 24 * u + "px 'Trebuchet MS','Arial Black',sans-serif";
		ctx.lineWidth = 8 * u; ctx.strokeStyle = INK; ctx.strokeText(n.text, 0, 0);
		ctx.lineWidth = 4 * u; ctx.strokeStyle = "#ffffff"; ctx.strokeText(n.text, 0, 0);
		ctx.fillStyle = n.color; ctx.fillText(n.text, 0, 0);
		ctx.restore();
	}
	ctx.restore();
	if (px) pixelFlush(Common.Platform.ctx, cv.width, cv.height);
}
function isEnemyHittingHeroes(battle) {
	return battle && battle.user && battle.user.player && battle.user.player.kind === Common.CHARACTER_KIND.MONSTER;
}

// Engine animation frames advance about every 33 ms in practice (log: predicted 367 ms, real ~760 ms at 16.7 ms/frame).
const ANIM_FRAME_MS = 1000 / 30;

// Milliseconds until the attacker's damage effect applies, or null when unknown.
function etaImpact(battle, ba) {
	try {
		const u = battle.user, F = Data.Systems.FRAMES;
		const attackMs = () => {
			if (!u.isStepAttacking() && ba.pendingBattlerStep === undefined) return 0;
			const left = Math.max(0, F - 1 - u.frameAttacking.value);
			return left * u.frameAttacking.duration - u.frameAttacking.tick;
		};
		const animMs = () => {
			const an = battle.animationUser;
			if (!an || !an.model) return 0;
			return Math.max(0, an.model.maxFrameID - an.frame + 1) * ANIM_FRAME_MS;
		};
		switch (battle.subStep) {
			case 3: {
				const run = Math.max(0, Core.Battler.TIME_RUN - (Date.now() - u.timerRunMove));
				return run + Math.max(attackMs(), animMs());
			}
			case 0: return Math.max(attackMs(), animMs());
			case 1: { // target animation still playing; damage applies when it ends
				if (CONFIG.impactTiming && isHeroAction(battle)) return -1;
				const an = battle.animationTarget;
				if (!an || !an.model) return 0;
				return Math.max(0, an.model.maxFrameID - an.frame + 1) * ANIM_FRAME_MS;
			}
			case 2: return Math.max(0, Scene.Battle.TIME_ACTION_ANIMATION - (Date.now() - battle.time));
		}
	} catch (e) { dbg("eta failed", e); }
	return null;
}

function defensePress(key, battle, ba) {
	const D = CONFIG.defense;
	if (!enabled || !D.enabled || D.keys.indexOf(key) < 0 || !isEnemyHittingHeroes(battle)) return;
	if (!battle.effects || !battle.effects.some(e => e.kind === Common.EFFECT_KIND.DAMAGES)) return;
	const now = performance.now();
	if (lateMark && now - lateMark.t < 600) { // pressed just after the hit landed
		addNotice("LATE!", lateMark.battlers, "#ffb02e"); lateMark = null;
		evade.lockUntil = now + D.cooldown * 1000;
		return;
	}
	if (now < evade.lockUntil) return; // anti-mash cooldown
	evade.lockUntil = now + D.cooldown * 1000;
	const eta = etaImpact(battle, ba), win = (D.windowFrames / 60) * 1000;
	blog("defense press", { key, subStep: battle.subStep, etaMs: eta === null ? null : Math.round(eta), windowMs: Math.round(win), result: eta !== null && eta >= 0 && eta <= win ? "EVADE ARMED" : (eta !== null && eta > win ? "too early" : "too late/unknown") });
	if (eta === null || eta < 0 || eta > win) return; // mistimed: no slide, no evade
	evade.armedUntil = now + eta * 1.5 + 300;
	const heroes = (battle.targets || []).filter(t => t.player && t.player.kind === Common.CHARACTER_KIND.HERO);
	startSlides(heroes);
	noise(0.18, 0.7, 1800, 0, "bandpass");
	tone(500, 0.12, "sine", 0.5, 900);
}

// Called when a damage effect is about to apply.
function tryEvade() {
	const D = CONFIG.defense;
	if (!enabled || !D.enabled) return;
	if (performance.now() > evade.armedUntil) {
		if (isEnemyHittingHeroes(Scene.Map.current)) {
			blog("enemy hit lands, no evade armed");
			lateMark = { t: performance.now(), battlers: (Scene.Map.current.targets || []).filter(b => b.player && b.player.kind === Common.CHARACTER_KIND.HERO) };
		}
		return;
	}
	const map = Scene.Map.current;
	if (!map || !map.targets || !isEnemyHittingHeroes(map)) return;
	let any = false;
	for (const b of map.targets) {
		if (b.player && b.player.kind === Common.CHARACTER_KIND.HERO) { b.tempIsDamagesMiss = true; any = true; }
	}
	if (any) {
		blog("enemy hit EVADED");
		evade.armedUntil = 0;
		tone(1320, 0.1, "triangle", 0.8); tone(1760, 0.16, "sine", 0.8, null, 0.07);
	}
}

function startSlides(battlers, dir) {
	const D = CONFIG.defense;
	let rx = 1, rz = 0;
	try { // screen-right direction in world space
		const cam = Scene.Map.current.camera.getThreeCamera();
		cam.updateMatrixWorld(true);
		const e = cam.matrixWorld.elements, len = Math.hypot(e[0], e[2]) || 1;
		rx = e[0] / len; rz = e[2] / len;
	} catch (err) { /* ignore */ }
	const amp = Core.Battler.OFFSET_SELECTED * D.slide * (dir || 1);
	for (const b of battlers) {
		slides = slides.filter(s => s.b !== b);
		slides.push({ b, baseX: b.mesh.position.x, baseZ: b.mesh.position.z, dx: rx * amp, dz: rz * amp, t: 0, dur: D.duration, wasRun: b.isAtRunPosition });
		b.isAtRunPosition = true; // stops the battler's own idle positioning from fighting the slide
	}
}

function setBattlerPos(b, x, z) {
	b.mesh.position.setX(x); b.mesh.position.setZ(z);
	b.upPosition.setX(x); b.upPosition.setZ(z);
	b.halfPosition.setX(x); b.halfPosition.setZ(z);
	b.updatePositions();
}

// Offset (0..1) over progress p: out to the right quickly, then glide back forward.
function slideOffset(p) {
	if (p >= 1) return 0;
	if (p < 0.4) { const k = p / 0.4; return 1 - (1 - k) * (1 - k); }
	const k = (p - 0.4) / 0.6;
	return 1 - k * k * (3 - 2 * k);
}

function tickSlides(dt) {
	if (notices.length) { for (const n of notices) n.t += dt; notices = notices.filter(n => n.t < 0.9); Manager.Stack.requestPaintHUD = true; }
	if (!slides.length) return;
	for (const sl of slides) {
		sl.t += dt;
		const p = Math.min(1, sl.t / sl.dur), off = slideOffset(p);
		setBattlerPos(sl.b, sl.baseX + sl.dx * off, sl.baseZ + sl.dz * off);
		if (p >= 1) sl.b.isAtRunPosition = sl.wasRun;
	}
	slides = slides.filter(s => s.t < s.dur);
	Manager.Stack.requestPaintHUD = true;
}

let lastSlideTick = performance.now();
const origBattleUpdate = Scene.Battle.prototype.update;
Scene.Battle.prototype.update = function () {
	const r = origBattleUpdate.apply(this, arguments);
	const now = performance.now();
	flushLog(false);
	tickSlides(Math.min(0.1, (now - lastSlideTick) / 1000));
	lastSlideTick = now;
	return r;
};

// ---------------------------------------------------------------- drawing
function drawOverlay(c) {
	const canvas = Common.Platform.canvasHUD, w = canvas.width, h = canvas.height;
	if (CONFIG.uiStyle === "pixel") {
		const ctx = pixelCtx(w, h);
		renderOverlay(ctx, c, w, h);
		pixelFlush(Common.Platform.ctx, w, h);
	} else renderOverlay(Common.Platform.ctx, c, w, h);
}
function renderOverlay(ctx, c, w, h) {
	const u = (h / 480) * 0.55 * CONFIG.uiScale;
	ctx.save();
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	updateScales();
	uiU = u;
	const nowMs = performance.now();
	c.themeName = c.theme;
	c.beat = CONFIG.beatPulse && c.grade === null && c.running ? Math.max(0, 1 - (nowMs - beatAt) / 160) : 0;
	c.panel = null;
	// Pop in at the start, shrink away after the result; pivot is the hero's head so the bubble grows from it.
	const popIn = ease.outBack(clamp01(c.t / 0.22)), popOut = c.grade !== null ? 1 - ease.inQuad(clamp01((c.resultT - 0.35) / 0.25)) : 1;
	const anchored = c instanceof CrosshairChallenge || c instanceof ComboChallenge || c instanceof AimChallenge; // reticles sit on the enemy: never scale them
	const sc = anchored ? 1 : Math.max(0.001, popIn * popOut);
	const piv = c.lastPanel ? { x: c.lastPanel.x, y: c.lastPanel.bottom } : { x: c.origin.x, y: c.origin.y - 30 * u };
	ctx.save();
	ctx.translate(piv.x, piv.y); ctx.scale(sc, sc); ctx.translate(-piv.x, -piv.y);
	const hint = c.draw(ctx, w, h, u);
	ctx.restore();
	fxDraw(ctx, w, h);
	const p = c.panel;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	if (c.running && c.grade === null && hint && c.hintAlpha > 0 && p) {
		ctx.globalAlpha = c.hintAlpha * clamp01((c.t - LEAD_IN) / 0.15);
		ctx.font = "900 " + 15 * u + "px 'Trebuchet MS','Arial Black',sans-serif";
		ctx.lineJoin = "round"; ctx.lineWidth = 5 * u; ctx.strokeStyle = INK;
		const hy = p.top - 34 * u;
		ctx.strokeText(hint, p.x, hy); ctx.fillStyle = "#ffffff"; ctx.fillText(hint, p.x, hy);
		ctx.globalAlpha = 1;
	}
	if (c.grade !== null) {
		const lp = c.lastPanel || p;
		drawGrade(ctx, c, lp ? lp.x : w / 2, (lp ? lp.top : h * 0.6) - 8 * u, u);
	}
	if (p) c.lastPanel = p;
	ctx.restore();
}

// ---------------------------------------------------------------- commands
Manager.Plugins.registerCommand(pluginName, "Set enabled", (value) => {
	enabled = !!value;
});

CONFIG = loadConfig();
