const pluginName = 'Hide object on block view';

const customOffset = new THREE.Vector3(0, 0, 0);

var eraseRadius = Manager.Plugins.getParameter(pluginName, 'Erase radius variable ID');
var eraseFloor = Manager.Plugins.getParameter(pluginName, 'Filter tileset variable ID');
var eraseMount = Manager.Plugins.getParameter(pluginName, 'Filter mountains variable ID');
var eraseWalls = Manager.Plugins.getParameter(pluginName, 'Filter walls variable ID');
var eraseObj3D = Manager.Plugins.getParameter(pluginName, 'Filter 3D objects variable ID');
var offsetY = Manager.Plugins.getParameter(pluginName, 'Y offset variable ID');
var wallsList = [];
var mountList = [];
var obj3dList = [];
var lastMap = null;
var target = false;

const extraVert =
	'\
varying vec3 viewBlockPlugin_vPos;\n\
varying vec3 viewBlockPlugin_fragPos;\n\
varying vec3 viewBlockPlugin_vNormal;\n\
varying vec3 viewBlockPlugin_camPos;\n\n\
void main ()\n\
{\n\
	viewBlockPlugin_fragPos = position;\n\
	viewBlockPlugin_vPos = vec3(inverse(viewMatrix) * modelViewMatrix * vec4(position, 1.0));\n\
	viewBlockPlugin_vNormal = normal;\n\
	viewBlockPlugin_camPos = cameraPosition;\n\
';
const extraFrag =
	'\
uniform vec3 viewBlockPlugin_tgtPos;\n\
uniform float viewBlockPlugin_radius;\n\
uniform float viewBlockPlugin_squareSize;\n\
uniform float viewBlockPlugin_isFloor;\n\
varying vec3 viewBlockPlugin_camPos;\n\
varying vec3 viewBlockPlugin_vPos;\n\
varying vec3 viewBlockPlugin_vNormal;\n\n\
varying vec3 viewBlockPlugin_fragPos;\n\
void main ()\n\
{\n\
	if (viewBlockPlugin_radius > 0.0)\n\
	{\n\
		vec3 viewBlockPlugin_v1 = viewBlockPlugin_tgtPos - viewBlockPlugin_camPos;\n\
		vec3 viewBlockPlugin_v2 = viewBlockPlugin_vPos - viewBlockPlugin_camPos;\n\
		float viewBlockPlugin_openingAngle = atan(viewBlockPlugin_radius * viewBlockPlugin_squareSize, length(viewBlockPlugin_v1));\n\
		if (acos(dot(normalize(viewBlockPlugin_v1), normalize(viewBlockPlugin_v2))) < viewBlockPlugin_openingAngle)\n\
		{\n\
			if (length(viewBlockPlugin_v2.xz) < length(viewBlockPlugin_v1.xz) + viewBlockPlugin_squareSize / 2.0 - 1.0)\n\
			{\n\
				if (viewBlockPlugin_isFloor == 0.0)\n\
					discard;\n\
				else if (length(viewBlockPlugin_vNormal.xz) > 0.0 || viewBlockPlugin_fragPos.y > 1.5 * viewBlockPlugin_squareSize)\n\
					discard;\n\
			}\n\
		}\n\
	}\n\
';

setInterval(function () {
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading) {
		if (Scene.Map.current !== lastMap) {
			wallsList = [];
			mountList = [];
			obj3dList = [];
			const mp = Scene.Map.current.mapPortions;
			for (var i = 0; i < mp.length; i++) {
				if (!!mp[i]) {
					const walls = mp[i].staticWallsList;
					const mount = mp[i].staticMountainsList;
					const obj3d = mp[i].staticObjects3DList;
					for (var j = 0; j < walls.length; j++) if (!!walls[j]) wallsList.push(walls[j]);
					for (const [, m] of mount) {
						m.mesh.material.side = THREE.DoubleSide;
						mountList.push(m.mesh);
					}
					for (var j = 0; j < obj3d.length; j++) if (!!obj3d[j]) obj3dList.push(obj3d[j]);
				}
			}
			const v = Core.Game.current.variables;
			if (v.get(eraseFloor) !== false && v.get(eraseFloor) !== true) v.set(eraseFloor, false);
			if (v.get(eraseMount) !== false && v.get(eraseMount) !== true) v.set(eraseMount, true);
			if (v.get(eraseWalls) !== false && v.get(eraseWalls) !== true) v.set(eraseWalls, true);
			if (v.get(eraseObj3D) !== false && v.get(eraseObj3D) !== true) v.set(eraseObj3D, true);
			if (isNaN(v.get(eraseRadius)) || v.get(eraseRadius) < 0.5) v.set(eraseRadius, 2);
			lastMap = Scene.Map.current;
		}
		for (var i = 0; i <= Scene.Map.current.mapProperties.maxObjectsID; i++) {
			const obj = Scene.Map.current.mapProperties.allObjects.get(i);
			if (!!obj) {
				if (obj.x >= Scene.Map.current.mapProperties.length) continue;
				if (obj.y >= Scene.Map.current.mapProperties.height) continue;
				if (obj.z >= Scene.Map.current.mapProperties.width) continue;
				Core.MapObject.search(
					i,
					(result) => {
						if (!!result && !!result.object.mesh) {
							result.object.mesh.viewBlockPlugin_isMapObj = true;
							if (!result.object.mesh.viewBlockPlugin_erase)
								result.object.mesh.viewBlockPlugin_erase = false;
						}
					},
					null,
				); //Core.ReactionInterpreter.currentObject);
			}
		}
	}
}, 1000);

