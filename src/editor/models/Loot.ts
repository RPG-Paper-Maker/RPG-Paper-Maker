/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class Loot extends Base {
	public kind!: number;
	public lootID!: DynamicValue;
	public number!: DynamicValue;
	public probability!: DynamicValue;
	public initial!: DynamicValue;
	public final!: DynamicValue;

	public static bindings: BindingType[] = [
		['kind', 'k', undefined, BINDING.NUMBER],
		['lootID', 'lid', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['number', 'n', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['probability', 'p', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['initial', 'i', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['final', 'f', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(loot: Loot): void {
		super.copy(loot, Loot.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Loot.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Loot.getBindings(additionnalBinding));
	}
}

export { Loot };
