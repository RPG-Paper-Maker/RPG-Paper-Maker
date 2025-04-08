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

const oldFunc = Common.KeyEvent.getKeyString;
Common.KeyEvent.getKeyString = function (key) {
	const str = oldFunc(key);
	if (str.search(/\? \[ID=/) === 0) {
		const k = str.substring(6, str.indexOf(']'));
		if (keysList.includes(k)) return 'GPad.' + k;
	} else return str;
};

setInterval(function () {
	if (!Main.loaded || Manager.Stack.isLoading()) return;
	const gp = navigator.getGamepads();
	if (!Manager.Stack.isLoading()) {
		for (var i = 0; i < gp.length; i++) {
			if (!!gp[i]) {
				for (var j = 0; j < gp[i].buttons.length; j++) {
					if (gp[i].buttons[j].pressed === true) {
						if (Common.Inputs.keysPressed.indexOf(getKey(j)) === -1)
							Common.Inputs.keysPressed.push(getKey(j));
						if (buttonsList[i][j] === 0) {
							Manager.Stack.onKeyPressed(getKey(j));
							if (!Manager.Stack.isLoading()) Manager.Stack.onKeyPressedAndRepeat(getKey(j));
						}
						buttonsList[i][j] = Math.min(buttonsList[i][j] + 1, repeatDelay);
						if (!Manager.Stack.isLoading() && buttonsList[i][j] === repeatDelay)
							Manager.Stack.onKeyPressedAndRepeat(getKey(j));
					} else {
						if (Common.Inputs.keysPressed.indexOf(getKey(j)) !== -1)
							Common.Inputs.keysPressed.splice(getKey(j), 1);
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
					if (Core.Game.current.variables[deadzone] === 0) Core.Game.current.variables[deadzone] = 0.15;
					const d = Math.min(Math.max(Core.Game.current.variables[deadzone], 0.05), 0.95);
					const id = System.DynamicValue.createNumber(i + 1);
					if (Math.sqrt(lh * lh + lv * lv) > d) {
						const x = System.DynamicValue.createNumber(lh);
						const y = System.DynamicValue.createNumber(lv);
						Core.Game.current.hero.receiveEvent(
							null,
							false,
							leftStickEventID,
							[null, id, x, y],
							Core.Game.current.heroStates
						);
						leftStickNeutral = false;
					} else {
						const x = System.DynamicValue.createNumber(0);
						const y = System.DynamicValue.createNumber(0);
						Core.Game.current.hero.receiveEvent(
							null,
							false,
							leftStickEventID,
							[null, id, x, y],
							Core.Game.current.heroStates
						);
						leftStickNeutral = true;
					}
					if (Math.sqrt(rh * rh + rv * rv) > d) {
						const x = System.DynamicValue.createNumber(rh);
						const y = System.DynamicValue.createNumber(rv);
						Core.Game.current.hero.receiveEvent(
							null,
							false,
							rightStickEventID,
							[null, id, x, y],
							Core.Game.current.heroStates
						);
						rightStickNeutral = false;
					} else {
						const x = System.DynamicValue.createNumber(0);
						const y = System.DynamicValue.createNumber(0);
						Core.Game.current.hero.receiveEvent(
							null,
							false,
							rightStickEventID,
							[null, id, x, y],
							Core.Game.current.heroStates
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
						Common.Inputs.keysPressed.splice(getKey(j), 1);
						Manager.Stack.onKeyReleased(getKey(j));
					}
					buttonsList[i][j] = 0;
				}
			}
		}
	}
}, 16);

window.addEventListener('gamepadconnected', (e) => {
	const c = Datas.Keyboards.controls;
	const a = Object.getOwnPropertyNames(c);
	for (var i = 0; i < a.length; i++)
		for (var j = 0; j < c[a[i]].sc.length; j++)
			for (var k = 0; k < c[a[i]].sc[j].length; k++) if (typeof c[a[i]].sc[j][k] === 'string') return;
	if (Datas.Keyboards.controls['Action']) Datas.Keyboards.controls['Action'].sc.push(['A']);
	if (Datas.Keyboards.controls['Cancel']) Datas.Keyboards.controls['Cancel'].sc.push(['B']);
	if (Datas.Keyboards.controls['MainMenu']) {
		Datas.Keyboards.controls['MainMenu'].sc.push(['B']);
		Datas.Keyboards.controls['MainMenu'].sc.push(['Start']);
	}
	if (Datas.Keyboards.controls['LeftCamera']) {
		Datas.Keyboards.controls['LeftCamera'].sc.push(['RB']);
		Datas.Keyboards.controls['LeftCamera'].sc.push(['RT']);
	}
	if (Datas.Keyboards.controls['RightCamera']) {
		Datas.Keyboards.controls['RightCamera'].sc.push(['LB']);
		Datas.Keyboards.controls['RightCamera'].sc.push(['LT']);
	}
	if (Datas.Keyboards.controls['UpMenu']) Datas.Keyboards.controls['UpMenu'].sc.push(['Up']);
	if (Datas.Keyboards.controls['UpHero']) Datas.Keyboards.controls['UpHero'].sc.push(['Up']);
	if (Datas.Keyboards.controls['DownMenu']) Datas.Keyboards.controls['DownMenu'].sc.push(['Down']);
	if (Datas.Keyboards.controls['DownHero']) Datas.Keyboards.controls['DownHero'].sc.push(['Down']);
	if (Datas.Keyboards.controls['LeftMenu']) Datas.Keyboards.controls['LeftMenu'].sc.push(['Left']);
	if (Datas.Keyboards.controls['LeftHero']) Datas.Keyboards.controls['LeftHero'].sc.push(['Left']);
	if (Datas.Keyboards.controls['RightMenu']) Datas.Keyboards.controls['RightMenu'].sc.push(['Right']);
	if (Datas.Keyboards.controls['RightHero']) Datas.Keyboards.controls['RightHero'].sc.push(['Right']);
	for (var i = 0; i < a.length; i++) Datas.Settings.kb[c[a[i]].id] = c[a[i]].sc;
	Datas.Settings.write();
});
