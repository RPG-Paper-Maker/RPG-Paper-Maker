/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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

    static async createDefault() {
        let jsonObject = {};
        let mapModel = new Model.Map();
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

        // Portion
        let globalPortion = new Portion(0, 0, 0);
        let mapPortion = new MapPortion(globalPortion);
        mapPortion.fillDefaultFloor(mapModel);
        /*
        SystemCommonObject* o = new SystemCommonObject(1, RPM::translate(
            Translations::HERO), false, false, 2, new QStandardItemModel, new
            QStandardItemModel, new QStandardItemModel);
        QJsonObject previous;
        MapEditorSubSelectionKind previousType;
        mapPortion.addObject(position, o, previous, previousType);*/
        await mapPortion.save(folderMap + globalPortion.getFileName());
    }

    static generateMapName(id: number): string {
        return "MAP" + Utils.formatNumber(id, 4);
    }

    getRealName(): string {
        return Map.generateMapName(this.id);
    }

    getPortionsNumbers(): [number, number, number, number] {
        return [
            Math.floor((this.length - 1) / Constants.PORTION_SIZE) + 1,
            Math.floor((this.depth - 1) / Constants.PORTION_SIZE) + (this.depth > 0 ? 1 : 0) + 1,
            Math.floor((this.height - 1) / Constants.PORTION_SIZE) + 1,
            Math.floor((this.width - 1) / Constants.PORTION_SIZE) + 1
        ];
    }

    async createNewMap(jsonObject?: any): Promise<string | null> {
        if (!Project.current) {
            return null;
        }
        this.id = 1;
        const mapName = this.getRealName();
        const folderMap = Project.current.getPathMaps() + '/' + mapName;
        await LocalFile.createFolder(folderMap);

        // Write properties
        this.save(folderMap + Paths.FILE_MAP_INFOS);

        // Portions
        const [lx, ld, lh, lz] = this.getPortionsNumbers();
        for (let i = 0; i < lx; i++) {
            for (let j = -ld; j < lh; j++) {
                for (let k = 0; k < lz; k++) {
                    let json = {};
                    await LocalFile.writeJSON(folderMap + "/" + Portion.getFileName(i, j, k), json);
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
        await LocalFile.createFolder(folderMap + "/" + Paths.TEMP);
        await LocalFile.createFolder(folderMap + "/" + Paths.TEMP_UNDO_REDO);

        return folderMap;
    }

    read(json: Record<string, any>) {
        super.read(json);
    }

    write(json: Record<string, any>) {
        super.write(json);
    }
}

export { Map }