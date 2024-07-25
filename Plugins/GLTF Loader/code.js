import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";
import { GLTFLoader } from "./GLTFLoader.js";

const pluginName = "GLTF Loader";
const inject = RPM.Manager.Plugins.inject;

const clock = new THREE.Clock();
const loader = new GLTFLoader();
loader.setPath(RPM.Manager.Plugins.getParameter(pluginName, "Models directory path"));

var mixerList = [];
var queue = [];
var busy = false;
var lastMap = null;

setInterval(function ()
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		const delta = clock.getDelta();
		if (RPM.Scene.Map.current !== lastMap)
		{
			mixerList = [];
			lastMap = RPM.Scene.Map.current;
		}
		for (var i = 1; i < mixerList.length; i++)
			if (!!mixerList[i])
				mixerList[i].update(delta * mixerList[i].timeScale);
	}
}, 16);

function callNext()
{
	busy = true;
	if (queue.length > 0)
		queue.shift().call();
	else
		busy = false;
}

function getModel(id)
{
	if (!mixerList[id])
		return null;
	return mixerList[id].getRoot();
}

function fixMaterial(model, cast, receive)
{
	if (!!model.material)
	{
		model.castShadow = cast;
		model.receiveShadow = receive;
		model.material.side = THREE.FrontSide;
		const mat = RPM.Manager.GL.createMaterial({texture: model.material.map});
		if (!model.material.map)
			mat.vertexColors = true;
		model.material = mat;
	}
	if (model.isLight)
		model.visible = false;
	for (var i = 0; i < model.children.length; i++)
		fixMaterial(model.children[i], cast, receive);
}

