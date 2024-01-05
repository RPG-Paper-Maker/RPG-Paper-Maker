/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { Manager, MapElement, Model, Scene } from '../Editor';
import { Inputs } from '../managers';
import { Base } from '.';
import {
	Cursor,
	CustomGeometry,
	CustomGeometryFace,
	Frame,
	Grid,
	LocalFile,
	MapPortion,
	Portion,
	Position,
	Project,
	TextureBundle,
	UndoRedoState,
} from '../core';
import {
	Constants,
	ELEMENT_MAP_KIND,
	MOBILE_ACTION,
	RAYCASTING_LAYER,
	Paths,
	Mathf,
	Utils,
	ArrayUtils,
	ELEMENT_POSITION_KIND,
	ACTION_KIND,
} from '../common';
import { CursorWall } from '../core/CursorWall';
class Map extends Base {
	public static readonly MENU_BAR_HEIGHT = 26;

	public static current: Scene.Map | null;
	public static currentSelectedMapElementKind = ELEMENT_MAP_KIND.FLOOR;
	public static currentSelectedMobileAction = MOBILE_ACTION.PLUS;
	public static elapsedTime = 0;
	public static averageElapsedTime = 0;
	public static lastUpdateTime = new Date().getTime();
	public static canvasHUD: HTMLCanvasElement | null = null;
	public static canvasRendering: HTMLCanvasElement | null = null;
	public static ctxHUD: CanvasRenderingContext2D | null = null;
	public static ctxRendering: CanvasRenderingContext2D | null = null;
	public static animationFrameID: number;
	public static pictureTilesetCursor: HTMLImageElement;

	public id: number;
	public tag: Model.TreeMapTag;
	public needsTreeMapUpdate = false;
	public needsUpdateIndex: number | null = null;
	public needsUpdateLength: number | null = null;
	public needsUpdateSelectedPosition?: Position | null;
	public needsUpdateSelectedMapElement = false;
	public needsClose = false;
	public modelMap: Model.Map = new Model.Map();
	public grid = new Grid();
	public cursor: Cursor;
	public cursorWall = new CursorWall();
	public meshPlane: THREE.Object3D | null = null;
	public sunLight!: THREE.DirectionalLight;
	public transformControls!: TransformControls;
	public mapPortion!: MapPortion;
	public materialTileset!: THREE.MeshPhongMaterial;
	public materialTilesetHover!: THREE.MeshPhongMaterial;
	public selectionOffset: THREE.Vector2 = new THREE.Vector2();
	public portionsToUpdate: Portion[] = [];
	public portionsToSave: Portion[] = [];
	public portionsSaving: Portion[] = [];
	public undoRedoStates: UndoRedoState[] = [];
	public undoRedoStatesSaving: UndoRedoState[] = [];
	public lastPosition: Position | null = null;
	public lastMapElement: MapElement.Base | null = null;
	public pointedMapElementPosition: Position | null = null;
	public pointedMapElement: MapElement.Base | null = null;
	public isMobileMovingCursor = false;
	public texturesAutotiles: TextureBundle[][] = [];
	public texturesWalls: THREE.MeshPhongMaterial[] = [];
	public texturesObjects3D: THREE.MeshPhongMaterial[] = [];
	public texturesObjects3DHover: THREE.MeshPhongMaterial[] = [];
	public texturesMountains: globalThis.Map<number, THREE.MeshPhongMaterial> = new globalThis.Map();
	public autotilesOffset = new THREE.Vector2();
	public autotileFrame = new Frame(Project.current!.systems.autotilesFrameDuration, {
		frames: Project.current!.systems.autotilesFrames,
	});
	public selectedMesh!: THREE.Mesh;
	public selectedElement: MapElement.Base | null = null;
	public selectedPosition: Position | null = null;
	public rectangleStartPosition: Position | null = null;
	public lockedY: number | null = null;
	public lockedYPixels: number | null = null;
	public requestPaintHUD = false;
	public needsUpdateRaycasting = false;
	public mouseUp = false;
	public isTransforming = false;
	public isDraggingTransforming = false;

	constructor(tag: Model.TreeMapTag) {
		super(tag);
		this.id = tag.id;
		this.tag = tag;
		this.cursor = new Cursor(tag.cursorPosition || new Position());
	}

	static isAdding(): boolean {
		return Constants.isMobile
			? Scene.Map.currentSelectedMobileAction === MOBILE_ACTION.PLUS && Inputs.isPointerPressed
			: Inputs.isPointerPressed;
	}

	static isRemoving(): boolean {
		return Constants.isMobile
			? Scene.Map.currentSelectedMobileAction === MOBILE_ACTION.MINUS && Inputs.isPointerPressed
			: Inputs.isMouseRightPressed;
	}

	static isTransforming(): boolean {
		return (
			Project.current!.settings.mapEditorCurrentActionIndex >= ACTION_KIND.TRANSLATE &&
			Project.current!.settings.mapEditorCurrentActionIndex <= ACTION_KIND.SCALE
		);
	}

