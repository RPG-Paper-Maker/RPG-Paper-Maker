/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Base } from './Base';
import { PluginParameter } from './PluginParameter';

class PluginCommand extends Base {
	public description!: string;
	public defaultParameters!: PluginParameter[];

	public static bindings: BindingType[] = [
		['description', 'description', '', BINDING.STRING],
		['defaultParameters', 'defaultParameters', [], BINDING.LIST, PluginParameter],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['Name([Parameters])'];
	}

	applyDefault() {
		super.applyDefault(PluginCommand.getBindings([]));
	}

	copy(pluginCommand: PluginCommand): void {
		super.copy(pluginCommand, PluginCommand.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, PluginCommand.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, PluginCommand.getBindings(additionnalBinding));
	}
}

export { PluginCommand };
