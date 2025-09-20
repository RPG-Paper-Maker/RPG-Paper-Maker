const pluginName = 'Light';

const path = Common.Paths.PLUGINS + pluginName + '/shaders/';
const rings = Manager.Plugins.getParameter(pluginName, 'Number of light rings');

var lightList = [];
var lastMap = null;

setInterval(function () {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading)
		for (var i = 0; i < Scene.Map.current.scene.children.length; i++)
			if (
				!!Scene.Map.current.scene.children[i].customDepthMaterial &&
				!Scene.Map.current.scene.children[i].customDistanceMaterial
			)
				Scene.Map.current.scene.children[i].customDistanceMaterial = new THREE.MeshDistanceMaterial({
					alphaTest: 0.5,
					map: Scene.Map.current.scene.children[i].customDepthMaterial.map,
				});
}, 48);

setInterval(function () {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		if (Scene.Map.current !== lastMap) {
			for (var i = 0; i < lightList.length; i++) {
				if (lightList[i].rpmRootScene !== Scene.Map.current) {
					if (!!lightList[i].parent) lightList[i].parent.remove(lightList[i]);
					//					lightList[i].dispose();
					lightList.splice(i, 1);
				}
			}
			lastMap = Scene.Map.current;
		}
		for (var i = 0; i < lightList.length; i++) {
			if (lightList[i].isDirectionalLight) {
				const x = lightList[i].extraStuff.x;
				const y = lightList[i].extraStuff.y;
				const z = lightList[i].extraStuff.z;
				const d = Math.max((Data.Systems.SQUARE_SIZE * Scene.Map.current.camera.distance) / 10, 400);
				lightList[i].target.position.copy(Scene.Map.current.camera.targetPosition);
				lightList[i].target.updateMatrixWorld();
				lightList[i].position
					.set(x, y, z)
					.multiplyScalar(d / 2)
					.add(Scene.Map.current.camera.targetPosition);
				if (d !== lightList[i].shadow.camera.right) {
					lightList[i].shadow.camera.left = -d;
					lightList[i].shadow.camera.right = d;
					lightList[i].shadow.camera.top = d;
					lightList[i].shadow.camera.bottom = -d;
					lightList[i].shadow.camera.updateProjectionMatrix();
				}
			}
		}
	}
}, 48);

Manager.GL.load = async function () {
	var vert = await Common.Platform.loadFile(path + 'toon.vert');
	var frag = await Common.Platform.loadFile(path + 'toon.frag');
	frag = frag.replace('int numberOfRings = 5;', 'int numberOfRings = ' + rings.toString() + ';');
	Manager.GL.SHADER_FIX_VERTEX = vert;
	Manager.GL.SHADER_FIX_FRAGMENT = frag;
	Manager.GL.SHADER_FACE_VERTEX = vert;
	Manager.GL.SHADER_FACE_FRAGMENT = frag;
	Manager.GL.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
};

function enableCastShadows(mesh, enable) {
	if (mesh.isMesh) mesh.castShadow = enable;
	for (var i = 0; i < mesh.children.length; i++) enableCastShadows(mesh.children[i], enable);
}

function enableReceiveShadows(mesh, enable) {
	if (!mesh.isScene) mesh.receiveShadow = enable;
	for (var i = 0; i < mesh.children.length; i++) enableReceiveShadows(mesh.children[i], enable);
}

function limitDistance(value) {
	const x = Scene.Map.current.mapProperties.length;
	const y = Scene.Map.current.mapProperties.height + Scene.Map.current.mapProperties.depth;
	const z = Scene.Map.current.mapProperties.width;
	const h1 = Math.sqrt(x * x + z * z);
	const h2 = Math.sqrt(h1 * h1 + y * y);
	if (value === 0) return h2 * Data.Systems.SQUARE_SIZE;
	return Math.min(value, h2 * Data.Systems.SQUARE_SIZE);
}

Manager.Plugins.registerCommand(pluginName, 'Get local lights', (startFrom) => {
	const obj = Core.ReactionInterpreter.currentObject;
	if (!obj.lightsPlugin_localLights) return;
	const children = obj.lightsPlugin_localLights.children;
	for (var i = 0; i < children.length; i++)
		if (lightList.includes(children[i])) obj.properties[startFrom++] = children[i];
});

Manager.Plugins.registerCommand(pluginName, 'Reattach lights', () => {
	const obj = Core.ReactionInterpreter.currentObject;
	if (!obj.lightsPlugin_localLights) return;
	if (!obj.mesh) {
		obj.mesh = new THREE.Mesh();
		Scene.Map.current.scene.add(obj.mesh);
	}
	if (obj.lightsPlugin_localLights.parent !== obj.mesh) obj.mesh.add(obj.lightsPlugin_localLights);
	for (var i = 1; i < obj.properties.length; i++)
		if (lightList.includes(obj.properties[i]) && obj.properties[i].parent !== obj.lightsPlugin_localLights)
			obj.lightsPlugin_localLights.add(obj.properties[i]);
});

