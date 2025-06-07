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
	DAMAGES_KIND,
	DYNAMIC_VALUE_KIND,
	EFFECT_KIND,
	EFFECT_SPECIAL_ACTION_KIND,
	JSONType,
	Utils,
} from '../common';
import DialogEffect from '../components/dialogs/models/DialogEffect';
import { DynamicValue } from '../core/DynamicValue';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';
import { MapObjectCommand } from './MapObjectCommand';

const { t } = i18next;

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
	public commonReaction!: MapObjectCommand | null;
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
		['commonReaction', 'cr', null, BINDING.OBJECT, MapObjectCommand],
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

	applyDefault() {
		super.applyDefault(Effect.getBindings([]));
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogEffect {...options} />;
	}

	toString(): string | ReactNode {
		let text = Base.STRING_START;
		switch (this.kind) {
			case EFFECT_KIND.DAMAGES: {
				text += `${t('damages.on')} ${Base.DAMAGE_KIND_OPTIONS[this.damageKind].name} `;
				switch (this.damageKind) {
					case DAMAGES_KIND.STAT:
						text += this.damageStatisticID.toString(Project.current!.battleSystem.statistics);
						break;
					case DAMAGES_KIND.CURRENCY:
						text += this.damageCurrencyID.toString(Project.current!.systems.currencies);
						break;
					case DAMAGES_KIND.VARIABLE:
						text += `${t('variable.id')} ${this.damageVariableID}`;
						break;
				}
				text += ` ${t('with').toLowerCase()} ${this.damageFormula.toString()}`;
				const options = [];
				if (this.isDamagesMinimum) {
					options.push(`${t('minimum')}: ${this.damagesMinimumFormula.toString()}`);
				}
				if (this.isDamagesMaximum) {
					options.push(`${t('maximum')}: ${this.damagesMaximumFormula.toString()}`);
				}
				if (this.isDamageElement) {
					options.push(
						`${t('element.id')}: ${this.damageElementID.toString(Project.current!.battleSystem.elements)}`
					);
				}
				if (this.isDamageVariance) {
					options.push(`${t('variance')}: ${this.damageVarianceFormula.toString()}%`);
				}
				if (this.isDamageCritical) {
					options.push(`${t('critical')}: ${this.damageCriticalFormula.toString()}%`);
				}
				if (this.isDamagePrecision) {
					options.push(`${t('precision')}: ${this.damagePrecisionFormula.toString()}%`);
				}
				if (this.isDamageStockVariableID) {
					options.push(`${t('stock.value.in')}: ${'variable.id'} ${this.damageVariableID}`);
				}
				if (this.isDamageDisplayName) {
					options.push(t('display.damage.type.name'));
				}
				if (options.length > 0) {
					text += ` [${options.join(', ')}]`;
				}
				break;
			}
			case EFFECT_KIND.STATUS:
				text += `${t(this.isAddStatus ? 'add' : 'remove')} ${t('status.id')} ${this.statusID.toString(
					Project.current!.status.list
				)} ${t('with.precision').toLowerCase()} ${this.statusPrecisionFormula.toString()}%`;
				break;
			case EFFECT_KIND.ADD_REMOVE_SKILL:
				text += `${t(this.isAddStatus ? 'add' : 'remove')} ${t('skill.id')} ${this.addSkillID.toString(
					Project.current!.skills.list
				)}`;
				break;
			case EFFECT_KIND.PERFORM_SKILL:
				text += `${t('perform.skill')} ${this.performSkillID.toString(Project.current!.skills.list)}`;
				break;
			case EFFECT_KIND.COMMON_REACTION:
				if (this.commonReaction) {
					const iterator = Utils.generateIterator();
					text += `${t('call.a.common.reaction')}: ${this.commonReaction.toStringCallACommonReaction(
						iterator
					)}`;
				}
				break;
			case EFFECT_KIND.SPECIAL_ACTIONS:
				text += `${t('special.action')}: ${Base.EFFECT_SPECIAL_ACTION_OPTIONS[this.specialActionKind].name}`;
				break;
			case EFFECT_KIND.SCRIPT:
				text += `${t('script')}: ${this.scriptFormula.toString()}`;
				break;
		}
		if (this.isTemporarilyChangeTarget) {
			text += ` [${t('temporarily.change.target')}: ${this.temporarilyChangeTargetFormula.toString()}]`;
		}
		return text;
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
