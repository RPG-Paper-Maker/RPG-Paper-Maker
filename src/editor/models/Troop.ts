/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Base } from './Base';
import { TroopMonster } from './TroopMonster';
import { TroopReaction } from './TroopReaction';

class Troop extends Base {
	public list!: TroopMonster[];
	public reactions!: TroopReaction[];

	public static bindings: BindingType[] = [
		['list', 'l', [], BINDING.LIST, TroopMonster],
		['reactions', 'reactions', [], BINDING.LIST, TroopReaction],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(troop: Troop): void {
		super.copy(troop, Troop.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Troop.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Troop.getBindings(additionnalBinding));
	}
}

export { Troop };
