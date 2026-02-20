/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths } from '../../common';
import { createFolder } from '../../common/Platform';
import { Project } from '../../core/Project';

class ProjectUpdater_3_0_27 {
	static async update() {
		const projectPath = Project.current!.getPath();
		await createFolder(Paths.join(projectPath, 'GLTF'));
	}
}

export { ProjectUpdater_3_0_27 };
