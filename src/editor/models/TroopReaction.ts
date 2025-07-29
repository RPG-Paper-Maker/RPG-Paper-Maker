/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType, TROOP_REACTION_FREQUENCY_KIND } from '../common';
import { BindingType } from '../core/Serializable';
import { MapObjectReaction } from './MapObjectReaction';
import { TroopReactionConditions } from './TroopReactionConditions';

class TroopReaction extends MapObjectReaction {
	public static type = 'TroopReaction';
	public conditions!: TroopReactionConditions;
	public frequency!: TROOP_REACTION_FREQUENCY_KIND;

	public static bindings: BindingType[] = [
		['conditions', 'conditions', undefined, BINDING.OBJECT, TroopReactionConditions],
		['frequency', 'frequency', TROOP_REACTION_FREQUENCY_KIND.ONE_TIME, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(TroopReaction.getBindings(additionnalBinding));
		this.conditions = new TroopReactionConditions();
		this.conditions.applyDefault();
	}

	copy(troopReaction: TroopReaction): void {
		super.copy(troopReaction, TroopReaction.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TroopReaction.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TroopReaction.getBindings(additionnalBinding));
	}
}

export { TroopReaction };
