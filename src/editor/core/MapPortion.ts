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
import { ACTION_KIND, ELEMENT_MAP_KIND, Mathf, RAYCASTING_LAYER } from '../common';

type GeometryMaterialType = {
	geometry: CustomGeometry;
	material: THREE.MeshPhongMaterial | null;
	count?: number;
};

class MapPortion {
	public model!: Model.MapPortion;
	public floorsMeshes!: [THREE.Mesh[], THREE.Mesh[]]; // [0 for up, 1 for down][layer]
	public spritesFaceMeshes!: THREE.Mesh[]; // [layer]
	public spritesFixMeshes!: [THREE.Mesh[], THREE.Mesh[]]; // [0 for front, 1 for back][layer]
	public autotilesList!: MapElement.Autotiles[][];
	public wallsMeshes!: THREE.Mesh[];
	public mountainsList!: Map<number, MapElement.Mountains>;
	public objects3DMeshes!: THREE.Mesh[];
	public lastPreviewRemove: [position: Position, element: MapElement.Base | null, kind: ELEMENT_MAP_KIND][] = [];

	static offsetMeshPositionLayer(mesh: THREE.Mesh, side: number, layer: number, up = true) {
		let offset = layer * Scene.Map.current!.camera.getYOffsetDepth();
		if (side === 1) {
			offset *= -1;
		}
		if (up) {
			mesh.position.setY(offset);
		} else {
			mesh.position.setZ(offset);
		}
	}

	initialize(globalPortion: Portion) {
		this.model = new Model.MapPortion(globalPortion);
		this.floorsMeshes = [[], []];
		this.spritesFaceMeshes = [];
		this.spritesFixMeshes = [[], []];
		this.autotilesList = [];
		this.wallsMeshes = [];
		this.mountainsList = new Map();
		this.objects3DMeshes = [];
	}

	removeLastPreview() {
		const needUpdate = this.lastPreviewRemove.length > 0;
		for (const [position, element, kind] of this.lastPreviewRemove) {
			this.updateMapElement(position, element, kind, false, true, false, true);
		}
		this.lastPreviewRemove = [];
		if (needUpdate) {
			Scene.Map.current!.portionsToUpdate.add(this);
		}
	}

