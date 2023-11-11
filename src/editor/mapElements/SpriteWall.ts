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
import { BINDING, BindingType, ELEMENT_MAP_KIND, PICTURE_KIND, SPRITE_WALL_TYPE } from '../common';
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

	static create(id: number, type: number): SpriteWall {
		const wall = new SpriteWall();
		wall.kind = ELEMENT_MAP_KIND.SPRITE_WALL;
		wall.wallID = id;
		wall.type = type;
		return wall;
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
		let texture = new THREE.Texture();
		let w = image.width;
		let h = image.height;
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
		let left = Scene.Map.ctxRendering!.getImageData(0, 0, Math.floor(Project.getSquareSize() / 2), h);
		let right = Scene.Map.ctxRendering!.getImageData(
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
		return Manager.GL.createMaterial({ texture: texture });
	}

	equals(mapElement: MapElement.Base) {
		if (mapElement.kind === this.kind) {
			const wall = mapElement as MapElement.SpriteWall;
			return wall.wallID === this.wallID;
		} else {
			return false;
		}
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
		return Sprite.addStaticSpriteToGeometry(geometry, vecA, vecB, vecC, vecD, texA, texB, texC, texD, count);
	}
}

export { SpriteWall };
