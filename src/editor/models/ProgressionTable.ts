/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONMapping, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class ProgressionTable extends Base {
	public initialValue!: DynamicValue;
	public finalValue!: DynamicValue;
	public equation!: number;
	public table!: JSONMapping[];

	public static bindings: BindingType[] = [
		['initialValue', 'i', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['finalValue', 'f', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['equation', 'e', undefined, BINDING.NUMBER],
		['table', 't', [], BINDING.LIST_NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static createProgression(i: DynamicValue, f: DynamicValue, e: number): ProgressionTable {
		const progressionTable = new ProgressionTable();
		progressionTable.applyDefault();
		progressionTable.initialValue = i;
		progressionTable.finalValue = f;
		progressionTable.equation = e;
		return progressionTable;
	}

	applyDefault(): void {
		super.applyDefault(ProgressionTable.getBindings([]));
	}

	copy(progressionTable: ProgressionTable): void {
		super.copy(progressionTable, ProgressionTable.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, ProgressionTable.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, ProgressionTable.getBindings(additionnalBinding));
	}
}

export { ProgressionTable };
