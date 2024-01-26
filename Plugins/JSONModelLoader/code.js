import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "JSON Model Loader";
const inject = RPM.Manager.Plugins.inject;

const mixerList = [];
const clock = new THREE.Clock();
const loader = new THREE.ObjectLoader();
loader.setPath(RPM.Manager.Plugins.getParameter(pluginName, "Models directory path"));

var busy = false;

setInterval(function ()
{
	for (var i = 0; i < mixerList.length; i++)
		if (!!mixerList[i])
			mixerList[i].update(clock.getDelta() * mixerList[i].timeScale);
}, 16);

function enableCastShadows(model, enable)
{
	model.castShadow = enable;
	for (var i = 0; i < model.children.length; i++)
		enableCastShadows(model.children[i], enable);
}

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

RPM.Manager.Plugins.registerCommand(pluginName, "Load model", (id, filename) =>
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	busy = true;
	loader.load(
		filename,
		function (model)
		{
			for (var i = 0; i < model.children.length; i++)
				if (model.children[i].isLight)
					model.remove(model.children[i--]);
			enableCastShadows(model, true);
			RPM.Core.MapObject.search(id, (result) =>
			{
				if (!!result)
				{
					result.object.currentStateInstance.graphicID = 0;
					result.object.currentStateInstance.graphicKind = 10;
					RPM.Scene.Map.current.scene.remove(result.object.mesh);
					result.object.mesh = new THREE.Group().add(model);
					RPM.Scene.Map.current.scene.add(result.object.mesh);
					while (mixerList.length < id + 1)
						mixerList.push(null);
					if (model.animations.length > 0)
						mixerList[id] = new THREE.AnimationMixer(model);
					console.log("Loaded JSON model \"" + filename + "\"!");
				}
				else
					console.log("Couldn't find map object with ID " + id.toString());
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
});

RPM.Manager.Plugins.registerCommand(pluginName, "Toggle cast shadows", 
function toggleShadows(id, enable)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(toggleShadows, 16, id, enable);
	else
	{
		const model = getModel(id);
		if (!!model)
			enableCastShadows(model, enable);
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set pixel offset",
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
			model.position.set(x, y, z);
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set scale",
function setScale(id, x, y, z)
{
	if (id == -1)
		id = RPM.Core.ReactionInterpreter.currentObject.id;
	if (busy)
		setTimeout(setScale, 16, id, x, y, z);
	else
	{
		const model = getModel(id);
		if (!!model)
			model.scale.set(x, y, z);
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
		model.rotation.set(0, 0, 0);
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
			mixerList[id].clipAction(anim).setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce).play();
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
