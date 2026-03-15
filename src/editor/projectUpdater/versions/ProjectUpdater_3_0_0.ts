/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ArrayUtils, Constants, IO, JSONType, OS_KIND, Paths } from '../../common';
import {
	copyFolder,
	createFile,
	createFolder,
	getFiles,
	getFolders,
	moveFile,
	moveFolder,
	readJSON,
	removeFile,
	removeFolder,
	writeJSON,
} from '../../common/Platform';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import { MapObjectCommandType } from '../../models';
import { ProjectUpdater } from '../ProjectUpdater';

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function convertRotationAngles(angleY: number, angleX: number, angleZ: number): [number, number, number] {
	const ay = angleY * DEG_TO_RAD;
	const ax = angleX * DEG_TO_RAD;
	const az = angleZ * DEG_TO_RAD;

	const cy = Math.cos(ay);
	const sy = Math.sin(ay);
	const cx = Math.cos(ax);
	const sx = Math.sin(ax);
	const cz = Math.cos(az);
	const sz = Math.sin(az);
	const m02 = cz * sy + sz * sx * cy;
	const m12 = sz * sy - cz * sx * cy;
	const m22 = cx * cy;
	const m01 = -sz * cx;
	const m00 = cz * cy - sz * sx * sy;
	const m21 = sx;
	const m11 = cz * cx;
	const newAY = Math.asin(Math.max(-1, Math.min(1, m02)));
	let newAX: number;
	let newAZ: number;
	if (Math.abs(Math.cos(newAY)) > 1e-6) {
		newAX = Math.atan2(-m12, m22);
		newAZ = Math.atan2(-m01, m00);
	} else {
		newAZ = 0;
		newAX = Math.atan2(m21, m11);
	}
	return [
		Math.round(newAY * RAD_TO_DEG * 1000) / 1000,
		Math.round(newAX * RAD_TO_DEG * 1000) / 1000,
		Math.round(newAZ * RAD_TO_DEG * 1000) / 1000,
	];
}

function convertPositionAngles(posArray: number[]) {
	if (!posArray || posArray.length < 10) {
		return;
	}

	const angleY = posArray[7] ?? 0;
	const angleX = posArray[8] ?? 0;
	const angleZ = posArray[9] ?? 0;
	let nonZeroCount = 0;
	if (angleY !== 0) nonZeroCount++;
	if (angleX !== 0) nonZeroCount++;
	if (angleZ !== 0) nonZeroCount++;
	if (nonZeroCount < 2) {
		return;
	}
	const [newAngleY, newAngleX, newAngleZ] = convertRotationAngles(angleY, angleX, angleZ);
	posArray[7] = newAngleY;
	posArray[8] = newAngleX;
	posArray[9] = newAngleZ;
}

