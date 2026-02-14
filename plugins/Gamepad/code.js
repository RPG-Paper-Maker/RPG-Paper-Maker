const pluginName = 'Gamepad';
const inject = Manager.Plugins.inject;

const leftStickEventID = Manager.Plugins.getParameter(pluginName, 'Left stick event ID');
const rightStickEventID = Manager.Plugins.getParameter(pluginName, 'Right stick event ID');
const deadzone = Manager.Plugins.getParameter(pluginName, 'Deadzone variable ID');
const repeatDelay = 30;

var leftStickNeutral = true;
var rightStickNeutral = true;
var keysList = [
	'A',
	'B',
	'X',
	'Y',
	'LB',
	'RB',
	'LT',
	'RT',
	'Back',
	'Start',
	'L3',
	'R3',
	'Up',
	'Down',
	'Left',
	'Right',
	'Home',
];

// https://w3c.github.io/gamepad/#remapping
var buttonsList = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

var axesMenuList = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
];

function getKey(id) {
	if (id >= 0 && id < keysList.length) return keysList[id];
	return 'Error';
}

setInterval(function () {
	if (!Main.loaded || Manager.Stack.isLoading()) return;
	const gp = navigator.getGamepads();
	if (!Manager.Stack.isLoading()) {
		for (var i = 0; i < gp.length; i++) {
			if (!!gp[i]) {
				for (var j = 0; j < gp[i].buttons.length; j++) {
					if (gp[i].buttons[j].pressed === true) {
						if (!Common.Inputs.keysPressed.has(getKey(j)))
							Common.Inputs.keysPressed.add(getKey(j));
						if (buttonsList[i][j] === 0) {
							Manager.Stack.onKeyPressed(getKey(j));
							if (!Manager.Stack.isLoading()) Manager.Stack.onKeyPressedAndRepeat(getKey(j));
						}
						buttonsList[i][j] = Math.min(buttonsList[i][j] + 1, repeatDelay);
						if (!Manager.Stack.isLoading() && buttonsList[i][j] === repeatDelay)
							Manager.Stack.onKeyPressedAndRepeat(getKey(j));
					} else {
						if (Common.Inputs.keysPressed.has(getKey(j)))
							Common.Inputs.keysPressed.delete(getKey(j));
						if (buttonsList[i][j] > 0) Manager.Stack.onKeyReleased(getKey(j));
						buttonsList[i][j] = 0;
					}
				}
				const lh = gp[i].axes[0];
				const lv = gp[i].axes[1];
				const rh = gp[i].axes[2];
				const rv = gp[i].axes[3];
				if (
					Manager.Stack.top instanceof Scene.Map &&
					!Scene.Map.current.loading &&
					!Core.ReactionInterpreter.blockingHero
				) {
					if (Core.Game.current.variables.get(deadzone) === 0) Core.Game.current.variables.set(deadzone, 0.15);
					const d = Math.min(Math.max(Core.Game.current.variables.get(deadzone), 0.05), 0.95);
					const id = Model.DynamicValue.createNumber(i + 1);
					if (Math.sqrt(lh * lh + lv * lv) > d) {
						const x = Model.DynamicValue.createNumber(lh);
						const y = Model.DynamicValue.createNumber(lv);
						Core.Game.current.hero.receiveEvent(
							null,
							false,
							leftStickEventID,
							[null, id, x, y],
							Core.Game.current.heroStates,
						);
						leftStickNeutral = false;
					} else {
						const x = Model.DynamicValue.createNumber(0);
						const y = Model.DynamicValue.createNumber(0);
						Core.Game.current.hero.receiveEvent(
							null,
							false,
							leftStickEventID,
							[null, id, x, y],
							Core.Game.current.heroStates,
						);
						leftStickNeutral = true;
					}
					if (Math.sqrt(rh * rh + rv * rv) > d) {
						const x = Model.DynamicValue.createNumber(rh);
						const y = Model.DynamicValue.createNumber(rv);
						Core.Game.current.hero.receiveEvent(
							null,
							false,
							rightStickEventID,
							[null, id, x, y],
							Core.Game.current.heroStates,
						);
						rightStickNeutral = false;
					} else {
						const x = Model.DynamicValue.createNumber(0);
						const y = Model.DynamicValue.createNumber(0);
						Core.Game.current.hero.receiveEvent(
							null,
							false,
							rightStickEventID,
							[null, id, x, y],
							Core.Game.current.heroStates,
						);
						rightStickNeutral = true;
					}
				}
				if (lv < -0.5 || rv < -0.5) {
					axesMenuList[i][0] = Math.min(axesMenuList[i][0] + 1, repeatDelay);
					if (axesMenuList[i][0] === 1 || axesMenuList[i][0] === repeatDelay)
						Manager.Stack.onKeyPressedAndRepeat('Up');
				} else axesMenuList[i][0] = 0;
				if (lv > 0.5 || rv > 0.5) {
					axesMenuList[i][1] = Math.min(axesMenuList[i][1] + 1, repeatDelay);
					if (axesMenuList[i][1] === 1 || axesMenuList[i][1] === repeatDelay)
						Manager.Stack.onKeyPressedAndRepeat('Down');
				} else axesMenuList[i][1] = 0;
				if (lh < -0.5 || rh < -0.5) {
					axesMenuList[i][2] = Math.min(axesMenuList[i][2] + 1, repeatDelay);
					if (axesMenuList[i][2] === 1 || axesMenuList[i][2] === repeatDelay)
						Manager.Stack.onKeyPressedAndRepeat('Left');
				} else axesMenuList[i][2] = 0;
				if (lh > 0.5 || rh > 0.5) {
					axesMenuList[i][3] = Math.min(axesMenuList[i][3] + 1, repeatDelay);
					if (axesMenuList[i][3] === 1 || axesMenuList[i][3] === repeatDelay)
						Manager.Stack.onKeyPressedAndRepeat('Right');
				} else axesMenuList[i][3] = 0;
			} else {
				for (var j = 0; j < buttonsList[i].length; j++) {
					if (buttonsList[i][j] > 0) {
						Common.Inputs.keysPressed.delete(getKey(j));
						Manager.Stack.onKeyReleased(getKey(j));
					}
					buttonsList[i][j] = 0;
				}
			}
		}
	}
}, 16);

