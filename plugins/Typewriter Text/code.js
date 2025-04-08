const pluginName = 'Typewriter Text';

const textSpeed = Manager.Plugins.getParameter(pluginName, 'Text speed variable ID');
const textSound = Manager.Plugins.getParameter(pluginName, 'Text sound variable ID');

function updateWindow(id, x, y, width, height, wholeText, count) {
	Manager.Songs.playSound(Core.Game.current.variables[textSound], 0.05);
	spawnWindow(id, x, y, height, width, wholeText.substring(0, count));
	if (count < wholeText.length)
		setTimeout(
			updateWindow,
			Math.max(Core.Game.current.variables[textSpeed] * 1000, 1),
			id,
			x,
			y,
			width,
			height,
			wholeText,
			++count
		);
	else
		for (var i = 0; i < Manager.Stack.displayedPictures.length; i++)
			if (Manager.Stack.displayedPictures[i][0] === id)
				Manager.Stack.displayedPictures[i][1].typewriterTextPlugin_doneTyping = true;
}

Manager.Plugins.registerCommand(pluginName, 'Is done typing', (textID, varID) => {
	Core.Game.current.variables[varID] = false;
	for (var i = 0; i < Manager.Stack.displayedPictures.length; i++)
		if (Manager.Stack.displayedPictures[i][0] === textID)
			Core.Game.current.variables[varID] =
				!!Manager.Stack.displayedPictures[i][1].typewriterTextPlugin_doneTyping;
});

// Typewriter plugin code - Start
Manager.Plugins.registerCommand(pluginName, 'Show Text', (id, text, x, y, width, height) => {
	var i;
	text = text.toString();
	while (true) {
		// not the best practice but works in this scenario
		i = text.search(/[^\\]\\n/); // regex for "find \n except when it's \\n"
		if (i === -1) break;
		text = text.slice(0, i + 1) + '\n' + text.slice(i + 3);
	}
	updateWindow(id, x, y, width, height, text.replace('\\\\n', '\\n'), 0);
});
// Typewriter plugin code - End

// "Multiple window boxes" plugin code by @Russo (https://github.com/yaleksander/RPM-Plugin-Multiple-window-boxes) - Start
Core.WindowBox.prototype.draw = function (
	isChoice = false,
	windowDimension = this.windowDimension,
	contentDimension = this.contentDimension
) {
	if (this.content)
		this.content.drawBehind(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);

	// Single line alteration from source code
	!!this.customWindowSkin
		? this.customWindowSkin.drawBox(windowDimension, this.selected, this.bordersVisible)
		: Datas.Systems.getCurrentWindowSkin().drawBox(windowDimension, this.selected, this.bordersVisible);

	if (this.content) {
		if (!isChoice && this.limitContent) {
			Common.Platform.ctx.save();
			Common.Platform.ctx.beginPath();
			Common.Platform.ctx.rect(
				contentDimension[0],
				contentDimension[1] - Common.ScreenResolution.getScreenY(this.padding[3] / 2),
				contentDimension[2],
				contentDimension[3] + Common.ScreenResolution.getScreenY(this.padding[3])
			);
			Common.Platform.ctx.clip();
		}
		if (isChoice)
			this.content.drawChoice(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);
		else this.content.draw(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);
		if (!isChoice && this.limitContent) Common.Platform.ctx.restore();
	}
};

// Tweaked this code to be a function instead of command
function spawnWindow(id, x, y, width, height, text) {
	const value = [
		id,
		new Core.WindowBox(x, y, width, height, {
			content: new Graphic.Message(text.toString(), -1, 0, 0),
			padding: Core.WindowBox.VERY_SMALL_PADDING_BOX,
		}),
	];
	value[1].content.update();
	value[1].customWindowSkin = Datas.Systems.getCurrentWindowSkin();
	const p = Manager.Stack.displayedPictures;
	var ok = false;
	for (var i = 0; i < p.length; i++) {
		if (id === p[i][0]) {
			p[i] = value;
			ok = true;
			break;
		} else if (id < p[i][0]) {
			p.splice(i, 0, value);
			ok = true;
			break;
		}
	}
	if (!ok) p.push(value);
}
// "Multiple window boxes" plugin code by @Russo - End
