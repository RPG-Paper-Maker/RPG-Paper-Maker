const pluginName = 'GLTF Loader';

let GLTFLoader = null;
(async () => {
	GLTFLoader = Commmon.Interpreter.evaluate(
		await Common.Platform.loadFile(Common.Paths.PLUGINS + pluginName + '/GLTFLoader.js'),
		{
			addReturn: false,
		}
	);
	loader = new GLTFLoader();
	loader.setPath(Manager.Plugins.getParameter(pluginName, 'Models directory path'));
})();
const clock = new THREE.Clock();

var mixerList = [];
var queue = [];
var busy = false;
var lastMap = null;

setInterval(function () {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		const delta = clock.getDelta();
		if (Scene.Map.current !== lastMap) {
			mixerList = [];
			lastMap = Scene.Map.current;
		}
		for (var i = 1; i < mixerList.length; i++) {
			if (!!mixerList[i]) {
				if (mixerList[i].mapObj.removed) {
					mixerList[i].getRoot().removeFromParent();
					mixerList[i] = null;
				} else mixerList[i].update(delta * mixerList[i].timeScale);
			}
		}
	}
}, 16);

function callNext() {
	busy = true;
	if (Scene.Map.current !== lastMap) setTimeout(callNext, 17);
	else {
		if (queue.length > 0) queue.shift().call();
		else busy = false;
	}
}

function getModel(id) {
	if (!mixerList[id]) return null;
	return mixerList[id].getRoot();
}

function changeOpacity(mesh, value) {
	if (mesh.isMesh) {
		mesh.renderOrder = 0;
		mesh.material.opacity = value;
		mesh.material.transparent = true;
	}
	for (var i = 0; i < mesh.children.length; i++) changeOpacity(mesh.children[i], value);
}

function fixMaterial(model, cast, receive) {
	if (!model) return;
	if (!!model.material) {
		model.castShadow = cast;
		model.receiveShadow = receive;
		const mat = Manager.GL.createMaterial({ texture: model.material.map });
		mat.vertexColors = !model.material.map;
		model.material = mat;
	}
	if (!!model.geometry) {
		model.geometry.computeVertexNormals();
		model.geometry.boundingBox.expandByObject(model);
		model.geometry.boundingSphere.radius = model.geometry.boundingBox.getSize(new THREE.Vector3()) * 1.5;
	}
	if (model.isLight) model.visible = false;
	for (var i = 0; i < model.children.length; i++) fixMaterial(model.children[i], cast, receive);
}

function hasSkinnedChildren(mesh) {
	if (mesh.isSkinnedMesh) return true;
	for (var i = 0; i < mesh.children.length; i++) if (hasSkinnedChildren(mesh.children[i])) return true;
	return false;
}

