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
import DialogFrequency from '../components/dialogs/models/DialogFrequency';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

class Frequency extends Base {
	public static type = 'Frequency';
	public value!: DynamicValue;

	public static bindings: BindingType[] = [
		['value', 'v', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(Frequency.getBindings([]));
		this.value.value = 0;
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogFrequency {...options} />;
	}

	copy(frequency: Frequency, additionnalBinding: BindingType[] = []): void {
		super.copy(frequency, Frequency.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Frequency.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Frequency.getBindings(additionnalBinding));
	}
}

export { Frequency };
