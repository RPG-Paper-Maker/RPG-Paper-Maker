/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, BindingType, JSONType, Paths, PLUGIN_CATEGORY_KIND, PLUGIN_TYPE_KIND } from '../common';
import { Project } from '../core';
import { Checkable } from './Checkable';
import { PluginCommand } from './PluginCommand';
import { PluginDefaultParameter } from './PluginDefaultParameter';
import { PluginParameter } from './PluginParameter';

class Plugin extends Checkable {
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
	public code!: string;
	public saved = true;

	public static bindings: BindingType[] = [
		['name', 'name', '', BINDING.STRING],
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

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.PLUGINS, this.name, Paths.FILE_PLUGIN_DETAILS);
	}

	getPathCode(): string {
		return Paths.join(Project.current!.getPath(), Paths.PLUGINS, this.name, Paths.FILE_PLUGIN_CODE);
	}

	applyDefault() {
		super.applyDefault(Plugin.bindings);
	}

	toString(): string | ReactNode {
		return super.toString() + (this.saved ? '' : ' *');
	}

	copy(plugin: Plugin): void {
		super.copy(plugin, Plugin.bindings);
	}

	readSimple(json: JSONType) {
		super.read(json);
	}

	readDetails(json: JSONType) {
		super.readSimple(json, Plugin.bindings);
	}

	writeSimple(json: JSONType) {
		super.write(json);
	}

	writeDetails(json: JSONType) {
		super.writeSimple(json, Plugin.bindings);
	}
}

export { Plugin };