Manager.Plugins.registerCommand(pluginName, 'Remove all lights', () => {
	for (var i = 0; i < lightList.length; i++) {
		lightList[i].parent.remove(lightList[i]);
		lightList[i].dispose();
	}
	lightList = [];
});

Manager.Plugins.registerCommand(pluginName, 'Remove default directional light', () => {
	const scene = Scene.Map.current.scene;
	for (var i = 0; i < scene.children.length; i++) {
		if (scene.children[i].isDirectionalLight && !lightList.includes(scene.children[i])) {
			scene.remove(scene.children[i]);
			break;
		}
	}
});

Manager.Plugins.registerCommand(pluginName, 'Remove light', (prop) => {
	const light = Core.ReactionInterpreter.currentObject.properties[prop];
	if (!!light) {
		lightList.splice(lightList.indexOf(light), 1);
		light.parent.remove(light);
		light.dispose();
	}
});

Manager.Plugins.registerCommand(pluginName, 'Enable/disable light', (prop, enabled) => {
	const light = Core.ReactionInterpreter.currentObject.properties[prop];
	if (!!light) light.visible = enabled;
});

Manager.Plugins.registerCommand(pluginName, 'Set ambient light', (intensity, color) => {
	const scene = Scene.Map.current.scene;
	for (var i = 0; i < scene.children.length; i++) {
		if (scene.children[i].isAmbientLight && !lightList.includes(scene.children[i])) {
			scene.children[i].intensity = intensity;
			scene.children[i].color = color.color;
			break;
		}
	}
});

Manager.Plugins.registerCommand(pluginName, 'Add hemisphere light', (prop, intensity, colorTop, colorBottom) => {
	const light = new THREE.HemisphereLight(colorBottom.color, colorTop.color, intensity);
	light.rpmRootScene = Scene.Map.current;
	if (prop > 0) Core.ReactionInterpreter.currentObject.properties[prop] = light;
	Scene.Map.current.scene.add(light);
	lightList.push(light);
});

Manager.Plugins.registerCommand(pluginName, 'Add directional light', (prop, x, y, z, intensity, color, castShadow) => {
	const light = new THREE.DirectionalLight(color.color, intensity);
	light.rpmRootScene = Scene.Map.current;
	light.extraStuff = new THREE.Vector3(x, y, z).normalize();
	light.castShadow = castShadow;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	light.shadow.camera.far = Data.Systems.SQUARE_SIZE * 350;
	light.shadow.bias = -0.0002;
	light.shadow.normalBias = (0.65 * Data.Systems.SQUARE_SIZE) / 16;
	if (prop > 0) Core.ReactionInterpreter.currentObject.properties[prop] = light;
	Scene.Map.current.scene.add(light);
	lightList.push(light);
});

Manager.Plugins.registerCommand(
	pluginName,
	'Add point light',
	(prop, id, x, y, z, intensity, color, radius, castShadow) => {
		const light = new THREE.PointLight(color.color, intensity, limitDistance(radius * Data.Systems.SQUARE_SIZE));
		light.rpmRootScene = Scene.Map.current;
		light.shadow.bias = -0.0001;
		light.shadow.normalBias = (0.44 * Data.Systems.SQUARE_SIZE) / 16;
		light.position.set(x * Data.Systems.SQUARE_SIZE, y * Data.Systems.SQUARE_SIZE, z * Data.Systems.SQUARE_SIZE);
		light.castShadow = castShadow;
		Core.MapObject.search(
			id,
			(result) => {
				if (!result.object.mesh) {
					result.object.mesh = new THREE.Mesh();
					Scene.Map.current.scene.add(result.object.mesh);
				}
				if (!result.object.lightsPlugin_localLights) {
					result.object.lightsPlugin_localLights = new THREE.Group();
					result.object.lightsPlugin_localLights.lightsPlugin_isLightGroup = true;
					result.object.mesh.add(result.object.lightsPlugin_localLights);
				}
				if (result.object.lightsPlugin_localLights.parent !== result.object.mesh)
					result.object.mesh.add(result.object.lightsPlugin_localLights);
				result.object.lightsPlugin_localLights.add(light);
				if (prop > 0) Core.ReactionInterpreter.currentObject.properties[prop] = light;
				lightList.push(light);
				console.log(lightList);
			},
			Core.ReactionInterpreter.currentObject,
		);
	},
);

