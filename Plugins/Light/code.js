import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "Light";
const inject = RPM.Manager.Plugins.inject;

const onLoadID = RPM.Manager.Plugins.getParameter(pluginName, "Map load event ID");
const path     = RPM.Manager.Plugins.getParameter(pluginName, "Shaders directory path");
const shader   = RPM.Manager.Plugins.getParameter(pluginName, "Shader");

var lightList = [];
var mapID = 0;

setInterval(function ()
{
	if (!!RPM.Scene.Map.current && !RPM.Scene.Map.current.loading)
		for (var i = 0; i < RPM.Scene.Map.current.scene.children.length; i++)
			if (RPM.Scene.Map.current.scene.children[i].customDepthMaterial != null && !RPM.Scene.Map.current.scene.children[i].customDistanceMaterial)
				RPM.Scene.Map.current.scene.children[i].customDistanceMaterial = new THREE.MeshDistanceMaterial({alphaTest: 0.5, map: RPM.Scene.Map.current.scene.children[i].customDepthMaterial.map});
}, 48);

setInterval(function ()
{
	if (!!RPM.Scene.Map.current && !RPM.Scene.Map.current.loading)
	{
		if (mapID != RPM.Scene.Map.current.id)
		{
			lightList = [];
			mapID = RPM.Scene.Map.current.id;
			RPM.Manager.Events.sendEventDetection(null, -1, false, onLoadID, [null]);
			for (var i = 0; i < RPM.Scene.Map.current.scene.children.length; i++)
			{
				if (RPM.Scene.Map.current.scene.children[i].isDirectionalLight && lightList.indexOf(RPM.Scene.Map.current.scene.children[i]) < 0)
				{
					const light = RPM.Scene.Map.current.scene.children[i];
					light.shadow.bias = -0.00002;
					light.shadow.normalBias = 0.75;
					break;
				}
			}
		}
		for (var i = 0; i < lightList.length; i++)
		{
			if (lightList[i].isDirectionalLight)
			{
				const x = lightList[i].extraStuff.x;
				const y = lightList[i].extraStuff.y;
				const z = lightList[i].extraStuff.z;
				lightList[i].target.position.copy(RPM.Scene.Map.current.camera.targetPosition);
				lightList[i].target.updateMatrixWorld();
				lightList[i].position.set(x, y, z).multiplyScalar(RPM.Datas.Systems.SQUARE_SIZE * 20).add(RPM.Scene.Map.current.camera.targetPosition);
				const d = Math.max(RPM.Datas.Systems.SQUARE_SIZE * RPM.Scene.Map.current.camera.distance / 10, 400);
				if (d !== lightList[i].shadow.camera.right)
				{
					lightList[i].shadow.camera.left = -d;
					lightList[i].shadow.camera.right = d;
					lightList[i].shadow.camera.top = d;
					lightList[i].shadow.camera.bottom = -d;
					lightList[i].shadow.camera.updateProjectionMatrix();
				}
			}
		}
	}
}, 16);

RPM.Manager.GL.load = async function()
{
	const vert = await RPM.Common.IO.openFile(path + shader + ".vert");
	const frag = await RPM.Common.IO.openFile(path + shader + ".frag");
	RPM.Manager.GL.SHADER_FIX_VERTEX    = vert;
	RPM.Manager.GL.SHADER_FIX_FRAGMENT  = frag;
	RPM.Manager.GL.SHADER_FACE_VERTEX   = vert;
	RPM.Manager.GL.SHADER_FACE_FRAGMENT = frag;
};

function enableCastShadows(mesh, enable)
{
	console.log(mesh);
	if (!mesh.isScene)
		mesh.castShadow = enable;
	for (var i = 0; i < mesh.children.length; i++)
		enableCastShadows(mesh.children[i], enable);
}

function enableReceiveShadows(mesh, enable)
{
	if (!mesh.isScene)
		mesh.receiveShadow = enable;
	for (var i = 0; i < mesh.children.length; i++)
		enableReceiveShadows(mesh.children[i], enable);
}

RPM.Manager.Plugins.registerCommand(pluginName, "Remove all lights", () =>
{
	for (var i = 0; i < lightList.length; i++)
	{
		RPM.Scene.Map.current.scene.remove(lightList[i]);
		lightList[i].dispose();
	}
	lightList = [];
});

