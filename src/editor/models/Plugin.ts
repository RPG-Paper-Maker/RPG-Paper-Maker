/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType, PLUGIN_CATEGORY_KIND, PLUGIN_TYPE_KIND } from '../common';
import { Base } from './Base';
import { PluginCommand } from './PluginCommand';
import { PluginDefaultParameter } from './PluginDefaultParameter';
import { PluginParameter } from './PluginParameter';

class Plugin extends Base {
	public isOn!: boolean;
	public type!: PLUGIN_TYPE_KIND;
	public category!: PLUGIN_CATEGORY_KIND;
	public author!: string;
	public website!: string;
	public description!: string;
	public version!: string;
	public tutorial!: string;
	public defaultParameters!: PluginDefaultParameter[];
	public parameters!: PluginParameter[];
	public commands!: PluginCommand[];

	public static bindings: BindingType[] = [
		['isOn', 'isOn', true, BINDING.BOOLEAN],
		['type', 'type', PLUGIN_TYPE_KIND.EMPTY, BINDING.NUMBER],
		['category', 'category', PLUGIN_CATEGORY_KIND.BATTLE, BINDING.NUMBER],
		['author', 'author', '', BINDING.STRING],
		['website', 'website', '', BINDING.STRING],
		['description', 'description', '', BINDING.STRING],
		['version', 'version', '1.0.0', BINDING.STRING],
		['tutorial', 'tutorial', '', BINDING.STRING],
		['defaultParameters', 'defaultParameters', [], BINDING.LIST, PluginDefaultParameter],
		['parameters', 'parameters', [], BINDING.LIST, PluginParameter],
		['commands', 'commands', [], BINDING.LIST, PluginCommand],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static create(id: number, name: string) {
		const plugin = new Plugin();
		plugin.id = id;
		plugin.name = name;
		return plugin;
	}

	applyDefault() {
		super.applyDefault(Plugin.getBindings([]));
	}

	copy(plugin: Plugin): void {
		super.copy(plugin, Plugin.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Plugin.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Plugin.getBindings(additionnalBinding));
	}
}

export { Plugin };
