/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Euler, Vector3 } from 'three';
import { MapElement } from '../Editor';
import { BINDING, BindingType, ELEMENT_MAP_KIND, JSONType, SHAPE_KIND } from '../common';
import { CustomGeometry, Position, Project } from '../core';
import { Serializable } from '../core/Serializable';

abstract class Base extends Serializable {
	public static readonly COEF_TEX = 0.2;
	public static readonly Y_AXIS = new Vector3(0, 1, 0);
	public static readonly X_AXIS = new Vector3(1, 0, 0);
	public static readonly Z_AXIS = new Vector3(0, 0, 1);

	public xOffset: number;
	public yOffset: number;
	public zOffset: number;
	public front: boolean;
	public kind: ELEMENT_MAP_KIND;
	public isPreview = false;

	public static readonly bindings: BindingType[] = [
		['xOffset', 'xOff', 0, BINDING.NUMBER],
		['yOffset', 'yOff', 0, BINDING.NUMBER],
		['zOffset', 'zOff', 0, BINDING.NUMBER],
		['front', 'f', true, BINDING.BOOLEAN],
	];

	constructor() {
		super();
		this.xOffset = 0;
		this.yOffset = 0;
		this.zOffset = 0;
		this.front = true;
		this.kind = ELEMENT_MAP_KIND.NONE;
	}

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Base.bindings, ...additionnalBinding];
	}

	static readMapElement(kind: ELEMENT_MAP_KIND, json: JSONType) {
		if (json === null) {
			return null;
		}
		let model: Base | null = null;
		switch (kind) {
			case ELEMENT_MAP_KIND.FLOOR:
				model = new MapElement.Floor();
				break;
			case ELEMENT_MAP_KIND.AUTOTILE:
				model = new MapElement.Autotile();
				break;
			case ELEMENT_MAP_KIND.SPRITE_FACE:
			case ELEMENT_MAP_KIND.SPRITE_FIX:
			case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
			case ELEMENT_MAP_KIND.SPRITE_QUADRA:
				model = new MapElement.Sprite();
				break;
			case ELEMENT_MAP_KIND.SPRITE_WALL:
				model = new MapElement.SpriteWall();
				break;
			case ELEMENT_MAP_KIND.MOUNTAIN:
				model = new MapElement.Mountain();
				break;
			case ELEMENT_MAP_KIND.OBJECT3D: {
				const data = Project.current!.specialElements.getObject3DByID(json['did'] as number);
				switch (data.shapeKind) {
					case SHAPE_KIND.BOX:
						model = MapElement.Object3DBox.create(data);
						break;
					case SHAPE_KIND.CUSTOM:
						model = MapElement.Object3DCustom.create(data);
						break;
				}
				break;
			}
		}
		if (model) {
			model.read(json);
		}
		return model;
	}

	static rotateQuad(
		vecA: Vector3,
		vecB: Vector3,
		vecC: Vector3,
		vecD: Vector3,
		center: Vector3,
		angle: number,
		axis: Vector3
	) {
		CustomGeometry.rotateVertex(vecA, center, angle, axis);
		CustomGeometry.rotateVertex(vecB, center, angle, axis);
		CustomGeometry.rotateVertex(vecC, center, angle, axis);
		CustomGeometry.rotateVertex(vecD, center, angle, axis);
	}

	static rotateQuadEuler(vecA: Vector3, vecB: Vector3, vecC: Vector3, vecD: Vector3, center: Vector3, euler: Euler) {
		CustomGeometry.rotateVertexEuler(vecA, center, euler);
		CustomGeometry.rotateVertexEuler(vecB, center, euler);
		CustomGeometry.rotateVertexEuler(vecC, center, euler);
		CustomGeometry.rotateVertexEuler(vecD, center, euler);
	}

	getLocalPosition(position: Position): Vector3 {
		return position.toVector3();
	}

	getLocalRotation(position: Position): Euler {
		return position.toRotationEuler();
	}

	getLocalScale(position: Position): Vector3 {
		return position.toScaleVector();
	}

	getPositionFromVec3(vec: Vector3, rotation: Euler, scale: Vector3): Position {
		return Position.createFromVector3(vec, rotation, scale);
	}

	getAdditionalX(): number {
		return Math.floor(Project.SQUARE_SIZE / 2);
	}

	getAdditionalY(): number {
		return 0;
	}

	getAdditionalZ(): number {
		return Math.floor(Project.SQUARE_SIZE / 2);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Base.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Base.getBindings(additionnalBinding));
	}

	abstract equals(mapElement: MapElement.Base): boolean;

	abstract toString(): string;
}

export { Base };
