import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "Mouse lock and raycaster";
const inject = RPM.Manager.Plugins.inject;

const onDownID = RPM.Manager.Plugins.getParameter(pluginName, "Mouse down event ID");
const onUpID = RPM.Manager.Plugins.getParameter(pluginName, "Mouse up event ID");
const onMoveID = RPM.Manager.Plugins.getParameter(pluginName, "Mouse move event ID");
const onWheelID = RPM.Manager.Plugins.getParameter(pluginName, "Mouse wheel event ID");

const raycaster = new THREE.Raycaster();

document.addEventListener("mousedown", (e) =>
{
    if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
    {
        const x = RPM.System.DynamicValue.createNumber(e.clientX);
        const y = RPM.System.DynamicValue.createNumber(e.clientY);
		const b = RPM.System.DynamicValue.createNumber(e.button);
        RPM.Core.Game.current.hero.receiveEvent(null, false, onDownID, [null, x, y, b], RPM.Core.Game.current.heroStates);
    }
});

document.addEventListener("mouseup", (e) =>
{
    if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
    {
        const x = RPM.System.DynamicValue.createNumber(e.clientX);
        const y = RPM.System.DynamicValue.createNumber(e.clientY);
		const b = RPM.System.DynamicValue.createNumber(e.button);
        RPM.Core.Game.current.hero.receiveEvent(null, false, onUpID, [null, x, y, b], RPM.Core.Game.current.heroStates);
    }
});

document.addEventListener("mousemove", (e) =>
{
    if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
    {
        const x = RPM.System.DynamicValue.createNumber(e.movementX);
        const y = RPM.System.DynamicValue.createNumber(e.movementY);
        RPM.Core.Game.current.hero.receiveEvent(null, false, onMoveID, [null, x, y], RPM.Core.Game.current.heroStates);
    }
});

document.addEventListener("wheel", (e) =>
{
    if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
    {
        if (e.deltaY > 0) // scroll down
            RPM.Core.Game.current.hero.receiveEvent(null, false, onWheelID, [null, RPM.System.DynamicValue.createSwitch(true)], RPM.Core.Game.current.heroStates);
        else if (e.deltaY < 0) // scroll up
            RPM.Core.Game.current.hero.receiveEvent(null, false, onWheelID, [null, RPM.System.DynamicValue.createSwitch(false)], RPM.Core.Game.current.heroStates);
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
                if (!!result && result.object.meshBoundingBox.length > 0 && raycaster.ray.intersectsBox(result.object.meshBoundingBox[0].geometry.boundingBox))
                {
                    RPM.Core.Game.current.variables[variable] = i;
                    exitFor = true;
                }
            }, RPM.Core.ReactionInterpreter.currentObject);
            if (exitFor)
                break;
        }
    }
});

RPM.Manager.Plugins.registerCommand(pluginName, "Get object screen position", (id, vx, vy) =>
{
    if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
    {
        if (id === -1)
            id = RPM.Core.ReactionInterpreter.currentObject.id;
        RPM.Core.Game.current.variables[vx] = null;
        RPM.Core.Game.current.variables[vy] = null;
        RPM.Core.MapObject.search(id, (result) =>
        {
            if (!!result && !!result.object.mesh)
            {
                const v = new THREE.Vector3();
                const w = window.innerWidth;
                const h = window.innerHeight;
                const p = result.object.position;
                result.object.mesh.updateMatrixWorld();
                v.setFromMatrixPosition(result.object.mesh.matrixWorld);
                v.project(RPM.Scene.Map.current.camera.getThreeCamera());
                RPM.Core.Game.current.variables[vx] =  (v.x + 1) * w / 2;
                RPM.Core.Game.current.variables[vy] = -(v.y - 1) * h / 2;
            }
        }, RPM.Core.ReactionInterpreter.currentObject);
    }
});

RPM.Manager.Plugins.registerCommand(pluginName, "Lock pointer", () =>
{
    document.requestPointerLock();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Unlock pointer", () =>
{
    document.exitPointerLock();
});
