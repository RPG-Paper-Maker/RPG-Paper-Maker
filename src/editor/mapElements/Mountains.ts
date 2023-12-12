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
import { CustomGeometry, Picture2D, Portion, Position, Project } from '../core';
import { PICTURE_KIND } from '../common';

class Mountains {
	public pictureID: number;
	public material: THREE.MeshPhongMaterial;
	public width: number;
	public height: number;
	public geometry: CustomGeometry;
	public count: number;
	public mesh: THREE.Mesh | null;

	constructor(pictureID: number, material: THREE.MeshPhongMaterial) {
		this.pictureID = pictureID;
		this.material = material;
		const { width, height } = Manager.GL.getMaterialTextureSize(material);
		this.width = width;
		this.height = height;
		this.geometry = new CustomGeometry();
		this.count = 0;
		this.mesh = null;
	}

	static calculateAngle(width: number, height: number) {
		return width === 0 ? 90 : (Math.atan(height / width) * 180) / Math.PI;
	}

	static getMountainTexture(id: number): THREE.MeshPhongMaterial | null {
		return (
			Scene.Map.current!.texturesMountains.get(Project.current!.specialElements.getMountainByID(id).pictureID) ||
			null
		);
	}

	static async loadMountainTexture(id: number): Promise<THREE.MeshPhongMaterial> {
		const mountain = Project.current!.specialElements.getMountainByID(id);
		const pictureID = mountain.pictureID;
		let textureMountain = Scene.Map.current ? Scene.Map.current.texturesMountains.get(pictureID) : null;
		if (!textureMountain) {
			if (mountain) {
				const picture = Project.current!.pictures.getByID(PICTURE_KIND.MOUNTAINS, pictureID);
				textureMountain = picture ? await this.loadTextureMountain(picture) : Manager.GL.loadTextureEmpty();
			} else {
				textureMountain = Manager.GL.loadTextureEmpty();
			}
			if (Scene.Map.current) {
				Scene.Map.current.texturesMountains.set(pictureID, textureMountain);
			}
		}
		return textureMountain;
	}

	static async loadTextureMountain(picture: Model.Picture): Promise<THREE.MeshPhongMaterial> {
		const image = await Picture2D.loadImage(picture.getPath());

		let sourceSize = 3 * Project.SQUARE_SIZE;
		let sDiv = Math.round(Project.SQUARE_SIZE / 2);

		// Draw original image
		Scene.Map.ctxRendering!.clearRect(0, 0, Scene.Map.canvasRendering!.width, Scene.Map.canvasRendering!.height);
		Scene.Map.canvasRendering!.width = 4 * Project.SQUARE_SIZE;
		Scene.Map.canvasRendering!.height = 5 * Project.SQUARE_SIZE;
		Scene.Map.ctxRendering!.drawImage(image, 0, 0);

		// Add left/right autos
		try {
			for (let i = 0, l = 3; i < l; i++) {
				Scene.Map.ctxRendering!.drawImage(
					image,
					0,
					i * Project.SQUARE_SIZE,
					sDiv,
					Project.SQUARE_SIZE,
					sourceSize,
					i * Project.SQUARE_SIZE,
					sDiv,
					Project.SQUARE_SIZE
				);
				Scene.Map.ctxRendering!.drawImage(
					image,
					sourceSize - sDiv,
					i * Project.SQUARE_SIZE,
					sDiv,
					Project.SQUARE_SIZE,
					sourceSize + sDiv,
					i * Project.SQUARE_SIZE,
					sDiv,
					Project.SQUARE_SIZE
				);
			}

			// Add top/bot autos
			for (let i = 0, l = 3; i < l; i++) {
				Scene.Map.ctxRendering!.drawImage(
					image,
					i * Project.SQUARE_SIZE,
					0,
					Project.SQUARE_SIZE,
					sDiv,
					i * Project.SQUARE_SIZE,
					sourceSize,
					Project.SQUARE_SIZE,
					sDiv
				);
				Scene.Map.ctxRendering!.drawImage(
					image,
					i * Project.SQUARE_SIZE,
					sourceSize - sDiv,
					Project.SQUARE_SIZE,
					sDiv,
					i * Project.SQUARE_SIZE,
					sourceSize + sDiv,
					Project.SQUARE_SIZE,
					sDiv
				);
			}

			// Add all sides autos
			Scene.Map.ctxRendering!.drawImage(image, 0, 0, sDiv, sDiv, sourceSize, sourceSize, sDiv, sDiv);
			Scene.Map.ctxRendering!.drawImage(
				image,
				sourceSize - sDiv,
				0,
				sDiv,
				sDiv,
				sourceSize + sDiv,
				sourceSize,
				sDiv,
				sDiv
			);
			Scene.Map.ctxRendering!.drawImage(
				image,
				0,
				sourceSize - sDiv,
				sDiv,
				sDiv,
				sourceSize,
				sourceSize + sDiv,
				sDiv,
				sDiv
			);
			Scene.Map.ctxRendering!.drawImage(
				image,
				sourceSize - sDiv,
				sourceSize - sDiv,
				sDiv,
				sDiv,
				sourceSize + sDiv,
				sourceSize + sDiv,
				sDiv,
				sDiv
			);
		} catch (e) {
			console.error(
				'Error: Wrong mountain (with ID:' +
					picture.id +
					') parsing. Please verify that you have a 3 x 3 picture.'
			);
		}
		const texture = new THREE.Texture();
		texture.image = await Picture2D.loadImage(Scene.Map.canvasRendering!.toDataURL());
		texture.needsUpdate = true;
		const material = Manager.GL.createMaterial({ texture: texture, side: THREE.BackSide });
		if (Scene.Map.current) {
			Scene.Map.current.texturesMountains.set(picture.id, material);
		}
		return material;
	}

	static getMountainHere(position: Position, portion: Portion) {
		const newPortion = Scene.Map.current!.getLocalPortion(position);
		if (portion.equals(newPortion)) {
			return Scene.Map.current!.mapPortion.model.mountains.get(position.toKey()); // TODO
		} else {
			// If out of current portion
		}
	}

	static updateAround(position: Position, portionsToUpdate: Portion[], portionsToSave: Portion[]) {
		const portion = Scene.Map.current!.getLocalPortion(position);
		const positions = [
			position.getSquareLeft(),
			position.getSquareRight(),
			position.getSquareTop(),
			position.getSquareBot(),
		];
		Mountains.getMountainHere(position, portion)?.update(position, portion);
		for (const aroundPosition of positions) {
			const newPortion = Scene.Map.current!.getLocalPortion(aroundPosition);
			const mountain = Mountains.getMountainHere(aroundPosition, newPortion);
			if (mountain) {
				if (mountain.update(aroundPosition, newPortion)) {
					if (!portion.equals(newPortion)) {
						// TODO
					}
				}
			}
		}
	}

	updateGeometry(position: Position, mountain: MapElement.Mountain) {
		this.count = mountain.updateGeometry(this.geometry, position, this.count);
	}

	createMesh(): boolean {
		if (this.geometry.isEmpty()) {
			return false;
		}
		this.geometry.updateAttributes();
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		return true;
	}
}

export { Mountains };
