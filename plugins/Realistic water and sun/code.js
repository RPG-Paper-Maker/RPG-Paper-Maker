import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";
import { Water } from "./Water.js";
import { Sky } from "./Sky.js";

const pluginName = "Realistic water and sun";

const clock = new THREE.Clock();
const sun = new THREE.Vector3();
const waterList = [];

setInterval(function ()
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		const delta = clock.getDelta();
		for (var i = 0; i < waterList.length; i++)
		{
			if (waterList[i].parent !== RPM.Scene.Map.current.scene)
				waterList.splice(i, 1);
			else
				waterList[i].material.uniforms["time"].value += delta;
		}
	}
}, 16);

RPM.Manager.Plugins.registerCommand(pluginName, "Create water surface", (variable, x, y, z, length, width, color) =>
{
	if (length === 0)
		length = RPM.Scene.Map.current.mapProperties.length;
	if (width === 0)
		width = RPM.Scene.Map.current.mapProperties.width;
	const water = new Water(new THREE.PlaneGeometry(length * RPM.Datas.Systems.SQUARE_SIZE, width * RPM.Datas.Systems.SQUARE_SIZE),
	{
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: new THREE.TextureLoader().load(RPM.Common.Paths.PLUGINS + pluginName + "/waternormals.jpg", function (texture)
		{
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		}),
		sunDirection: sun.normalize(),
		sunColor: 0xffffff,
		waterColor: color.color,
		distortionScale: 3.7,
		fog: false//scene.fog !== undefined
	});
	water.rotation.x = -Math.PI / 2.0;
	water.material.transparent = true;
	water.material.opacity = 0.5;
	water.position.set((x + length / 2.0) * RPM.Datas.Systems.SQUARE_SIZE, y  * RPM.Datas.Systems.SQUARE_SIZE, (z + width / 2.0) * RPM.Datas.Systems.SQUARE_SIZE);
	waterList.push(water);
	RPM.Scene.Map.current.scene.add(water);
	RPM.Core.Game.current.variables[variable] = water;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Move water surface", (variable, y) =>
{
	if (waterList.includes(RPM.Core.Game.current.variables[variable]))
		RPM.Core.Game.current.variables[variable].position.y = y * RPM.Datas.Systems.SQUARE_SIZE;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Initialize sky", () =>
{
	if (!RPM.Scene.Map.current.realisticSun)
	{
		const p = RPM.Scene.Map.current.mapProperties;
		const m = Math.max(p.length, p.width, p.depth, p.height);
		const sky = new Sky();
		RPM.Scene.Map.current.realisticSun = sky;
		sky.scale.setScalar(new THREE.Vector3(m, m, m).length() * 2 * RPM.Datas.Systems.SQUARE_SIZE);
		sky.position.set(p.length * RPM.Datas.Systems.SQUARE_SIZE / 2, 0, p.width * RPM.Datas.Systems.SQUARE_SIZE / 2);
		const skyUniforms = sky.material.uniforms;
		skyUniforms["turbidity"].value = 10;
		skyUniforms["rayleigh"].value = 2;
		skyUniforms["mieCoefficient"].value = 0.05;
		skyUniforms["mieDirectionalG"].value = 0.4;
//		sky.material.uniforms["sunPosition"].value.copy(sun);
		RPM.Scene.Map.current.scene.add(sky);
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Update sun position", (elevation, azimuth) =>
{
	if (!!RPM.Scene.Map.current.realisticSun)
	{
		const phi = THREE.MathUtils.degToRad(90 - elevation);
		const theta = THREE.MathUtils.degToRad(azimuth);
		sun.setFromSphericalCoords(1, phi, theta);
		RPM.Scene.Map.current.realisticSun.material.uniforms["sunPosition"].value.copy(sun);
		for (var i = 0; i < waterList.length; i++)
			waterList[i].material.uniforms["sunDirection"].value.copy(sun).normalize();
	}
});
