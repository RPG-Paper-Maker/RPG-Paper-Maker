/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { JSONType, Paths, PLUGIN_TYPE_KIND } from '../common';
import { Platform } from '../common/Platform';
import { Project, Serializable } from '../core';

class Scripts extends Serializable {
	public plugins!: Model.Plugin[];

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SCRIPTS);
	}

	getLocalPlugins(): string[] {
		const plugins: string[] = [];
		for (const plugin of this.plugins) {
			if (
				plugin.type === PLUGIN_TYPE_KIND.EMPTY ||
				plugin.type === PLUGIN_TYPE_KIND.LOCAL ||
				(plugin.type === PLUGIN_TYPE_KIND.ONLINE && !plugin.autoUpdate)
			) {
				plugins.push(plugin.name);
			}
		}
		return plugins;
	}

	async checkUpdates() {
		const manifest = await Model.Plugin.getManifest();
		if (manifest) {
			for (const plugin of this.plugins) {
				if (plugin.type === PLUGIN_TYPE_KIND.ONLINE && plugin.autoUpdate) {
					await plugin.checkUpdate(manifest, false);
				}
			}
		}
	}

	async loadSimple() {
		this.plugins = [];
		const json = await Platform.readJSON(this.getPath());
		if (json) {
			const jsonList = (json.plugins ?? []) as JSONType[];
			for (const jsonPlugin of jsonList) {
				const plugin = new Model.Plugin();
				plugin.readSimple(jsonPlugin);
				this.plugins.push(plugin);
			}
		}
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
				this.plugins.push(plugin);
			}
		}
		await this.checkUpdates();
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
