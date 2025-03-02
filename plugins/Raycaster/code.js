import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "Raycaster";
const inject = RPM.Manager.Plugins.inject;

const onClickID  = RPM.Manager.Plugins.getParameter(pluginName, "Single click event ID");
const onDClickID = RPM.Manager.Plugins.getParameter(pluginName, "Double click event ID");
const onDownID   = RPM.Manager.Plugins.getParameter(pluginName, "Mouse down event ID");
const onUpID     = RPM.Manager.Plugins.getParameter(pluginName, "Mouse up event ID");
const onMoveID   = RPM.Manager.Plugins.getParameter(pluginName, "Mouse move event ID");
const onWheelID  = RPM.Manager.Plugins.getParameter(pluginName, "Mouse wheel event ID");

const raycaster = new THREE.Raycaster();

document.addEventListener("click", (e) =>
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		const x = RPM.System.DynamicValue.createNumber(e.clientX);
		const y = RPM.System.DynamicValue.createNumber(e.clientY);
		const b = RPM.System.DynamicValue.createNumber(e.button);
		RPM.Manager.Events.sendEventDetection(null, -1, false, onClickID, [null, x, y, b]);
	}
});

document.addEventListener("dblclick", (e) =>
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		const x = RPM.System.DynamicValue.createNumber(e.clientX);
		const y = RPM.System.DynamicValue.createNumber(e.clientY);
		RPM.Manager.Events.sendEventDetection(null, -1, false, onDClickID, [null, x, y]);
	}
});

document.addEventListener("mousedown", (e) =>
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		const x = RPM.System.DynamicValue.createNumber(e.clientX);
		const y = RPM.System.DynamicValue.createNumber(e.clientY);
		const b = RPM.System.DynamicValue.createNumber(e.button);
		RPM.Manager.Events.sendEventDetection(null, -1, false, onDownID, [null, x, y, b]);
	}
});

document.addEventListener("mouseup", (e) =>
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		const x = RPM.System.DynamicValue.createNumber(e.clientX);
		const y = RPM.System.DynamicValue.createNumber(e.clientY);
		const b = RPM.System.DynamicValue.createNumber(e.button);
		RPM.Manager.Events.sendEventDetection(null, -1, false, onUpID, [null, x, y, b]);
	}
});

document.addEventListener("mousemove", (e) =>
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		const x = RPM.System.DynamicValue.createNumber(e.clientX);
		const y = RPM.System.DynamicValue.createNumber(e.clientY);
		RPM.Manager.Events.sendEventDetection(null, -1, false, onMoveID, [null, x, y]);
	}
});

document.addEventListener("wheel", (e) =>
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		if (e.deltaY > 0) // scroll down
			RPM.Manager.Events.sendEventDetection(null, -1, false, onWheelID, [null, RPM.System.DynamicValue.createSwitch(true)]);
		else if (e.deltaY < 0) // scroll up
			RPM.Manager.Events.sendEventDetection(null, -1, false, onWheelID, [null, RPM.System.DynamicValue.createSwitch(false)]);
	}
});

RPM.Manager.Plugins.registerCommand(pluginName, "Get object on cursor", (variable, x, y) =>
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		x =  (x / document.innerWidth)  * 2 - 1;
		y = -(y / document.innerHeight) * 2 + 1;
		raycaster.setFromCamera(new THREE.Vector2(x, y), RPM.Scene.Map.current.camera.perspectiveCamera);
		RPM.Core.Game.current.variables[variable] = -1;
		for (var i = 1; i < RPM.Scene.Map.current.maxObjectsID + 1; i++)
		{
			var exitFor = false;
			if (!RPM.Scene.Map.current.allObjects[i])
				continue;
			RPM.Core.MapObject.search(i, (result) =>
			{
				if (!!result)
				{
					if (result.object.meshBoundingBox.length > 0)
					{
						if (raycaster.ray.intersectsBox(result.object.meshBoundingBox[0].geometry.boundingBox))
						{
							RPM.Core.Game.current.variables[variable] = i;
							exitFor = true;
						}
					}
				}
			}, RPM.Core.ReactionInterpreter.currentObject);
			if (exitFor)
				break;
		}
	}
});