Manager.Plugins.registerCommand(
	pluginName,
	'Add spotlight',
	(prop, id, x, y, z, intensity, color, angle, distance, castShadow) => {
		const light = new THREE.SpotLight(color.color, intensity);
		light.rpmRootScene = Scene.Map.current;
		light.position.set(x * Data.Systems.SQUARE_SIZE, y * Data.Systems.SQUARE_SIZE, z * Data.Systems.SQUARE_SIZE);
		light.castShadow = castShadow;
		light.angle = (angle * Math.PI) / 180.0;
		light.shadow.bias = -0.0000005;
		light.shadow.normalBias = (0.75 * Data.Systems.SQUARE_SIZE) / 16;
		light.penumbra = 1.0;
		light.distance = limitDistance(distance * Data.Systems.SQUARE_SIZE);
		Core.MapObject.search(
			id,
			(result) => {
				if (!result.object.mesh) {
					result.object.mesh = new THREE.Mesh();
					Scene.Map.current.scene.add(result.object.mesh);
				}
				if (!result.object.lightsPlugin_localLights) {
					result.object.lightsPlugin_localLights = new THREE.Group();
					result.object.lightsPlugin_localLights.lightsPlugin_isLightGroup = true;
					result.object.mesh.add(result.object.lightsPlugin_localLights);
				}
				if (result.object.lightsPlugin_localLights.parent !== result.object.mesh)
					result.object.mesh.add(result.object.lightsPlugin_localLights);
				result.object.lightsPlugin_localLights.add(light);
				if (!result.object.mesh.lightsPlugin_target) {
					const target = new THREE.Object3D();
					result.object.mesh.lightsPlugin_target = target;
					result.object.mesh.add(target);
					light.target = target;
				}
				if (prop > 0) Core.ReactionInterpreter.currentObject.properties[prop] = light;
				lightList.push(light);
			},
			Core.ReactionInterpreter.currentObject,
		);
	},
);

Manager.Plugins.registerCommand(pluginName, 'Set light color', (prop, color) => {
	const light = Core.ReactionInterpreter.currentObject.properties[prop];
	light.color = color.color;
});

Manager.Plugins.registerCommand(pluginName, 'Set hemisphere light colors', (prop, colorTop, colorBottom) => {
	const light = Core.ReactionInterpreter.currentObject.properties[prop];
	if (!light.isHemisphereLight) return;
	// for some reason, they are reversed
	light.skyColor = colorBottom.color;
	light.groundColor = colorTop.color;
});

Manager.Plugins.registerCommand(pluginName, 'Set light intensity', (prop, intensity) => {
	const light = Core.ReactionInterpreter.currentObject.properties[prop];
	light.intensity = intensity;
});

Manager.Plugins.registerCommand(pluginName, 'Set light cast shadow', (prop, castShadow) => {
	const light = Core.ReactionInterpreter.currentObject.properties[prop];
	if (light.isHemisphereLight) return;
	light.castShadow = castShadow;
});

Manager.Plugins.registerCommand(pluginName, 'Set object cast shadow', (id, castShadow) => {
	Core.MapObject.search(
		id,
		(result) => {
			if (!!result) enableCastShadows(result.object.mesh, castShadow);
		},
		Core.ReactionInterpreter.currentObject,
	);
});

Manager.Plugins.registerCommand(pluginName, 'Set object receive shadow', (id, receiveShadow) => {
	Core.MapObject.search(
		id,
		(result) => {
			if (!!result) enableReceiveShadows(result.object.mesh, receiveShadow);
		},
		Core.ReactionInterpreter.currentObject,
	);
});

Manager.Plugins.registerCommand(pluginName, 'Set light position', (prop, x, y, z) => {
	const light = Core.ReactionInterpreter.currentObject.properties[prop];
	if (light.isHemisphereLight) return;
	if (light.isDirectionalLight) light.extraStuff.set(x, y, z).normalize();
	else light.position.set(x * Data.Systems.SQUARE_SIZE, y * Data.Systems.SQUARE_SIZE, z * Data.Systems.SQUARE_SIZE);
});

Manager.Plugins.registerCommand(pluginName, 'Set spotlight target', (prop, id) => {
	const light = Core.ReactionInterpreter.currentObject.properties[prop];
	if (!light.isSpotLight) return;
	Core.MapObject.search(
		id,
		(result) => {
			if (!result.object.mesh) {
				result.object.mesh = new THREE.Mesh();
				Scene.Map.current.scene.add(result.object.mesh);
			}
			if (!result.object.mesh.lightsPlugin_target) {
				const target = new THREE.Object3D();
				result.object.mesh.lightsPlugin_target = target;
				result.object.mesh.add(target);
				light.target = target;
			}
		},
		Core.ReactionInterpreter.currentObject,
	);
});

Manager.Plugins.registerCommand(pluginName, 'Set spotlight angle', (prop, id) => {
	const light = Core.ReactionInterpreter.currentObject.properties[prop];
	if (!light.isSpotLight) return;
	light.angle = (angle * Math.PI) / 180.0;
});
