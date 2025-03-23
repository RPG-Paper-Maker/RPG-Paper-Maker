import { RPM } from "../path.js";
import { Howl } from "../../System/Globals.js";
import { THREE } from "../../System/Globals.js";

const pluginName = "More sound options";

const up = new THREE.Vector3(0, 1, 0);

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
		const howl = new Howl({src: RPM.System.Song.getFolder(audio.kind, audio.isBR, audio.dlc) + "/" + audio.name});
		while (audioList.length <= id)
			audioList.push(null);
		if (audioList[id] !== null)
		{
			if (howl._src === audioList[id]._src)
			{
				howl.unload();
				callNext();
				return;
			}
			else
			{
				audioList[id].stop();
				audioList[id].unload();
			}
		}
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
	});
	if (!busy)
		callNext();
});

RPM.Manager.Plugins.registerCommand(pluginName, "Remove track", (id) =>
{
	queue.push(function ()
	{
		if (!!audioList[id])
		{
			audioList[id].stop();
			audioList[id].unload();
			audioList.splice(id, 1);
			while (audioList[audioList.length - 1] === null)
				audioList.pop();
		}
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
		audioList[id].seek((minute * 60 + second) % audioList[id].duration());
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

RPM.Manager.Plugins.registerCommand(pluginName, "Update distance based values", (minDist, maxDist, propVol, propPan) =>
{
	const min = RPM.Datas.Systems.SQUARE_SIZE * minDist;
	const max = RPM.Datas.Systems.SQUARE_SIZE * maxDist;
	const hero = RPM.Core.Game.current.hero.position;
	const obj = RPM.Core.ReactionInterpreter.currentObject;
	const dist = obj.position.distanceTo(hero);
	const v = obj.position.clone().sub(hero);
	v.applyAxisAngle(up, RPM.Scene.Map.current.camera.horizontalAngle * Math.PI / 180);
	obj.properties[propVol] = Math.max(0, max - dist) * 100 / max;
	obj.properties[propPan] = v.z * Math.max(0, (dist - min) / (max - min)) / max;
});