RPM.Manager.Plugins.registerCommand(pluginName, "Remove default directional light", () =>
{
	for (var i = 0; i < RPM.Scene.Map.current.scene.children.length; i++)
	{
		if (RPM.Scene.Map.current.scene.children[i].isDirectionalLight && lightList.indexOf(RPM.Scene.Map.current.scene.children[i]) < 0)
		{
			RPM.Scene.Map.current.scene.remove(RPM.Scene.Map.current.scene.children[i]);
			break;
		}
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Remove light", (prop) =>
{
	var light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (!!light)
	{
		lightList.splice(lightList.indexOf(light), 1);
		light.parent.remove(light);
		light.dispose();
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Enable/disable light", (prop, enabled) =>
{
	var light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (!!light)
		light.visible = enabled;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set ambient light", (intensity, color) =>
{
	for (var i = 0; i < RPM.Scene.Map.current.scene.children.length; i++)
	{
		if (RPM.Scene.Map.current.scene.children[i].isAmbientLight && lightList.indexOf(RPM.Scene.Map.current.scene.children[i]) < 0)
		{
			RPM.Scene.Map.current.scene.children[i].intensity = intensity;
			RPM.Scene.Map.current.scene.children[i].color = color.color;
			break;
		}
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Add hemisphere light", (prop, intensity, colorTop, colorBottom) =>
{
	const light = new THREE.HemisphereLight(colorBottom.color, colorTop.color, intensity);
	if (prop > 0)
		RPM.Core.ReactionInterpreter.currentObject.properties[prop] = light;
	RPM.Scene.Map.current.scene.add(light);
	lightList.push(light);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Add directional light", (prop, x, y, z, intensity, color, castShadow) =>
{
	const light = new THREE.DirectionalLight(color.color, intensity);
	light.extraStuff = new THREE.Vector3(x, y, z).normalize();
	light.castShadow = castShadow;
	light.shadow.mapSize.width = 8192;
	light.shadow.mapSize.height = 8192;
	light.shadow.camera.far = RPM.Datas.Systems.SQUARE_SIZE * 350;
	light.shadow.bias = -0.00002;
	light.shadow.normalBias = 0.75;
	if (prop > 0)
		RPM.Core.ReactionInterpreter.currentObject.properties[prop] = light;
	RPM.Scene.Map.current.scene.add(light);
	lightList.push(light);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Add point light", (prop, id, x, y, z, intensity, color, radius, castShadow) =>
{
	const light = new THREE.PointLight(color.color, intensity);
	light.shadow.bias = -0.001;
	light.shadow.normalBias = 0.25;
	light.distance = radius * RPM.Datas.Systems.SQUARE_SIZE;
	light.position.set(x * RPM.Datas.Systems.SQUARE_SIZE, y * RPM.Datas.Systems.SQUARE_SIZE, z * RPM.Datas.Systems.SQUARE_SIZE);
	light.castShadow = castShadow;
	RPM.Core.MapObject.search(id, (result) =>
	{
		if (!!result)
		{
			result.object.mesh.add(light);
			if (prop > 0)
				RPM.Core.ReactionInterpreter.currentObject.properties[prop] = light;
			lightList.push(light);
		}
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Add spotlight", (prop, id, x, y, z, intensity, color, angle, distance, castShadow) =>
{
	const light = new THREE.SpotLight(color.color, intensity);
	light.position.set(x * RPM.Datas.Systems.SQUARE_SIZE, y * RPM.Datas.Systems.SQUARE_SIZE, z * RPM.Datas.Systems.SQUARE_SIZE);
	light.castShadow = castShadow;
	light.angle = angle * Math.PI / 180.0;
	light.shadow.bias = -0.00001;
	light.shadow.normalBias = 0.75;
	light.penumbra = 1.0;
	light.distance = distance * RPM.Datas.Systems.SQUARE_SIZE;
	RPM.Core.MapObject.search(id, (result) =>
	{
		if (!!result)
		{
			result.object.mesh.add(light);
			light.target = result.object.mesh;
			if (prop > 0)
				RPM.Core.ReactionInterpreter.currentObject.properties[prop] = light;
			lightList.push(light);
		}
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set light color", (prop, color) =>
{
	var light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	light.color = color.color;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set hemisphere light colors", (prop, colorTop, colorBottom) =>
{
	var light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (!light.isHemisphereLight)
		return;
	// for some reason, they are reversed
	light.skyColor = colorBottom.color;
	light.groundColor = colorTop.color;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set light intensity", (prop, intensity) =>
{
	var light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	light.intensity = intensity;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set light cast shadow", (prop, castShadow) =>
{
	var light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (light.isHemisphereLight)
		return;
	light.castShadow = castShadow;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set object cast shadow", (id, castShadow) =>
{
	RPM.Core.MapObject.search(id, (result) =>
	{
		if (!!result)
			enableCastShadows(result.object.mesh, castShadow);
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set object receive shadow", (id, receiveShadow) =>
{
	RPM.Core.MapObject.search(id, (result) =>
	{
		if (!!result)
			enableReceiveShadows(result.object.mesh, receiveShadow);
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set light position", (prop, x, y, z) =>
{
	var light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (light.isHemisphereLight)
		return;
	if (light.isDirectionalLight)
		light.extraStuff.set(x, y, z);
	else
		light.position.set(x * RPM.Datas.Systems.SQUARE_SIZE, y * RPM.Datas.Systems.SQUARE_SIZE, z * RPM.Datas.Systems.SQUARE_SIZE);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set spotlight target", (prop, id) =>
{
	var light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (!light.isSpotLight)
		return;
	RPM.Core.MapObject.search(id, (result) =>
	{
		if (!!result)
			light.target = result.object.mesh;
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set spotlight angle", (prop, id) =>
{
	var light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (!light.isSpotLight)
		return;
	light.angle = angle * Math.PI / 180.0;
});