Manager.Plugins.registerCommand(pluginName, 'Load model', (id, filename) => {
	if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(async function () {
		try {
			const gltf = await loader.loadAsync(filename);
			const model = gltf.scene;
			var newModel = new THREE.Group().add(model);
			if (hasSkinnedChildren(model)) {
				newModel.mapLoopPlugin_isGLTFRoot = true;
				newModel = new THREE.Group().add(newModel);
			}
			Core.MapObject.search(
				id,
				(result) => {
					id = result.object.id;
					var oldModel = getModel(id);
					const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
					model.position.set(0, size.y * 0.5, 0);
					model.animations = gltf.animations;
					fixMaterial(model, true, true);
					if (!!result.object.mesh) {
						if (!!oldModel) result.object.mesh.children.shift();
						while (result.object.mesh.children.length > 0) newModel.add(result.object.mesh.children[0]);
					} else oldModel = null;
					if (!oldModel) {
						result.object.currentState.graphicID = 0;
						result.object.changeState();
						result.object.currentStateInstance.graphicKind = 10;
					}
					Scene.Map.current.scene.remove(result.object.mesh);
					result.object.mesh = newModel;
					Scene.Map.current.scene.add(result.object.mesh);
					result.object.boundingBoxSettings = {
						b: [[0, size.y * 0.5, 0, size.x, size.y, size.z, 0, 0, 0]],
						d: 1,
						h: 1,
						k: true,
						l: new THREE.Vector3(0.01, 0.01, 0.01),
						m: 1,
						p: Core.Position.createFromVector3(result.object.position),
						w: 1,
					};
					result.object.updateBB(result.object.position);
					while (mixerList.length <= id) mixerList.push(null);
					mixerList[id] = new THREE.AnimationMixer(model);
					mixerList[id].queue = [];
					mixerList[id].mapObj = result.object;
					mixerList[id].addEventListener('finished', function (e) {
						if (mixerList[id].queue.length > 0) {
							const action = mixerList[id].queue.shift().play();
							action.clampWhenFinished = true;
							if (!!mixerList[id].currentAnim) {
								mixerList[id].currentAnim.crossFadeTo(action, 0);
								mixerList[id].currentAnim.stop();
							}
							mixerList[id].currentAnim = action;
						}
					});
					if (result.object.isHero) mixerList[0] = mixerList[id];
					callNext();
				},
				Core.ReactionInterpreter.currentObject
			);
		} catch (e) {
			Common.Platform.showErrorMessage("Error: couldn't load " + filename);
		}
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Reset bounding box', (id) => {
	if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		const model = getModel(id);
		if (!!model) {
			Core.MapObject.search(
				id,
				(result) => {
					const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
					result.object.boundingBoxSettings.b[0] = [0, size.y * 0.5, 0, size.x, size.y, size.z, 0, 0, 0];
					result.object.updateBB(result.object.position);
				},
				Core.ReactionInterpreter.currentObject
			);
		}
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Set bounding box', (id, x, y, z) => {
	if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		const model = getModel(id);
		if (!!model) {
			x = Math.abs(x * Datas.Systems.SQUARE_SIZE);
			y = Math.abs(y * Datas.Systems.SQUARE_SIZE);
			z = Math.abs(z * Datas.Systems.SQUARE_SIZE);
			Core.MapObject.search(
				id,
				(result) => {
					result.object.boundingBoxSettings.b[0] = [0, y * 0.5, 0, x, y, z, 0, 0, 0];
					result.object.updateBB(result.object.position);
				},
				Core.ReactionInterpreter.currentObject
			);
		}
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Set scale', (id, scale) => {
	if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		const model = getModel(id);
		if (!!model) model.scale.set(scale, scale, scale);
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Set opacity', (id, opacity) => {
	if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		const model = getModel(id);
		if (!!model) changeOpacity(model, opacity);
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Set offset', (id, x, y, z) => {
	if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		const model = getModel(id);
		const s = Datas.Systems.SQUARE_SIZE;
		if (!!model)
			model.position.set(
				x * s,
				y * s + new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()).y * 0.5,
				z * s
			);
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Set rotation', (id, x, y, z) => {
	if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		const model = getModel(id);
		if (!!model) model.rotation.set((x * Math.PI) / 180.0, (y * Math.PI) / 180.0, (z * Math.PI) / 180.0);
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Add rotation', (id, x, y, z) => {
	if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		const model = getModel(id);
		if (!model) return;
		model.rotateX((x * Math.PI) / 180.0);
		model.rotateY((y * Math.PI) / 180.0);
		model.rotateZ((z * Math.PI) / 180.0);
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Retrieve Y rotation', (id, prop) => {
	if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		if (model) Core.ReactionInterpreter.currentObject.properties[prop] = (model.rotation.y * 180.0) / Math.PI;
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Look at', (objID, tgtID) => {
	if (objID == -1) objID = Core.ReactionInterpreter.currentObject.id;
	if (tgtID == -1) tgtID = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		if (objID == tgtID) return;
		var obj = null;
		Core.MapObject.search(
			objID,
			(result) => {
				if (!!result) obj = result.object;
			},
			Core.ReactionInterpreter.currentObject
		);
		var target = null;
		Core.MapObject.search(
			tgtID,
			(result) => {
				if (!!result) target = result.object;
			},
			Core.ReactionInterpreter.currentObject
		);
		if (!obj || !target) return;
		const model = getModel(objID);
		if (!model) return;
		obj.lookAt(target);
		const x1 = obj.position.x;
		const z1 = obj.position.z;
		const x2 = target.position.x;
		const z2 = target.position.z;
		const r = obj.mesh.rotation.y;
		model.rotation.set(model.rotation.x, 0, model.rotation.z);
		model.rotateY(Math.atan2(x2 - x1, z2 - z1) - r);
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Play animation', (id, name, loop, speed) => {
	if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		const model = getModel(id);
		if (!model) return;
		const anim = THREE.AnimationClip.findByName(model.animations, name);
		if (!!mixerList[id] && !!anim) {
			const action = mixerList[id].clipAction(anim);
			action.clampWhenFinished = true;
			action.timeScale = speed;
			action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce).play();
			if (!!mixerList[id].currentAnim) {
				mixerList[id].currentAnim.crossFadeTo(action, 0);
				mixerList[id].currentAnim.stop();
			}
			mixerList[id].currentAnim = action;
		}
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Queue animation', (id, name, loop, speed) => {
	if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		const model = getModel(id);
		if (!model) return;
		const anim = THREE.AnimationClip.findByName(model.animations, name);
		if (!!mixerList[id] && !!anim) {
			const action = mixerList[id].clipAction(anim);
			action.clampWhenFinished = true;
			action.timeScale = speed;
			action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
			mixerList[id].queue.push(action);
		}
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Stop animation', (id) => {
	if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		if (!!mixerList[id]) mixerList[id].stopAllAction();
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Set animation speed', (id, speed) => {
	if (id === -1) id = Core.ReactionInterpreter.currentObject.id;
	queue.push(function () {
		if (!!mixerList[id]) mixerList[id].timeScale = speed;
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Trigger event', (id, self) => {
	const obj = Core.ReactionInterpreter.currentObject;
	queue.push(function () {
		if (self) obj.receiveEvent(obj, false, id, [null], obj.states);
		else Manager.Events.sendEventDetection(null, -1, false, id, [null]);
		callNext();
	});
	if (!busy) callNext();
});

Manager.Plugins.registerCommand(pluginName, 'Get model info', async (filename) => {
	try {
		const gltf = await loader.loadAsync(filename);
		const size = new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3());
		var str = 'Size:\n\n';
		str += '   X: ' + size.x.toFixed(3) + '\n';
		str += '   Y: ' + size.z.toFixed(3) + '\n';
		str += '   Z: ' + size.y.toFixed(3) + '\n';
		str += '\nAnimations list:\n\n';
		for (var i = 0; i < gltf.animations.length; i++) str += '   ' + gltf.animations[i].name + '\n';
		alert(str);
	} catch (e) {
		Common.Platform.showErrorMessage("Error: couldn't load " + filename);
	}
});
