/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import DialogCreateParameter from '../components/dialogs/models/DialogCreateParameter';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

class CreateParameter extends Base {
	public static type = 'CreateParameter';
	public defaultValue!: DynamicValue;

	public static bindings: BindingType[] = [['defaultValue', 'd', undefined, BINDING.DYNAMIC_VALUE, DynamicValue]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['name', 'default.value'];
	}

	applyDefault() {
		super.applyDefault(CreateParameter.getBindings([]));
		this.defaultValue = DynamicValue.create(DYNAMIC_VALUE_KIND.ANYTHING);
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogCreateParameter {...options} />;
	}

	toStrings(): string[] {
		return [this.toStringNameID(), this.defaultValue.toString()];
	}

	copy(parameter: CreateParameter, additionnalBinding: BindingType[] = []): void {
		super.copy(parameter, CreateParameter.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CreateParameter.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CreateParameter.getBindings(additionnalBinding));
	}
}

export { CreateParameter };
