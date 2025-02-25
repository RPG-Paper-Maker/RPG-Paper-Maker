/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ArrayUtils, JSONType, Paths } from '../../common';
import { Platform } from '../../common/Platform';
import { Project } from '../../core';
import { MapObjectCommandType } from '../../models';
import { ProjectUpdater } from '../ProjectUpdater';

class ProjectUpdater_3_0_0 {
	static async update() {
		const projectPath = Project.current!.getPath();

		// Remove maps temp files
		await Platform.removeFolder(Paths.join(projectPath, 'Datas', 'Maps', 'temp'));
		let folders = await Platform.getFolders(Paths.join(projectPath, 'Datas', 'Maps'));
		for (const name of folders) {
			const mapPath = Paths.join(projectPath, 'Datas', 'Maps', name);
			await Platform.removeFolder(Paths.join(mapPath, 'temp'));
			await Platform.createFolder(Paths.join(mapPath, 'temp'));
			await Platform.removeFolder(Paths.join(mapPath, 'tempUndoRedo'));
			await Platform.createFolder(Paths.join(mapPath, 'temp-undo-redo'));
			await Platform.createFile(Paths.join(mapPath, 'temp-undo-redo', 'index'), '-1');
			const jsonInfos = await Platform.readJSON(Paths.join(mapPath, 'infos.json'));
			const jsonObjects = await Platform.readJSON(Paths.join(mapPath, 'objects.json'));
			if (jsonInfos && jsonObjects) {
				jsonInfos.objs = jsonObjects.objs;
				await Platform.writeJSON(Paths.join(mapPath, 'infos.json'), jsonInfos);
			}
			await Platform.removeFile(Paths.join(mapPath, 'objects.json'));
		}

		// Move all files correctly
		await Platform.moveFolder(Paths.join(projectPath, 'Datas', 'Maps'), Paths.join(projectPath, 'Maps'));
		await Platform.moveFolder(Paths.join(projectPath, 'Datas', 'Saves'), Paths.join(projectPath, 'Saves'));
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
			await Platform.moveFile(
				Paths.join(projectPath, 'Datas', `${name}.json`),
				Paths.join(projectPath, `${name}.json`)
			);
		}
		await Platform.moveFile(
			Paths.join(projectPath, 'Datas', 'treeMap.json'),
			Paths.join(projectPath, 'treeMaps.json')
		);
		await Platform.removeFolder(Paths.join(projectPath, 'Datas'));

