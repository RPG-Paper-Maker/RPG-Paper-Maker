const pluginName = "More mouse options";

const onDownID = Manager.Plugins.getParameter(pluginName, "Mouse down event ID");
const onUpID = Manager.Plugins.getParameter(pluginName, "Mouse up event ID");
const onMoveID = Manager.Plugins.getParameter(pluginName, "Mouse move event ID");
const onWheelID = Manager.Plugins.getParameter(pluginName, "Mouse wheel event ID");
const onGainFocusID = Manager.Plugins.getParameter(pluginName, "Gain focus event ID");
const onLoseFocusID = Manager.Plugins.getParameter(pluginName, "Lose focus event ID");

const canvas = document.createElement("canvas");
const raycaster = new THREE.Raycaster();
const va = new THREE.Vector3();
const vb = new THREE.Vector3();
const params = new Map(
[
	[1, Model.DynamicValue.createNumber(0)],
	[2, Model.DynamicValue.createNumber(0)],
	[3, Model.DynamicValue.createNumber(0)]
]);

function getMapObject(mesh)
{
	if (mesh === undefined)
		return -1;
	if (mesh === Core.Game.current.hero.mesh)
		return 0;
	for (const [key, portion] of Scene.Map.current.objectsSpatialHash)
		for (const obj of portion)
			if (!!obj.mesh && (obj.mesh === mesh || obj.mesh === mesh.mapLoopPlugin_isClone))
				return obj.system.id;
	return -1;
}

function raycast(dist, ignore = false)
{
	const intersects = raycaster.intersectObjects(Scene.Map.current.scene.children);
	while (intersects.length > 0)
	{
		if (intersects[0].distance === 0)
			intersects.shift();
		else
			break;
	}
	for (var i = 0; i < intersects.length; i++)
	{
		if (intersects[i].distance < dist)
			intersects.splice(i--, 1);
		else
		{
			if (intersects[i].object.material.wireframe || !!intersects[i].object.material.length || (ignore && intersects[i].object === Core.Game.current.hero.mesh) || !intersects[i].object.material.map || !intersects[i].object.material.map.source || !intersects[i].object.material.map.source.data)
				intersects.splice(i--, 1);
			else
			{
				const img = intersects[0].object.material.map.source.data;
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);
				const data = ctx.getImageData(0, 0, img.width, img.height).data;
				const x = parseInt(intersects[i].uv.x * img.width);
				const y = parseInt(intersects[i].uv.y * img.height);
				if (data[(x + y * img.width) * 4 + 3] == 0)
					intersects.splice(i--, 1);
			}
		}
	}
	return intersects;
}

document.addEventListener("mousedown", (e) =>
{
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading && !Core.ReactionInterpreter.blockingHero)
	{
		if (e.button === 0)
			Common.Inputs.mouseLeftPressed = true;
		else if (e.button === 2)
			Common.Inputs.mouseRightPressed = true;
		params.get(1).value = e.clientX;
		params.get(2).value = e.clientY;
		params.get(3).value = e.button;
		Core.Game.current.hero.receiveEvent(null, false, onDownID, params, Core.Game.current.heroStates);
	}
});

document.addEventListener("mouseup", (e) =>
{
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading && !Core.ReactionInterpreter.blockingHero)
	{
		if (e.button === 0)
			Common.Inputs.mouseLeftPressed = false;
		else if (e.button === 2)
			Common.Inputs.mouseRightPressed = false;
		params.get(1).value = e.clientX;
		params.get(2).value = e.clientY;
		params.get(3).value = e.button;
		Core.Game.current.hero.receiveEvent(null, false, onUpID, params, Core.Game.current.heroStates);
	}
});

document.addEventListener("mousemove", (e) =>
{
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading && !Core.ReactionInterpreter.blockingHero)
	{
		params.get(1).value = e.movementX;
		params.get(2).value = e.movementY;
		Core.Game.current.hero.receiveEvent(null, false, onMoveID, params, Core.Game.current.heroStates);
	}
});

