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
import { isMoveCameraChanged, setMoveCameraLegacy } from '../../data/LegacyMoveCamera';
import { isMapScreenToneChanged, isScreenToneChanged, setScreenToneLegacy } from '../../data/LegacyScreenTone';
import { MapObjectCommandType } from '../../models';
import { ProjectUpdater } from '../ProjectUpdater';

class ProjectUpdater_3_2_30 {
	static hasLights = false;
	static legacyCount = 0;

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

	static setScreenToneLegacy(command: JSONType) {
		if (command.kind !== EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE) {
			return;
		}
		const list = command.command as MapObjectCommandType[];
		if (isScreenToneChanged(list)) {
			setScreenToneLegacy(list);
			this.legacyCount++;
		}
	}

	static setMoveCameraLegacy(command: JSONType) {
		if (command.kind !== EVENT_COMMAND_KIND.MOVE_CAMERA) {
			return;
		}
		const list = command.command as MapObjectCommandType[];
		if (isMoveCameraChanged(list)) {
			setMoveCameraLegacy(list);
			this.legacyCount++;
		}
	}

	static async updateScreenTone() {
		this.hasLights = false;
		await this.detectLights();
		if (!this.hasLights) {
			return;
		}
		await ProjectUpdater.updateAllCommands((command) => this.setScreenToneLegacy(command));
		const projectPath = Project.current!.getPath();
		for (const name of await getFolders(Paths.join(projectPath, Paths.MAPS))) {
			const path = Paths.join(projectPath, Paths.MAPS, name, Paths.FILE_MAP_INFOS);
			const json = await readJSON(path);
			if (json && isMapScreenToneChanged(json)) {
				json.stl = true;
				await writeJSON(path, json);
				this.legacyCount++;
			}
		}
	}

	static async update() {
		this.legacyCount = 0;
		await ProjectUpdater.updateAllCommands((command) => this.setMoveCameraLegacy(command));
		await this.updateScreenTone();
		if (this.legacyCount > 0) {
			const path = Paths.join(Project.current!.getPath(), Paths.FILE_SETTINGS);
			const json = await readJSON(path);
			if (json) {
				json.lc = this.legacyCount;
				await writeJSON(path, json);
			}
		}
	}
}

export { ProjectUpdater_3_2_30 };