Scene.Map.prototype.updateCameraHiding = function (pointer) {
	const v = Core.Game.current.variables;
	customOffset.set(0, v.get(offsetY), 0);
	const c = this.scene.children;
	for (var i = 1; i < c.length; i++) {
		if (!c[i].material || !c[i].material.userData || !c[i].material.userData.uniforms) continue;
		c[i].material.userData.uniforms.viewBlockPlugin_radius = { value: 0 };
	}
	const dir = (target ? this.camera.target.position : Core.Game.current.hero.position)
		.clone()
		.add(new THREE.Vector3(0, 0.5 * Data.Systems.SQUARE_SIZE, 0))
		.sub(this.camera.getThreeCamera().position);
	while (dir.y < 0) {
		dir.y += 0.01;
		Manager.GL.raycaster.set(this.camera.getThreeCamera().position, dir.normalize());
		const intersects = Manager.GL.raycaster.intersectObjects(c);
		for (var i = 0; i < intersects.length; i++) {
			if (intersects[i].object === Core.Game.current.hero.mesh) continue;
			if (!intersects[i].object.material.userData || !intersects[i].object.material.userData.uniforms) continue;
			if (Math.ceil(intersects[i].distance) + 5 < this.camera.distance) {
				const w = wallsList.includes(intersects[i].object);
				const m = mountList.includes(intersects[i].object);
				const o = obj3dList.includes(intersects[i].object);
				const e = !!intersects[i].object.viewBlockPlugin_isMapObj;
				if (
					(v.get(eraseMount) && m) ||
					(v.get(eraseWalls) && w) ||
					(v.get(eraseObj3D) && o) ||
					(e && intersects[i].object.viewBlockPlugin_erase) ||
					(v.get(eraseFloor) && !w && !m && !e && !o)
				) {
					intersects[i].object.material.userData.uniforms.viewBlockPlugin_isFloor = {
						value: w || m || e || o ? 0 : 1,
					};
					intersects[i].object.material.userData.uniforms.viewBlockPlugin_radius = { value: v.get(eraseRadius) };
					intersects[i].object.material.userData.uniforms.viewBlockPlugin_squareSize = {
						value: Data.Systems.SQUARE_SIZE,
					};
					intersects[i].object.material.userData.uniforms.viewBlockPlugin_tgtPos = {
						value: (target ? this.camera.target.position : Core.Game.current.hero.position)
							.clone()
							.add(this.camera.targetOffset)
							.add(customOffset),
					};
				}
			}
		}
	}
};

function overwriteShaders() {
	if (
		!!Manager.GL.SHADER_FIX_VERTEX &&
		!!Manager.GL.SHADER_FIX_FRAGMENT
	) {
		const vertFix = Manager.GL.SHADER_FIX_VERTEX;
		const vertFixBegin = vertFix.search(/void\smain\((void)*\)/);
		const vertFixEnd = vertFix.indexOf('{', vertFixBegin) + 1;
		const fragFix = Manager.GL.SHADER_FIX_FRAGMENT;
		const fragFixBegin = fragFix.search(/void\smain\((void)*\)/);
		const fragFixEnd = fragFix.indexOf('{', fragFixBegin) + 1;
		if (
			vertFixBegin < 0 ||
			vertFixEnd < 0 ||
			fragFixBegin < 0 ||
			fragFixEnd < 0
		) {
			Common.Platform.showErrorMessage(
				'There is an error in your shader files. Fix it before you can use this plugin.',
			);
			Common.Platform.quit();
		}
		Manager.GL.SHADER_FIX_VERTEX = vertFix.substr(0, vertFixBegin) + extraVert + vertFix.substr(vertFixEnd);
		Manager.GL.SHADER_FIX_FRAGMENT = fragFix.substr(0, fragFixBegin) + extraFrag + fragFix.substr(fragFixEnd);
	} else setTimeout(overwriteShaders, 33);
}
overwriteShaders();

Manager.Plugins.registerCommand(pluginName, 'Filter map object', (id, erase) => {
	Core.MapObject.search(
		id,
		(result) => {
			if (!!result && !!result.object.mesh) result.object.mesh.viewBlockPlugin_erase = erase;
		},
		Core.ReactionInterpreter.currentObject,
	);
});

Manager.Plugins.registerCommand(pluginName, 'Follow camera', (enable) => {
	target = enable;
});
