/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Manager, MapElement, Model, Scene } from '../Editor';
import { Base } from './Base';
import { BINDING, BindingType, Constants, ELEMENT_MAP_KIND, PICTURE_KIND, SPRITE_WALL_TYPE, Utils } from '../common';
import { CustomGeometry, Picture2D, Position, Project } from '../core';
import { Sprite } from './Sprite';

class SpriteWall extends Base {
	public wallID!: number;
	public type!: SPRITE_WALL_TYPE;

	constructor() {
		super();
		this.kind = ELEMENT_MAP_KIND.SPRITE_WALL;
	}

	public static readonly bindings: BindingType[] = [
		['wallID', 'w', undefined, BINDING.NUMBER],
		['type', 't', undefined, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...SpriteWall.bindings, ...additionnalBinding];
	}

	static fromJSON(json: Record<string, any>): SpriteWall {
		const wall = new SpriteWall();
		if (json) {
			wall.read(json);
		}
		return wall;
	}

	static create(id: number, type: SPRITE_WALL_TYPE): SpriteWall {
		const wall = new SpriteWall();
		wall.wallID = id;
		wall.type = type;
		return wall;
	}

	static getWallTexture(id: number): THREE.MeshPhongMaterial | null {
		const textureWall =
			Scene.Map.current!.texturesWalls[Project.current!.specialElements.getWallByID(id).pictureID];
		return textureWall || null;
	}

	static async loadWallTexture(id: number): Promise<THREE.MeshPhongMaterial> {
		const wall = Project.current!.specialElements.getWallByID(id);
		const pictureID = wall.pictureID;
		let textureWall = Scene.Map.current ? Scene.Map.current.texturesWalls[pictureID] : null;
		if (!textureWall) {
			if (wall) {
				const picture = Project.current!.pictures.getByID(PICTURE_KIND.WALLS, pictureID);
				if (picture) {
					textureWall = await this.loadTextureWall(picture, id);
				} else {
					textureWall = Manager.GL.loadTextureEmpty();
				}
			} else {
				textureWall = Manager.GL.loadTextureEmpty();
			}
			if (Scene.Map.current) {
				Scene.Map.current.texturesWalls[pictureID] = textureWall;
			}
		}
		return textureWall;
	}

	static async loadTextureWall(picture: Model.Picture, id: number): Promise<THREE.MeshPhongMaterial> {
		const image = await Picture2D.loadImage(picture.getPath());
		const texture = new THREE.Texture();
		const w = image.width;
		const h = image.height;
		if (w === 0 || h === 0) {
			return Manager.GL.loadTextureEmpty();
		}

		// Update picture infos for collisions
		picture.width = Math.floor(w / Project.getSquareSize());
		picture.height = Math.floor(h / Project.getSquareSize());
		Scene.Map.ctxRendering!.clearRect(0, 0, Scene.Map.canvasRendering!.width, Scene.Map.canvasRendering!.height);
		Scene.Map.canvasRendering!.width = w + Project.getSquareSize();
		Scene.Map.canvasRendering!.height = h;
		Scene.Map.ctxRendering!.drawImage(image, 0, 0);
		const left = Scene.Map.ctxRendering!.getImageData(0, 0, Math.floor(Project.getSquareSize() / 2), h);
		const right = Scene.Map.ctxRendering!.getImageData(
			w - Math.floor(Project.getSquareSize() / 2),
			0,
			Math.floor(Project.getSquareSize() / 2),
			image.height
		);
		try {
			Scene.Map.ctxRendering!.putImageData(left, w, 0);
			Scene.Map.ctxRendering!.putImageData(right, w + Math.floor(Project.getSquareSize() / 2), 0);
		} catch (e) {
			console.error(
				'Error: Wrong wall (with ID:' + id + ') parsing. Please verify that you have a 3 x 3 picture.'
			);
		}
		texture.image = await Picture2D.loadImage(Scene.Map.canvasRendering!.toDataURL());
		texture.needsUpdate = true;
		return Manager.GL.createMaterial({ texture });
	}

	static getWall(position: Position) {
		// const portion = Scene.Map.current!.getLocalPortion(position);
		// TODO
		// MapPortion* mapPortion = map->mapPortion(portion);
		const mapPortion = Scene.Map.current!.mapPortion;
		return mapPortion !== null ? mapPortion.model.walls.get(position.toKey()) || null : null;
	}

	static addType(tA: SPRITE_WALL_TYPE, tB: SPRITE_WALL_TYPE) {
		if (tA === SPRITE_WALL_TYPE.MIDDLE) {
			return tB;
		}
		if (tB === SPRITE_WALL_TYPE.MIDDLE) {
			return tA;
		}
		return tA === tB ? tA : SPRITE_WALL_TYPE.LEFT_RIGHT;
	}

	static isWallHere(sprite: SpriteWall | null, id: number) {
		return sprite !== null && sprite.wallID === id;
	}

