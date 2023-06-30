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
import { CustomGeometry } from '../core/CustomGeometry';
import { CustomGeometryFace } from '../core/CustomGeometryFace';
import { Position } from '../core/Position';
import { Rectangle } from '../core/Rectangle';
import { Project } from '../models';
import { Base } from './Base';

class Sprite extends Base {
	public static MODEL = [
		new THREE.Vector3(-0.5, 1.0, 0.0),
		new THREE.Vector3(0.5, 1.0, 0.0),
		new THREE.Vector3(0.5, 0.0, 0.0),
		new THREE.Vector3(-0.5, 0.0, 0.0),
	];

	public texture: Rectangle;

	constructor(json?: Record<string, any>) {
		super();

		this.front = true;
		this.texture = new Rectangle();
		if (json) {
			this.read(json);
		}
	}

	static create(kind: Enum.ElementMapKind, texture: Rectangle): Sprite {
		let sprite = new Sprite();
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
		count: number
	): number {
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);
		geometry.pushQuadIndices(count);
		geometry.pushQuadUVs(texA, texB, texC, texD);
		return count + 4;
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
		let vecA = Sprite.MODEL[0].clone();
		let vecB = Sprite.MODEL[1].clone();
		let vecC = Sprite.MODEL[2].clone();
		let vecD = Sprite.MODEL[3].clone();
		let center = new THREE.Vector3(0, 0, 0);
		let size = new THREE.Vector3(
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

		let angleY = position.angleY;
		let angleX = position.angleX;
		let angleZ = position.angleZ;
		if (this.kind !== Enum.ElementMapKind.SpritesFace) {
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

		if (geometry instanceof CustomGeometryFace) {
			// Face sprite
			geometry.pushQuadVerticesFace(
				Sprite.MODEL[0].clone(),
				Sprite.MODEL[1].clone(),
				Sprite.MODEL[2].clone(),
				Sprite.MODEL[3].clone(),
				size.clone(),
				new THREE.Vector3(center.x, localPosition.y, center.z)
			);
			geometry.pushQuadIndices(count);
			geometry.pushQuadUVs(texA, texB, texC, texD);
			count = count + 4;
		} else {
			// Simple sprite
			let vecSimpleA = vecA.clone();
			let vecSimpleB = vecB.clone();
			let vecSimpleC = vecC.clone();
			let vecSimpleD = vecD.clone();
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
				count
			);
		}

		// Double sprite
		if (this.kind === Enum.ElementMapKind.SpritesDouble || this.kind === Enum.ElementMapKind.SpritesQuadra) {
			let vecDoubleA = vecA.clone();
			let vecDoubleB = vecB.clone();
			let vecDoubleC = vecC.clone();
			let vecDoubleD = vecD.clone();
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
				count
			);

			// Quadra sprite
			if (this.kind === Enum.ElementMapKind.SpritesQuadra) {
				let vecQuadra1A = vecA.clone();
				let vecQuadra1B = vecB.clone();
				let vecQuadra1C = vecC.clone();
				let vecQuadra1D = vecD.clone();
				let vecQuadra2A = vecA.clone();
				let vecQuadra2B = vecB.clone();
				let vecQuadra2C = vecC.clone();
				let vecQuadra2D = vecD.clone();
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
					count
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
					count
				);
			}
		}
		return count;
	}

	createGeometry(width: number, height: number, tileset: boolean, position: Position): [CustomGeometry, number] {
		let geometry = new CustomGeometry();
		let count = this.updateGeometry(geometry, width, height, position, 0, tileset, null);
		geometry.updateAttributes();
		return [geometry, count];
	}

	read(json: Record<string, any>) {
		super.read(json);
		this.front = Utils.defaultValue(json.f, true);
		this.kind = json.k;
		this.texture.read(json.t);
	}
}

export { Sprite };
