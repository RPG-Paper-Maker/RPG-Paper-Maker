/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants } from '../common/Constants';
import { Manager, MapElement, Model, Scene } from '../Editor';
import { CustomGeometry } from './CustomGeometry';
import { Portion } from './Portion';
import { Position } from './Position';
import { Rectangle } from './Rectangle';
import { ElementMapKind, RaycastingLayer } from '../common/Enum';
import { UndoRedoState } from './UndoRedoState';
import { CustomGeometryFace } from './CustomGeometryFace';
import { Autotiles } from '../mapElements';
import { Project } from './Project';

class MapPortion {
	public model: Model.MapPortion;
	public floorsMesh: THREE.Mesh;
	public spritesFaceMesh: THREE.Mesh;
	public spritesFixMesh: THREE.Mesh;
	public autotilesList: Autotiles[][];
	public lastPreviewRemove: [position: Position, element: MapElement.Base | null, kind: ElementMapKind][] = [];

	constructor(globalPortion: Portion) {
		this.model = new Model.MapPortion(globalPortion);
		this.floorsMesh = new THREE.Mesh(new CustomGeometry(), Manager.GL.MATERIAL_EMPTY);
		this.floorsMesh.receiveShadow = true;
		this.floorsMesh.castShadow = true;
		this.floorsMesh.renderOrder = 0;
		this.spritesFaceMesh = new THREE.Mesh(new CustomGeometryFace(), Manager.GL.MATERIAL_EMPTY);
		this.spritesFaceMesh.receiveShadow = true;
		this.spritesFaceMesh.castShadow = true;
		this.spritesFaceMesh.renderOrder = 3;
		this.spritesFixMesh = new THREE.Mesh(new CustomGeometry(), Manager.GL.MATERIAL_EMPTY);
		this.spritesFixMesh.receiveShadow = true;
		this.spritesFixMesh.castShadow = true;
		this.spritesFixMesh.renderOrder = 3;
		this.autotilesList = [];
	}

	removeLastPreview() {
		for (const [position, element, kind] of this.lastPreviewRemove) {
			this.updateMapElement(position, element, kind, false, true);
		}
		this.lastPreviewRemove = [];
	}

	add(position: Position, preview: boolean = false) {
		this.removeLastPreview();
		switch (Scene.Map.currentSelectedMapElementKind) {
			case ElementMapKind.Floors:
				this.updateMapElement(
					position,
					MapElement.Floor.create(Scene.Map.currentSelectedTexture),
					ElementMapKind.Floors,
					preview
				);
				break;
			case ElementMapKind.Autotiles:
				this.updateMapElement(
					position,
					MapElement.Autotile.create(1, 159, Scene.Map.currentSelectedTexture),
					ElementMapKind.Autotiles,
					preview
				);
				break;
			case ElementMapKind.SpritesFace:
				this.updateMapElement(
					position,
					MapElement.Sprite.create(Scene.Map.currentSelectedMapElementKind, Scene.Map.currentSelectedTexture),
					Scene.Map.currentSelectedMapElementKind,
					preview
				);
				break;
		}
	}

	remove(position: Position) {
		this.removeLastPreview();
		this.updateMapElement(position, null, Scene.Map.currentSelectedMapElementKind);
	}

	updateMapElement(
		position: Position,
		element: MapElement.Base | null,
		kind: ElementMapKind = ElementMapKind.None,
		preview = false,
		removingPreview = false,
		undoRedo = false
	) {
		if (element !== null) {
			kind = element.kind;
		}
		switch (kind) {
			case ElementMapKind.Floors:
				this.updateFloor(position, element as MapElement.Floor, preview, removingPreview, undoRedo);
				break;
			case ElementMapKind.Autotiles:
				this.updateAutotile(position, element as MapElement.Autotile, preview, removingPreview, undoRedo);
				break;
			case ElementMapKind.SpritesFace:
				this.updateSprite(position, element as MapElement.Sprite, kind, preview, removingPreview, undoRedo);
				break;
			default:
				break;
		}
	}

	updateFloor(
		position: Position,
		floor: MapElement.Floor | null,
		preview: boolean,
		removingPreview: boolean,
		undoRedo: boolean
	) {
		if (floor === null) {
			this.setMapElement(
				position,
				null,
				ElementMapKind.Floors,
				this.model.lands,
				preview,
				removingPreview,
				undoRedo
			);
		} else {
			for (let i = 0; i < floor.texture.width; i++) {
				for (let j = 0; j < floor.texture.height; j++) {
					const newPosition = new Position(position.x + i, position.y, position.yPixels, position.z + j);
					this.setMapElement(
						newPosition,
						MapElement.Floor.create(new Rectangle(floor.texture.x + i, floor.texture.y + j, 1, 1)),
						ElementMapKind.Floors,
						this.model.lands,
						preview,
						removingPreview,
						undoRedo
					);
				}
			}
		}
	}

