/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Base } from './Base';

class ClassSkill extends Base {
	public level!: number;

	public static bindings: BindingType[] = [['level', 'l', undefined, BINDING.NUMBER]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(classSkill: ClassSkill): void {
		super.copy(classSkill, ClassSkill.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, ClassSkill.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, ClassSkill.getBindings(additionnalBinding));
	}
}

export { ClassSkill };
