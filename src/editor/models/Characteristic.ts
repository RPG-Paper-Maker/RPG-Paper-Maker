/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { ReactNode } from 'react';
import {
	BINDING,
	BindingType,
	CHARACTERISTIC_KIND,
	DYNAMIC_VALUE_KIND,
	INCREASE_DECREASE_KIND,
	JSONType,
} from '../common';
import { Project } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

const { t } = i18next;

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

	toString(): string | ReactNode {
		let text = Base.STRING_START;
		switch (this.kind) {
			case CHARACTERISTIC_KIND.INCREASE_DECREASE:
				text += `${t(this.isIncreaseDecrease ? 'increase' : 'decrease')} ${
					Base.INCREASE_DECREASE_OPTIONS[this.increaseDecreaseKind].name
				} `;
				switch (this.increaseDecreaseKind) {
					case INCREASE_DECREASE_KIND.STAT_VALUE:
						text += this.statisticValueID.toString(Project.current!.battleSystem.statistics);
						break;
					case INCREASE_DECREASE_KIND.ELEMENT_RES:
						text += this.elementResID.toString(Project.current!.battleSystem.elements);
						break;
					case INCREASE_DECREASE_KIND.STATUS_RES:
						text += this.statusResID.toString(Project.current!.battleSystem.elements);
						break;
					case INCREASE_DECREASE_KIND.CURRENCY_GAIN:
						text += this.currencyGainID.toString(Project.current!.systems.currencies);
						break;
					case INCREASE_DECREASE_KIND.SKILL_COST:
						text += this.isAllSkillCost
							? `(${t('all').toLowerCase()})`
							: this.skillCostID.toString(Project.current!.skills.list);
						break;
					case INCREASE_DECREASE_KIND.VARIABLE:
						text += `${this.variableID}`;
						break;
					default:
						break;
				}
				text += ` ${this.operation ? '*' : '+'} ${this.value.toString()} ${this.unit ? '%' : ''}`;
				break;
			case CHARACTERISTIC_KIND.ALLOW_FORBID_EQUIP:
				text += `${t(this.isAllowEquip ? 'allow' : 'forbid')} ${t('equip').toLowerCase()} ${
					this.isAllowEquipWeapon
						? `${t('weapon.id').toLowerCase()} ${this.equipWeaponTypeID.toString(
								Project.current!.battleSystem.weaponsKind
						  )}`
						: `${t('armor.id').toLowerCase()} ${this.equipArmorTypeID.toString(
								Project.current!.battleSystem.armorsKind
						  )}`
				}`;
				break;
			case CHARACTERISTIC_KIND.ALLOW_FORBID_CHANGE:
				text += `${t(this.isAllowChangeEquipment ? 'allow' : 'forbid')} ${t(
					'change.equipment'
				).toLowerCase()} ${this.changeEquipmentID.toString(Project.current!.battleSystem.equipments)}`;
				break;
			case CHARACTERISTIC_KIND.BEGIN_EQUIPMENT:
				text += `${t('begin.equipment')} ${this.beginEquipmentID.toString(
					Project.current!.battleSystem.equipments
				)} ${t('with').toLowerCase()} ${
					this.isBeginWeapon ? t('weapon.id').toLowerCase() : t('armor.id').toLowerCase()
				} ${this.beginWeaponArmorID.toString(
					this.isBeginWeapon ? Project.current!.weapons.list : Project.current!.armors.list
				)}`;
				break;
			case CHARACTERISTIC_KIND.SCRIPT:
				text += `${t('script')}: ${this.script.toString()}`;
				break;
			case CHARACTERISTIC_KIND.ELEMENT:
				text += `${t('element.id')}: ${this.elementID.toString(Project.current!.battleSystem.elements)}`;
				break;
			default:
				break;
		}
		return text;
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
