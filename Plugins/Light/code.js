import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "Light";
const inject = RPM.Manager.Plugins.inject;

const path = RPM.Common.Paths.PLUGINS + pluginName + "/shaders/";

var lightList = [];

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
		for (var i = 0; i < lightList.length; i++)
		{
			if (lightList[i].isDirectionalLight)
			{
				const x = lightList[i].extraStuff.x;
				const y = lightList[i].extraStuff.y;
				const z = lightList[i].extraStuff.z;
				console.log(x, y, z);
				lightList[i].target.position.copy(RPM.Scene.Map.current.camera.targetPosition);
				lightList[i].target.updateMatrixWorld();
				lightList[i].position.set(x, y, z).multiplyScalar(RPM.Datas.Systems.SQUARE_SIZE * 20).add(RPM.Scene.Map.current.camera.targetPosition);
				const d = RPM.Scene.Map.current.camera.distance * 8;
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
	const vert = await RPM.Common.IO.openFile(path + "toon.vert");
	const frag = await RPM.Common.IO.openFile(path + "toon.frag");
	RPM.Manager.GL.SHADER_FIX_VERTEX = vert;
	RPM.Manager.GL.SHADER_FIX_FRAGMENT = frag;
	RPM.Manager.GL.SHADER_FACE_VERTEX = vert;
	RPM.Manager.GL.SHADER_FACE_FRAGMENT = frag;
	RPM.Manager.GL.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
};

function enableCastShadows(mesh, enable)
{
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
	if (!RPM.Core.ReactionInterpreter.currentObject.mesh)
		return;
	const children = RPM.Core.ReactionInterpreter.currentObject.mesh.children;
	const props = RPM.Core.ReactionInterpreter.currentObject.properties;
	for (var i = 0; i < children.length; i++)
		if (lightList.indexOf(children[i]) >= 0)
			props[startFrom++] = children[i];
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
		if (scene.children[i].isDirectionalLight && lightList.indexOf(scene.children[i]) < 0)
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
		if (scene.children[i].isAmbientLight && lightList.indexOf(scene.children[i]) < 0)
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
	light.shadow.mapSize.width = 8192;
	light.shadow.mapSize.height = 8192;
	light.shadow.camera.far = RPM.Datas.Systems.SQUARE_SIZE * 350;
	light.shadow.bias = -0.00002;
	light.shadow.normalBias = 0.65 * RPM.Datas.Systems.SQUARE_SIZE / 16;
	if (prop > 0)
		RPM.Core.ReactionInterpreter.currentObject.properties[prop] = light;
	RPM.Scene.Map.current.scene.add(light);
	lightList.push(light);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Add point light", (prop, id, x, y, z, intensity, color, radius, castShadow) =>
{
	const light = new THREE.PointLight(color.color, intensity);
	light.shadow.bias = -0.001;
	light.shadow.normalBias = 0.375 * RPM.Datas.Systems.SQUARE_SIZE / 16;
	light.distance = limitDistance(radius * RPM.Datas.Systems.SQUARE_SIZE);
	light.position.set(x * RPM.Datas.Systems.SQUARE_SIZE, y * RPM.Datas.Systems.SQUARE_SIZE, z * RPM.Datas.Systems.SQUARE_SIZE);
	light.castShadow = castShadow;
	RPM.Core.MapObject.search(id, (result) =>
	{
		if (!!result)
		{
			if (!result.object.mesh)
			{
				result.object.mesh = new THREE.Mesh();
				RPM.Scene.Map.current.scene.add(result.object.mesh);
			}
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
	light.shadow.bias = -0.0000005;
	light.shadow.normalBias = 0.75 * RPM.Datas.Systems.SQUARE_SIZE / 16;
	light.penumbra = 1.0;
	light.distance = limitDistance(distance * RPM.Datas.Systems.SQUARE_SIZE);
	RPM.Core.MapObject.search(id, (result) =>
	{
		if (!!result)
		{
			if (!result.object.mesh)
			{
				result.object.mesh = new THREE.Mesh();
				RPM.Scene.Map.current.scene.add(result.object.mesh);
			}
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
		if (!!result)
			light.target = result.object.mesh;
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set spotlight angle", (prop, id) =>
{
	const light = RPM.Core.ReactionInterpreter.currentObject.properties[prop];
	if (!light.isSpotLight)
		return;
	light.angle = angle * Math.PI / 180.0;
});
