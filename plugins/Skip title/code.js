const pluginName = "Skip title";

var currentGame = null;
var settings = { name: function() { return "Enable Settings on Systems tab!"; } };

class WaitSaveLoadScene extends EventCommand.Base
{
	constructor()
	{
		super();
		this.prevScene = Manager.Stack.top;
		this.beginCheck = false;
	}

	update(currentState)
	{
		return this.beginCheck && this.prevScene === Manager.Stack.top;
	}
}

function addCustomWaitCommand()
{
	const c = Core.ReactionInterpreter.currentReaction.currentCommand;
	if (!c.hasCustomWaitCommand)
	{
		c.hasCustomWaitCommand = true;
		const n = c.next;
		c.next = new Core.Node(c.parent, new WaitSaveLoadScene());
		c.next.next = n;
	}
	else
	{
		c.beginCheck = false;
		c.next.prevScene = Manager.Stack.top;
	}
	return c.next;
}

Scene.TitleScreen.prototype.load = async function ()
{
	Core.Game.current = null;
	Manager.Videos.stop();
	Manager.Songs.stopAll();
	Manager.GL.screenTone.set(0, 0, 0, 1);
	Manager.Stack.displayedPictures = [];
	this.pictureBackground = await Core.Picture2D.loadImage();
	Data.TitlescreenGameover.getTitleCommandsNames().forEach(command =>
	{
		if (command.datas.kind === Common.TITLE_COMMAND_KIND.SETTINGS)
			settings = command.datas;
	});
	Model.TitleCommand.startNewGame();
};

Scene.LoadGame.prototype.cancel = function (isKey, options = {})
{
	if (Scene.MenuBase.checkCancelMenu(isKey, options))
	{
		Core.Game.current = currentGame;
		Data.Systems.soundCancel.playSound();
		Manager.Stack.pop();
		Manager.Stack.pop();
	}
};

Manager.Plugins.registerCommand(pluginName, "Open load menu", () =>
{
	const waitCommand = addCustomWaitCommand(true);
	currentGame = Core.Game.current;
	Manager.Stack.push(new Scene.Base());
	Manager.Stack.push(new Scene.LoadGame());
	waitCommand.data.beginCheck = true;
});

Manager.Plugins.registerCommand(pluginName, "Open settings menu", () =>
{
	const waitCommand = addCustomWaitCommand(true);
	Manager.Stack.push(new Scene.TitleSettings(settings));
	waitCommand.data.beginCheck = true;
});

Manager.Plugins.registerCommand(pluginName, "Quit game", () =>
{
	Model.TitleCommand.exit();
});
