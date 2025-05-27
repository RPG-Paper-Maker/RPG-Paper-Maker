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
import { Project } from '../core/Project';
import { Serializable } from '../core/Serializable';

class Monsters extends Serializable {
	public list!: Model.Monster[];

	public static readonly bindings: BindingType[] = [['list', 'monsters', undefined, BINDING.LIST, Model.Monster]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_MONSTERS);
	}

	getByID(id: number): Model.Monster {
		return this.list.find((monster) => monster.id === id)!;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Monsters.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Monsters.getBindings(additionnalBinding));
	}
}

export { Monsters };
