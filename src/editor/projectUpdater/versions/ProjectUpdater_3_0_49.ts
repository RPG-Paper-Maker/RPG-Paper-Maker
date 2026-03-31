/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths } from '../../common';
import { checkFileExists, getFolders, removeFolder } from '../../common/Platform';
import { Project } from '../../core/Project';
import { ProjectUpdater_3_0_45 } from './ProjectUpdater_3_0_45';

class ProjectUpdater_3_0_49 {
	static async update() {
		await ProjectUpdater_3_0_45.update();
		const projectPath = Project.current!.getPath();
		const mapFolders = await getFolders(Paths.join(projectPath, 'Maps'));
		for (const folder of mapFolders) {
			const undoRedoPath = Paths.join(projectPath, 'Maps', folder, 'temp-undo-redo');
			if (await checkFileExists(undoRedoPath)) {
				await removeFolder(undoRedoPath);
			}
		}
	}
}

export { ProjectUpdater_3_0_49 };
