/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, BindingType, DAMAGES_KIND, DYNAMIC_VALUE_KIND, ITERATOR, JSONType } from '../common';
import DialogCost from '../components/dialogs/models/DialogCost';
import { Project } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import { Base, DIALOG_OPTIONS } from './Base';
import { MapObjectCommandType } from './MapObjectCommand';

class Cost extends Base {
	public kind!: DAMAGES_KIND;
	public statisticID!: DynamicValue;
	public currencyID!: DynamicValue;
	public variableID!: number;
	public valueFormula!: DynamicValue;

	public static bindings: BindingType[] = [
		['kind', 'k', DAMAGES_KIND.STAT, BINDING.NUMBER],
		[
			'statisticID',
			'sid',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['currencyID', 'cid', DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		['variableID', 'vid', 1, BINDING.NUMBER],
		[
			'valueFormula',
			'vf',
			DynamicValue.create(DYNAMIC_VALUE_KIND.FORMULA, ''),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static toStringMultiple(costs: Cost[]) {
		const list: string[] = [];
		for (const cost of costs) {
			list.push(cost.toString());
		}
		return list.join(' + ');
	}

	applyDefault() {
		super.applyDefault(Cost.getBindings([]));
	}

	initialize(list: MapObjectCommandType[], iterator: ITERATOR) {
		this.kind = list[iterator.i++] as DAMAGES_KIND;
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				this.statisticID = DynamicValue.createCommand(list, iterator);
				break;
			case DAMAGES_KIND.CURRENCY:
				this.currencyID = DynamicValue.createCommand(list, iterator);
				break;
			case DAMAGES_KIND.VARIABLE:
				this.variableID = list[iterator.i++] as number;
				break;
		}
		this.valueFormula = DynamicValue.createCommand(list, iterator);
	}

	getCommand(newList: MapObjectCommandType[]) {
		newList.push(this.kind);
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				this.statisticID.getCommand(newList);
				break;
			case DAMAGES_KIND.CURRENCY:
				this.currencyID.getCommand(newList);
				break;
			case DAMAGES_KIND.VARIABLE:
				newList.push(this.variableID);
				break;
		}
		this.valueFormula.getCommand(newList);
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogCost {...options} />;
	}

	toString(): string {
		let str = '';
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				str += this.statisticID.toString(Project.current!.battleSystem.statistics);
				break;
			case DAMAGES_KIND.CURRENCY:
				str += this.currencyID.toString(Project.current!.systems.currencies);
				break;
			case DAMAGES_KIND.VARIABLE:
				str += Project.current!.variables.getVariableByID(this.variableID)?.toString() ?? this.variableID;
				break;
		}
		str += `: ${this.valueFormula.toString()}`;
		return str;
	}

	copy(cost: Cost): void {
		super.copy(cost, Cost.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Cost.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Cost.getBindings(additionnalBinding));
	}
}

export { Cost };
