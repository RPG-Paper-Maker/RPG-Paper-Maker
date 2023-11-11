/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING, BindingType, Paths } from '../common';
import { Project, Serializable } from '../core';

class SpecialElements extends Serializable {
	public autotiles!: Model.Autotile[];
	public autotilesIndexes!: number[];
	public walls!: Model.SpecialElement[];
	public wallsIndexes!: number[];
	public mountains!: Model.Mountain[];
	public objects!: Model.Object3D[];

	public static readonly bindings: BindingType[] = [
		['autotiles', 'autotiles', undefined, BINDING.LIST_WITH_INDEXES, Model.Autotile],
		['walls', 'walls', undefined, BINDING.LIST_WITH_INDEXES, Model.SpecialElement],
		['mountains', 'm', undefined, BINDING.LIST, Model.Mountain],
		['objetcs', 'o', undefined, BINDING.LIST, Model.Object3D],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...SpecialElements.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SPECIAL_ELEMENTS);
	}

	getAutotileByID(id: number): Model.Autotile {
		return this.autotiles[this.autotilesIndexes[id]];
	}

	getWallByID(id: number): Model.SpecialElement {
		return this.walls[this.wallsIndexes[id]];
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, SpecialElements.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, SpecialElements.getBindings(additionnalBinding));
	}
}

export { SpecialElements };
