const pluginName = 'Multiple window boxes';

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

Manager.Plugins.registerCommand(pluginName, 'Spawn window', (id, x, y, width, height, text) => {
	var i;
	text = text.toString();
	while (true) {
		// not the best practice but works in this scenario
		i = text.search(/[^\\]\\n/); // regex for "find \n except when it's \\n"
		if (i === -1) break;
		text = text.slice(0, i + 1) + '\n' + text.slice(i + 3);
	}
	const pad = Datas.Systems.dbOptions;
	const value = [
		id,
		new Core.WindowBox(x, y, width, height, {
			content: new Graphic.Message(text, -1, 0, 0),
			padding: [pad.v_pLeft, pad.v_pTop, pad.v_pRight, pad.v_pBottom],
		}),
	];
	value[1].content.update();
	value[1].customWindowSkin = Datas.Systems.getCurrentWindowSkin();
	const p = Manager.Stack.displayedPictures;
	var ok = false;
	for (i = 0; i < p.length; i++) {
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
});

function getWindow(id) {
	const p = Manager.Stack.displayedPictures;
	for (var i = 0; i < p.length; i++) if (id === p[i][0]) return p[i][1];
	return new Core.WindowBox(0, 0, 0, 0);
}

Manager.Plugins.registerCommand(pluginName, 'Update window', (id) => {
	getWindow(id).update();
});

Manager.Plugins.registerCommand(pluginName, 'Edit content', (id, text) => {
	const p = getWindow(id);
	p.content.setMessage(text.toString());
	p.content.update();
});

Manager.Plugins.registerCommand(pluginName, 'Mark selected', (id, select) => {
	getWindow(id).selected = select;
});
