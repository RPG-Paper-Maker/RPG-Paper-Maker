const pluginName = "More window options";

var lastX = 0;
var lastY = 0;

class DisplayChoiceCustom extends EventCommand.DisplayChoice
{
	constructor(command)
	{
		super([-1, command[0]]);
		var i = 0;
		this.choices = command[i++];
		this.x = command[i++];
		this.y = command[i++];
		this.maxWidth = command[i++];
		this.height = command[i++];
		this.space = command[i++];
		this.currentSelectedIndex = command[i++];
		this.cancelAutoIndex = Model.DynamicValue.createNumber(command[i++]);
		this.resultVariableID = command[i++];
		this.disableCancel = command[i++];

		this.graphics = new Array(this.choices.length);
		for (let i = 0; i < this.choices.length; i++)
		{
			this.graphics[i] = new Graphic.Text(this.choices[i].value, { align: Common.ALIGN.CENTER });
			this.maxWidth = Math.max(this.maxWidth, this.graphics[i].textWidth);
		}
	}

	initialize()
	{
		Core.Game.current.variables.set(this.resultVariableID, null);
		this.windowChoices = new Core.WindowChoices(this.x, this.y, this.maxWidth, this.height, this.graphics, { nbItemsMax: this.choices.length, space: this.space });
		this.windowChoices.unselect();
		this.windowChoices.select(this.currentSelectedIndex);
		return { index: -1 };
	}

	action(currentState, isKey, options = {})
	{
		if (Scene.MenuBase.checkActionMenu(isKey, options))
		{
			Data.Systems.soundConfirmation.playSound();
			currentState.index = this.windowChoices.currentSelectedIndex;
			Core.Game.current.variables.set(this.resultVariableID, currentState.index);
		}
		else if (Scene.MenuBase.checkCancel(isKey, options) && !this.disableCancel)
		{
			Data.Systems.soundCancel.playSound();
			currentState.index = this.cancelAutoIndex.getValue();
			Core.Game.current.variables.set(this.resultVariableID, currentState.index);
		}
	}

	update(currentState)
	{
		this.windowChoices.update();
		return Core.Game.current.variables.get(this.resultVariableID) !== null;
	}
}

const oldWindowBoxDrawFunc = Core.WindowBox.prototype.draw;
Core.WindowBox.prototype.draw = function(isChoice = false, windowDimension = this.windowDimension, contentDimension = this.contentDimension)
{
	const prevWindowSkin = Data.Systems.getCurrentWindowSkin();
	if (!!this.customWindowSkin)
		Data.Systems.dbOptions.v_windowSkin = this.customWindowSkin;
	oldWindowBoxDrawFunc.call(this, isChoice, windowDimension, contentDimension);
	Data.Systems.dbOptions.v_windowSkin = prevWindowSkin;
};

document.addEventListener("mousemove", (e) =>
{
	lastX = e.clientX;
	lastY = e.clientY;
});

window.addEventListener("resize", (e) =>
{
	const p = Manager.Stack.displayedPictures;
	for (var i = 0; i < p.length; i++)
	{
		if (!!p[i][1].customWindowSkin)
		{
			p[i][1].updateDimensions();
			p[i][1].update();
		}
	}
});

function getWindow(id)
{
	const p = Manager.Stack.displayedPictures;
	for (var i = 0; i < p.length; i++)
		if (id === p[i][0])
			return p[i][1];
	return new Core.WindowBox(0, 0, 0, 0);
}

Manager.Plugins.registerCommand(pluginName, "Spawn window", (id, x, y, width, height, text) =>
{
	var i;
	text = text.toString();
	while (true) // not the best practice but works in this scenario
	{
		i = text.search(/[^\\]\\n/); // regex for "find \n except when it's \\n"
		if (i === -1)
			break;
		text = text.slice(0, i + 1) + "\n" + text.slice(i + 3);
	}
	const pad = Data.Systems.dbOptions;
	const window = [id, new Core.WindowBox(x, y, width, height,
	{
		content: new Graphic.Message(text, -1, 0, 0),
		padding: [pad.v_pLeft, pad.v_pTop, pad.v_pRight, pad.v_pBottom]
	})];
	window[1].content.update();
	window[1].customWindowSkin = Data.Systems.getCurrentWindowSkin();
	const p = Manager.Stack.displayedPictures;
	var ok = false;
	for (i = 0; i < p.length; i++)
	{
		if (id === p[i][0])
		{
			p[i] = window;
			ok = true;
			break;
		}
		else if (id < p[i][0])
		{
			p.splice(i, 0, window);
			ok = true;
			break;
		}
	}
	if (!ok)
		p.push(window);
});

