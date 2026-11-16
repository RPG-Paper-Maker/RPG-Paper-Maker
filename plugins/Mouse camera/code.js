const pluginName = 'Mouse camera';

// Reads a numeric plugin parameter, falls back to a default value if anything is wrong.
function readParam(name, fallback) {
	try {
		let v = Manager.Plugins.getParameter(pluginName, name);
		if (v && typeof v === 'object' && typeof v.getValue === 'function') v = v.getValue();
		v = Number(v);
		return Number.isNaN(v) ? fallback : v;
	} catch (e) {
		return fallback;
	}
}

// --- Rotation ---
const autoStart = readParam('Enable on start', 1) !== 0;
const sensitivity = Math.max(1, readParam('Sensitivity', 100)) / 100;
const smoothing = Math.min(90, Math.max(0, readParam('Rotation smoothing', 30))) / 100;
const invertX = readParam('Invert horizontal', 0) !== 0;
const invertY = readParam('Invert vertical', 0) !== 0;
const minAngle = readParam('Min vertical angle', 5);
const maxAngle = readParam('Max vertical angle', 75);
const startAngle = readParam('Start vertical angle', 35);

// --- Wheel zoom (changes the camera zoom, the camera itself is not moved) ---
const zoomSpeed = Math.max(1, readParam('Zoom speed', 5)) / 100;
const zoomIn = Math.max(100, readParam('Max zoom in', 150)) / 100;
const zoomOut = Math.min(100, Math.max(20, readParam('Max zoom out', 70))) / 100;
let wheelZoom = readParam('Wheel zoom', 1) !== 0;

// --- Experimental: moving the camera itself (can fight with the engine camera) ---
const keepInside = readParam('Keep camera inside map', 0) !== 0;
const edgeMargin = Math.max(0, readParam('Map edge margin', 0));
let avoidObstacles = readParam('Avoid obstacles', 0) !== 0;

const DEGREES_PER_PIXEL = 0.15;

let enabled = autoStart;
let pendingX = 0;
let pendingY = 0;
let rotationHooked = false;
let zoomGoal = 1;
let zoomCurrent = 1;

function isOnMap() {
	try {
		return Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading;
	} catch (e) {
		return false;
	}
}

function lockPointer() {
	try {
		const result = document.body.requestPointerLock();
		if (result && typeof result.catch === 'function') result.catch(() => {});
	} catch (e) {}
}

function unlockPointer() {
	try {
		if (document.pointerLockElement) document.exitPointerLock();
	} catch (e) {}
}

function clampAngle(v) {
	return Math.min(maxAngle, Math.max(minAngle, v));
}

function clampZoom(v) {
	return Math.min(zoomIn, Math.max(zoomOut, v));
}

// ---------------------------------------------------------------------------
// Mouse rotation
// ---------------------------------------------------------------------------

// Turns the collected mouse movement into camera rotation. Called once per frame.
function applyRotation(map) {
	const camera = map && map.camera;
	if (!camera) return;
	if (!enabled || !document.pointerLockElement || Core.ReactionInterpreter.blockingHero) {
		pendingX = 0;
		pendingY = 0;
		return;
	}
	if (pendingX === 0 && pendingY === 0) return;
	const take = 1 - smoothing;
	let sx = pendingX * take;
	let sy = pendingY * take;
	if (Math.abs(pendingX) < 0.5) sx = pendingX;
	if (Math.abs(pendingY) < 0.5) sy = pendingY;
	pendingX -= sx;
	pendingY -= sy;
	const dx = (invertX ? -1 : 1) * sx * DEGREES_PER_PIXEL * sensitivity;
	const dy = (invertY ? -1 : 1) * sy * DEGREES_PER_PIXEL * sensitivity;
	camera.horizontalAngle += dx;
	camera.verticalAngle = clampAngle(camera.verticalAngle + dy);
}

// The first click on the map grabs the mouse (browsers require a click to do this).
document.addEventListener('mousedown', () => {
	if (enabled && !document.pointerLockElement && isOnMap()) lockPointer();
});

