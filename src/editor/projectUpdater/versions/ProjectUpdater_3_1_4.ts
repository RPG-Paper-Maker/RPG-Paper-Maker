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
		const treeMapsPath = Paths.join(projectPath, Paths.FILE_TREE_MAPS);
		const json = await readJSON(treeMapsPath);
		if (json && Array.isArray(json.tree)) {
			migrateNodes(json.tree as JSONType[]);
			await writeJSON(treeMapsPath, json);
		}
	}
}

export { ProjectUpdater_3_1_4 };
