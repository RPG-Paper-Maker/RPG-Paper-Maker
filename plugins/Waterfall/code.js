// https://codesandbox.io/p/sandbox/funny-lake-7rkse

const pluginName = 'Waterfall';

let Particle = null;
let ParticleSystem = null;
(async () => {
	const result = Common.Interpreter.evaluate(
		await Common.Platform.loadFile(Common.Paths.PLUGINS + pluginName + '/ParticleSystem.js'),
		{
			addReturn: false,
		},
	);
	Particle = result.Particle;
	ParticleSystem = result.ParticleSystem;
})();

const loader = new THREE.TextureLoader();
const path = Common.Paths.PLUGINS + pluginName + '/';
const noiseMap = loader.load(path + 'textures/noise.jpg');
const dudvMap = loader.load(path + 'textures/dudv.png');

var shadersLoaded = false;
var vert = null;
var frag = null;
var waterfallList = [];
var particlesList = [];
var lastMap = null;
var emissionTime = 0;
var nextEmissionTime = 0;
var t0 = 0;
var t1 = 0;

noiseMap.wrapS = noiseMap.wrapT = THREE.RepeatWrapping;
noiseMap.minFilter = THREE.NearestFilter;
noiseMap.magFilter = THREE.NearestFilter;
dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;

async function init() {
	vert = await Common.Platform.loadFile(path + 'shaders/waterfall.vert');
	frag = await Common.Platform.loadFile(path + 'shaders/waterfall.frag');
	shadersLoaded = true;
}
init();

setInterval(function () {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		if (Scene.Map.current !== lastMap) {
			waterfallList = [];
			particlesList = [];
			lastMap = Scene.Map.current;
		}
		t0 = t1;
		t1 = Core.Game.current.playTime.time;
		for (var i = 0; i < particlesList.length; i++) updateParticles(particlesList[i], t1 - t0);
		for (var i = 0; i < waterfallList.length; i++) waterfallList[i].material.uniforms.time.value = t1;
	}
}, 16);

setInterval(function () {
	for (var i = 0; i < particlesList.length; i++)
		if (particlesList[i]._instancedMesh.parent === null || particlesList[i]._instancedMesh.parent.parent === null)
			particlesList.splice(i, 1);
	for (var i = 0; i < waterfallList.length; i++)
		if (waterfallList[i].parent === null || waterfallList[i].parent.parent === null) waterfallList.splice(i, 1);
}, 1000);

function newParticleSystem(color, radius, height, shape) {
	const particleSystem = new ParticleSystem();
	particleSystem.radius = radius;
	particleSystem.height = height;
	particleSystem.shape = shape;
	const particleGeometry = new THREE.SphereBufferGeometry(1, 16, 8).toNonIndexed();
	const particleMaterial = new THREE.MeshBasicMaterial({ color: color, alphaMap: noiseMap });
	const str1 = 'vec3 transformed = vec3(position);\ntransformed.y += t * 0.25;\nvT = t;';
	const str2 = 'float dissolve = abs(sin(1.0 - vT)) - texture2D(alphaMap, vUv).g;\nif (dissolve < 0.01) discard;';
	particleMaterial.onBeforeCompile = function (shader) {
		shader.vertexShader = 'attribute float t;\nvarying float vT;\n' + shader.vertexShader;
		shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', str1);
		shader.fragmentShader = 'varying float vT;\n' + shader.fragmentShader;
		shader.fragmentShader = shader.fragmentShader.replace('#include <alphamap_fragment>', str2);
	};
	particleSystem.init(particleGeometry, particleMaterial, 250);
	return particleSystem;
}

function updateParticles(particleSystem, delta) {
	delta *= 0.001;
	emissionTime += delta;
	if (emissionTime > nextEmissionTime) {
		const particle = new Particle();
		const r = particleSystem.radius;
		const h = particleSystem.height;
		const s = particleSystem.shape;
		const particlePerSecond = (50 * r) / Data.Systems.SQUARE_SIZE;
		const t = 1 / particlePerSecond;
		nextEmissionTime = emissionTime + t / 2 + (t / 2) * Math.random();
		const rand = Math.random();
		switch (s) {
			case 2:
				const rx = Math.round(Math.random() * 2 - 1);
				const rz = Math.round(Math.random() * 2 - 1);
				const rr = Math.round(Math.random());
				const rs = Math.round(Math.random()) === 0 ? -r : r;
				particle.position.x = rr === 1 ? (rand - 0.5) * r * 2 : rs;
				particle.position.y = 0;
				particle.position.z = rr === 0 ? (rand - 0.5) * r * 2 : rs;
				break;
			case 4:
				particle.position.x = (rand - 0.5) * r * 2;
				particle.position.y = 0;
				particle.position.z = 0;
				break;
			default:
				particle.position.x = Math.sin(2 * Math.PI * rand) * r;
				particle.position.y = 0;
				particle.position.z = Math.cos(2 * Math.PI * rand) * r;
		}
		particle.size = (Math.random() * 0.25 + 0.5) * (h * 0.05 + r * 0.1);
		particle.lifetime = Math.random() * 0.2 + 0.5;
		particleSystem.add(particle);
	}
	particleSystem.update(delta);
}

