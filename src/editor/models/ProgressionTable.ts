/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType, KeyValue } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';

class ProgressionTable extends Base {
	public static selectedClassInitialLevel: number;
	public static selectedClassFinalLevel: number;

	public initialValue!: DynamicValue;
	public finalValue!: DynamicValue;
	public equation!: number;
	public table!: KeyValue[];

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

	getTableValues(initialLevel: number, finalLevel: number): string[][] {
		const start = this.initialValue.getFixNumberValue();
		const end = this.finalValue.getFixNumberValue();
		const change = end - start;
		const duration = finalLevel - initialLevel;
		const values: string[][] = new Array(duration + 1);
		for (let i = 0; i < finalLevel; i++) {
			const line = new Array(2);
			line[0] = '' + (initialLevel + i);
			let result: number;
			const tableValue = this.table.find(({ k }) => k === initialLevel + i);
			if (tableValue) {
				result = tableValue.v as number;
			} else {
				switch (this.equation) {
					case 0:
						result = this.easingLinear(i, change, duration, start);
						break;
					case -1:
						result = this.easingQuadraticIn(i, change, duration, start);
						break;
					case 1:
						result = this.easingQuadraticOut(i, change, duration, start);
						break;
					case -2:
						result = this.easingCubicIn(i, change, duration, start);
						break;
					case 2:
						result = this.easingCubicOut(i, change, duration, start);
						break;
					case -3:
						result = this.easingQuarticIn(i, change, duration, start);
						break;
					case 3:
						result = this.easingQuarticOut(i, change, duration, start);
						break;
					case -4:
						result = this.easingQuinticIn(i, change, duration, start);
						break;
					case 4:
						result = this.easingQuinticOut(i, change, duration, start);
						break;
					default:
						result = 0;
						break;
				}
				result = Math.floor(result);
			}
			line[1] = '' + result;
			values[i] = line;
		}
		return values;
	}

	easingLinear(x: number, change: number, duration: number, start: number): number {
		return (change * x) / duration + start;
	}

	easingQuadraticIn(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		return change * x * x + start;
	}

	easingQuadraticOut(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		return -change * x * (x - 2) + start;
	}

	easingCubicIn(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		return change * x * x * x + start;
	}

	easingCubicOut(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		x--;
		return change * (x * x * x + 1) + start;
	}

	easingQuarticIn(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		return change * x * x * x * x + start;
	}

	easingQuarticOut(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		x--;
		return -change * (x * x * x * x - 1) + start;
	}

	easingQuinticIn(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		return change * x * x * x * x * x + start;
	}

	easingQuinticOut(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		x--;
		return change * (x * x * x * x * x + 1) + start;
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
