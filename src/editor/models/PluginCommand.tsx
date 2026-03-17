/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, JSONType } from '../common';
import DialogPluginCommand from '../components/dialogs/models/DialogPluginCommand';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';
import { PluginDefaultParameter } from './PluginDefaultParameter';

class PluginCommand extends Base {
	public static type = 'PluginCommand';
	public description!: string;
	public parameters!: PluginDefaultParameter[];

	public static bindings: BindingType[] = [
		['description', 'description', '', BINDING.STRING],
		['parameters', 'defaultParameters', [], BINDING.LIST, PluginDefaultParameter],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['Name([Parameters])'];
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogPluginCommand {...options} />;
	}

	toString(): string {
		return `${super.toString()}(${this.parameters.map((p) => p.name).join(', ')})`;
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