	static isDrawing(): boolean {
		return (
			Project.current!.settings.mapEditorCurrentActionIndex >= ACTION_KIND.PENCIL &&
			Project.current!.settings.mapEditorCurrentActionIndex <= ACTION_KIND.PIN
		);
	}

	getPath(): string {
		return Paths.join(Project.current?.getPathMaps(), Model.Map.generateMapName(this.id));
	}

	getLocalPortion(position: Position): Portion {
		return new Portion(
			Math.floor(position.x / Constants.PORTION_SIZE) -
				Math.floor(this.cursor.position.x / Constants.PORTION_SIZE),
			Math.floor(position.y / Constants.PORTION_SIZE) -
				Math.floor(this.cursor.position.y / Constants.PORTION_SIZE),
			Math.floor(position.z / Constants.PORTION_SIZE) -
				Math.floor(this.cursor.position.z / Constants.PORTION_SIZE)
		);
	}

	async load() {
		Manager.GL.mapEditorContext.renderer.setClearColor('#8cc3ed');

		// Tileset texture material
		this.materialTileset = await Manager.GL.loadTexture('./Assets/plains-woods.png');
		this.materialTilesetHover = Manager.GL.createMaterial({ texture: this.materialTileset.map, hovered: true });

		// Load map model
		const mapName = Model.Map.generateMapName(this.id);
		const folderMap = Paths.join(Project.current!.getPathMaps(), mapName);
		const file = await LocalFile.getFile(Paths.join(folderMap, Paths.FILE_MAP_INFOS));
		if (file) {
			this.modelMap.read(JSON.parse(file.content));
		}

		// Create grid plane
		const material = new THREE.Material();
		material.visible = false;
		material.side = THREE.DoubleSide;
		const length = Project.SQUARE_SIZE * this.modelMap.length;
		const width = Project.SQUARE_SIZE * this.modelMap.width;
		const extremeSize = Project.SQUARE_SIZE * 1000;
		this.meshPlane = new THREE.Mesh(
			new THREE.PlaneGeometry(length + extremeSize, width + extremeSize, 1),
			material
		);
		this.meshPlane.visible = false;
		this.meshPlane.position.set(Math.floor(length / 2), 0, Math.floor(width / 2));
		this.meshPlane.rotation.set(Math.PI / -2, 0, 0);
		this.meshPlane.layers.enable(RAYCASTING_LAYER.PLANE);
		this.scene.add(this.meshPlane);

		// Load portions
		const globalPortion = new Portion(0, 0, 0);
		this.mapPortion = new MapPortion();
		this.mapPortion.initialize(globalPortion);
		await this.mapPortion.model.load();
		this.mapPortion.updateMaterials();
		await this.mapPortion.loadTexturesAndUpdateGeometries(false);

		// Cursors
		await this.cursor.load();
		this.cursorWall.initialize();

		// Light
		this.initializeSunLight();

		// Grid
		this.grid.initialize(this.modelMap);
		this.syncCursorGrid();

		// Transform controls
		this.transformControls = new TransformControls(
			this.camera.getThreeCamera(),
			Manager.GL.mapEditorContext.renderer.domElement
		);
		this.transformControls.setTranslationSnap(1);
		if (Scene.Map.isTransforming()) {
			Scene.Map.current!.setTransformMode(Project.current!.settings.mapEditorCurrentActionIndex);
		}
		this.scene.add(this.transformControls);
		this.selectedMesh = new THREE.Mesh(new CustomGeometry(), this.materialTilesetHover);
		this.selectedMesh.receiveShadow = true;
		this.selectedMesh.castShadow = true;

		this.loading = false;
	}

	async save() {
		this.loading = true;
		await this.modelMap.save();
		await this.mapPortion.model.save();
		this.loading = false;
	}

	async savePortions() {
		if (this.portionsSaving.length > 0) {
			await this.mapPortion.model.save(true);
		}
		this.portionsSaving = [];
		if (this.tag.saved) {
			this.tag.saved = false;
			this.needsTreeMapUpdate = true;
			if (Project.current) {
				await Project.current.treeMaps.save();
			}
		}
	}

	async saveUndoRedoStates() {
		const { index, length } = await Manager.UndoRedo.createStates(this.undoRedoStatesSaving);
		this.undoRedoStatesSaving = [];
		this.needsUpdateIndex = index;
		this.needsUpdateLength = length;
	}

