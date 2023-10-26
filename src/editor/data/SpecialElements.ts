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
import { BindingType } from '../common/Types';
import { Serializable } from '../core/Serializable';
import { TextureBundle } from '../core/TextureBundle';

class SpecialElements extends Serializable {
	public static autotiles: Model.Autotile[];
	public static walls: Model.SpecialElement[];
	public static mountains: Model.Mountain[];
	public static objects: Model.Object3D[];
	public static texturesAutotiles: TextureBundle[][] = [];
	public static texturesWalls: THREE.MeshPhongMaterial[] = [];
	public static texturesObjects3D: THREE.MeshPhongMaterial[] = [];
	public static texturesMountains: TextureBundle[] = [];

	public static readonly bindings: BindingType[] = [
		['autotiles', 'autotiles', undefined, BINDING.LIST, Model.Autotile],
		['walls', 'walls', undefined, BINDING.LIST, Model.SpecialElement],
		['mountains', 'm', undefined, BINDING.LIST, Model.Mountain],
		['objetcs', 'o', undefined, BINDING.LIST, Model.Object3D],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...SpecialElements.bindings, ...additionnalBinding];
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, SpecialElements.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, SpecialElements.getBindings(additionnalBinding));
	}
}

export { SpecialElements };
