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

class TroopMonster extends Base {
	public level!: DynamicValue;
	public hidden!: DynamicValue;
	public isSpecificPosition!: boolean;
	public specificPosition!: DynamicValue;

	public static bindings: BindingType[] = [
		['level', 'l', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		['hidden', 'h', DynamicValue.create(DYNAMIC_VALUE_KIND.SWITCH, false), BINDING.DYNAMIC_VALUE, DynamicValue],
		['isSpecificPosition', 'isSpecificPosition', false, BINDING.BOOLEAN],
		[
			'specificPosition',
			'specificPosition',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, 'new Core.Vector3(0,0,0)'),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(troopMonster: TroopMonster): void {
		super.copy(troopMonster, TroopMonster.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TroopMonster.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TroopMonster.getBindings(additionnalBinding));
	}
}

export { TroopMonster };
