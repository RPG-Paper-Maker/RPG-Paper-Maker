/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSONType, Paths } from '../../common';
import { createFolder } from '../../common/Platform';
import { Project } from '../../core/Project';
import { ProjectUpdater } from '../ProjectUpdater';

class ProjectUpdater_3_0_27 {
	static async update() {
		const projectPath = Project.current!.getPath();
		await createFolder(Paths.join(projectPath, 'Shapes', 'GLTF'));
		await ProjectUpdater.updateAllMapPortions((json: JSONType) => {
			for (const entry of (json.moun ?? []) as JSONType[]) {
				const mountain = entry.v as JSONType;
				const ws = (mountain.ws as number) ?? 0;
				const wp = (mountain.wp as number) ?? 0;
				mountain.wsb = ws;
				mountain.wst = ws;
				mountain.wsl = ws;
				mountain.wsr = ws;
				mountain.wpb = wp;
				mountain.wpt = wp;
				mountain.wpl = wp;
				mountain.wpr = wp;
				delete mountain.ws;
				delete mountain.wp;
			}
		});
	}
}

export { ProjectUpdater_3_0_27 };
