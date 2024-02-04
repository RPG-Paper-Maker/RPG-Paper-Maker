import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "Raycaster";
const inject = RPM.Manager.Plugins.inject;

const raycaster = new THREE.Raycaster();

const onClickID  = RPM.Manager.Plugins.getParameter(pluginName, "Single click event ID");
const onDClickID = RPM.Manager.Plugins.getParameter(pluginName, "Double click event ID");
const onDownID   = RPM.Manager.Plugins.getParameter(pluginName, "Mouse down event ID");
const onUpID     = RPM.Manager.Plugins.getParameter(pluginName, "Mouse up event ID");
const onMoveID   = RPM.Manager.Plugins.getParameter(pluginName, "Mouse move event ID");
const onWheelID  = RPM.Manager.Plugins.getParameter(pluginName, "Mouse wheel event ID");

window.addEventListener("click", onClick);
function onClick(e)
{
	if (!!RPM.Scene.Map.current && !RPM.Scene.Map.current.loading)
	{
		const x = RPM.System.DynamicValue.createNumber(e.clientX);
		const y = RPM.System.DynamicValue.createNumber(e.clientY);
		const b = RPM.System.DynamicValue.createNumber(e.button);
		RPM.Manager.Events.sendEventDetection(null, -1, false, onClickID, [null, x, y]);
	}
}

window.addEventListener("dblclick", onDoubleClick);
function onDoubleClick(e)
{
	if (!!RPM.Scene.Map.current && !RPM.Scene.Map.current.loading)
	{
		const x = RPM.System.DynamicValue.createNumber(e.clientX);
		const y = RPM.System.DynamicValue.createNumber(e.clientY);
		RPM.Manager.Events.sendEventDetection(null, -1, false, onDClickID, [null, x, y]);
	}
}

window.addEventListener("mousedown", onMouseDown);
function onMouseDown(e)
{
	if (!!RPM.Scene.Map.current && !RPM.Scene.Map.current.loading)
	{
		const x = RPM.System.DynamicValue.createNumber(e.clientX);
		const y = RPM.System.DynamicValue.createNumber(e.clientY);
		const b = RPM.System.DynamicValue.createNumber(e.button);
		RPM.Manager.Events.sendEventDetection(null, -1, false, onDownID, [null, x, y]);
	}
}

window.addEventListener("mouseup", onMouseUp);
function onMouseUp(e)
{
	if (!!RPM.Scene.Map.current && !RPM.Scene.Map.current.loading)
	{
		const x = RPM.System.DynamicValue.createNumber(e.clientX);
		const y = RPM.System.DynamicValue.createNumber(e.clientY);
		const b = RPM.System.DynamicValue.createNumber(e.button);
		RPM.Manager.Events.sendEventDetection(null, -1, false, onUpID, [null, x, y]);
	}
}

window.addEventListener("mousemove", onMouseMove);
function onMouseMove(e)
{
	if (!!RPM.Scene.Map.current && !RPM.Scene.Map.current.loading)
	{
		const x = RPM.System.DynamicValue.createNumber(e.clientX);
		const y = RPM.System.DynamicValue.createNumber(e.clientY);
		RPM.Manager.Events.sendEventDetection(null, -1, false, onMoveID, [null, x, y]);
	}
}

window.addEventListener("wheel", onWheel);
function onWheel(e)
{
	if (!!RPM.Scene.Map.current && !RPM.Scene.Map.current.loading)
	{
		if (e.deltaY > 0) // scroll down
			RPM.Manager.Events.sendEventDetection(null, -1, false, onWheelID, [null, RPM.System.DynamicValue.createSwitch(true)]);
		else if (e.deltaY < 0) // scroll up
			RPM.Manager.Events.sendEventDetection(null, -1, false, onWheelID, [null, RPM.System.DynamicValue.createSwitch(false)]);
	}
}

RPM.Manager.Plugins.registerCommand(pluginName, "Get object on cursor", (prop, x, y) =>
{
	var obj = [];
	var bbx = new THREE.Group();
	x =  (x / window.innerWidth)  * 2 - 1;
	y = -(y / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(new THREE.Vector2(x, y), RPM.Scene.Map.current.camera.perspectiveCamera);
	RPM.Core.ReactionInterpreter.currentObject.properties[prop] = -1;
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
						RPM.Core.ReactionInterpreter.currentObject.properties[prop] = i;
						exitFor = true;
					}
				}
			}
		}, RPM.Core.ReactionInterpreter.currentObject);
		if (exitFor)
			break;
	}
});
