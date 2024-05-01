/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { Base } from './Base';
import { BINDING, BindingType, Constants, JSONType, Paths, Utils } from '../common';
import { Portion, Position, Project } from '../core';
import { Platform } from '../common/Platform';
import { MapObject } from './MapObject';

class Map extends Base {
	public tilesetID: number = 1;
	public length: number = 16;
	public width: number = 16;
	public height: number = 16;
	public depth: number = 0;
	public objects!: MapObject[];

	public static bindings: BindingType[] = [
		['tilesetID', 'tileset', undefined, BINDING.NUMBER],
		['length', 'l', undefined, BINDING.NUMBER],
		['width', 'w', undefined, BINDING.NUMBER],
		['height', 'h', undefined, BINDING.NUMBER],
		['depth', 'd', undefined, BINDING.NUMBER],
		['objects', 'objs', [], BINDING.LIST, MapObject],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static create(id: number, name: string) {
		const base = new Map();
		base.id = id;
		base.name = name;
		return base;
	}

	getPath(temp = false) {
		return Paths.join(
			Project.current!.getPathMaps(),
			this.getRealName(),
			temp ? Paths.TEMP : undefined,
			Paths.FILE_MAP_INFOS
		);
	}

	static async createDefaultMap(id: number, name: string) {
		const mapModel = new Model.Map();
		mapModel.id = id;
		mapModel.name = name;
		// TODO
		/*
        Position position(7, 0, 0, 7, 0);
        SystemMapObject super(1, RPM::translate(Translations::HERO), position);
        super.write(json);
        jsonObject.append(json);*/
		/*
        properties.setIsSkyColor(false);
        properties.setIsSkyImage(false);
        properties.skyboxID()->setNumberValue(1);*/
		const folderMap = await mapModel.createNewMap();

		if (!folderMap) {
			return;
		}

		// Portion
		const globalPortion = new Portion(0, 0, 0);
		/*
        SystemCommonObject* o = new SystemCommonObject(1, RPM::translate(
            Translations::HERO), false, false, 2, new QStandardItemModel, new
            QStandardItemModel, new QStandardItemModel);
        QJsonObject previous;
        MapEditorSubSelectionKind previousType;
        mapPortion.addObject(position, o, previous, previousType);*/
		await Platform.writeJSON(Paths.join(folderMap, 'objects.json'), {
			objs: [],
		});
		// TODO
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

		// Objects
		// TODO
		/*
        QJsonObject json;
        json["objs"] = jsonObject;
        Common::writeOtherJSON(Common::pathCombine(dirMap, RPM::FILE_MAP_OBJECTS),
                            json);
                            */

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

	generateNewObjectID() {
		let id = 1;
		while (this.objects.find((mapObject) => mapObject.id === id)) {
			id++;
		}
		return id;
	}

	getObjectAt(position: Position): Model.MapObject | null {
		return this.objects?.find((object) => object.position.equals(position)) ?? null;
	}

	async updateObject(position: Position, object: Model.CommonObject | null) {
		this.objects = this.objects.filter((mapObject) => !position.equals(mapObject.position));
		if (object !== null) {
			this.objects.push(Model.MapObject.create(object.id, object.name, position));
		}
		await this.save(true);
	}

	copy(map: Map): void {
		super.copy(map);
	}

	clone(): Map {
		const map = new Map();
		map.copy(this);
		return map;
	}

	async load() {
		await super.load(true); // Try to read temp files by default
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Map.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Map.getBindings(additionnalBinding));
		json.bgs = { id: -1, ie: false, is: false, name: '', v: { k: 3, v: 100 } };
		json.isi = false;
		json.isky = false;
		json.music = { id: -1, ie: false, is: false, name: '', v: { k: 3, v: 100 } };
		json.names = { '1': this.name };
		json.of3d = [];
		json.ofmoun = [];
		json.ofsprites = [];
		json.sbid = { k: 7, v: 1 };
		json.so = {
			events: [
				{
					id: 1,
					name: 'Time',
					p: [
						{ id: 1, name: '', v: { k: 2, v: null } },
						{ id: 2, name: '', v: { k: 10, v: false } },
					],
					r: { '1': { bh: true, c: [] } },
					sys: true,
				},
			],
			hId: -1,
			id: 1,
			name: '',
			ooepf: false,
			states: [
				{
					cam: false,
					climb: false,
					dir: false,
					gid: -1,
					gk: 0,
					id: 1,
					move: false,
					name: 'State 1',
					pix: false,
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
	}
}

export { Map };
