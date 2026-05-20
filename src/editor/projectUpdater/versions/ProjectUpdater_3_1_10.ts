/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSONType, Paths } from '../../common';
import { checkFileExists, getFiles, readJSON, writeJSON } from '../../common/Platform';
import { Project } from '../../core/Project';

const DEFAULT_SQUARE_SIZE = 16;
const MAPS_FOLDER = 'Maps';
const SAVES_FOLDER = 'Saves';
const FILE_MAP_INFOS = 'infos.json';
const FILE_SYSTEM = 'system.json';
const formatNumberID = (num: number) => String(num).padStart(4, '0');

class ProjectUpdater_3_1_10 {
	static async update() {
		const projectPath = Project.current!.getPath();
		const systemJson = await readJSON(Paths.join(projectPath, FILE_SYSTEM));
		const squareSize = (systemJson?.ss as number) ?? DEFAULT_SQUARE_SIZE;

		const savesPath = Paths.join(projectPath, SAVES_FOLDER);
		if (!(await checkFileExists(savesPath))) {
			return;
		}
		const saveFiles = await getFiles(savesPath);
		for (const file of saveFiles) {
			if (!file.endsWith('.json')) {
				continue;
			}
			const savePath = Paths.join(savesPath, file);
			const saveJson = await readJSON(savePath);
			if (!saveJson) {
				continue;
			}
			const mapID = saveJson.currentMapId as number;
			const mapName = 'MAP' + formatNumberID(mapID);
			const mapInfoJson = await readJSON(Paths.join(projectPath, MAPS_FOLDER, mapName, FILE_MAP_INFOS));
			if (!mapInfoJson) {
				continue;
			}
			const mapLength = mapInfoJson.l as number;
			const mapWidth = mapInfoJson.w as number;
			const pos = saveJson.heroPosition as number[];
			if (!Array.isArray(pos) || (pos[0] < mapLength && pos[2] < mapWidth)) {
				continue;
			}
			saveJson.heroPosition = [pos[0] / squareSize, pos[1] / squareSize, pos[2] / squareSize];
			const cs = saveJson.cameraState as JSONType;
			if (cs) {
				if (typeof cs.d === 'number') {
					cs.d = cs.d / squareSize;
				}
				const to = cs.to as number[];
				if (Array.isArray(to)) {
					cs.to = [to[0] / squareSize, to[1] / squareSize, to[2] / squareSize];
				}
			}
			await writeJSON(savePath, saveJson);
		}
	}
}

export { ProjectUpdater_3_1_10 };
