/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSONType, Paths } from '../common';
import { getFiles, getFolders, readJSON, writeJSON } from '../common/Platform';
import { Project } from '../core/Project';

class ProjectUpdater {
	static versions = ['3.0.0'];

	static checkVersion(currentVersion: string, newVersion: string): boolean {
		const parseVersion = (version: string) => version.split('.').map(Number);
		const [currMajor, currMinor, currPatch] = parseVersion(currentVersion);
		const [newMajor, newMinor, newPatch] = parseVersion(newVersion);
		if (newMajor > currMajor) return true;
		if (newMajor < currMajor) return false;
		if (newMinor > currMinor) return true;
		if (newMinor < currMinor) return false;
		return newPatch > currPatch;
	}

	static async update(
		version: string,
		callback: (current: number, total: number, label?: string, extraPercent?: number) => void
	): Promise<string | null> {
		try {
			let passed = false;
			let index = 0;
			for (const newVersion of this.versions) {
				if (passed || this.checkVersion(version, newVersion)) {
					passed = true;
					const className = `ProjectUpdater_${newVersion.replaceAll('.', '_')}`;
					const module = await import(`./versions/${className}`);
					const updaterClass = module[className];
					if (updaterClass && typeof updaterClass.update === 'function') {
						const label = `Updating to version ${newVersion}...`;
						const currentIndex = index;
						callback(currentIndex, this.versions.length, label);
						await updaterClass.update((percent: number) => {
							callback(currentIndex, this.versions.length, label, percent);
						});
					} else {
						throw new Error(`Update method not found in ${className}`);
					}
				}
				index++;
			}
			callback(1, 1);
			const projectPath = Project.current!.getPath();
			const json = await readJSON(Paths.join(projectPath, Paths.FILE_SETTINGS));
			if (json) {
				json.pv = Project.VERSION;
				await writeJSON(Paths.join(projectPath, Paths.FILE_SETTINGS), json);
			}
			await Project.current!.scripts.loadSimple();
			const localPlugins = Project.current!.scripts.getLocalPlugins();
			return localPlugins.length > 0 ? localPlugins.join(', ') : null;
		} catch (error) {
			console.error('Failed to load updater:', error);
			return null;
		}
	}

	static async updateMapFolder(folder: string, callback: (json: JSONType, mapName: string) => void) {
		const files = await getFiles(Paths.join(Project.current!.getPath(), Paths.MAPS, folder));
		for (const file of files) {
			if (file !== 'infos.json') {
				const path = Paths.join(Project.current!.getPath(), Paths.MAPS, folder, file);
				const json = await readJSON(path);
				if (json) {
					callback.call(this, json, folder);
					await writeJSON(path, json);
				}
			}
		}
	}

	static async updateAllMapPortions(callback: (json: JSONType, mapName: string) => void) {
		const folders = await getFolders(Paths.join(Project.current!.getPath(), Paths.MAPS));
		for (const name of folders) {
			await this.updateMapFolder(name, callback);
			await this.updateMapFolder(Paths.join(name, Paths.TEMP), callback);
		}
	}

	static updateObjectCommand(obj: JSONType, callback: (json: JSONType) => void) {
		for (const event of (obj.events ?? []) as JSONType[]) {
			const reactions = event.r as Record<string, JSONType>;
			for (const id in reactions) {
				for (const command of reactions[id].c as JSONType[]) {
					callback.call(this, command);
				}
			}
		}
	}

	static async updateAllCommands(callback: (json: JSONType) => void) {
		const projectPath = Project.current!.getPath();

		// Map portions
		await this.updateAllMapPortions((json: JSONType) => {
			for (const obj of json.objs as JSONType[]) {
				this.updateObjectCommand(obj.v as JSONType, callback);
			}
		});

		// Map startup reactions
		const folders = await getFolders(Paths.join(projectPath, Paths.MAPS));
		for (const name of folders) {
			const path = Paths.join(projectPath, Paths.MAPS, name, Paths.FILE_MAP_INFOS);
			const json = await readJSON(path);
			if (json) {
				this.updateObjectCommand(json.so as JSONType, callback);
				await writeJSON(path, json);
			}
		}

		// Common objects + common reactions
		const jsonEvents = await readJSON(Paths.join(projectPath, Paths.FILE_COMMON_EVENTS));
		if (jsonEvents) {
			this.updateObjectCommand(jsonEvents.do as JSONType, callback);
			this.updateObjectCommand(jsonEvents.ho as JSONType, callback);
			for (const obj of jsonEvents.commonObjects as JSONType[]) {
				this.updateObjectCommand(obj, callback);
			}
			for (const reaction of jsonEvents.commonReactors as JSONType[]) {
				for (const command of reaction.c as JSONType[]) {
					callback.call(this, command);
				}
			}
			await writeJSON(Paths.join(projectPath, Paths.FILE_COMMON_EVENTS), jsonEvents);
		}

		// Troops reactions
		const jsonTroops = await readJSON(Paths.join(projectPath, Paths.FILE_TROOPS));
		if (jsonTroops) {
			for (const troop of jsonTroops.troops as JSONType[]) {
				if (troop.reactions) {
					for (const reaction of troop.reactions as JSONType[]) {
						for (const command of reaction.c as JSONType[]) {
							callback.call(this, command);
						}
					}
				}
			}
			await writeJSON(Paths.join(projectPath, Paths.FILE_TROOPS), jsonTroops);
		}
	}

	static updateObjectStates(obj: JSONType, callback: (json: JSONType) => void) {
		for (const state of (obj.states ?? []) as JSONType[]) {
			callback.call(this, state);
		}
	}

	static async updateAllObjectStates(callback: (json: JSONType) => void) {
		const projectPath = Project.current!.getPath();

		// Map portions
		await this.updateAllMapPortions((json: JSONType) => {
			for (const obj of (json.objs ?? []) as JSONType[]) {
				this.updateObjectStates(obj.v as JSONType, callback);
			}
		});

		// Common objects
		const jsonEvents = await readJSON(Paths.join(projectPath, Paths.FILE_COMMON_EVENTS));
		if (jsonEvents) {
			this.updateObjectStates(jsonEvents.do as JSONType, callback);
			this.updateObjectStates(jsonEvents.ho as JSONType, callback);
			for (const obj of jsonEvents.commonObjects as JSONType[]) {
				this.updateObjectStates(obj, callback);
			}
			await writeJSON(Paths.join(projectPath, Paths.FILE_COMMON_EVENTS), jsonEvents);
		}
	}
}

export { ProjectUpdater };
