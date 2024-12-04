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
	DAMAGES_KIND,
	DYNAMIC_VALUE_KIND,
	EFFECT_KIND,
	EFFECT_SPECIAL_ACTION_KIND,
	JSONType,
} from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class Effect extends Base {
	public kind!: EFFECT_KIND;
	public damageKind!: DAMAGES_KIND;
	public damageStatisticID!: DynamicValue;
	public damageCurrencyID!: DynamicValue;
	public damageVariableID!: number;
	public damageFormula!: DynamicValue;
	public isDamagesMinimum!: boolean;
	public damagesMinimumFormula!: DynamicValue;
	public isDamagesMaximum!: boolean;
	public damagesMaximumFormula!: DynamicValue;
	public isDamageElement!: boolean;
	public damageElementID!: DynamicValue;
	public isDamageVariance!: boolean;
	public damageVarianceFormula!: DynamicValue;
	public isDamageCritical!: boolean;
	public damageCriticalFormula!: DynamicValue;
	public isDamagePrecision!: boolean;
	public damagePrecisionFormula!: DynamicValue;
	public isDamageStockVariableID!: boolean;
	public damageStockVariableID!: number;
	public isDamageDisplayName!: boolean;
	public isAddStatus!: boolean;
	public statusID!: DynamicValue;
	public statusPrecisionFormula!: DynamicValue;
	public isAddSkill!: boolean;
	public addSkillID!: DynamicValue;
	public performSkillID!: DynamicValue;
	//public commonReaction!: EventCommand.CallACommonReaction; // TODO
	public specialActionKind!: EFFECT_SPECIAL_ACTION_KIND;
	public scriptFormula!: DynamicValue;
	public isTemporarilyChangeTarget!: boolean;
	public temporarilyChangeTargetFormula!: DynamicValue;

	public static bindings: BindingType[] = [
		['kind', 'k', EFFECT_KIND.DAMAGES, BINDING.NUMBER],
		['damageKind', 'dk', DAMAGES_KIND.STAT, BINDING.NUMBER],
		[
			'damageStatisticID',
			'dsid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'damageCurrencyID',
			'dcid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['damageVariableID', 'dvid', 1, BINDING.NUMBER],
		['damageFormula', 'df', DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, ''), BINDING.DYNAMIC_VALUE, DynamicValue],
		['isDamagesMinimum', 'idmin', true, BINDING.BOOLEAN],
		[
			'damagesMinimumFormula',
			'dmin',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, '0'),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isDamagesMaximum', 'idmax', false, BINDING.BOOLEAN],
		[
			'damagesMaximumFormula',
			'dmax',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, '0'),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isDamageElement', 'ide', false, BINDING.BOOLEAN],
		[
			'damageElementID',
			'deid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isDamageVariance', 'idv', false, BINDING.BOOLEAN],
		[
			'damageVarianceFormula',
			'dvf',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, '0'),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isDamageCritical', 'idc', false, BINDING.BOOLEAN],
		[
			'damageCriticalFormula',
			'dcf',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, '0'),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isDamagePrecision', 'idp', false, BINDING.BOOLEAN],
		[
			'damagePrecisionFormula',
			'dpf',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, '100'),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isDamageStockVariableID', 'idsv', false, BINDING.BOOLEAN],
		['damageStockVariableID', 'dsv', 1, BINDING.NUMBER],
		['isDamageDisplayName', 'iddn', false, BINDING.BOOLEAN],
		['isAddStatus', 'iast', true, BINDING.BOOLEAN],
		['statusID', 'sid', DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		[
			'statusPrecisionFormula',
			'spf',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, '100'),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isAddSkill', 'iask', true, BINDING.BOOLEAN],
		[
			'addSkillID',
			'asid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'performSkillID',
			'psid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		//['commonReaction', '', undefined, BINDING.OBJECT], // TODO
		['specialActionKind', 'sak', EFFECT_SPECIAL_ACTION_KIND.APPLY_WEAPONS, BINDING.NUMBER],
		['scriptFormula', 'sf', DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, ''), BINDING.DYNAMIC_VALUE, DynamicValue],
		['isTemporarilyChangeTarget', 'itct', false, BINDING.BOOLEAN],
		[
			'temporarilyChangeTargetFormula',
			'tctf',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, ''),
			BINDING.DYNAMIC_VALUE,
		],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(effect: Effect): void {
		super.copy(effect, Effect.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Effect.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Effect.getBindings(additionnalBinding));
	}
}

export { Effect };
