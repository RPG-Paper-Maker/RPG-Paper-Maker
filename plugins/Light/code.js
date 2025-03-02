import { RPM } from "../path.js";
import { THREE } from "../../System/Globals.js";

const pluginName = "Light";

const path = RPM.Common.Paths.PLUGINS + pluginName + "/shaders/";
const rings = RPM.Manager.Plugins.getParameter(pluginName, "Number of light rings");

var lightList = [];
var lastMap = null;

setInterval(function ()
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
		for (var i = 0; i < RPM.Scene.Map.current.scene.children.length; i++)
			if (!!RPM.Scene.Map.current.scene.children[i].customDepthMaterial && !RPM.Scene.Map.current.scene.children[i].customDistanceMaterial)
				RPM.Scene.Map.current.scene.children[i].customDistanceMaterial = new THREE.MeshDistanceMaterial({alphaTest: 0.5, map: RPM.Scene.Map.current.scene.children[i].customDepthMaterial.map});
}, 48);

setInterval(function ()
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		if (RPM.Scene.Map.current !== lastMap)
		{
			for (var i = 0; i < lightList.length; i++)
			{
				if (!lightList[i].parent || !lightList[i].parent.parent)
				{
					lightList[i].dispose();
					lightList.splice(i, 1);
				}
			}
			lastMap = RPM.Scene.Map.current;
		}
		for (var i = 0; i < lightList.length; i++)
		{
			if (lightList[i].isDirectionalLight)
			{
				const x = lightList[i].extraStuff.x;
				const y = lightList[i].extraStuff.y;
				const z = lightList[i].extraStuff.z;
				const d = Math.max(RPM.Datas.Systems.SQUARE_SIZE * RPM.Scene.Map.current.camera.distance / 10, 400);
				lightList[i].target.position.copy(RPM.Scene.Map.current.camera.targetPosition);
				lightList[i].target.updateMatrixWorld();
				lightList[i].position.set(x, y, z).multiplyScalar(d / 2).add(RPM.Scene.Map.current.camera.targetPosition);
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
}, 48);

RPM.Manager.GL.load = async function()
{
	var vert = await RPM.Common.IO.openFile(path + "toon.vert");
	var frag = await RPM.Common.IO.openFile(path + "toon.frag");
	frag = frag.replace("int numberOfRings = 5;", "int numberOfRings = " + rings.toString() + ";");
	RPM.Manager.GL.SHADER_FIX_VERTEX = vert;
	RPM.Manager.GL.SHADER_FIX_FRAGMENT = frag;
	RPM.Manager.GL.SHADER_FACE_VERTEX = vert;
	RPM.Manager.GL.SHADER_FACE_FRAGMENT = frag;
	RPM.Manager.GL.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
};

function enableCastShadows(mesh, enable)
{
	if (mesh.isMesh)
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

function limitDistance(value)
{
	const x = RPM.Scene.Map.current.mapProperties.length;
	const y = RPM.Scene.Map.current.mapProperties.height + RPM.Scene.Map.current.mapProperties.depth;
	const z = RPM.Scene.Map.current.mapProperties.width;
	const h1 = Math.sqrt(x * x + z * z);
	const h2 = Math.sqrt(h1 * h1 + y * y);
	if (value === 0)
		return h2 * RPM.Datas.Systems.SQUARE_SIZE;
	return Math.min(value, h2 * RPM.Datas.Systems.SQUARE_SIZE);
}

RPM.Manager.Plugins.registerCommand(pluginName, "Get local lights", (startFrom) =>
{
	const obj = RPM.Core.ReactionInterpreter.currentObject;
	if (!obj.lightsPlugin_localLights)
		return;
	const children = obj.lightsPlugin_localLights.children;
	for (var i = 0; i < children.length; i++)
		if (lightList.includes(children[i]))
			obj.properties[startFrom++] = children[i];
});

RPM.Manager.Plugins.registerCommand(pluginName, "Reattach lights", () =>
{
	const obj = RPM.Core.ReactionInterpreter.currentObject;
	if (!obj.lightsPlugin_localLights)
		return;
	if (!obj.mesh)
	{
		obj.mesh = new THREE.Mesh();
		RPM.Scene.Map.current.scene.add(obj.mesh);
	}
	if (obj.lightsPlugin_localLights.parent !== obj.mesh)
		obj.mesh.add(obj.lightsPlugin_localLights);
	for (var i = 1; i < obj.properties.length; i++)
		if (lightList.includes(obj.properties[i]) && obj.properties[i].parent !== obj.lightsPlugin_localLights)
			obj.lightsPlugin_localLights.add(obj.properties[i]);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Remove all lights", () =>
{
	for (var i = 0; i < lightList.length; i++)
	{
		lightList[i].parent.remove(lightList[i]);
		lightList[i].dispose();
	}
	lightList = [];
});

RPM.Manager.Plugins.registerCommand(pluginName, "Remove default directional light", () =>
{
	const scene = RPM.Scene.Map.current.scene;
	for (var i = 0; i < scene.children.length; i++)
	{
		if (scene.children[i].isDirectionalLight && !lightList.includes(scene.children[i]))
		{
			scene.remove(scene.children[i]);
			break;
		}
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Remove light", (prop) =>
{
	const light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (!!light)
	{
		lightList.splice(lightList.indexOf(light), 1);
		light.parent.remove(light);
		light.dispose();
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Enable/disable light", (prop, enabled) =>
{
	const light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (!!light)
		light.visible = enabled;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set ambient light", (intensity, color) =>
{
	const scene = RPM.Scene.Map.current.scene;
	for (var i = 0; i < scene.children.length; i++)
	{
		if (scene.children[i].isAmbientLight && !lightList.includes(scene.children[i]))
		{
			scene.children[i].intensity = intensity;
			scene.children[i].color = color.color;
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
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	light.shadow.camera.far = RPM.Datas.Systems.SQUARE_SIZE * 350;
	light.shadow.bias = -0.0002;
	light.shadow.normalBias = 0.65 * RPM.Datas.Systems.SQUARE_SIZE / 16;
	if (prop > 0)
		RPM.Core.ReactionInterpreter.currentObject.properties[prop] = light;
	RPM.Scene.Map.current.scene.add(light);
	lightList.push(light);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Add point light", (prop, id, x, y, z, intensity, color, radius, castShadow) =>
{
	const light = new THREE.PointLight(color.color, intensity, limitDistance(radius * RPM.Datas.Systems.SQUARE_SIZE));
	light.shadow.bias = -0.0001;
	light.shadow.normalBias = 0.44 * RPM.Datas.Systems.SQUARE_SIZE / 16;
	light.position.set(x * RPM.Datas.Systems.SQUARE_SIZE, y * RPM.Datas.Systems.SQUARE_SIZE, z * RPM.Datas.Systems.SQUARE_SIZE);
	light.castShadow = castShadow;
	RPM.Core.MapObject.search(id, (result) =>
	{
		if (!result.object.mesh)
		{
			result.object.mesh = new THREE.Mesh();
			RPM.Scene.Map.current.scene.add(result.object.mesh);
		}
		if (!result.object.lightsPlugin_localLights)
		{
			result.object.lightsPlugin_localLights = new THREE.Group();
			result.object.lightsPlugin_localLights.lightsPlugin_isLightGroup = true;
			result.object.mesh.add(result.object.lightsPlugin_localLights);
		}
		result.object.lightsPlugin_localLights.add(light);
		if (prop > 0)
			RPM.Core.ReactionInterpreter.currentObject.properties[prop] = light;
		lightList.push(light);
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Add spotlight", (prop, id, x, y, z, intensity, color, angle, distance, castShadow) =>
{
	const light = new THREE.SpotLight(color.color, intensity);
	light.position.set(x * RPM.Datas.Systems.SQUARE_SIZE, y * RPM.Datas.Systems.SQUARE_SIZE, z * RPM.Datas.Systems.SQUARE_SIZE);
	light.castShadow = castShadow;
	light.angle = angle * Math.PI / 180.0;
	light.shadow.bias = -0.0000005;
	light.shadow.normalBias = 0.75 * RPM.Datas.Systems.SQUARE_SIZE / 16;
	light.penumbra = 1.0;
	light.distance = limitDistance(distance * RPM.Datas.Systems.SQUARE_SIZE);
	RPM.Core.MapObject.search(id, (result) =>
	{
		if (!result.object.mesh)
		{
			result.object.mesh = new THREE.Mesh();
			RPM.Scene.Map.current.scene.add(result.object.mesh);
		}
		if (!result.object.lightsPlugin_localLights)
		{
			result.object.lightsPlugin_localLights = new THREE.Group();
			result.object.lightsPlugin_localLights.lightsPlugin_isLightGroup = true;
			result.object.mesh.add(result.object.lightsPlugin_localLights);
		}
		result.object.lightsPlugin_localLights.add(light);
		if (!result.object.mesh.lightsPlugin_target)
		{
			const target = new THREE.Object3D();
			result.object.mesh.lightsPlugin_target = target;
			result.object.mesh.add(target);
			light.target = target;
		}
		if (prop > 0)
			RPM.Core.ReactionInterpreter.currentObject.properties[prop] = light;
		lightList.push(light);
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set light color", (prop, color) =>
{
	const light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	light.color = color.color;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set hemisphere light colors", (prop, colorTop, colorBottom) =>
{
	const light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (!light.isHemisphereLight)
		return;
	// for some reason, they are reversed
	light.skyColor = colorBottom.color;
	light.groundColor = colorTop.color;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set light intensity", (prop, intensity) =>
{
	const light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	light.intensity = intensity;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set light cast shadow", (prop, castShadow) =>
{
	const light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
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
	const light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (light.isHemisphereLight)
		return;
	if (light.isDirectionalLight)
		light.extraStuff.set(x, y, z).normalize();
	else
		light.position.set(x * RPM.Datas.Systems.SQUARE_SIZE, y * RPM.Datas.Systems.SQUARE_SIZE, z * RPM.Datas.Systems.SQUARE_SIZE);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set spotlight target", (prop, id) =>
{
	const light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (!light.isSpotLight)
		return;
	RPM.Core.MapObject.search(id, (result) =>
	{
		if (!result.object.mesh)
		{
			result.object.mesh = new THREE.Mesh();
			RPM.Scene.Map.current.scene.add(result.object.mesh);
		}
		if (!result.object.mesh.lightsPlugin_target)
		{
			const target = new THREE.Object3D();
			result.object.mesh.lightsPlugin_target = target;
			result.object.mesh.add(target);
			light.target = target;
		}
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set spotlight angle", (prop, id) =>
{
	const light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (!light.isSpotLight)
		return;
	light.angle = angle * Math.PI / 180.0;
});
