/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';

import {
	ACTION_KIND,
	CUSTOM_SHAPE_KIND,
	ELEMENT_MAP_KIND,
	Mathf,
	PICTURE_KIND,
	RAYCASTING_LAYER,
	SHAPE_KIND,
} from '../common';
import { Manager, MapElement, Model, Scene } from '../Editor';
import { CustomGeometry } from './CustomGeometry';
import { CustomGeometryFace } from './CustomGeometryFace';
import { Portion } from './Portion';
import { Position } from './Position';
import { Position3D } from './Position3D';
import { Project } from './Project';
import { Rectangle } from './Rectangle';
import { UndoRedoState } from './UndoRedoState';

type GeometryMaterialType = {
	geometry: CustomGeometry;
	material: THREE.MeshPhongMaterial | null;
	count?: number;
};

class MapPortion {
	public map!: Scene.Map;
	public model!: Model.MapPortion;
	public floorsMeshes!: [THREE.Mesh[], THREE.Mesh[]]; // [0 for up, 1 for down][layer]
	public spritesFaceMeshes!: THREE.Mesh[]; // [layer]
	public spritesFixMeshes!: [THREE.Mesh[], THREE.Mesh[]]; // [0 for front, 1 for back][layer]
	public autotilesList!: MapElement.Autotiles[][];
	public wallsMeshes!: THREE.Mesh[];
	public mountainsList!: Map<number, MapElement.Mountains>;
	public objects3DMeshes!: THREE.Mesh[];
	public objectsMesh: THREE.Mesh | null = null;
	public objectsMeshes: THREE.Mesh[] = [];
	public objectsSpritesFaceMeshes: THREE.Mesh[] = [];
	public lastPreviewRemove: [position: Position, element: MapElement.Base | null, kind: ELEMENT_MAP_KIND][] = [];

	static offsetMeshPositionLayer(map: Scene.Map, mesh: THREE.Mesh, side: number, layer: number, up = true) {
		let offset = layer * map.camera.getYOffsetDepth();
		if (side === 1) {
			offset *= -1;
		}
		if (up) {
			mesh.position.setY(offset);
		} else {
			mesh.position.setZ(offset);
		}
	}

