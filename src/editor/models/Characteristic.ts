/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {
	BINDING,
	BindingType,
	CHARACTERISTIC_KIND,
	DYNAMIC_VALUE_KIND,
	INCREASE_DECREASE_KIND,
	JSONType,
} from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class Characteristic extends Base {
	public kind!: CHARACTERISTIC_KIND;
	public isIncreaseDecrease!: boolean;
	public increaseDecreaseKind!: number;
	public statisticValueID!: DynamicValue;
	public elementResID!: DynamicValue;
	public statusResID!: DynamicValue;
	public currencyGainID!: DynamicValue;
	public skillCostID!: DynamicValue;
	public isAllSkillCost!: boolean;
	public variableID!: number;
	public operation!: boolean;
	public value!: DynamicValue;
	public unit!: boolean;
	public script!: DynamicValue;
	public isAllowEquip!: boolean;
	public isAllowEquipWeapon!: boolean;
	public equipWeaponTypeID!: DynamicValue;
	public equipArmorTypeID!: DynamicValue;
	public isAllowChangeEquipment!: boolean;
	public changeEquipmentID!: DynamicValue;
	public beginEquipmentID!: DynamicValue;
	public isBeginWeapon!: boolean;
	public beginWeaponArmorID!: DynamicValue;
	public elementID!: DynamicValue;

	public static bindings: BindingType[] = [
		['kind', 'k', CHARACTERISTIC_KIND.INCREASE_DECREASE, BINDING.NUMBER],
		['isIncreaseDecrease', 'iid', true, BINDING.BOOLEAN],
		['increaseDecreaseKind', 'idk', INCREASE_DECREASE_KIND.STAT_VALUE, BINDING.NUMBER],
		[
			'statisticValueID',
			'svid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'elementResID',
			'erid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'statusResID',
			'strid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'currencyGainID',
			'cgid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'skillCostID',
			'scid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isAllSkillCost', 'iasc', true, BINDING.BOOLEAN],
		['variableID', 'vid', 1, BINDING.NUMBER],
		['operation', 'o', true, BINDING.BOOLEAN],
		['value', 'v', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0), BINDING.DYNAMIC_VALUE, DynamicValue],
		['unit', 'u', true, BINDING.BOOLEAN],
		['script', 's', DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, ''), BINDING.DYNAMIC_VALUE, DynamicValue],
		['isAllowEquip', 'iae', true, BINDING.BOOLEAN],
		['isAllowEquipWeapon', 'iaew', true, BINDING.BOOLEAN],
		[
			'equipWeaponTypeID',
			'ewtid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'equipArmorTypeID',
			'eatid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isAllowChangeEquipment', 'iace', true, BINDING.BOOLEAN],
		[
			'changeEquipmentID',
			'ceid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'beginEquipmentID',
			'beid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isBeginWeapon', 'ibw', true, BINDING.BOOLEAN],
		[
			'beginWeaponArmorID',
			'bwaid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['elementID', 'eid', DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(characteristic: Characteristic): void {
		super.copy(characteristic, Characteristic.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Characteristic.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Characteristic.getBindings(additionnalBinding));
	}
}

export { Characteristic };
