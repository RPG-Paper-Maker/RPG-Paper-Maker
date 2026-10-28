const pluginName = "More save options";

class WaitSaveLoadAsync extends EventCommand.Base
{
	constructor()
	{
		super();
		this.asyncSaveLoadFinished = false;
	}

	update(currentState)
	{
		return this.asyncSaveLoadFinished;
	}
}

function addCustomWaitCommand()
{
	const c = Core.ReactionInterpreter.currentReaction.currentCommand;
	if (!c.hasCustomWaitCommand)
	{
		c.hasCustomWaitCommand = true;
		const n = c.next;
		c.next = new Core.Node(c.parent, new WaitSaveLoadAsync());
		c.next.next = n;
	}
	else
		c.next.data.asyncSaveLoadFinished = false;
	return c.next;
}

Manager.Plugins.registerCommand(pluginName, "Save slot", (slot) =>
{
	const waitCommand = addCustomWaitCommand();
	Core.Game.current.save(slot);
	waitCommand.data.asyncSaveLoadFinished = true;
});

Manager.Plugins.registerCommand(pluginName, "Load slot", async (slot) =>
{
	const waitCommand = addCustomWaitCommand();
	if (await Common.IO.fileExists(Common.Paths.SAVES + "/" + slot + ".json"))
	{
		Data.Systems.soundConfirmation.playSound();
		Manager.Stack.replace(new Scene.Base());
		const game = new Core.Game(slot);
		await game.load();
		Core.Game.current = game;
		Core.Game.current.loadPositions();
		Core.Game.current.hero.initializeProperties();
		Manager.Stack.replace(new Scene.Map(Core.Game.current.currentMapID));
	}
	else
		Data.Systems.soundImpossible.playSound();
	waitCommand.data.asyncSaveLoadFinished = true;
});

Manager.Plugins.registerCommand(pluginName, "Delete slot", async (slot) =>
{
	const waitCommand = addCustomWaitCommand();
	const fs = require("fs").promises;
	try
	{
		await fs.unlink(Common.Paths.SAVES + "/" + slot + ".json");
	}
	catch (e)
	{
		console.error(e);
	}
	waitCommand.data.asyncSaveLoadFinished = true;
});

Manager.Plugins.registerCommand(pluginName, "Slot exists?", async (slot, variable) =>
{
	const waitCommand = addCustomWaitCommand();
	Core.Game.current.variables.set(variable, -1);
	var res = await Common.IO.fileExists(Common.Paths.SAVES + "/" + slot + ".json");
	Core.Game.current.variables.set(variable, res);
	waitCommand.data.asyncSaveLoadFinished = true;
});

Manager.Plugins.registerCommand(pluginName, "Get slot variable", async (slot, variable, result) =>
{
	const waitCommand = addCustomWaitCommand();
	const game = new Core.Game(slot);
	try
	{
		await game.load();
		Core.Game.current.variables.set(result, game.variables.get(variable));
	}
	catch (e)
	{
		Core.Game.current.variables.set(result, e);
	}
	waitCommand.data.asyncSaveLoadFinished = true;
});

Manager.Plugins.registerCommand(pluginName, "Copy variables", async (slot, list) =>
{
	const waitCommand = addCustomWaitCommand();
	const game = new Core.Game(slot);
	try
	{
		await game.load();
		for (var i = 0; i < list.length; i++)
			Core.Game.current.variables.set(list[i].value, game.variables.get(list[i].value));
	}
	catch (e)
	{
		console.error(e);
	}
	waitCommand.data.asyncSaveLoadFinished = true;
});
