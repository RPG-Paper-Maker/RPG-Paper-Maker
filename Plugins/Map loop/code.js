import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "Map loop";

const dummy = new THREE.Object3D();

// had to change a core function to be able to loop upon reaching an edge
RPM.Core.MapObject.prototype.getFuturPosition = function (orientation, distance, angle)
{
	var position = new THREE.Vector3(this.previousPosition.x, this.previousPosition.y, this.previousPosition.z);
	const w = RPM.Scene.Map.current.mapProperties.length * RPM.Datas.Systems.SQUARE_SIZE;
	const h = RPM.Scene.Map.current.mapProperties.width * RPM.Datas.Systems.SQUARE_SIZE;
	const lx = RPM.Scene.Map.current.mapLoopPlugin_loopX;
	const lz = RPM.Scene.Map.current.mapLoopPlugin_loopZ;
	
	var xPlus, zPlus, res;
	if (orientation === RPM.Common.Enum.Orientation.South || this.previousOrientation === RPM.Common.Enum.Orientation.South)
	{
		xPlus = distance * RPM.Common.Mathf.cos(angle * Math.PI / 180.0);
		zPlus = distance * RPM.Common.Mathf.sin(angle * Math.PI / 180.0);
		futurePosAux(position, position.x - xPlus, position.z - zPlus, w, h, lx, lz);
	}
	if (orientation === RPM.Common.Enum.Orientation.West || this.previousOrientation === RPM.Common.Enum.Orientation.West)
	{
		xPlus = distance * RPM.Common.Mathf.cos((angle - 90.0) * Math.PI / 180.0);
		zPlus = distance * RPM.Common.Mathf.sin((angle - 90.0) * Math.PI / 180.0);
		futurePosAux(position, position.x + xPlus, position.z + zPlus, w, h, lx, lz);
	}
	if (orientation === RPM.Common.Enum.Orientation.North || this.previousOrientation === RPM.Common.Enum.Orientation.North)
	{
		xPlus = distance * RPM.Common.Mathf.cos(angle * Math.PI / 180.0);
		zPlus = distance * RPM.Common.Mathf.sin(angle * Math.PI / 180.0);
		futurePosAux(position, position.x + xPlus, position.z + zPlus, w, h, lx, lz);
	}
	if (orientation === RPM.Common.Enum.Orientation.East || this.previousOrientation === RPM.Common.Enum.Orientation.East)
	{
		xPlus = distance * RPM.Common.Mathf.cos((angle - 90.0) * Math.PI / 180.0);
		zPlus = distance * RPM.Common.Mathf.sin((angle - 90.0) * Math.PI / 180.0);
		futurePosAux(position, position.x - xPlus, position.z - zPlus, w, h, lx, lz);
	}
	// Collision
	this.updateBBPosition(position);
	var yMountain = null;
	var blocked = false;
	var o = RPM.Common.Enum.Orientation.None;
	var i, l, result;
	for (i = 0, l = this.meshBoundingBox.length; i < l; i++)
	{
		this.currentBoundingBox = this.meshBoundingBox[i];
		result = RPM.Manager.Collisions.checkRay(this.position, position, this, this.boundingBoxSettings.b[i]);
		if (result[1] !== null)
			yMountain = result[1];
		if (result[0] || result[0] === null)
		{
			blocked = result[0];
			if (blocked === null)
			{
				o = result[2];
				continue;
			}
		}
	}
	if (blocked || blocked === null && yMountain !== null)
		position = this.position.clone();
	/* If not blocked and possible Y up/down, check if there is no collision on top */
	if (!blocked && yMountain !== null)
	{
		position.setY(yMountain);
		this.updateBBPosition(position);
		for (i = 0, l = this.meshBoundingBox.length; i < l; i++)
		{
			this.currentBoundingBox = this.meshBoundingBox[i];
			result = RPM.Manager.Collisions.checkRay(this.position, position, this, this.boundingBoxSettings.b[i], true);
			if (result[0])
			{
				position = this.position;
				break;
			}
		}
	}
	this.updateBBPosition(this.position);
	return [position, blocked === null && yMountain !== null, o];
};

function futurePosAux(p, x, z, w, h, lx, lz)
{
	if (lx)
	{
		if (x < 0)
			x += w;
		else if (x >= w)
			x -= w;
	}
	if (x >= 0 && x < w)
		p.setX(x);
	if (lz)
	{
		if (z < 0)
			z += h;
		else if (z >= h)
			z -= h;
	}
	if (z >= 0 && z < h)
		p.setZ(z);
}

function isSpecialMesh(mesh)
{
	return (mesh.isInstancedMesh || mesh.isSkinnedMesh || mesh.isLight || mesh.isWater || mesh.isSky);
}

