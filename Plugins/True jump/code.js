import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "True jump";

const up = new THREE.Vector3(0, 1, 0);
const down = new THREE.Vector3(0, -1, 0);
const timeout = 10;

function checkCollisions(obj, v0, pos, mountains = true)
{
	const p0 = RPM.Core.Position.createFromVector3(obj.position);
	const p1 = RPM.Core.Position.createFromVector3(pos);
	const mp = RPM.Scene.Map.current.getMapPortionByPosition(p0);
	obj.updateBBPosition(pos);
	var r;
	for (var i = 0; i < obj.meshBoundingBox.length; i++)
	{
		obj.currentBoundingBox = obj.meshBoundingBox[i];
		r = RPM.Manager.Collisions.checkSprites(mp, p1, pos, [], obj);
		if (!!r && r[0])
			return true;
		if (mountains)
		{
			r = RPM.Manager.Collisions.checkMountains(mp, p1, pos, [], obj);
			if (!!r && r[0])
				return true;
		}
		if (RPM.Manager.Collisions.checkLands(mp, p0, p1, obj, v0, []) || RPM.Manager.Collisions.checkObjects3D(mp, p1, pos, [], obj))
			return true;
		r = RPM.Manager.Collisions.checkObjectsRay(pos, obj);
		if (!!r && r[0])
			return true;
	}
	return false;
}

function moveHorizontal(obj, v0, time)
{
	const pos = obj.position.clone().add(v0);
	const m = RPM.Scene.Map.current.mapProperties;
	const s = RPM.Datas.Systems.SQUARE_SIZE;
	if (pos.x >= 0 && pos.x < m.length * s && pos.z >= 0 && pos.z < m.width * s && !checkCollisions(obj, v0, pos))
	{
		obj.position = pos;
		if (RPM.Core.Game.current.playTime.time < time)
			setTimeout(moveHorizontal, timeout, obj, v0, time);
	}
	obj.updateBBPosition(obj.position);
}

// do horizontal and vertical movement separately
function moveVertical(obj, prop, flag, vy, a)
{
	const raycaster = new THREE.Raycaster();

	// find bounding box height, defined by b[i][4] in its settings
	var yMax = 0;
	if (vy > 0)
		for (var i = 0; i < obj.meshBoundingBox.length; i++)
			if (yMax < obj.boundingBoxSettings.b[i][4])
				yMax = obj.boundingBoxSettings.b[i][4];

	// get floor and mountain meshes from map portion
	const p = RPM.Core.Position.createFromVector3(obj.position);
	const mp = RPM.Scene.Map.current.getMapPortionByPosition(p);
	const origin = obj.position.clone();
	origin.y += 1;
	raycaster.set(origin, (vy > 0 ? up : down));
	const obstacles = [];
	obstacles.push(mp.staticFloorsMesh);
	for (var i = 0; i < mp.staticMountainsList.length; i++)
		if (!!mp.staticMountainsList[i].mesh)
			obstacles.push(mp.staticMountainsList[i].mesh);
	const intersect = raycaster.intersectObjects(obstacles);
	var keepGoing = true;
	if (intersect.length > 0 && intersect[0].distance < Math.abs(vy) + yMax + 1)
	{
		obj.position.y = intersect[0].point.y;

		// if object is going up (jumping), keep going as if it reached the peak (vy = 0)
		if (vy > 0)
			vy = 0;
		else
			keepGoing = false;
	}

	// if no relevant intersection, call function recursively with timeout. otherwise, set jumping flag to off
	if (keepGoing)
	{
		const v0 = new THREE.Vector3(0, vy, 0);
		const pos = obj.position.clone().add(v0);
		if (!checkCollisions(obj, v0, pos, false))
		{
			obj.position.y += vy;
			setTimeout(moveVertical, timeout, obj, prop, flag, vy - a, a);
		}
		else
			prop[flag] = false;
	}
	else
		prop[flag] = false;
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
		prop[propFlag] = true;
		setTimeout(moveVertical, 1, result.object, prop, propFlag, 0, gravity);
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
		const raycaster = new THREE.Raycaster();
		const p = RPM.Core.Position.createFromVector3(result.object.position);
		const mp = RPM.Scene.Map.current.getMapPortionByPosition(p);
		const origin = result.object.position.clone();
		origin.y += 1;
		raycaster.set(origin, down);
		const obstacles = [];
		obstacles.push(mp.staticFloorsMesh);
		for (var i = 0; i < mp.staticMountainsList.length; i++)
			if (!!mp.staticMountainsList[i].mesh)
				obstacles.push(mp.staticMountainsList[i].mesh);
		const intersect = raycaster.intersectObjects(obstacles);
		RPM.Core.ReactionInterpreter.currentObject.properties[prop] = (intersect.length > 0 && intersect[0].distance < 2);
	}, RPM.Core.ReactionInterpreter.currentObject);
});