Manager.Plugins.registerCommand(pluginName, "Update window", (id) =>
{
	const p = getWindow(id);
	if (!!p)
	{
		p.updateDimensions();
		p.update();
	}
});

Manager.Plugins.registerCommand(pluginName, "Edit content", (id, text) =>
{
	const p = getWindow(id);
	if (!!p)
	{
		p.content.setMessage(text.toString());
		p.content.update();
	}
});

Manager.Plugins.registerCommand(pluginName, "Mark selected", (id, select) =>
{
	const p = getWindow(id);
	if (!!p)
		getWindow(id).selected = select;
});

Manager.Plugins.registerCommand(pluginName, "Get window under cursor", (variable) =>
{
	Core.Game.current.variables.set(variable, null);
	const x = Common.ScreenResolution.getScreenXReverse(lastX);
	const y = Common.ScreenResolution.getScreenYReverse(lastY);
	const p = Manager.Stack.displayedPictures;
	for (var i = p.length - 1; i >= 0; i--)
	{
		if (p[i][1].constructor.name === "WindowBox" && x > p[i][1].oX && y > p[i][1].oY && x < p[i][1].oX + p[i][1].oW && y < p[i][1].oY + p[i][1].oH)
		{
			Core.Game.current.variables.set(variable, p[i][0]);
			break;
		}
	}
});

Manager.Plugins.registerCommand(pluginName, "Display choices", (choices, x, y, width, height, spacing, selected, cancel, result, disableCancel) =>
{
	const c = Core.ReactionInterpreter.currentReaction.currentCommand;
	if (!c.hasDisplayChoiceCustomCommand)
	{
		c.hasDisplayChoiceCustomCommand = true;
		const n = c.next;
		c.next = new Core.Node(c.parent, new DisplayChoiceCustom([choices, x, y, width, height, spacing, selected, cancel, result, disableCancel]));
		c.next.next = n;
	}
});

class WaitUnpaused extends EventCommand.Base
{
	constructor(time)
	{
		super();
		this.currentTime = 0;
		this.finishTime = time;
	}

	update(currentState)
	{
		if (!Scene.Map.current || !Scene.Map.current.multipleTextBoxesPlugin_pause)
			this.currentTime += Manager.Stack.elapsedTime;
		return this.currentTime >= this.finishTime;
	}
}

const oldReactionUpdateFunc = Core.ReactionInterpreter.prototype.update;
Core.ReactionInterpreter.prototype.update = function()
{
	if (!Scene.Map.current.multipleTextBoxesPlugin_pause || (!!this.currentMapObject && this.currentMapObject.isHero))
		oldReactionUpdateFunc.call(this);
};

const oldMapUpdateFunc = Scene.Map.prototype.update;
Scene.Map.prototype.update = function()
{
	if (!this.multipleTextBoxesPlugin_pause)
		oldMapUpdateFunc.call(this);
	else
	{
		this.mapProperties.startupObject.update();
		Scene.Base.prototype.update.call(this);
	}
};

Manager.Plugins.registerCommand(pluginName, "Pause", () =>
{
	Scene.Map.current.multipleTextBoxesPlugin_pause = true;
});

Manager.Plugins.registerCommand(pluginName, "Unpause", () =>
{
	Scene.Map.current.multipleTextBoxesPlugin_pause = false;
});

Manager.Plugins.registerCommand(pluginName, "Wait", (time) =>
{
	const c = Core.ReactionInterpreter.currentReaction.currentCommand;
	if (!c.hasCustomWaitCommand)
	{
		c.hasCustomWaitCommand = true;
		const n = c.next;
		c.next = new Core.Node(c.parent, new WaitUnpaused(time * 1000));
		c.next.next = n;
	}
	else
	{
		c.next.data.currentTime = 0;
		c.next.data.finishTime = time * 1000;
	}
});
