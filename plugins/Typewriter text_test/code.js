const pluginName = "Typewriter text";

class WaitUntilDoneTyping extends EventCommand.Base
{
	constructor(id)
	{
		super();
		this.id = id;
	}

	onKeyPressed(currentState, key)
	{
		if (Data.Keyboards.checkActionMenu(key) || Data.Keyboards.checkCancelMenu(key))
		{
			const p = Manager.Stack.displayedPictures;
			for (var i = 0; i < p.length; i++)
				if (p[i][0] === this.id)
					p[i][1].typewriterTextPlugin_skip = true;
		}
	}

	onMouseDown(currentState, x, y)
	{
		if (Data.Systems.isMouseControls && Common.Inputs.mouseLeftPressed)
		{
			const p = Manager.Stack.displayedPictures;
			for (var i = 0; i < p.length; i++)
				if (p[i][0] === this.id)
					if (p[i][1].isInside(x, y))
						p[i][1].typewriterTextPlugin_skip = true;
		}
	}

	update(currentState)
	{
		if (Data.Systems.isMouseControls && Common.Inputs.mouseLeftPressed)
			return 0;
		const p = Manager.Stack.displayedPictures;
		for (var i = 0; i < p.length; i++)
		{
			if (p[i][0] === this.id && !!p[i][1].typewriterTextPlugin_doneTyping)
			{
				p.splice(i, 1);
				return 1;
			}
		}
		return 0;
	}
}

function fixText(text, expr)
{
	const a1 = text.split("[" + expr + "]");
	const a2 = text.split("[" + expr + "=");
	const a3 = text.split("[/" + expr + "]");
	const n = a1.length + a2.length - a3.length - 1;
	for (var i = 0; i < n; i++)
		text += "[/" + expr + "]";
	return text;
}

function fixTextAllExpr(text)
{
	text = fixText(text, "b");
	text = fixText(text, "i");
	text = fixText(text, "l");
	text = fixText(text, "c");
	text = fixText(text, "r");
	text = fixText(text, "size");
	text = fixText(text, "font");
	text = fixText(text, "textcolor");
	text = fixText(text, "backcolor");
	text = fixText(text, "strokecolor");
	return text;
}

function isText(text)
{
	const m = new Graphic.Message(text, -1, 0, 0);
	m.update();
	for (var i = 0; i < m.graphics.length; i++)
	{
		if (!m.graphics[i])
			continue;
		if (m.graphics[i].constructor.name !== "Text")
			return false;
		if (m.graphics[i].text == text)
			return true;
	}
	return false;
}

function spawnWindow(id, x, y, width, height, text)
{
	const pad = Data.Systems.dbOptions;
	const value = [id, new Core.WindowBox(x, y, width, height,
	{
		content: new Graphic.Message(text.toString(), -1, 0, 0),
		padding: [pad.v_pLeft, pad.v_pTop, pad.v_pRight, pad.v_pBottom]
	})];
	value[1].content.update();
	value[1].customWindowSkin = Data.Systems.getCurrentWindowSkin();
	const p = Manager.Stack.displayedPictures;
	var ok = false;
	for (var i = 0; i < p.length; i++)
	{
		if (id === p[i][0])
		{
			p[i] = value;
			ok = true;
			break;
		}
		else if (id < p[i][0])
		{
			p.splice(i, 0, value);
			ok = true;
			break;
		}
	}
	if (!ok)
		p.push(value);
};

function updateWindow(id, x, y, width, height, wholeText, count, sound, volume, time, interval)
{
	var w = null;
	const p = Manager.Stack.displayedPictures;
	for (var i = 0; i < p.length; i++)
		if (p[i][0] === id)
			w = p[i][1];
	if (count < wholeText.length)
	{
		var stride = 1;
		var wait = interval;
		if (!!w && w.typewriterTextPlugin_skip)
			stride = wholeText.length;
		if (Core.Game.current.playTime.time > time + 20)
		{
			time = Core.Game.current.playTime.time;
			Manager.Songs.playSound(sound, volume * 0.2);
		}
		for (var i = stride; i > 0; i--)
		{
			if (wholeText[count] == "[")
			{
				const n = wholeText.indexOf("]", count);
				if (wholeText.substr(count).search(/\[wait=\d*\]/) === 0)
				{
					wait = parseInt(wholeText.slice(count + 6, n));
					wholeText = wholeText.substr(0, count) + wholeText.substr(n + 1);
					break;
				}
				if (n > 0)
					count = n;
			}
			count++;
		}
		spawnWindow(id, x, y, height, width, fixTextAllExpr(wholeText.substr(0, count)));
		setTimeout(updateWindow, wait, id, x, y, width, height, wholeText, count, sound, volume, time, interval);
	}
	else
		w.typewriterTextPlugin_doneTyping = true;
}

Manager.Plugins.registerCommand(pluginName, "Show Text", (id, text, sound, volume, interval) =>
{
	text = text.toString().replace(/[^\\]\\n./g, (t) => // regex for "find \n except when it's \\n". Also captures the characters preceding and following the \n
	{
		return t[0] + "\n" + (t[3] == ' ' ? '' : t[3]);
	});
	const params = [8, "", -1, 0, 0];
	for (var j = 0; j < Data.Languages.listIDs.length; j++)
		params.push(j + 1, text.replace(/\[wait=\d*\]/g, ""));
	const d = Data.Systems.dbOptions;
	updateWindow(id, d.v_x, d.v_y, d.v_h, d.v_w, text, 0, sound.kind === Common.SONG_KIND.SOUND ? sound.id : 0, Math.max(0, Math.min(100, volume / 100.0)), Core.Game.current.playTime.time, interval);
	const currentCommand = Core.ReactionInterpreter.currentReaction.currentCommand;
	if (!currentCommand.typewriterTextPlugin_finishedText)
	{
		currentCommand.typewriterTextPlugin_finishedText = true;
		const nextCommand = currentCommand.next;
		const showText = new EventCommand.ShowText(params);
		showText.initialize();
		currentCommand.next = new Core.Node(currentCommand.parent, new WaitUntilDoneTyping(id));
		currentCommand.next.next = new Core.Node(currentCommand.parent, showText);
		currentCommand.next.next.next = nextCommand;
	}
});