	initializeSunLight() {
		const ambient = new THREE.AmbientLight(0xffffff, 1.2);
		this.scene.add(ambient);
		this.sunLight = new THREE.DirectionalLight(0xffffff, 2);
		this.sunLight.position.set(-1, 1.75, 1);
		this.sunLight.position.multiplyScalar(Project.SQUARE_SIZE * 10);
		this.sunLight.target.position.set(0, 0, 0);
		this.scene.add(this.sunLight);
		this.sunLight.castShadow = true;
		this.sunLight.shadow.mapSize.width = 2048;
		this.sunLight.shadow.mapSize.height = 2048;
		const d = Project.SQUARE_SIZE * 10;
		this.sunLight.shadow.camera.left = -d;
		this.sunLight.shadow.camera.right = d;
		this.sunLight.shadow.camera.top = d;
		this.sunLight.shadow.camera.bottom = -d;
		this.sunLight.shadow.camera.far = Project.SQUARE_SIZE * 350;
		this.sunLight.shadow.bias = -0.0003;
	}

	add(position: Position, preview = false, removePreview = true) {
		if (!preview) {
			const positions = Mathf.traceLine(this.lastPosition, position);
			for (const p of positions) {
				if (p.isInMap(this.modelMap)) {
					this.mapPortion.add(p, preview, removePreview);
				} else {
					if (removePreview) {
						this.mapPortion.removeLastPreview();
					}
				}
			}
		} else {
			if (
				position.isInMap(
					this.modelMap,
					Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.SPRITE_WALL
				)
			) {
				this.mapPortion.add(position, preview, removePreview);
			} else {
				if (removePreview) {
					this.mapPortion.removeLastPreview();
				}
			}
		}
	}

	remove(position: Position, preview = false, removePreview = true) {
		if (!preview) {
			const positions = Mathf.traceLine(this.lastPosition, position);
			for (const p of positions) {
				if (
					p.isInMap(this.modelMap, Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.SPRITE_WALL)
				) {
					this.mapPortion.remove(p, preview, removePreview);
				} else {
					if (removePreview) {
						this.mapPortion.removeLastPreview();
					}
				}
			}
		} else {
			if (
				position.isInMap(
					this.modelMap,
					Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.SPRITE_WALL
				)
			) {
				this.mapPortion.remove(position, preview, removePreview);
			} else {
				if (removePreview) {
					this.mapPortion.removeLastPreview();
				}
			}
		}
	}

	syncCursorGrid() {
		const totalY = this.cursor.position.getTotalY();
		this.meshPlane!.position.setY(totalY);
		this.grid.line.position.setY(totalY + this.camera.getYOffsetDepth());
		this.cursor.syncWithCameraTargetPosition();
		this.camera.update();
	}

	async moveCursorHeight(square: boolean, up: boolean) {
		const addition = up ? 1 : -1;
		if (square) {
			const newY = this.cursor.position.y + addition;
			if (newY >= -this.modelMap.depth && newY < this.modelMap.height) {
				this.cursor.position.y = newY;
			}
		} else {
			this.cursor.position.updateYPixels(this.cursor.position.getTotalYPixels() + addition);
		}
		this.syncCursorGrid();
		this.requestPaintHUD = true;
		if (this.tag) {
			this.tag.cursorPosition = this.cursor.position;
			await Project.current!.treeMaps.save();
		}
	}

	async moveCursorSquareUp() {
		await this.moveCursorHeight(true, true);
	}

	async moveCursorPixelUp() {
		await this.moveCursorHeight(false, true);
	}

	async moveCursorSquareDown() {
		await this.moveCursorHeight(true, false);
	}

	async moveCursorPixelDown() {
		await this.moveCursorHeight(false, false);
	}

	zoom(isIn: boolean, coef = 1) {
		this.grid.line.position.setY(this.cursor.position.getTotalY() + this.camera.getYOffsetDepth());
		this.cursor.updateMeshPosition();
		if (isIn) {
			this.camera.zoomIn(coef);
		} else {
			this.camera.zoomOut(coef);
		}
	}

	zoomIn(coef = 1) {
		this.zoom(true, coef);
	}

	zoomOut(coef = 1) {
		this.zoom(false, coef);
	}

	updateTransform() {
		this.updateTransformPosition();
		this.mapPortion.removeSelected();
		this.mapPortion.addSelected();
	}

