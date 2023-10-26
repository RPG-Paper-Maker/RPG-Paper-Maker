/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, ObjectCollisionKind, ShapeKind } from '../common/Enum';
import { BindingType } from '../common/Types';
import { SpecialElement } from './SpecialElement';

class Object3D extends SpecialElement {
	public shapeKind!: ShapeKind;
	public objID!: number;
	public mtlID!: number;
	public collisionKind!: ObjectCollisionKind;
	public collisionCustomID!: number;
	public scale!: number;
	public widthSquare!: number;
	public widthPixel!: number;
	public heightSquare!: number;
	public heightPixel!: number;
	public depthSquare!: number;
	public depthPixel!: number;
	public stretch!: boolean;
	public isTopLeft!: boolean;

	public static readonly bindings: BindingType[] = [
		['shapeKind', 'sk', ShapeKind.Box, BINDING.NUMBER],
		['objID', 'oid', -1, BINDING.NUMBER],
		['mtlID', 'mid', -1, BINDING.NUMBER],
		['collisionKind', 'ck', ObjectCollisionKind.None, BINDING.NUMBER],
		['collisionsCustomID', 'ccid', -1, BINDING.NUMBER],
		['scale', 's', 1, BINDING.NUMBER],
		['widthSquare', 'ws', 1, BINDING.NUMBER],
		['widthPixel', 'wp', 0, BINDING.NUMBER],
		['heightSquare', 'hs', 1, BINDING.NUMBER],
		['heightPixel', 'hp', 0, BINDING.NUMBER],
		['depthSquare', 'ds', 1, BINDING.NUMBER],
		['depthPixel', 'dp', 0, BINDING.NUMBER],
		['stretch', 'st', false, BINDING.BOOLEAN],
		['isTopLeft', 'itl', true, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Object3D.bindings, ...additionnalBinding];
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Object3D.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Object3D.getBindings(additionnalBinding));
	}
}

export { Object3D };
