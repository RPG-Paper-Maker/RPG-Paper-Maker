import { RPM } from "../path.js"

const pluginName = "Move in all directions";
const inject = RPM.Manager.Plugins.inject;

function mod(x, m)
{
	const r = x % m;
	return r < 0 ? r + m : r;
}

function moveMapObj(id, dir, camera)
{
	if (RPM.Scene.Map.current.isBattleMap)
		return;
	RPM.Core.MapObject.search(id, (result) =>
	{
		if (!!result)
		{
			const cam = RPM.Scene.Map.current.camera;
			const angle = cam.getHorizontalAngle(cam.getThreeCamera().position, cam.targetPosition);
			const dist = Math.min(1, result.object.speed.getValue() * RPM.Core.MapObject.SPEED_NORMAL * RPM.Manager.Stack.averageElapsedTime) * RPM.Datas.Systems.SQUARE_SIZE;
			result.object.move(RPM.Common.Enum.Orientation.South, dist * Math.cos(dir * Math.PI / 180), 270 + (camera ? angle : -90), camera);
			result.object.move(RPM.Common.Enum.Orientation.South, dist * Math.sin(dir * Math.PI / 180), 180 + (camera ? angle : -90), camera);
			if (!result.object.currentStateInstance.directionFix)
			{
				if (camera)
					result.object.lookAt(mod(Math.round(180 - dir / 90) + RPM.Scene.Map.current.camera.getMapOrientation() - 3, 4));
				else
					result.object.lookAt(mod(Math.round(180 - dir / 90) - 1, 4));
			}
			RPM.Scene.Map.current.mapProperties.checkRandomBattle();
		}
	}, RPM.Core.ReactionInterpreter.currentObject);
}

RPM.Manager.Plugins.registerCommand(pluginName, "Move 1 step in angle", (id, dir, camera) =>
{
	moveMapObj(id, dir, camera);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Move 1 step in direction", (id, x, y, camera) =>
{
	if (x != 0 || y != 0)
		moveMapObj(id, Math.atan2(-y, x) * 180 / Math.PI, camera);
});
