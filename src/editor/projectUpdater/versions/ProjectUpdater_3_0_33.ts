/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants, Paths } from '../../common';
import { readJSON, writeJSON } from '../../common/Platform';
import { Project } from '../../core/Project';

class ProjectUpdater_3_0_33 {
	static async update() {
		if (Constants.IS_DESKTOP) {
			const projectPath = Project.current!.getPath();
			const jsonSystem = await readJSON(Paths.join(projectPath, 'system.json'));
			if (jsonSystem) {
				jsonSystem.pathDLCS = Paths.join(window.env.appPath, 'DLCs');
				await writeJSON(Paths.join(projectPath, 'system.json'), jsonSystem);
			}
		}
	}
}

export { ProjectUpdater_3_0_33 };
