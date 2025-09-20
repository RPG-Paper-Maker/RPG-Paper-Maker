const pluginName = 'Raycaster';
const inject = Manager.Plugins.inject;

const onClickID = Manager.Plugins.getParameter(pluginName, 'Single click event ID');
const onDClickID = Manager.Plugins.getParameter(pluginName, 'Double click event ID');
const onDownID = Manager.Plugins.getParameter(pluginName, 'Mouse down event ID');
const onUpID = Manager.Plugins.getParameter(pluginName, 'Mouse up event ID');
const onMoveID = Manager.Plugins.getParameter(pluginName, 'Mouse move event ID');
const onWheelID = Manager.Plugins.getParameter(pluginName, 'Mouse wheel event ID');

const raycaster = new THREE.Raycaster();

document.addEventListener('click', (e) => {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		const x = Model.DynamicValue.createNumber(e.clientX);
		const y = Model.DynamicValue.createNumber(e.clientY);
		const b = Model.DynamicValue.createNumber(e.button);
		Manager.Events.sendEventDetection(null, -1, false, onClickID, [null, x, y, b]);
	}
});

document.addEventListener('dblclick', (e) => {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		const x = Model.DynamicValue.createNumber(e.clientX);
		const y = Model.DynamicValue.createNumber(e.clientY);
		Manager.Events.sendEventDetection(null, -1, false, onDClickID, [null, x, y]);
	}
});

document.addEventListener('mousedown', (e) => {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		const x = Model.DynamicValue.createNumber(e.clientX);
		const y = Model.DynamicValue.createNumber(e.clientY);
		const b = Model.DynamicValue.createNumber(e.button);
		Manager.Events.sendEventDetection(null, -1, false, onDownID, [null, x, y, b]);
	}
});

document.addEventListener('mouseup', (e) => {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		const x = Model.DynamicValue.createNumber(e.clientX);
		const y = Model.DynamicValue.createNumber(e.clientY);
		const b = Model.DynamicValue.createNumber(e.button);
		Manager.Events.sendEventDetection(null, -1, false, onUpID, [null, x, y, b]);
	}
});

document.addEventListener('mousemove', (e) => {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		const x = Model.DynamicValue.createNumber(e.clientX);
		const y = Model.DynamicValue.createNumber(e.clientY);
		Manager.Events.sendEventDetection(null, -1, false, onMoveID, [null, x, y]);
	}
});

document.addEventListener('wheel', (e) => {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		if (e.deltaY > 0)
			// scroll down
			Manager.Events.sendEventDetection(null, -1, false, onWheelID, [
				null,
				Model.DynamicValue.createSwitch(true),
			]);
		else if (e.deltaY < 0)
			// scroll up
			Manager.Events.sendEventDetection(null, -1, false, onWheelID, [
				null,
				Model.DynamicValue.createSwitch(false),
			]);
	}
});

Manager.Plugins.registerCommand(pluginName, 'Get object on cursor', (variable, x, y) => {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		x = (x / document.innerWidth) * 2 - 1;
		y = -(y / document.innerHeight) * 2 + 1;
		raycaster.setFromCamera(new THREE.Vector2(x, y), Scene.Map.current.camera.perspectiveCamera);
		Core.Game.current.variables[variable] = -1;
		for (var i = 1; i < Scene.Map.current.maxObjectsID + 1; i++) {
			var exitFor = false;
			if (!Scene.Map.current.allObjects[i]) continue;
			Core.MapObject.search(
				i,
				(result) => {
					if (!!result) {
						if (result.object.meshBoundingBox.length > 0) {
							if (raycaster.ray.intersectsBox(result.object.meshBoundingBox[0].geometry.boundingBox)) {
								Core.Game.current.variables[variable] = i;
								exitFor = true;
							}
						}
					}
				},
				Core.ReactionInterpreter.currentObject,
			);
			if (exitFor) break;
		}
	}
});
