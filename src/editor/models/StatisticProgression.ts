/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';
import { ProgressionTable } from './ProgressionTable';

class StatisticProgression extends Base {
	public maxValue!: DynamicValue;
	public isFix!: boolean;
	public table!: ProgressionTable;
	public random!: DynamicValue;
	public formula!: DynamicValue;

	public static bindings: BindingType[] = [
		['maxValue', 'm', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['isFix', 'if', undefined, BINDING.BOOLEAN],
		['table', 't', undefined, BINDING.OBJECT, ProgressionTable],
		['random', 'r', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['formula', 'f', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
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
