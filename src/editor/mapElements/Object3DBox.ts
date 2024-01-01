/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Object3D } from './Object3D';
import { MapElement, Model } from '../Editor';
import { CustomGeometry, Position, Project } from '../core';
import { Sprite } from './Sprite';
import { Base } from './Base';

class Object3DBox extends Object3D {
	public static COEF = 0.01;
	public static VERTICES = [
		// Front
		new THREE.Vector3(0.0, 1.0, 1.0),
		new THREE.Vector3(1.0, 1.0, 1.0),
		new THREE.Vector3(1.0, 0.0, 1.0),
		new THREE.Vector3(0.0, 0.0, 1.0),

		// Back
		new THREE.Vector3(1.0, 1.0, 0.0),
		new THREE.Vector3(0.0, 1.0, 0.0),
		new THREE.Vector3(0.0, 0.0, 0.0),
		new THREE.Vector3(1.0, 0.0, 0.0),

		// Left
		new THREE.Vector3(0.0, 1.0, 0.0),
		new THREE.Vector3(0.0, 1.0, 1.0),
		new THREE.Vector3(0.0, 0.0, 1.0),
		new THREE.Vector3(0.0, 0.0, 0.0),

		// Right
		new THREE.Vector3(1.0, 1.0, 1.0),
		new THREE.Vector3(1.0, 1.0, 0.0),
		new THREE.Vector3(1.0, 0.0, 0.0),
		new THREE.Vector3(1.0, 0.0, 1.0),

		// Bottom
		new THREE.Vector3(0.0, 0.0, 1.0),
		new THREE.Vector3(1.0, 0.0, 1.0),
		new THREE.Vector3(1.0, 0.0, 0.0),
		new THREE.Vector3(0.0, 0.0, 0.0),

		// Top
		new THREE.Vector3(0.0, 1.0, 0.0),
		new THREE.Vector3(1.0, 1.0, 0.0),
		new THREE.Vector3(1.0, 1.0, 1.0),
		new THREE.Vector3(0.0, 1.0, 1.0),
	];
	public static VERTICES_CENTER = [
		// Front
		new THREE.Vector3(-0.5, 1.0, 0.5),
		new THREE.Vector3(0.5, 1.0, 0.5),
		new THREE.Vector3(0.5, 0.0, 0.5),
		new THREE.Vector3(-0.5, 0.0, 0.5),

		// Back
		new THREE.Vector3(0.5, 1.0, -0.5),
		new THREE.Vector3(-0.5, 1.0, -0.5),
		new THREE.Vector3(-0.5, 0.0, -0.5),
		new THREE.Vector3(0.5, 0.0, -0.5),

		// Left
		new THREE.Vector3(-0.5, 1.0, -0.5),
		new THREE.Vector3(-0.5, 1.0, 0.5),
		new THREE.Vector3(-0.5, 0.0, 0.5),
		new THREE.Vector3(-0.5, 0.0, -0.5),

		// Right
		new THREE.Vector3(0.5, 1.0, 0.5),
		new THREE.Vector3(0.5, 1.0, -0.5),
		new THREE.Vector3(0.5, 0.0, -0.5),
		new THREE.Vector3(0.5, 0.0, 0.5),

		// Bottom
		new THREE.Vector3(-0.5, 0.0, 0.5),
		new THREE.Vector3(0.5, 0.0, 0.5),
		new THREE.Vector3(0.5, 0.0, -0.5),
		new THREE.Vector3(-0.5, 0.0, -0.5),

		// Top
		new THREE.Vector3(-0.5, 1.0, -0.5),
		new THREE.Vector3(0.5, 1.0, -0.5),
		new THREE.Vector3(0.5, 1.0, 0.5),
		new THREE.Vector3(-0.5, 1.0, 0.5),
	];
	public static NB_VERTICES = 24;
	public static TEXTURES = [
		// Front
		[1, 5],
		[2, 5],
		[2, 6],
		[1, 6],

		// Back
		[3, 5],
		[4, 5],
		[4, 6],
		[3, 6],

		// Left
		[0, 5],
		[1, 5],
		[1, 6],
		[0, 6],

		// Right
		[2, 5],
		[3, 5],
		[3, 6],
		[2, 6],

		// Bottom
		[1, 6],
		[2, 6],
		[2, 7],
		[1, 7],

		// Top
		[1, 0],
		[2, 0],
		[2, 5],
		[1, 5],
	];
	public static TEXTURES_VALUES = [0.0, 0.25, 0.5, 0.75, 1.0, 0.333333333333333, 0.666666666666666, 1.0];
	public static INDEXES = [
		0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21,
		22, 20, 22, 23,
	];

	static fromJSON(json: Record<string, any>): MapElement.Object3DBox {
		const object = new MapElement.Object3DBox();
		if (json) {
			object.read(json);
		}
		return object;
	}

