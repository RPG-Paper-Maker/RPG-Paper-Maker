/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, ITEM_KIND, JSONType } from '../common';
import DialogMonsterLoot from '../components/dialogs/models/DialogMonsterLoot';
import { DynamicValue } from '../core/DynamicValue';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

class MonsterLoot extends Base {
	public kind!: ITEM_KIND;
	public lootID!: DynamicValue;
	public number!: DynamicValue;
	public probability!: DynamicValue;
	public initial!: DynamicValue;
	public final!: DynamicValue;

	public static bindings: BindingType[] = [
		['kind', 'k', undefined, BINDING.NUMBER],
		['lootID', 'lid', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['number', 'n', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['probability', 'p', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['initial', 'i', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
		['final', 'f', undefined, BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['name', 'number', 'probability', 'initial', 'final'];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(MonsterLoot.getBindings(additionnalBinding));
	}

	getDatabase(): Base[] {
		switch (this.kind) {
			case ITEM_KIND.ITEM:
				return Project.current!.items.list;
			case ITEM_KIND.WEAPON:
				return Project.current!.weapons.list;
			case ITEM_KIND.ARMOR:
				return Project.current!.armors.list;
		}
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogMonsterLoot {...options} />;
	}

	toStrings(): string[] {
		return [
			Base.STRING_START + this.lootID.toString(this.getDatabase()),
			this.number.toString(),
			this.probability.toString(),
			this.initial.toString(),
			this.final.toString(),
		];
	}

	copy(loot: MonsterLoot): void {
		super.copy(loot, MonsterLoot.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MonsterLoot.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MonsterLoot.getBindings(additionnalBinding));
	}
}

export { MonsterLoot };
