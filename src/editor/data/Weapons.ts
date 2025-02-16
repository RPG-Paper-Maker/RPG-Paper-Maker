/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING, BindingType, JSONType, Paths } from '../common';
import { Project, Serializable } from '../core';

class Weapons extends Serializable {
	public list!: Model.CommonSkillItem[];

	public static readonly bindings: BindingType[] = [
		['list', 'weapons', undefined, BINDING.LIST, Model.CommonSkillItem],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_WEAPONS);
	}

	getByID(id: number): Model.CommonSkillItem {
		return this.list.find((weapon) => weapon.id === id)!;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Weapons.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Weapons.getBindings(additionnalBinding));
	}
}

export { Weapons };