	static create(data: Model.Object3D): MapElement.Object3DBox {
		const object = new MapElement.Object3DBox();
		object.id = data.id;
		object.data = data;
		return object;
	}

	getCenterVector(): THREE.Vector3 {
		return new THREE.Vector3(
			this.data.getTotalWidthPixels() / 2,
			this.data.getTotalHeightPixels() / 2,
			this.data.getTotalDepthPixels() / 2
		);
	}

	isCentered(): boolean {
		return !this.data.isTopLeft;
	}

	getLocalPosition(position: Position): THREE.Vector3 {
		const localPosition = position.toVector3(false);
		if (this.data.isTopLeft) {
			localPosition.setX(
				localPosition.x - Math.floor(Project.SQUARE_SIZE / 2) + position.getPixelsCenterX() + Object3DBox.COEF
			);
			localPosition.setZ(
				localPosition.z - Math.floor(Project.SQUARE_SIZE / 2) + position.getPixelsCenterZ() + Object3DBox.COEF
			);
		} else {
			localPosition.setX(localPosition.x + position.getPixelsCenterX() + Object3DBox.COEF);
			localPosition.setZ(localPosition.z + position.getPixelsCenterZ() + Object3DBox.COEF);
		}
		localPosition.setY(localPosition.y + Object3DBox.COEF);
		return localPosition;
	}

	getPositionFromVec3(vec: THREE.Vector3, rotation: THREE.Euler): Position {
		const v = vec.clone();
		if (this.data.isTopLeft) {
			v.setX(v.x + Math.floor(Project.SQUARE_SIZE / 2));
			v.setZ(v.z + Math.floor(Project.SQUARE_SIZE / 2));
		}
		return Position.createFromVector3(v, rotation);
	}

	getAdditionalX(): number {
		return this.data.isTopLeft ? 0 : Math.floor(Project.SQUARE_SIZE / 2);
	}

	getAdditionalZ(): number {
		return this.data.isTopLeft ? 0 : Math.floor(Project.SQUARE_SIZE / 2);
	}

	updateGeometry(geometry: CustomGeometry, position: Position, count: number): number {
		const localPosition = this.getLocalPosition(position);
		const size = this.data.getSizeVector().multiply(position.toScaleVector());
		size.setX(size.x - 2 * Object3DBox.COEF);
		size.setY(size.y - 2 * Object3DBox.COEF);
		size.setZ(size.z - 2 * Object3DBox.COEF);
		const w = this.data.getTotalWidthPixels();
		const h = this.data.getTotalHeightPixels();
		const d = this.data.getTotalDepthPixels();

		// Textures
		const textures = Object3DBox.TEXTURES_VALUES.slice(0);
		if (!this.data.stretch) {
			const totalX = d * 2 + w * 2;
			const totalY = d * 2 + h;
			textures[1] = d / totalX;
			textures[2] = (d + w) / totalX;
			textures[3] = (2 * d + w) / totalX;
			textures[5] = d / totalY;
			textures[6] = (d + h) / totalY;
		}

		// Vertices + faces / indexes
		for (let i = 0; i < Object3DBox.NB_VERTICES; i += 4) {
			let vertices = this.data.isTopLeft ? Object3DBox.VERTICES : Object3DBox.VERTICES_CENTER;
			const vecA = vertices[i].clone();
			const vecB = vertices[i + 1].clone();
			const vecC = vertices[i + 2].clone();
			const vecD = vertices[i + 3].clone();
			vecA.multiply(size);
			vecB.multiply(size);
			vecC.multiply(size);
			vecD.multiply(size);
			vecA.add(localPosition);
			vecB.add(localPosition);
			vecC.add(localPosition);
			vecD.add(localPosition);
			const tA = Object3DBox.TEXTURES[i];
			const tB = Object3DBox.TEXTURES[i + 1];
			const tC = Object3DBox.TEXTURES[i + 2];
			const tD = Object3DBox.TEXTURES[i + 3];
			const texA = new THREE.Vector2(textures[tA[0]], textures[tA[1]]);
			const texB = new THREE.Vector2(textures[tB[0]], textures[tB[1]]);
			const texC = new THREE.Vector2(textures[tC[0]], textures[tC[1]]);
			const texD = new THREE.Vector2(textures[tD[0]], textures[tD[1]]);
			Base.rotateQuadEuler(vecA, vecB, vecC, vecD, localPosition, position.toRotationEuler());
			count = Sprite.addStaticSpriteToGeometry(
				geometry,
				vecA,
				vecB,
				vecC,
				vecD,
				texA,
				texB,
				texC,
				texD,
				count,
				position
			);
		}
		return count;
	}

	createGeometry(position: Position): [CustomGeometry, number] {
		const geometry = new CustomGeometry();
		const count = this.updateGeometry(geometry, position, 0);
		geometry.updateAttributes();
		return [geometry, count];
	}
}

export { Object3DBox };
