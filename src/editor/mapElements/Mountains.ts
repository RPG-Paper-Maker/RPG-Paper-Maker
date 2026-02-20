/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Manager, MapElement, Model, Scene } from '../Editor';
import { PICTURE_KIND } from '../common';
import { CustomGeometry } from '../core/CustomGeometry';
import { Picture2D } from '../core/Picture2D';
import { Position } from '../core/Position';
import { Project } from '../core/Project';

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

	static getMountainTexture(map: Scene.Map, id: number): THREE.MeshPhongMaterial | null {
		return map.texturesMountains.get(Project.current!.specialElements.getMountainByID(id)?.pictureID) || null;
	}

	static async loadMountainTexture(map: Scene.Map | null, id: number): Promise<THREE.MeshPhongMaterial> {
		const mountain = Project.current!.specialElements.getMountainByID(id);
		const pictureID = mountain?.pictureID;
		let textureMountain = map ? map.texturesMountains.get(pictureID) : null;
		if (!textureMountain) {
			if (mountain) {
				const picture = Project.current!.pictures.getByID(PICTURE_KIND.MOUNTAINS, pictureID);
				textureMountain = picture
					? await this.loadTextureMountain(map, picture)
					: Manager.GL.loadTextureEmpty();
			} else {
				textureMountain = Manager.GL.loadTextureEmpty();
			}
			if (map) {
				map.texturesMountains.set(pictureID, textureMountain);
			}
		}
		return textureMountain;
	}

	static async loadTextureMountain(map: Scene.Map | null, picture: Model.Picture): Promise<THREE.MeshPhongMaterial> {
		const image = await Picture2D.loadImage(await picture.getPathOrBase64());
		if (image.width === 0 || image.height === 0) {
			return Manager.GL.loadTextureEmpty();
		}
		const sourceSize = 3 * Project.SQUARE_SIZE;
		const sDiv = Math.round(Project.SQUARE_SIZE / 2);

		// Draw original image
		Scene.Map.ctxRendering!.clearRect(0, 0, Scene.Map.canvasRendering!.width, Scene.Map.canvasRendering!.height);
		Scene.Map.canvasRendering!.width = 4 * Project.SQUARE_SIZE;
		Scene.Map.canvasRendering!.height = 7 * Project.SQUARE_SIZE;
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
					Project.SQUARE_SIZE,
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
					Project.SQUARE_SIZE,
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
					sDiv,
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
					sDiv,
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
				sDiv,
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
				sDiv,
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
				sDiv,
			);

			// Repeated mid (for corners)
			for (let i = 0, l = 3; i < l; i++) {
				for (let j = 0, m = 4; j < m; j++) {
					Scene.Map.ctxRendering!.drawImage(
						image,
						Project.SQUARE_SIZE,
						i * Project.SQUARE_SIZE,
						Project.SQUARE_SIZE,
						Project.SQUARE_SIZE,
						j * Project.SQUARE_SIZE,
						(4 + i) * Project.SQUARE_SIZE,
						Project.SQUARE_SIZE,
						Project.SQUARE_SIZE,
					);
				}
			}
		} catch {
			console.error(
				'Error: Wrong mountain (with ID:' +
					picture.id +
					') parsing. Please verify that you have a 3 x 3 picture.',
			);
		}
		const texture = new THREE.Texture();
		texture.image = await Picture2D.loadImage(Scene.Map.canvasRendering!.toDataURL());
		texture.needsUpdate = true;
		const material = Manager.GL.createMaterial({ texture, side: THREE.BackSide });
		if (map) {
			map.texturesMountains.set(picture.id, material);
		}
		return material;
	}

	static getMountainHere(map: Scene.Map, position: Position) {
		return map.getMapPortionByPosition(position)?.model.mountains.get(position.toKey());
	}

	static updateAround(map: Scene.Map, position: Position) {
		const globalPortion = position.getGlobalPortion();
		const positions = [
			position.getSquareLeft(),
			position.getSquareRight(),
			position.getSquareTop(),
			position.getSquareBot(),
		];
		Mountains.getMountainHere(map, position)?.update(map, position);
		for (const aroundPosition of positions) {
			const newGlobalPortion = aroundPosition.getGlobalPortion();
			const mountain = Mountains.getMountainHere(map, aroundPosition);
			if (mountain) {
				if (mountain.update(map, aroundPosition)) {
					if (!globalPortion.equals(newGlobalPortion)) {
						const mapPortion = map.getMapPortionFromGlobalPortion(newGlobalPortion);
						if (mapPortion) {
							map.portionsToUpdate.add(mapPortion);
							map.portionsToSave.add(mapPortion);
						}
					}
				}
			}
		}
	}

	updateGeometry(position: Position, mountain: MapElement.Mountain) {
		this.count = mountain.updateGeometry(this.geometry, position, this.count);
	}

	createMesh(): boolean {
		if (this.geometry.isEmpty() || !this.material) {
			return false;
		}
		this.geometry.updateAttributes();
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		return true;
	}
}

export { Mountains };
