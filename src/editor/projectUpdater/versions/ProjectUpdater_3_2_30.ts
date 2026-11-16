/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { EVENT_COMMAND_KIND, JSONType, Paths } from '../../common';
import { getFolders, readJSON, writeJSON } from '../../common/Platform';
import { Project } from '../../core/Project';
import { ProjectUpdater } from '../ProjectUpdater';

class ProjectUpdater_3_2_30 {
	static hasLights = false;

	static async detectLights() {
		await ProjectUpdater.updateAllObjectStates((state) => {
			if (((state.l as JSONType[] | undefined) ?? []).length > 0) {
				this.hasLights = true;
			}
		});
		await ProjectUpdater.updateAllCommands((command) => {
			if (command.kind === EVENT_COMMAND_KIND.MODIFY_LIGHT) {
				this.hasLights = true;
			}
		});
	}

	static setCommandLegacy(command: JSONType) {
		if (command.kind !== EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE) {
			return;
		}
		const list = command.command as unknown[];
		let i = 8;
		if (Number(list[i++]) === 1) {
			i += 3;
		}
		i += 3;
		list.length = i;
		list.push(1);
	}

	static async update() {
		this.hasLights = false;
		await this.detectLights();
		if (!this.hasLights) {
			return;
		}
		await ProjectUpdater.updateAllCommands((command) => this.setCommandLegacy(command));
		const projectPath = Project.current!.getPath();
		for (const name of await getFolders(Paths.join(projectPath, Paths.MAPS))) {
			const path = Paths.join(projectPath, Paths.MAPS, name, Paths.FILE_MAP_INFOS);
			const json = await readJSON(path);
			if (json) {
				json.stl = true;
				await writeJSON(path, json);
			}
		}
	}
}

export { ProjectUpdater_3_2_30 };
