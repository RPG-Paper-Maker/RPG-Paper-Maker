/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING } from '../common/Enum';
import { Paths } from '../common/Paths';
import { BindingType } from '../common/Types';
import { Project } from '../core/Project';
import { Serializable } from '../core/Serializable';
import { TextureBundle } from '../core/TextureBundle';

class SpecialElements extends Serializable {
	public autotiles!: Model.Autotile[];
	public walls!: Model.SpecialElement[];
	public mountains!: Model.Mountain[];
	public objects!: Model.Object3D[];
	public texturesAutotiles: TextureBundle[][] = [];
	public texturesWalls: THREE.MeshPhongMaterial[] = [];
	public texturesObjects3D: THREE.MeshPhongMaterial[] = [];
	public texturesMountains: TextureBundle[] = [];

	public static readonly bindings: BindingType[] = [
		['autotiles', 'autotiles', undefined, BINDING.LIST, Model.Autotile],
		['walls', 'walls', undefined, BINDING.LIST, Model.SpecialElement],
		['mountains', 'm', undefined, BINDING.LIST, Model.Mountain],
		['objetcs', 'o', undefined, BINDING.LIST, Model.Object3D],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...SpecialElements.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SPECIAL_ELEMENTS);
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, SpecialElements.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, SpecialElements.getBindings(additionnalBinding));
	}
}

export { SpecialElements };
