/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths } from '../../common';
import { Project } from '../../core/Project';

class ProjectUpdater_3_0_1 {
	static async update() {
		Project.current!.systems.PATH_BR = Paths.join(window.__dirname, 'BR');
		Project.current!.systems.PATH_DLCS = Paths.join(window.__dirname, 'DLCs');
		await Project.current!.systems.save();
	}
}

export { ProjectUpdater_3_0_1 };
