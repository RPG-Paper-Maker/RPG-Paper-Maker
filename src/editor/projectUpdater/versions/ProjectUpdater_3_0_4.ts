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

class ProjectUpdater_3_0_4 {
	static async update() {
		const projectPath = Project.current!.getPath();
		const jsonStatus = await readJSON(Paths.join(projectPath, 'status.json'));
		if (jsonStatus) {
			for (const status of jsonStatus.status as JSONType[]) {
				for (const effect of (status.effects as JSONType[]) ?? []) {
					if (
						(effect.k ?? 0) === 0 &&
						effect.df &&
						((effect.df as JSONType).k === 8 || (effect.df as JSONType).k === 9)
					) {
						(effect.df as JSONType).v = ((effect.df as JSONType).v as string).replaceAll(
							'u.maxhp',
							't.maxhp',
						);
					}
				}
			}
			await writeJSON(Paths.join(projectPath, 'status.json'), jsonStatus);
		}
	}
}

export { ProjectUpdater_3_0_4 };
