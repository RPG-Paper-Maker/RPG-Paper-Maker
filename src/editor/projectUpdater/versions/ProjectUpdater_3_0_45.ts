/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants, JSONType, Paths } from '../../common';
import { checkFileExists, getFiles, getFolders, readJSON, writeJSON } from '../../common/Platform';
import { Project } from '../../core/Project';

class ProjectUpdater_3_0_45 {
	static async update() {
		const projectPath = Project.current!.getPath();
		const mapFolders = await getFolders(Paths.join(projectPath, Paths.MAPS));
		for (const folder of mapFolders) {
			const folderPath = Paths.join(projectPath, Paths.MAPS, folder);
			await this.fixMapFolder(folderPath);
			const tempPath = Paths.join(folderPath, Paths.TEMP);
			if (await checkFileExists(tempPath)) {
				await this.fixMapFolder(tempPath);
			}
		}
	}

	static getPositionKey(k: number[]): string {
		return `${k[0]}+${k[1]}+${k[2]}+${k[3]}+${k[4] ?? 0}`;
	}

	static async fixMapFolder(folderPath: string) {
		const files = await getFiles(folderPath);
		const portionData = new Map<string, JSONType>();
		const portionPY = new Map<string, number>();
		const portionPX = new Map<string, number>();
		const portionPZ = new Map<string, number>();
		const modified = new Set<string>();

		for (const file of files) {
			if (file === 'infos.json' || !file.endsWith('.json')) continue;
			const parts = file.replace('.json', '').split('_');
			if (parts.length !== 3 || parts.some((p) => isNaN(Number(p)))) continue;
			const json = await readJSON(Paths.join(folderPath, file));
			if (json) {
				portionData.set(file, json);
				portionPX.set(file, Number(parts[0]));
				portionPY.set(file, Number(parts[1]));
				portionPZ.set(file, Number(parts[2]));
			}
		}

		// Detect and relocate misplaced land entries
		for (const [file, json] of portionData) {
			const py = portionPY.get(file)!;
			const px = portionPX.get(file)!;
			const pz = portionPZ.get(file)!;
			const lands = json.lands as JSONType[] | undefined;
			if (!Array.isArray(lands)) continue;

			const toRemove: JSONType[] = [];
			for (const entry of lands) {
				const k = entry.k as number[];
				if (!Array.isArray(k) || k.length < 4) continue;
				const x = k[0] as number;
				const y = k[1] as number;
				const z = k[3] as number;
				const expectedPX = Math.floor(x / Constants.PORTION_SIZE);
				const expectedPY = Math.floor(y / Constants.PORTION_SIZE);
				const expectedPZ = Math.floor(z / Constants.PORTION_SIZE);
				if (expectedPX === px && expectedPY === py && expectedPZ === pz) continue;

				// Land is in the wrong portion — move it to the correct one
				const targetFile = `${expectedPX}_${expectedPY}_${expectedPZ}.json`;
				let targetJson = portionData.get(targetFile);
				if (!targetJson) {
					targetJson = {};
					portionData.set(targetFile, targetJson);
				}
				if (!Array.isArray(targetJson.lands)) {
					targetJson.lands = [];
				}

				// Skip if an entry for this position already exists in the target
				const entryKey = this.getPositionKey(k);
				const isDuplicate = (targetJson.lands as JSONType[]).some((e) => {
					const ek = e.k as number[];
					return Array.isArray(ek) && this.getPositionKey(ek) === entryKey;
				});
				if (!isDuplicate) {
					(targetJson.lands as JSONType[]).push(entry);
					modified.add(targetFile);
				}
				toRemove.push(entry);
			}

			if (toRemove.length > 0) {
				json.lands = (lands as JSONType[]).filter((e) => !toRemove.includes(e));
				modified.add(file);
			}
		}

		// Write all modified portion files
		for (const file of modified) {
			const json = portionData.get(file);
			if (json) {
				await writeJSON(Paths.join(folderPath, file), json);
			}
		}
	}
}

export { ProjectUpdater_3_0_45 };
