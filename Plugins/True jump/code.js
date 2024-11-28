import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "True jump";

const up = new THREE.Vector3(0, 1, 0);
const down = new THREE.Vector3(0, -1, 0);
const timeout = 10;

function checkCollisions(obj, v0, pos)
{
	const raycaster = new THREE.Raycaster();
	var intersect = null;

	// get bounding boxes and meshes from map portion
	obj.updateBBPosition(pos);
	const m = RPM.Scene.Map.current;
	const p = RPM.Core.Position.createFromVector3(pos);
	const mp = m.getMapPortionByPosition(p);
	if (!mp)
		return true;
	const b = obj.boundingBoxSettings.b;
	const dir = v0.clone().normalize();
	const obstacles = [];
	obstacles.push(mp.staticFloorsMesh);
	for (var i = 0; i < mp.staticAutotilesList.length; i++)
		if (!!mp.staticAutotilesList[i] && !!mp.staticAutotilesList[i][0].mesh)
			obstacles.push(mp.staticAutotilesList[i][0].mesh);
	for (var i = 0; i < mp.staticMountainsList.length; i++)
		if (!!mp.staticMountainsList[i].mesh)
			obstacles.push(mp.staticMountainsList[i].mesh);
	for (var i = 0; i < mp.staticWallsList.length; i++)
		obstacles.push(mp.staticWallsList[i]);
	for (var i = 0; i < mp.staticObjects3DList.length; i++)
		obstacles.push(mp.staticObjects3DList[i]);

	var result = RPM.Manager.Collisions.checkObjectsRay(pos, obj);
	if (!!result && result[0])
		return true;
	for (var i = 0; i < obj.meshBoundingBox.length; i++)
	{
		// default collision test for sprites, plus a command to subtract the travelled distance
		obj.currentBoundingBox = obj.meshBoundingBox[i];
		result = RPM.Manager.Collisions.checkSprites(mp, p, [], obj);
		if (!!result && result[0])
		{
			obj.position.sub(v0);
			return true;
		}

		// raycast based collision chekcs. add 1 to y to avoid a bug where the character "sinks" in the ground
		const origin = obj.position.clone().add(new THREE.Vector3(b[i][0], b[i][1] + 1, b[i][2]));

		// an approximation to avoid unnecessary calculations
		const xz = Math.sqrt(Math.pow(b[i][3], 2) + Math.pow(b[i][5], 2)) / 2;

		// branch into horizontal and vertical movement
		if (v0.y != 0)
		{
			// vertical check. start at the center of the box
			raycaster.far = v0.length() + b[i][4] / 2 + 1;
			raycaster.set(origin, dir);
			intersect = raycaster.intersectObjects(obstacles);
			if (intersect.length > 0)
				return true;
		}
		else
		{
			// horizontal check. start at base, middle and top of the object's collision box, horizontally centered
			raycaster.far = v0.length() + xz + 1;
			const v = origin.clone();
			v.y -= b[i][4];
			for (var j = 0; j < 3; j++)
			{
				v.y += b[i][4] / 2;
				raycaster.set(v, dir);
				intersect = raycaster.intersectObjects(obstacles);
				if (intersect.length > 0)
				{
					//obj.position.sub(v0);
					return true;
				}
			}
		}
	}
	return false;
}

