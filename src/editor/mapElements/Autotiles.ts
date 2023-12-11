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
import { CustomGeometry, Picture2D, Portion, Position, Project, Rectangle, TextureBundle } from '../core';
import { AUTOTILE_TILE_NAMES, Constants, PICTURE_KIND } from '../common';

class Autotiles {
	public static COUNT_LIST = 5;
	public static PREVIEW_TILE = 159;
	public static LIST_A = [
		AUTOTILE_TILE_NAMES.A1,
		AUTOTILE_TILE_NAMES.A2,
		AUTOTILE_TILE_NAMES.A3,
		AUTOTILE_TILE_NAMES.A4,
		AUTOTILE_TILE_NAMES.A5,
	];
	public static LIST_B = [
		AUTOTILE_TILE_NAMES.B1,
		AUTOTILE_TILE_NAMES.B2,
		AUTOTILE_TILE_NAMES.B3,
		AUTOTILE_TILE_NAMES.B4,
		AUTOTILE_TILE_NAMES.B5,
	];
	public static LIST_C = [
		AUTOTILE_TILE_NAMES.C1,
		AUTOTILE_TILE_NAMES.C2,
		AUTOTILE_TILE_NAMES.C3,
		AUTOTILE_TILE_NAMES.C4,
		AUTOTILE_TILE_NAMES.C5,
	];
	public static LIST_D = [
		AUTOTILE_TILE_NAMES.D1,
		AUTOTILE_TILE_NAMES.D2,
		AUTOTILE_TILE_NAMES.D3,
		AUTOTILE_TILE_NAMES.D4,
		AUTOTILE_TILE_NAMES.D5,
	];
	public static AUTOTILE_BORDER: Record<AUTOTILE_TILE_NAMES, number> = {
		A1: 2,
		B1: 3,
		C1: 6,
		D1: 7,
		A2: 8,
		B4: 9,
		A4: 10,
		B2: 11,
		C5: 12,
		D3: 13,
		C3: 14,
		D5: 15,
		A5: 16,
		B3: 17,
		A3: 18,
		B5: 19,
		C2: 20,
		D4: 21,
		C4: 22,
		D2: 23,
	};

	public bundle: TextureBundle;
	public width: number;
	public height: number;
	public geometry: CustomGeometry;
	public mesh: THREE.Mesh | null;
	public count: number;

	constructor(bundle: TextureBundle) {
		this.bundle = bundle;
		const { width, height } = Manager.GL.getMaterialTextureSize(bundle.material);
		this.width = width;
		this.height = height;
		this.geometry = new CustomGeometry();
		this.mesh = null;
		this.count = 0;
	}

	static getMaxAutotilesOffsetTexture(): number {
		return Math.floor(Constants.MAX_PICTURE_SIZE / (9 * Project.SQUARE_SIZE));
	}

	static getAutotileTexture(id: number): TextureBundle[] | null {
		const texturesAutotile =
			Scene.Map.current!.texturesAutotiles[Project.current!.specialElements.getAutotileByID(id).pictureID];
		return texturesAutotile || null;
	}

	static async loadAutotileTexture(id: number): Promise<TextureBundle[]> {
		const autotile = Project.current!.specialElements.getAutotileByID(id);
		const pictureID = autotile.pictureID;
		let texturesAutotile = Scene.Map.current ? Scene.Map.current.texturesAutotiles[pictureID] : null;
		if (!texturesAutotile) {
			let offset = 0;
			let result = null;
			let textureAutotile: TextureBundle | null = null;
			let texture = new THREE.Texture();
			texturesAutotile = [];
			if (Scene.Map.current) {
				Scene.Map.current.texturesAutotiles[pictureID] = texturesAutotile;
			}
			Scene.Map.ctxRendering!.clearRect(
				0,
				0,
				Scene.Map.canvasRendering!.width,
				Scene.Map.canvasRendering!.height
			);
			Scene.Map.canvasRendering!.width = 64 * Project.SQUARE_SIZE;
			Scene.Map.canvasRendering!.height = Constants.MAX_PICTURE_SIZE;
			if (autotile) {
				const picture = Project.current!.pictures.getByID(PICTURE_KIND.AUTOTILES, pictureID);
				if (picture) {
					result = await this.loadTextureAutotile(
						texturesAutotile,
						textureAutotile,
						texture,
						picture,
						offset,
						autotile.isAnimated
					);
				} else {
					result = null;
				}
			} else {
				result = null;
			}
			if (result !== null) {
				textureAutotile = result[0];
				texture = result[1];
				offset = result[2];
			}
			if (offset > 0 && textureAutotile) {
				await this.updateTextureAutotile(texturesAutotile, textureAutotile, texture);
			}
		}
		return texturesAutotile;
	}

