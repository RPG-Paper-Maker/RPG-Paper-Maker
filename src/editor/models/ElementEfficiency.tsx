/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { DYNAMIC_VALUE_KIND } from '../common';
import DialogDynamicNumber from '../components/dialogs/models/DialogDynamicNumber';
import { DynamicValue } from '../core/DynamicValue';
import { Base, DIALOG_OPTIONS } from './Base';

class ElementEfficiency extends Base {
	public static type = 'ElementEfficiency';

	public value!: DynamicValue;

	applyDefault(): void {
		super.applyDefault([]);
		this.value = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 1);
	}

	public static createEfficiency(id: number, name: string, value: DynamicValue): ElementEfficiency {
		const element = new ElementEfficiency();
		element.id = id;
		element.name = name;
		element.value = value;
		return element;
	}

	static getTreeHeader(): string[] {
		return ['element', 'efficiency'];
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogDynamicNumber decimal {...options} />;
	}

	toStrings(): string[] {
		return [this.toStringNameID(), `x ${this.value.toString()}`];
	}

	copy(element: ElementEfficiency): void {
		this.id = element.id;
		this.name = element.name;
		this.value = element.value.clone();
	}
}

export { ElementEfficiency };
