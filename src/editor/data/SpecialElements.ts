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

class SpecialElements extends Serializable {
	public autotiles!: Model.Autotile[];
	public walls!: Model.SpecialElement[];
	public mountains!: Model.Mountain[];
	public objects3D!: Model.Object3D[];

	public static readonly bindings: BindingType[] = [
		['autotiles', 'autotiles', undefined, BINDING.LIST, Model.Autotile],
		['walls', 'walls', undefined, BINDING.LIST, Model.SpecialElement],
		['mountains', 'm', undefined, BINDING.LIST, Model.Mountain],
		['objects3D', 'o', undefined, BINDING.LIST, Model.Object3D],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...SpecialElements.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SPECIAL_ELEMENTS);
	}

	getAutotileByID(id: number): Model.Autotile {
		return this.autotiles.find((autotile) => autotile.id === id)!;
	}

	getWallByID(id: number): Model.SpecialElement {
		return this.walls.find((wall) => wall.id === id)!;
	}

	getMountainByID(id: number): Model.Mountain {
		return this.mountains.find((mountain) => mountain.id === id)!;
	}

	getObject3DByID(id: number): Model.Object3D {
		return this.objects3D.find((object) => object.id === id)!;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, SpecialElements.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, SpecialElements.getBindings(additionnalBinding));
	}
}

export { SpecialElements };
