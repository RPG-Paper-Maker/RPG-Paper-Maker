/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, DYNAMIC_VALUE_KIND, GROUP_KIND, JSONType } from '../common';
import { Project } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class InitialPartyMember extends Base {
	public level!: DynamicValue;
	public teamKind!: GROUP_KIND;
	public isHero!: boolean;
	public heroID!: DynamicValue;
	public variableInstanceID!: DynamicValue;

	public static bindings: BindingType[] = [
		['level', 'level', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		['teamKind', 'teamKind', GROUP_KIND.TEAM, BINDING.NUMBER],
		['isHero', 'isHero', true, BINDING.BOOLEAN],
		[
			'variableInstanceID',
			'variableInstanceID',
			DynamicValue.create(DYNAMIC_VALUE_KIND.VARIABLE, 1),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(InitialPartyMember.getBindings([]));
		this.heroID = DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1);
	}

	toString(): string {
		return this.heroID.toString((this.isHero ? Project.current!.heroes : Project.current!.monsters).list);
	}

	copy(initialPartyMember: InitialPartyMember): void {
		super.copy(initialPartyMember, InitialPartyMember.getBindings([]));
		this.heroID = initialPartyMember.heroID.clone();
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, InitialPartyMember.getBindings(additionnalBinding));
		const jsonHero = (this.isHero ? json.heroID : json.monsterID) as JSONType;
		if (jsonHero === undefined) {
			this.heroID = DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1);
		} else {
			this.heroID.read(jsonHero);
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, InitialPartyMember.getBindings(additionnalBinding));
		const obj = {};
		if (this.heroID.kind !== DYNAMIC_VALUE_KIND.DATABASE || this.heroID.value !== 1) {
			this.heroID.write(obj);
			if (this.isHero) {
				json.heroID = obj;
			} else {
				json.monsterID = obj;
			}
		}
	}
}

export { InitialPartyMember };
