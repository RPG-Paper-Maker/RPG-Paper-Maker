/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, BindingType, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import DialogDynamicNumber from '../components/dialogs/models/DialogDynamicNumber';
import { DynamicValue } from '../core/DynamicValue';
import { Base, DIALOG_OPTIONS } from './Base';

class DynamicNumber extends Base {
	public value!: DynamicValue;

	public static bindings: BindingType[] = [
		['value', 'value', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(DynamicNumber.getBindings([]));
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogDynamicNumber {...options} />;
	}

	toString(): string {
		return `${Base.STRING_START}${this.value.toString()}`;
	}

	copy(dynamicNumber: DynamicNumber): void {
		super.copy(dynamicNumber, DynamicNumber.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, DynamicNumber.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, DynamicNumber.getBindings(additionnalBinding));
	}
}

export { DynamicNumber };
