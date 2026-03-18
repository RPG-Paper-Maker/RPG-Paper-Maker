/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths } from '../../common';
import { checkFileExists, createFolder } from '../../common/Platform';
import { Project } from '../../core/Project';

class ProjectUpdater_3_0_36 {
	static async update() {
		const projectPath = Project.current!.getPath();
		const testPath = Paths.join(projectPath, 'Test');
		if (!(await checkFileExists(testPath))) {
			await createFolder(testPath);
		}
	}
}

export { ProjectUpdater_3_0_36 };