window.addEventListener('gamepadconnected', (e) => {
	const c = Data.Keyboards.controls;
	const a = Object.getOwnPropertyNames(c);
	for (var i = 0; i < a.length; i++)
		for (var j = 0; j < c[a[i]].sc.length; j++)
			for (var k = 0; k < c[a[i]].sc[j].length; k++) if (typeof c[a[i]].sc[j][k] === 'string') return;
	if (Data.Keyboards.controls['Action']) Data.Keyboards.controls['Action'].sc.push(['A']);
	if (Data.Keyboards.controls['Cancel']) Data.Keyboards.controls['Cancel'].sc.push(['B']);
	if (Data.Keyboards.controls['MainMenu']) {
		Data.Keyboards.controls['MainMenu'].sc.push(['B']);
		Data.Keyboards.controls['MainMenu'].sc.push(['Start']);
	}
	if (Data.Keyboards.controls['LeftCamera']) {
		Data.Keyboards.controls['LeftCamera'].sc.push(['RB']);
		Data.Keyboards.controls['LeftCamera'].sc.push(['RT']);
	}
	if (Data.Keyboards.controls['RightCamera']) {
		Data.Keyboards.controls['RightCamera'].sc.push(['LB']);
		Data.Keyboards.controls['RightCamera'].sc.push(['LT']);
	}
	if (Data.Keyboards.controls['UpMenu']) Data.Keyboards.controls['UpMenu'].sc.push(['Up']);
	if (Data.Keyboards.controls['UpHero']) Data.Keyboards.controls['UpHero'].sc.push(['Up']);
	if (Data.Keyboards.controls['DownMenu']) Data.Keyboards.controls['DownMenu'].sc.push(['Down']);
	if (Data.Keyboards.controls['DownHero']) Data.Keyboards.controls['DownHero'].sc.push(['Down']);
	if (Data.Keyboards.controls['LeftMenu']) Data.Keyboards.controls['LeftMenu'].sc.push(['Left']);
	if (Data.Keyboards.controls['LeftHero']) Data.Keyboards.controls['LeftHero'].sc.push(['Left']);
	if (Data.Keyboards.controls['RightMenu']) Data.Keyboards.controls['RightMenu'].sc.push(['Right']);
	if (Data.Keyboards.controls['RightHero']) Data.Keyboards.controls['RightHero'].sc.push(['Right']);
	for (var i = 0; i < a.length; i++) Data.Settings.kb.set(c[a[i]].id, c[a[i]].sc);
	Data.Settings.save();
});
