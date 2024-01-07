/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { MapElement, Scene } from '../Editor';
import { Base } from './Base';
import { CustomGeometry, Position, Project, Rectangle } from '../core';
import { BINDING, BindingType, ELEMENT_MAP_KIND } from '../common';

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

	static areLandsEquals(
		landBefore: Land | null,
		autotileAfter: number,
		textureAfter: Rectangle,
		kindAfter: ELEMENT_MAP_KIND
	) {
		if (landBefore === null) {
			return kindAfter === ELEMENT_MAP_KIND.NONE;
		} else {
			if (landBefore.kind === kindAfter) {
				if (landBefore instanceof MapElement.Autotile) {
					return landBefore.autotileID === autotileAfter && landBefore.texture.equals(textureAfter);
				} else {
					return landBefore.texture.equals(textureAfter);
				}
			} else {
				return false;
			}
		}
	}

	equals(mapElement: MapElement.Base) {
		if (mapElement.kind === this.kind) {
			const land = mapElement as MapElement.Land;
			return land.texture.equals(this.texture) && land.up === this.up;
		} else {
			return false;
		}
	}

	toString(): string {
		return 'LAND';
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
		const localPosition = position.toVector3();
		const a = localPosition.x;
		let yLayerOffset = position.layer * Scene.Map.current!.camera.getYOffsetDepth();
		if (!this.up) {
			yLayerOffset *= -1;
		}
		const b = localPosition.y + yLayerOffset;
		const c = localPosition.z;

		// Vertices
		const vecA = new THREE.Vector3(a - Project.SQUARE_SIZE / 2, b, c - Project.SQUARE_SIZE / 2);
		const vecB = new THREE.Vector3(a + (Project.SQUARE_SIZE / 2) * squareWidth, b, c - Project.SQUARE_SIZE / 2);
		const vecC = new THREE.Vector3(
			a + (Project.SQUARE_SIZE / 2) * squareWidth,
			b,
			c + (Project.SQUARE_SIZE / 2) * squareHeight
		);
		const vecD = new THREE.Vector3(a - Project.SQUARE_SIZE / 2, b, c + (Project.SQUARE_SIZE / 2) * squareHeight);
		const center = new THREE.Vector3(a, b, c);
		Base.rotateQuadEuler(vecA, vecB, vecC, vecD, center, position.toRotationEuler());

		// Vertices
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);

		// Indices
		geometry.pushQuadIndices(count * 4, position);

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
