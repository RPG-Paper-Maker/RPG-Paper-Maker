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

class Fonts extends Serializable {
	public list!: Model.Font[];
	public listIndexes!: number[];

	public static readonly bindings: BindingType[] = [
		['list', 'list', undefined, BINDING.LIST_WITH_INDEXES, Model.Font],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_FONTS);
	}

	getFontByID(id: number): Model.Font {
		return this.list[this.listIndexes[id]];
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Fonts.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Fonts.getBindings(additionnalBinding));
	}
}

export { Fonts };