function moveHorizontal(obj, v0, time)
{
	const pos = obj.position.clone().add(v0);
	const orig = obj.position.clone();
    const m = RPM.Scene.Map.current;
	const mp = m.mapProperties;
	const s = RPM.Datas.Systems.SQUARE_SIZE;

	// add map loop compatibility
	var blocked = false;
	if (!m.mapLoopPlugin_loopX)
	{
		if (pos.x < 0 || pos.x >= mp.length * s)
			blocked = true;
	}
	else
	{
		if (pos.x < 0)
		{
			pos.x += mp.length * s;
			obj.position.x += mp.length * s;
		}
		if (pos.x >= mp.length * s)
		{
			pos.x -= mp.length * s;
			obj.position.x -= mp.length * s;
		}
	}
	if (!m.mapLoopPlugin_loopZ)
	{
		if (pos.z < 0 || pos.z >= mp.width * s)
			blocked = true;
	}
	else
	{
		if (pos.z < 0)
		{
			pos.z += mp.width * s;
			obj.position.z += mp.width * s;
		}
		if (pos.z >= mp.width * s)
		{
			pos.z -= mp.width * s;
			obj.position.z -= mp.width * s;
		}
	}

	if (!blocked && !checkCollisions(obj, v0, pos))
	{
		obj.position = pos;
		if (RPM.Core.Game.current.playTime.time < time)
			setTimeout(moveHorizontal, timeout, obj, v0, time);
	}
	else
		obj.position = orig;
	obj.updateBBPosition(obj.position);
}

function moveVertical(obj, prop, flag, vy, a)
{
	const v0 = new THREE.Vector3(0, vy, 0);
	const fpos = obj.position.clone().add(v0);
	if (fpos.y < 0)
		prop[flag] = false;
	else if (!checkCollisions(obj, v0, fpos))
	{
		obj.position = fpos;
		setTimeout(moveVertical, timeout, obj, prop, flag, vy - a, a);
	}
	else if (vy > 0)
		setTimeout(moveVertical, timeout, obj, prop, flag, -a, a);
	else
		prop[flag] = false;
	obj.updateBBPosition(obj.position);
}

RPM.Manager.Plugins.registerCommand(pluginName, "Jump", (id, propFlag, x, z, peak, time, iniSpd, camera) =>
{
	RPM.Core.MapObject.search(id, (result) =>
	{
		time *= 1000 / timeout;
		const prop = RPM.Core.ReactionInterpreter.currentObject.properties;
		prop[propFlag] = true;
		const v0 = new THREE.Vector3(x, 0, z).normalize().applyAxisAngle(down, (camera ? RPM.Scene.Map.current.camera.horizontalAngle * Math.PI / 180 : -Math.PI / 2) + Math.PI / 2);
		v0.multiplyScalar(iniSpd * result.object.speed.getValue() * RPM.Core.MapObject.SPEED_NORMAL * RPM.Datas.Systems.SQUARE_SIZE * RPM.Manager.Stack.averageElapsedTime);
		setTimeout(moveVertical, 1, result.object, prop, propFlag, peak / time, peak / (time * time));
		setTimeout(moveHorizontal, timeout, result.object, v0, RPM.Core.Game.current.playTime.time + time * timeout);
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Fall", (id, propFlag, gravity) =>
{
	RPM.Core.MapObject.search(id, (result) =>
	{
		const prop = RPM.Core.ReactionInterpreter.currentObject.properties;
		if (!checkCollisions(result.object, down, result.object.position.clone().add(down)))
		{
			prop[propFlag] = true;
			setTimeout(moveVertical, 1, result.object, prop, propFlag, 0, gravity);
		}
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Maneuver", (id, x, z, spd, camera) =>
{
	RPM.Core.MapObject.search(id, (result) =>
	{
		const v = new THREE.Vector3(x, 0, z).normalize().applyAxisAngle(down, (camera ? RPM.Scene.Map.current.camera.horizontalAngle * Math.PI / 180 : -Math.PI / 2) + Math.PI / 2);
		v.multiplyScalar(spd * result.object.speed.getValue() * RPM.Core.MapObject.SPEED_NORMAL * RPM.Datas.Systems.SQUARE_SIZE * RPM.Manager.Stack.averageElapsedTime);
		setTimeout(moveHorizontal, 1, result.object, v, 0);
	}, RPM.Core.ReactionInterpreter.currentObject);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Check ground", (id, prop) =>
{
	RPM.Core.MapObject.search(id, (result) =>
	{
		RPM.Core.ReactionInterpreter.currentObject.properties[prop] = checkCollisions(result.object, down, result.object.position.clone().add(down));
	}, RPM.Core.ReactionInterpreter.currentObject);
});
