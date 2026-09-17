/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Project } from '../core/Project';
import { EngineSettings } from './EngineSettings';

const VERSIONS_URL =
	'https://raw.githubusercontent.com/RPG-Paper-Maker/RPG-Paper-Maker/refs/heads/master/versions/versions.json';

export type EngineUpdate = { currentVersion: string; latestVersion: string };

export const getEngineUpdate = async (): Promise<EngineUpdate | null> => {
	try {
		const response = await fetch(VERSIONS_URL, { cache: 'no-store' });
		if (!response.ok) {
			return null;
		}
		const versions = (await response.json()) as { versions?: string[]; unstable?: boolean };
		if (!Array.isArray(versions.versions)) {
			return null;
		}
		const latestVersion =
			versions.versions[
				versions.versions.length -
					1 -
					(EngineSettings.current.getUnstableVersions || !versions.unstable ? 0 : 1)
			];
		const currentVersion = Project.VERSION.trim();
		return latestVersion && currentVersion !== latestVersion ? { currentVersion, latestVersion } : null;
	} catch {
		return null;
	}
};