	add(
		position: Position,
		preview: boolean = false,
		removePreview = true,
		allowBorders = false,
		updateAutotiles = true
	) {
		if (removePreview) {
			Scene.Map.current!.forEachMapPortions((mapPortion) => {
				mapPortion?.removeLastPreview();
			});
		}
		switch (Scene.Map.currentSelectedMapElementKind) {
			case ELEMENT_MAP_KIND.FLOOR:
				this.updateMapElement(
					position,
					MapElement.Floor.create(
						Project.current!.settings.mapEditorCurrentTilesetFloorTexture,
						Scene.Map.current!.camera.getUp()
					),
					ELEMENT_MAP_KIND.FLOOR,
					preview,
					false,
					false,
					false,
					updateAutotiles
				);
				break;
			case ELEMENT_MAP_KIND.AUTOTILE:
				this.updateMapElement(
					position,
					MapElement.Autotile.create(
						Project.current!.settings.mapEditorCurrentAutotileID,
						MapElement.Autotiles.PREVIEW_TILE,
						Project.current!.settings.mapEditorCurrentAutotileTexture,
						Scene.Map.current!.camera.getUp()
					),
					ELEMENT_MAP_KIND.AUTOTILE,
					preview,
					false,
					false,
					false,
					updateAutotiles
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
						Project.current!.settings.mapEditorCurrentTilesetSpriteTexture,
						Scene.Map.current!.camera.getFront(Manager.GL.raycaster.ray.direction, position.angleY),
						Scene.Map.current!.layerRayPosition ? Scene.Map.current!.layerRayPosition.x - position.x : 0,
						Scene.Map.current!.layerRayPosition ? Scene.Map.current!.layerRayPosition.y - position.y : 0,
						Scene.Map.current!.layerRayPosition ? Scene.Map.current!.layerRayPosition.z - position.z : 0
					),
					Scene.Map.currentSelectedMapElementKind,
					preview,
					false,
					false,
					allowBorders
				);
				break;
			case ELEMENT_MAP_KIND.MOUNTAIN: {
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
			}
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

	remove(position: Position, preview = false, removePreview = true, updateAutotiles = true) {
		if (removePreview) {
			Scene.Map.current!.forEachMapPortions((mapPortion) => {
				mapPortion?.removeLastPreview();
			});
		}
		if (Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.MOUNTAIN) {
			const previous = this.model.getMapElement(
				position,
				ELEMENT_MAP_KIND.MOUNTAIN
			) as MapElement.Mountain | null;
			if (previous) {
				const mountain = previous as MapElement.Mountain;
				const floorPosition = position.clone();
				floorPosition.addY(mountain.heightSquares, mountain.heightPixels);
				this.updateMapElement(
					floorPosition,
					null,
					ELEMENT_MAP_KIND.FLOOR,
					preview,
					false,
					false,
					false,
					updateAutotiles
				);
			}
		}
		this.updateMapElement(
			position,
			null,
			Scene.Map.currentSelectedMapElementKind,
			preview,
			false,
			false,
			false,
			updateAutotiles
		);
	}

	updateMapElement(
		position: Position,
		element: MapElement.Base | null,
		kind: ELEMENT_MAP_KIND = ELEMENT_MAP_KIND.NONE,
		preview = false,
		removingPreview = false,
		undoRedo = false,
		allowBorders = false,
		updateAutotiles = true
	) {
		if (element !== null) {
			kind = element.kind;
		}
		switch (kind) {
			case ELEMENT_MAP_KIND.FLOOR:
				this.updateFloor(
					position,
					element as MapElement.Floor,
					preview,
					removingPreview,
					undoRedo,
					updateAutotiles
				);
				break;
			case ELEMENT_MAP_KIND.AUTOTILE:
				this.updateAutotile(
					position,
					element as MapElement.Autotile,
					preview,
					removingPreview,
					undoRedo,
					updateAutotiles
				);
				break;
			case ELEMENT_MAP_KIND.SPRITE_FACE:
			case ELEMENT_MAP_KIND.SPRITE_FIX:
			case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
			case ELEMENT_MAP_KIND.SPRITE_QUADRA:
				this.updateSprite(
					position,
					element as MapElement.Sprite,
					kind,
					preview,
					removingPreview,
					undoRedo,
					allowBorders
				);
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
		preview = false,
		removingPreview = false,
		undoRedo = false,
		updateAutotiles = true
	) {
		if (floor === null || undoRedo) {
			this.setMapElement(
				position,
				floor,
				ELEMENT_MAP_KIND.FLOOR,
				this.model.lands,
				preview,
				removingPreview,
				undoRedo
			);
		} else {
			switch (Project.current!.settings.mapEditorCurrentActionIndex) {
				case ACTION_KIND.PENCIL:
					for (let i = 0; i < floor.texture.width; i++) {
						for (let j = 0; j < floor.texture.height; j++) {
							const newPosition = position.clone();
							newPosition.x = position.x + i;
							newPosition.z = position.z + j;
							this.setMapElement(
								newPosition,
								MapElement.Floor.create(
									new Rectangle(floor.texture.x + i, floor.texture.y + j, 1, 1),
									floor.up
								),
								ELEMENT_MAP_KIND.FLOOR,
								this.model.lands,
								preview,
								removingPreview,
								undoRedo
							);
						}
					}
					break;
				case ACTION_KIND.RECTANGLE: {
					const x = Scene.Map.current!.rectangleStartPosition
						? Mathf.mod(position.x - Scene.Map.current!.rectangleStartPosition.x, floor.texture.width)
						: 0;
					const y = Scene.Map.current!.rectangleStartPosition
						? Mathf.mod(position.z - Scene.Map.current!.rectangleStartPosition.z, floor.texture.height)
						: 0;
					this.setMapElement(
						position,
						MapElement.Floor.create(
							new Rectangle(floor.texture.x + x, floor.texture.y + y, 1, 1),
							floor.up
						),
						ELEMENT_MAP_KIND.FLOOR,
						this.model.lands,
						preview,
						removingPreview,
						undoRedo
					);
					break;
				}
				case ACTION_KIND.PIN:
					this.setMapElement(
						position,
						MapElement.Floor.create(new Rectangle(floor.texture.x, floor.texture.y, 1, 1), floor.up),
						ELEMENT_MAP_KIND.FLOOR,
						this.model.lands,
						preview,
						removingPreview,
						undoRedo
					);
					break;
				default:
					break;
			}
		}
		if (updateAutotiles) {
			MapElement.Autotiles.updateAround(position);
		}
	}

	updateAutotile(
		position: Position,
		autotile: MapElement.Autotile | null,
		preview = false,
		removingPreview = false,
		undoRedo = false,
		updateAutotiles = true
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
		if (updateAutotiles) {
			MapElement.Autotiles.updateAround(position);
		}
	}

	updateSprite(
		position: Position,
		sprite: MapElement.Sprite | null,
		kind: ELEMENT_MAP_KIND,
		preview = false,
		removingPreview = false,
		undoRedo = false,
		allowBorders = false
	) {
		this.setMapElement(
			position,
			sprite,
			kind,
			this.model.sprites,
			preview,
			removingPreview,
			undoRedo,
			allowBorders
		);
	}

	updateWall(
		position: Position,
		wall: MapElement.SpriteWall | null,
		preview = false,
		removingPreview = false,
		undoRedo = false
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
		MapElement.SpriteWall.updateAround(position, !preview);
	}

	updateMountain(
		position: Position,
		mountain: MapElement.Mountain | null,
		preview = false,
		removingPreview = false,
		undoRedo = false
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
		MapElement.Mountains.updateAround(position);
	}

	updateObject3D(
		position: Position,
		object: MapElement.Object3D | null,
		preview = false,
		removingPreview = false,
		undoRedo = false
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
		preview = false,
		removingPreview = false,
		undoRedo = false,
		allowBorders = false
	): MapElement.Base | null {
		if (!Scene.Map.current || (element && !position.isInMap(Scene.Map.current.modelMap, allowBorders))) {
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
			Scene.Map.current.portionsToUpdate.add(this);
			if (!preview && !removingPreview) {
				Scene.Map.current.portionsToSave.add(this);
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
		if (Scene.Map.current!.selectedElement && Scene.Map.current!.selectedPosition) {
			const position = Scene.Map.current!.selectedElement.getPositionFromVec3(
				Scene.Map.current!.selectedMesh.position,
				Scene.Map.current!.selectedMesh.rotation,
				Scene.Map.current!.selectedMesh.scale
			);
			position.layer = Scene.Map.current!.selectedPosition.layer;
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
		Scene.Map.current!.scene.remove(Scene.Map.current!.hoveredMesh);
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
		const floorCounts: [number[], number[]] = [[], []];
		for (let i = 0; i < 2; i++) {
			for (const mesh of this.floorsMeshes[i]) {
				Scene.Map.current!.scene.remove(mesh);
			}
		}
		this.floorsMeshes = [[], []];
		for (const list of this.autotilesList) {
			if (list) {
				for (const autotiles of list) {
					for (let i = 0; i < 2; i++) {
						const meshes = autotiles.meshes[i];
						for (const mesh of meshes) {
							Scene.Map.current!.scene.remove(mesh);
						}
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
			const position = Position.fromKey(positionKey);
			if (land instanceof MapElement.Floor) {
				this.updateFloorGeometry(position, land, width, height, isPointedFloor, floorCounts);
			} else if (land instanceof MapElement.Autotile) {
				this.updateAutotileGeometry(position, land);
			}
		}

		for (let i = 0; i < 2; i++) {
			const meshes = this.floorsMeshes[i];
			for (let j = 0, l = meshes.length; j < l; j++) {
				const mesh = meshes[j];
				if (mesh) {
					MapPortion.offsetMeshPositionLayer(mesh, i, j);
					(mesh.geometry as CustomGeometry).updateAttributes();
					Scene.Map.current!.scene.add(mesh);
				}
			}
		}

		if (isPointedFloor) {
			const hoveredGeometry = Scene.Map.current!.hoveredMesh.geometry as CustomGeometry;
			if (!hoveredGeometry.isEmpty()) {
				hoveredGeometry.updateAttributes();
				Scene.Map.current!.hoveredMesh.renderOrder = 0;
				Scene.Map.current!.hoveredMesh.layers.enable(RAYCASTING_LAYER.LANDS);
				Scene.Map.current!.scene.add(Scene.Map.current!.hoveredMesh);
			}
		}

		// Autotiles: update all the geometry uvs and put it in the scene
		for (const list of this.autotilesList) {
			if (list) {
				for (const autotiles of list) {
					for (let i = 0; i < 2; i++) {
						const meshes = autotiles.meshes[i];
						for (let j = 0, l = meshes.length; j < l; j++) {
							const mesh = meshes[j];
							if (mesh) {
								MapPortion.offsetMeshPositionLayer(mesh, i, j);
								(mesh.geometry as CustomGeometry).updateAttributes();
								Scene.Map.current!.scene.add(mesh);
							}
						}
					}
				}
			}
		}
	}

	updateFloorGeometry(
		position: Position,
		floor: MapElement.Floor,
		width: number,
		height: number,
		isPointedFloor: boolean,
		floorCounts: [number[], number[]]
	) {
		if (Scene.Map.current!.selectedElement === floor) {
			const selectedGeometry = new CustomGeometry();
			floor.updateGeometry(selectedGeometry, new Position(0, 0, 0, 0, 0, 0, 0), width, height, 0, true);
			this.updateSelected(
				selectedGeometry,
				Scene.Map.current!.hoveredMesh.material,
				Scene.Map.current!.selectedElement.getLocalPosition(position),
				position
			);
		} else if (isPointedFloor && Scene.Map.current!.pointedMapElement === floor) {
			Scene.Map.current!.hoveredMesh.geometry = new CustomGeometry();
			floor.updateGeometry(
				Scene.Map.current!.hoveredMesh.geometry as CustomGeometry,
				position,
				width,
				height,
				0,
				true
			);
		} else {
			const side = floor.up ? 0 : 1;
			let mesh = this.floorsMeshes[side][position.layer];
			if (!mesh) {
				mesh = new THREE.Mesh(new CustomGeometry(), Scene.Map.current!.materialTileset);
				mesh.receiveShadow = true;
				mesh.castShadow = true;
				mesh.renderOrder = 0;
				mesh.layers.enable(RAYCASTING_LAYER.LANDS);
				this.floorsMeshes[side][position.layer] = mesh;
				floorCounts[side][position.layer] = 0;
			}
			const geometry = mesh.geometry as CustomGeometry;
			let count = floorCounts[side][position.layer];
			floor.updateGeometry(geometry, position, width, height, count);
			count++;
			floorCounts[side][position.layer] = count;
		}
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
		// Clear
		for (let i = 0; i < 2; i++) {
			for (const mesh of this.spritesFixMeshes[i]) {
				Scene.Map.current!.scene.remove(mesh);
			}
		}
		for (const mesh of this.spritesFaceMeshes) {
			Scene.Map.current!.scene.remove(mesh);
		}
		this.spritesFixMeshes = [[], []];
		this.spritesFaceMeshes = [];

		// New
		const isPointedSprite =
			Scene.Map.isTransforming() &&
			!Scene.Map.current!.isDraggingTransforming &&
			Scene.Map.currentSelectedMapElementKind >= ELEMENT_MAP_KIND.SPRITE_FACE &&
			Scene.Map.currentSelectedMapElementKind <= ELEMENT_MAP_KIND.SPRITE_QUADRA;
		const material = Scene.Map.current!.materialTileset;
		const { width, height } = Manager.GL.getMaterialTextureSize(material);
		const staticCounts: [number[], number[]] = [[], []];
		const faceCounts: number[] = [];
		for (const [positionKey, sprite] of this.model.sprites) {
			const position = Position.fromKey(positionKey);
			const localPosition = position.toVector3();
			if (sprite.kind === ELEMENT_MAP_KIND.SPRITE_FACE) {
				if (Scene.Map.current!.selectedElement === sprite) {
					const geometry = new CustomGeometryFace();
					sprite.updateGeometry(geometry, width, height, new Position(), 0, true, new THREE.Vector3(), true);
					this.updateSelected(geometry, Scene.Map.current!.hoveredMesh.material, localPosition, position);
				} else if (
					Project.current!.settings.mapEditorCurrentActionIndex !== ACTION_KIND.ROTATE &&
					isPointedSprite &&
					Scene.Map.current!.pointedMapElement === sprite
				) {
					const hoveredGeometry = new CustomGeometryFace();
					Scene.Map.current!.hoveredMesh.geometry = hoveredGeometry;
					sprite.updateGeometry(hoveredGeometry, width, height, position, 0, true, localPosition, true);
				} else {
					let mesh = this.spritesFaceMeshes[position.layer];
					if (!mesh) {
						mesh = new THREE.Mesh(new CustomGeometryFace(), Scene.Map.current!.materialTileset);
						mesh.receiveShadow = true;
						mesh.castShadow = true;
						mesh.renderOrder = 3;
						mesh.customDepthMaterial = material.userData.customDepthMaterial;
						mesh.layers.enable(RAYCASTING_LAYER.SPRITES);
						this.spritesFaceMeshes[position.layer] = mesh;
						faceCounts[position.layer] = 0;
					}
					const geometry = mesh.geometry as CustomGeometryFace;
					let faceCount = faceCounts[position.layer];
					faceCount = sprite.updateGeometry(
						geometry,
						width,
						height,
						position,
						faceCount,
						true,
						localPosition
					);
					faceCounts[position.layer] = faceCount;
				}
			} else {
				const side = sprite.front ? 0 : 1;
				if (Scene.Map.current!.selectedElement === sprite) {
					const geometry = new CustomGeometry();
					sprite.updateGeometry(geometry, width, height, new Position(), 0, true, new THREE.Vector3(), true);
					this.updateSelected(geometry, Scene.Map.current!.hoveredMesh.material, localPosition, position);
				} else if (isPointedSprite && Scene.Map.current!.pointedMapElement === sprite) {
					const hoveredGeometry = new CustomGeometry();
					Scene.Map.current!.hoveredMesh.geometry = hoveredGeometry;
					sprite.updateGeometry(hoveredGeometry, width, height, position, 0, true, localPosition, true);
				} else {
					let mesh = this.spritesFixMeshes[side][position.layer];
					if (!mesh) {
						mesh = new THREE.Mesh(new CustomGeometry(), Scene.Map.current!.materialTileset);
						mesh.receiveShadow = true;
						mesh.castShadow = true;
						mesh.renderOrder = 3;
						mesh.customDepthMaterial = material.userData.customDepthMaterial;
						mesh.layers.enable(RAYCASTING_LAYER.SPRITES);
						this.spritesFixMeshes[side][position.layer] = mesh;
						staticCounts[side][position.layer] = 0;
					}
					const geometry = mesh.geometry as CustomGeometry;
					let staticCount = staticCounts[side][position.layer];
					staticCount = sprite.updateGeometry(
						geometry,
						width,
						height,
						position,
						staticCount,
						true,
						localPosition
					);
					staticCounts[side][position.layer] = staticCount;
				}
			}
		}

		for (let i = 0; i < 2; i++) {
			const meshes = this.spritesFixMeshes[i];
			for (let j = 0, l = meshes.length; j < l; j++) {
				const mesh = meshes[j];
				if (mesh) {
					MapPortion.offsetMeshPositionLayer(mesh, i, j, false);
					(mesh.geometry as CustomGeometry).updateAttributes();
					Scene.Map.current!.scene.add(mesh);
				}
			}
		}
		for (let j = 0, l = this.spritesFaceMeshes.length; j < l; j++) {
			const mesh = this.spritesFaceMeshes[j];
			if (mesh) {
				MapPortion.offsetMeshPositionLayer(mesh, 0, j, false);
				(mesh.geometry as CustomGeometryFace).updateAttributes();
				Scene.Map.current!.scene.add(mesh);
			}
		}

		if (isPointedSprite) {
			const hoveredGeometry = Scene.Map.current!.hoveredMesh.geometry as CustomGeometry;
			if (!hoveredGeometry.isEmpty()) {
				hoveredGeometry.updateAttributes();
				Scene.Map.current!.hoveredMesh.renderOrder = 3;
				Scene.Map.current!.hoveredMesh.layers.enable(RAYCASTING_LAYER.SPRITES);
				Scene.Map.current!.scene.add(Scene.Map.current!.hoveredMesh);
			}
		}
	}

	updateWallsGeometry() {
		for (const mesh of this.wallsMeshes) {
			Scene.Map.current!.scene.remove(mesh);
		}
		this.wallsMeshes = [];
		const hash = new Map<number, GeometryMaterialType>();
		for (const [positionKey, wall] of this.model.walls) {
			const position = Position.fromKey(positionKey);
			let obj = hash.get(wall.wallID);
			let material: THREE.MeshPhongMaterial | null;
			let geometry: CustomGeometry;
			let count: number;
			if (obj) {
				geometry = obj.geometry;
				material = obj.material;
				count = obj.count as number;
			} else {
				material = MapElement.SpriteWall.getWallTexture(wall.wallID);
				geometry = new CustomGeometry();
				count = 0;
				obj = {
					geometry,
					material,
					count,
				};
				hash.set(wall.wallID, obj);
			}
			const { width, height } = Manager.GL.getMaterialTextureSize(material);
			obj.count = wall.updateGeometry(geometry, position, width, height, count);
		}
		// Add to scene
		for (const [, obj] of hash) {
			const geometry = obj.geometry;
			if (!geometry.isEmpty() && obj.material) {
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
			const position = Position.fromKey(positionKey);
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
		const hash = new Map<number, GeometryMaterialType>();
		for (const [positionKey, object3D] of this.model.objects3D) {
			const position = Position.fromKey(positionKey);
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
								geometry,
								material,
							};
							hash.set(0, obj);
						}
					}
				} else {
					if (obj) {
						geometry = obj.geometry;
						material = obj.material;
						count = obj.count as number;
					} else {
						material = MapElement.Object3D.getObject3DTexture(object3D.id);
						geometry = new CustomGeometry();
						obj = {
							geometry,
							material,
							count,
						};
						hash.set(object3D.data.pictureID, obj);
					}
					if (object3D && geometry) {
						obj.count = object3D.updateGeometry(geometry, position, count);
					}
				}
			}
		}

		// Add meshes
		for (const [, obj] of hash) {
			const geometry = obj.geometry;
			if (!geometry.isEmpty() && obj.material) {
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

	updateFaceSprites(angle: number) {
		for (const mesh of this.spritesFaceMeshes) {
			if (mesh) {
				(mesh.geometry as CustomGeometryFace).rotate(angle, MapElement.Base.Y_AXIS);
			}
		}
	}

	updatePositionLayers() {
		for (let i = 0; i < 2; i++) {
			let meshes = this.floorsMeshes[i];
			for (let j = 0, l = meshes.length; j < l; j++) {
				const mesh = meshes[j];
				if (mesh) {
					MapPortion.offsetMeshPositionLayer(mesh, i, j);
				}
			}
			for (const list of this.autotilesList) {
				if (list) {
					for (const autotiles of list) {
						const meshes = autotiles.meshes[i];
						for (let j = 0, l = autotiles.meshes.length; j < l; j++) {
							const mesh = meshes[j];
							if (mesh) {
								MapPortion.offsetMeshPositionLayer(mesh, i, j);
							}
						}
					}
				}
			}
			meshes = this.spritesFixMeshes[i];
			for (let j = 0, l = meshes.length; j < l; j++) {
				const mesh = meshes[j];
				if (mesh) {
					MapPortion.offsetMeshPositionLayer(mesh, i, j, false);
				}
			}
		}
		for (let j = 0, l = this.spritesFaceMeshes.length; j < l; j++) {
			const mesh = this.spritesFaceMeshes[j];
			if (mesh) {
				MapPortion.offsetMeshPositionLayer(mesh, 0, j, false);
			}
		}
	}

	cleanAll() {
		for (let i = 0; i < 2; i++) {
			for (const mesh of this.floorsMeshes[i]) {
				if (mesh) {
					Scene.Map.current!.scene.remove(mesh);
				}
			}
			for (const mesh of this.spritesFixMeshes[i]) {
				if (mesh) {
					Scene.Map.current!.scene.remove(mesh);
				}
			}
		}
		this.floorsMeshes = [[], []];
		this.spritesFixMeshes = [[], []];
		for (const mesh of this.spritesFaceMeshes) {
			if (mesh) {
				Scene.Map.current!.scene.remove(mesh);
			}
		}
		this.spritesFaceMeshes = [];
		for (const list of this.autotilesList) {
			if (list) {
				for (const autotiles of list) {
					for (let i = 0; i < 2; i++) {
						const meshes = autotiles.meshes[i];
						for (const mesh of meshes) {
							Scene.Map.current!.scene.remove(mesh);
						}
					}
				}
			}
		}
		this.autotilesList = [];
		for (const walls of this.wallsMeshes) {
			Scene.Map.current!.scene.remove(walls);
		}
		this.wallsMeshes = [];
		for (const [, mountains] of this.mountainsList) {
			if (mountains.mesh) {
				Scene.Map.current!.scene.remove(mountains.mesh);
			}
		}
		this.mountainsList = new Map();
		for (const objects of this.objects3DMeshes) {
			Scene.Map.current!.scene.remove(objects);
		}
		this.objects3DMeshes = [];
	}
}

export { MapPortion };
