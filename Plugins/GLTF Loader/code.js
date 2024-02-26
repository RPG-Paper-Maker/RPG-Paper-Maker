import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";
import { GLTFLoader } from "./GLTFLoader.js";

const pluginName = "GLTF Loader";
const inject = RPM.Manager.Plugins.inject;

const onMapLoadID = RPM.Manager.Plugins.getParameter(pluginName, "Map load event ID");
const onAllModelsLoadID = RPM.Manager.Plugins.getParameter(pluginName, "All models loaded event ID");
const timerForAllLoad = 30;
const clock = new THREE.Clock();
const loader = new GLTFLoader();
loader.setPath(RPM.Manager.Plugins.getParameter(pluginName, "Models directory path"));

var mixerList = [];
var busy = false;
var timeSinceBusy = 0;
var mapID = 0;

setInterval(function ()
{
	if (!!RPM.Scene.Map.current)
	{
		if (!RPM.Scene.Map.current.loading && mapID != RPM.Scene.Map.current.id)
		{
			mixerList = [];
			mapID = RPM.Scene.Map.current.id;
			RPM.Manager.Events.sendEventDetection(null, -1, false, onMapLoadID, [null]);
			timeSinceBusy = 0;
		}
		if (timeSinceBusy < timerForAllLoad)
		{
			if (!busy)
			{
				if (++timeSinceBusy == timerForAllLoad)
					RPM.Manager.Events.sendEventDetection(null, -1, false, onAllModelsLoadID, [null]);
			}
			else
				timeSinceBusy = 0;
		}
		for (var i = 0; i < mixerList.length; i++)
			if (!!mixerList[i])
				mixerList[i].update(clock.getDelta() * mixerList[i].timeScale);
	}
}, 16);

function getModel(id)
{
	var obj = null;
	RPM.Core.MapObject.search(id, (result) =>
	{
		if (!!result)
			obj = result.object;
	}, RPM.Core.ReactionInterpreter.currentObject);
	if (id >= mixerList.length)
		return null;
	if (id == 0 && !mixerList[0])
		return null;
	if (!!obj)
		return obj.mesh.children[0];
	return null;
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

RPM.Manager.Plugins.registerCommand(pluginName, "Load model",
function loadModel(id, filename)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(loadModel, 16, id, filename);
	else
	{
		busy = true;
		loader.load
		(
			filename,
			function (gltf)
			{
				const model = gltf.scene;
				model.animations = gltf.animations;
				RPM.Core.MapObject.search(id, (result) =>
				{
					if (!!result)
					{
						fixMaterial(model, result.object.mesh.castShadow, result.object.mesh.receiveShadow);
						id = result.object.id;
						const oldModel = getModel(id);
						if (!oldModel)
						{
							result.object.currentState.graphicID = 0;
							result.object.currentStateInstance = null;
							result.object.changeState();
							result.object.currentStateInstance.graphicKind = 10;
						}
						const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
						model.position.set(0, size.y * 0.5, 0);
						result.object.boundingBoxSettings.b[0] = [0, size.y * 0.5, 0, size.x, size.y, size.z, 0, 0, 0];
						result.object.updateBB(result.object.position);
						RPM.Scene.Map.current.scene.remove(result.object.mesh);
						result.object.mesh.geometry.dispose();
						result.object.mesh.material.dispose();
						result.object.mesh = new THREE.Mesh().add(model);
						RPM.Scene.Map.current.scene.add(result.object.mesh);
						while (mixerList.length < id + 1)
							mixerList.push(null);
						if (model.animations.length > 0)
						{
							mixerList[id] = new THREE.AnimationMixer(model);
							if (result.object.isHero)
								mixerList[0] = mixerList[id];
						}
						console.log("Loaded JSON model \"" + filename + "\"!");
					}
					else
						console.log("Couldn't change mesh of map object with ID " + id.toString());
				}, RPM.Core.ReactionInterpreter.currentObject);
				busy = false;
			},
			function (xhr)
			{
				console.log("Loading JSON model \"" + filename + "\"...");
			},
			function (error)
			{
				console.log("Error loading JSON model \"" + filename + "\": " + error.toString());
				busy = false;
			}
		);
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Reset bounding box",
function resetBB(id)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(resetBB, 16, id);
	else
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
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set bounding box",
function setBB(id, x, y, z, rotate)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(setBB, 16, id, x, y, z, rotate);
	else
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
					result.object.boundingBoxSettings.b[0] = [0, y * 0.5, 0, x, y, z, rotate ? 45 : 0, 0, 0];
					result.object.updateBB(result.object.position);
				}
			}, RPM.Core.ReactionInterpreter.currentObject);
		}
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set scale",
function setScale(id, scale)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(setScale, 16, id, scale);
	else
	{
		const model = getModel(id);
		if (!!model)
			model.scale.set(scale, scale, scale);
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set visibility",
function setVisibility(id, enabled)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(setVisibility, 16, id, enabled);
	else
	{
		const model = getModel(id);
		if (!!model)
			model.visible = enabled;
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set offset",
function setPosition(id, x, y, z)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(setPosition, 16, id, x, y, z);
	else
	{
		const model = getModel(id);
		if (!!model)
			model.position.set(x, y + new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()).y * 0.5, z);
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set rotation",
function setRotation(id, x, y, z)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(setRotation, 16, id, x, y, z);
	else
	{
		const model = getModel(id);
		if (!!model)
			model.rotation.set(x * Math.PI / 180.0, y * Math.PI / 180.0, z * Math.PI / 180.0);
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Add rotation",
function rotate(id, x, y, z)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(rotate, 16, id, x, y, z);
	else
	{
		const model = getModel(id);
		if (!model)
			return;
		model.rotateX(x * Math.PI / 180.0);
		model.rotateY(y * Math.PI / 180.0);
		model.rotateZ(z * Math.PI / 180.0);
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Retrieve Y rotation",
function getRotation(id, prop)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(getRotation, 16, id, prop);
	else if (model)
		RPM.Core.ReactionInterpreter.currentObject.properties[prop] = model.rotation.y * 180.0 / Math.PI;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Look at",
function lookAt(objID, tgtID)
{
	if (objID == -1)
		objID = RPM.Core.ReactionInterpreter.currentObject.id;
	if (tgtID == -1)
		tgtID = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(lookAt, 16, objID, tgtID);
	else
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
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Play animation",
function playAnim(id, name, loop)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(playAnim, 16, id, name, loop);
	else
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
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Stop animation",
function stopAnim(id)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(stopAnim, 16, id);
	else if (!!mixerList[id])
		mixerList[id].stopAllAction();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set animation speed",
function setSpeed(id, speed)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(setSpeed, 16, id, speed);
	else if (!!mixerList[id])
		mixerList[id].timeScale = speed;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Get model info",
function getInfo(filename)
{
	if (busy)
		setTimeout(getInfo, 16, filename);
	else
	{
		busy = true;
		loader.load
		(
			filename,
			function (gltf)
			{
				const size = new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3());
				var str = "Size:\n\n";
				str += "   X: " + size.x.toFixed(3) + "\n";
				str += "   Y: " + size.z.toFixed(3) + "\n";
				str += "   Z: " + size.y.toFixed(3) + "\n";
				str += "\nAnimations list:\n\n";
				for (var i = 0; i < gltf.animations.length; i++)
					str += "   " + gltf.animations[i].name + "\n";
				alert(str);
				busy = false;
			},
			function (xhr)
			{

			},
			function (error)
			{
				alert("Error loading JSON model \"" + filename + "\": " + error.toString());
				busy = false;
			}
		);
	}
});