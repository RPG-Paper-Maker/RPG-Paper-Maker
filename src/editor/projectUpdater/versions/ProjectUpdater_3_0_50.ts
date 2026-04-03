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

		// Fix status.json: add isReleaseIfDead to the default status
		const statusPath = Paths.join(projectPath, 'status.json');
		const jsonStatus = await readJSON(statusPath);
		if (jsonStatus) {
			for (const status of jsonStatus.status as { id: number; isReleaseIfDead?: boolean }[]) {
				if (status.id === 1 && !('isReleaseIfDead' in status)) {
					status.isReleaseIfDead = false;
				}
			}
			await writeJSON(statusPath, jsonStatus);
		}

		// Fix commonEvents.json: commonReactors parameters with k=3 (number) should be k=12 (decimal)
		const eventsPath = Paths.join(projectPath, 'commonEvents.json');
		const jsonEvents = await readJSON(eventsPath);
		if (jsonEvents) {
			for (const reactor of (jsonEvents.commonReactors ?? []) as { p?: { d?: { k: number } }[] }[]) {
				for (const param of reactor.p ?? []) {
					if (param.d && param.d.k === 3) {
						param.d.k = 12;
					}
				}
			}
			await writeJSON(eventsPath, jsonEvents);
		}
	}
}

export { ProjectUpdater_3_0_50 };
