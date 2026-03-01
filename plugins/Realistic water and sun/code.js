const pluginName = 'Realistic water and sun';

let Sky = null;
let Water = null;
(async () => {
	Sky = Common.Interpreter.evaluate(await Common.Platform.loadFile(Common.Paths.PLUGINS + pluginName + '/Sky.js'), {
		addReturn: false,
	});
	Water = Common.Interpreter.evaluate(
		await Common.Platform.loadFile(Common.Paths.PLUGINS + pluginName + '/Water.js'),
		{
			addReturn: false,
		},
	);
})();
const clock = new THREE.Timer();
const sun = new THREE.Vector3();
const waterList = [];

setInterval(function () {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		clock.update();
		const delta = clock.getDelta();
		for (var i = 0; i < waterList.length; i++) {
			if (waterList[i].parent !== Scene.Map.current.scene) waterList.splice(i, 1);
			else waterList[i].material.uniforms['time'].value += delta;
		}
	}
}, 16);

Manager.Plugins.registerCommand(pluginName, 'Create water surface', (variable, x, y, z, length, width, color) => {
	if (length === 0) length = Scene.Map.current.mapProperties.length;
	if (width === 0) width = Scene.Map.current.mapProperties.width;
	const water = new Water(
		new THREE.PlaneGeometry(length * Data.Systems.SQUARE_SIZE, width * Data.Systems.SQUARE_SIZE),
		{
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load(
				Common.Paths.PLUGINS + pluginName + '/waternormals.jpg',
				function (texture) {
					texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				},
			),
			sunDirection: sun.normalize(),
			sunColor: 0xffffff,
			waterColor: color.color,
			distortionScale: 3.7,
			fog: false, //scene.fog !== undefined
		},
	);
	water.rotation.x = -Math.PI / 2.0;
	water.material.transparent = true;
	water.material.opacity = 0.5;
	water.position.set(
		(x + length / 2.0) * Data.Systems.SQUARE_SIZE,
		y * Data.Systems.SQUARE_SIZE,
		(z + width / 2.0) * Data.Systems.SQUARE_SIZE,
	);
	waterList.push(water);
	Scene.Map.current.scene.add(water);
	Core.Game.current.variables.set(variable, water);
});

Manager.Plugins.registerCommand(pluginName, 'Move water surface', (variable, y) => {
	if (waterList.includes(Core.Game.current.variables.get(variable)))
		Core.Game.current.variables.get(variable).position.y = y * Data.Systems.SQUARE_SIZE;
});

Manager.Plugins.registerCommand(pluginName, 'Initialize sky', () => {
	if (!Scene.Map.current.realisticSun) {
		const p = Scene.Map.current.mapProperties;
		const m = Math.max(p.length, p.width, p.depth, p.height);
		const sky = new Sky();
		Scene.Map.current.realisticSun = sky;
		sky.scale.setScalar(new THREE.Vector3(m, m, m).length() * 2 * Data.Systems.SQUARE_SIZE);
		sky.position.set((p.length * Data.Systems.SQUARE_SIZE) / 2, 0, (p.width * Data.Systems.SQUARE_SIZE) / 2);
		const skyUniforms = sky.material.uniforms;
		skyUniforms['turbidity'].value = 10;
		skyUniforms['rayleigh'].value = 2;
		skyUniforms['mieCoefficient'].value = 0.05;
		skyUniforms['mieDirectionalG'].value = 0.4;
		//		sky.material.uniforms["sunPosition"].value.copy(sun);
		Scene.Map.current.scene.add(sky);
	}
});

Manager.Plugins.registerCommand(pluginName, 'Update sun position', (elevation, azimuth) => {
	if (!!Scene.Map.current.realisticSun) {
		const phi = THREE.MathUtils.degToRad(90 - elevation);
		const theta = THREE.MathUtils.degToRad(azimuth);
		sun.setFromSphericalCoords(1, phi, theta);
		Scene.Map.current.realisticSun.material.uniforms['sunPosition'].value.copy(sun);
		for (var i = 0; i < waterList.length; i++)
			waterList[i].material.uniforms['sunDirection'].value.copy(sun).normalize();
	}
});
