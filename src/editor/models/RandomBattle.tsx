/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { ArrayUtils, BINDING, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import DialogRandomBattle from '../components/dialogs/models/DialogRandomBattle';
import { DynamicValue } from '../core/DynamicValue';
import { Node } from '../core/Node';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';
import { DynamicNumber } from './DynamicNumber';

class RandomBattle extends Base {
	public static currentList: Node[] = [];

	public troopID!: DynamicValue;
	public priority!: DynamicValue;
	public isEntireMap!: boolean;
	public terrains!: DynamicNumber[];

	public static bindings: BindingType[] = [
		[
			'troopID',
			'troopID',
			DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'priority',
			'priority',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 10),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isEntireMap', 'isEntireMap', true, BINDING.BOOLEAN],
		['terrains', 'terrains', [], BINDING.LIST, DynamicNumber],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['troop', 'terrain', 'priority', 'probability'];
	}

	applyDefault() {
		super.applyDefault(RandomBattle.getBindings([]));
	}

	getProbability(): string {
		let sum = 0;
		const list = RandomBattle.currentList.map((node) => node.clone());
		const current = list.find((node) => node.content.id === this.id);
		if (list.find((node) => node.content.id === this.id)) {
			ArrayUtils.removeElement(list, current);
		}
		list.push(Node.create(this));
		const priorities = list.map((node) =>
			(node.content as RandomBattle).priority.isFixNumberValue()
				? ((node.content as RandomBattle).priority.value as number)
				: undefined,
		);
		for (const priority of priorities) {
			if (priority === undefined) {
				return '?';
			} else {
				sum += priority;
			}
		}
		return ((this.priority.getFixNumberValue() / sum) * 100).toFixed(2);
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogRandomBattle {...options} />;
	}

	toStrings(): string[] {
		return [
			Base.STRING_START + this.troopID.toString(Project.current!.troops.list),
			this.terrains.map((terrain) => terrain.value.toString()).join(','),
			this.priority.toString(),
			this.getProbability(),
		];
	}

	copy(randomBattle: RandomBattle): void {
		super.copy(randomBattle, RandomBattle.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, RandomBattle.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, RandomBattle.getBindings(additionnalBinding));
	}
}

export { RandomBattle };
