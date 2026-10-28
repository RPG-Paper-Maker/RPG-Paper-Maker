const pluginName = "More sound options";

const up = new THREE.Vector3(0, 1, 0);
const raycaster = new THREE.Raycaster();

var audioList = [];
var mountains = [];
var walls = [];
var lastMap = null;

class WaitAsyncOperation extends EventCommand.Base
{
	constructor()
	{
		super();
		this.asyncFinished = false;
	}

	update(currentState)
	{
		return this.asyncFinished;
	}
}

function addCustomWaitCommand()
{
	const c = Core.ReactionInterpreter.currentReaction.currentCommand;
	if (!c.hasCustomWaitCommand)
	{
		c.hasCustomWaitCommand = true;
		const n = c.next;
		c.next = new Core.Node(c.parent, new WaitAsyncOperation());
		c.next.next = n;
	}
	else
		c.next.data.asyncFinished = false;
	return c.next;
}

function getMapObjById(id)
{
	if (id == -1)
		return Core.ReactionInterpreter.currentObject;
	if (id == 0)
		return Scene.Map.current.hero;
	for (const [key, portion] of Scene.Map.current.objectsSpatialHash)
		for (const obj of portion)
			if (obj.id === id)
				return obj;
	return null;
}

Manager.Plugins.registerCommand(pluginName, "Load track", (id, audio) =>
{
	const waitCommand = addCustomWaitCommand();
	const howl = new Howl({src: Model.Song.getFolder(audio.kind, audio.isBR, audio.dlc) + "/" + audio.name});
	while (audioList.length <= id)
		audioList.push(null);
	if (audioList[id] !== null)
	{
		if (howl._src === audioList[id]._src)
		{
			howl.unload();
			waitCommand.data.asyncFinished = true;
			return;
		}
		else
		{
			audioList[id].stop();
			audioList[id].unload();
		}
	}
	howl.anchored = null;
	audioList.splice(id, 1, howl);
	if (howl.state() === "loaded")
		waitCommand.data.asyncFinished = true;
	else
	{
		howl.once("load", function ()
		{
			waitCommand.data.asyncFinished = true;
		});
	}
});

Manager.Plugins.registerCommand(pluginName, "Remove track", (id) =>
{
	if (!!audioList[id])
	{
		audioList[id].stop();
		audioList[id].unload();
		audioList.splice(id, 1);
		while (audioList[audioList.length - 1] === null)
			audioList.pop();
	}
});

Manager.Plugins.registerCommand(pluginName, "Play", (id) =>
{
	audioList[id].play();
});

Manager.Plugins.registerCommand(pluginName, "Pause", (id) =>
{
	audioList[id].pause();
});

Manager.Plugins.registerCommand(pluginName, "Seek", (id, minute, second) =>
{
	audioList[id].seek((minute * 60 + second) % audioList[id].duration());
});

Manager.Plugins.registerCommand(pluginName, "Fade", (id, from, to, duration) =>
{
	audioList[id].fade(Math.max(0.0, Math.min(1.0, from / 100.0)), Math.max(0.0, Math.min(1.0, to / 100.0)), duration * 1000);
});

Manager.Plugins.registerCommand(pluginName, "Loop", (id, value) =>
{
	audioList[id].loop(value);
});

Manager.Plugins.registerCommand(pluginName, "Set volume", (id, value) =>
{
	if (!audioList[id].anchored)
		audioList[id].volume(Math.max(0, Math.min(1.0, value / 100.0)));
	else
		audioList[id].volMult = Math.max(0, Math.min(1.0, value / 100.0));
});

Manager.Plugins.registerCommand(pluginName, "Set speed", (id, value) =>
{
	audioList[id].rate(Math.max(0.5, Math.min(4.0, value)));
});

Manager.Plugins.registerCommand(pluginName, "Set pan", (id, value) =>
{
	if (!audioList[id].anchored)
		audioList[id].stereo(Math.max(-1.0, Math.min(1.0, value)));
	else
		audioList[id].prevStereo = Math.max(-1.0, Math.min(1.0, value));
});

Manager.Plugins.registerCommand(pluginName, "Anchor", (trackID, objID, minDist, maxDist, stereo, wallBlock, expFade) =>
{
	audioList[trackID].anchored = getMapObjById(objID);
	if (!!audioList[trackID].anchored)
	{
		audioList[trackID].isStereo = stereo;
		audioList[trackID].volMult = audioList[trackID].volume();
		audioList[trackID].prevStereo = audioList[trackID].stereo();
		audioList[trackID].maxDist = maxDist;
		audioList[trackID].minDist = minDist;
		audioList[trackID].wallBlock = wallBlock / 100.0;
		audioList[trackID].exp = expFade;
	}
});

Manager.Plugins.registerCommand(pluginName, "Free", (id) =>
{
	audioList[id].anchored = null;
	audioList[id].volume(audioList[id].volMult);
	audioList[id].stereo(audioList[id].prevStereo);
});

setInterval(function()
{
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading && lastMap !== Scene.Map.current)
	{
		lastMap = Scene.Map.current;
		mountains = [];
		walls = [];
		for (portion of Scene.Map.current.mapPortions)
		{
			if (portion != null)
			{
				for ([key, value] of portion.staticMountainsList)
					if (value != null)
						mountains.push(value.mesh);
				for (value of portion.staticWallsList)
					if (value != null)
						walls.push(value);
			}
		}
	}
}, 500);

setInterval(function()
{
	if (Manager.Stack.top instanceof Scene.Map && !Scene.Map.current.loading)
	{
		const hero = Core.Game.current.hero.position.clone();
		for (track of audioList)
		{
			if (!!track && !!track.anchored)
			{
				const pos = track.anchored.position.clone();
				if (Scene.Map.current.mapLoopPlugin_loopX)
				{
					const l = Scene.Map.current.mapProperties.length;
					if (Math.abs(pos.x - l - hero.x) < Math.abs(pos.x - hero.x))
						pos.setX(pos.x - l);
					else if (Math.abs(pos.x + l - hero.x) < Math.abs(pos.x - hero.x))
						pos.setX(pos.x + l);
				}
				if (Scene.Map.current.mapLoopPlugin_loopZ)
				{
					const w = Scene.Map.current.mapProperties.width;
					if (Math.abs(pos.z - w - hero.z) < Math.abs(pos.z - hero.z))
						pos.setZ(pos.z - w);
					else if (Math.abs(pos.z + w - hero.z) < Math.abs(pos.z - hero.z))
						pos.setZ(pos.z + w);
				}
				const dist = pos.distanceTo(hero);
				const max = track.maxDist;
				const min = track.minDist;
				const wall = track.wallBlock;
				const x = Math.min(1, Math.max(0, (dist - min) / (max - min)));
				const y = track.exp ? 1 + Math.pow(x - 1, 3) : x;
				const dir = pos.clone().sub(hero).normalize();
				const v = dir.clone().applyAxisAngle(up, Scene.Map.current.camera.horizontalAngle * Math.PI / 180);
				track.stereo(track.isStereo ? v.z * y : 0);
				track.volume(track.volMult * (1 - y));
				if (track.wallBlock > 0)
				{
					raycaster.set(hero, dir);
					const mi = raycaster.intersectObjects(mountains);
					while (mi.length > 0 && mi[mi.length - 1].distance > dist)
						mi.pop();
					const wi = raycaster.intersectObjects(walls);
					while (wi.length > 0 && wi[wi.length - 1].distance > dist)
						wi.pop();
					track.volume(track.volume() * (1.0 - Math.max(0, (mi.length + wi.length) * track.wallBlock)));
				}
			}
		}
	}
}, 100);
