/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSONType, Paths } from '../../common';
import { readJSON, writeJSON } from '../../common/Platform';
import { Project } from '../../core/Project';

class ProjectUpdater_3_0_26 {
	static async update() {
		const projectPath = Project.current!.getPath();
		const jsonPictures = await readJSON(Paths.join(projectPath, 'pictures.json'));
		if (jsonPictures) {
			const list = jsonPictures.list as JSONType[];
			const characters = list?.find((v) => v.k === 4);
			if (characters) {
				const values = characters.v as JSONType[];
				let hasZeroOrUndefined = false;
				characters.v = values.filter((value) => {
					const isZeroOrUndefined = value.id === 0 || value.id === undefined;
					if (!isZeroOrUndefined) return true;
					if (!hasZeroOrUndefined) {
						hasZeroOrUndefined = true;
						return true;
					}
					return false;
				});
				await writeJSON(Paths.join(projectPath, 'pictures.json'), jsonPictures);
			}
		}
	}
}

export { ProjectUpdater_3_0_26 };
