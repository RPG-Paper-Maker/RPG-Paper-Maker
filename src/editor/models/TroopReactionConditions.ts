/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, CONDITION_HEROES_KIND, DYNAMIC_VALUE_KIND, JSONType, OPERATION_KIND } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';

class TroopReactionConditions extends Base {
	public isNumberOfTurn!: boolean;
	public numberOfTurnPlus!: DynamicValue;
	public numberOfTurnTimes!: DynamicValue;
	public isHeroesMonsters!: boolean;
	public isHeroes!: boolean;
	public conditionHeroesKind!: CONDITION_HEROES_KIND;
	public heroInstanceID!: DynamicValue;
	public isStatusID!: boolean;
	public statusID!: DynamicValue;
	public isStatisticID!: boolean;
	public statisticID!: DynamicValue;
	public statisticOperationKind!: OPERATION_KIND;
	public statisticCompare!: DynamicValue;
	public statisticCompareUnit!: boolean;

	public static bindings: BindingType[] = [
		['isNumberOfTurn', 'isNumberOfTurn', false, BINDING.BOOLEAN],
		[
			'numberOfTurnPlus',
			'numberOfTurnPlus',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'numberOfTurnTimes',
			'numberOfTurnTimes',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isHeroesMonsters', 'isHeroesMonsters', false, BINDING.BOOLEAN],
		['isHeroes', 'isHeroes', true, BINDING.BOOLEAN],
		['conditionHeroesKind', 'conditionHeroesKind', CONDITION_HEROES_KIND.ALL_THE_HEROES, BINDING.NUMBER],
		[
			'heroInstanceID',
			'heroInstanceID',
			DynamicValue.create(DYNAMIC_VALUE_KIND.VARIABLE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isStatusID', 'isStatusID', false, BINDING.BOOLEAN],
		[
			'statusID',
			'statusID',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isStatisticID', 'isStatisticID', false, BINDING.BOOLEAN],
		[
			'statisticID',
			'statisticID',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['statisticOperationKind', 'statisticOperationKind', OPERATION_KIND.EQUAL_TO, BINDING.NUMBER],
		[
			'statisticCompare',
			'statisticCompare',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['statisticCompareUnit', 'statisticCompareUnit', true, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(TroopReactionConditions.getBindings(additionnalBinding));
	}

	copy(troopReactionConditions: TroopReactionConditions): void {
		super.copy(troopReactionConditions, TroopReactionConditions.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TroopReactionConditions.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TroopReactionConditions.getBindings(additionnalBinding));
	}
}

export { TroopReactionConditions };
