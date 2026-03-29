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

class ProjectUpdater_3_0_48 {
	static async update() {
		const projectPath = Project.current!.getPath();
		const path = Paths.join(projectPath, 'titlescreenGameover.json');
		const json = await readJSON(path);
		if (!json) return;
		if (!('itbv' in json) && json.itbi === false) {
			json.itbv = true;
		}
		if (!('isGameOverBackgroundVideo' in json) && json.isGameOverBackgroundImage === false) {
			json.isGameOverBackgroundVideo = true;
		}
		await writeJSON(path, json);
	}
}

export { ProjectUpdater_3_0_48 };