	static async loadTextureAutotile(
		texturesAutotile: TextureBundle[],
		textureAutotile: TextureBundle | null,
		texture: THREE.Texture,
		picture: Model.Picture,
		offset: number,
		isAnimated: boolean
	): Promise<any[]> {
		const frames = isAnimated ? Project.current!.systems.autotilesFrames : 1;
		const image = await Picture2D.loadImage(picture.getPath());
		const width = Math.floor(image.width / 2 / Project.SQUARE_SIZE) / frames;
		const height = Math.floor(image.height / 3 / Project.SQUARE_SIZE);
		const size = width * height;
		picture.width = width;
		picture.height = height;
		for (let i = 0; i < size; i++) {
			const point = [i % width, Math.floor(i / width)];
			if (isAnimated) {
				if (textureAutotile != null) {
					await this.updateTextureAutotile(texturesAutotile, textureAutotile, texture);
					texture = new THREE.Texture();
					Scene.Map.ctxRendering!.clearRect(
						0,
						0,
						Scene.Map.canvasRendering!.width,
						Scene.Map.canvasRendering!.height
					);
					textureAutotile = null;
				}
				offset = 0;
			}
			if (offset === 0 && textureAutotile === null) {
				textureAutotile = new TextureBundle();
				textureAutotile.setBegin(picture.id, point);
				textureAutotile.isAnimated = isAnimated;
			}
			for (let j = 0; j < frames; j++) {
				const p = [point[0] * frames + j, point[1]];
				this.paintPictureAutotile(image, offset, p);
				offset++;
			}
			if (textureAutotile !== null) {
				textureAutotile.setEnd(picture.id, point);
				textureAutotile.addToList(picture.id, point);
				if (!isAnimated && offset === this.getMaxAutotilesOffsetTexture()) {
					await this.updateTextureAutotile(texturesAutotile, textureAutotile, texture);
					texture = new THREE.Texture();
					Scene.Map.ctxRendering!.clearRect(
						0,
						0,
						Scene.Map.canvasRendering!.width,
						Scene.Map.canvasRendering!.height
					);
					textureAutotile = null;
					offset = 0;
				}
			}
		}
		return [textureAutotile, texture, offset];
	}

