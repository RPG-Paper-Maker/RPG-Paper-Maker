/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import { Project } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';
import { ProgressionTable } from './ProgressionTable';

class StatisticProgression extends Base {
	public static selectedClassInitialLevel: number;
	public static selectedClassFinalLevel: number;
	public maxValue!: DynamicValue;
	public isFix!: boolean;
	public table!: ProgressionTable;
	public random!: DynamicValue;
	public formula!: DynamicValue;

	public static bindings: BindingType[] = [
		['maxValue', 'm', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['isFix', 'if', undefined, BINDING.BOOLEAN],
		[
			'table',
			't',
			ProgressionTable.createProgression(
				DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1),
				DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1),
				0
			),
			BINDING.OBJECT,
			ProgressionTable,
		],
		['random', 'r', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0), BINDING.DYNAMIC_VALUE, DynamicValue],
		['formula', 'f', DynamicValue.create(DYNAMIC_VALUE_KIND.FORMULA, ''), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['statistic', 'initial', 'final'];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(StatisticProgression.getBindings(additionnalBinding));
		this.id = 1;
		this.maxValue = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0);
		this.isFix = true;
	}

	getName(): string {
		return Project.current!.battleSystem.getStatisticByID(this.id)?.getName() ?? '';
	}

	toStrings(): string[] {
		return [
			'' + this.toString(),
			this.isFix ? this.table.initialValue.toString() : '-',
			this.isFix ? this.table.finalValue.toString() : '-',
		];
	}

	copy(statisticProgression: StatisticProgression): void {
		super.copy(statisticProgression, StatisticProgression.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, StatisticProgression.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, StatisticProgression.getBindings(additionnalBinding));
	}
}

export { StatisticProgression };
