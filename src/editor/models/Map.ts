/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants } from '../common/Constants';
import { Paths } from '../common/Paths';
import { Utils } from '../common/Utils';
import { LocalFile } from '../core/LocalFile';
import { MapPortion } from '../core/MapPortion';
import { Portion } from '../core/Portion';
import { Project } from '../core/Project';
import { Model } from '../Editor';
import { Base } from './Base';

class Map extends Base {
	public tilesetID: number = 1;
	public length: number = 16;
	public width: number = 16;
	public height: number = 16;
	public depth: number = 0;

	constructor() {
		super();
		this.name = this.getRealName();
	}

	getPath() {
		return Paths.join(Project.current!.getPathMaps(), Model.Map.generateMapName(this.id), Paths.FILE_MAP_INFOS);
	}

	static async createDefault(id: number) {
		const jsonObject = {};
		const mapModel = new Model.Map();
		mapModel.id = id;
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
		const folderMap = await mapModel.createNewMap(jsonObject);

		if (!folderMap) {
			return;
		}

		// Portion
		const globalPortion = new Portion(0, 0, 0);
		const mapPortion = new MapPortion(globalPortion);
		mapPortion.fillDefaultFloor(mapModel);
		/*
        SystemCommonObject* o = new SystemCommonObject(1, RPM::translate(
            Translations::HERO), false, false, 2, new QStandardItemModel, new
            QStandardItemModel, new QStandardItemModel);
        QJsonObject previous;
        MapEditorSubSelectionKind previousType;
        mapPortion.addObject(position, o, previous, previousType);*/
		await LocalFile.writeJSON(Paths.join(folderMap, 'objects.json'), {
			objs: [{ id: 1, name: 'Hero', p: [7, 0, 0, 7] }],
		});
		// TODO
		await LocalFile.copyPublicFile(
			Paths.join(Paths.ROOT_DIRECTORY_LOCAL, Paths.DEFAULT, globalPortion.getFileName()),
			Paths.join(Paths.join(folderMap, globalPortion.getFileName()))
		);

		// await mapPortion.save(Paths.join(folderMap, globalPortion.getFileName()));
	}

	static generateMapName(id: number): string {
		return 'MAP' + Utils.formatNumber(id, 4);
	}

	getRealName(): string {
		return Map.generateMapName(this.id);
	}

	getPortionsNumbers(): [number, number, number, number] {
		return [
			Math.floor((this.length - 1) / Constants.PORTION_SIZE) + 1,
			Math.floor((this.depth - 1) / Constants.PORTION_SIZE) + (this.depth > 0 ? 1 : 0) + 1,
			Math.floor((this.height - 1) / Constants.PORTION_SIZE) + 1,
			Math.floor((this.width - 1) / Constants.PORTION_SIZE) + 1,
		];
	}

	async createNewMap(jsonObject?: any): Promise<string | null> {
		if (!Project.current) {
			return null;
		}
		const mapName = this.getRealName();
		const folderMap = Paths.join(Project.current.getPathMaps(), mapName);
		await LocalFile.createFolder(folderMap);

		// Write properties
		// TODO
		await LocalFile.writeJSON(Paths.join(folderMap, Paths.FILE_MAP_INFOS), {
			bgs: { id: -1, ie: false, is: false, name: '', v: { k: 3, v: 100 } },
			d: 0,
			h: 16,
			id: 1,
			isi: false,
			isky: false,
			l: 16,
			music: { id: -1, ie: false, is: false, name: '', v: { k: 3, v: 100 } },
			names: { '1': 'MAP0001' },
			of3d: [],
			ofmoun: [],
			ofsprites: [],
			sbid: { k: 7, v: 1 },
			so: {
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
			},
			tileset: 1,
			w: 16,
		});
		// await this.save(Paths.join(folderMap, Paths.FILE_MAP_INFOS));

		// Portions
		const [lx, ld, lh, lz] = this.getPortionsNumbers();
		for (let i = 0; i < lx; i++) {
			for (let j = -ld; j < lh; j++) {
				for (let k = 0; k < lz; k++) {
					const json = {};
					// await LocalFile.writeJSON(Paths.join(folderMap, Portion.getFileName(i, j, k)), json);
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
		await LocalFile.createFolder(Paths.join(folderMap, Paths.TEMP));
		await LocalFile.createFolder(Paths.join(folderMap, Paths.TEMP_UNDO_REDO));
		await LocalFile.createFile(Paths.join(folderMap, Paths.TEMP_UNDO_REDO, Paths.INDEX), '-1');

		return folderMap;
	}

	read(json: Record<string, any>) {
		super.read(json);
	}

	write(json: Record<string, any>) {
		super.write(json);
	}
}

export { Map };