	updateTransformPosition() {
		if (
			this.selectedElement &&
			Project.current!.settings.mapEditorCurrentElementPositionIndex === ELEMENT_POSITION_KIND.SQUARE
		) {
			this.selectedMesh.position.setX(
				this.selectedMesh.position.x -
					(this.selectedMesh.position.x % Project.SQUARE_SIZE) +
					this.selectedElement.getAdditionalX()
			);
			this.selectedMesh.position.setY(
				this.selectedMesh.position.y -
					(this.selectedMesh.position.y % Project.SQUARE_SIZE) +
					this.selectedElement.getAdditionalY()
			);
			this.selectedMesh.position.setZ(
				this.selectedMesh.position.z -
					(this.selectedMesh.position.z % Project.SQUARE_SIZE) +
					this.selectedElement.getAdditionalZ()
			);
			this.selectedMesh.scale.setX(Math.max(1, this.selectedMesh.scale.x - (this.selectedMesh.scale.x % 1)));
			this.selectedMesh.scale.setY(Math.max(1, this.selectedMesh.scale.y - (this.selectedMesh.scale.y % 1)));
			this.selectedMesh.scale.setZ(Math.max(1, this.selectedMesh.scale.z - (this.selectedMesh.scale.z % 1)));
		}
		if (this.selectedMesh.position.x < 0) {
			this.selectedMesh.position.setX(0);
		} else if (this.selectedMesh.position.x > (this.modelMap.width - 1) * Project.SQUARE_SIZE) {
			this.selectedMesh.position.setX((this.modelMap.width - 1) * Project.SQUARE_SIZE);
		}
		if (this.selectedMesh.position.y < this.modelMap.depth * Project.SQUARE_SIZE) {
			this.selectedMesh.position.setY(this.modelMap.depth * Project.SQUARE_SIZE);
		} else if (this.selectedMesh.position.y > (this.modelMap.height - 1) * Project.SQUARE_SIZE) {
			this.selectedMesh.position.setY((this.modelMap.height - 1) * Project.SQUARE_SIZE);
		}
		if (this.selectedMesh.position.z < 0) {
			this.selectedMesh.position.setZ(0);
		} else if (this.selectedMesh.position.z > (this.modelMap.length - 1) * Project.SQUARE_SIZE) {
			this.selectedMesh.position.setZ((this.modelMap.length - 1) * Project.SQUARE_SIZE);
		}
		if (this.transformControls.axis === null || this.transformControls.axis.includes('X')) {
			this.selectedMesh.scale.setX(this.selectedMesh.scale.x <= 0 ? 0.001 : this.selectedMesh.scale.x);
			this.selectedMesh.scale.setZ(this.selectedMesh.scale.x);
		} else {
			this.selectedMesh.scale.setZ(this.selectedMesh.scale.z <= 0 ? 0.001 : this.selectedMesh.scale.z);
			this.selectedMesh.scale.setX(this.selectedMesh.scale.z);
		}
		this.selectedMesh.scale.setY(this.selectedMesh.scale.y <= 0 ? 0.001 : this.selectedMesh.scale.y);
	}

	removeTransform() {
		if (this.selectedElement) {
			this.transformControls.detach();
			this.addPortionToUpdate(this.mapPortion.model.globalPortion);
			this.selectedPosition = null;
			this.selectedElement = null;
			this.scene.remove(this.selectedMesh);
			this.needsUpdateSelectedPosition = null;
			this.needsUpdateSelectedMapElement = true;
		}
	}

	getTransformMode(action: ACTION_KIND) {
		switch (action) {
			case ACTION_KIND.TRANSLATE:
				return 'translate';
			case ACTION_KIND.ROTATE:
				return 'rotate';
			case ACTION_KIND.SCALE:
				return 'scale';
			default:
				throw Error('Not a transformation');
		}
	}

	setTransformMode(action: ACTION_KIND) {
		this.transformControls.setMode(this.getTransformMode(action));
	}

	updateUndoRedoSave() {
		if (this.undoRedoStatesSaving.length === 0 && this.undoRedoStates.length > 0) {
			this.undoRedoStatesSaving = [...this.undoRedoStates];
			this.saveUndoRedoStates().catch(console.error);
			this.undoRedoStates = [];
		}
	}

	updateLockedY(position: Position) {
		if (this.lockedY === null) {
			this.lockedY = position.y;
			this.lockedYPixels = position.yPixels;
		}
	}

