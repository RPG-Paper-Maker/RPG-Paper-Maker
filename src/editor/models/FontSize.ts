/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class FontSize extends Base {
	public size!: DynamicValue;

	public static bindings: BindingType[] = [
		['size', 's', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(FontSize.getBindings([]));
	}

	copy(fontSize: FontSize, additionnalBinding: BindingType[] = []): void {
		super.copy(fontSize, FontSize.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, FontSize.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, FontSize.getBindings(additionnalBinding));
	}
}

export { FontSize };