		// Treemaps folders ids should be unique
		let json = await Platform.readJSON(Paths.join(projectPath, 'treeMaps.json'));
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
			await Platform.writeJSON(Paths.join(projectPath, 'treeMaps.json'), json);
		}

		// Map portions edit
		await ProjectUpdater.updateAllMapPortions((json: JSONType) => {
			const floors = (json.lands as JSONType).floors as JSONType[];
			for (const floor of floors) {
				(floor.v as JSONType).k = 1;
			}
			const autotiles = (json.lands as JSONType).autotiles as JSONType[];
			for (const autotile of autotiles) {
				(autotile.v as JSONType).k = 2;
			}
			json.lands = [...floors, ...autotiles];
			const sprites = (json.sprites as JSONType).list as JSONType[];
			for (const sprite of sprites) {
				const value = sprite.v as JSONType;
				value.k = (value.k as number) - 1;
			}
			const walls = (json.sprites as JSONType).walls as JSONType[];
			for (const wall of walls) {
				const value = wall.v as JSONType;
				value.t = value.k;
				delete value.k;
			}
			json.walls = walls;
			json.sprites = sprites;
			json.moun = (json.moun as JSONType).a as JSONType[];
			json.objs3d = (json.objs3d as JSONType).a as JSONType[];
			json.objs = ((json.objs as JSONType).list as JSONType[]).filter((obj) => (obj.v as JSONType).hId !== 2);
		});

		// Remove hero from map infos
		const jsonSystems = (await Platform.readJSON(Paths.join(projectPath, 'system.json'))) ?? {};
		const heroMapID = jsonSystems.idMapHero as number;
		const idObjHero = jsonSystems.idObjHero as number;
		const mapName = `MAP${String(heroMapID).padStart(4, '0')}`;
		json = await Platform.readJSON(Paths.join(projectPath, 'Maps', mapName, 'infos.json'));
		if (json) {
			const hero = (json.objs as JSONType[]).find((obj) => obj.id === idObjHero);
			if (hero) {
				jsonSystems.hmp = hero.p;
				delete jsonSystems.idObjHero;
				await Platform.writeJSON(Paths.join(projectPath, 'system.json'), jsonSystems);
				ArrayUtils.removeElement(json.objs as JSONType[], hero);
				await Platform.writeJSON(Paths.join(projectPath, 'Maps', mapName, 'infos.json'), json);
			}
		}
		await Platform.createFile(Paths.join(projectPath, 'game.rpmg'), '');

		// Common events default and hero objects
		const jsonEvents = await Platform.readJSON(Paths.join(projectPath, 'commonEvents.json'));
		if (jsonEvents) {
			const objects = jsonEvents.commonObjects as JSONType[];
			let object = objects.find((obj) => obj.id === 1);
			jsonEvents.do = object ?? {
				events: [{ id: 1, name: 'Hero action', p: [], r: { '1': { bh: true, c: [] } }, sys: false }],
				hId: -1,
				id: 1,
				name: 'Empty',
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
			object = objects.find((obj) => obj.id === 2);
			jsonEvents.ho = object ?? jsonEvents.do;
			await Platform.writeJSON(Paths.join(projectPath, 'commonEvents.json'), jsonEvents);
		}

		// Move turn a picture
		await ProjectUpdater.updateAllCommands((json: JSONType) => {
			if (json.kind === 36) {
				const command = json.command as MapObjectCommandType[];
				const b = command[command.length - 1];
				ArrayUtils.removeAt(command, command.length - 1);
				ArrayUtils.insertAt(command, command.length - 2, b);
			}
		});

		// Move turn a picture
		await ProjectUpdater.updateAllObjectStates((json: JSONType) => {
			if ((json.gk as number) >= 4) {
				(json.gk as number)--;
			}
		});

		// Battle system texts to formulas
		const jsonBattle = await Platform.readJSON(Paths.join(projectPath, 'battleSystem.json'));
		if (jsonBattle) {
			if (jsonBattle.fisdead && (jsonBattle.fisdead as JSONType).k === 8) {
				(jsonBattle.fisdead as JSONType).k = 9;
			}
			if (jsonBattle.fc && (jsonBattle.fc as JSONType).k === 8) {
				(jsonBattle.fc as JSONType).k = 9;
			}
			if (jsonBattle.heroesBattlersCenterOffset && (jsonBattle.heroesBattlersCenterOffset as JSONType).k === 8) {
				(jsonBattle.heroesBattlersCenterOffset as JSONType).k = 9;
			}
			if (jsonBattle.heroesBattlersOffset && (jsonBattle.heroesBattlersOffset as JSONType).k === 8) {
				(jsonBattle.heroesBattlersOffset as JSONType).k = 9;
			}
			if (jsonBattle.troopsBattlersCenterOffset && (jsonBattle.troopsBattlersCenterOffset as JSONType).k === 8) {
				(jsonBattle.troopsBattlersCenterOffset as JSONType).k = 9;
			}
			if (jsonBattle.troopsBattlersOffset && (jsonBattle.troopsBattlersOffset as JSONType).k === 8) {
				(jsonBattle.troopsBattlersOffset as JSONType).k = 9;
			}
			await Platform.writeJSON(Paths.join(projectPath, 'battleSystem.json'), jsonBattle);
		}

		// Title screen commands ids unique
		const jsonTitle = await Platform.readJSON(Paths.join(projectPath, 'titlescreenGameover.json'));
		if (jsonTitle) {
			let id = 1;
			for (const command of jsonTitle.tc as JSONType[]) {
				command.id = id++;
			}
			id = 1;
			for (const command of jsonTitle.gameOverCommands as JSONType[]) {
				command.id = id++;
			}
			await Platform.writeJSON(Paths.join(projectPath, 'titlescreenGameover.json'), jsonTitle);
		}

		// Assets none and tileset is BR
		const jsonPictures = await Platform.readJSON(Paths.join(projectPath, 'pictures.json'));
		if (jsonPictures) {
			const list = jsonPictures.list as JSONType[];
			for (const obj of list) {
				for (const picture of obj.v as JSONType[]) {
					if (picture.id === -1 || picture.id === 0) {
						picture.br = true;
					}
				}
			}
			await Platform.writeJSON(Paths.join(projectPath, 'pictures.json'), jsonPictures);
		}
		const jsonSongs = await Platform.readJSON(Paths.join(projectPath, 'songs.json'));
		if (jsonSongs) {
			const list = jsonSongs.list as JSONType[];
			for (const obj of list) {
				const song = (obj.v as JSONType[]).find((song) => song.id === -1);
				if (song) {
					song.br = true;
				}
			}
			await Platform.writeJSON(Paths.join(projectPath, 'songs.json'), jsonSongs);
		}
		const jsonVideos = await Platform.readJSON(Paths.join(projectPath, 'videos.json'));
		if (jsonVideos) {
			const video = (jsonVideos.list as JSONType[]).find((video) => video.id === -1);
			if (video) {
				video.br = true;
			}
			await Platform.writeJSON(Paths.join(projectPath, 'videos.json'), jsonVideos);
		}
		const jsonShapes = await Platform.readJSON(Paths.join(projectPath, 'shapes.json'));
		if (jsonShapes) {
			const list = jsonShapes.list as JSONType[];
			for (const obj of list) {
				const shape = (obj.v as JSONType[]).find((shape) => shape.id === -1);
				if (shape) {
					shape.br = true;
				}
			}
			await Platform.writeJSON(Paths.join(projectPath, 'shapes.json'), jsonShapes);
		}
		const jsonFonts = await Platform.readJSON(Paths.join(projectPath, 'fonts.json'));
		if (jsonFonts) {
			const font = (jsonFonts.list as JSONType[]).find((font) => font.id === -1);
			if (font) {
				font.br = true;
			}
			await Platform.writeJSON(Paths.join(projectPath, 'fonts.json'), jsonFonts);
		}
	}
}

export { ProjectUpdater_3_0_0 };