RPM.Manager.Plugins.registerCommand(pluginName, "Load model", (id, filename) =>
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(async function ()
	{
		try
		{
			const gltf = await loader.loadAsync(filename);
			RPM.Core.MapObject.search(id, (result) =>
			{
				if (!!result)
				{
					id = result.object.id;
					const model = gltf.scene;
					const newModel = new THREE.Mesh().add(model);
					var oldModel = getModel(id);
					const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
					model.position.set(0, size.y * 0.5, 0);
					model.animations = gltf.animations;
					fixMaterial(model, true, true);
					if (!!result.object.mesh)
					{
						if (!!oldModel)
							result.object.mesh.children.shift();
						while (result.object.mesh.children.length > 0)
							newModel.add(result.object.mesh.children[0]);
					}
					else
						oldModel = null;
					if (!oldModel)
					{
						result.object.currentState.graphicID = 0;
						result.object.changeState();
						result.object.currentStateInstance.graphicKind = 10;
					}
					RPM.Scene.Map.current.scene.remove(result.object.mesh);
					result.object.mesh = newModel;
					RPM.Scene.Map.current.scene.add(result.object.mesh);
					result.object.boundingBoxSettings =
					{
						b: [[0, size.y * 0.5, 0, size.x, size.y, size.z, 0, 0, 0]],
						d: 1,
						h: 1,
						k: true,
						l: new THREE.Vector3(0.01, 0.01, 0.01),
						m: 1,
						p: RPM.Core.Position.createFromVector3(result.object.position),
						w: 1
					};
					result.object.updateBB(result.object.position);
					while (mixerList.length <= id)
						mixerList.push(null);
					mixerList[id] = new THREE.AnimationMixer(model);
					if (result.object.isHero)
						mixerList[0] = mixerList[id];
					callNext();
				}
				else
					RPM.Common.Platform.showErrorMessage("Error: couldn't find map object with ID " + id.toString());
			}, RPM.Core.ReactionInterpreter.currentObject);
		}
		catch (e)
		{
			RPM.Common.Platform.showErrorMessage("Error: couldn't load " + filename);
		}
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Reset bounding box", (id) =>
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(function ()
	{
		const model = getModel(id);
		if (!!model)
		{
			RPM.Core.MapObject.search(id, (result) =>
			{
				if (!!result)
				{
					const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
					result.object.boundingBoxSettings.b[0] = [0, size.y * 0.5, 0, size.x, size.y, size.z, 0, 0, 0];
					result.object.updateBB(result.object.position);
				}
			}, RPM.Core.ReactionInterpreter.currentObject);
		}
		callNext();
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set bounding box", (id, x, y, z) =>
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(function ()
	{
		const model = getModel(id);
		if (!!model)
		{
			x = Math.abs(x * RPM.Datas.Systems.SQUARE_SIZE);
			y = Math.abs(y * RPM.Datas.Systems.SQUARE_SIZE);
			z = Math.abs(z * RPM.Datas.Systems.SQUARE_SIZE);
			RPM.Core.MapObject.search(id, (result) =>
			{
				if (!!result)
				{
					result.object.boundingBoxSettings.b[0] = [0, y * 0.5, 0, x, y, z, 0, 0, 0];
					result.object.updateBB(result.object.position);
				}
			}, RPM.Core.ReactionInterpreter.currentObject);
		}
		callNext();
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set scale", (id, scale) =>
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(function ()
	{
		const model = getModel(id);
		if (!!model)
			model.scale.set(scale, scale, scale);
		callNext();
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set opacity", (id, opacity) =>
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(function ()
	{
		const model = getModel(id);
		if (!!model)
			model.children[0].material.opacity = opacity;
		callNext();
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set offset", (id, x, y, z) =>
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(function ()
	{
		const model = getModel(id);
		if (!!model)
			model.position.set(x, y + new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()).y * 0.5, z);
		callNext();
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set rotation", (id, x, y, z) =>
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(function ()
	{
		const model = getModel(id);
		if (!!model)
			model.rotation.set(x * Math.PI / 180.0, y * Math.PI / 180.0, z * Math.PI / 180.0);
		callNext();
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Add rotation", (id, x, y, z) =>
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(function ()
	{
		const model = getModel(id);
		if (!model)
			return;
		model.rotateX(x * Math.PI / 180.0);
		model.rotateY(y * Math.PI / 180.0);
		model.rotateZ(z * Math.PI / 180.0);
		callNext();
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Retrieve Y rotation", (id, prop) =>
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(function ()
	{
		if (model)
			RPM.Core.ReactionInterpreter.currentObject.properties[prop] = model.rotation.y * 180.0 / Math.PI;
		callNext();
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Look at", (objID, tgtID) =>
{
	if (objID == -1)
		objID = RPM.Core.ReactionInterpreter.currentObject.id;
	if (tgtID == -1)
		tgtID = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(function ()
	{
		if (objID == tgtID)
			return;
		var obj = null;
		RPM.Core.MapObject.search(objID, (result) =>
		{
			if (!!result)
				obj = result.object;
		}, RPM.Core.ReactionInterpreter.currentObject);
		var target = null;
		RPM.Core.MapObject.search(tgtID, (result) =>
		{
			if (!!result)
				target = result.object;
		}, RPM.Core.ReactionInterpreter.currentObject);
		if (!obj || !target)
			return;
		const model = getModel(objID);
		if (!model)
			return;
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
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Play animation", (id, name, loop) =>
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(function ()
	{
		const model = getModel(id);
		if (!model)
			return;
		const anim = THREE.AnimationClip.findByName(model.animations, name);
		if (!!mixerList[id] && !!anim)
		{
			mixerList[id].stopAllAction();
			mixerList[id].clipAction(anim).setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce).play();
		}
		callNext();
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Stop animation", (id) =>
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(function ()
	{
		if (!!mixerList[id])
			mixerList[id].stopAllAction();
		callNext();
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set animation speed", (id, speed) =>
{
	if (id === -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	queue.push(function ()
	{
		if (!!mixerList[id])
			mixerList[id].timeScale = speed;
		callNext();
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Trigger event", (id) =>
{
	queue.push(function ()
	{
		RPM.Manager.Events.sendEventDetection(null, -1, false, id, [null]);
		callNext();
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Get model info", async (filename) =>
{
	try
	{
		const gltf = await loader.loadAsync(filename);
		const size = new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3());
		var str = "Size:\n\n";
		str += "   X: " + size.x.toFixed(3) + "\n";
		str += "   Y: " + size.z.toFixed(3) + "\n";
		str += "   Z: " + size.y.toFixed(3) + "\n";
		str += "\nAnimations list:\n\n";
		for (var i = 0; i < gltf.animations.length; i++)
			str += "   " + gltf.animations[i].name + "\n";
		alert(str);
	}
	catch (e)
	{
		RPM.Common.Platform.showErrorMessage("Error: couldn't load " + filename);
	}
});