	updateAutotile(
		position: Position,
		autotile: MapElement.Autotile | null,
		preview: boolean,
		removingPreview: boolean,
		undoRedo: boolean
	) {
		this.setMapElement(
			position,
			autotile,
			ElementMapKind.Autotiles,
			this.model.lands,
			preview,
			removingPreview,
			undoRedo
		);
	}

	updateSprite(
		position: Position,
		sprite: MapElement.Sprite | null,
		kind: ElementMapKind,
		preview: boolean,
		removingPreview: boolean,
		undoRedo: boolean
	) {
		this.setMapElement(position, sprite, kind, this.model.sprites, preview, removingPreview, undoRedo);
	}

	setMapElement(
		position: Position,
		element: MapElement.Base | null,
		kind: ElementMapKind,
		elements: Map<string, MapElement.Base>,
		preview: boolean,
		removingPreview: boolean,
		undoRedo: boolean
	): MapElement.Base | null {
		if (!Scene.Map.current || !position.isInMap(Scene.Map.current.modelMap)) {
			return null;
		}
		const key = position.toKey();
		let changed = false;
		const previous = elements.get(key) || null;
		if (element === null) {
			changed = elements.delete(key);
		} else {
			changed = previous ? !previous.equals(element) : true;
			elements.set(key, element);
		}
		if (changed && Scene.Map.current) {
			Scene.Map.current.addPortionToUpdate(this.model.globalPortion);
			if (!preview && !removingPreview) {
				Scene.Map.current.addPortionToSave(this.model.globalPortion);
				if (!undoRedo) {
					Scene.Map.current.undoRedoStates.push(
						UndoRedoState.create(
							position,
							previous,
							previous === null ? kind : previous.kind,
							element,
							kind
						)
					);
				}
			}
		}
		if (preview) {
			this.lastPreviewRemove.push([position, previous, previous === null ? kind : previous.kind]);
		}
		return previous;
	}

	fillDefaultFloor(map: Model.Map) {
		const rect = new Rectangle(0, 0, 1, 1);
		const p = new Position();
		for (let i = 0; i < Constants.PORTION_SIZE; i++) {
			for (let j = 0; j < Constants.PORTION_SIZE; j++) {
				p.x = this.model.globalPortion.x * Constants.PORTION_SIZE + i;
				p.y = this.model.globalPortion.y * Constants.PORTION_SIZE;
				p.z = this.model.globalPortion.z * Constants.PORTION_SIZE + j;
				if (p.isInMap(map)) {
					this.updateMapElement(p, MapElement.Floor.create(rect));
				}
			}
		}
	}

	checkTextures() {
		for (const [, land] of this.model.lands) {
			if (land instanceof MapElement.Autotile) {
				const texturesAutotile = Autotiles.getAutotileTexture(land.autotileID);
				if (texturesAutotile === null) {
					Scene.Map.current!.loading = true;
					this.loadTexturesAndUpdateGeometries();
					return false;
				}
			}
		}
		return true;
	}

	async loadTexturesAndUpdateGeometries() {
		for (const [, land] of this.model.lands) {
			if (land instanceof MapElement.Autotile) {
				await Autotiles.loadAutotileTexture(land.autotileID);
			}
		}
		this.updateGeometriesWithoutCheck();
		Scene.Map.current!.loading = false;
	}

	updateGeometries() {
		if (this.checkTextures()) {
			this.updateGeometriesWithoutCheck();
		}
	}

	updateGeometriesWithoutCheck() {
		this.updateLandsGeometries();
		this.updateSpritesGeometry();
	}

	updateLandsGeometries() {
		const material = Scene.Map.current!.materialTileset;
		const { width, height } = Manager.GL.getMaterialTextureSize(material);
		const geometry = new CustomGeometry();
		const layers: [Position, MapElement.Floor][] = [];
		let count = 0;
		for (const list of this.autotilesList) {
			if (list) {
				for (const autotiles of list) {
					if (autotiles.mesh) {
						Scene.Map.current!.scene.remove(autotiles.mesh);
					}
				}
			}
		}
		this.autotilesList = [];

		// Create autotiles according to the textures
		for (let i = 0, l = Scene.Map.current!.texturesAutotiles.length; i < l; i++) {
			const texturesAutotile = Scene.Map.current!.texturesAutotiles[i];
			if (texturesAutotile) {
				for (let textureAutotile of texturesAutotile) {
					if (!this.autotilesList[i]) {
						this.autotilesList[i] = [];
					}
					this.autotilesList[i].push(new Autotiles(textureAutotile));
				}
			}
		}

		for (const [positionKey, land] of this.model.lands) {
			const position = new Position();
			position.fromKey(positionKey);
			if (land instanceof MapElement.Floor) {
				count = this.updateFloorGeometry(position, land, layers, geometry, width, height, count);
			} else if (land instanceof MapElement.Autotile) {
				this.updateAutotileGeometry(position, land);
			}
		}

		// Floors: Draw layers separatly
		for (let i = 0, l = layers.length; i < l; i++) {
			const p = layers[i][0];
			const floor = layers[i][1];
			floor.updateGeometry(geometry, p, width, height, count);
			count++;
		}
		if (!geometry.isEmpty()) {
			geometry.updateAttributes();
			this.floorsMesh.geometry = geometry;
			Scene.Map.current!.scene.add(this.floorsMesh);
		} else {
			Scene.Map.current!.scene.remove(this.floorsMesh);
		}

		// Autotiles: update all the geometry uvs and put it in the scene
		for (const list of this.autotilesList) {
			if (list) {
				for (const autotiles of list) {
					if (autotiles.createMesh() && autotiles.mesh) {
						autotiles.mesh.receiveShadow = true;
						autotiles.mesh.castShadow = true;
						autotiles.mesh.customDepthMaterial = autotiles.bundle!.material!.userData.customDepthMaterial;
						Scene.Map.current!.scene.add(autotiles.mesh);
					}
				}
			}
		}
	}

