/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @deprecated Move camera / screen tone legacy modes (pre-3.2.30 projects), to remove. */

import i18next from 'i18next';
import { Project } from '../core/Project';
import { CommandUsage, findCommandUsages } from './CommandUsages';
import { isLegacyMoveCamera } from './LegacyMoveCamera';
import { isLegacyScreenTone } from './LegacyScreenTone';

export async function findLegacyUsages(): Promise<CommandUsage[]> {
	return findCommandUsages(
		(command) => isLegacyMoveCamera(command) || isLegacyScreenTone(command),
		(infos) => (infos.stl ? `${i18next.t('screen.tone')}: [${i18next.t('screen.tone.legacy')}]` : null),
	);
}

/**
 *  Recount the legacy commands and map properties, and store the count in the project settings.
 */
export async function updateLegacyCount(usages?: CommandUsage[]): Promise<number> {
	const settings = Project.current!.settings;
	if (usages === undefined && settings.legacyCount === 0) {
		return 0;
	}
	const count = (usages ?? (await findLegacyUsages())).length;
	if (count !== settings.legacyCount) {
		settings.legacyCount = count;
		await settings.save();
	}
	return count;
}
