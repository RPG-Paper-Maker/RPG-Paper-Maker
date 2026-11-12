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

const FILE_TITLE_SCREEN_GAME_OVER = 'titlescreenGameover.json';
const TITLE_COMMAND_KIND_CREDITS = 5;
const CREDITS_KEYS = ['ct', 'cs', 'cbc', 'cbi', 'cbv', 'cm', 'ccs', 'csk', 'cmk', 'cmd'];

class ProjectUpdater_3_2_29 {
	static async update() {
		const path = Paths.join(Project.current!.getPath(), FILE_TITLE_SCREEN_GAME_OVER);
		const json = await readJSON(path);
		if (!json) {
			return;
		}
		const commands = (json.tc ?? []) as Record<string, unknown>[];
		const creditsCommand = commands.find((command) => command.k === TITLE_COMMAND_KIND_CREDITS);
		if (creditsCommand && json.cr === undefined) {
			const credits: Record<string, unknown> = {};
			for (const key of CREDITS_KEYS) {
				if (creditsCommand[key] !== undefined) {
					credits[key] = creditsCommand[key];
				}
			}
			json.cr = credits;
		}
		for (const command of commands) {
			for (const key of CREDITS_KEYS) {
				delete command[key];
			}
		}
		await writeJSON(path, json);
	}
}

export { ProjectUpdater_3_2_29 };
