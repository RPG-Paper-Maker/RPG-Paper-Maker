/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSONType, Paths } from '../../common';
import { readJSON, writeJSON } from '../../common/Platform';
import { Project } from '../../core/Project';
import { ProjectUpdater } from '../ProjectUpdater';

const DISPLAY_A_PICTURE_KIND = 35;
const SET_MOVE_TURN_A_PICTURE_KIND = 36;
const SET_DIALOG_BOX_OPTIONS_KIND = 38;
const PLUGIN_KIND = 57;
const DYNAMIC_VALUE_NUMBER_KIND = 3;
const DYNAMIC_VALUE_NUMBER_DECIMAL_KIND = 12;

const MULTIPLE_WINDOW_BOXES_NAME_LOWER = 'multiple window boxes';
const SPAWN_WINDOW_NAME_LOWER = 'spawn window';

const scaleDVIfNumber = (c: number[], i: number, factor: number) => {
	if (c[i] === DYNAMIC_VALUE_NUMBER_KIND || c[i] === DYNAMIC_VALUE_NUMBER_DECIMAL_KIND) {
		c[i + 1] = Math.round(c[i + 1] * factor);
	}
};

const scaleDisplayAPicture = (c: number[]) => {
	let i = 0;
	i += 2; // pictureID
	i += 1; // extra skip
	i += 2; // index
	i += 1; // centered
	scaleDVIfNumber(c, i, 2);
	i += 2;
	scaleDVIfNumber(c, i, 1.5);
	i += 2;
	scaleDVIfNumber(c, i, 1.5);
};

const scaleSetMoveTurnAPicture = (c: number[]) => {
	let i = 0;
	i += 2; // index
	if (c[i++] !== 0) {
		i += 2;
		i += 1;
	}
	if (c[i++] !== 0) {
		scaleDVIfNumber(c, i, 1.5);
		i += 2;
	}
	if (c[i++] !== 0) {
		i += 2;
	}
	if (c[i++] !== 0) {
		scaleDVIfNumber(c, i, 2);
		i += 2;
	}
	if (c[i++] !== 0) {
		scaleDVIfNumber(c, i, 1.5);
		i += 2;
	}
};

const scaleDialogBoxCommand = (c: number[]) => {
	const iter = { i: 0 };
	const readBool = () => c[iter.i++] !== 0;
	const skipDV = () => {
		iter.i += 2;
	};
	const scaleDV = (factor: number) => {
		if (c[iter.i] === DYNAMIC_VALUE_NUMBER_KIND || c[iter.i] === DYNAMIC_VALUE_NUMBER_DECIMAL_KIND) {
			c[iter.i + 1] = Math.round(c[iter.i + 1] * factor);
		}
		iter.i += 2;
	};

	if (readBool()) skipDV(); // windowSkin
	if (readBool()) scaleDV(2); // x
	if (readBool()) scaleDV(1.5); // y
	if (readBool()) scaleDV(2); // w
	if (readBool()) scaleDV(1.5); // h
	if (readBool()) scaleDV(2); // pLeft
	if (readBool()) scaleDV(1.5); // pTop
	if (readBool()) scaleDV(2); // pRight
	if (readBool()) scaleDV(1.5); // pBottom
	if (readBool()) iter.i++; // fPosAbove (bool)
	if (readBool()) scaleDV(2); // fX
	if (readBool()) scaleDV(1.5); // fY
};

const scaleDialogBoxCommandDbo = (c: number[]) => {
	const iter = { i: 0 };
	const readBool = () => c[iter.i++] !== 0;
	const skipDV = () => {
		iter.i += 2;
	};
	const scaleDV = (factor: number) => {
		if (typeof c[iter.i + 1] === 'number') {
			c[iter.i + 1] = Math.round(c[iter.i + 1] * factor);
		}
		iter.i += 2;
	};

	if (readBool()) skipDV();
	if (readBool()) scaleDV(2); // x
	if (readBool()) scaleDV(1.5); // y
	if (readBool()) scaleDV(2); // w
	if (readBool()) scaleDV(1.5); // h
	if (readBool()) scaleDV(2); // pLeft
	if (readBool()) scaleDV(1.5); // pTop
	if (readBool()) scaleDV(2); // pRight
	if (readBool()) scaleDV(1.5); // pBottom
	if (readBool()) iter.i++; // fPosAbove (bool)
	if (readBool()) scaleDV(2); // fX
	if (readBool()) scaleDV(1.5); // fY
};

const scaleSpawnWindowCommand = (c: number[]) => {
	scaleDVIfNumber(c, 4, 2); // x
	scaleDVIfNumber(c, 6, 1.5); // y
	scaleDVIfNumber(c, 8, 2); // width
	scaleDVIfNumber(c, 10, 1.5); // height
};

const findSpawnWindowIDs = async (projectPath: string): Promise<[number, number] | null> => {
	const scriptsJson = await readJSON(Paths.join(projectPath, 'scripts.json'));
	if (!scriptsJson) return null;
	const plugins = (scriptsJson.plugins ?? []) as JSONType[];
	const plugin = plugins.find(
		(p) => typeof p.name === 'string' && (p.name as string).toLowerCase() === MULTIPLE_WINDOW_BOXES_NAME_LOWER,
	);
	if (!plugin) return null;
	const detailsPath = Paths.join(projectPath, 'Plugins', plugin.name as string, 'details.json');
	const detailsJson = await readJSON(detailsPath);
	if (!detailsJson) return null;
	const commands = (detailsJson.commands ?? []) as JSONType[];
	const cmd = commands.find(
		(c) => typeof c.name === 'string' && (c.name as string).toLowerCase() === SPAWN_WINDOW_NAME_LOWER,
	);
	if (!cmd) return null;
	return [plugin.id as number, cmd.id as number];
};

class ProjectUpdater_3_0_65 {
	static async update() {
		const projectPath = Project.current!.getPath();
		const spawnWindowIDs = await findSpawnWindowIDs(projectPath);

		await ProjectUpdater.updateAllCommands((json: JSONType) => {
			if (!Array.isArray(json.command)) return;
			const c = json.command as number[];
			switch (json.kind) {
				case DISPLAY_A_PICTURE_KIND:
					scaleDisplayAPicture(c);
					break;
				case SET_MOVE_TURN_A_PICTURE_KIND:
					scaleSetMoveTurnAPicture(c);
					break;
				case SET_DIALOG_BOX_OPTIONS_KIND:
					scaleDialogBoxCommand(c);
					break;
				case PLUGIN_KIND:
					if (spawnWindowIDs && c[0] === spawnWindowIDs[0] && c[1] === spawnWindowIDs[1]) {
						scaleSpawnWindowCommand(c);
					}
					break;
			}
		});

		// Scale system.json: default dialog box options and font sizes.
		const systemPath = Paths.join(projectPath, 'system.json');
		const json = await readJSON(systemPath);
		if (json) {
			if (json.dbo && Array.isArray((json.dbo as JSONType).command)) {
				scaleDialogBoxCommandDbo((json.dbo as JSONType).command as number[]);
			}
			if (Array.isArray(json.fs)) {
				for (const entry of json.fs as JSONType[]) {
					const s = entry.s as JSONType;
					if (s && s.k === DYNAMIC_VALUE_NUMBER_KIND && typeof s.v === 'number') {
						s.v = Math.round((s.v as number) * 1.5);
					}
				}
			}
			await writeJSON(systemPath, json);
		}
	}
}

export { ProjectUpdater_3_0_65 };
