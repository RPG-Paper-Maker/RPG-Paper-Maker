/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths } from '../../common';
import { readJSON, writeJSON } from '../../common/Platform';
import { Project } from '../../core/Project';

class ProjectUpdater_3_0_50 {
	static async update() {
		const projectPath = Project.current!.getPath();
		const path = Paths.join(projectPath, 'status.json');
		const json = await readJSON(path);
		if (!json) return;
		for (const status of json.status as { id: number; isReleaseIfDead?: boolean }[]) {
			if (status.id === 1 && !('isReleaseIfDead' in status)) {
				status.isReleaseIfDead = false;
			}
		}
		await writeJSON(path, json);
	}
}

export { ProjectUpdater_3_0_50 };