	static paintPictureAutotile(img: HTMLImageElement, offset: number, point: number[]) {
		let row = -1;
		const offsetX = point[0] * 2 * Project.SQUARE_SIZE;
		const offsetY = point[1] * 3 * Project.SQUARE_SIZE;
		const sDiv = Math.floor(Project.SQUARE_SIZE / 2);
		const y = offset * Autotiles.COUNT_LIST * 2;
		for (let a = 0; a < Autotiles.COUNT_LIST; a++) {
			const lA = this.AUTOTILE_BORDER[Autotiles.LIST_A[a]];
			let count = 0;
			row++;
			for (let b = 0; b < Autotiles.COUNT_LIST; b++) {
				const lB = Autotiles.AUTOTILE_BORDER[Autotiles.LIST_B[b]];
				for (let c = 0; c < Autotiles.COUNT_LIST; c++) {
					const lC = Autotiles.AUTOTILE_BORDER[Autotiles.LIST_C[c]];
					for (let d = 0; d < Autotiles.COUNT_LIST; d++) {
						const lD = Autotiles.AUTOTILE_BORDER[Autotiles.LIST_D[d]];
						Scene.Map.ctxRendering!.drawImage(
							img,
							(lA % 4) * sDiv + offsetX,
							Math.floor(lA / 4) * sDiv + offsetY,
							sDiv,
							sDiv,
							count * Project.SQUARE_SIZE,
							(row + y) * Project.SQUARE_SIZE,
							sDiv,
							sDiv
						);
						Scene.Map.ctxRendering!.drawImage(
							img,
							(lB % 4) * sDiv + offsetX,
							Math.floor(lB / 4) * sDiv + offsetY,
							sDiv,
							sDiv,
							count * Project.SQUARE_SIZE + sDiv,
							(row + y) * Project.SQUARE_SIZE,
							sDiv,
							sDiv
						);
						Scene.Map.ctxRendering!.drawImage(
							img,
							(lC % 4) * sDiv + offsetX,
							Math.floor(lC / 4) * sDiv + offsetY,
							sDiv,
							sDiv,
							count * Project.SQUARE_SIZE,
							(row + y) * Project.SQUARE_SIZE + sDiv,
							sDiv,
							sDiv
						);
						Scene.Map.ctxRendering!.drawImage(
							img,
							(lD % 4) * sDiv + offsetX,
							Math.floor(lD / 4) * sDiv + offsetY,
							sDiv,
							sDiv,
							count * Project.SQUARE_SIZE + sDiv,
							(row + y) * Project.SQUARE_SIZE + sDiv,
							sDiv,
							sDiv
						);
						count++;
						if (count === 64) {
							count = 0;
							row++;
						}
					}
				}
			}
		}
	}

	static async updateTextureAutotile(
		texturesAutotile: TextureBundle[],
		textureAutotile: TextureBundle,
		texture: THREE.Texture
	) {
		texture.image = await Picture2D.loadImage(Scene.Map.canvasRendering!.toDataURL());
		texture.needsUpdate = true;
		textureAutotile.material = Manager.GL.createMaterial({ texture });
		if (Scene.Map.current) {
			textureAutotile.material.userData.uniforms.offset.value = textureAutotile.isAnimated
				? Scene.Map.current.autotilesOffset
				: new THREE.Vector2();
		}
		texturesAutotile.push(textureAutotile);
	}

	static tileExisting(position: Position, portion: Portion): MapElement.Autotile | undefined {
		const newPortion = Scene.Map.current!.getLocalPortion(position);
		if (portion.equals(newPortion)) {
			const land = Scene.Map.current!.mapPortion.model.lands.get(position.toKey()); // TODO
			if (land && land instanceof MapElement.Autotile) {
				return land;
			}
			return undefined;
		} else {
			// If out of current portion
			/*
			mapPortion = RPM::get()->project()->currentMap()->mapPortion(newPortion);
			if (mapPortion == nullptr)
			{
			return nullptr;
			} else
			{
			// Preview first
			MapElement *element = mapPortion->getPreview(position);
			if (element != nullptr && element->getKind() == MapEditorSelectionKind
			::Land && element->getSubKind() == MapEditorSubSelectionKind::Autotiles)
			{
			return reinterpret_cast<AutotileDatas *>(element);
			}
			return reinterpret_cast<
			AutotileDatas *>(mapPortion->getMapElementAt(position,
			MapEditorSelectionKind::Land, MapEditorSubSelectionKind::Autotiles));
			*/
		}
	}

	static tileOnWhatever(
		position: Position,
		portion: Portion,
		id: number,
		rect: Rectangle
	): MapElement.Autotile | null {
		const autotile = this.tileExisting(position, portion);
		return autotile && autotile.autotileID === id && autotile.texture.equals(rect) ? autotile : null;
	}

