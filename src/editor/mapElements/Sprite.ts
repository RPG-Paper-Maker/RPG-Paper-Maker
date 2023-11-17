/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { MapElement } from '../Editor';
import { Base } from './Base';
import { CustomGeometry, CustomGeometryFace, Position, Project, Rectangle } from '../core';
import { BINDING, BindingType, ELEMENT_MAP_KIND } from '../common';

class Sprite extends Base {
	public static readonly MODEL = [
		new THREE.Vector3(-0.5, 1.0, 0.0),
		new THREE.Vector3(0.5, 1.0, 0.0),
		new THREE.Vector3(0.5, 0.0, 0.0),
		new THREE.Vector3(-0.5, 0.0, 0.0),
	];

	public texture!: Rectangle;

	public static readonly bindings: BindingType[] = [['texture', 't', null, BINDING.RECTANGLE]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Sprite.bindings, ...additionnalBinding];
	}

	static fromJSON(json: Record<string, any>): Sprite {
		const sprite = new Sprite();
		if (json) {
			sprite.read(json);
		}
		return sprite;
	}

	static create(kind: ELEMENT_MAP_KIND, texture: Rectangle): Sprite {
		const sprite = new Sprite();
		sprite.kind = kind;
		sprite.texture = texture;
		return sprite;
	}

	static addStaticSpriteToGeometry(
		geometry: CustomGeometry,
		vecA: THREE.Vector3,
		vecB: THREE.Vector3,
		vecC: THREE.Vector3,
		vecD: THREE.Vector3,
		texA: THREE.Vector2,
		texB: THREE.Vector2,
		texC: THREE.Vector2,
		texD: THREE.Vector2,
		count: number,
		position: Position
	): number {
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);
		geometry.pushQuadIndices(count, position);
		geometry.pushQuadUVs(texA, texB, texC, texD);
		return count + 4;
	}

	equals(mapElement: MapElement.Base) {
		if (mapElement.kind === this.kind) {
			const floor = mapElement as MapElement.Floor;
			return floor.texture.equals(this.texture);
		} else {
			return false;
		}
	}

	toString(): string {
		let type = '';
		switch (this.kind) {
			case ELEMENT_MAP_KIND.SPRITE_FACE:
				type = 'FACE SPRITE';
				break;
			case ELEMENT_MAP_KIND.SPRITE_FIX:
				type = 'FIX SPRITE';
				break;
			case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
				type = 'DOUBLE SPRITE';
				break;
			case ELEMENT_MAP_KIND.SPRITE_QUADRA:
				type = 'QUADRA SPRITE';
				break;
		}
		return `${type} | ${this.texture.toString()}`;
	}

	updateGeometry(
		geometry: CustomGeometry | CustomGeometryFace,
		width: number,
		height: number,
		position: Position,
		count: number,
		tileset: boolean,
		localPosition: THREE.Vector3 | null
	): number {
		const vecA = Sprite.MODEL[0].clone();
		const vecB = Sprite.MODEL[1].clone();
		const vecC = Sprite.MODEL[2].clone();
		const vecD = Sprite.MODEL[3].clone();
		const center = new THREE.Vector3(0, 0, 0);
		const size = new THREE.Vector3(
			this.texture.width * Project.getSquareSize() * position.scaleX,
			this.texture.height * Project.getSquareSize() * position.scaleY,
			1.0
		);

		// For static sprites
		super.scale(vecA, vecB, vecC, vecD, center, position, size, this.kind);
		if (localPosition !== null) {
			vecA.add(localPosition);
			vecB.add(localPosition);
			vecC.add(localPosition);
			vecD.add(localPosition);
			center.add(localPosition);
		} else {
			localPosition = tileset ? position.toVector3() : new THREE.Vector3();
		}

		const angleY = position.angleY;
		const angleX = position.angleX;
		const angleZ = position.angleZ;
		if (this.kind !== ELEMENT_MAP_KIND.SPRITE_FACE) {
			if (angleY !== 0.0) {
				Base.rotateQuad(vecA, vecB, vecC, vecD, center, angleY, Base.Y_AXIS);
			}
			if (angleX !== 0.0) {
				Base.rotateQuad(vecA, vecB, vecC, vecD, center, angleX, Base.X_AXIS);
			}
			if (angleZ !== 0.0) {
				Base.rotateQuad(vecA, vecB, vecC, vecD, center, angleZ, Base.Z_AXIS);
			}
		}

		// Getting UV coordinates
		let x = (this.texture.x * Project.getSquareSize()) / width;
		let y = (this.texture.y * Project.getSquareSize()) / height;
		let w = (this.texture.width * Project.getSquareSize()) / width;
		let h = (this.texture.height * Project.getSquareSize()) / height;
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

		if (geometry instanceof CustomGeometryFace) {
			// Face sprite
			const c = new THREE.Vector3(center.x, localPosition.y, center.z);
			geometry.pushQuadVerticesFace(
				Sprite.MODEL[0].clone().multiply(size).add(c),
				Sprite.MODEL[1].clone().multiply(size).add(c),
				Sprite.MODEL[2].clone().multiply(size).add(c),
				Sprite.MODEL[3].clone().multiply(size).add(c),
				c
			);
			geometry.pushQuadIndices(count, position);
			geometry.pushQuadUVs(texA, texB, texC, texD);
			count = count + 4;
		} else {
			// Simple sprite
			const vecSimpleA = vecA.clone();
			const vecSimpleB = vecB.clone();
			const vecSimpleC = vecC.clone();
			const vecSimpleD = vecD.clone();
			count = Sprite.addStaticSpriteToGeometry(
				geometry,
				vecSimpleA,
				vecSimpleB,
				vecSimpleC,
				vecSimpleD,
				texA,
				texB,
				texC,
				texD,
				count,
				position
			);
		}

		// Double sprite
		if (this.kind === ELEMENT_MAP_KIND.SPRITE_DOUBLE || this.kind === ELEMENT_MAP_KIND.SPRITE_QUADRA) {
			const vecDoubleA = vecA.clone();
			const vecDoubleB = vecB.clone();
			const vecDoubleC = vecC.clone();
			const vecDoubleD = vecD.clone();
			Base.rotateQuad(vecDoubleA, vecDoubleB, vecDoubleC, vecDoubleD, center, 90, Sprite.Y_AXIS);
			count = Sprite.addStaticSpriteToGeometry(
				geometry,
				vecDoubleA,
				vecDoubleB,
				vecDoubleC,
				vecDoubleD,
				texA,
				texB,
				texC,
				texD,
				count,
				position
			);

			// Quadra sprite
			if (this.kind === ELEMENT_MAP_KIND.SPRITE_QUADRA) {
				const vecQuadra1A = vecA.clone();
				const vecQuadra1B = vecB.clone();
				const vecQuadra1C = vecC.clone();
				const vecQuadra1D = vecD.clone();
				const vecQuadra2A = vecA.clone();
				const vecQuadra2B = vecB.clone();
				const vecQuadra2C = vecC.clone();
				const vecQuadra2D = vecD.clone();
				Base.rotateQuad(vecQuadra1A, vecQuadra1B, vecQuadra1C, vecQuadra1D, center, 45, Sprite.Y_AXIS);
				Base.rotateQuad(vecQuadra2A, vecQuadra2B, vecQuadra2C, vecQuadra2D, center, -45, Sprite.Y_AXIS);
				count = Sprite.addStaticSpriteToGeometry(
					geometry,
					vecQuadra1A,
					vecQuadra1B,
					vecQuadra1C,
					vecQuadra1D,
					texA,
					texB,
					texC,
					texD,
					count,
					position
				);
				count = Sprite.addStaticSpriteToGeometry(
					geometry,
					vecQuadra2A,
					vecQuadra2B,
					vecQuadra2C,
					vecQuadra2D,
					texA,
					texB,
					texC,
					texD,
					count,
					position
				);
			}
		}
		return count;
	}

	createGeometry(width: number, height: number, tileset: boolean, position: Position): [CustomGeometry, number] {
		const geometry = new CustomGeometry();
		const count = this.updateGeometry(geometry, width, height, position, 0, tileset, null);
		geometry.updateAttributes();
		return [geometry, count];
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Sprite.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Sprite.getBindings(additionnalBinding));
	}
}

export { Sprite };
