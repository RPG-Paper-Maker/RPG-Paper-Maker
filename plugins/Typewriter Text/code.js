import { RPM } from "../path.js"

const pluginName = "Typewriter Text";

const textSpeed = RPM.Manager.Plugins.getParameter(pluginName, "Text speed variable ID");
const textSound = RPM.Manager.Plugins.getParameter(pluginName, "Text sound variable ID");

function updateWindow(id, x, y, width, height, wholeText, count)
{
	RPM.Manager.Songs.playSound(RPM.Core.Game.current.variables[textSound], 0.05);
	spawnWindow(id, x, y, height, width, wholeText.substring(0, count));
	if (count < wholeText.length)
		setTimeout(updateWindow, Math.max(RPM.Core.Game.current.variables[textSpeed] * 1000, 1), id, x, y, width, height, wholeText, ++count);
	else
		for (var i = 0; i < RPM.Manager.Stack.displayedPictures.length; i++)
			if (RPM.Manager.Stack.displayedPictures[i][0] === id)
				RPM.Manager.Stack.displayedPictures[i][1].typewriterTextPlugin_doneTyping = true;
}

RPM.Manager.Plugins.registerCommand(pluginName, "Is done typing", (textID, varID) =>
{
	RPM.Core.Game.current.variables[varID] = false;
	for (var i = 0; i < RPM.Manager.Stack.displayedPictures.length; i++)
		if (RPM.Manager.Stack.displayedPictures[i][0] === textID)
			RPM.Core.Game.current.variables[varID] = !!RPM.Manager.Stack.displayedPictures[i][1].typewriterTextPlugin_doneTyping;
});

// Typewriter plugin code - Start
RPM.Manager.Plugins.registerCommand(pluginName, "Show Text", (id, text, x, y, width, height) =>
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
	updateWindow(id, x, y, width, height, text.replace("\\\\n", "\\n"), 0);
});
// Typewriter plugin code - End

// "Multiple window boxes" plugin code by @Russo (https://github.com/yaleksander/RPM-Plugin-Multiple-window-boxes) - Start
RPM.Core.WindowBox.prototype.draw = function (isChoice = false, windowDimension = this.windowDimension, contentDimension = this.contentDimension)
{
	if (this.content)
		this.content.drawBehind(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);

	// Single line alteration from source code
	!!this.customWindowSkin ? this.customWindowSkin.drawBox(windowDimension, this.selected, this.bordersVisible) : RPM.Datas.Systems.getCurrentWindowSkin().drawBox(windowDimension, this.selected, this.bordersVisible);

	if (this.content)
	{
		if (!isChoice && this.limitContent)
		{
			RPM.Common.Platform.ctx.save();
			RPM.Common.Platform.ctx.beginPath();
			RPM.Common.Platform.ctx.rect(contentDimension[0], contentDimension[1] - RPM.Common.ScreenResolution.getScreenY(this.padding[3] / 2), contentDimension[2], contentDimension[3] + RPM.Common.ScreenResolution.getScreenY(this.padding[3]));
			RPM.Common.Platform.ctx.clip();
		}
		if (isChoice)
			this.content.drawChoice(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);
		else
			this.content.draw(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);
		if (!isChoice && this.limitContent)
			RPM.Common.Platform.ctx.restore();
	}
}

// Tweaked this code to be a function instead of command
function spawnWindow(id, x, y, width, height, text)
{
	const value = [id, new RPM.Core.WindowBox(x, y, width, height,
	{
		content: new RPM.Graphic.Message(text.toString(), -1, 0, 0),
		padding: RPM.Core.WindowBox.VERY_SMALL_PADDING_BOX
	})];
	value[1].content.update();
	value[1].customWindowSkin = RPM.Datas.Systems.getCurrentWindowSkin();
	const p = RPM.Manager.Stack.displayedPictures;
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
// "Multiple window boxes" plugin code by @Russo - End
