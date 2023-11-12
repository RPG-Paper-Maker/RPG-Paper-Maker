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
import { Inputs } from '../managers';
import { Base } from '.';
import {
	Cursor,
	CustomGeometry,
	Frame,
	Grid,
	LocalFile,
	MapPortion,
	Portion,
	Position,
	Project,
	Rectangle,
	TextureBundle,
	UndoRedoState,
} from '../core';
import { Constants, ELEMENT_MAP_KIND, MOBILE_ACTION, RAYCASTING_LAYER, Paths, Mathf } from '../common';
import { CursorWall } from '../core/CursorWall';
class Map extends Base {
	public static readonly MENU_BAR_HEIGHT = 26;

	public static current: Scene.Map | null;
	public static currentSelectedTilesetTexture = new Rectangle(0, 0, 1, 1);
	public static currentSelectedAutotileID = 1;
	public static currentSelectedAutotileTexture = new Rectangle(0, 0, 1, 1);
	public static currentSelectedWallID = 1;
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
	public needsClose = false;
	public modelMap: Model.Map = new Model.Map();
	public grid = new Grid();
	public cursor: Cursor;
	public cursorWall = new CursorWall();
	public meshPlane: THREE.Object3D | null = null;
	public sunLight!: THREE.DirectionalLight;
	public mapPortion!: MapPortion;
	public materialTileset!: THREE.MeshPhongMaterial;
	public selectionOffset: THREE.Vector2 = new THREE.Vector2();
	public portionsToUpdate: Portion[] = [];
	public portionsToSave: Portion[] = [];
	public portionsSaving: Portion[] = [];
	public undoRedoStates: UndoRedoState[] = [];
	public undoRedoStatesSaving: UndoRedoState[] = [];
	public lastPosition: Position | null = null;
	public isMobileMovingCursor = false;
	public texturesAutotiles: TextureBundle[][] = [];
	public texturesWalls: THREE.MeshPhongMaterial[] = [];
	public texturesObjects3D: THREE.MeshPhongMaterial[] = [];
	public texturesMountains: TextureBundle[] = [];
	public autotilesOffset = new THREE.Vector2();
	public autotileFrame = new Frame(Project.current!.systems.autotilesFrameDuration, {
		frames: Project.current!.systems.autotilesFrames,
	});

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
		const length = Project.getSquareSize() * this.modelMap.length;
		const width = Project.getSquareSize() * this.modelMap.width;
		const extremeSize = Project.getSquareSize() * 1000;
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
		this.mapPortion = new MapPortion(globalPortion);
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
		this.sunLight.position.multiplyScalar(Project.getSquareSize() * 10);
		this.sunLight.target.position.set(0, 0, 0);
		this.scene.add(this.sunLight);
		this.sunLight.castShadow = true;
		this.sunLight.shadow.mapSize.width = 2048;
		this.sunLight.shadow.mapSize.height = 2048;
		const d = Project.getSquareSize() * 10;
		this.sunLight.shadow.camera.left = -d;
		this.sunLight.shadow.camera.right = d;
		this.sunLight.shadow.camera.top = d;
		this.sunLight.shadow.camera.bottom = -d;
		this.sunLight.shadow.camera.far = Project.getSquareSize() * 350;
		this.sunLight.shadow.bias = -0.0003;
	}

	add(position: Position, preview: boolean = false) {
		if (!preview) {
			const positions = Mathf.traceLine(this.lastPosition, position);
			for (const p of positions) {
				if (p.isInMap(this.modelMap)) {
					this.mapPortion.add(p, preview);
				} else {
					this.mapPortion.removeLastPreview();
				}
			}
		} else {
			if (position.isInMap(this.modelMap)) {
				this.mapPortion.add(position, preview);
			} else {
				this.mapPortion.removeLastPreview();
			}
		}
	}

	remove(position: Position) {
		const positions = Mathf.traceLine(this.lastPosition, position);
		for (const p of positions) {
			if (p.isInMap(this.modelMap)) {
				this.mapPortion.remove(p);
			} else {
				this.mapPortion.removeLastPreview();
			}
		}
	}

	zoomIn(coef: number = 1) {
		this.camera.zoomIn(coef);
	}

	zoomOut(coef: number = 1) {
		this.camera.zoomOut(coef);
	}

	updateRaycasting() {
		const pointer = new THREE.Vector2();
		if (Manager.GL.mapEditorContext.parent) {
			pointer.x = (Inputs.getPositionX() / Manager.GL.mapEditorContext.canvasWidth) * 2 - 1;
			pointer.y = -(Inputs.getPositionY() / Manager.GL.mapEditorContext.canvasHeight) * 2 + 1;
		}
		Manager.GL.raycaster.setFromCamera(pointer, this.camera.getThreeCamera());
		let layer = RAYCASTING_LAYER.PLANE;
		if (Inputs.isMouseRightPressed) {
			switch (Scene.Map.currentSelectedMapElementKind) {
				case ELEMENT_MAP_KIND.SPRITE_FACE:
				case ELEMENT_MAP_KIND.SPRITE_FIX:
				case ELEMENT_MAP_KIND.SPRITE_DOUBLE:
				case ELEMENT_MAP_KIND.SPRITE_QUADRA:
					layer = RAYCASTING_LAYER.SPRITES;
					break;
			}
		}
		Manager.GL.raycaster.layers.set(layer);
		const intersects = Manager.GL.raycaster.intersectObjects(this.scene.children);
		if (intersects.length > 0) {
			const obj = intersects[0];
			let position = new Position(
				Math.floor(obj.point.x / Project.getSquareSize()),
				0,
				0,
				Math.floor(obj.point.z / Project.getSquareSize())
			);
			if (Scene.Map.isRemoving() && obj.faceIndex !== undefined) {
				const newPosition = ((obj.object as THREE.Mesh).geometry as CustomGeometry)?.facePositions?.[
					obj.faceIndex
				];
				if (newPosition) {
					position = newPosition;
				}
			}
			if (this.lastPosition === null || !this.lastPosition.equals(position)) {
				if (!Inputs.isPointerPressed && !Inputs.isMouseRightPressed) {
					this.add(position, true);
				} else if (Scene.Map.isAdding()) {
					this.add(position);
				} else if (Scene.Map.isRemoving()) {
					this.remove(position);
				}
				this.lastPosition = position;
			}
		} else {
			if (this.mapPortion) {
				this.mapPortion.removeLastPreview();
				this.lastPosition = null;
			}
		}
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
		this.cursor.onKeyDownImmediate();
		if (this.tag) {
			this.tag.cursorPosition = this.cursor.position;
			Project.current!.treeMaps.save().catch(console.error);
		}
	}

	onMouseDown(x: number, y: number) {
		if (Inputs.isSHIFT) {
			this.camera.onMouseWheelUpdate();
		} else {
			if (this.lastPosition) {
				if (Inputs.isPointerPressed) {
					this.add(this.lastPosition);
				} else if (Inputs.isMouseRightPressed) {
					this.lastPosition = null;
					this.updateRaycasting();
				}
			}
		}
	}

	onPointerDown(x: number, y: number) {
		if (Inputs.previousTouchDistance === 0) {
			this.addMobileKeyMove();
			if (Inputs.keys.length > 0) {
				this.cursor.onKeyDownImmediate();
				this.isMobileMovingCursor = true;
			} else {
				if (Scene.Map.currentSelectedMobileAction !== MOBILE_ACTION.MOVE) {
					this.updateRaycasting();
					this.onMouseDown(x, y);
				}
			}
		}
	}

	onMouseMove(x: number, y: number) {
		if (Inputs.isMouseWheelPressed || (Inputs.isPointerPressed && Inputs.isSHIFT)) {
			this.camera.onMouseWheelUpdate();
		} else {
			this.updateRaycasting();
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
					this.updateRaycasting();
				} else {
					this.camera.onMouseWheelUpdate();
				}
			}
		}
	}

	async onMouseUp(x: number, y: number) {
		if (this.undoRedoStatesSaving.length === 0 && this.undoRedoStates.length > 0) {
			this.undoRedoStatesSaving = [...this.undoRedoStates];
			this.saveUndoRedoStates().catch(console.error);
			this.undoRedoStates = [];
		}
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
		if (delta < 0) {
			this.zoomIn(0.5);
		} else {
			this.zoomOut(0.5);
		}
		await Project.current!.treeMaps.save();
	}

	update(GL: Manager.GL) {
		super.update(GL);
		this.mapPortion.update();

		// Cursors
		this.cursor.update();
		if (Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.SPRITE_WALL) {
			if (
				this.lastPosition !== null &&
				this.lastPosition.isInMap(this.modelMap, true) &&
				(this.cursorWall.position === null || !this.lastPosition.equals(this.cursorWall.position))
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

		// Update autotiles animated
		if (this.autotileFrame.update()) {
			this.autotilesOffset.setY(
				(this.autotileFrame.value * MapElement.Autotiles.COUNT_LIST * 2 * Project.getSquareSize()) /
					Constants.MAX_PICTURE_SIZE
			);
		}

		Scene.Map.elapsedTime = new Date().getTime() - Scene.Map.lastUpdateTime;
		Scene.Map.averageElapsedTime = (Scene.Map.averageElapsedTime + Scene.Map.elapsedTime) / 2;
		Scene.Map.lastUpdateTime = new Date().getTime();
	}

	draw3D(GL: Manager.GL) {
		if (this.needsClose) {
			Manager.GL.mapEditorContext.renderer.setClearColor('#2e324a');
		}
		super.draw3D(GL);
	}

	close() {
		super.close();
	}
}

export { Map };
