/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DYNAMIC_VALUE_KIND, EFFECT_KIND } from '../../common';
import { Project } from '../../core/Project';

class ProjectUpdater_3_0_4 {
	static async update() {
		for (const status of Project.current!.status.list) {
			for (const effect of status.effects) {
				if (effect.kind === EFFECT_KIND.DAMAGES && effect.damageFormula.kind === DYNAMIC_VALUE_KIND.FORMULA) {
					(effect.damageFormula.value as string).replaceAll('u.maxhp', 't.maxhp');
				}
			}
		}
		await Project.current!.status.save();
	}
}

export { ProjectUpdater_3_0_4 };