	static tileOnLeft(position: Position, portion: Portion, id: number, rect: Rectangle): MapElement.Autotile | null {
		return this.tileOnWhatever(
			new Position(position.x - 1, position.y, position.yPixels, position.z, position.layer),
			portion,
			id,
			rect
		);
	}

	static tileOnRight(position: Position, portion: Portion, id: number, rect: Rectangle): MapElement.Autotile | null {
		return this.tileOnWhatever(
			new Position(position.x + 1, position.y, position.yPixels, position.z, position.layer),
			portion,
			id,
			rect
		);
	}

	static tileOnTop(position: Position, portion: Portion, id: number, rect: Rectangle): MapElement.Autotile | null {
		return this.tileOnWhatever(
			new Position(position.x, position.y, position.yPixels, position.z - 1, position.layer),
			portion,
			id,
			rect
		);
	}

	static tileOnBottom(position: Position, portion: Portion, id: number, rect: Rectangle): MapElement.Autotile | null {
		return this.tileOnWhatever(
			new Position(position.x, position.y, position.yPixels, position.z + 1, position.layer),
			portion,
			id,
			rect
		);
	}

	static tileOnTopLeft(
		position: Position,
		portion: Portion,
		id: number,
		rect: Rectangle
	): MapElement.Autotile | null {
		return this.tileOnWhatever(
			new Position(position.x - 1, position.y, position.yPixels, position.z - 1, position.layer),
			portion,
			id,
			rect
		);
	}

	static tileOnTopRight(
		position: Position,
		portion: Portion,
		id: number,
		rect: Rectangle
	): MapElement.Autotile | null {
		return this.tileOnWhatever(
			new Position(position.x + 1, position.y, position.yPixels, position.z - 1, position.layer),
			portion,
			id,
			rect
		);
	}

	static tileOnBottomLeft(
		position: Position,
		portion: Portion,
		id: number,
		rect: Rectangle
	): MapElement.Autotile | null {
		return this.tileOnWhatever(
			new Position(position.x - 1, position.y, position.yPixels, position.z + 1, position.layer),
			portion,
			id,
			rect
		);
	}

	static tileOnBottomRight(
		position: Position,
		portion: Portion,
		id: number,
		rect: Rectangle
	): MapElement.Autotile | null {
		return this.tileOnWhatever(
			new Position(position.x + 1, position.y, position.yPixels, position.z + 1, position.layer),
			portion,
			id,
			rect
		);
	}

	static updateAround(position: Position, portionsToUpdate: Portion[], portionsToSave: Portion[]) {
		const portion = Scene.Map.current!.getLocalPortion(position);
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				const newPosition = new Position(
					position.x + i,
					position.y,
					position.yPixels,
					position.z + j,
					position.layer
				);
				const newAutotile = this.tileExisting(newPosition, portion);
				if (newAutotile) {
					// Update the current autotile
					if (newAutotile.update(newPosition, portion)) {
						const newPortion = Scene.Map.current!.getLocalPortion(newPosition);
						// Update view in different portion
						if (!portion.equals(newPortion)) {
							// TODO
							/*
							mapPortion = RPM::get()->project()->currentMap()
							->mapPortion(newPortion);
							update += mapPortion;
							if (previousPreview == nullptr) {
							save += mapPortion;
							} else {
							*previousPreview += mapPortion;
						}*/
						}
					}
				}
			}
		}
	}

	updateGeometry(position: Position, autotile: MapElement.Autotile) {
		return this.width === null || this.height === 0
			? null
			: autotile.updateGeometryAutotile(
					this.geometry,
					this.bundle,
					position,
					this.width,
					this.height,
					this.count++
			  );
	}

	createMesh(): boolean {
		if (this.geometry.isEmpty() || !this.bundle.material) {
			return false;
		}
		this.geometry.updateAttributes();
		this.mesh = new THREE.Mesh(this.geometry, this.bundle.material);
		return true;
	}
}

export { Autotiles };
