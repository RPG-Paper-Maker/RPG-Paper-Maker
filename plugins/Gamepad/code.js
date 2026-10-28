const pluginName = "Gamepad";

const leftStickEventID = Manager.Plugins.getParameter(pluginName, "Left stick event ID");
const rightStickEventID = Manager.Plugins.getParameter(pluginName, "Right stick event ID");
const deadzone = Manager.Plugins.getParameter(pluginName, "Deadzone variable ID");
const repeatDelay = 30;
const prefix = "GPad.";
const keysNames = ["A", "B", "X", "Y", "LB", "RB", "LT", "RT", "Back", "Start", "L3", "R3", "Up", "Down", "Left", "Right", "Home", "L.Axis.Up", "L.Axis.Down", "L.Axis.Left", "L.Axis.Right", "R.Axis.Up", "R.Axis.Down", "R.Axis.Left", "R.Axis.Right"];
const params = new Map(
[
	[1, Model.DynamicValue.createNumber(0)],
	[2, Model.DynamicValue.createNumberDouble(0)],
	[3, Model.DynamicValue.createNumberDouble(0)]
]);

var leftStickNeutral = true;
var rightStickNeutral = true;

// https://w3c.github.io/gamepad/#remapping
var buttonsList =
[
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];

var axesList =
[
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];

class WaitAsyncOperation extends EventCommand.Base
{
	constructor()
	{
		super();
		this.asyncFinished = false;
	}

	update(currentState)
	{
		return this.asyncFinished;
	}
}

function addCustomWaitCommand()
{
	const c = Core.ReactionInterpreter.currentReaction.currentCommand;
	if (!c.hasCustomWaitCommand)
	{
		c.hasCustomWaitCommand = true;
		const n = c.next;
		c.next = new Core.Node(c.parent, new WaitAsyncOperation());
		c.next.next = n;
	}
	else
		c.next.data.asyncFinished = false;
	return c.next;
}

function getKey(id, k = 0)
{
	if (id >= 0 && id < keysNames.length)
		return prefix + keysNames[id + 4 * k];
	return "Unknown";
}

function sendButton(i, j, isPressed, name)
{
	if (isPressed)
	{
		Common.Inputs.keysPressed.add(name);
		if (buttonsList[i][j] === 0)
		{
			Manager.Stack.onKeyPressed(name);
			if (!Manager.Stack.isLoading())
				Manager.Stack.onKeyPressedAndRepeat(name);
		}
		buttonsList[i][j] = Math.min(buttonsList[i][j] + 1, repeatDelay);
		if (!Manager.Stack.isLoading() && buttonsList[i][j] === repeatDelay)
			Manager.Stack.onKeyPressedAndRepeat(name);
	}
	else
	{
		Common.Inputs.keysPressed.delete(name);
		if (buttonsList[i][j] > 0)
			Manager.Stack.onKeyReleased(name);
		buttonsList[i][j] = 0;
	}
}

setInterval(function ()
{
	if (!Main.loaded || Manager.Stack.isLoading())
		return;
	const gp = navigator.getGamepads();
	if (!Manager.Stack.isLoading())
	{
		for (var i = 0; i < gp.length; i++)
		{
			if (!!gp[i])
			{
				for (var j = 0; j < gp[i].buttons.length; j++)
					sendButton(i, j, gp[i].buttons[j].pressed === true, getKey(j));
				const lh = gp[i].axes[0];
				const lv = gp[i].axes[1];
				const rh = gp[i].axes[2];
				const rv = gp[i].axes[3];
				if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading && !Core.ReactionInterpreter.blockingHero)
				{
					if (Core.Game.current.variables.get(deadzone) === 0)
						Core.Game.current.variables.set(deadzone, 0.15);
					const d = Math.min(Math.max(Core.Game.current.variables.get(deadzone), 0.05), 0.95);
					params.get(1).value = i + 1;
					if (Math.sqrt(lh * lh + lv * lv) > d)
					{
						params.get(2).value = lh;
						params.get(3).value = lv;
						Core.Game.current.hero.receiveEvent(null, false, leftStickEventID, params, Core.Game.current.heroStates);
						leftStickNeutral = false;
					}
					else if (!leftStickNeutral)
					{
						params.get(2).value = 0;
						params.get(3).value = 0;
						Core.Game.current.hero.receiveEvent(null, false, leftStickEventID, params, Core.Game.current.heroStates);
						leftStickNeutral = true;
					}
					if (Math.sqrt(rh * rh + rv * rv) > d)
					{
						params.get(2).value = rh;
						params.get(3).value = rv;
						Core.Game.current.hero.receiveEvent(null, false, rightStickEventID, params, Core.Game.current.heroStates);
						rightStickNeutral = false;
					}
					else if (!rightStickNeutral)
					{
						params.get(2).value = 0;
						params.get(3).value = 0;
						Core.Game.current.hero.receiveEvent(null, false, rightStickEventID, params, Core.Game.current.heroStates);
						rightStickNeutral = true;
					}
					
				}
				sendButton(i + 4, 0, lv < -0.5, getKey(0, 1));
				sendButton(i + 4, 1, lv >  0.5, getKey(1, 1));
				sendButton(i + 4, 2, lh < -0.5, getKey(2, 1));
				sendButton(i + 4, 3, lh >  0.5, getKey(3, 1));
				sendButton(i + 8, 0, rv < -0.5, getKey(0, 2));
				sendButton(i + 8, 1, rv >  0.5, getKey(1, 2));
				sendButton(i + 8, 2, rh < -0.5, getKey(2, 2));
				sendButton(i + 8, 3, rh >  0.5, getKey(3, 2));
			}
			else
			{
				for (var k = 0; k < 3; k++)
				{
					for (var j = 0; j < buttonsList[i + 4 * k].length; j++)
					{
						if (buttonsList[i + 4 * k][j] > 0)
						{
							Common.Inputs.keysPressed.delete(getKey(j, k));
							Manager.Stack.onKeyReleased(getKey(j, k));
						}
						buttonsList[i + 4 * k][j] = 0;
					}
				}
			}
		}
	}
}, 16);

