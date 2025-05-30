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
import DialogMapObjectParameter from '../components/dialogs/models/DialogMapObjectParameter';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';
import { CreateParameter } from './CreateParameter';

class MapObjectParameter extends Base {
	public parameter!: CreateParameter | null;
	public value!: DynamicValue;

	public static bindings: BindingType[] = [
		['value', 'v', DynamicValue.create(DYNAMIC_VALUE_KIND.NONE), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['name', 'value', 'default.value'];
	}

	static create(id: number, name: string, createParameter?: CreateParameter, value?: DynamicValue) {
		const parameter = new MapObjectParameter();
		parameter.id = id;
		parameter.name = name;
		if (createParameter) {
			parameter.parameter = createParameter;
		}
		if (value) {
			parameter.value = value;
		}
		return parameter;
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogMapObjectParameter {...options} />;
	}

	toStringValueOrDefault(): string {
		return this.value.kind === DYNAMIC_VALUE_KIND.DEFAULT ? this.toStringDefault() : this.value.toString();
	}

	toStringDefault(): string {
		return this.parameter?.defaultValue?.toString() ?? '-';
	}

	toStrings(): string[] {
		return [`${Base.STRING_START}${this.name}`, this.value.toString(), this.toStringDefault()];
	}

	copy(parameter: MapObjectParameter, additionnalBinding: BindingType[] = []): void {
		super.copy(parameter, MapObjectParameter.getBindings(additionnalBinding));
		this.parameter = parameter.parameter ? parameter.parameter.clone() : null;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObjectParameter.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MapObjectParameter.getBindings(additionnalBinding));
	}
}

export { MapObjectParameter };
