/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {
	BINDING,
	BindingType,
	DYNAMIC_VALUE_KIND,
	JSONType,
	MONSTER_ACTION_KIND,
	MONSTER_ACTION_TARGET_KIND,
	OPERATION_KIND,
} from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class MonsterAction extends Base {
	public actionKind!: number;
	public skillID!: DynamicValue;
	public itemID!: DynamicValue;
	public itemNumberMax!: DynamicValue;
	public priority!: DynamicValue;
	public targetKind!: number;
	public isConditionTurn!: boolean;
	public operationKindTurn!: number;
	public turnValueCompare!: DynamicValue;
	public isConditionStatistic!: boolean;
	public statisticID!: DynamicValue;
	public operationKindStatistic!: number;
	public statisticValueCompare!: DynamicValue;
	public isConditionVariable!: boolean;
	public variableID!: number;
	public operationKindVariable!: number;
	public variableValueCompare!: DynamicValue;
	public isConditionStatus!: boolean;
	public statusID!: DynamicValue;
	public isConditionScript!: boolean;
	public script!: DynamicValue;

	public static bindings: BindingType[] = [
		[' actionKind', 'ak', MONSTER_ACTION_KIND.DO_NOTHING, BINDING.NUMBER],
		[' skillID', 'sid', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		[' itemID', 'iid', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		[
			' itemNumberMax',
			'inm',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[' priority', 'p', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 10), BINDING.DYNAMIC_VALUE, DynamicValue],
		[' targetKind', 'tk', MONSTER_ACTION_TARGET_KIND.RANDOM, BINDING.NUMBER],
		[' isConditionTurn', 'ict', false, BINDING.BOOLEAN],
		[' operationKindTurn', 'okt', OPERATION_KIND.EQUAL_TO, BINDING.NUMBER],
		[
			' turnValueCompare',
			'tvc',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[' isConditionStatistic', 'ics', false, BINDING.BOOLEAN],
		[
			' statisticID',
			'stid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[' operationKindStatistic', 'oks', OPERATION_KIND.EQUAL_TO, BINDING.NUMBER],
		[
			' statisticValueCompare',
			'svc',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[' isConditionVariable', 'icv', false, BINDING.BOOLEAN],
		[' variableID', 'vid', 1, BINDING.NUMBER],
		[' operationKindVariable', 'okv', OPERATION_KIND.EQUAL_TO, BINDING.NUMBER],
		[
			' variableValueCompare',
			'vvc',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[' isConditionStatus', 'icst', false, BINDING.BOOLEAN],
		[' statusID', 'stsid', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0), BINDING.DYNAMIC_VALUE, DynamicValue],
		[' isConditionScript', 'icsc', false, BINDING.BOOLEAN],
		[' script', 's', DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, ''), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(monsterAction: MonsterAction): void {
		super.copy(monsterAction, MonsterAction.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MonsterAction.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MonsterAction.getBindings(additionnalBinding));
	}
}

export { MonsterAction };
