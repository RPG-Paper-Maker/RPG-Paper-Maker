/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Manager, MapElement, Model, Scene } from '../Editor';
import {
	CustomGeometry,
	CustomGeometryFace,
	Portion,
	Position,
	Position3D,
	Project,
	Rectangle,
	UndoRedoState,
} from '.';
import { ACTION_KIND, Constants, ELEMENT_MAP_KIND, RAYCASTING_LAYER, SPRITE_WALL_TYPE } from '../common';
import { SpriteWall } from '../mapElements';

class MapPortion {
	public model!: Model.MapPortion;
	public floorsMesh!: THREE.Mesh;
	public spritesFaceMesh!: THREE.Mesh;
	public spritesFixMesh!: THREE.Mesh;
	public autotilesList!: MapElement.Autotiles[][];
	public wallsMeshes!: THREE.Mesh[];
	public mountainsList!: Map<number, MapElement.Mountains>;
	public objects3DMeshes!: THREE.Mesh[];
	public hoveredMesh!: THREE.Mesh;
	public lastPreviewRemove: [position: Position, element: MapElement.Base | null, kind: ELEMENT_MAP_KIND][] = [];

	initialize(globalPortion: Portion) {
		this.model = new Model.MapPortion(globalPortion);
		this.floorsMesh = new THREE.Mesh(new CustomGeometry(), Manager.GL.MATERIAL_EMPTY);
		this.floorsMesh.receiveShadow = true;
		this.floorsMesh.castShadow = true;
		this.floorsMesh.renderOrder = 0;
		this.floorsMesh.layers.enable(RAYCASTING_LAYER.LANDS);
		this.spritesFaceMesh = new THREE.Mesh(new CustomGeometryFace(), Manager.GL.MATERIAL_EMPTY);
		this.spritesFaceMesh.receiveShadow = true;
		this.spritesFaceMesh.castShadow = true;
		this.spritesFaceMesh.renderOrder = 3;
		this.spritesFaceMesh.layers.enable(RAYCASTING_LAYER.SPRITES);
		this.spritesFixMesh = new THREE.Mesh(new CustomGeometry(), Manager.GL.MATERIAL_EMPTY);
		this.spritesFixMesh.receiveShadow = true;
		this.spritesFixMesh.castShadow = true;
		this.spritesFixMesh.renderOrder = 3;
		this.spritesFixMesh.layers.enable(RAYCASTING_LAYER.SPRITES);
		this.autotilesList = [];
		this.wallsMeshes = [];
		this.mountainsList = new Map();
		this.objects3DMeshes = [];
		this.hoveredMesh = new THREE.Mesh(new CustomGeometry(), Manager.GL.MATERIAL_EMPTY);
		this.hoveredMesh.receiveShadow = true;
		this.hoveredMesh.castShadow = true;
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
			case ELEMENT_MAP_KIND.FLOOR:
				this.updateMapElement(
					position,
					MapElement.Floor.create(Project.current!.settings.mapEditorCurrentTilesetFloorTexture),
					ELEMENT_MAP_KIND.FLOOR,
					preview
				);
				break;
			case ELEMENT_MAP_KIND.AUTOTILE:
				this.updateMapElement(
					position,
					MapElement.Autotile.create(
						Project.current!.settings.mapEditorCurrentAutotileID,
						MapElement.Autotiles.PREVIEW_TILE,
						Project.current!.settings.mapEditorCurrentAutotileTexture
					),
					ELEMENT_MAP_KIND.AUTOTILE,
					preview
				);
				break;
			case ELEMENT_MAP_KIND.SPRITE_FACE:
			case ELEMENT_MAP_KIND.SPRITE_FIX:
			case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
			case ELEMENT_MAP_KIND.SPRITE_QUADRA:
				this.updateMapElement(
					position,
					MapElement.Sprite.create(
						Scene.Map.currentSelectedMapElementKind,
						Project.current!.settings.mapEditorCurrentTilesetSpriteTexture
					),
					Scene.Map.currentSelectedMapElementKind,
					preview
				);
				break;
			case ELEMENT_MAP_KIND.SPRITE_WALL:
				this.updateWallFromCursor(Project.current!.settings.mapEditorCurrentWallID, preview);
				break;
			case ELEMENT_MAP_KIND.MOUNTAIN:
				const y = Project.current!.settings.mapEditorCurrentMountainHeightSquares;
				const yPixels = Position3D.getPercentOfPixels(
					Project.current!.settings.mapEditorCurrentMountainHeightPixels
				);
				let floorPosition = position.clone();
				floorPosition.addY(y, yPixels);
				this.updateMapElement(
					floorPosition,
					MapElement.Floor.create(
						new Rectangle(
							Project.current!.settings.mapEditorCurrentTilesetFloorTexture.x,
							Project.current!.settings.mapEditorCurrentTilesetFloorTexture.y
						)
					),
					ELEMENT_MAP_KIND.FLOOR,
					preview
				);
				const newMountain = MapElement.Mountain.create(
					Project.current!.settings.mapEditorCurrentMountainID,
					Project.current!.settings.mapEditorCurrentMountainWidthSquares,
					Position3D.getPercentOfPixels(Project.current!.settings.mapEditorCurrentMountainWidthPixels),
					y,
					yPixels
				);
				const previousMountain = this.model.getMapElement(
					position,
					ELEMENT_MAP_KIND.MOUNTAIN
				) as MapElement.Mountain | null;
				if (previousMountain && !previousMountain.equals(newMountain)) {
					floorPosition = position.clone();
					floorPosition.addY(previousMountain.heightSquares, previousMountain.heightPixels);
					this.updateMapElement(floorPosition, null, ELEMENT_MAP_KIND.FLOOR, preview);
				}
				this.updateMapElement(position, newMountain, Scene.Map.currentSelectedMapElementKind, preview);
				break;
			case ELEMENT_MAP_KIND.OBJECT3D:
				this.updateMapElement(
					position,
					MapElement.Object3D.create(
						Project.current!.specialElements.getObject3DByID(
							Project.current!.settings.mapEditorCurrentObject3DID
						)
					),
					Scene.Map.currentSelectedMapElementKind,
					preview
				);
				break;
		}
	}

	remove(position: Position, preview = false) {
		this.removeLastPreview();
		if (Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.SPRITE_WALL) {
			this.updateWallFromCursor(-1, preview);
		} else {
			if (Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.MOUNTAIN) {
				const previous = this.model.getMapElement(
					position,
					ELEMENT_MAP_KIND.MOUNTAIN
				) as MapElement.Mountain | null;
				if (previous) {
					const mountain = previous as MapElement.Mountain;
					const floorPosition = position.clone();
					floorPosition.addY(mountain.heightSquares, mountain.heightPixels);
					this.updateMapElement(floorPosition, null, ELEMENT_MAP_KIND.FLOOR, preview);
				}
			}
			this.updateMapElement(position, null, Scene.Map.currentSelectedMapElementKind);
		}
	}

	updateMapElement(
		position: Position,
		element: MapElement.Base | null,
		kind: ELEMENT_MAP_KIND = ELEMENT_MAP_KIND.NONE,
		preview = false,
		removingPreview = false,
		undoRedo = false
	) {
		if (element !== null) {
			kind = element.kind;
		}
		switch (kind) {
			case ELEMENT_MAP_KIND.FLOOR:
				this.updateFloor(position, element as MapElement.Floor, preview, removingPreview, undoRedo);
				break;
			case ELEMENT_MAP_KIND.AUTOTILE:
				this.updateAutotile(position, element as MapElement.Autotile, preview, removingPreview, undoRedo);
				break;
			case ELEMENT_MAP_KIND.SPRITE_FACE:
			case ELEMENT_MAP_KIND.SPRITE_FIX:
			case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
			case ELEMENT_MAP_KIND.SPRITE_QUADRA:
				this.updateSprite(position, element as MapElement.Sprite, kind, preview, removingPreview, undoRedo);
				break;
			case ELEMENT_MAP_KIND.SPRITE_WALL:
				this.updateWall(position, element as MapElement.SpriteWall, preview, removingPreview, undoRedo);
				break;
			case ELEMENT_MAP_KIND.MOUNTAIN:
				this.updateMountain(position, element as MapElement.Mountain, preview, removingPreview, undoRedo);
				break;
			case ELEMENT_MAP_KIND.OBJECT3D:
				this.updateObject3D(position, element as MapElement.Object3D, preview, removingPreview, undoRedo);
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
				ELEMENT_MAP_KIND.FLOOR,
				this.model.lands,
				preview,
				removingPreview,
				undoRedo
			);
		} else {
			for (let i = 0; i < floor.texture.width; i++) {
				for (let j = 0; j < floor.texture.height; j++) {
					const newPosition = position.clone();
					newPosition.x = position.x + i;
					newPosition.z = position.z + j;
					this.setMapElement(
						newPosition,
						MapElement.Floor.create(new Rectangle(floor.texture.x + i, floor.texture.y + j, 1, 1)),
						ELEMENT_MAP_KIND.FLOOR,
						this.model.lands,
						preview,
						removingPreview,
						undoRedo
					);
				}
			}
		}
		MapElement.Autotiles.updateAround(
			position,
			Scene.Map.current!.portionsToUpdate,
			Scene.Map.current!.portionsToSave
		);
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
			ELEMENT_MAP_KIND.AUTOTILE,
			this.model.lands,
			preview,
			removingPreview,
			undoRedo
		);
		MapElement.Autotiles.updateAround(
			position,
			Scene.Map.current!.portionsToUpdate,
			Scene.Map.current!.portionsToSave
		);
	}

	updateSprite(
		position: Position,
		sprite: MapElement.Sprite | null,
		kind: ELEMENT_MAP_KIND,
		preview: boolean,
		removingPreview: boolean,
		undoRedo: boolean
	) {
		this.setMapElement(position, sprite, kind, this.model.sprites, preview, removingPreview, undoRedo);
	}

	updateWallFromCursor(id: number, preview: boolean) {
		const positions = Scene.Map.current!.cursorWall.getPositions();
		for (const position of positions) {
			this.setMapElement(
				position,
				id === -1 ? null : MapElement.SpriteWall.create(id, SPRITE_WALL_TYPE.MIDDLE),
				ELEMENT_MAP_KIND.SPRITE_WALL,
				this.model.walls,
				preview,
				false,
				false,
				true
			);
		}
		for (const position of positions) {
			SpriteWall.updateAround(position);
		}
	}

	updateWall(
		position: Position,
		wall: MapElement.SpriteWall | null,
		preview: boolean,
		removingPreview: boolean,
		undoRedo: boolean
	) {
		this.setMapElement(
			position,
			wall,
			ELEMENT_MAP_KIND.SPRITE_WALL,
			this.model.walls,
			preview,
			removingPreview,
			undoRedo,
			true
		);
		MapElement.SpriteWall.updateAround(position);
	}

	updateMountain(
		position: Position,
		mountain: MapElement.Mountain | null,
		preview: boolean,
		removingPreview: boolean,
		undoRedo: boolean
	) {
		this.setMapElement(
			position,
			mountain,
			ELEMENT_MAP_KIND.MOUNTAIN,
			this.model.mountains,
			preview,
			removingPreview,
			undoRedo
		);
		MapElement.Mountains.updateAround(
			position,
			Scene.Map.current!.portionsToUpdate,
			Scene.Map.current!.portionsToSave
		);
	}

	updateObject3D(
		position: Position,
		object: MapElement.Object3D | null,
		preview: boolean,
		removingPreview: boolean,
		undoRedo: boolean
	) {
		this.setMapElement(
			position,
			object,
			ELEMENT_MAP_KIND.OBJECT3D,
			this.model.objects3D,
			preview,
			removingPreview,
			undoRedo
		);
	}

	setMapElement(
		position: Position,
		element: MapElement.Base | null,
		kind: ELEMENT_MAP_KIND,
		elements: Map<string, MapElement.Base>,
		preview: boolean,
		removingPreview: boolean,
		undoRedo: boolean,
		allowBorders = false
	): MapElement.Base | null {
		if (!Scene.Map.current || !position.isInMap(Scene.Map.current.modelMap, allowBorders)) {
			return null;
		}
		const key = position.toKey();
		let changed = false;
		const previous = elements.get(key) || null;
		if (element && preview && !removingPreview && previous === null) {
			element.isPreview = true;
		}
		if (
			preview &&
			!removingPreview &&
			Scene.Map.current.lastPosition !== null &&
			(previous === null || !previous.isPreview)
		) {
			Scene.Map.current.lastMapElement = previous;
		}
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
		if (preview && changed) {
			this.lastPreviewRemove.push([position, previous, previous === null ? kind : previous.kind]);
		}
		return previous;
	}

	removeSelected() {
		if (Scene.Map.current!.selectedPosition && Scene.Map.current!.selectedElement) {
			const position = Scene.Map.current!.selectedPosition;
			const models = this.model.getModelsByKind(Scene.Map.current!.selectedElement.kind);
			if (models) {
				this.setMapElement(
					position.clone(),
					null,
					Scene.Map.current!.selectedElement.kind,
					models,
					false,
					false,
					false
				);
			}
		}
	}

	addSelected() {
		if (Scene.Map.current!.selectedElement) {
			const position = Scene.Map.current!.selectedElement.getPositionFromVec3(
				Scene.Map.current!.selectedMesh.position,
				Scene.Map.current!.selectedMesh.rotation,
				Scene.Map.current!.selectedMesh.scale
			);
			const models = this.model.getModelsByKind(Scene.Map.current!.selectedElement.kind);
			if (models) {
				this.setMapElement(
					position.clone(),
					Scene.Map.current!.selectedElement,
					Scene.Map.current!.selectedElement.kind,
					models,
					false,
					false,
					false
				);
				Scene.Map.current!.selectedPosition = position;
			}
		}
	}

	updateSelected(
		geometry: CustomGeometry,
		material: THREE.Material | THREE.Material[],
		localPosition: THREE.Vector3,
		position: Position
	) {
		geometry.updateAttributes();
		Scene.Map.current!.selectedMesh.geometry = geometry;
		Scene.Map.current!.selectedMesh.material = material;
		if (!Scene.Map.current!.transformControls.dragging) {
			Scene.Map.current!.selectedMesh.position.copy(localPosition);
			Scene.Map.current!.selectedMesh.rotation.copy(
				Scene.Map.current!.selectedElement!.getLocalRotation(position)
			);
			Scene.Map.current!.selectedMesh.scale.copy(Scene.Map.current!.selectedElement!.getLocalScale(position));
		}
		Scene.Map.current!.scene.add(Scene.Map.current!.selectedMesh);
		Scene.Map.current!.transformControls.attach(Scene.Map.current!.selectedMesh);
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
					this.model.lands.set(p.toKey(), MapElement.Floor.create(rect));
				}
			}
		}
	}

	checkTextures() {
		for (const [, land] of this.model.lands) {
			if (land instanceof MapElement.Autotile) {
				const texturesAutotile = MapElement.Autotiles.getAutotileTexture(land.autotileID);
				if (texturesAutotile === null) {
					Scene.Map.current!.loading = true;
					this.loadTexturesAndUpdateGeometries().catch(console.error);
					return false;
				}
			}
		}
		for (const [, wall] of this.model.walls) {
			const textureWall = MapElement.SpriteWall.getWallTexture(wall.wallID);
			if (textureWall === null) {
				Scene.Map.current!.loading = true;
				this.loadTexturesAndUpdateGeometries().catch(console.error);
				return false;
			}
		}
		for (const [, mountain] of this.model.mountains) {
			const textureMountain = MapElement.Mountains.getMountainTexture(mountain.mountainID);
			if (textureMountain === null) {
				Scene.Map.current!.loading = true;
				this.loadTexturesAndUpdateGeometries().catch(console.error);
				return false;
			}
		}
		for (const [, object3D] of this.model.objects3D) {
			const textureObject3D = MapElement.Object3D.getObject3DTexture(object3D.id);
			if (textureObject3D === null || !MapElement.Object3D.isShapeLoaded(object3D.id)) {
				Scene.Map.current!.loading = true;
				this.loadTexturesAndUpdateGeometries().catch(console.error);
				return false;
			}
		}
		return true;
	}

	async loadTexturesAndUpdateGeometries(updateLoading = true) {
		for (const [, land] of this.model.lands) {
			if (land instanceof MapElement.Autotile) {
				await MapElement.Autotiles.loadAutotileTexture(land.autotileID);
			}
		}
		for (const [, wall] of this.model.walls) {
			await MapElement.SpriteWall.loadWallTexture(wall.wallID);
		}
		for (const [, mountain] of this.model.mountains) {
			await MapElement.Mountains.loadMountainTexture(mountain.mountainID);
		}
		for (const [, object3D] of this.model.objects3D) {
			await MapElement.Object3D.loadObject3DTexture(object3D.id);
			await MapElement.Object3D.loadShapeOBJ(object3D.id);
		}
		this.updateGeometriesWithoutCheck();
		if (updateLoading) {
			Scene.Map.current!.loading = false;
		}
	}

	updateGeometries() {
		if (this.checkTextures()) {
			this.updateGeometriesWithoutCheck();
		}
	}

	updateGeometriesWithoutCheck() {
		Scene.Map.current!.scene.remove(this.hoveredMesh);
		Scene.Map.current!.scene.remove(Scene.Map.current!.selectedMesh);
		this.updateLandsGeometries();
		this.updateSpritesGeometry();
		this.updateWallsGeometry();
		this.updateMountainsGeometry();
		this.updateObjects3DGeometry();
	}

	updateLandsGeometries() {
		const isPointedFloor =
			Scene.Map.isTransforming() &&
			!Scene.Map.current!.isDraggingTransforming &&
			Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.FLOOR;
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
				for (const textureAutotile of texturesAutotile) {
					if (!this.autotilesList[i]) {
						this.autotilesList[i] = [];
					}
					this.autotilesList[i].push(new MapElement.Autotiles(textureAutotile));
				}
			}
		}

		for (const [positionKey, land] of this.model.lands) {
			const position = new Position();
			position.fromKey(positionKey);
			if (land instanceof MapElement.Floor) {
				count = this.updateFloorGeometry(
					position,
					land,
					layers,
					geometry,
					width,
					height,
					isPointedFloor,
					count
				);
			} else if (land instanceof MapElement.Autotile) {
				this.updateAutotileGeometry(position, land);
			}
		}

		// Floors: Draw layers separatly
		for (let i = 0, l = layers.length; i < l; i++) {
			const position = layers[i][0];
			const floor = layers[i][1];
			if (Scene.Map.current!.selectedElement === floor) {
				const geometry = new CustomGeometry();
				floor.updateGeometry(geometry as CustomGeometry, new Position(), width, height, 0);
				this.updateSelected(
					geometry,
					this.hoveredMesh.material,
					Scene.Map.current!.selectedElement.getLocalPosition(position),
					position
				);
			} else if (isPointedFloor && Scene.Map.current!.pointedMapElement === floor) {
				this.hoveredMesh.geometry = new CustomGeometry();
				floor.updateGeometry(this.hoveredMesh.geometry as CustomGeometry, position, width, height, 0);
			} else {
				floor.updateGeometry(geometry, position, width, height, count);
				count++;
			}
		}
		if (!geometry.isEmpty()) {
			geometry.updateAttributes();
			this.floorsMesh.geometry = geometry;
			Scene.Map.current!.scene.add(this.floorsMesh);
		} else {
			Scene.Map.current!.scene.remove(this.floorsMesh);
		}

		if (isPointedFloor) {
			const hoveredGeometry = this.hoveredMesh.geometry as CustomGeometry;
			if (!hoveredGeometry.isEmpty()) {
				hoveredGeometry.updateAttributes();
				this.hoveredMesh.renderOrder = 0;
				this.hoveredMesh.layers.enable(RAYCASTING_LAYER.LANDS);
				Scene.Map.current!.scene.add(this.hoveredMesh);
			}
		}

		// Autotiles: update all the geometry uvs and put it in the scene
		for (const list of this.autotilesList) {
			if (list) {
				for (const autotiles of list) {
					if (autotiles.createMesh() && autotiles.mesh) {
						autotiles.mesh.receiveShadow = true;
						autotiles.mesh.castShadow = true;
						autotiles.mesh.customDepthMaterial = autotiles.bundle!.material!.userData.customDepthMaterial;
						autotiles.mesh.layers.enable(RAYCASTING_LAYER.LANDS);
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
		isPointedFloor: boolean,
		count: number
	) {
		const layer = position.layer;
		if (layer > 0) {
			let i = 0;
			const l = layers.length;
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
			if (Scene.Map.current!.selectedElement === floor) {
				const geometry = new CustomGeometry();
				floor.updateGeometry(geometry as CustomGeometry, new Position(0, 0, 0, 0, 0, 0, 0), width, height, 0);
				this.updateSelected(
					geometry,
					this.hoveredMesh.material,
					Scene.Map.current!.selectedElement.getLocalPosition(position),
					position
				);
			} else if (isPointedFloor && Scene.Map.current!.pointedMapElement === floor) {
				this.hoveredMesh.geometry = new CustomGeometry();
				floor.updateGeometry(this.hoveredMesh.geometry as CustomGeometry, position, width, height, 0);
			} else {
				floor.updateGeometry(geometry, position, width, height, count);
				count++;
			}
		}
		return count;
	}

	updateAutotileGeometry(position: Position, autotile: MapElement.Autotile) {
		let texture = null;
		const texturesAutotile = MapElement.Autotiles.getAutotileTexture(autotile.autotileID);
		let autotiles: MapElement.Autotiles | null = null;
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
		const isPointedSprite =
			Scene.Map.isTransforming() &&
			!Scene.Map.current!.isDraggingTransforming &&
			Scene.Map.currentSelectedMapElementKind >= ELEMENT_MAP_KIND.SPRITE_FACE &&
			Scene.Map.currentSelectedMapElementKind <= ELEMENT_MAP_KIND.SPRITE_QUADRA;
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
			if (sprite.kind === ELEMENT_MAP_KIND.SPRITE_FACE) {
				if (Scene.Map.current!.selectedElement === sprite) {
					const geometry = new CustomGeometryFace();
					sprite.updateGeometry(geometry, width, height, new Position(), 0, true, new THREE.Vector3());
					this.updateSelected(geometry, this.hoveredMesh.material, localPosition, position);
				} else if (
					Project.current!.settings.mapEditorCurrentActionIndex !== ACTION_KIND.ROTATE &&
					isPointedSprite &&
					Scene.Map.current!.pointedMapElement === sprite
				) {
					const hoveredGeometry = new CustomGeometryFace();
					this.hoveredMesh.geometry = hoveredGeometry;
					sprite.updateGeometry(hoveredGeometry, width, height, position, 0, true, localPosition);
				} else {
					faceCount = sprite.updateGeometry(
						faceGeometry,
						width,
						height,
						position,
						faceCount,
						true,
						localPosition
					);
				}
			} else {
				if (Scene.Map.current!.selectedElement === sprite) {
					const geometry = new CustomGeometry();
					sprite.updateGeometry(geometry, width, height, new Position(), 0, true, new THREE.Vector3());
					this.updateSelected(geometry, this.hoveredMesh.material, localPosition, position);
				} else if (isPointedSprite && Scene.Map.current!.pointedMapElement === sprite) {
					const hoveredGeometry = new CustomGeometry();
					this.hoveredMesh.geometry = hoveredGeometry;
					sprite.updateGeometry(hoveredGeometry, width, height, position, 0, true, localPosition);
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
			}
			position.x += sprite.xOffset;
			position.y += sprite.yOffset;
			position.z += sprite.zOffset;
		}

		if (!fixGeometry.isEmpty()) {
			fixGeometry.updateAttributes();
			this.spritesFixMesh.geometry = fixGeometry;
			Scene.Map.current!.scene.add(this.spritesFixMesh);
		} else {
			Scene.Map.current!.scene.remove(this.spritesFixMesh);
		}

		if (!faceGeometry.isEmpty()) {
			faceGeometry.updateAttributes();
			this.spritesFaceMesh.geometry = faceGeometry;
			Scene.Map.current!.scene.add(this.spritesFaceMesh);
		} else {
			Scene.Map.current!.scene.remove(this.spritesFaceMesh);
		}

		if (isPointedSprite) {
			const hoveredGeometry = this.hoveredMesh.geometry as CustomGeometry;
			if (!hoveredGeometry.isEmpty()) {
				hoveredGeometry.updateAttributes();
				this.hoveredMesh.renderOrder = 3;
				this.hoveredMesh.layers.enable(RAYCASTING_LAYER.SPRITES);
				Scene.Map.current!.scene.add(this.hoveredMesh);
			}
		}
	}

	updateWallsGeometry() {
		for (const mesh of this.wallsMeshes) {
			Scene.Map.current!.scene.remove(mesh);
		}
		this.wallsMeshes = [];
		const hash = new Map<number, any>();
		for (const [positionKey, wall] of this.model.walls) {
			const position = new Position();
			position.fromKey(positionKey);
			let obj = hash.get(wall.wallID);
			let material: THREE.MeshPhongMaterial | null;
			let geometry: CustomGeometry;
			let count: number;
			if (obj) {
				geometry = obj.geometry;
				material = obj.material;
				count = obj.c;
			} else {
				material = MapElement.SpriteWall.getWallTexture(wall.wallID);
				geometry = new CustomGeometry();
				count = 0;
				obj = {
					geometry,
					material,
					c: count,
				};
				hash.set(wall.wallID, obj);
			}
			const { width, height } = Manager.GL.getMaterialTextureSize(material);
			obj.c = wall.updateGeometry(geometry, position, width, height, count);
		}
		// Add to scene
		for (const [, obj] of hash) {
			const geometry = obj.geometry;
			if (!geometry.isEmpty()) {
				geometry.updateAttributes();
				const mesh = new THREE.Mesh(geometry, obj.material);
				mesh.receiveShadow = true;
				mesh.castShadow = true;
				mesh.customDepthMaterial = obj.material.userData.customDepthMaterial;
				mesh.layers.enable(RAYCASTING_LAYER.WALLS);
				mesh.renderOrder = 3;
				this.wallsMeshes.push(mesh);
				Scene.Map.current!.scene.add(mesh);
			}
		}
	}

	updateMountainsGeometry() {
		for (const [, mountains] of this.mountainsList) {
			if (mountains.mesh) {
				Scene.Map.current!.scene.remove(mountains.mesh);
			}
		}
		this.mountainsList = new Map();
		for (const [positionKey, mountain] of this.model.mountains) {
			const position = new Position();
			position.fromKey(positionKey);
			const pictureID = Project.current!.specialElements.getMountainByID(mountain.mountainID).pictureID;
			let mountains = this.mountainsList.get(pictureID);
			if (!mountains) {
				mountains = new MapElement.Mountains(pictureID, Scene.Map.current!.texturesMountains.get(pictureID)!);
				this.mountainsList.set(pictureID, mountains);
			}
			mountains.updateGeometry(position, mountain);
		}
		// Update all the geometry uvs and put it in the scene
		for (const [, mountains] of this.mountainsList) {
			if (mountains.createMesh()) {
				mountains.mesh!.receiveShadow = true;
				mountains.mesh!.castShadow = true;
				mountains.mesh!.customDepthMaterial = mountains.material.userData.customDepthMaterial;
				mountains.mesh!.layers.enable(RAYCASTING_LAYER.MOUNTAINS);
				Scene.Map.current!.scene.add(mountains.mesh!);
			}
		}
	}

	updateObjects3DGeometry() {
		const isPointedObject3D =
			Scene.Map.isTransforming() &&
			!Scene.Map.current!.isDraggingTransforming &&
			Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.OBJECT3D;
		for (const mesh of this.objects3DMeshes) {
			Scene.Map.current!.scene.remove(mesh);
		}
		this.objects3DMeshes = [];
		const hash = new Map<number, any>();
		for (const [positionKey, object3D] of this.model.objects3D) {
			const position = new Position();
			position.fromKey(positionKey);
			if (!object3D.data) {
				object3D.data = Project.current!.specialElements.getObject3DByID(object3D.id);
			}
			if (object3D.data) {
				// Constructing the geometry
				let obj = hash.get(object3D.data.pictureID);
				let material: THREE.MeshPhongMaterial | null;
				let geometry: CustomGeometry | null = null;
				let count = 0;
				if (
					(isPointedObject3D && Scene.Map.current!.pointedMapElement === object3D) ||
					Scene.Map.current!.selectedElement === object3D
				) {
					material = MapElement.Object3D.getObject3DTexture(object3D.id, true);
					geometry = new CustomGeometry();
					if (object3D && material) {
						if (Scene.Map.current!.selectedElement === object3D) {
							object3D.updateGeometry(
								geometry,
								new Position(
									0,
									0,
									0,
									0,
									0,
									object3D.isCentered() ? 0 : 50,
									object3D.isCentered() ? 0 : 50
								),
								0
							);
							this.updateSelected(
								geometry,
								material,
								Scene.Map.current!.selectedElement.getLocalPosition(position),
								position
							);
						} else {
							object3D.updateGeometry(geometry, position, 0);
							obj = {
								geometry: geometry,
								material: material,
							};
							hash.set(0, obj);
						}
					}
				} else {
					if (obj) {
						geometry = obj.geometry;
						material = obj.material;
						count = obj.c;
					} else {
						material = MapElement.Object3D.getObject3DTexture(object3D.id);
						if (material) {
							geometry = new CustomGeometry();
							obj = {
								geometry: geometry,
								material: material,
								c: count,
							};
							hash.set(object3D.data.pictureID, obj);
						}
					}
					if (object3D && geometry) {
						obj.c = object3D.updateGeometry(geometry, position, count);
					}
				}
			}
		}

		// Add meshes
		for (const [, obj] of hash) {
			const geometry = obj.geometry;
			if (!geometry.isEmpty()) {
				geometry.updateAttributes();
				const mesh = new THREE.Mesh(geometry, obj.material);
				this.objects3DMeshes.push(mesh);
				mesh.renderOrder = 999;
				mesh.receiveShadow = true;
				mesh.castShadow = true;
				mesh.customDepthMaterial = obj.material.userData.customDepthMaterial;
				mesh.layers.enable(RAYCASTING_LAYER.OBJECTS3D);
				Scene.Map.current!.scene.add(mesh);
			}
		}
	}

	updateMaterials() {
		const material = Scene.Map.current?.materialTileset;
		const materialHover = Scene.Map.current?.materialTilesetHover;
		if (material && materialHover) {
			this.floorsMesh.material = material;
			this.spritesFaceMesh.material = material;
			this.spritesFixMesh.material = material;
			this.spritesFaceMesh.customDepthMaterial = material.userData.customDepthMaterial;
			this.hoveredMesh.material = materialHover;
			this.hoveredMesh.customDepthMaterial = materialHover.userData.customDepthMaterial;
		}
	}

	updateFaceSprites(angle: number) {
		(this.spritesFaceMesh.geometry as CustomGeometryFace).rotate(angle, MapElement.Base.Y_AXIS);
		if (this.hoveredMesh.geometry instanceof CustomGeometryFace) {
			this.hoveredMesh.geometry.rotate(angle, MapElement.Base.Y_AXIS);
		}
	}
}

export { MapPortion };
