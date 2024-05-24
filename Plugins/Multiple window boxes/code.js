import { RPM } from "../path.js"

const pluginName = "Multiple window boxes";

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
			RPM.Common.Platform.ctx.rect(contentDimension[0], contentDimension[1] -
			RPM.Common.ScreenResolution.getScreenY(this.padding[3] / 2), contentDimension[2], contentDimension[3] + RPM.Common.ScreenResolution.getScreenY(this.padding[3]));
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

RPM.Manager.Plugins.registerCommand(pluginName, "Spawn window", (id, x, y, width, height, text) =>
{
	const value = [id, new RPM.Core.WindowBox(x, y, width, height,
	{
		content: new RPM.Graphic.Message(text, -1, 0, 0),
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
});

function getWindow(id)
{
	const p = RPM.Manager.Stack.displayedPictures;
	for (var i = 0; i < p.length; i++)
		if (id === p[i][0])
			return p[i][1];
	return new RPM.Core.WindowBox(0, 0, 0, 0);
}

RPM.Manager.Plugins.registerCommand(pluginName, "Update window", (id) =>
{
	getWindow(id).update();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Edit content", (id, text) =>
{
	const p = getWindow(id);
	p.content.setMessage(text);
	p.content.update();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Mark selected", (id, select) =>
{
	getWindow(id).selected = select;
});