class ProjectUpdater_3_0_0 {
	static async update(callback: (percent: number) => void) {
		const projectPath = Project.current!.getPath();

		// If desktop, remove electron stuff and move content folder
		let folders: string[];
		if (Constants.IS_DESKTOP) {
			const os = await IO.getOS();
			folders = await getFolders(projectPath);
			const files = await getFiles(projectPath);
			for (const file of files) {
				await removeFile(Paths.join(projectPath, file));
			}
			for (const folder of folders) {
				if (folder !== (os === OS_KIND.DARWIN ? 'Game.app' : 'resources')) {
					await removeFolder(Paths.join(projectPath, folder));
				}
			}
			const contentPath =
				os === OS_KIND.DARWIN
					? Paths.join(projectPath, 'Game.app', 'Contents', 'Resources', 'app', 'Content')
					: Paths.join(projectPath, 'resources', 'app', 'Content');
			folders = await getFolders(contentPath);
			for (const folder of folders) {
				await copyFolder(Paths.join(contentPath, folder), Paths.join(projectPath, folder));
			}
			await removeFolder(Paths.join(projectPath, os === OS_KIND.DARWIN ? 'Game.app' : 'resources'));
		}

		// Remove maps temp files
		await removeFolder(Paths.join(projectPath, 'Datas', 'Maps', 'temp'));
		folders = await getFolders(Paths.join(projectPath, 'Datas', 'Maps'));
		for (const name of folders) {
			const mapPath = Paths.join(projectPath, 'Datas', 'Maps', name);
			await removeFolder(Paths.join(mapPath, 'temp'));
			await createFolder(Paths.join(mapPath, 'temp'));
			await removeFolder(Paths.join(mapPath, 'tempUndoRedo'));
			await createFolder(Paths.join(mapPath, 'temp-undo-redo'));
			await createFile(Paths.join(mapPath, 'temp-undo-redo', 'index'), '-1');
			const jsonInfos = await readJSON(Paths.join(mapPath, 'infos.json'));
			const jsonObjects = await readJSON(Paths.join(mapPath, 'objects.json'));
			if (jsonInfos && jsonObjects) {
				jsonInfos.objs = jsonObjects.objs;
				await writeJSON(Paths.join(mapPath, 'infos.json'), jsonInfos);
			}
			await removeFile(Paths.join(mapPath, 'objects.json'));
		}
		callback(10);

		// Move all files correctly
		await removeFile(Paths.join(projectPath, 'Datas', 'Scripts', 'Plugins', 'path.js'));
		await moveFolder(Paths.join(projectPath, 'Datas', 'Scripts', 'Plugins'), Paths.join(projectPath, 'Plugins'));
		await moveFolder(Paths.join(projectPath, 'Datas', 'Maps'), Paths.join(projectPath, 'Maps'));
		await moveFolder(Paths.join(projectPath, 'Datas', 'Saves'), Paths.join(projectPath, 'Saves'));
		const names = [
			'animations',
			'armors',
			'battleSystem',
			'classes',
			'commonEvents',
			'dlcs',
			'fonts',
			'heroes',
			'items',
			'keyBoard',
			'langs',
			'monsters',
			'pictures',
			'scripts',
			'settings',
			'shapes',
			'skills',
			'songs',
			'specialElements',
			'status',
			'system',
			'tilesets',
			'titlescreenGameover',
			'troops',
			'variables',
			'videos',
			'weapons',
		];
		for (const name of names) {
			await moveFile(Paths.join(projectPath, 'Datas', `${name}.json`), Paths.join(projectPath, `${name}.json`));
		}
		await moveFile(Paths.join(projectPath, 'Datas', 'treeMap.json'), Paths.join(projectPath, 'treeMaps.json'));
		await removeFolder(Paths.join(projectPath, 'Datas'));
		callback(20);

		// Treemaps folders ids should be unique
		let json = await readJSON(Paths.join(projectPath, 'treeMaps.json'));
		if (json) {
			let id = -2;
			const updateTree = (nodes: JSONType[] = []) => {
				for (const node of nodes) {
					if ((node.id as number) <= -1) {
						node.id = id--;
					}
					updateTree(node.children as JSONType[]);
				}
			};
			updateTree(json.tree as JSONType[]);
			await writeJSON(Paths.join(projectPath, 'treeMaps.json'), json);
		}
		callback(25);

		// Map portions edit
		const jsonSystems = (await readJSON(Paths.join(projectPath, 'system.json'))) ?? {};
		const heroMapID = jsonSystems.idMapHero as number;
		const idObjHero = jsonSystems.idObjHero as number;
		const mapName = `MAP${String(heroMapID).padStart(4, '0')}`;
		await ProjectUpdater.updateAllMapPortions((json: JSONType, currentMapName: string) => {
			const floors = ((json.lands as JSONType)?.floors as JSONType[]) ?? [];
			for (const floor of floors) {
				(floor.v as JSONType).k = 1;
			}
			const autotiles = ((json.lands as JSONType)?.autotiles as JSONType[]) ?? [];
			for (const autotile of autotiles) {
				(autotile.v as JSONType).k = 2;
			}
			json.lands = [...floors, ...autotiles];
			const sprites = ((json.sprites as JSONType)?.list as JSONType[]) ?? [];
			for (const sprite of sprites) {
				const value = sprite.v as JSONType;
				value.k = (value.k as number) - 1;
			}
			const walls = ((json.sprites as JSONType)?.walls as JSONType[]) ?? [];
			for (const wall of walls) {
				const value = wall.v as JSONType;
				value.t = value.k;
				delete value.k;
			}
			json.walls = walls;
			json.sprites = sprites;
			json.moun = ((json.moun as JSONType)?.a as JSONType[]) ?? [];
			json.objs3d = ((json.objs3d as JSONType)?.a as JSONType[]) ?? [];
			json.objs = ((json.objs as JSONType)?.list as JSONType[]) ?? [];
			if (currentMapName === mapName) {
				json.objs = (json.objs as JSONType[]).filter((obj) => (obj.v as JSONType).id !== idObjHero);
			}
		});
		callback(50);

		// Remove hero from map infos
		json = await readJSON(Paths.join(projectPath, 'Maps', mapName, 'infos.json'));
		if (json) {
			const hero = (json.objs as JSONType[]).find((obj) => obj.id === idObjHero);
			if (hero) {
				jsonSystems.hmp = hero.p;
				delete jsonSystems.idObjHero;
				await writeJSON(Paths.join(projectPath, 'system.json'), jsonSystems);
				ArrayUtils.removeElement(json.objs as JSONType[], hero);
				await writeJSON(Paths.join(projectPath, 'Maps', mapName, 'infos.json'), json);
			}
		}
		await createFile(Paths.join(projectPath, 'game.rpmg'), '');
		callback(60);

		// Common events default and hero objects
		const jsonEvents = await readJSON(Paths.join(projectPath, 'commonEvents.json'));
		if (jsonEvents) {
			const objects = jsonEvents.commonObjects as JSONType[];
			let index = objects.findIndex((obj) => obj.id === 1);
			let object = objects[index];
			const defaultObject = {
				events: [{ id: 1, name: 'Hero action', p: [], r: { '1': { bh: true, c: [] } }, sys: false }],
				hId: -1,
				id: 1,
				name: '',
				ooepf: false,
				states: [
					{
						cam: true,
						climb: false,
						dir: false,
						gid: -1,
						gk: 0,
						id: 1,
						move: true,
						name: 'State 1',
						pix: true,
						pos: false,
						stop: false,
						sx: { k: 12, v: 1 },
						sy: { k: 12, v: 1 },
						sz: { k: 12, v: 1 },
						through: false,
						x: 0,
						y: 0,
					},
				],
			};
			jsonEvents.do = object ?? defaultObject;
			objects[index] = object ?? defaultObject;
			index = objects.findIndex((obj) => obj.id === 2);
			object = objects[index];
			jsonEvents.ho = object ?? jsonEvents.do;
			objects[index] = object ?? defaultObject;
			await writeJSON(Paths.join(projectPath, 'commonEvents.json'), jsonEvents);
		}
		callback(70);

		// Move turn a picture
		await ProjectUpdater.updateAllCommands((json: JSONType) => {
			const command = json.command as MapObjectCommandType[];
			if (json.kind === 36) {
				const b = command[command.length - 1];
				ArrayUtils.removeAt(command, command.length - 1);
				ArrayUtils.insertAt(command, command.length - 2, b);
			}
			json.command = command.map((value) =>
				typeof value === 'string'
					? value
							.replaceAll(
								/Core\.ReactionInterpreter\.currentParameters\[(\d+)\]/g,
								'Core.ReactionInterpreter.currentParameters.get($1)',
							)
							.replaceAll('Datas.', 'Data.')
							.replaceAll('System.', 'Model.')
					: value,
			);
		});

		// Move turn a picture
		await ProjectUpdater.updateAllObjectStates((json: JSONType) => {
			if ((json.gk as number) >= 4) {
				(json.gk as number)--;
			}
		});
		callback(80);

		// Title screen commands ids unique
		const jsonTitle = await readJSON(Paths.join(projectPath, 'titlescreenGameover.json'));
		if (jsonTitle) {
			let id = 1;
			for (const command of jsonTitle.tc as JSONType[]) {
				command.id = id++;
			}
			id = 1;
			for (const command of jsonTitle.gameOverCommands as JSONType[]) {
				command.id = id++;
			}
			await writeJSON(Paths.join(projectPath, 'titlescreenGameover.json'), jsonTitle);
		}

		// Assets none and tileset is BR
		const jsonPictures = await readJSON(Paths.join(projectPath, 'pictures.json'));
		if (jsonPictures) {
			const list = jsonPictures.list as JSONType[];
			for (const obj of list) {
				for (const picture of obj.v as JSONType[]) {
					if (picture.id === -1 || picture.id === 0) {
						picture.br = true;
					}
				}
			}
			await writeJSON(Paths.join(projectPath, 'pictures.json'), jsonPictures);
		}
		const jsonSongs = await readJSON(Paths.join(projectPath, 'songs.json'));
		if (jsonSongs) {
			const list = jsonSongs.list as JSONType[];
			for (const obj of list) {
				const song = (obj.v as JSONType[]).find((song) => song.id === -1);
				if (song) {
					song.br = true;
				}
			}
			await writeJSON(Paths.join(projectPath, 'songs.json'), jsonSongs);
		}
		const jsonVideos = await readJSON(Paths.join(projectPath, 'videos.json'));
		if (jsonVideos) {
			const video = (jsonVideos.list as JSONType[]).find((video) => video.id === -1);
			if (video) {
				video.br = true;
			}
			await writeJSON(Paths.join(projectPath, 'videos.json'), jsonVideos);
		}
		const jsonShapes = await readJSON(Paths.join(projectPath, 'shapes.json'));
		if (jsonShapes) {
			const list = jsonShapes.list as JSONType[];
			for (const obj of list) {
				const shape = (obj.v as JSONType[]).find((shape) => shape.id === -1);
				if (shape) {
					shape.br = true;
				}
			}
			await writeJSON(Paths.join(projectPath, 'shapes.json'), jsonShapes);
		}
		const jsonFonts = await readJSON(Paths.join(projectPath, 'fonts.json'));
		if (jsonFonts) {
			const font = (jsonFonts.list as JSONType[]).find((font) => font.id === -1);
			if (font) {
				font.br = true;
			}
			await writeJSON(Paths.join(projectPath, 'fonts.json'), jsonFonts);
		}
		callback(90);

		// Plugins: isOn moved to scripts.json and renamed checked, moving type to scripts.json
		const manifest = await Model.Plugin.getManifest();
		const onlinePluginNames = manifest?.flat()?.map((plugin) => plugin.name) ?? [];
		const jsonScripts = await readJSON(Paths.join(projectPath, 'scripts.json'));
		if (jsonScripts) {
			const jsonPlugins = (jsonScripts.plugins as JSONType[]) ?? [];
			for (const plugin of jsonPlugins) {
				const detailsPath = Paths.join(projectPath, 'Plugins', plugin.name as string, 'details.json');
				const pluginDetails = await readJSON(detailsPath);
				if (pluginDetails) {
					if (pluginDetails.isOn === false) {
						plugin.checked = false;
						delete pluginDetails.isOn;
					}
					if (pluginDetails.type !== undefined) {
						plugin.type = pluginDetails.type;
						delete pluginDetails.type;
					}
					if (onlinePluginNames.includes(plugin.name)) {
						plugin.type = 2;
					}
					await writeJSON(detailsPath, pluginDetails);
				}
			}
			await writeJSON(Paths.join(projectPath, 'scripts.json'), jsonScripts);
		}

		// Remove statistic progression duplications ids
		const jsonClasses = await readJSON(Paths.join(projectPath, 'classes.json'));
		if (jsonClasses) {
			const classes = jsonClasses.list as JSONType[];
			if (classes) {
				for (const obj of classes) {
					const classObj = obj.v as JSONType;
					if (classObj.stats) {
						classObj.stats = Array.from(
							new Map((classObj.stats as JSONType[]).map((stat) => [stat.id, stat])).values(),
						);
						if ((classObj.stats as JSONType[]).length === 0) {
							delete classObj.stats;
						}
					}
				}
				await writeJSON(Paths.join(projectPath, 'classes.json'), jsonClasses);
			}
		}

		// Troop monster, add monsterID
		const jsonTroops = await readJSON(Paths.join(projectPath, 'troops.json'));
		if (jsonTroops) {
			const troops = jsonTroops.troops as JSONType[];
			if (troops) {
				for (const troop of troops) {
					const monsters = troop.l as JSONType[];
					if (monsters) {
						let i = 1;
						for (const monster of monsters) {
							monster.mid = monster.id ?? 0;
							monster.id = i++;
						}
					}
				}
				await writeJSON(Paths.join(projectPath, 'troops.json'), jsonTroops);
			}
		}

		// Update keyboard
		const qtToKeyString = (qtKey: number): string => {
			switch (qtKey) {
				case 16777219:
					return 'Backspace';
				case 16777217:
					return 'Tab';
				case 16777220:
					return 'Enter';
				case 16777221:
					return 'Enter';
				case 16777248:
					return 'Shift';
				case 16777249:
					return 'Control';
				case 16777251:
					return 'Alt';
				case 16777224:
					return 'Pause';
				case 16777252:
					return 'CapsLock';
				case 16777216:
					return 'Escape';
				case 16777238:
					return 'PageUp';
				case 16777239:
					return 'PageDown';
				case 16777233:
					return 'End';
				case 16777250:
					return 'Home';
				case 16777234:
					return 'ArrowLeft';
				case 16777235:
					return 'ArrowUp';
				case 16777236:
					return 'ArrowRight';
				case 16777237:
					return 'ArrowDown';
				case 16777222:
					return 'Insert';
				case 16777223:
					return 'Delete';
				case 16777264:
					return 'F1';
				case 16777265:
					return 'F2';
				case 16777266:
					return 'F3';
				case 16777267:
					return 'F4';
				case 16777268:
					return 'F5';
				case 16777269:
					return 'F6';
				case 16777270:
					return 'F7';
				case 16777271:
					return 'F8';
				case 16777272:
					return 'F9';
				case 16777273:
					return 'F10';
				case 16777274:
					return 'F11';
				case 16777275:
					return 'F12';
				case 16777253:
					return 'NumLock';
				case 96:
					return '`';
				case 44:
					return ',';
				case 45:
					return '-';
				case 61:
					return '=';
				case 46:
					return '.';
				case 47:
					return '/';
				case 92:
					return '\\';
				case 91:
					return '[';
				case 93:
					return ']';
				case 34:
					return '"';
				case 59:
					return ';';
				case 39:
					return "'";
				case 32:
					return ' ';
				// Digits
				case 48:
					return '0';
				case 49:
					return '1';
				case 50:
					return '2';
				case 51:
					return '3';
				case 52:
					return '4';
				case 53:
					return '5';
				case 54:
					return '6';
				case 55:
					return '7';
				case 56:
					return '8';
				case 57:
					return '9';
				// Letters
				case 65:
					return 'a';
				case 66:
					return 'b';
				case 67:
					return 'c';
				case 68:
					return 'd';
				case 69:
					return 'e';
				case 70:
					return 'f';
				case 71:
					return 'g';
				case 72:
					return 'h';
				case 73:
					return 'i';
				case 74:
					return 'j';
				case 75:
					return 'k';
				case 76:
					return 'l';
				case 77:
					return 'm';
				case 78:
					return 'n';
				case 79:
					return 'o';
				case 80:
					return 'p';
				case 81:
					return 'q';
				case 82:
					return 'r';
				case 83:
					return 's';
				case 84:
					return 't';
				case 85:
					return 'u';
				case 86:
					return 'v';
				case 87:
					return 'w';
				case 88:
					return 'x';
				case 89:
					return 'y';
				case 90:
					return 'z';
				default:
					return `Unknown(${qtKey})`; // fallback
			}
		};
		await moveFile(Paths.join(projectPath, 'keyBoard.json'), Paths.join(projectPath, 'keyboard.json'));
		const jsonKeyboard = await readJSON(Paths.join(projectPath, 'keyboard.json'));
		if (jsonKeyboard) {
			const list = jsonKeyboard.list as JSONType[];
			for (const keyboard of list) {
				keyboard.sc = (keyboard.sc as number[][]).map((sc) => sc.map((key) => qtToKeyString(key)));
			}
			await writeJSON(Paths.join(projectPath, 'keyboard.json'), jsonKeyboard);
		}

		await ProjectUpdater.updateAllMapPortions((json: JSONType) => {
			for (const entry of (json.objs3d ?? []) as JSONType[]) {
				convertPositionAngles(entry.k as number[]);
			}
			for (const entry of (json.sprites ?? []) as JSONType[]) {
				convertPositionAngles(entry.k as number[]);
			}
			for (const entry of (json.lands ?? []) as JSONType[]) {
				convertPositionAngles(entry.k as number[]);
			}
			for (const entry of (json.walls ?? []) as JSONType[]) {
				convertPositionAngles(entry.k as number[]);
			}
			for (const entry of (json.moun ?? []) as JSONType[]) {
				convertPositionAngles(entry.k as number[]);
			}
		});
	}
}

export { ProjectUpdater_3_0_0 };
