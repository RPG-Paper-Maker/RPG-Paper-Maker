/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class SpeedFrequency extends Base {
	public value!: DynamicValue;

	public static bindings: BindingType[] = [
		['value', 'v', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(SpeedFrequency.getBindings([]));
	}

	copy(speedFrequency: SpeedFrequency, additionnalBinding: BindingType[] = []): void {
		super.copy(speedFrequency, SpeedFrequency.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, SpeedFrequency.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, SpeedFrequency.getBindings(additionnalBinding));
	}
}

export { SpeedFrequency };
