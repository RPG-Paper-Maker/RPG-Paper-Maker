import { RPM } from "../path.js";
import { Howl } from "../../System/Globals.js";

const pluginName = "More sound options";

var audioList = [];
var queue = [];
var busy = false;

function callNext()
{
    busy = true;
	if (queue.length > 0)
		queue.shift().call();
	else
		busy = false;
}

RPM.Manager.Plugins.registerCommand(pluginName, "Load track", (id, audio) =>
{
	queue.push(function ()
	{
		while (audioList.length <= id)
			audioList.push(null);
		if (audioList[id] !== null)
		{
			audioList[id].stop();
			audioList[id].unload();
		}
		const howl = new Howl({src: audio.howl._src});
		audioList.splice(id, 1, howl);
		if (howl.state() === "loaded")
			callNext();
		else
		{
			howl.once("load", function ()
			{
				callNext();
			});
		}
		console.log(howl.state());
	});
    if (!busy)
        callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Remove track", (id) =>
{
	queue.push(function ()
	{
		audioList[id].stop();
		audioList[id].unload();
		audioList.splice(id, 1);
		while (audioList[audioList.length - 1] === null)
			audioList.pop();
        callNext();
	});
    if (!busy)
        callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Play", (id) =>
{
	queue.push(function ()
	{
		audioList[id].play();
        callNext();
	});
    if (!busy)
        callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Pause", (id) =>
{
	queue.push(function ()
	{
		audioList[id].pause();
        callNext();
	});
    if (!busy)
        callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Seek", (id, minute, second) =>
{
	queue.push(function ()
	{
		audioList[id].seek(minute * 60 + second);
        callNext();
	});
    if (!busy)
        callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Fade", (id, from, to, duration) =>
{
	queue.push(function ()
	{
		audioList[id].fade(Math.max(0.0, Math.min(1.0, from / 100)), Math.max(0.0, Math.min(1.0, to / 100)), duration * 1000);
        callNext();
	});
    if (!busy)
        callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Loop", (id, value) =>
{
	queue.push(function ()
	{
		audioList[id].loop(value);
        callNext();
	});
    if (!busy)
        callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set volume", (id, value) =>
{
	queue.push(function ()
	{
		audioList[id].volume(Math.max(0.0, Math.min(1.0, value / 100)));
        callNext();
	});
    if (!busy)
        callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set speed", (id, value) =>
{
	queue.push(function ()
	{
		audioList[id].rate(Math.max(0.5, Math.min(4.0, value)));
        callNext();
	});
    if (!busy)
        callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Set pan", (id, value) =>
{
	queue.push(function ()
	{
		audioList[id].stereo(Math.max(-1.0, Math.min(1.0, value)));
        callNext();
	});
    if (!busy)
        callNext();
});
