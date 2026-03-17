/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

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
	} /*(int e, double x, double start, double
    change, double duration)*/

	static easing(
		equation: number,
		x: number,
		change: number,
		duration: number,
		start: number,
		decimal = false,
	): number {
		let result = 0;
		switch (equation) {
			case 0:
				result = this.easingLinear(x, change, duration, start);
				break;
			case -1:
				result = this.easingQuadraticIn(x, change, duration, start);
				break;
			case 1:
				result = this.easingQuadraticOut(x, change, duration, start);
				break;
			case -2:
				result = this.easingCubicIn(x, change, duration, start);
				break;
			case 2:
				result = this.easingCubicOut(x, change, duration, start);
				break;
			case -3:
				result = this.easingQuarticIn(x, change, duration, start);
				break;
			case 3:
				result = this.easingQuarticOut(x, change, duration, start);
				break;
			case -4:
				result = this.easingQuinticIn(x, change, duration, start);
				break;
			case 4:
				result = this.easingQuinticOut(x, change, duration, start);
				break;
			default:
				result = 0;
		}
		if (!decimal) {
			result = Math.floor(result);
		}
		return result;
	}

	static easingLinear(x: number, change: number, duration: number, start: number): number {
		return (change * x) / duration + start;
	}

	static easingQuadraticIn(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		return change * x * x + start;
	}

	static easingQuadraticOut(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		return -change * x * (x - 2) + start;
	}

	static easingCubicIn(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		return change * x * x * x + start;
	}

	static easingCubicOut(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		x--;
		return change * (x * x * x + 1) + start;
	}

	static easingQuarticIn(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		return change * x * x * x * x + start;
	}

	static easingQuarticOut(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		x--;
		return -change * (x * x * x * x - 1) + start;
	}

	static easingQuinticIn(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		return change * x * x * x * x * x + start;
	}

	static easingQuinticOut(x: number, change: number, duration: number, start: number): number {
		x /= duration;
		x--;
		return change * (x * x * x * x * x + 1) + start;
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
				result = ProgressionTable.easing(this.equation, i, change, duration, start);
			}
			line[1] = '' + result;
			values[i] = line;
		}
		return values;
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