window.addEventListener("gamepadconnected", (e) =>
{
	
});

function moveMapObj(id, dir, withCamera)
{
	if (Scene.Map.current.isBattleMap)
		return;
	Core.MapObject.search(id, (result) =>
	{
		if (!!result)
		{
			const cam = Scene.Map.current.camera;
			const angle = cam.horizontalAngle;
			const dist = Math.min(1, result.object.speed.getValue() * Core.MapObject.SPEED_NORMAL * Manager.Stack.averageElapsedTime);
			result.object.move(Common.ORIENTATION.SOUTH, dist * Math.cos(dir * Math.PI / 180), 270 + (withCamera ? angle : -90), withCamera);
			result.object.move(Common.ORIENTATION.SOUTH, dist * Math.sin(dir * Math.PI / 180), 180 + (withCamera ? angle : -90), withCamera);
			if (!result.object.currentStateInstance.directionFix)
			{
				if (withCamera)
					result.object.lookAt(Common.Mathf.mod(Math.round(180 - dir / 90) + Scene.Map.current.camera.getMapOrientation() - 3, 4));
				else
					result.object.lookAt(Common.Mathf.mod(Math.round(180 - dir / 90) - 1, 4));
			}
			if (result.object == Scene.Map.current.hero)
				Scene.Map.current.mapProperties.checkRandomBattle();
		}
	}, Core.ReactionInterpreter.currentObject);
}

Manager.Plugins.registerCommand(pluginName, "Remove all gamepad assignments", async () =>
{
	const waitCommand = addCustomWaitCommand();
	Data.Settings.kb.forEach((sc, key, map) =>
	{
		for (var i = 0; i < sc.length; i++)
		{
			for (var j = 0; j < sc[i].length; j++)
			{
				if (sc[i][j].indexOf(prefix) === 0)
				{
					sc.splice(i--, 1);
					break;
				}
			}
		}
		if (sc.length === 0)
			map.delete(key);
	});
	await Data.Settings.save();
	waitCommand.data.asyncFinished = true;
});

Manager.Plugins.registerCommand(pluginName, "Add gamepad assignment", async (actionID, key) =>
{
	const waitCommand = addCustomWaitCommand();
	Data.Keyboards.get(actionID).sc.push([prefix + key]);
	await Data.Settings.save();
	waitCommand.data.asyncFinished = true;
});

Manager.Plugins.registerCommand(pluginName, "Remove ALL custom assignments", async () =>
{
	const waitCommand = addCustomWaitCommand();
	Data.Settings.kb.clear()
	await Data.Settings.save();
	waitCommand.data.asyncFinished = true;
});

Manager.Plugins.registerCommand(pluginName, "Move 1 step in angle", (id, dir, withCamera) =>
{
	moveMapObj(id, dir, withCamera);
});

Manager.Plugins.registerCommand(pluginName, "Move 1 step in direction", (id, x, y, withCamera) =>
{
	if (x != 0 || y != 0)
		moveMapObj(id, Math.atan2(-y, x) * 180 / Math.PI, withCamera);
});
