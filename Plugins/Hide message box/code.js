import { RPM } from "../path.js"

const pluginName = "Hide message box";

var isHidden = false;
var prevMainWindow = [0, 0, 0, 0];
var prevNameWindow = [0, 0, 0, 0];

RPM.EventCommand.ShowText.prototype.action = function (currentState, isKey, options = {})
{
	if (RPM.Scene.MenuBase.checkActionMenu(isKey, options) && (isKey || (!isKey && this.windowMain.isInside(options.x, options.y))) && !isHidden)
		currentState.clicked = true;
}

function hideText()
{
	const c = RPM.Manager.Stack.top.reactionInterpreters[0].currentCommand;

	if (isHidden || !c || c.data.constructor.name !== "ShowText" || (!!c.next && c.next.data.constructor.name === "DisplayChoice"))
		return;

	const m = c.data.windowMain;
	prevMainWindow = [m.oX, m.oY, m.oH, m.oW];
	m.oX = -RPM.Datas.Systems.SQUARE_SIZE;
	m.oY = -RPM.Datas.Systems.SQUARE_SIZE;
	m.oH = 0;
	m.oW = 0;
	m.updateDimensions();
	const n = c.data.windowInterlocutor;
	prevNameWindow = [n.oX, n.oY, n.oH, n.oW];
	n.oX = -RPM.Datas.Systems.SQUARE_SIZE;
	n.oY = -RPM.Datas.Systems.SQUARE_SIZE;
	n.oH = 0;
	n.oW = 0;
	n.updateDimensions();
	isHidden = true;
}

function showText()
{
	const c = RPM.Manager.Stack.top.reactionInterpreters[0].currentCommand;

	if (!isHidden || !c || c.data.constructor.name !== "ShowText")
		return;

	const m = c.data.windowMain;
	m.oX = prevMainWindow[0];
	m.oY = prevMainWindow[1];
	m.oH = prevMainWindow[2];
	m.oW = prevMainWindow[3];
	m.updateDimensions();
	const n = c.data.windowInterlocutor;
	n.oX = prevNameWindow[0];
	n.oY = prevNameWindow[1];
	n.oH = prevNameWindow[2];
	n.oW = prevNameWindow[3];
	n.updateDimensions();
	isHidden = false;
}

RPM.Manager.Plugins.registerCommand(pluginName, "Hide text", () =>
{
	hideText();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Show text", () =>
{
	showText();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Is hidden?", (prop) =>
{
	RPM.Core.ReactionInterpreter.currentObject.properties[prop] = isHidden;
});

RPM.Manager.Plugins.registerCommand(pluginName, "Toggle text", () =>
{
	isHidden ? showText() : hideText();
});
