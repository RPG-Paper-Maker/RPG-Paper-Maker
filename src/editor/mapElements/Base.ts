/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Enum } from '../common/Enum';
import { Utils } from '../common/Utils';
import { Position } from '../core/Position';
import { Project } from '../models';

class Base {
	public static readonly JSON_X_OFFSET = 'xOff';
	public static readonly JSON_Y_OFFSET = 'yOff';
	public static readonly JSON_Z_OFFSET = 'zOff';
	public static readonly DEFAULT_X_OFFSET = 0;
	public static readonly DEFAULT_Y_OFFSET = 0;
	public static readonly DEFAULT_Z_OFFSET = 0;

	public static readonly COEF_TEX = 0.2;
	public static readonly Y_AXIS = new THREE.Vector3(0, 1, 0);
	public static readonly X_AXIS = new THREE.Vector3(1, 0, 0);
	public static readonly Z_AXIS = new THREE.Vector3(0, 0, 1);

	public xOffset: number;
	public yOffset: number;
	public zOffset: number;
	public front: boolean;
	public kind: Enum.ElementMapKind = Enum.ElementMapKind.None;

	constructor() {
		this.xOffset = 0;
		this.yOffset = 0;
		this.zOffset = 0;
		this.front = true;
	}

	static rotateVertex(vec: THREE.Vector3, center: THREE.Vector3, angle: number, axis: THREE.Vector3) {
		vec.sub(center);
		vec.applyAxisAngle(axis, (angle * Math.PI) / 180.0);
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
		Base.rotateVertex(vecA, center, angle, axis);
		Base.rotateVertex(vecB, center, angle, axis);
		Base.rotateVertex(vecC, center, angle, axis);
		Base.rotateVertex(vecD, center, angle, axis);
	}

	scale(
		vecA: THREE.Vector3,
		vecB: THREE.Vector3,
		vecC: THREE.Vector3,
		vecD: THREE.Vector3,
		center: THREE.Vector3,
		position: Position,
		size: THREE.Vector3,
		kind: Enum.ElementMapKind
	) {
		let zPlus = position.layer * 0.05;

		// Apply an offset according to layer position
		if (kind !== Enum.ElementMapKind.SpritesFace && !this.front) {
			zPlus *= -1;
		}
		let offset = new THREE.Vector3(0, 0, zPlus);

		// Center
		center.setX(this.xOffset * Project.getSquareSize());
		center.setY(this.yOffset * Project.getSquareSize());
		center.setZ(this.zOffset * Project.getSquareSize());

		// Position
		let pos = center.clone();
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

	read(json: any) {
		this.xOffset = Utils.defaultValue(json[Base.JSON_X_OFFSET], Base.DEFAULT_X_OFFSET);
		this.yOffset = Utils.defaultValue(json[Base.JSON_Y_OFFSET], Base.DEFAULT_Y_OFFSET);
		this.zOffset = Utils.defaultValue(json[Base.JSON_Z_OFFSET], Base.DEFAULT_Z_OFFSET);
	}

	write(json: any) {
		Utils.writeDefaultValue(json, Base.JSON_X_OFFSET, this.xOffset, Base.DEFAULT_X_OFFSET);
		Utils.writeDefaultValue(json, Base.JSON_Y_OFFSET, this.yOffset, Base.DEFAULT_Y_OFFSET);
		Utils.writeDefaultValue(json, Base.JSON_Z_OFFSET, this.zOffset, Base.DEFAULT_Z_OFFSET);
	}
}

export { Base };