	updateRaycasting() {
		const pointer = new THREE.Vector2();
		if (Manager.GL.mapEditorContext.parent) {
			pointer.x = (Inputs.getPositionX() / Manager.GL.mapEditorContext.canvasWidth) * 2 - 1;
			pointer.y = -(Inputs.getPositionY() / Manager.GL.mapEditorContext.canvasHeight) * 2 + 1;
		}
		Manager.GL.raycaster.setFromCamera(pointer, this.camera.getThreeCamera());
		let layer = RAYCASTING_LAYER.LANDS;
		if (Inputs.isMouseRightPressed && this.rectangleStartPosition === null) {
			switch (Scene.Map.currentSelectedMapElementKind) {
				case ELEMENT_MAP_KIND.SPRITE_FACE:
				case ELEMENT_MAP_KIND.SPRITE_FIX:
				case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
				case ELEMENT_MAP_KIND.SPRITE_QUADRA:
					layer = RAYCASTING_LAYER.SPRITES;
					break;
				case ELEMENT_MAP_KIND.MOUNTAIN:
					layer = RAYCASTING_LAYER.MOUNTAINS;
					break;
				case ELEMENT_MAP_KIND.OBJECT3D:
					layer = RAYCASTING_LAYER.OBJECTS3D;
					break;
			}
		}
		Manager.GL.raycaster.layers.set(layer);
		const previousPointedMapElementPosition = this.pointedMapElementPosition;
		const previousPointedMapElement = this.pointedMapElement;
		const previousPlaneY = this.meshPlane!.position.y;
		if (this.lockedY !== null && this.lockedYPixels !== null) {
			this.meshPlane!.position.setY(
				this.lockedY * Project.SQUARE_SIZE + Math.floor((this.lockedYPixels * Project.SQUARE_SIZE) / 100)
			);
			this.meshPlane!.updateMatrixWorld();
		}
		let intersects = Manager.GL.raycaster.intersectObjects(this.scene.children);
		Manager.GL.raycaster.layers.set(RAYCASTING_LAYER.PLANE);
		const intersectsPlane = Manager.GL.raycaster.intersectObjects(this.scene.children);
		const dist = intersects.length > 0 ? intersects[0].distance : Number.POSITIVE_INFINITY;
		const distPlane = intersectsPlane.length > 0 ? intersectsPlane[0].distance : Number.POSITIVE_INFINITY;
		if (distPlane < dist || this.rectangleStartPosition) {
			intersects = intersectsPlane;
			layer = RAYCASTING_LAYER.PLANE;
		}
		// Intersection for deleting or adding stuff
		for (const obj of intersects) {
			let position = new Position(
				Math.floor(obj.point.x / Project.SQUARE_SIZE),
				this.lockedY === null ? this.cursor.position.y : this.lockedY,
				this.lockedYPixels === null ? this.cursor.position.yPixels : this.lockedYPixels,
				Math.floor(obj.point.z / Project.SQUARE_SIZE)
			);
			if (
				obj.faceIndex !== undefined &&
				(Scene.Map.isRemoving() || (this.lockedY === null && this.lockedYPixels === null))
			) {
				const newPositionKey = ((obj.object as THREE.Mesh).geometry as CustomGeometry)?.facePositions?.[
					obj.faceIndex
				];
				if (newPositionKey && (Scene.Map.isRemoving() || layer === RAYCASTING_LAYER.LANDS)) {
					const newPosition = new Position();
					newPosition.fromKey(newPositionKey);
					if (Scene.Map.isRemoving()) {
						const element = this.mapPortion.model.getMapElement(
							newPosition,
							Scene.Map.currentSelectedMapElementKind
						);
						if (element && element.isPreview) {
							continue;
						}
					}
					if (layer === RAYCASTING_LAYER.LANDS) {
						const element = this.mapPortion.model.getMapElement(newPosition, ELEMENT_MAP_KIND.FLOOR);
						if (element && element.isPreview) {
							continue;
						}
					} else if (
						this.lockedY !== null &&
						this.lockedYPixels !== null &&
						Scene.Map.isRemoving() &&
						(newPosition.y !== this.lockedY || newPosition.yPixels !== this.lockedYPixels)
					) {
						continue;
					}
					position = newPosition;
				}
			}
			if (
				!Scene.Map.isRemoving() &&
				Project.current!.settings.mapEditorCurrentElementPositionIndex === ELEMENT_POSITION_KIND.PIXEL
			) {
				position.centerX = ((Math.floor(obj.point.x) % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100;
				position.centerZ = ((Math.floor(obj.point.z) % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100;
			}
			if (this.lastPosition === null || !this.lastPosition.equals(position)) {
				if (
					Project.current!.settings.mapEditorCurrentActionIndex === ACTION_KIND.RECTANGLE &&
					this.rectangleStartPosition === null &&
					Scene.Map.isRemoving() &&
					this.lastPosition === null
				) {
					this.rectangleStartPosition = position.clone();
				}
				if (Scene.Map.isDrawing()) {
					if (Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.SPRITE_WALL) {
						if (Scene.Map.isAdding()) {
							this.updateLockedY(position);
							this.cursorWall.update(position);
							this.add(position, true);
						} else if (Scene.Map.isRemoving()) {
							this.updateLockedY(position);
							this.cursorWall.update(position);
							this.remove(position, true);
						}
					} else {
						if (!Inputs.isPointerPressed && !Inputs.isMouseRightPressed) {
							this.add(position, true);
						} else if (Scene.Map.isAdding()) {
							this.updateLockedY(position);
							if (this.rectangleStartPosition) {
								const positions = this.rectangleStartPosition.getPositionsRectangle(position);
								this.mapPortion.removeLastPreview();
								for (const rectanglePosition of positions) {
									this.add(rectanglePosition, true, false);
								}
							} else {
								this.add(position);
							}
						} else if (Scene.Map.isRemoving()) {
							this.updateLockedY(position);
							if (this.rectangleStartPosition) {
								const positions = this.rectangleStartPosition.getPositionsRectangle(position);
								this.mapPortion.removeLastPreview();
								for (const rectanglePosition of positions) {
									this.remove(rectanglePosition, true, false);
								}
							} else {
								this.remove(position);
							}
						}
					}
				}
				this.lastPosition = position;
				this.pointedMapElementPosition = position;
				this.pointedMapElement = null;
			}
			break;
		}
		if (intersects.length === 0) {
			this.mapPortion.removeLastPreview();
			this.lastPosition = null;
			this.pointedMapElementPosition = null;
			this.pointedMapElement = null;
		}

		// For displaying information on left bottom corner
		switch (Scene.Map.currentSelectedMapElementKind) {
			case ELEMENT_MAP_KIND.FLOOR:
			case ELEMENT_MAP_KIND.AUTOTILE:
				layer = RAYCASTING_LAYER.LANDS;
				break;
			case ELEMENT_MAP_KIND.SPRITE_FACE:
			case ELEMENT_MAP_KIND.SPRITE_FIX:
			case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
			case ELEMENT_MAP_KIND.SPRITE_QUADRA:
				layer = RAYCASTING_LAYER.SPRITES;
				break;
			case ELEMENT_MAP_KIND.SPRITE_WALL:
				layer = RAYCASTING_LAYER.WALLS;
				break;
			case ELEMENT_MAP_KIND.MOUNTAIN:
				layer = RAYCASTING_LAYER.MOUNTAINS;
				break;
			case ELEMENT_MAP_KIND.OBJECT3D:
				layer = RAYCASTING_LAYER.OBJECTS3D;
				break;
			default:
				layer = RAYCASTING_LAYER.PLANE;
				break;
		}
		Manager.GL.raycaster.layers.set(layer);
		intersects = Manager.GL.raycaster.intersectObjects(this.scene.children);
		for (const obj of intersects) {
			if (obj.faceIndex !== undefined) {
				const newPositionKey = ((obj.object as THREE.Mesh).geometry as CustomGeometry)?.facePositions?.[
					obj.faceIndex
				];
				if (newPositionKey) {
					const newPosition = new Position();
					newPosition.fromKey(newPositionKey);
					const element = this.mapPortion.model.getMapElement(
						newPosition,
						Scene.Map.currentSelectedMapElementKind
					);
					if (element && !element.isPreview) {
						this.pointedMapElement = element;
						this.pointedMapElementPosition = newPosition;
					} else {
						continue;
					}
				}
			}
			break;
		}
		if (
			Scene.Map.isDrawing() &&
			this.lastPosition !== null &&
			this.pointedMapElementPosition !== null &&
			this.lastPosition.equals(this.pointedMapElementPosition)
		) {
			this.pointedMapElement = this.lastMapElement;
		}
		if (
			previousPointedMapElement !== this.pointedMapElement ||
			(previousPointedMapElementPosition === null && this.pointedMapElementPosition !== null) ||
			(previousPointedMapElementPosition !== null && this.pointedMapElementPosition === null) ||
			(previousPointedMapElementPosition !== null &&
				this.pointedMapElementPosition !== null &&
				!previousPointedMapElementPosition.equals(this.pointedMapElementPosition))
		) {
			this.requestPaintHUD = true;
			if (Scene.Map.isTransforming()) {
				if (this.pointedMapElementPosition !== null || previousPointedMapElementPosition !== null) {
					this.addPortionToUpdate(
						this.pointedMapElementPosition === null
							? previousPointedMapElementPosition!.getGlobalPortion()
							: this.pointedMapElementPosition.getGlobalPortion()
					);
				}
			}
		}
		this.meshPlane!.position.setY(previousPlaneY);
	}

	addPortionToUpdate(portion: Portion) {
		for (const portionToUpdate of this.portionsToUpdate) {
			if (portion.equals(portionToUpdate)) {
				return;
			}
		}
		this.portionsToUpdate.push(portion);
	}

	addPortionToSave(portion: Portion) {
		for (const portionToSave of this.portionsToSave) {
			if (portion.equals(portionToSave)) {
				return;
			}
		}
		this.portionsToSave.push(portion);
	}

	addMobileKeyMove() {
		const offset =
			((Constants.CURSOR_MOVE_MOBILE_PERCENT / 100) *
				(Manager.GL.mapEditorContext.canvasWidth + Manager.GL.mapEditorContext.canvasHeight)) /
			2;
		if (Inputs.getPositionX() < offset) {
			Inputs.keys.push('a');
		}
		if (Inputs.getPositionX() > Manager.GL.mapEditorContext.canvasWidth - offset) {
			Inputs.keys.push('d');
		}
		if (Inputs.getPositionY() < offset) {
			Inputs.keys.push('w');
		}
		if (Inputs.getPositionY() > Manager.GL.mapEditorContext.canvasHeight - offset) {
			Inputs.keys.push('s');
		}
	}

	onKeyDown(key: string) {
		// TODO
	}

	onKeyDownImmediate() {
		if (this.rectangleStartPosition === null) {
			this.cursor.onKeyDownImmediate();
			this.requestPaintHUD = true;
		}
	}

	onKeyUp(key: string) {
		if (this.tag) {
			this.tag.cursorPosition = this.cursor.position;
			Project.current!.treeMaps.save().catch(console.error);
		}
	}

	onMouseDown(x: number, y: number) {
		if (Inputs.isSHIFT) {
			this.camera.onMouseWheelUpdate();
		} else {
			if (Scene.Map.isDrawing()) {
				if (Inputs.isPointerPressed && this.lastPosition) {
					if (Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.SPRITE_WALL) {
						this.cursorWall.onMouseDown();
					} else {
						this.updateLockedY(this.lastPosition);
						if (Project.current!.settings.mapEditorCurrentActionIndex === ACTION_KIND.RECTANGLE) {
							this.rectangleStartPosition = this.lastPosition.clone();
						} else {
							this.add(this.lastPosition);
						}
					}
				} else if (Inputs.isMouseRightPressed) {
					if (Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.SPRITE_WALL) {
						this.cursorWall.onMouseDown();
					} else {
						this.lastPosition = null;
						this.needsUpdateRaycasting = true;
					}
				}
			} else if (!this.transformControls.dragging && Scene.Map.isAdding()) {
				this.selectedElement =
					this.pointedMapElement === null ||
					(Project.current!.settings.mapEditorCurrentActionIndex === ACTION_KIND.ROTATE &&
						this.pointedMapElement.kind === ELEMENT_MAP_KIND.SPRITE_FACE)
						? null
						: this.pointedMapElement;
				if (this.selectedElement === null) {
					this.scene.remove(this.selectedMesh);
				}
				this.selectedPosition = this.selectedElement === null ? null : this.pointedMapElementPosition;
				this.transformControls.detach();
				this.addPortionToUpdate(this.mapPortion.model.globalPortion);
				this.needsUpdateSelectedPosition = this.selectedPosition;
				this.needsUpdateSelectedMapElement = true;
			}
			if (this.transformControls.dragging && Scene.Map.isAdding()) {
				this.isDraggingTransforming = true;
			}
		}
	}

	onPointerDown(x: number, y: number) {
		if (Inputs.previousTouchDistance === 0 && this.rectangleStartPosition === null) {
			this.addMobileKeyMove();
			if (Inputs.keys.length > 0) {
				this.cursor.onKeyDownImmediate();
				this.isMobileMovingCursor = true;
			} else {
				if (Scene.Map.currentSelectedMobileAction !== MOBILE_ACTION.MOVE) {
					this.needsUpdateRaycasting = true;
					this.onMouseDown(x, y);
				}
			}
		}
	}

	onMouseMove(x: number, y: number) {
		if (Inputs.isMouseWheelPressed || (Inputs.isPointerPressed && Inputs.isSHIFT)) {
			this.camera.onMouseWheelUpdate();
		} else {
			// Avoid to draw undesired new preview
			if (this.mouseUp) {
				this.mouseUp = false;
			} else {
				this.needsUpdateRaycasting = true;
			}
			if (this.isDraggingTransforming) {
				if (this.selectedElement) {
					this.updateTransformPosition();
					this.needsUpdateSelectedPosition = this.selectedElement.getPositionFromVec3(
						this.selectedMesh.position,
						this.selectedMesh.rotation,
						this.selectedMesh.scale
					);
				}
			}
		}
	}

	onPointerMove(x: number, y: number) {
		if (Inputs.isPointerPressed) {
			if (this.isMobileMovingCursor) {
				Inputs.keys = [];
				this.addMobileKeyMove();
				this.cursor.onKeyDownImmediate();
			} else if (Inputs.previousTouchDistance !== 0) {
				const zoomFactor = Inputs.touchDistance / Inputs.previousTouchDistance;
				if (zoomFactor > 1) {
					this.zoomIn(zoomFactor / 10);
				} else {
					this.zoomOut(zoomFactor / 10);
				}
			} else {
				if (Scene.Map.currentSelectedMobileAction !== MOBILE_ACTION.MOVE) {
					this.needsUpdateRaycasting = true;
				} else {
					this.camera.onMouseWheelUpdate();
				}
			}
		}
	}

	async onMouseUp(x: number, y: number) {
		this.mouseUp = true;
		this.needsUpdateRaycasting = false;
		this.lockedY = null;
		this.lockedYPixels = null;
		this.cursorWall.onMouseUp();
		if (this.isDraggingTransforming) {
			this.updateTransform();
		}
		this.isDraggingTransforming = false;
		if (this.rectangleStartPosition && this.lastPosition) {
			const positions = this.rectangleStartPosition.getPositionsRectangle(this.lastPosition);
			this.mapPortion.removeLastPreview();
			if (Scene.Map.isAdding()) {
				for (const p of positions) {
					this.add(p);
				}
			} else if (Scene.Map.isRemoving()) {
				for (const p of positions) {
					this.remove(p);
				}
			}
		}
		this.rectangleStartPosition = null;
		this.updateUndoRedoSave();
		await Project.current!.treeMaps.save();
	}

	async onTouchEnd(x: number, y: number) {
		await this.onMouseUp(x, y);
		this.lastPosition = null;
		Inputs.keys = [];
		this.isMobileMovingCursor = false;
		await Project.current!.treeMaps.save();
	}

	async onMouseWheel(delta: number) {
		if (Inputs.isCTRL) {
			if (delta < 0) {
				if (Inputs.isSHIFT) {
					await this.moveCursorPixelUp();
				} else {
					await this.moveCursorSquareUp();
				}
			} else {
				if (Inputs.isSHIFT) {
					await this.moveCursorPixelDown();
				} else {
					await this.moveCursorSquareDown();
				}
			}
		} else {
			if (delta < 0) {
				this.zoomIn(0.5);
			} else {
				this.zoomOut(0.5);
			}
			await Project.current!.treeMaps.save();
		}
	}

	update() {
		super.update();

		if (this.needsUpdateRaycasting) {
			this.updateRaycasting();
			this.needsUpdateRaycasting = false;
		}

		// Cursors
		this.cursor.update();
		if (Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.SPRITE_WALL) {
			if (
				this.lastPosition !== null &&
				this.lastPosition.isInMap(this.modelMap, true) &&
				this.cursorWall.needsUpdate(this.lastPosition)
			) {
				this.cursorWall.update(this.lastPosition);
			}
		} else {
			this.cursorWall.remove();
		}

		// Update portions
		if (this.portionsToUpdate.length > 0) {
			this.mapPortion.updateGeometries();
		}
		this.portionsToUpdate = [];
		if (this.portionsSaving.length === 0 && this.portionsToSave.length > 0) {
			this.portionsSaving = [...this.portionsToSave];
			this.savePortions().catch(console.error);
			this.portionsToSave = [];
		}

		// Update face sprites
		const vector = new THREE.Vector3();
		this.camera.getThreeCamera().getWorldDirection(vector);
		const angle = Math.atan2(vector.x, vector.z) + Math.PI;
		this.mapPortion.updateFaceSprites(angle);
		if (this.selectedElement?.kind === ELEMENT_MAP_KIND.SPRITE_FACE) {
			(this.selectedMesh.geometry as CustomGeometryFace).rotate(
				angle,
				MapElement.Base.Y_AXIS,
				this.selectedMesh.scale
			);
		}

		// Update autotiles animated
		if (this.autotileFrame.update()) {
			this.autotilesOffset.setY(
				(this.autotileFrame.value * MapElement.Autotiles.COUNT_LIST * 2 * Project.SQUARE_SIZE) /
					Constants.MAX_PICTURE_SIZE
			);
		}

		Scene.Map.elapsedTime = new Date().getTime() - Scene.Map.lastUpdateTime;
		Scene.Map.averageElapsedTime = (Scene.Map.averageElapsedTime + Scene.Map.elapsedTime) / 2;
		Scene.Map.lastUpdateTime = new Date().getTime();
	}

	draw3D() {
		if (this.needsClose) {
			Manager.GL.mapEditorContext.renderer.setClearColor('#2e324a');
		}
		super.draw3D(Manager.GL.mapEditorContext);
	}

	drawCursorCoords() {
		const space = 18;
		const padding = 10;
		const lines = this.cursor.position.toStringCoords().split('\n');
		Scene.Map.ctxHUD!.textBaseline = 'top';
		for (const [index, line] of lines.entries()) {
			Utils.drawStrokedText(Scene.Map.ctxHUD!, line, padding, padding + index * space);
		}
	}

	drawPointedCoords() {
		if (this.pointedMapElementPosition && this.pointedMapElementPosition.isInMap(this.modelMap)) {
			const lines = this.pointedMapElementPosition.toString().split('\n');
			ArrayUtils.insertFirst(
				lines,
				`[${this.pointedMapElement === null ? 'NONE' : this.pointedMapElement.toString()}]`
			);
			Scene.Map.ctxHUD!.textBaseline = 'bottom';
			const space = 18;
			const padding = 10;
			const y = Manager.GL.mapEditorContext.canvasHeight - (lines.length - 1) * space - padding;
			for (const [index, line] of lines.entries()) {
				Utils.drawStrokedText(Scene.Map.ctxHUD!, line, padding, y + index * space);
			}
		}
	}

	drawHUD() {
		if (this.requestPaintHUD) {
			this.clearHUD();
			this.drawCursorCoords();
			this.drawPointedCoords();
			this.requestPaintHUD = false;
		}
	}

	close() {
		super.close();
	}

	clearHUD() {
		Scene.Map.ctxHUD!.clearRect(0, 0, Scene.Map.canvasHUD!.width, Scene.Map.canvasHUD!.height);
		Scene.Map.ctxHUD!.imageSmoothingEnabled = false;
		Scene.Map.ctxHUD!.font = '12px sans-serif';
		Scene.Map.ctxHUD!.fillStyle = 'white';
		Scene.Map.ctxHUD!.strokeStyle = '#29273d';
		Scene.Map.ctxHUD!.lineJoin = 'round';
		Scene.Map.ctxHUD!.lineWidth = 4;
	}
}

export { Map };
