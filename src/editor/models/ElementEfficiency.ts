/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class ElementEfficiency extends Base {
	public value!: DynamicValue;

	public static createEfficiency(id: number, name: string, value: DynamicValue): ElementEfficiency {
		let element = new ElementEfficiency();
		element.id = id;
		element.name = name;
		element.value = value;
		return element;
	}

	static getTreeHeader(): string[] {
		return ['element', 'efficiency'];
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
