/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { JSONType, Paths } from '../common';
import { Platform } from '../common/Platform';
import { Project, Serializable } from '../core';

class Scripts extends Serializable {
	public plugins!: Model.Plugin[];

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SCRIPTS);
	}

	async load() {
		this.plugins = [];
		const json = await Platform.readJSON(this.getPath());
		if (json) {
			const jsonList = (json.plugins ?? []) as JSONType[];
			for (const jsonPlugin of jsonList) {
				const plugin = new Model.Plugin();
				plugin.readSimple(jsonPlugin);
				const jsonDetails = await Platform.readJSON(plugin.getPath());
				if (jsonDetails) {
					plugin.readDetails(jsonDetails);
				}
				plugin.code = (await Platform.readFile(plugin.getPathCode())) ?? '';
				this.plugins.push(plugin);
			}
		}
	}

	async save() {
		const json = {} as JSONType;
		if (this.plugins.length > 0) {
			const jsonList = [] as JSONType[];
			for (const plugin of this.plugins) {
				const jsonPlugin = {};
				plugin.writeSimple(jsonPlugin);
				jsonList.push(jsonPlugin);
				if (!plugin.saved) {
					const jsonPluginDetails = {};
					plugin.writeDetails(jsonPluginDetails);
					await Platform.writeJSON(plugin.getPath(), jsonPluginDetails);
					await Platform.createFile(plugin.getPathCode(), plugin.code);
				}
			}
			json.plugins = jsonList;
		}
		await Platform.writeJSON(this.getPath(), json);
	}
}

export { Scripts };
