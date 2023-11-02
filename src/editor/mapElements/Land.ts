/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { CustomGeometry } from '../core/CustomGeometry';
import { Position } from '../core/Position';
import { Rectangle } from '../core/Rectangle';
import { Base } from './Base';
import { Project } from '../core/Project';
import { MapElement } from '../Editor';
import { BindingType } from '../common/Types';
import { BINDING } from '../common/Enum';

class Land extends Base {
	public static readonly JSON_UP = 'up';
	public static readonly JSON_TEXTURE = 't';
	public static readonly DEFAULT_UP = true;

	public up!: boolean;
	public texture!: Rectangle;

	public static readonly bindings: BindingType[] = [
		['up', 'up', true, BINDING.BOOLEAN],
		['texture', 't', undefined, BINDING.RECTANGLE],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Land.bindings, ...additionnalBinding];
	}

	equals(mapElement: MapElement.Base) {
		if (mapElement.kind === this.kind) {
			const land = mapElement as MapElement.Land;
			return land.texture.equals(this.texture) && land.up === this.up;
		} else {
			return false;
		}
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
		count: number,
		squareWidth = 1,
		squareHeight = 1
	) {
		const localPosition = position.toVector3(false);
		const a = localPosition.x;
		let yLayerOffset = position.layer * 0.05;
		if (!this.up) {
			yLayerOffset *= -1;
		}
		const b = localPosition.y + yLayerOffset;
		const c = localPosition.z;

		// Vertices
		const vecA = new THREE.Vector3(a, b, c);
		const vecB = new THREE.Vector3(a + Project.getSquareSize() * squareWidth, b, c);
		const vecC = new THREE.Vector3(
			a + Project.getSquareSize() * squareWidth,
			b,
			c + Project.getSquareSize() * squareHeight
		);
		const vecD = new THREE.Vector3(a, b, c + Project.getSquareSize() * squareHeight);
		const center = new THREE.Vector3(a + Project.getSquareSize() / 2, b, c + Project.getSquareSize() / 2);
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
		const coefX = Base.COEF_TEX / width;
		const coefY = Base.COEF_TEX / height;
		x += coefX;
		y += coefY;
		w -= coefX * 2;
		h -= coefY * 2;
		const texA = new THREE.Vector2();
		const texB = new THREE.Vector2();
		const texC = new THREE.Vector2();
		const texD = new THREE.Vector2();
		CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, x, y, w, h);
		geometry.pushQuadUVs(texA, texB, texC, texD);
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Land.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Land.getBindings(additionnalBinding));
	}
}

export { Land };
