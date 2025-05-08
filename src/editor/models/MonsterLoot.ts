/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class MonsterLoot extends Base {
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

	copy(loot: MonsterLoot): void {
		super.copy(loot, MonsterLoot.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MonsterLoot.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MonsterLoot.getBindings(additionnalBinding));
	}
}

export { MonsterLoot };