// While the mouse is grabbed, mouse movement is collected here and used once per frame.
document.addEventListener('mousemove', (e) => {
	if (!enabled || !document.pointerLockElement || !isOnMap()) return;
	if (rotationHooked) {
		pendingX += e.movementX;
		pendingY += e.movementY;
	} else {
		// Could not hook into the map: rotate right away.
		pendingX = e.movementX;
		pendingY = e.movementY;
		applyRotationNow(Scene.Map.current);
	}
});

function applyRotationNow(map) {
	const camera = map && map.camera;
	if (!camera) return;
	const dx = (invertX ? -1 : 1) * pendingX * DEGREES_PER_PIXEL * sensitivity;
	const dy = (invertY ? -1 : 1) * pendingY * DEGREES_PER_PIXEL * sensitivity;
	pendingX = 0;
	pendingY = 0;
	camera.horizontalAngle += dx;
	camera.verticalAngle = clampAngle(camera.verticalAngle + dy);
}

// The wheel gently zooms in and out.
document.addEventListener(
	'wheel',
	(e) => {
		if (!wheelZoom || !isOnMap()) return;
		if (Core.ReactionInterpreter.blockingHero) return;
		const amount = Math.min(1, Math.abs(e.deltaY) / 100);
		// wheel up = zoom in, wheel down = zoom out
		zoomGoal = clampZoom(zoomGoal - Math.sign(e.deltaY) * zoomSpeed * amount);
	},
	{ passive: true },
);

// Give the mouse back when leaving the map (menus, battles) or when the plugin is disabled.
setInterval(() => {
	if (document.pointerLockElement && (!enabled || !isOnMap())) unlockPointer();
}, 200);

// ---------------------------------------------------------------------------
// Start angle and zoom (right before the map is drawn)
// ---------------------------------------------------------------------------

const raycaster = new THREE.Raycaster();
const origin = new THREE.Vector3();
const dir = new THREE.Vector3();

const state = {
	map: null,
	mapId: null,
	frame: 0,
	errors: 0,
	raw: 0, // distance the engine put the camera at
	factor: 1, // 1 = engine distance, less = pulled closer
	obstacle: 1,
	clear: 0,
	applied: null,
};

function applyZoom(threeCam) {
	zoomCurrent += (zoomGoal - zoomCurrent) * 0.2;
	if (Math.abs(zoomGoal - zoomCurrent) < 0.001) zoomCurrent = zoomGoal;
	if (Math.abs(threeCam.zoom - zoomCurrent) > 0.0005) {
		threeCam.zoom = zoomCurrent;
		threeCam.updateProjectionMatrix();
	}
}

// ---------------------------------------------------------------------------
// Experimental: keep the camera inside the map / in front of obstacles
// ---------------------------------------------------------------------------

function isBlocking(hit) {
	const o = hit.object;
	if (!o || o.visible === false) return false;
	if (o.isLine || o.isPoints || o.isSprite) return false;
	const m = o.material;
	if (m && !Array.isArray(m) && (m.visible === false || (m.transparent && m.opacity === 0))) return false;
	return true;
}

function distanceToMapEdge(map, target, s) {
	if (!keepInside) return Infinity;
	const mp = map.mapProperties;
	if (!mp || !(mp.length > 0) || !(mp.width > 0)) return Infinity;
	const m = edgeMargin * s;
	let t = Infinity;
	if (dir.x > 1e-6) t = Math.min(t, (mp.length * s + m - target.x) / dir.x);
	else if (dir.x < -1e-6) t = Math.min(t, (-m - target.x) / dir.x);
	if (dir.z > 1e-6) t = Math.min(t, (mp.width * s + m - target.z) / dir.z);
	else if (dir.z < -1e-6) t = Math.min(t, (-m - target.z) / dir.z);
	return Math.max(0, t);
}