function isInScene(mesh)
{
	if (!mesh)
		return false;
	if (mesh.parent === RPM.Scene.Map.current.scene)
		return true;
	if (isInScene(mesh.parent))
		return true;
	return false;
}

function updateInstances(mesh, pos = new THREE.Vector3(0, 0, 0), rot = new THREE.Euler(0, 0, 0, "XYZ"), scale = new THREE.Vector3(1, 1, 1))
{
	const m = RPM.Scene.Map.current;
	if (mesh.mapLoopPlugin_isClone || mesh === RPM.Core.Game.current.hero.mesh || mesh === m.mapProperties.skyboxMesh || isSpecialMesh(mesh))
		return;
	const x = RPM.Datas.Systems.SQUARE_SIZE * m.mapProperties.length;
	const z = RPM.Datas.Systems.SQUARE_SIZE * m.mapProperties.width;
	pos.add(mesh.position);
	rot.set(rot.x + mesh.rotation.x, rot.y + mesh.rotation.y, rot.z + mesh.rotation.z, "XYZ");
	scale.multiply(mesh.scale);
	if (mesh.mapLoopPlugin_isGLTFRoot || mesh.lightsPlugin_isLightGroup)
	{
		// instanced skinned meshes were getting too tangled in the scene graph
		// fuck skeleton and bone local/world matrices
		// just teleport skinned meshes to the closest edge
		var mj = 0;
		var mk = 0;
		var md = -1;
		const p = mesh.children[0].position;
		const px = p.x + pos.x - mesh.position.x;
		const py = p.x + pos.y - mesh.position.y;
		const pz = p.x + pos.z - mesh.position.z;
		for (var j = 0; j < 3; j++)
		{
			for (var k = 0; k < 3; k++)
			{
				dummy.position.set((1 - j) * x + px, py, (1 - k) * z + pz);
				const d = dummy.position.distanceTo(RPM.Core.Game.current.hero.position);
				if (d < md || md === -1)
				{
					md = d;
					mj = j;
					mk = k;
				}
			}
		}
		if (!m.mapLoopPlugin_loopX)
			mj = 1;
		if (!m.mapLoopPlugin_loopZ)
			mk = 1;
		mesh.position.set((1 - mj) * x, 0, (1 - mk) * z);
		if (mesh.lightsPlugin_isLightGroup)
			for (var i = 0; i < mesh.children.length; i++)
				if (mesh.children[i].isSpotLight)
					mesh.children[i].target.position.set((1 - mj) * x, 0, (1 - mk) * z);
	}
	else
	{
		if (!mesh.isGroup)
		{
			if (!mesh.mapLoopPlugin_hasClone)
			{
				const inst = new THREE.InstancedMesh(mesh.geometry, mesh.material, 8);
				inst.morphTargetInfluences = mesh.morphTargetInfluences;
				inst.customDepthMaterial = mesh.customDepthMaterial;
				inst.vertexColors = mesh.vertexColors;
				inst.mapLoopPlugin_isClone = mesh;
				mesh.mapLoopPlugin_hasClone = inst;
				m.scene.add(inst);
			}
			const inst = mesh.mapLoopPlugin_hasClone;
			var i = 0;
			dummy.rotation.copy(rot);
			for (var j = 0; j < 3; j++)
			{
				for (var k = 0; k < 3; k++)
				{
					if (j * 3 + k === 4)
						continue;
					else
					{
						if ((!m.mapLoopPlugin_loopX && j !== 1) || (!m.mapLoopPlugin_loopZ && k !== 1))
							dummy.scale.set(0, 0, 0);
						else
							dummy.scale.copy(scale);
						dummy.position.set((1 - j) * x + pos.x, pos.y, (1 - k) * z + pos.z);
						dummy.updateMatrix();
						inst.setMatrixAt(i++, dummy.matrix);
					}
				}
			}
			inst.instanceMatrix.needsUpdate = true;
			inst.castShadow = mesh.castShadow;
			inst.receiveShadow = mesh.receiveShadow;
			inst.customDistanceMaterial = mesh.customDistanceMaterial;
		}
		for (var i = 0; i < mesh.children.length; i++)
			updateInstances(mesh.children[i], pos.clone(), rot.clone(), scale.clone());
	}
}

setInterval(function ()
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		const m = RPM.Scene.Map.current;
		for (var i = 0; i < m.scene.children.length; i++)
		{
			if (m.scene.children[i].mapLoopPlugin_isClone && !isInScene(m.scene.children[i].mapLoopPlugin_isClone))
				m.scene.remove(m.scene.children[i--]);
			else
				updateInstances(m.scene.children[i]);
		}
	}
}, 16);

RPM.Manager.Plugins.registerCommand(pluginName, "Set map loop", (x, z) =>
{
	const m = RPM.Scene.Map.current;
	m.mapLoopPlugin_loopX = x;
	m.mapLoopPlugin_loopZ = z;
});