	initialize(globalPortion: Portion, map: Scene.Map) {
		this.model = new Model.MapPortion(globalPortion);
		this.map = map;
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
			this.map.portionsToUpdate.add(this);
		}
	}

	add(
		position: Position,
		preview: boolean = false,
		removePreview = true,
		allowBorders = false,
		updateAutotiles = true,
	) {
		if (removePreview) {
			this.map.forEachMapPortions((mapPortion) => {
				mapPortion?.removeLastPreview();
			});
		}
		switch (Scene.Map.currentSelectedMapElementKind) {
			case ELEMENT_MAP_KIND.FLOOR:
				this.updateMapElement(
					position,
					MapElement.Floor.create(
						Project.current!.settings.mapEditorCurrentTilesetFloorSpriteTexture,
						this.map.camera.getUp(),
					),
					ELEMENT_MAP_KIND.FLOOR,
					preview,
					false,
					false,
					false,
					updateAutotiles,
				);
				break;
			case ELEMENT_MAP_KIND.AUTOTILE:
				this.updateMapElement(
					position,
					MapElement.Autotile.create(
						Project.current!.settings.mapEditorCurrentAutotileID,
						MapElement.Autotiles.PREVIEW_TILE,
						Project.current!.settings.mapEditorCurrentAutotileTexture,
						this.map.camera.getUp(),
					),
					ELEMENT_MAP_KIND.AUTOTILE,
					preview,
					false,
					false,
					false,
					updateAutotiles,
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
						Project.current!.settings.mapEditorCurrentTilesetFloorSpriteTexture,
						this.map.camera.getFront(Manager.GL.raycaster.ray.direction, position.angleY),
						this.map.layerRayPosition ? this.map.layerRayPosition.x - position.x : 0,
						this.map.layerRayPosition ? this.map.layerRayPosition.y - position.y : 0,
						this.map.layerRayPosition ? this.map.layerRayPosition.z - position.z : 0,
					),
					Scene.Map.currentSelectedMapElementKind,
					preview,
					false,
					false,
					allowBorders,
				);
				break;
			case ELEMENT_MAP_KIND.MOUNTAIN: {
				const y = Project.current!.settings.mapEditorCurrentMountainHeightSquares;
				const yPixels = Position3D.getPercentOfPixels(
					Project.current!.settings.mapEditorCurrentMountainHeightPixels,
				);
				const newMountain = MapElement.Mountain.create(
					Project.current!.settings.mapEditorCurrentMountainID,
					Project.current!.settings.mapEditorCurrentMountainWidthSquaresBot,
					Position3D.getPercentOfPixels(Project.current!.settings.mapEditorCurrentMountainWidthPixelsBot),
					Project.current!.settings.mapEditorCurrentMountainWidthSquaresTop,
					Position3D.getPercentOfPixels(Project.current!.settings.mapEditorCurrentMountainWidthPixelsTop),
					Project.current!.settings.mapEditorCurrentMountainWidthSquaresLeft,
					Position3D.getPercentOfPixels(Project.current!.settings.mapEditorCurrentMountainWidthPixelsLeft),
					Project.current!.settings.mapEditorCurrentMountainWidthSquaresRight,
					Position3D.getPercentOfPixels(Project.current!.settings.mapEditorCurrentMountainWidthPixelsRight),
					y,
					yPixels,
				);
				const previousMountain = this.model.getMapElement(
					position,
					ELEMENT_MAP_KIND.MOUNTAIN,
				) as MapElement.Mountain | null;
				const s = Project.current!.settings;
				const floorPosition = position.clone();
				floorPosition.addY(y, yPixels);
				if (previousMountain && !previousMountain.equals(newMountain)) {
					const previousFloorPosition = position.clone();
					previousFloorPosition.addY(previousMountain.heightSquares, previousMountain.heightPixels);
					if (previousFloorPosition.y !== floorPosition.y || previousFloorPosition.yPixels !== floorPosition.yPixels) {
						const previousFloorPortion = this.map.getMapPortionByPosition(previousFloorPosition) ?? this;
						previousFloorPortion.updateMapElement(previousFloorPosition, null, ELEMENT_MAP_KIND.FLOOR, preview);
						previousFloorPortion.updateMapElement(
							previousFloorPosition,
							null,
							ELEMENT_MAP_KIND.AUTOTILE,
							preview,
							false,
							false,
							false,
							updateAutotiles,
						);
					}
				}
				if (s.mapEditorCurrentMountainTopFloorIsAutotile) {
					this.updateMapElement(
						floorPosition,
						MapElement.Autotile.create(
							s.mapEditorCurrentMountainTopFloorAutotileID,
							MapElement.Autotiles.PREVIEW_TILE,
							s.mapEditorCurrentMountainTopFloorAutotileRect,
							this.map.camera.getUp(),
						),
						ELEMENT_MAP_KIND.AUTOTILE,
						preview,
						false,
						false,
						false,
						updateAutotiles,
					);
				} else {
					this.updateMapElement(
						floorPosition,
						MapElement.Floor.create(
							new Rectangle(
								s.mapEditorCurrentMountainTopFloorTilesetRect.x,
								s.mapEditorCurrentMountainTopFloorTilesetRect.y,
							),
						),
						ELEMENT_MAP_KIND.FLOOR,
						preview,
					);
				}
				this.updateMapElement(position, newMountain, Scene.Map.currentSelectedMapElementKind, preview);
				break;
			}
			case ELEMENT_MAP_KIND.OBJECT3D: {
				const data = Project.current!.specialElements.getObject3DByID(
					Project.current!.settings.mapEditorCurrentObject3DID,
				);
				if (data) {
					this.updateMapElement(
						position,
						MapElement.Object3D.create(data),
						Scene.Map.currentSelectedMapElementKind,
						preview,
					);
				}
				break;
			}
		}
	}

	remove(position: Position, preview = false, removePreview = true, updateAutotiles = true) {
		if (removePreview) {
			this.map.forEachMapPortions((mapPortion) => {
				mapPortion?.removeLastPreview();
			});
		}
		if (Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.MOUNTAIN) {
			const previous = this.model.getMapElement(
				position,
				ELEMENT_MAP_KIND.MOUNTAIN,
			) as MapElement.Mountain | null;
			if (previous) {
				const mountain = previous as MapElement.Mountain;
				const floorPosition = position.clone();
				floorPosition.addY(mountain.heightSquares, mountain.heightPixels);
				const floorPortion = this.map.getMapPortionByPosition(floorPosition) ?? this;
				floorPortion.updateMapElement(
					floorPosition,
					null,
					ELEMENT_MAP_KIND.FLOOR,
					preview,
					false,
					false,
					false,
					updateAutotiles,
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
			updateAutotiles,
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
		updateAutotiles = true,
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
					updateAutotiles,
				);
				break;
			case ELEMENT_MAP_KIND.AUTOTILE:
				this.updateAutotile(
					position,
					element as MapElement.Autotile,
					preview,
					removingPreview,
					undoRedo,
					updateAutotiles,
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
					allowBorders,
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
		updateAutotiles = true,
	) {
		if (floor === null || undoRedo) {
			this.setMapElement(
				position,
				floor,
				ELEMENT_MAP_KIND.FLOOR,
				this.model.lands,
				preview,
				removingPreview,
				undoRedo,
			);
		} else {
			switch (Project.current!.settings.mapEditorCurrentActionIndex) {
				case ACTION_KIND.PENCIL:
					for (let i = 0; i < floor.texture.width; i++) {
						for (let j = 0; j < floor.texture.height; j++) {
							const newPosition = position.clone();
							newPosition.x = position.x + i;
							newPosition.z = position.z + j;
							const targetPortion = this.map.getMapPortionByPosition(newPosition);
							if (targetPortion) {
								targetPortion.setMapElement(
									newPosition,
									MapElement.Floor.create(
										new Rectangle(floor.texture.x + i, floor.texture.y + j, 1, 1),
										floor.up,
									),
									ELEMENT_MAP_KIND.FLOOR,
									targetPortion.model.lands,
									preview,
									removingPreview,
									undoRedo,
								);
							}
						}
					}
					break;
				case ACTION_KIND.RECTANGLE: {
					const x = this.map.rectangleStartPosition
						? Mathf.mod(position.x - this.map.rectangleStartPosition.x, floor.texture.width)
						: 0;
					const y = this.map.rectangleStartPosition
						? Mathf.mod(position.z - this.map.rectangleStartPosition.z, floor.texture.height)
						: 0;
					this.setMapElement(
						position,
						MapElement.Floor.create(
							new Rectangle(floor.texture.x + x, floor.texture.y + y, 1, 1),
							floor.up,
						),
						ELEMENT_MAP_KIND.FLOOR,
						this.model.lands,
						preview,
						removingPreview,
						undoRedo,
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
						undoRedo,
					);
					break;
				default:
					break;
			}
		}
		if (updateAutotiles) {
			MapElement.Autotiles.updateAround(this.map, position);
		}
	}

	updateAutotile(
		position: Position,
		autotile: MapElement.Autotile | null,
		preview = false,
		removingPreview = false,
		undoRedo = false,
		updateAutotiles = true,
	) {
		this.setMapElement(
			position,
			autotile,
			ELEMENT_MAP_KIND.AUTOTILE,
			this.model.lands,
			preview,
			removingPreview,
			undoRedo,
		);
		if (updateAutotiles) {
			MapElement.Autotiles.updateAround(this.map, position);
		}
	}

	updateSprite(
		position: Position,
		sprite: MapElement.Sprite | null,
		kind: ELEMENT_MAP_KIND,
		preview = false,
		removingPreview = false,
		undoRedo = false,
		allowBorders = false,
	) {
		this.setMapElement(
			position,
			sprite,
			kind,
			this.model.sprites,
			preview,
			removingPreview,
			undoRedo,
			allowBorders,
		);
	}

	updateWall(
		position: Position,
		wall: MapElement.SpriteWall | null,
		preview = false,
		removingPreview = false,
		undoRedo = false,
	) {
		this.setMapElement(
			position,
			wall,
			ELEMENT_MAP_KIND.SPRITE_WALL,
			this.model.walls,
			preview,
			removingPreview,
			undoRedo,
			true,
		);
		MapElement.SpriteWall.updateAround(this.map, position, !preview);
	}

	updateMountain(
		position: Position,
		mountain: MapElement.Mountain | null,
		preview = false,
		removingPreview = false,
		undoRedo = false,
	) {
		this.setMapElement(
			position,
			mountain,
			ELEMENT_MAP_KIND.MOUNTAIN,
			this.model.mountains,
			preview,
			removingPreview,
			undoRedo,
		);
		MapElement.Mountains.updateAround(this.map, position);
	}

	updateObject3D(
		position: Position,
		object: MapElement.Object3D | null,
		preview = false,
		removingPreview = false,
		undoRedo = false,
	) {
		this.setMapElement(
			position,
			object,
			ELEMENT_MAP_KIND.OBJECT3D,
			this.model.objects3D,
			preview,
			removingPreview,
			undoRedo,
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
		allowBorders = false,
	): MapElement.Base | null {
		if (!this.map || (element && !position.isInMap(this.map.model, allowBorders))) {
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
			this.map.lastPosition !== null &&
			(previous === null || !previous.isPreview)
		) {
			this.map.lastMapElement = previous;
		}
		if (element === null) {
			changed = elements.delete(key);
		} else {
			changed = previous ? !previous.equals(element) : true;
			elements.set(key, element);
		}
		if (changed && this.map) {
			this.map.portionsToUpdate.add(this);
			if (!preview && !removingPreview) {
				this.map.portionsToSave.add(this);
				if (!undoRedo) {
					this.map.undoRedoStates.push(
						UndoRedoState.create(
							position,
							previous,
							previous === null ? kind : previous.kind,
							element,
							kind,
						),
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
		if (this.map.selectedPosition && this.map.selectedElement) {
			const position = this.map.selectedPosition;
			const models = this.model.getModelsByKind(this.map.selectedElement.kind);
			if (models) {
				this.setMapElement(
					position.clone(),
					null,
					this.map.selectedElement.kind,
					models as Map<string, MapElement.Base>,
					false,
					false,
					false,
				);
			}
		}
	}

	addSelected() {
		if (this.map.selectedElement && this.map.selectedPosition) {
			const position = this.map.selectedElement.getPositionFromVec3(
				this.map.selectedMesh.position,
				this.map.selectedMesh.rotation,
				this.map.selectedMesh.scale,
			);
			position.layer = this.map.selectedPosition.layer;
			const models = this.model.getModelsByKind(this.map.selectedElement.kind);
			if (models) {
				this.setMapElement(
					position.clone(),
					this.map.selectedElement,
					this.map.selectedElement.kind,
					models as Map<string, MapElement.Base>,
					false,
					false,
					false,
				);
				this.map.selectedPosition = position;
			}
		}
	}

	updateSelected(
		geometry: CustomGeometry,
		material: THREE.Material | THREE.Material[],
		localPosition: THREE.Vector3,
		position: Position,
	) {
		geometry.updateAttributes();
		this.map.selectedMesh.geometry = geometry;
		this.map.selectedMesh.material = material;
		if (!this.map.transformControls.dragging) {
			this.map.selectedMesh.position.copy(localPosition);
			this.map.selectedMesh.rotation.copy(this.map.selectedElement!.getLocalRotation(position));
			this.map.selectedMesh.scale.copy(this.map.selectedElement!.getLocalScale(position));
		}
		this.map.scene.add(this.map.selectedMesh);
		this.map.transformControls.attach(this.map.selectedMesh);
	}

	updateObject(position: Position, object: Model.CommonObject | null, undoRedo = false) {
		const key = position.toKey();
		const previous = this.model.objects.get(key) || null;
		if (object === null) {
			this.model.objects.delete(key);
		} else {
			this.model.objects.set(key, object);
		}
		this.map.portionsToUpdate.add(this);
		this.map.portionsToSave.add(this);
		if (!undoRedo) {
			this.map.undoRedoStates.push(
				UndoRedoState.create(
					position,
					previous,
					ELEMENT_MAP_KIND.OBJECT,
					object?.clone() ?? null,
					ELEMENT_MAP_KIND.OBJECT,
				),
			);
		}
	}

	checkTextures() {
		for (const [, land] of this.model.lands) {
			if (land instanceof MapElement.Autotile) {
				const texturesAutotile = MapElement.Autotiles.getAutotileTexture(this.map, land.autotileID);
				if (texturesAutotile === null) {
					this.map.loading = true;
					this.loadTexturesAndUpdateGeometries().catch(console.error);
					return false;
				}
			}
		}
		for (const [, wall] of this.model.walls) {
			const textureWall = MapElement.SpriteWall.getWallTexture(this.map, wall.wallID);
			if (textureWall === null) {
				this.map.loading = true;
				this.loadTexturesAndUpdateGeometries().catch(console.error);
				return false;
			}
		}
		for (const [, mountain] of this.model.mountains) {
			const textureMountain = MapElement.Mountains.getMountainTexture(this.map, mountain.mountainID);
			if (textureMountain === null) {
				this.map.loading = true;
				this.loadTexturesAndUpdateGeometries().catch(console.error);
				return false;
			}
		}
		for (const [, object3D] of this.model.objects3D) {
			const textureObject3D = MapElement.Object3D.getObject3DTexture(this.map, object3D.id);
			if (textureObject3D === null || !MapElement.Object3D.isShapeLoaded(object3D.id)) {
				this.map.loading = true;
				this.loadTexturesAndUpdateGeometries().catch(console.error);
				return false;
			}
		}
		for (const [, object] of this.model.objects) {
			const state = object.getFirstState();
			if (state) {
				switch (state.graphicsKind) {
					case ELEMENT_MAP_KIND.SPRITE_FIX:
					case ELEMENT_MAP_KIND.SPRITE_FACE:
						if (state.graphicsID !== 0) {
							const textureCharacter = MapElement.Sprite.getCharacterTexture(this.map, state.graphicsID);
							if (textureCharacter === null) {
								this.map.loading = true;
								this.loadTexturesAndUpdateGeometries().catch(console.error);
								return false;
							}
						}
						break;
					case ELEMENT_MAP_KIND.OBJECT3D: {
						const textureObject3D = MapElement.Object3D.getObject3DTexture(this.map, state.graphicsID);
						if (textureObject3D === null || !MapElement.Object3D.isShapeLoaded(state.graphicsID)) {
							this.map.loading = true;
							this.loadTexturesAndUpdateGeometries().catch(console.error);
							return false;
						}
						break;
					}
				}
			}
		}
		return true;
	}

	async loadTexturesAndUpdateGeometries(updateLoading = true) {
		for (const [, land] of this.model.lands) {
			if (land instanceof MapElement.Autotile) {
				await MapElement.Autotiles.loadAutotileTexture(this.map, land.autotileID);
			}
		}
		for (const [, wall] of this.model.walls) {
			await MapElement.SpriteWall.loadWallTexture(this.map, wall.wallID);
		}
		for (const [, mountain] of this.model.mountains) {
			await MapElement.Mountains.loadMountainTexture(this.map, mountain.mountainID);
		}
		for (const [, object3D] of this.model.objects3D) {
			await MapElement.Object3D.loadObject3DTexture(this.map, object3D.id);
			await MapElement.Object3D.loadShapeOBJ(object3D.id);
		}
		for (const [, object] of this.model.objects) {
			const state = object.getFirstState();
			if (state) {
				switch (state.graphicsKind) {
					case ELEMENT_MAP_KIND.SPRITE_FIX:
					case ELEMENT_MAP_KIND.SPRITE_FACE:
						if (state.graphicsID !== 0) {
							await MapElement.Sprite.loadCharacterTexture(this.map, state.graphicsID);
						}
						break;
					case ELEMENT_MAP_KIND.OBJECT3D:
						await MapElement.Object3D.loadObject3DTexture(this.map, state.graphicsID);
						await MapElement.Object3D.loadShapeOBJ(state.graphicsID);
						break;
				}
			}
		}
		this.updateGeometriesWithoutCheck();
		if (updateLoading) {
			this.map.loading = false;
		}
	}

	updateGeometries() {
		if (this.checkTextures()) {
			this.updateGeometriesWithoutCheck();
		}
	}

	updateGeometriesWithoutCheck() {
		this.map.scene.remove(this.map.hoveredMesh);
		this.updateLandsGeometries();
		this.updateSpritesGeometry();
		this.updateWallsGeometry();
		this.updateMountainsGeometry();
		this.updateObjects3DGeometry();
		this.updateObjectsGeometry();
	}

	updateLandsGeometries() {
		const isPointedFloor =
			this.map.canEdit &&
			Scene.Map.isTransforming() &&
			!this.map.isDraggingTransforming &&
			Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.FLOOR;
		const material = this.map.materialTileset;
		const { width, height } = Manager.GL.getMaterialTextureSize(material);
		const floorCounts: [number[], number[]] = [[], []];
		for (let i = 0; i < 2; i++) {
			for (const mesh of this.floorsMeshes[i]) {
				this.map.scene.remove(mesh);
			}
		}
		this.floorsMeshes = [[], []];
		for (const list of this.autotilesList) {
			if (list) {
				for (const autotiles of list) {
					for (let i = 0; i < 2; i++) {
						const meshes = autotiles.meshes[i];
						for (const mesh of meshes) {
							this.map.scene.remove(mesh);
						}
					}
				}
			}
		}
		this.autotilesList = [];

		// Create autotiles according to the textures
		for (const autotile of Project.current!.specialElements.autotiles) {
			const autotileID = autotile.id;
			const pictureID = autotile.pictureID;
			const texturesAutotile = this.map.texturesAutotiles[pictureID];
			if (texturesAutotile) {
				for (const textureAutotile of texturesAutotile) {
					if (!this.autotilesList[autotileID]) {
						this.autotilesList[autotileID] = [];
					}
					this.autotilesList[autotileID].push(new MapElement.Autotiles(textureAutotile));
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
					MapPortion.offsetMeshPositionLayer(this.map, mesh, i, j);
					(mesh.geometry as CustomGeometry).updateAttributes();
					this.map.scene.add(mesh);
				}
			}
		}

		if (isPointedFloor) {
			const hoveredGeometry = this.map.hoveredMesh.geometry as CustomGeometry;
			if (!hoveredGeometry.isEmpty()) {
				hoveredGeometry.updateAttributes();
				this.map.hoveredMesh.renderOrder = 0;
				this.map.hoveredMesh.layers.enable(RAYCASTING_LAYER.LANDS);
				this.map.scene.add(this.map.hoveredMesh);
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
								MapPortion.offsetMeshPositionLayer(this.map, mesh, i, j);
								(mesh.geometry as CustomGeometry).updateAttributes();
								this.map.scene.add(mesh);
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
		floorCounts: [number[], number[]],
	) {
		if (this.map.selectedElement === floor) {
			const selectedGeometry = new CustomGeometry();
			floor.updateGeometry(this.map, selectedGeometry, new Position(0, 0, 0, 0, 0, 0, 0), width, height, 0, true);
			this.map.selectedPivotOffset.set(0, 0, 0);
			this.updateSelected(
				selectedGeometry,
				this.map.hoveredMesh.material,
				this.map.selectedElement.getLocalPosition(position),
				position,
			);
		} else if (isPointedFloor && this.map.pointedMapElement === floor) {
			this.map.hoveredMesh.geometry = new CustomGeometry();
			floor.updateGeometry(
				this.map,
				this.map.hoveredMesh.geometry as CustomGeometry,
				position,
				width,
				height,
				0,
				true,
			);
		} else {
			const side = floor.up ? 0 : 1;
			let mesh = this.floorsMeshes[side][position.layer];
			if (!mesh) {
				mesh = new THREE.Mesh(new CustomGeometry(), this.map.materialTileset);
				mesh.receiveShadow = true;
				mesh.castShadow = true;
				mesh.renderOrder = 0;
				mesh.layers.enable(RAYCASTING_LAYER.LANDS);
				this.floorsMeshes[side][position.layer] = mesh;
				floorCounts[side][position.layer] = 0;
			}
			const geometry = mesh.geometry as CustomGeometry;
			let count = floorCounts[side][position.layer];
			floor.updateGeometry(this.map, geometry, position, width, height, count);
			count++;
			floorCounts[side][position.layer] = count;
		}
	}

	updateAutotileGeometry(position: Position, autotile: MapElement.Autotile) {
		let texture = null;
		const texturesAutotile = MapElement.Autotiles.getAutotileTexture(this.map, autotile.autotileID);
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
			autotiles!.updateGeometry(this.map, position, autotile);
		}
	}

	updateSpritesGeometry() {
		// Clear
		for (let i = 0; i < 2; i++) {
			for (const mesh of this.spritesFixMeshes[i]) {
				this.map.scene.remove(mesh);
			}
		}
		for (const mesh of this.spritesFaceMeshes) {
			this.map.scene.remove(mesh);
		}
		this.spritesFixMeshes = [[], []];
		this.spritesFaceMeshes = [];

		// New
		const isPointedSprite =
			Scene.Map.isTransforming() &&
			!this.map.isDraggingTransforming &&
			Scene.Map.currentSelectedMapElementKind >= ELEMENT_MAP_KIND.SPRITE_FACE &&
			Scene.Map.currentSelectedMapElementKind <= ELEMENT_MAP_KIND.SPRITE_QUADRA;
		const material = this.map.materialTileset;
		const { width, height } = Manager.GL.getMaterialTextureSize(material);
		const staticCounts: [number[], number[]] = [[], []];
		const faceCounts: number[] = [];
		for (const [positionKey, sprite] of this.model.sprites) {
			const position = Position.fromKey(positionKey);
			const localPosition = position.toVector3();
			if (sprite.kind === ELEMENT_MAP_KIND.SPRITE_FACE) {
				if (this.map.selectedElement === sprite) {
					const geometry = new CustomGeometryFace();
					sprite.updateGeometry(
						this.map,
						geometry,
						width,
						height,
						new Position(),
						0,
						true,
						new THREE.Vector3(),
					);
					this.map.selectedPivotOffset.set(0, 0, 0);
					this.updateSelected(geometry, this.map.hoveredMesh.material, localPosition, position);
				} else if (
					Project.current!.settings.mapEditorCurrentActionIndex !== ACTION_KIND.ROTATE &&
					isPointedSprite &&
					this.map.pointedMapElement === sprite
				) {
					const hoveredGeometry = new CustomGeometryFace();
					this.map.hoveredMesh.geometry = hoveredGeometry;
					sprite.updateGeometry(this.map, hoveredGeometry, width, height, position, 0, true, localPosition);
				} else {
					let mesh = this.spritesFaceMeshes[position.layer];
					if (!mesh) {
						mesh = new THREE.Mesh(new CustomGeometryFace(), this.map.materialTileset);
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
						this.map,
						geometry,
						width,
						height,
						position,
						faceCount,
						true,
						localPosition,
					);
					faceCounts[position.layer] = faceCount;
				}
			} else {
				const side = sprite.front ? 0 : 1;
				if (this.map.selectedElement === sprite) {
					const geometry = new CustomGeometry();
					sprite.updateGeometry(
						this.map,
						geometry,
						width,
						height,
						new Position(),
						0,
						true,
						new THREE.Vector3(),
					);
					this.map.selectedPivotOffset.set(0, 0, 0);
					this.updateSelected(geometry, this.map.hoveredMesh.material, localPosition, position);
				} else if (isPointedSprite && this.map.pointedMapElement === sprite) {
					const hoveredGeometry = new CustomGeometry();
					this.map.hoveredMesh.geometry = hoveredGeometry;
					sprite.updateGeometry(this.map, hoveredGeometry, width, height, position, 0, true, localPosition);
				} else {
					let mesh = this.spritesFixMeshes[side][position.layer];
					if (!mesh) {
						mesh = new THREE.Mesh(new CustomGeometry(), this.map.materialTileset);
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
						this.map,
						geometry,
						width,
						height,
						position,
						staticCount,
						true,
						localPosition,
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
					(mesh.geometry as CustomGeometry).updateAttributes();
					this.map.scene.add(mesh);
				}
			}
		}
		for (let j = 0, l = this.spritesFaceMeshes.length; j < l; j++) {
			const mesh = this.spritesFaceMeshes[j];
			if (mesh) {
				(mesh.geometry as CustomGeometryFace).updateAttributes();
				this.map.scene.add(mesh);
			}
		}

		if (isPointedSprite && this.map.hoveredMesh) {
			const hoveredGeometry = this.map.hoveredMesh.geometry as CustomGeometry;
			if (!hoveredGeometry.isEmpty()) {
				hoveredGeometry.updateAttributes();
				this.map.hoveredMesh.renderOrder = 3;
				this.map.hoveredMesh.layers.enable(RAYCASTING_LAYER.SPRITES);
				this.map.scene.add(this.map.hoveredMesh);
			}
		}
	}

	updateWallsGeometry() {
		for (const mesh of this.wallsMeshes) {
			this.map.scene.remove(mesh);
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
				material = MapElement.SpriteWall.getWallTexture(this.map, wall.wallID);
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
				this.map.scene.add(mesh);
			}
		}
	}

	updateMountainsGeometry() {
		for (const [, mountains] of this.mountainsList) {
			if (mountains.mesh) {
				this.map.scene.remove(mountains.mesh);
			}
		}
		this.mountainsList = new Map();
		for (const [positionKey, mountain] of this.model.mountains) {
			const position = Position.fromKey(positionKey);
			const pictureID = Project.current!.specialElements.getMountainByID(mountain.mountainID)?.pictureID;
			let mountains = this.mountainsList.get(pictureID);
			if (!mountains) {
				mountains = new MapElement.Mountains(pictureID, this.map.texturesMountains.get(pictureID)!);
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
				this.map.scene.add(mountains.mesh!);
			}
		}
	}

	updateObjects3DGeometry() {
		const isPointedObject3D =
			Scene.Map.isTransforming() &&
			!this.map.isDraggingTransforming &&
			Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.OBJECT3D;
		for (const mesh of this.objects3DMeshes) {
			this.map.scene.remove(mesh);
		}
		this.objects3DMeshes = [];
		const hash = new Map<number, GeometryMaterialType>();
		for (const [positionKey, object3D] of this.model.objects3D) {
			const position = Position.fromKey(positionKey);
			if (!object3D.data) {
				object3D.data = Project.current!.specialElements.getObject3DByID(object3D.id);
			}
			if (object3D.data) {
				if (
					object3D.data.shapeKind === SHAPE_KIND.CUSTOM &&
					object3D.data.gltfID !== -1 &&
					object3D.data.pictureID === -1
				) {
					const shape = Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.GLTF, object3D.data.gltfID);
					if (shape?.gltfScene) {
						const clone = shape.gltfScene.clone();
						const s = Project.SQUARE_SIZE * object3D.data.scale;
						clone.scale.set(s * position.scaleX, s * position.scaleY, s * position.scaleZ);
						const localPosition = object3D.getLocalPosition(position);
						clone.position.copy(localPosition);
						clone.rotation.set(
							(position.angleX * Math.PI) / 180,
							(position.angleY * Math.PI) / 180,
							(position.angleZ * Math.PI) / 180,
						);
						clone.traverse((child) => {
							if (child instanceof THREE.Mesh) {
								child.receiveShadow = true;
								child.castShadow = true;
							}
						});
						clone.renderOrder = 999;
						clone.layers.enable(RAYCASTING_LAYER.OBJECTS3D);
						this.objects3DMeshes.push(clone as unknown as THREE.Mesh);
						this.map.scene.add(clone);
					}
					continue;
				}
				// Constructing the geometry
				let obj = hash.get(object3D.data.pictureID);
				let material: THREE.MeshPhongMaterial | null;
				let geometry: CustomGeometry | null = null;
				let count = 0;
				if (
					(isPointedObject3D && this.map.pointedMapElement === object3D) ||
					this.map.selectedElement === object3D
				) {
					material = MapElement.Object3D.getObject3DTexture(this.map, object3D.id, true);
					geometry = new CustomGeometry();
					if (object3D && material) {
						if (this.map.selectedElement === object3D) {
							object3D.updateGeometry(
								geometry,
								new Position(
									0,
									0,
									0,
									0,
									0,
									object3D.isCentered() ? 0 : 50,
									object3D.isCentered() ? 0 : 50,
								),
								0,
							);
							const selectedLocalPosition = this.map.selectedElement.getLocalPosition(position);
							// For custom OBJ models, center geometry at origin for correct
							// rotation pivot, and track the offset for the transform system
							if (object3D instanceof MapElement.Object3DCustom) {
								const center = object3D.getScaledCenter(position.toScaleVector());
								const verts = geometry._vertices;
								for (let vi = 0; vi < verts.length; vi += 3) {
									verts[vi] -= center.x;
									verts[vi + 1] -= center.y;
									verts[vi + 2] -= center.z;
								}
								this.map.selectedPivotOffset.copy(center);
								selectedLocalPosition.add(center);
							} else {
								this.map.selectedPivotOffset.set(0, 0, 0);
							}
							this.updateSelected(geometry, material, selectedLocalPosition, position);
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
						material = MapElement.Object3D.getObject3DTexture(this.map, object3D.id);
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
				this.map.scene.add(mesh);
			}
		}
	}

	updateObjectsGeometry() {
		if (this.objectsMesh !== null) {
			this.map.scene.remove(this.objectsMesh);
			this.objectsMesh = null;
		}
		for (const mesh of this.objectsMeshes) {
			this.map.scene.remove(mesh);
		}
		for (const mesh of this.objectsSpritesFaceMeshes) {
			this.map.scene.remove(mesh);
		}
		this.objectsMeshes = [];
		this.objectsSpritesFaceMeshes = [];
		const geometry = new CustomGeometry();
		let count = 0;
		for (const [positionKey, object] of this.model.objects) {
			const position = Position.fromKey(positionKey);

			// Object square cursor
			const vec = position.toVector3(false);
			const vecA = new THREE.Vector3(vec.x, vec.y, vec.z);
			const vecB = new THREE.Vector3(vec.x + Project.SQUARE_SIZE, vec.y, vec.z);
			const vecC = new THREE.Vector3(vec.x + Project.SQUARE_SIZE, vec.y, vec.z + Project.SQUARE_SIZE);
			const vecD = new THREE.Vector3(vec.x, vec.y, vec.z + Project.SQUARE_SIZE);
			geometry.pushQuadVertices(vecA, vecB, vecC, vecD);
			geometry.pushQuadIndices(count, position);
			const coef = MapElement.Base.COEF_TEX / Project.SQUARE_SIZE;
			const texA = new THREE.Vector2();
			const texB = new THREE.Vector2();
			const texC = new THREE.Vector2();
			const texD = new THREE.Vector2();
			CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, coef, coef, 1 - coef, 1 - coef);
			geometry.pushQuadUVs(texA, texB, texC, texD);
			count += 4;

			// Apply transforms from first state for sprite geometry
			const state = object.getFirstState();
			if (state) {
				position.centerX = state.centerX.getFixNumberValue();
				position.centerZ = state.centerZ.getFixNumberValue();
				position.angleX = state.angleX.getFixNumberValue();
				position.angleY = state.angleY.getFixNumberValue();
				position.angleZ = state.angleZ.getFixNumberValue();
				position.scaleX = state.scaleX.getFixNumberValue();
				position.scaleY = state.scaleY.getFixNumberValue();
				position.scaleZ = state.scaleZ.getFixNumberValue();
			}

			if (state) {
				let mesh: THREE.Mesh | null = null;
				switch (state.graphicsKind) {
					case ELEMENT_MAP_KIND.NONE:
						break;
					case ELEMENT_MAP_KIND.SPRITE_FIX:
					case ELEMENT_MAP_KIND.SPRITE_FACE: {
						const material =
							state.graphicsID === 0
								? this.map.materialTileset
								: this.map.texturesCharacters[state.graphicsID];
						const { width, height } = Manager.GL.getMaterialTextureSize(material);
						const characterRect = new Rectangle();
						if (state.graphicsID !== 0) {
							const picture = Project.current!.pictures.getByID(
								PICTURE_KIND.CHARACTERS,
								state.graphicsID,
							);
							if (picture) {
								const rows = picture.getRows();
								const squareWidth = width / Project.SQUARE_SIZE / Project.current!.systems.FRAMES;
								const squareHeight = height / Project.SQUARE_SIZE / rows;
								characterRect.x = state.graphicsIndexX * squareWidth;
								characterRect.y = state.graphicsIndexY * squareHeight;
								characterRect.width = squareWidth;
								characterRect.height = squareHeight;
							}
						}
						const sprite = MapElement.Sprite.create(
							state.graphicsKind,
							state.graphicsID === 0 ? (state.rectTileset ?? new Rectangle()) : characterRect,
						);
						const geometrySprite =
							state.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FIX
								? new CustomGeometry()
								: new CustomGeometryFace();
						const localPosition = position.toVector3();
						sprite.updateGeometry(
							this.map,
							geometrySprite,
							width,
							height,
							position,
							0,
							false,
							localPosition,
						);
						geometrySprite.updateAttributes();
						mesh = new THREE.Mesh(geometrySprite, material);
						if (state.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FIX) {
							this.objectsMeshes.push(mesh);
						} else {
							this.objectsSpritesFaceMeshes.push(mesh);
						}
						break;
					}
					case ELEMENT_MAP_KIND.OBJECT3D: {
						const material = MapElement.Object3D.getObject3DTexture(this.map, state.graphicsID);
						if (material) {
							const geometryObject3D = new CustomGeometry();
							const object3D = MapElement.Object3D.create(
								Project.current!.specialElements.getObject3DByID(state.graphicsID),
							);
							object3D.updateGeometry(geometryObject3D, position, 0);
							geometryObject3D.updateAttributes();
							mesh = new THREE.Mesh(geometryObject3D, material);
							this.objectsMeshes.push(mesh);
						}
						break;
					}
				}
				if (mesh) {
					mesh.receiveShadow = true;
					mesh.castShadow = true;
					mesh.renderOrder = state.graphicsKind === ELEMENT_MAP_KIND.OBJECT3D ? 999 : 3;
					this.map.scene.add(mesh);
				}
			}
		}
		// Object square cursors
		if (!geometry.isEmpty()) {
			geometry.updateAttributes();
			this.objectsMesh = new THREE.Mesh(geometry, Scene.Map.materialObjectSquare);
			this.objectsMesh.receiveShadow = true;
			this.objectsMesh.renderOrder = 0;
			this.objectsMesh.layers.enable(RAYCASTING_LAYER.OBJECTS);
			MapPortion.offsetMeshPositionLayer(this.map, this.objectsMesh, 0, 1);
			this.map.scene.add(this.objectsMesh);
		}
	}

	updateFaceSprites(angle: number) {
		for (const mesh of this.spritesFaceMeshes) {
			if (mesh) {
				(mesh.geometry as CustomGeometryFace).rotate(angle, MapElement.Base.Y_AXIS);
			}
		}
		for (const mesh of this.objectsSpritesFaceMeshes) {
			if (mesh) {
				(mesh.geometry as CustomGeometryFace).rotate(angle, MapElement.Base.Y_AXIS);
			}
		}
	}

	updatePositionLayers() {
		for (let i = 0; i < 2; i++) {
			const meshes = this.floorsMeshes[i];
			for (let j = 0, l = meshes.length; j < l; j++) {
				const mesh = meshes[j];
				if (mesh) {
					MapPortion.offsetMeshPositionLayer(this.map, mesh, i, j);
				}
			}
			for (const list of this.autotilesList) {
				if (list) {
					for (const autotiles of list) {
						const meshes = autotiles.meshes[i];
						for (let j = 0, l = autotiles.meshes.length; j < l; j++) {
							const mesh = meshes[j];
							if (mesh) {
								MapPortion.offsetMeshPositionLayer(this.map, mesh, i, j);
							}
						}
					}
				}
			}
		}
		if (this.objectsMesh) {
			MapPortion.offsetMeshPositionLayer(this.map, this.objectsMesh, 0, 1);
		}
	}

	cleanAll() {
		for (let i = 0; i < 2; i++) {
			for (const mesh of this.floorsMeshes[i]) {
				if (mesh) {
					this.map.scene.remove(mesh);
				}
			}
			for (const mesh of this.spritesFixMeshes[i]) {
				if (mesh) {
					this.map.scene.remove(mesh);
				}
			}
		}
		this.floorsMeshes = [[], []];
		this.spritesFixMeshes = [[], []];
		for (const mesh of this.spritesFaceMeshes) {
			if (mesh) {
				this.map.scene.remove(mesh);
			}
		}
		this.spritesFaceMeshes = [];
		for (const list of this.autotilesList) {
			if (list) {
				for (const autotiles of list) {
					for (let i = 0; i < 2; i++) {
						const meshes = autotiles.meshes[i];
						for (const mesh of meshes) {
							this.map.scene.remove(mesh);
						}
					}
				}
			}
		}
		this.autotilesList = [];
		for (const walls of this.wallsMeshes) {
			this.map.scene.remove(walls);
		}
		this.wallsMeshes = [];
		for (const [, mountains] of this.mountainsList) {
			if (mountains.mesh) {
				this.map.scene.remove(mountains.mesh);
			}
		}
		this.mountainsList = new Map();
		for (const objects of this.objects3DMeshes) {
			this.map.scene.remove(objects);
		}
		this.objects3DMeshes = [];
		if (this.objectsMesh !== null) {
			this.map.scene.remove(this.objectsMesh);
			this.objectsMesh = null;
		}
		for (const mesh of this.objectsMeshes) {
			this.map.scene.remove(mesh);
		}
		for (const mesh of this.objectsSpritesFaceMeshes) {
			this.map.scene.remove(mesh);
		}
	}
}

export { MapPortion };