function createWaterfall(
	id,
	diameter,
	height,
	shape,
	speed,
	topDark,
	bottomDark,
	topLight,
	bottomLight,
	foamColor,
	addFoam,
	opacity,
) {
	if (shadersLoaded && Scene.Map.current === lastMap) {
		Core.MapObject.search(
			id,
			(result) => {
				const r = (diameter * Data.Systems.SQUARE_SIZE) / 2;
				const h = height * Data.Systems.SQUARE_SIZE;
				const u = {
					time: { value: 0 },
					speed: { value: speed },
					tNoise: { value: noiseMap },
					tDudv: { value: dudvMap },
					topDarkColor: { value: topDark.color },
					bottomDarkColor: { value: bottomDark.color },
					topLightColor: { value: topLight.color },
					bottomLightColor: { value: bottomLight.color },
					foamColor: { value: foamColor.color },
					opacity: { value: 1.0 },
				};
				const m = new THREE.ShaderMaterial({
					uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['fog'], u]),
					vertexShader: vert,
					fragmentShader: frag,
					fog: true,
					side: h < 0 ? THREE.DoubleSide : THREE.FrontSide,
				});
				var w;
				switch (shape) {
					case 2:
						w = new THREE.Mesh(new THREE.BoxBufferGeometry(r * 2, h * 1.1, r * 2), m);
						break;
					case 3:
						w = new THREE.Mesh(new THREE.SphereBufferGeometry(r), m);
						break;
					case 4:
						w = new THREE.Mesh(new THREE.PlaneBufferGeometry(r * 2, h * 1.1), m);
						m.side = THREE.DoubleSide;
						break;
					default:
						w = new THREE.Mesh(new THREE.CylinderBufferGeometry(r, r, h * 1.1, 32, 1, true), m);
				}
				Scene.Map.current.scene.remove(result.object.mesh);
				result.object.mesh = new THREE.Mesh();
				w.position.y += h < 0 ? -h * 0.55 : h * 0.45;
				result.object.mesh.add(w);
				waterfallList.push(w);
				if (addFoam && shape !== 3) {
					const p = newParticleSystem(foamColor.color, r, h, shape);
					result.object.mesh.add(p._instancedMesh);
					particlesList.push(p);
					if (h < 0) p._instancedMesh.position.y -= h;
				}
				Scene.Map.current.scene.add(result.object.mesh);
				result.object.waterfallPlugin_hasWaterfall = true;
			},
			Core.ReactionInterpreter.currentObject,
		);
	} else
		setTimeout(
			createWaterfall,
			32,
			id,
			diameter,
			height,
			shape,
			speed,
			topDark,
			bottomDark,
			topLight,
			bottomLight,
			foamColor,
			addFoam,
			opacity,
		);
}

Manager.Plugins.registerCommand(
	pluginName,
	'Create waterfall',
	(id, diameter, height, shape, speed, topDark, bottomDark, topLight, bottomLight, foamColor, addFoam, opacity) => {
		if (id == -1) id = Core.ReactionInterpreter.currentObject.id;
		createWaterfall(
			id,
			diameter,
			height,
			shape,
			speed,
			topDark,
			bottomDark,
			topLight,
			bottomLight,
			foamColor,
			addFoam,
			opacity,
		);
	},
);

Manager.Plugins.registerCommand(pluginName, 'Set opacity', (id, opacity) => {
	Core.MapObject.search(
		id,
		(result) => {
			console.log(result.object);
			if (!!result.object.waterfallPlugin_hasWaterfall) {
				result.object.mesh.children[0].material.uniforms.opacity.value = opacity;
				result.object.mesh.children[0].material.transparent = true;
			}
		},
		Core.ReactionInterpreter.currentObject,
	);
});
