/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ArrayUtils, JSONType, Paths } from '../../common';
import { readJSON, writeJSON } from '../../common/Platform';
import { Project } from '../../core/Project';

class ProjectUpdater_3_0_19 {
	static async update() {
		const projectPath = Project.current!.getPath();
		const jsonPictures = await readJSON(Paths.join(projectPath, 'pictures.json'));
		if (jsonPictures) {
			const list = jsonPictures.list as JSONType[];
			const characters = list?.find((v) => v.k === 4);
			if (characters) {
				const values = characters.v as JSONType[];
				if (values[1]?.id !== 0) {
					ArrayUtils.insertAt(values, 1, { br: true, id: 0, name: 'Tileset' });
					await writeJSON(Paths.join(projectPath, 'pictures.json'), jsonPictures);
				}
			}
		}
		const jsonSpecialElements = await readJSON(Paths.join(projectPath, 'specialElements.json'));
		if (jsonSpecialElements) {
			const autotile = (jsonSpecialElements.autotiles as JSONType[]).find((a) => a.id === 0);
			if (autotile) {
				autotile.id = 1;
			}
			const wall = (jsonSpecialElements.walls as JSONType[]).find((a) => a.id === 0);
			if (wall) {
				wall.id = 1;
			}
			const mountain = (jsonSpecialElements.m as JSONType[]).find((a) => a.id === 0);
			if (mountain) {
				mountain.id = 1;
			}
			const object = (jsonSpecialElements.o as JSONType[]).find((a) => a.id === 0);
			if (object) {
				object.id = 1;
			}
			await writeJSON(Paths.join(projectPath, 'specialElements.json'), jsonSpecialElements);
		}
	}
}

export { ProjectUpdater_3_0_19 };
