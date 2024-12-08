/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Hero } from './Hero';
import { Loot } from './Loot';
import { MonsterAction } from './MonsterAction';
import { ProgressionTable } from './ProgressionTable';

interface Rewards {
	xp: ProgressionTable;
	currencies: ProgressionTable[];
	loots: Loot[];
}

class Monster extends Hero {
	rewards!: Rewards;
	actions!: MonsterAction[];

	public static bindings: BindingType[] = [['actions', 'a', [], BINDING.LIST, MonsterAction]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
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
