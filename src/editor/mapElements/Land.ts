/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Utils } from '../common/Utils';
import { CustomGeometry } from '../core/CustomGeometry';
import { Position } from '../core/Position';
import { Rectangle } from '../core/Rectangle';
import { Project } from '../models';
import { Base } from './Base';

class Land extends Base {
	public static readonly JSON_UP = 'up';
	public static readonly JSON_TEXTURE = 't';
	public static readonly DEFAULT_UP = true;

	public up: boolean;
	public texture: Rectangle;

	constructor(up = true, texture = new Rectangle()) {
		super();

		this.up = up;
		this.texture = texture;
	}

	getIndex(width: number): number {
		return this.texture.x + this.texture.y * width;
	}

	updateGeometryLand(
		geometry: CustomGeometry,
		position: Position,
		width: number,
		height: number,
		x: number,
		y: number,
		w: number,
		h: number,
		count: number
	) {
		let localPosition = position.toVector3(false);
		let a = localPosition.x;
		let yLayerOffset = position.layer * 0.05;
		if (!this.up) {
			yLayerOffset *= -1;
		}
		let b = localPosition.y + yLayerOffset;
		let c = localPosition.z;

		// Vertices
		let vecA = new THREE.Vector3(a, b, c);
		let vecB = new THREE.Vector3(a + Project.getSquareSize(), b, c);
		let vecC = new THREE.Vector3(a + Project.getSquareSize(), b, c + Project.getSquareSize());
		let vecD = new THREE.Vector3(a, b, c + Project.getSquareSize());
		let center = new THREE.Vector3(a + Project.getSquareSize() / 2, b, c + Project.getSquareSize() / 2);
		if (position.angleY !== 0.0) {
			Base.rotateQuad(vecA, vecB, vecC, vecD, center, position.angleY, Base.Y_AXIS);
		}
		if (position.angleX !== 0.0) {
			Base.rotateQuad(vecA, vecB, vecC, vecD, center, position.angleX, Base.X_AXIS);
		}
		if (position.angleZ !== 0.0) {
			Base.rotateQuad(vecA, vecB, vecC, vecD, center, position.angleZ, Base.Z_AXIS);
		}

		// Vertices
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);

		// Indices
		geometry.pushQuadIndices(count * 4);

		// UVs
		let coefX = Base.COEF_TEX / width;
		let coefY = Base.COEF_TEX / height;
		x += coefX;
		y += coefY;
		w -= coefX * 2;
		h -= coefY * 2;
		let texA = new THREE.Vector2();
		let texB = new THREE.Vector2();
		let texC = new THREE.Vector2();
		let texD = new THREE.Vector2();
		CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, x, y, w, h);
		geometry.pushQuadUVs(texA, texB, texC, texD);
	}

	read(json: any) {
		super.read(json);
		this.up = Utils.defaultValue(json[Land.JSON_UP], Land.DEFAULT_UP);
		this.texture.read(json[Land.JSON_TEXTURE]);
	}

	write(json: any) {
		super.write(json);
		Utils.writeDefaultValue(json, Land.JSON_UP, this.up, Land.DEFAULT_UP);
		let tab: any[] = [];
		this.texture.write(tab);
		json[Land.JSON_TEXTURE] = tab;
	}
}

export { Land };
