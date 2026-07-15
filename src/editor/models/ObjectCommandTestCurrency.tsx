/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, JSONType, Utils } from '../common';
import DialogObjectCommandTestCurrency from '../components/dialogs/models/DialogObjectCommandTestCurrency';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

class ObjectCommandTestCurrency extends Base {
	public static type = 'ObjectCommandTestCurrency';

	public currencyID!: number;
	public nb!: number;

	public static bindings: BindingType[] = [
		['currencyID', 'currencyID', 1, BINDING.NUMBER],
		['nb', 'nb', 0, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(ObjectCommandTestCurrency.getBindings(additionnalBinding));
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogObjectCommandTestCurrency {...options} />;
	}

	toString(): string | ReactNode {
		const currency = Base.getByID(Project.current!.systems.currencies, this.currencyID);
		const name = currency
			? currency.toStringNameID()
			: `${Base.STRING_START}${Utils.formatNumber(this.currencyID, 4)}: ?`;
		return `${name}: ${this.nb}`;
	}

	copy(objectCommandTestCurrency: ObjectCommandTestCurrency): void {
		super.copy(objectCommandTestCurrency, ObjectCommandTestCurrency.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, ObjectCommandTestCurrency.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, ObjectCommandTestCurrency.getBindings(additionnalBinding));
	}
}

export { ObjectCommandTestCurrency };
