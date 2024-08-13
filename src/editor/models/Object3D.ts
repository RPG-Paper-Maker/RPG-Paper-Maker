/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { BINDING, BindingType, JSONType, OBJECT_COLLISION_KIND, SHAPE_KIND } from '../common';
import { Project } from '../core';
import { SpecialElement } from './SpecialElement';

class Object3D extends SpecialElement {
	public shapeKind!: SHAPE_KIND;
	public objID!: number;
	public mtlID!: number;
	public collisionKind!: OBJECT_COLLISION_KIND;
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
		['shapeKind', 'sk', SHAPE_KIND.BOX, BINDING.NUMBER],
		['objID', 'oid', -1, BINDING.NUMBER],
		['mtlID', 'mid', -1, BINDING.NUMBER],
		['collisionKind', 'ck', OBJECT_COLLISION_KIND.NONE, BINDING.NUMBER],
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

	getTotalWidthPixels(): number {
		return this.widthSquare * Project.SQUARE_SIZE + (this.widthPixel * Project.SQUARE_SIZE) / 100;
	}

	getTotalHeightPixels(): number {
		return this.heightSquare * Project.SQUARE_SIZE + (this.heightPixel * Project.SQUARE_SIZE) / 100;
	}

	getTotalDepthPixels(): number {
		return this.depthSquare * Project.SQUARE_SIZE + (this.depthPixel * Project.SQUARE_SIZE) / 100;
	}

	getSizeVector(): THREE.Vector3 {
		return new THREE.Vector3(this.getTotalWidthPixels(), this.getTotalHeightPixels(), this.getTotalDepthPixels());
	}

	copy(object3D: Object3D): void {
		super.copy(object3D);
		this.shapeKind = object3D.shapeKind;
		this.objID = object3D.objID;
		this.mtlID = object3D.mtlID;
		this.collisionKind = object3D.collisionKind;
		this.collisionCustomID = object3D.collisionCustomID;
		this.scale = object3D.scale;
		this.widthSquare = object3D.widthSquare;
		this.widthPixel = object3D.widthPixel;
		this.heightSquare = object3D.heightSquare;
		this.heightPixel = object3D.heightPixel;
		this.depthSquare = object3D.depthSquare;
		this.depthPixel = object3D.depthPixel;
		this.stretch = object3D.stretch;
		this.isTopLeft = object3D.isTopLeft;
	}

	clone(): Object3D {
		const object3D = new Object3D();
		object3D.copy(this);
		return object3D;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Object3D.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Object3D.getBindings(additionnalBinding));
	}
}

export { Object3D };
