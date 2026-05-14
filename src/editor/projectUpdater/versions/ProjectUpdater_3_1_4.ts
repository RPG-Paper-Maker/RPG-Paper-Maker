/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSONType, Paths } from '../../common';
import { readJSON, writeJSON } from '../../common/Platform';
import { Project } from '../../core/Project';

const NUMBER = 3;
const NUMBER_DECIMAL = 12;

const normalizeDynamicValue = (dv: JSONType, defaultKind: number, defaultValue: number) => {
	if (!dv || (dv.k as number) === defaultKind) {
		return;
	}
	dv.k = defaultKind;
	dv.v = defaultValue;
	dv.ia = false;
};

const normalizePlaySong = (song: JSONType) => {
	if (!song) return;
	normalizeDynamicValue(song.vid as JSONType, NUMBER, -1);
	normalizeDynamicValue(song.v as JSONType, NUMBER, 100);
	normalizeDynamicValue(song.s as JSONType, NUMBER_DECIMAL, 0);
	normalizeDynamicValue(song.e as JSONType, NUMBER_DECIMAL, 0);
};

const migrateNodes = (nodes: JSONType[]) => {
	for (const node of nodes) {
		if (typeof node.cd === 'number') {
			node.cd = node.cd / Project.SQUARE_SIZE;
		}
		if (Array.isArray(node.children)) {
			migrateNodes(node.children as JSONType[]);
		}
	}
};

class ProjectUpdater_3_1_4 {
	static async update() {
		const projectPath = Project.current!.getPath();
		const treeMapsPath = Paths.join(projectPath, 'treeMaps.json');
		const json = await readJSON(treeMapsPath);
		if (json && Array.isArray(json.tree)) {
			migrateNodes(json.tree as JSONType[]);
			await writeJSON(treeMapsPath, json);
		}
		const titlePath = Paths.join(projectPath, 'titlescreenGameover.json');
		const titleJson = await readJSON(titlePath);
		if (titleJson) {
			normalizePlaySong(titleJson.tm as JSONType);
			await writeJSON(titlePath, titleJson);
		}
	}
}

export { ProjectUpdater_3_1_4 };
