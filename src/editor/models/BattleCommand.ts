/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Project } from '../core';
import { Base } from './Base';

class BattleCommand extends Base {
	public skillID!: number;

	public static bindings: BindingType[] = [['skillID', 's', undefined, BINDING.NUMBER]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(BattleCommand.getBindings([]));
		this.skillID = 1;
	}

	getName(): string {
		return Base.getByID(Project.current!.skills.list, this.skillID)?.getName() || '';
	}

	copy(battleCommand: BattleCommand, additionnalBinding: BindingType[] = []): void {
		super.copy(battleCommand, BattleCommand.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, BattleCommand.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, BattleCommand.getBindings(additionnalBinding));
	}
}

export { BattleCommand };