	updateFloorGeometry(
		position: Position,
		floor: MapElement.Floor,
		layers: [Position, MapElement.Floor][],
		geometry: CustomGeometry,
		width: number,
		height: number,
		count: number
	) {
		const layer = position.layer;
		if (layer > 0) {
			let i = 0,
				l = layers.length;
			for (; i < l; i++) {
				if (layer <= layers[i][0].layer) {
					layers.splice(i, 0, [position, floor]);
					break;
				}
			}
			if (i === l) {
				layers.push([position, floor]);
			}
		} else {
			floor.updateGeometry(geometry, position, width, height, count);
			count++;
		}
		return count;
	}

	updateAutotileGeometry(position: Position, autotile: MapElement.Autotile) {
		let texture = null;
		const texturesAutotile = Autotiles.getAutotileTexture(autotile.autotileID);
		let autotiles: Autotiles | null = null;
		if (texturesAutotile) {
			const pictureID = Project.current!.specialElements.getAutotileByID(autotile.autotileID).pictureID;
			for (let j = 0, m = texturesAutotile.length; j < m; j++) {
				const textureAutotile = texturesAutotile[j];
				if (textureAutotile.isInTexture(pictureID, autotile.texture)) {
					texture = textureAutotile;
					autotiles = this.autotilesList[autotile.autotileID][j];
					break;
				}
			}
		}
		if (texture !== null && texture.material !== null) {
			autotiles!.updateGeometry(position, autotile);
		}
	}

	updateSpritesGeometry() {
		const material = Scene.Map.current!.materialTileset;
		const { width, height } = Manager.GL.getMaterialTextureSize(material);
		const fixGeometry = new CustomGeometry();
		const faceGeometry = new CustomGeometryFace();
		let staticCount = 0;
		let faceCount = 0;
		for (const [positionKey, sprite] of this.model.sprites) {
			const position = new Position();
			position.fromKey(positionKey);
			const localPosition = position.toVector3();
			if (sprite.kind === ElementMapKind.SpritesFace) {
				faceCount = sprite.updateGeometry(
					faceGeometry,
					width,
					height,
					position,
					faceCount,
					true,
					localPosition
				);
			} else {
				staticCount = sprite.updateGeometry(
					fixGeometry,
					width,
					height,
					position,
					staticCount,
					true,
					localPosition
				);
			}
			position.x += sprite.xOffset;
			position.y += sprite.yOffset;
			position.z += sprite.zOffset;
		}

		if (!fixGeometry.isEmpty()) {
			fixGeometry.updateAttributes();
			this.spritesFixMesh.geometry = fixGeometry;
			this.spritesFixMesh.layers.enable(RaycastingLayer.Sprites);
			Scene.Map.current!.scene.add(this.spritesFixMesh);
		} else {
			Scene.Map.current!.scene.remove(this.spritesFixMesh);
		}

		if (!faceGeometry.isEmpty()) {
			faceGeometry.updateAttributes();
			this.spritesFaceMesh.geometry = faceGeometry;
			this.spritesFaceMesh.layers.enable(RaycastingLayer.Sprites);
			Scene.Map.current!.scene.add(this.spritesFaceMesh);
		} else {
			Scene.Map.current!.scene.remove(this.spritesFaceMesh);
		}
	}

	updateMaterials() {
		const material = Scene.Map.current!.materialTileset;
		if (material) {
			this.floorsMesh.material = material;
			this.spritesFaceMesh.material = material;
			this.spritesFixMesh.material = material;
			this.spritesFaceMesh.customDepthMaterial = material.userData.customDepthMaterial;
		}
	}

	update() {
		// TODO
	}

	updateFaceSprites(angle: number) {
		(this.spritesFaceMesh.geometry as CustomGeometryFace).rotate(angle, MapElement.Base.Y_AXIS);
	}
}

export { MapPortion };