	static updateAround(position: Position) {
		const positionLeft = position.getLeft();
		const positionRight = position.getRight();
		const positionTopLeft = position.getTopLeft();
		const positionTopRight = position.getTopRight();
		const positionBotLeft = position.getBotLeft();
		const positionBotRight = position.getBotRight();
		const sprite = this.getWall(position);
		const spriteLeft = this.getWall(positionLeft);
		const spriteRight = this.getWall(positionRight);
		const spriteTopLeft = this.getWall(positionTopLeft);
		const spriteTopRight = this.getWall(positionTopRight);
		const spriteBotLeft = this.getWall(positionBotLeft);
		const spriteBotRight = this.getWall(positionBotRight);
		sprite?.update(position);
		spriteLeft?.update(positionLeft);
		spriteRight?.update(positionRight);
		spriteTopLeft?.update(positionTopLeft);
		spriteTopRight?.update(positionTopRight);
		spriteBotLeft?.update(positionBotLeft);
		spriteBotRight?.update(positionBotRight);
	}

	equals(mapElement: MapElement.Base) {
		if (mapElement.kind === this.kind) {
			const wall = mapElement as MapElement.SpriteWall;
			return wall.wallID === this.wallID;
		} else {
			return false;
		}
	}

	toString(): string {
		return `WALL | ID: ${Utils.formatNumberID(this.wallID)}`;
	}

	updateGeometry(geometry: CustomGeometry, position: Position, width: number, height: number, count: number): number {
		const vecA = new THREE.Vector3(-0.5, 1.0, 0.0);
		const vecB = new THREE.Vector3(0.5, 1.0, 0.0);
		const vecC = new THREE.Vector3(0.5, 0.0, 0.0);
		const vecD = new THREE.Vector3(-0.5, 0.0, 0.0);
		const center = new THREE.Vector3();
		const size = new THREE.Vector3(Project.getSquareSize(), height, 0);
		const angle = position.angleY;
		const localPosition = position.toVector3();

		// Scale
		vecA.multiply(size);
		vecB.multiply(size);
		vecC.multiply(size);
		vecD.multiply(size);

		// Move to coords
		vecA.add(localPosition);
		vecB.add(localPosition);
		vecC.add(localPosition);
		vecD.add(localPosition);
		center.add(localPosition);

		// Getting UV coordinates
		const textureRect = [this.type, 0, 1, Math.floor(height / Project.getSquareSize())];
		let x = (textureRect[0] * Project.getSquareSize()) / width;
		let y = textureRect[1];
		let w = Project.getSquareSize() / width;
		let h = 1.0;
		const coefX: number = Base.COEF_TEX / width;
		const coefY: number = Base.COEF_TEX / height;
		x += coefX;
		y += coefY;
		w -= coefX * 2;
		h -= coefY * 2;
		const texA = new THREE.Vector2();
		const texB = new THREE.Vector2();
		const texC = new THREE.Vector2();
		const texD = new THREE.Vector2();
		CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, x, y, w, h);

		// Add sprite to geometry
		Base.rotateQuad(vecA, vecB, vecC, vecD, center, angle, Sprite.Y_AXIS);
		return Sprite.addStaticSpriteToGeometry(
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

	update(position: Position) {
		// Getting all sprites
		const spriteLeft = SpriteWall.getWall(position.getLeft());
		const spriteRight = SpriteWall.getWall(position.getRight());
		const spriteTopLeft = SpriteWall.getWall(position.getTopLeft());
		const spriteTopRight = SpriteWall.getWall(position.getTopRight());
		const spriteBotLeft = SpriteWall.getWall(position.getBotLeft());
		const spriteBotRight = SpriteWall.getWall(position.getBotRight());

		// Borders
		let tA: SPRITE_WALL_TYPE;
		if (!SpriteWall.isWallHere(spriteLeft, this.wallID) && !SpriteWall.isWallHere(spriteRight, this.wallID)) {
			tA = SPRITE_WALL_TYPE.LEFT_RIGHT;
		} else if (!SpriteWall.isWallHere(spriteLeft, this.wallID)) {
			tA = SPRITE_WALL_TYPE.LEFT;
		} else if (!SpriteWall.isWallHere(spriteRight, this.wallID)) {
			tA = SPRITE_WALL_TYPE.RIGHT;
		} else {
			tA = SPRITE_WALL_TYPE.MIDDLE;
		}

		// Diagonals
		const diagLeft =
			SpriteWall.isWallHere(spriteTopLeft, this.wallID) || SpriteWall.isWallHere(spriteBotLeft, this.wallID);
		const diagRight =
			SpriteWall.isWallHere(spriteTopRight, this.wallID) || SpriteWall.isWallHere(spriteBotRight, this.wallID);
		let tB: SPRITE_WALL_TYPE;
		if (diagLeft && diagRight) {
			tB = SPRITE_WALL_TYPE.LEFT_RIGHT;
		} else if (diagLeft) {
			tB = SPRITE_WALL_TYPE.LEFT;
		} else if (diagRight) {
			tB = SPRITE_WALL_TYPE.RIGHT;
		} else {
			tB = SPRITE_WALL_TYPE.MIDDLE;
		}

		this.type = SpriteWall.addType(tA, tB);
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, SpriteWall.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, SpriteWall.getBindings(additionnalBinding));
	}
}

export { SpriteWall };
