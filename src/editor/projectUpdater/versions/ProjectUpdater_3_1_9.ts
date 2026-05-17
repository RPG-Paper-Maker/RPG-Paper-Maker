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

const GLTF_KIND = 4;
const NONE_NAME = '<None>';

class ProjectUpdater_3_1_9 {
	static async update() {
		const projectPath = Project.current!.getPath();
		const shapesPath = Paths.join(projectPath, Paths.FILE_SHAPES);
		const json = await readJSON(shapesPath);
		if (!json) return;
		const list = (json.list as JSONType[]) ?? [];
		// Rename id=-1 to "<None>" in all existing lists
		for (const entry of list) {
			for (const shape of (entry.v as JSONType[]) ?? []) {
				if ((shape.id as number) === -1) {
					shape.name = NONE_NAME;
				}
			}
		}
		// Add GLTF list if missing
		const hasGltf = list.some((entry) => (entry.k as number) === GLTF_KIND);
		if (!hasGltf) {
			list.push({ k: GLTF_KIND, v: [{ id: -1, name: NONE_NAME, br: true }] });
		}
		json.list = list;
		await writeJSON(shapesPath, json);
	}
}

export { ProjectUpdater_3_1_9 };
