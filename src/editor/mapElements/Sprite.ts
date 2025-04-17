/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { MeshPhongMaterial, Vector2, Vector3 } from 'three';
import { BINDING, BindingType, ELEMENT_MAP_KIND, JSONType, PICTURE_KIND } from '../common';
import { CustomGeometry, CustomGeometryFace, Position, Project, Rectangle } from '../core';
import { Manager, MapElement, Scene } from '../Editor';
import { Base } from './Base';

const { t } = i18next;
class Sprite extends Base {
	public static readonly MODEL = [
		new Vector3(-0.5, 1.0, 0.0),
		new Vector3(0.5, 1.0, 0.0),
		new Vector3(0.5, 0.0, 0.0),
		new Vector3(-0.5, 0.0, 0.0),
	];

	public texture!: Rectangle;

	public static readonly bindings: BindingType[] = [['kind', 'k', undefined, BINDING.NUMBER]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Sprite.bindings, ...additionnalBinding];
	}

	static fromJSON(json: JSONType): Sprite {
		const sprite = new Sprite();
		if (json) {
			sprite.read(json);
		}
		return sprite;
	}

	static create(
		kind: ELEMENT_MAP_KIND,
		texture: Rectangle,
		front = true,
		xOffset = 0,
		yOffset = 0,
		zOffset = 0
	): Sprite {
		const sprite = new Sprite();
		sprite.kind = kind;
		sprite.texture = texture;
		sprite.front = front;
		sprite.xOffset = xOffset;
		sprite.yOffset = yOffset;
		sprite.zOffset = zOffset;
		return sprite;
	}

	static addStaticSpriteToGeometry(
		geometry: CustomGeometry,
		vecA: Vector3,
		vecB: Vector3,
		vecC: Vector3,
		vecD: Vector3,
		texA: Vector2,
		texB: Vector2,
		texC: Vector2,
		texD: Vector2,
		count: number,
		position: Position
	): number {
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);
		geometry.pushQuadIndices(count, position);
		geometry.pushQuadUVs(texA, texB, texC, texD);
		return count + 4;
	}

	static getCharacterTexture(map: Scene.Map, id: number): MeshPhongMaterial | null {
		return map.texturesCharacters[id] || null;
	}

	static async loadCharacterTexture(map: Scene.Map | null, id: number): Promise<MeshPhongMaterial> {
		let textureCharacter = map ? map.texturesCharacters[id] : null;
		if (!textureCharacter) {
			const picture = Project.current!.pictures.getByID(PICTURE_KIND.CHARACTERS, id);
			if (picture) {
				const path = await picture.getPathOrBase64();
				textureCharacter = path ? await Manager.GL.loadTexture(path) : Manager.GL.loadTextureEmpty();
			} else {
				textureCharacter = Manager.GL.loadTextureEmpty();
			}
			map!.texturesCharacters[id] = textureCharacter;
		}
		return textureCharacter;
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
				type = t('face.sprite').toUpperCase();
				break;
			case ELEMENT_MAP_KIND.SPRITE_FIX:
				type = t('fix.sprite').toUpperCase();
				break;
			case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
				type = t('double.sprite').toUpperCase();
				break;
			case ELEMENT_MAP_KIND.SPRITE_QUADRA:
				type = t('quadra.sprite').toUpperCase();
				break;
		}
		return `${type} | ${this.texture.toString()}`;
	}

	getVectors(
		map: Scene.Map,
		vecA: Vector3,
		vecB: Vector3,
		vecC: Vector3,
		vecD: Vector3,
		pos: Vector3,
		position: Position,
		size: Vector3,
		forceOffset = false
	) {
		// Apply an offset according to layer position
		let zPlus = 0;
		if (forceOffset) {
			zPlus = position.layer * map.camera.getYOffsetDepth();
			if (this.kind !== ELEMENT_MAP_KIND.SPRITE_FACE && !this.front) {
				zPlus *= -1;
			}
		}
		pos.setX(this.xOffset * Project.SQUARE_SIZE);
		pos.setY(this.yOffset * Project.SQUARE_SIZE);
		pos.setZ(this.zOffset * Project.SQUARE_SIZE + zPlus);
		vecA.multiply(size);
		vecB.multiply(size);
		vecC.multiply(size);
		vecD.multiply(size);
		vecA.add(pos);
		vecB.add(pos);
		vecC.add(pos);
		vecD.add(pos);
	}

	updateGeometry(
		map: Scene.Map,
		geometry: CustomGeometry | CustomGeometryFace,
		width: number,
		height: number,
		position: Position,
		count: number,
		tileset: boolean,
		localPosition: Vector3 | null,
		forceOffset = false
	): number {
		const vecA = Sprite.MODEL[0].clone();
		const vecB = Sprite.MODEL[1].clone();
		const vecC = Sprite.MODEL[2].clone();
		const vecD = Sprite.MODEL[3].clone();
		const center = new Vector3();
		const pos = new Vector3();
		const size = new Vector3(
			this.texture.width * Project.SQUARE_SIZE * position.scaleX,
			this.texture.height * Project.SQUARE_SIZE * position.scaleY,
			1.0
		);

		// For static sprites
		this.getVectors(map, vecA, vecB, vecC, vecD, pos, position, size, forceOffset);
		if (localPosition !== null) {
			vecA.add(localPosition);
			vecB.add(localPosition);
			vecC.add(localPosition);
			vecD.add(localPosition);
			center.add(localPosition);
			pos.add(localPosition);
		} else {
			localPosition = tileset ? position.toVector3() : new Vector3();
		}

		// Getting UV coordinates
		let x = (this.texture.x * Project.SQUARE_SIZE) / width;
		let y = (this.texture.y * Project.SQUARE_SIZE) / height;
		let w = (this.texture.width * Project.SQUARE_SIZE) / width;
		let h = (this.texture.height * Project.SQUARE_SIZE) / height;
		const coefX = Base.COEF_TEX / width;
		const coefY = Base.COEF_TEX / height;
		x += coefX;
		y += coefY;
		w -= coefX * 2;
		h -= coefY * 2;
		const texA = new Vector2();
		const texB = new Vector2();
		const texC = new Vector2();
		const texD = new Vector2();
		CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, x, y, w, h);

		if (geometry instanceof CustomGeometryFace) {
			// Face sprite
			const p = new Vector3(pos.x, localPosition.y + this.yOffset * Project.SQUARE_SIZE, pos.z);
			const c = new Vector3(center.x, localPosition.y + this.yOffset * Project.SQUARE_SIZE, center.z);
			geometry.pushQuadVerticesFace(
				Sprite.MODEL[0].clone().multiply(size).add(p),
				Sprite.MODEL[1].clone().multiply(size).add(p),
				Sprite.MODEL[2].clone().multiply(size).add(p),
				Sprite.MODEL[3].clone().multiply(size).add(p),
				c
			);
			geometry.pushQuadIndices(count, position);
			geometry.pushQuadUVs(texA, texB, texC, texD);
			count = count + 4;
		} else {
			// Simple sprite
			center.setX(center.x + this.xOffset * Project.SQUARE_SIZE);
			center.setZ(center.z + this.zOffset * Project.SQUARE_SIZE);
			const vecSimpleA = vecA.clone();
			const vecSimpleB = vecB.clone();
			const vecSimpleC = vecC.clone();
			const vecSimpleD = vecD.clone();
			Base.rotateQuadEuler(vecSimpleA, vecSimpleB, vecSimpleC, vecSimpleD, center, position.toRotationEuler());
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
			Base.rotateQuadEuler(vecDoubleA, vecDoubleB, vecDoubleC, vecDoubleD, center, position.toRotationEuler());
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
				Base.rotateQuadEuler(
					vecQuadra1A,
					vecQuadra1B,
					vecQuadra1C,
					vecQuadra1D,
					center,
					position.toRotationEuler()
				);
				Base.rotateQuad(vecQuadra2A, vecQuadra2B, vecQuadra2C, vecQuadra2D, center, -45, Sprite.Y_AXIS);
				Base.rotateQuadEuler(
					vecQuadra2A,
					vecQuadra2B,
					vecQuadra2C,
					vecQuadra2D,
					center,
					position.toRotationEuler()
				);
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

	createGeometry(
		map: Scene.Map,
		width: number,
		height: number,
		tileset: boolean,
		position: Position
	): [CustomGeometry, number] {
		const geometry = new CustomGeometry();
		const count = this.updateGeometry(map, geometry, width, height, position, 0, tileset, null);
		geometry.updateAttributes();
		return [geometry, count];
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Sprite.getBindings(additionnalBinding));
		this.texture = new Rectangle();
		this.texture.read(json.t as number[]);
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Sprite.getBindings(additionnalBinding));
		json.t = [];
		this.texture.write(json.t as number[], true);
	}
}

export { Sprite };
