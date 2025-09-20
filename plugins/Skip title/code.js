const pluginName = 'Skip title';

const infoVar = Manager.Plugins.getParameter(pluginName, 'Text info variable ID');

var currentGame = null;
var settingsName = 'Enable Settings on Systems tab!';

Scene.TitleScreen.prototype.load = async function () {
	const l = Data.TitlescreenGameover.titleCommands;
	for (var i = 0; i < l.length; i++)
		if (l[i].kind === Common.Enum.TitleCommandKind.Settings) settingsName = l[i].name();
	Core.Game.current = null;
	Manager.Videos.stop();
	Manager.Songs.stopAll();
	Manager.GL.screenTone.set(0, 0, 0, 1);
	Manager.Stack.displayedPictures = [];
	this.pictureBackground = await Core.Picture2D.loadImage();
	Model.TitleCommand.startNewGame();
};

Scene.LoadGame.prototype.cancel = function (isKey, options = {}) {
	if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
		Core.Game.current = currentGame;
		Data.Systems.soundCancel.playSound();
		Manager.Stack.pop();
		Manager.Stack.pop();
	}
};

Manager.Plugins.registerCommand(pluginName, 'Save slot', (slot) => {
	Core.Game.current.save(slot);
});

Manager.Plugins.registerCommand(pluginName, 'Load slot', async (slot) => {
	if (await Common.IO.fileExists(Common.Paths.SAVES + '/' + slot + '.json')) {
		Data.Systems.soundConfirmation.playSound();
		Manager.Stack.replace(new Scene.Base());
		const game = new Core.Game(slot);
		await game.load();
		Core.Game.current = game;
		Core.Game.current.loadPositions();
		Core.Game.current.hero.initializeProperties();
		Manager.Stack.replace(new Scene.Map(Core.Game.current.currentMapID));
	} else Data.Systems.soundImpossible.playSound();
});

Manager.Plugins.registerCommand(pluginName, 'Delete slot', async (slot) => {
	const fs = require('fs').promises;
	try {
		await fs.unlink(Common.Paths.SAVES + '/' + slot + '.json');
	} catch (e) {
		console.error(e);
	}
});

Manager.Plugins.registerCommand(pluginName, 'Slot exists?', async (slot, variable) => {
	Core.Game.current.variables[variable] = -1;
	Core.Game.current.variables[variable] = await Common.IO.fileExists(Common.Paths.SAVES + '/' + slot + '.json');
});

Manager.Plugins.registerCommand(pluginName, 'Get slot info', async (slot, info, time) => {
	const p = Core.ReactionInterpreter.currentObject;
	const game = new Core.Game(slot);
	p.properties[info] = null;
	try {
		await game.load();
		var s = game.playTime.getSeconds();
		const m = Math.floor(s / 60).toString();
		const h = Math.floor(s / 3600).toString();
		s = (s % 60).toString();
		p.properties[info] = game.variables[infoVar];
		p.properties[time] =
			(h.length === 1 ? '0' : '') +
			h +
			':' +
			(m.length === 1 ? '0' : '') +
			m +
			':' +
			(s.length === 1 ? '0' : '') +
			s;
	} catch (error) {
		p.properties[info] = '';
		p.properties[time] = '';
		console.log(error);
	}
});

Manager.Plugins.registerCommand(pluginName, 'Open load menu', () => {
	currentGame = Core.Game.current;
	Manager.Stack.push(new Scene.Base());
	Manager.Stack.push(new Scene.LoadGame());
});

Manager.Plugins.registerCommand(pluginName, 'Open settings menu', () => {
	Manager.Stack.push(new Scene.TitleSettings(settingsName));
});

Manager.Plugins.registerCommand(pluginName, 'Quit game', () => {
	Model.TitleCommand.exit();
});