function adjustPosition(map, camera, threeCam) {
	const target = camera.targetPosition;
	if (!target) return;
	dir.copy(threeCam.position).sub(target);
	const measured = dir.length();
	if (measured < 0.001) return;
	dir.divideScalar(measured);
	if (state.applied === null || Math.abs(measured - state.applied) > 0.01) state.raw = measured;

	const s = Data.Systems.SQUARE_SIZE;
	const wanted = state.raw;
	const minRatio = Math.min(1, (s * 1.5) / wanted);

	if (avoidObstacles) {
		state.frame++;
		if (state.frame % 2 === 0) {
			const startOffset = s * 0.6;
			origin.copy(target).addScaledVector(dir, startOffset);
			raycaster.camera = threeCam;
			raycaster.near = 0;
			raycaster.far = Math.max(0.001, wanted - startOffset);
			raycaster.set(origin, dir);
			const hits = raycaster.intersectObjects(map.scene.children, true);
			let free = wanted;
			for (let i = 0; i < hits.length; i++) {
				if (hits[i].distance > 0.01 && isBlocking(hits[i])) {
					free = startOffset + hits[i].distance - s * 0.4;
					break;
				}
			}
			const ratio = Math.min(1, Math.max(minRatio, free / wanted));
			if (ratio <= state.obstacle + 0.02) {
				state.obstacle = ratio;
				state.clear = 0;
			} else if (++state.clear >= 6) {
				state.obstacle = ratio;
				state.clear = 0;
			}
		}
	} else {
		state.obstacle = 1;
	}

	const edgeRatio = Math.min(1, Math.max(minRatio, distanceToMapEdge(map, target, s) / wanted));
	const goal = Math.min(state.obstacle, edgeRatio);
	state.factor += (goal - state.factor) * (goal < state.factor ? 0.35 : 0.05);
	if (Math.abs(goal - state.factor) < 0.002) state.factor = goal;
	state.factor = Math.min(state.factor, edgeRatio);

	const distance = wanted * state.factor;
	threeCam.position.copy(target).addScaledVector(dir, distance);
	state.applied = distance;
}

function updateCamera(map) {
	if (!map || map.loading) return;
	const camera = map.camera;
	if (!camera) return;

	// New map: apply the start angle once.
	if (state.map !== map || state.mapId !== map.id) {
		state.map = map;
		state.mapId = map.id;
		state.frame = 0;
		state.applied = null;
		state.factor = 1;
		state.obstacle = 1;
		state.clear = 0;
		if (startAngle > 0) camera.verticalAngle = clampAngle(startAngle);
	}

	const threeCam = camera.getThreeCamera();
	if (!threeCam) return;
	applyZoom(threeCam);
	if (avoidObstacles || keepInside) adjustPosition(map, camera, threeCam);
}

function safe(fn, map) {
	try {
		fn(map);
	} catch (e) {
		state.errors++;
		console.warn('Mouse camera: error', e);
		if (state.errors >= 3) {
			avoidObstacles = false;
			console.warn('Mouse camera: experimental camera features switched off after repeated errors');
		}
	}
}

// Wraps a method of the map scene: "before" runs first, then the original, then "after".
function wrap(name, before, after) {
	const proto = Scene.Map.prototype;
	const original = proto[name];
	if (typeof original !== 'function') throw new Error('Scene.Map has no ' + name);
	proto[name] = function (...args) {
		if (before) safe(before, this);
		const result = original.apply(this, args);
		if (after) safe(after, this);
		return result;
	};
}

function installHooks() {
	try {
		// Rotation is applied once per frame, right before the engine updates its camera.
		wrap('update', applyRotation, null);
		rotationHooked = true;
	} catch (e) {
		console.warn('Mouse camera: could not hook into the map update', e);
	}
	try {
		// Start angle / zoom happen right before drawing.
		if (typeof Scene.Map.prototype.draw3D === 'function') wrap('draw3D', updateCamera, null);
		else wrap('update', null, updateCamera);
	} catch (e) {
		console.warn('Mouse camera: could not hook into the map drawing', e);
	}
}

installHooks();

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

Manager.Plugins.registerCommand(pluginName, 'Enable mouse camera', () => {
	enabled = true;
	if (isOnMap()) lockPointer();
});

Manager.Plugins.registerCommand(pluginName, 'Disable mouse camera', () => {
	enabled = false;
	pendingX = 0;
	pendingY = 0;
	unlockPointer();
});

Manager.Plugins.registerCommand(pluginName, 'Enable wheel zoom', () => {
	wheelZoom = true;
});

Manager.Plugins.registerCommand(pluginName, 'Disable wheel zoom', () => {
	wheelZoom = false;
});
