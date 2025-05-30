/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import DialogPluginParameter from '../components/dialogs/models/DialogPluginParameter';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

class PluginDefaultParameter extends Base {
	public description!: string;
	public defaultValue!: DynamicValue;

	public static bindings: BindingType[] = [
		['description', 'description', '', BINDING.STRING],
		[
			'defaultValue',
			'defaultValue',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['name', 'default.value'];
	}

	applyDefault() {
		super.applyDefault(PluginDefaultParameter.getBindings([]));
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogPluginParameter isDefault {...options} />;
	}

	toStrings(): string[] {
		return [`${Base.STRING_START} ${this.getName()}`, this.defaultValue.toString()];
	}

	copy(pluginDefaultParameter: PluginDefaultParameter): void {
		super.copy(pluginDefaultParameter, PluginDefaultParameter.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, PluginDefaultParameter.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, PluginDefaultParameter.getBindings(additionnalBinding));
	}
}

export { PluginDefaultParameter };
