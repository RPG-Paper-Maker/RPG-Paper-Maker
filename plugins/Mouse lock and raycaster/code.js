const pluginName = 'Mouse lock and raycaster';
const inject = Manager.Plugins.inject;

const onDownID = Manager.Plugins.getParameter(pluginName, 'Mouse down event ID');
const onUpID = Manager.Plugins.getParameter(pluginName, 'Mouse up event ID');
const onMoveID = Manager.Plugins.getParameter(pluginName, 'Mouse move event ID');
const onWheelID = Manager.Plugins.getParameter(pluginName, 'Mouse wheel event ID');

const raycaster = new THREE.Raycaster();
const va = new THREE.Vector3();
const vb = new THREE.Vector3();

function raycast(v, d) {
	Core.Game.current.variables[v] = -1;
	const intersects = raycaster.intersectObjects(Scene.Map.current.scene.children);
	var mesh = null;
	if (intersects.length > 0 && (d < 0 || intersects[0].distance < d)) {
		if (intersects[0].distance > 0) mesh = intersects[0].object;
		else if (intersects.length > 1) mesh = intersects[1].object;
	}
	if (!!mesh) {
		for (var i = 1; i < Scene.Map.current.maxObjectsID + 1; i++) {
			var exitFor = false;
			if (!Scene.Map.current.allObjects[i]) continue;
			Core.MapObject.search(
				i,
				(result) => {
					if (!!result.object.mesh && result.object.mesh === mesh) {
						Core.Game.current.variables[v] = i;
						exitFor = true;
					}
				},
				Core.ReactionInterpreter.currentObject
			);
			if (exitFor) break;
		}
	}
}

document.addEventListener('mousedown', (e) => {
	if (
		Manager.Stack.top instanceof Scene.Map &&
		!Scene.Map.current.loading &&
		!Core.ReactionInterpreter.blockingHero
	) {
		if (e.button === 0) Common.Inputs.mouseLeftPressed = true;
		else if (e.button === 2) Common.Inputs.mouseRightPressed = true;
		const x = System.DynamicValue.createNumber(e.clientX);
		const y = System.DynamicValue.createNumber(e.clientY);
		const b = System.DynamicValue.createNumber(e.button);
		Core.Game.current.hero.receiveEvent(null, false, onDownID, [null, x, y, b], Core.Game.current.heroStates);
	}
});

document.addEventListener('mouseup', (e) => {
	if (
		Manager.Stack.top instanceof Scene.Map &&
		!Scene.Map.current.loading &&
		!Core.ReactionInterpreter.blockingHero
	) {
		if (e.button === 0) Common.Inputs.mouseLeftPressed = false;
		else if (e.button === 2) Common.Inputs.mouseRightPressed = false;
		const x = System.DynamicValue.createNumber(e.clientX);
		const y = System.DynamicValue.createNumber(e.clientY);
		const b = System.DynamicValue.createNumber(e.button);
		Core.Game.current.hero.receiveEvent(null, false, onUpID, [null, x, y, b], Core.Game.current.heroStates);
	}
});

document.addEventListener('mousemove', (e) => {
	if (
		Manager.Stack.top instanceof Scene.Map &&
		!Scene.Map.current.loading &&
		!Core.ReactionInterpreter.blockingHero
	) {
		const x = System.DynamicValue.createNumber(e.movementX);
		const y = System.DynamicValue.createNumber(e.movementY);
		Core.Game.current.hero.receiveEvent(null, false, onMoveID, [null, x, y], Core.Game.current.heroStates);
	}
});

document.addEventListener('wheel', (e) => {
	if (
		Manager.Stack.top instanceof Scene.Map &&
		!Scene.Map.current.loading &&
		!Core.ReactionInterpreter.blockingHero
	) {
		if (e.deltaY > 0)
			// scroll down
			Core.Game.current.hero.receiveEvent(
				null,
				false,
				onWheelID,
				[null, System.DynamicValue.createSwitch(true)],
				Core.Game.current.heroStates
			);
		else if (e.deltaY < 0)
			// scroll up
			Core.Game.current.hero.receiveEvent(
				null,
				false,
				onWheelID,
				[null, System.DynamicValue.createSwitch(false)],
				Core.Game.current.heroStates
			);
	}
});

Manager.Plugins.registerCommand(pluginName, 'Get object under cursor', (variableID, x, y) => {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		const cx = (x / Common.ScreenResolution.CANVAS_WIDTH) * 2 - 1;
		const cy = -(y / Common.ScreenResolution.CANVAS_HEIGHT) * 2 + 1;
		raycaster.setFromCamera(new THREE.Vector2(cx, cy), Scene.Map.current.camera.getThreeCamera());
		raycast(variableID, -1);
	}
});

Manager.Plugins.registerCommand(pluginName, 'Get object screen position', (id, vx, vy) => {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		if (id === -1) id = Core.ReactionInterpreter.currentObject.id;
		Core.Game.current.variables[vx] = null;
		Core.Game.current.variables[vy] = null;
		Core.MapObject.search(
			id,
			(result) => {
				if (!!result && !!result.object.mesh) {
					const v = new THREE.Vector3();
					const w = window.innerWidth;
					const h = window.innerHeight;
					const p = result.object.position;
					result.object.mesh.updateMatrixWorld();
					v.setFromMatrixPosition(result.object.mesh.matrixWorld);
					v.project(Scene.Map.current.camera.getThreeCamera());
					Core.Game.current.variables[vx] = ((v.x + 1) * w) / 2;
					Core.Game.current.variables[vy] = (-(v.y - 1) * h) / 2;
				}
			},
			Core.ReactionInterpreter.currentObject
		);
	}
});

Manager.Plugins.registerCommand(pluginName, 'Lock pointer', () => {
	document.requestPointerLock();
});

Manager.Plugins.registerCommand(pluginName, 'Unlock pointer', () => {
	document.exitPointerLock();
});

Manager.Plugins.registerCommand(pluginName, 'Raycast', (Ax, Ay, Az, Bx, By, Bz, variableID) => {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		const s = Datas.Systems.SQUARE_SIZE;
		va.set((Ax + 0.5) * s, (Ay + 0.5) * s, (Az + 0.5) * s);
		vb.set((Bx + 0.5) * s, (By + 0.5) * s, (Bz + 0.5) * s);
		const dist = va.distanceTo(vb);
		vb.sub(va).normalize();
		raycaster.set(va, vb);
		raycast(variableID, dist);
	}
});