document.addEventListener("wheel", (e) =>
{
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading && !Core.ReactionInterpreter.blockingHero)
	{
		params.get(1).value = e.deltaY > 0;
		Core.Game.current.hero.receiveEvent(null, false, onWheelID, params, Core.Game.current.heroStates);
	}
});

window.addEventListener("focus", (e) =>
{
	Core.Game.current.hero.receiveEvent(null, false, onGainFocusID, params, Core.Game.current.heroStates);
});

window.addEventListener("blur", (e) =>
{
	Core.Game.current.hero.receiveEvent(null, false, onLoseFocusID, params, Core.Game.current.heroStates);
});

Manager.Plugins.registerCommand(pluginName, "Get object under cursor", (variableID, x, y, ignoreHero) =>
{
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading)
	{
		const cx =  (Common.ScreenResolution.getScreenXReverse(x) / Common.ScreenResolution.SCREEN_X) * 2 - 1;
		const cy = -(Common.ScreenResolution.getScreenYReverse(y) / Common.ScreenResolution.SCREEN_Y) * 2 + 1;
		raycaster.setFromCamera(new THREE.Vector2(cx, cy), Scene.Map.current.camera.getThreeCamera());
		const intersects = raycast(-1, ignoreHero);
		Core.Game.current.variables.set(variableID, intersects.length > 0 ? getMapObject(intersects[0].object) : -1);
	}
});

Manager.Plugins.registerCommand(pluginName, "Get coordinate under cursor", (ScreenX, ScreenY, ResultX, ResultY, ResultZ) =>
{
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading)
	{
		const cx =  (Common.ScreenResolution.getScreenXReverse(ScreenX) / Common.ScreenResolution.SCREEN_X) * 2 - 1;
		const cy = -(Common.ScreenResolution.getScreenYReverse(ScreenY) / Common.ScreenResolution.SCREEN_Y) * 2 + 1;
		raycaster.setFromCamera(new THREE.Vector2(cx, cy), Scene.Map.current.camera.getThreeCamera());
		const intersects = raycast(-1, true);
		while (intersects.length > 0 && getMapObject(intersects[0].object) >= 0)
			intersects.shift();
		if (intersects.length > 0)
		{
			Core.Game.current.variables.set(ResultX, intersects[0].point.x);
			Core.Game.current.variables.set(ResultY, intersects[0].point.y);
			Core.Game.current.variables.set(ResultZ, intersects[0].point.z);
		}
		else
		{
			Core.Game.current.variables.set(ResultX, -10000);
			Core.Game.current.variables.set(ResultY, -10000);
			Core.Game.current.variables.set(ResultZ, -10000);
		}
	}
});

Manager.Plugins.registerCommand(pluginName, "Lock pointer", () =>
{
	Manager.GL.renderer.domElement.requestPointerLock();
});

Manager.Plugins.registerCommand(pluginName, "Unlock pointer", () =>
{
	document.exitPointerLock();
});

Manager.Plugins.registerCommand(pluginName, "Is pointer locked?", (variableID) =>
{
	Core.Game.current.variables.set(variableID, document.pointerLockElement === Manager.GL.renderer.domElement);
});

Manager.Plugins.registerCommand(pluginName, "Raycast", (Ax, Ay, Az, Bx, By, Bz, variableID) =>
{
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading)
	{
		const s = Data.Systems.SQUARE_SIZE;
		va.set((Ax + 0.5) * s, (Ay + 0.5) * s, (Az + 0.5) * s);
		vb.set((Bx + 0.5) * s, (By + 0.5) * s, (Bz + 0.5) * s);
		const dist = va.distanceTo(vb) + 1;
		vb.sub(va).normalize();
		raycaster.set(va, vb);
		Core.Game.current.variables.set(variableID, raycast(dist));
	}
});
