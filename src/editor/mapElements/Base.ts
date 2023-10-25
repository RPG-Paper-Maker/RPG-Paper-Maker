/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { BINDING, ElementMapKind } from '../common/Enum';
import { Position } from '../core/Position';
import { CustomGeometry } from '../core/CustomGeometry';
import { Project } from '../core/Project';
import { MapElement } from '../Editor';
import { Serializable } from '../core/Serializable';
import { BindingType } from '../common/Types';
abstract class Base extends Serializable {
	public static readonly COEF_TEX = 0.2;
	public static readonly Y_AXIS = new THREE.Vector3(0, 1, 0);
	public static readonly X_AXIS = new THREE.Vector3(1, 0, 0);
	public static readonly Z_AXIS = new THREE.Vector3(0, 0, 1);

	public xOffset: number;
	public yOffset: number;
	public zOffset: number;
	public front: boolean;
	public kind: ElementMapKind;

	public static readonly bindings: BindingType[] = [
		['xOffset', 'xOff', 0, BINDING.NUMBER],
		['yOffset', 'yOff', 0, BINDING.NUMBER],
		['zOffset', 'zOff', 0, BINDING.NUMBER],
		['front', 'f', true, BINDING.BOOLEAN],
		['kind', 'k', undefined, BINDING.NUMBER],
	];

	constructor() {
		super();
		this.xOffset = 0;
		this.yOffset = 0;
		this.zOffset = 0;
		this.front = true;
		this.kind = ElementMapKind.None;
	}

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Base.bindings, ...additionnalBinding];
	}

	static readMapElement(kind: ElementMapKind, json: Record<string, any>) {
		if (json === null) {
			return null;
		}
		let model: Base | null = null;
		switch (kind) {
			case ElementMapKind.Floors:
				model = new MapElement.Floor();
				break;
			case ElementMapKind.SpritesFace:
				model = new MapElement.Sprite();
				break;
		}
		if (model) {
			model.read(json);
		}
		return model;
	}

	static rotateVertex(
		vec: THREE.Vector3,
		center: THREE.Vector3,
		angle: number,
		axis: THREE.Vector3,
		isDegree: boolean = true
	) {
		vec.sub(center);
		vec.applyAxisAngle(axis, isDegree ? (angle * Math.PI) / 180.0 : angle);
		vec.add(center);
	}

	static rotateQuad(
		vecA: THREE.Vector3,
		vecB: THREE.Vector3,
		vecC: THREE.Vector3,
		vecD: THREE.Vector3,
		center: THREE.Vector3,
		angle: number,
		axis: THREE.Vector3
	) {
		CustomGeometry.rotateVertex(vecA, center, angle, axis);
		CustomGeometry.rotateVertex(vecB, center, angle, axis);
		CustomGeometry.rotateVertex(vecC, center, angle, axis);
		CustomGeometry.rotateVertex(vecD, center, angle, axis);
	}

	scale(
		vecA: THREE.Vector3,
		vecB: THREE.Vector3,
		vecC: THREE.Vector3,
		vecD: THREE.Vector3,
		center: THREE.Vector3,
		position: Position,
		size: THREE.Vector3,
		kind: ElementMapKind
	) {
		let zPlus = position.layer * 0.05;

		// Apply an offset according to layer position
		if (kind !== ElementMapKind.SpritesFace && !this.front) {
			zPlus *= -1;
		}
		const offset = new THREE.Vector3(0, 0, zPlus);

		// Center
		center.setX(this.xOffset * Project.getSquareSize());
		center.setY(this.yOffset * Project.getSquareSize());
		center.setZ(this.zOffset * Project.getSquareSize());

		// Position
		const pos = center.clone();
		pos.add(offset);
		center.setY(center.y + size.y / 2);
		vecA.multiply(size);
		vecB.multiply(size);
		vecC.multiply(size);
		vecD.multiply(size);
		vecA.add(pos);
		vecB.add(pos);
		vecC.add(pos);
		vecD.add(pos);
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Base.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Base.getBindings(additionnalBinding));
	}

	abstract equals(mapElement: MapElement.Base): boolean;
}

export { Base };
