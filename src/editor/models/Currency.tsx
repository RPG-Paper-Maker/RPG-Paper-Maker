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
import DialogCurrency from '../components/dialogs/models/DialogCurrency';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { DIALOG_OPTIONS } from './Base';
import { Icon } from './Icon';

class Currency extends Icon {
	public displayInMenu!: DynamicValue;

	public static bindings: BindingType[] = [
		[
			'displayInMenu',
			'dim',
			DynamicValue.create(DYNAMIC_VALUE_KIND.SWITCH, true),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(Currency.getBindings([]));
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogCurrency {...options} />;
	}

	copy(currency: Currency): void {
		super.copy(currency, Currency.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Currency.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Currency.getBindings(additionnalBinding));
	}
}

export { Currency };
