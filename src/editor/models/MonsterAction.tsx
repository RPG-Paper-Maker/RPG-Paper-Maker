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
	DYNAMIC_VALUE_KIND,
	JSONType,
	MONSTER_ACTION_KIND,
	MONSTER_ACTION_TARGET_KIND,
	OPERATION_KIND,
} from '../common';
import DialogMonsterAction from '../components/dialogs/models/DialogMonsterAction';
import { Project } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import { Base, DIALOG_OPTIONS } from './Base';

const { t } = i18next;

class MonsterAction extends Base {
	public static selectedMonsterActions: MonsterAction[] = [];

	public actionKind!: MONSTER_ACTION_KIND;
	public skillID!: DynamicValue;
	public itemID!: DynamicValue;
	public itemNumberMax!: DynamicValue;
	public priority!: DynamicValue;
	public targetKind!: MONSTER_ACTION_TARGET_KIND;
	public isConditionTurn!: boolean;
	public operationKindTurn!: OPERATION_KIND;
	public turnValueCompare!: DynamicValue;
	public isConditionStatistic!: boolean;
	public statisticID!: DynamicValue;
	public operationKindStatistic!: OPERATION_KIND;
	public statisticValueCompare!: DynamicValue;
	public isConditionVariable!: boolean;
	public variableID!: number;
	public operationKindVariable!: OPERATION_KIND;
	public variableValueCompare!: DynamicValue;
	public isConditionStatus!: boolean;
	public statusID!: DynamicValue;
	public isConditionScript!: boolean;
	public script!: DynamicValue;
	public isCurrent = false;

	public static bindings: BindingType[] = [
		['actionKind', 'ak', MONSTER_ACTION_KIND.DO_NOTHING, BINDING.NUMBER],
		['skillID', 'sid', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		['itemID', 'iid', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		[
			'itemNumberMax',
			'inm',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['priority', 'p', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 10), BINDING.DYNAMIC_VALUE, DynamicValue],
		['targetKind', 'tk', MONSTER_ACTION_TARGET_KIND.RANDOM, BINDING.NUMBER],
		['isConditionTurn', 'ict', false, BINDING.BOOLEAN],
		['operationKindTurn', 'okt', OPERATION_KIND.EQUAL_TO, BINDING.NUMBER],
		[
			'turnValueCompare',
			'tvc',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isConditionStatistic', 'ics', false, BINDING.BOOLEAN],
		[
			'statisticID',
			'stid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['operationKindStatistic', 'oks', OPERATION_KIND.EQUAL_TO, BINDING.NUMBER],
		[
			'statisticValueCompare',
			'svc',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isConditionVariable', 'icv', false, BINDING.BOOLEAN],
		['variableID', 'vid', 1, BINDING.NUMBER],
		['operationKindVariable', 'okv', OPERATION_KIND.EQUAL_TO, BINDING.NUMBER],
		[
			'variableValueCompare',
			'vvc',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isConditionStatus', 'icst', false, BINDING.BOOLEAN],
		['statusID', 'stsid', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0), BINDING.DYNAMIC_VALUE, DynamicValue],
		['isConditionScript', 'icsc', false, BINDING.BOOLEAN],
		['script', 's', DynamicValue.create(DYNAMIC_VALUE_KIND.FORMULA, ''), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['action', 'conditions', 'priority', 'probability'];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(MonsterAction.getBindings(additionnalBinding));
	}

	getProbability(p?: number): string {
		this.isCurrent = true;
		let priority = p ?? 0;
		let sum = 0;
		for (const action of MonsterAction.selectedMonsterActions) {
			const currentPriority = action.priority.getFixNumberValue();
			if (p === undefined && action.isCurrent) {
				priority = currentPriority;
			}
			sum += p !== undefined && action.isCurrent ? p : currentPriority;
		}
		this.isCurrent = false;
		return `${(sum === 0 ? 0 : (priority / sum) * 100).toFixed(2)}%`;
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogMonsterAction {...options} />;
	}

	toStringAction(): string {
		switch (this.actionKind) {
			case MONSTER_ACTION_KIND.USE_SKILL:
				return `${t('use.skill.id')} ${this.skillID.toString(Project.current!.skills.list)}`;
			case MONSTER_ACTION_KIND.USE_ITEM:
				return `${t('use.item.id')} ${this.itemID.toString(Project.current!.items.list)} ${t(
					'number.max'
				).toLowerCase()} ${this.itemNumberMax.toString()}`;
			case MONSTER_ACTION_KIND.DO_NOTHING:
				return t('do.nothing');
		}
	}

	toStringConditions(): string {
		const conditions: string[] = [];
		if (this.isConditionTurn) {
			conditions.push(
				`${t('turn.value.is')} ${
					Base.getCompareOptions()[this.operationKindTurn].name
				} ${this.turnValueCompare.toString()}`
			);
		}
		if (this.isConditionStatistic) {
			conditions.push(
				`${t('statistic.id')} ${this.statisticID.toString(Project.current!.battleSystem.statistics)} ${t(
					'value.is'
				).toLowerCase()} ${Base.getCompareOptions()[
					this.operationKindStatistic
				].name.toLowerCase()} ${this.statisticValueCompare.toString()}%`
			);
		}
		if (this.isConditionVariable) {
			conditions.push(
				`${t('variable')} ${
					Project.current!.variables.getVariableByID(this.variableID)?.toString() ?? this.variableID
				} ${t('value.is').toLowerCase()} ${Base.getCompareOptions()[
					this.operationKindVariable
				].name.toLowerCase()} ${this.statisticValueCompare.toString()}`
			);
		}
		if (this.isConditionStatus) {
			conditions.push(
				`${t('is.under.effect.of.status.id')} ${this.statusID.toString(Project.current!.status.list)}`
			);
		}
		if (this.isConditionScript) {
			conditions.push(`${t('script')}: ${this.script.toString()}`);
		}
		return conditions.length === 0 ? '-' : conditions.join(' | ');
	}

	toStrings(): string[] {
		return [
			Base.STRING_START + this.toStringAction(),
			this.toStringConditions(),
			this.priority.toString(),
			this.getProbability(),
		];
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
