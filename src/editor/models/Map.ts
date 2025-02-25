/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, Constants, DYNAMIC_VALUE_KIND, JSONType, Paths, SONG_KIND, Utils } from '../common';
import { Platform } from '../common/Platform';
import { Portion, Position, Project } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import { Model } from '../Editor';
import { CommonObject } from './CommonObject';
import { Localization } from './Localization';
import { MapObject } from './MapObject';
import { PlaySong } from './PlaySong';
import { RandomBattle } from './RandomBattle';

export enum SELECTION_SKY_TYPE {
	COLOR,
	IMAGE,
	SKYBOX,
}
class Map extends Localization {
	public tilesetID = 1;
	public length = 16;
	public width = 16;
	public height = 16;
	public depth = 0;
	public music = PlaySong.createPlaySong(SONG_KIND.MUSIC);
	public backgroundSound = PlaySong.createPlaySong(SONG_KIND.MUSIC);
	public cameraPropertiesID = DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1);
	public isSunlight = true;
	public isSkyColor = false;
	public skyColorID = DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1);
	public isSkyImage = false;
	public skyImageID = -1;
	public skyboxID = DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1);
	public startupObject = new CommonObject();
	public randomBattleMapID!: DynamicValue;
	public randomBattles!: RandomBattle[];
	public randomBattleNumberStep!: DynamicValue;
	public randomBattleVariance!: DynamicValue;
	public objects: MapObject[] = [];

	public static bindings: BindingType[] = [
		['tilesetID', 'tileset', undefined, BINDING.NUMBER],
		['length', 'l', undefined, BINDING.NUMBER],
		['width', 'w', undefined, BINDING.NUMBER],
		['height', 'h', undefined, BINDING.NUMBER],
		['depth', 'd', undefined, BINDING.NUMBER],
		['music', 'music', undefined, BINDING.OBJECT, PlaySong],
		['backgroundSound', 'bgs', undefined, BINDING.OBJECT, PlaySong],
		[
			'cameraPropertiesID',
			'cp',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isSunlight', 'isl', true, BINDING.BOOLEAN],
		['isSkyColor', 'isky', undefined, BINDING.BOOLEAN],
		['isSkyImage', 'isi', undefined, BINDING.BOOLEAN],
		['startupObject', 'so', undefined, BINDING.OBJECT, CommonObject],
		['startupObject', 'so', undefined, BINDING.OBJECT, CommonObject],
		[
			'randomBattleMapID',
			'randomBattleMapID',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['randomBattles', 'randomBattles', [], BINDING.LIST, RandomBattle],
		[
			'randomBattleNumberStep',
			'randomBattleNumberStep',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 300),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'randomBattleVariance',
			'randomBattleVariance',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 20),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['objects', 'objs', [], BINDING.LIST, MapObject],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static create(id: number, name: string) {
		const base = new Map();
		base.id = id;
		base.updateMainName(name);
		return base;
	}

	applyDefault() {
		super.applyDefault(Map.getBindings([]));
	}

	getPath(temp = false) {
		return Paths.join(
			Project.current!.getPathMaps(),
			this.getRealName(),
			temp ? Paths.TEMP : undefined,
			Paths.FILE_MAP_INFOS
		);
	}

	getTileset(): Model.Tileset {
		return Project.current!.tilesets.getTilesetByID(this.tilesetID);
	}

	getSkySelection(): SELECTION_SKY_TYPE {
		if (this.isSkyColor) {
			return SELECTION_SKY_TYPE.COLOR;
		} else if (this.isSkyImage) {
			return SELECTION_SKY_TYPE.IMAGE;
		} else {
			return SELECTION_SKY_TYPE.SKYBOX;
		}
	}

	static createDefaultNewMap(id: number, name: string) {
		const map = new Model.Map();
		map.applyDefault();
		map.id = id;
		map.updateMainName(name);
		map.startupObject = Model.CommonObject.createStartupObject();
		return map;
	}

	static async createDefaultMap(id: number, name: string) {
		const mapModel = Map.createDefaultNewMap(id, name);
		const folderMap = await mapModel.createNewMap();
		if (!folderMap) {
			return;
		}
		const globalPortion = new Portion(0, 0, 0);
		await Platform.copyPublicFile(
			Paths.join(Paths.DEFAULT, globalPortion.getFileName()),
			Paths.join(Paths.join(folderMap, globalPortion.getFileName()))
		);
	}

	static generateMapName(id: number): string {
		return 'MAP' + Utils.formatNumberID(id);
	}

	getRealName(): string {
		return Map.generateMapName(this.id);
	}

	getPortionsMax(): [number, number, number, number] {
		return [
			Math.floor((this.length - 1) / Constants.PORTION_SIZE),
			Math.floor((this.depth - 1) / Constants.PORTION_SIZE) + (this.depth > 0 ? 0 : 1),
			Math.floor((this.height - 1) / Constants.PORTION_SIZE),
			Math.floor((this.width - 1) / Constants.PORTION_SIZE),
		];
	}

	async createNewMap(): Promise<string | null> {
		if (!Project.current) {
			return null;
		}
		const mapName = this.getRealName();
		const folderMap = Paths.join(Project.current.getPathMaps(), mapName);
		await Platform.createFolder(folderMap);

		// Write properties
		await this.save();

		// Portions
		const [lx, ld, lh, lz] = this.getPortionsMax();
		for (let i = 0; i <= lx; i++) {
			for (let j = -ld; j <= lh; j++) {
				for (let k = 0; k <= lz; k++) {
					await Platform.writeJSON(Paths.join(folderMap, Portion.getFileName(i, j, k)), {});
				}
			}
		}

		// Temp empty folders
		await Platform.createFolder(Paths.join(folderMap, Paths.TEMP));
		await Platform.createFolder(Paths.join(folderMap, Paths.TEMP_UNDO_REDO));
		await Platform.createFile(Paths.join(folderMap, Paths.TEMP_UNDO_REDO, Paths.INDEX), '-1');
		return folderMap;
	}

	async deleteMap() {
		await Platform.removeFolder(Paths.join(Project.current!.getPathMaps(), this.getRealName()));
	}

	getMapPortionPath(globalPortion: Portion) {
		return Paths.join(
			Project.current!.getPathMaps(),
			Model.Map.generateMapName(this.id),
			globalPortion.getFileName()
		);
	}

	async writeEmptyMapPortion(globalPortion: Portion) {
		const json = {};
		await Platform.writeJSON(this.getMapPortionPath(globalPortion), json);
	}

	async deleteCompleteMapPortion(globalPortion: Portion) {
		await Platform.removeFile(this.getMapPortionPath(globalPortion));
	}

	async deleteMapElements(globalPortion: Portion) {
		const mapPortion = new Model.MapPortion(globalPortion);
		await mapPortion.load();
		mapPortion.removeAllElementsOut(this);
		await mapPortion.save();
	}

	async resizeMap(previousMap: Map) {
		const [portionMaxX, portionMaxD, portionMaxH, portionMaxZ] = previousMap.getPortionsMax();
		const [newPortionMaxX, newPortionMaxD, newPortionMaxH, newPortionMaxZ] = this.getPortionsMax();

		// Write empty portions
		for (let i = portionMaxX + 1; i <= newPortionMaxX; i++) {
			for (let j = -newPortionMaxD; j <= newPortionMaxH; j++) {
				for (let k = 0; k <= newPortionMaxZ; k++) {
					await this.writeEmptyMapPortion(new Portion(i, j, k));
				}
			}
		}
		for (let j = portionMaxD + 1; j <= newPortionMaxD; j++) {
			for (let i = 0; i <= newPortionMaxX; i++) {
				for (let k = 0; k <= newPortionMaxZ; k++) {
					await this.writeEmptyMapPortion(new Portion(i, -j, k));
				}
			}
		}
		for (let j = portionMaxH + 1; j <= newPortionMaxH; j++) {
			for (let i = 0; i <= newPortionMaxX; i++) {
				for (let k = 0; k <= newPortionMaxZ; k++) {
					await this.writeEmptyMapPortion(new Portion(i, j, k));
				}
			}
		}
		for (let k = portionMaxZ + 1; k <= newPortionMaxZ; k++) {
			for (let i = 0; i <= newPortionMaxX; i++) {
				for (let j = -newPortionMaxD; j <= newPortionMaxH; j++) {
					await this.writeEmptyMapPortion(new Portion(i, j, k));
				}
			}
		}

		const difLength = previousMap.length - this.length;
		const difWidth = previousMap.width - this.width;
		const difHeight = previousMap.height - this.height;
		const difDepth = previousMap.depth - this.depth;
		if (difLength > 0 || difWidth > 0 || difHeight > 0 || difDepth > 0) {
			for (let i = newPortionMaxX + 1; i <= portionMaxX; i++) {
				for (let j = -portionMaxD; j <= portionMaxH; j++) {
					for (let k = 0; k <= portionMaxZ; k++) {
						await this.deleteCompleteMapPortion(new Portion(i, j, k));
					}
				}
			}
			for (let j = newPortionMaxD + 1; j <= portionMaxD; j++) {
				for (let i = 0; i <= portionMaxX; i++) {
					for (let k = 0; k <= portionMaxZ; k++) {
						await this.deleteCompleteMapPortion(new Portion(i, -j, k));
					}
				}
			}
			for (let j = newPortionMaxH + 1; j <= portionMaxH; j++) {
				for (let i = 0; i <= portionMaxX; i++) {
					for (let k = 0; k <= portionMaxZ; k++) {
						await this.deleteCompleteMapPortion(new Portion(i, j, k));
					}
				}
			}
			for (let k = newPortionMaxZ + 1; k <= portionMaxZ; k++) {
				for (let i = 0; i <= portionMaxX; i++) {
					for (let j = -portionMaxD; j <= portionMaxH; j++) {
						await this.deleteCompleteMapPortion(new Portion(i, j, k));
					}
				}
			}

			// Remove only cut items
			for (let i = 0; i <= newPortionMaxX; i++) {
				for (let j = -newPortionMaxD; j <= newPortionMaxH; j++) {
					await this.deleteMapElements(new Portion(i, j, newPortionMaxZ));
				}
			}
			for (let i = 0; i <= newPortionMaxX; i++) {
				for (let k = 0; k <= newPortionMaxZ; k++) {
					await this.deleteMapElements(new Portion(i, -newPortionMaxD, k));
					await this.deleteMapElements(new Portion(i, newPortionMaxH, k));
				}
			}
			for (let k = 0; k <= newPortionMaxZ; k++) {
				for (let j = -newPortionMaxD; j <= newPortionMaxH; j++) {
					await this.deleteMapElements(new Portion(newPortionMaxX, j, k));
				}
			}
		}
	}

	adjustPosition(position: Position) {
		if (position.x >= this.length) {
			position.x = this.length - 1;
		}
		if (position.z >= this.width) {
			position.z = this.width - 1;
		}
		if (position.y >= this.height) {
			position.y = this.height - 1;
		}
		if (position.y < -this.depth) {
			position.y = -this.depth;
		}
	}

	getObjectAt(position: Position): Model.MapObject | null {
		return this.objects?.find((object) => object.position.equals(position)) ?? null;
	}

	async updateObject(position: Position, object: Model.CommonObject | null) {
		this.objects = this.objects.filter((mapObject) => !position.equals(mapObject.position));
		if (object !== null) {
			this.objects.push(Model.MapObject.create(object.id, object.name, position));
		}
		this.objects.sort((a: Model.MapObject, b: Model.MapObject) => a.id - b.id);
		await this.save(true);
	}

	moveObject(previousPosition: Position, newPosition: Position) {
		const object = this.objects.find((mapObject) => mapObject.position.equals(previousPosition));
		if (object) {
			object.position = newPosition;
		}
	}

	copy(map: Map): void {
		super.copy(map, Map.getBindings([]));
	}

	async load() {
		await super.load(true); // Try to read temp files by default
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Map.getBindings(additionnalBinding));
		this.music.kind = SONG_KIND.MUSIC;
		this.backgroundSound.kind = SONG_KIND.BACKGROUND_SOUND;
		if (this.isSkyColor) {
			this.skyColorID.read(json.sky as JSONType);
		} else if (this.isSkyImage) {
			this.skyImageID = json.ipid as number;
		} else {
			this.skyboxID.read(json.sbid as JSONType);
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Map.getBindings(additionnalBinding));
		if (this.isSkyColor) {
			const obj: JSONType = {};
			this.skyColorID.write(obj);
			json.sky = obj;
		} else if (this.isSkyImage) {
			json.ipid = this.skyImageID;
		} else {
			const obj: JSONType = {};
			this.skyboxID.write(obj);
			json.sbid = obj;
		}
		json.of3d = [];
		json.ofmoun = [];
		json.ofsprites = [];
	}
}

export { Map };
