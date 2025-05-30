/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Hero } from './Hero';
import { MonsterAction } from './MonsterAction';
import { MonsterLoot } from './MonsterLoot';
import { ProgressionTable } from './ProgressionTable';

class Monster extends Hero {
	experience!: ProgressionTable;
	currencies!: Map<number, ProgressionTable>;
	loots!: MonsterLoot[];
	actions!: MonsterAction[];

	public static bindings: BindingType[] = [
		['experience', 'xp', undefined, BINDING.OBJECT, ProgressionTable],
		['currencies', 'cur', undefined, BINDING.MAP_KEY_VALUE, ProgressionTable],
		['loots', 'loots', [], BINDING.LIST, MonsterLoot],
		['actions', 'a', [], BINDING.LIST, MonsterAction],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(Monster.getBindings(additionnalBinding));
		this.experience = ProgressionTable.createProgression(
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			0
		);
		this.currencies = new Map();
	}

	copy(monster: Monster): void {
		super.copy(monster, Monster.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Monster.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Monster.getBindings(additionnalBinding));
	}
}

export { Monster };
