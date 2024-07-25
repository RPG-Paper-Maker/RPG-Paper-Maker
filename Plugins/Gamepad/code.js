import { RPM } from "../path.js"

const pluginName = "Gamepad";
const inject = RPM.Manager.Plugins.inject;

const leftStickEventID = RPM.Manager.Plugins.getParameter(pluginName, "Left stick event ID");
const rightStickEventID = RPM.Manager.Plugins.getParameter(pluginName, "Right stick event ID");
const deadzone = RPM.Manager.Plugins.getParameter(pluginName, "Deadzone variable ID");;
const repeatDelay = 30;

var keysList = ["A", "B", "X", "Y", "LB", "RB", "LT", "RT", "Back", "Start", "L3", "R3", "Up", "Down", "Left", "Right", "Home"];

// https://w3c.github.io/gamepad/#remapping
var buttonsList =
[
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var axesMenuList =
[
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];

function getKey(id)
{
	if (id >= 0 && id < keysList.length)
		return keysList[id];
	return "Error";
}

const oldFunc = RPM.Common.KeyEvent.getKeyString;
RPM.Common.KeyEvent.getKeyString = function (key)
{
	const str = oldFunc(key);
	if (str.search(/\? \[ID=/) === 0)
	{
		const k = str.substring(6, str.indexOf("]"));
		if (keysList.includes(k))
			return "GPad." + k;
	}
	else
		return str;
}

setInterval(function ()
{
	if (!RPM.Main.loaded || RPM.Manager.Stack.isLoading())
		return;
	const gp = navigator.getGamepads();
	if (!RPM.Manager.Stack.isLoading())
	{
		for (var i = 0; i < gp.length; i++)
		{
			if (!!gp[i])
			{
				for (var j = 0; j < gp[i].buttons.length; j++)
				{
					if (gp[i].buttons[j].pressed === true)
					{
						if (RPM.Common.Inputs.keysPressed.indexOf(getKey(j)) === -1)
							RPM.Common.Inputs.keysPressed.push(getKey(j));
						if (buttonsList[i][j] === 0)
						{
							RPM.Manager.Stack.onKeyPressed(getKey(j));
							if (!RPM.Manager.Stack.isLoading())
								RPM.Manager.Stack.onKeyPressedAndRepeat(getKey(j));
						}
						buttonsList[i][j] = Math.min(buttonsList[i][j] + 1, repeatDelay);
						if (!RPM.Manager.Stack.isLoading() && buttonsList[i][j] === repeatDelay)
							RPM.Manager.Stack.onKeyPressedAndRepeat(getKey(j));
					}
					else
					{
						if (RPM.Common.Inputs.keysPressed.indexOf(getKey(j)) !== -1)
							RPM.Common.Inputs.keysPressed.splice(getKey(j), 1);
						if (buttonsList[i][j] > 0)
							RPM.Manager.Stack.onKeyReleased(getKey(j));
						buttonsList[i][j] = 0;
					}
				}
				const lh = gp[i].axes[0];
				const lv = gp[i].axes[1];
				const rh = gp[i].axes[2];
				const rv = gp[i].axes[3];
				if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading && !RPM.Core.ReactionInterpreter.blockingHero)
				{
					const d = Math.min(Math.max(RPM.Core.Game.current.variables[deadzone], 0.05), 0.95);
					const id = RPM.System.DynamicValue.createNumber(i + 1);
					if (Math.sqrt(lh * lh + lv * lv) > d)
					{
						const x = RPM.System.DynamicValue.createNumber(lh);
						const y = RPM.System.DynamicValue.createNumber(lv);
						RPM.Core.Game.current.hero.receiveEvent(null, false, leftStickEventID, [null, id, x, y], RPM.Core.Game.current.heroStates);
					}
					if (Math.sqrt(rh * rh + rv * rv) > d)
					{
						const x = RPM.System.DynamicValue.createNumber(rh);
						const y = RPM.System.DynamicValue.createNumber(rv);
						RPM.Core.Game.current.hero.receiveEvent(null, false, rightStickEventID, [null, id, x, y], RPM.Core.Game.current.heroStates);
					}
				}
				if (lv < -0.5 || rv < -0.5)
				{
					axesMenuList[i][0] = Math.min(axesMenuList[i][0] + 1, repeatDelay);
					if (axesMenuList[i][0] === 1 || axesMenuList[i][0] === repeatDelay)
						RPM.Manager.Stack.onKeyPressedAndRepeat("Up");
				}
				else
					axesMenuList[i][0] = 0;
				if (lv > 0.5 || rv > 0.5)
				{
					axesMenuList[i][1] = Math.min(axesMenuList[i][1] + 1, repeatDelay);
					if (axesMenuList[i][1] === 1 || axesMenuList[i][1] === repeatDelay)
						RPM.Manager.Stack.onKeyPressedAndRepeat("Down");
				}
				else
					axesMenuList[i][1] = 0;
				if (lh < -0.5 || rh < -0.5)
				{
					axesMenuList[i][2] = Math.min(axesMenuList[i][2] + 1, repeatDelay);
					if (axesMenuList[i][2] === 1 || axesMenuList[i][2] === repeatDelay)
						RPM.Manager.Stack.onKeyPressedAndRepeat("Left");
				}
				else
					axesMenuList[i][2] = 0;
				if (lh > 0.5 || rh > 0.5)
				{
					axesMenuList[i][3] = Math.min(axesMenuList[i][3] + 1, repeatDelay);
					if (axesMenuList[i][3] === 1 || axesMenuList[i][3] === repeatDelay)
						RPM.Manager.Stack.onKeyPressedAndRepeat("Right");
				}
				else
					axesMenuList[i][3] = 0;
			}
			else
			{
				for (var j = 0; j < buttonsList[i].length; j++)
				{
					if (buttonsList[i][j] > 0)
					{
						RPM.Common.Inputs.keysPressed.splice(getKey(j), 1);
						RPM.Manager.Stack.onKeyReleased(getKey(j));
					}
					buttonsList[i][j] = 0;
				}
			}
		}
	}
}, 16);

window.addEventListener("gamepadconnected", (e) =>
{
	const c = RPM.Datas.Keyboards.controls;
	const a = Object.getOwnPropertyNames(c);
	for (var i = 0; i < a.length; i++)
		for (var j = 0; j < c[a[i]].sc.length; j++)
			for (var k = 0; k < c[a[i]].sc[j].length; k++)
				if (typeof c[a[i]].sc[j][k] === "string")
					return;
	if (RPM.Datas.Keyboards.controls["Action"])
		RPM.Datas.Keyboards.controls["Action"].sc.push(["A"]);
	if (RPM.Datas.Keyboards.controls["Cancel"])
		RPM.Datas.Keyboards.controls["Cancel"].sc.push(["B"]);
	if (RPM.Datas.Keyboards.controls["MainMenu"])
	{
		RPM.Datas.Keyboards.controls["MainMenu"].sc.push(["B"]);
		RPM.Datas.Keyboards.controls["MainMenu"].sc.push(["Start"]);
	}
	if (RPM.Datas.Keyboards.controls["LeftCamera"])
	{
		RPM.Datas.Keyboards.controls["LeftCamera"].sc.push(["RB"]);
		RPM.Datas.Keyboards.controls["LeftCamera"].sc.push(["RT"]);
	}
	if (RPM.Datas.Keyboards.controls["RightCamera"])
	{
		RPM.Datas.Keyboards.controls["RightCamera"].sc.push(["LB"]);
		RPM.Datas.Keyboards.controls["RightCamera"].sc.push(["LT"]);
	}
	if (RPM.Datas.Keyboards.controls["UpMenu"])
		RPM.Datas.Keyboards.controls["UpMenu"].sc.push(["Up"]);
	if (RPM.Datas.Keyboards.controls["UpHero"])
		RPM.Datas.Keyboards.controls["UpHero"].sc.push(["Up"]);
	if (RPM.Datas.Keyboards.controls["DownMenu"])
		RPM.Datas.Keyboards.controls["DownMenu"].sc.push(["Down"]);
	if (RPM.Datas.Keyboards.controls["DownHero"])
		RPM.Datas.Keyboards.controls["DownHero"].sc.push(["Down"]);
	if (RPM.Datas.Keyboards.controls["LeftMenu"])
		RPM.Datas.Keyboards.controls["LeftMenu"].sc.push(["Left"]);
	if (RPM.Datas.Keyboards.controls["LeftHero"])
		RPM.Datas.Keyboards.controls["LeftHero"].sc.push(["Left"]);
	if (RPM.Datas.Keyboards.controls["RightMenu"])
		RPM.Datas.Keyboards.controls["RightMenu"].sc.push(["Right"]);
	if (RPM.Datas.Keyboards.controls["RightHero"])
		RPM.Datas.Keyboards.controls["RightHero"].sc.push(["Right"]);
	for (var i = 0; i < a.length; i++)
		RPM.Datas.Settings.kb[c[a[i]].id] = c[a[i]].sc;
	RPM.Datas.Settings.write();
});
