/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { Base } from '.';
import {
	ACTION_KIND,
	ArrayUtils,
	Constants,
	ELEMENT_MAP_KIND,
	ELEMENT_POSITION_KIND,
	LAYER_KIND,
	Mathf,
	MOBILE_ACTION,
	Paths,
	PICTURE_KIND,
	RAYCASTING_LAYER,
	SPRITE_WALL_TYPE,
	Utils,
} from '../common';
import { copyFile, getFiles, readJSON, removeFile } from '../common/Platform';
import { Battler } from '../core/Battler';
import { Cursor } from '../core/Cursor';
import { CursorWall } from '../core/CursorWall';
import { CustomGeometry } from '../core/CustomGeometry';
import { CustomGeometryFace } from '../core/CustomGeometryFace';
import { Frame } from '../core/Frame';
import { Grid } from '../core/Grid';
import { MapPortion } from '../core/MapPortion';
import { Portion } from '../core/Portion';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import { TextureBundle } from '../core/TextureBundle';
import { UndoRedoState } from '../core/UndoRedoState';
import { Manager, MapElement, Model } from '../Editor';
import { default as i18n, default as i18next } from '../i18n/i18n';
import { Inputs } from '../managers';

const { t } = i18next;

class Map extends Base {
	public static readonly MENU_BAR_HEIGHT = 26;

	public static current: Map | null;
	public static currentpositionSelector: Map | null = null;
	public static currentBattle: Map | null = null;
	public static currentSelectedMapElementKind = ELEMENT_MAP_KIND.FLOOR;
	public static currentSelectedMobileAction = MOBILE_ACTION.PLUS;
	public static onStartPositionSet: (() => void) | null = null;
	public static onSelectMapID: ((id: number) => void) | null = null;
	public static elapsedTime = 0;
	public static averageElapsedTime = 0;
	public static lastUpdateTime = new Date().getTime();
	public static canvasHUD: HTMLCanvasElement | null = null;
	public static canvasRendering: HTMLCanvasElement | null = null;
	public static ctxHUD: CanvasRenderingContext2D | null = null;
	public static ctxRendering: CanvasRenderingContext2D | null = null;
	public static animationFrameID: number;
	public static positionSelectorAnimationFrameID: number;
	public static materialCursor: THREE.MeshPhongMaterial;
	public static materialObjectSquareCursor: THREE.MeshPhongMaterial;
	public static materialObjectSquare: THREE.MeshPhongMaterial;
	public static materialDetectionBox: THREE.MeshPhongMaterial;
	public static materialDetectionArrow: THREE.MeshPhongMaterial;
	public static pictureTilesetCursor: HTMLImageElement;
	public static pictureLayersOnCursor: HTMLImageElement;
	public static materialStartPosition: THREE.MeshPhongMaterial;

	public id: number;
	public tag?: Model.TreeMapTag;
	public canEdit = true;
	public isDetection: boolean;
	public isBattle: boolean;
	public detectionFieldLeft?: number;
	public detectionFieldRight?: number;
	public detectionFieldTop?: number;
	public detectionFieldBot?: number;
	public detectionBoxes?: globalThis.Map<string, MapElement.Object3DBox>;
	public detectionBoxesMesh?: THREE.Mesh;
	public detectionCurrentData?: Model.Object3D;
	public detectionSquare = true;
	public needsTreeMapUpdate = false;
	public needsUpdateIndex: number | null = null;
	public needsUpdateLength: number | null = null;
	public needsUpdateSelectedPosition?: Position | null;
	public needsUpdateSelectedMapElement = false;
	public needsClose = false;
	public cursorPositionUpdated = false;
	public model = new Model.Map();
	public grid = new Grid();
	public cursor: Cursor;
	public cursorStartPosition!: Cursor;
	public cursorObject!: Cursor;
	public cursorDetection!: Cursor;
	public cursorWall = new CursorWall();
	public meshPlane: THREE.Object3D | null = null;
	public sunLight!: THREE.DirectionalLight;
	public transformControls!: TransformControls;
	public mapPortions!: (MapPortion | null)[];
	public currentPortion!: Portion;
	public previousPortion!: Portion;
	public materialTileset!: THREE.MeshPhongMaterial;
	public materialTilesetHover!: THREE.MeshPhongMaterial;
	public selectionOffset = new THREE.Vector2();
	public portionsToUpdate: Set<MapPortion> = new Set();
	public portionsToSave: Set<MapPortion> = new Set();
	public portionsSaving: Set<MapPortion> = new Set();
	public undoRedoStates: UndoRedoState[] = [];
	public undoRedoStatesSaving: UndoRedoState[] = [];
	public lastPosition: Position | null = null;
	public layerRayPosition: Portion | null = null;
	public lastMapElement: MapElement.Base | null = null;
	public pointedMapElementPosition: Position | null = null;
	public pointedMapElement: MapElement.Base | null = null;
	public isMobileMovingCursor = false;
	public texturesAutotiles: TextureBundle[][] = [];
	public texturesWalls: THREE.MeshPhongMaterial[] = [];
	public texturesObjects3D: THREE.MeshPhongMaterial[] = [];
	public texturesObjects3DHover: THREE.MeshPhongMaterial[] = [];
	public texturesMountains: globalThis.Map<number, THREE.MeshPhongMaterial> = new globalThis.Map();
	public texturesCharacters: THREE.MeshPhongMaterial[] = [];
	public autotilesOffset = new THREE.Vector2();
	public autotileFrame = new Frame(Project.current!.systems.autotilesFrameDuration, {
		frames: Project.current!.systems.autotilesFrames,
	});
	public selectedMesh!: THREE.Mesh;
	public selectedElement: MapElement.Base | null = null;
	public selectedPosition: Position | null = null;
	public lastTransformPosition: Position | null = null;
	public lastTransformKind: ELEMENT_MAP_KIND | null = null;
	public hoveredMesh!: THREE.Mesh;
	public rectangleStartPosition: Position | null = null;
	public lastRectangleEndPosition: Position | null = null;
	public lockedY: number | null = null;
	public lockedYPixels: number | null = null;
	public lockedLayer: number | null = null;
	public requestPaintHUD = false;
	public needsUpdateRaycasting = false;
	public needsMouseDown = false;
	public needsSaveSystems = false;
	public needsUpdateComponent = false;
	public needsUpdateCursor = false;
	public mouseUp = false;
	public isTransforming = false;
	public isDraggingTransforming = false;
	public movingObject: Model.CommonObject | null = null;
	public movingObjectInitialPosition: Position | null = null;
	public previewDeletedMovingObject: Model.CommonObject | null = null;
	public skyboxMesh: THREE.Mesh | null = null;
	public showCoordinates = true;
	public pointedObjectLabel: string | null = null;

	constructor(tag?: Model.TreeMapTag, canEdit = true, isDetection = false, isBattle = false) {
		super(tag, isDetection);
		this.isDetection = isDetection;
		this.isBattle = isBattle;
		this.id = tag?.id ?? -1;
		this.tag = tag;
		this.canEdit = canEdit;
		this.cursor = new Cursor(tag?.cursorPosition || new Position(), this);
		this.cursorObject = new Cursor(
			new Position(0, tag?.cursorPosition?.y ?? 0, tag?.cursorPosition?.yPixels ?? 0, 0),
			this,
		);
		this.cursorDetection = new Cursor(new Position(), this);
		if (this.isDetection) {
			this.detectionCurrentData = new Model.Object3D();
			this.detectionCurrentData.applyDefault();
			this.detectionCurrentData.stretch = true;
		}
	}

	static getCurrentMapObjectsList = () => [
		...[Model.Base.create(0, t('hero')), Model.Base.create(-1, t('this.object'))],
		...(Map.current?.model?.objects ?? []),
	];

	static isAdding(): boolean {
		return Constants.IS_MOBILE
			? Map.currentSelectedMobileAction === MOBILE_ACTION.PLUS && Inputs.isPointerPressed
			: Inputs.isPointerPressed;
	}

	static isRemoving(): boolean {
		return Constants.IS_MOBILE
			? Map.currentSelectedMobileAction === MOBILE_ACTION.MINUS && Inputs.isPointerPressed
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

	static isRotateDisabled(): boolean {
		return [
			ELEMENT_MAP_KIND.AUTOTILE,
			ELEMENT_MAP_KIND.SPRITE_WALL,
			ELEMENT_MAP_KIND.MOUNTAIN,
			ELEMENT_MAP_KIND.OBJECT,
			ELEMENT_MAP_KIND.START_POSITION,
			ELEMENT_MAP_KIND.VIEW,
		].includes(Map.currentSelectedMapElementKind);
	}

	static isScaleDisabled(): boolean {
		return [
			ELEMENT_MAP_KIND.FLOOR,
			ELEMENT_MAP_KIND.AUTOTILE,
			ELEMENT_MAP_KIND.SPRITE_WALL,
			ELEMENT_MAP_KIND.MOUNTAIN,
			ELEMENT_MAP_KIND.OBJECT,
			ELEMENT_MAP_KIND.START_POSITION,
			ELEMENT_MAP_KIND.VIEW,
		].includes(Map.currentSelectedMapElementKind);
	}

	getPath(): string {
		return Paths.join(Project.current?.getPathMaps(), Model.Map.generateMapName(this.id));
	}

	async load() {
		if (!this.isDetection) {
			// Load map model
			this.model.id = this.id;
			await this.model.load();

			// Tileset texture material
			await this.loadTileset();

			// Background
			await this.updateBackground();
		} else {
			this.scene.background = new THREE.Color(0x221f2e);
		}

		// Create grid plane
		if (!this.isBattle) {
			const material = new THREE.Material();
			material.visible = false;
			material.side = THREE.DoubleSide;
			const length = Project.SQUARE_SIZE * this.model.length;
			const width = Project.SQUARE_SIZE * this.model.width;
			const extremeSize = Project.SQUARE_SIZE * 1000;
			this.meshPlane = new THREE.Mesh(
				new THREE.PlaneGeometry(length + extremeSize, width + extremeSize, 1),
				material,
			);
			this.meshPlane.visible = false;
			this.meshPlane.position.set(Math.floor(length / 2), 0, Math.floor(width / 2));
			this.meshPlane.rotation.set(Math.PI / -2, 0, 0);
			this.meshPlane.layers.enable(RAYCASTING_LAYER.PLANE);
			this.scene.add(this.meshPlane);
		}

		// Cursors
		if (!this.isBattle) {
			this.cursor.initialize(Map.materialCursor);
			if (this.canEdit) {
				this.cursorObject.initialize(Map.materialObjectSquareCursor, 1, false);
				if (Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.OBJECT) {
					this.cursorObject.addToScene();
				}
				this.cursorWall.initialize();
			}
			if (this.isDetection) {
				this.cursorDetection.initialize(Map.materialDetectionArrow, 1);
			}
		}

		// Light
		this.initializeSunLight();

		// Grid
		if (!this.isDetection && !this.isBattle) {
			this.grid.initialize(this);
			this.syncCursorGrid();
		}

		// Transform controls
		if (this.canEdit) {
			this.transformControls = new TransformControls(this.camera.getThreeCamera(), this.canvas!);
			this.transformControls.setTranslationSnap(1);
			if (Map.isTransforming()) {
				this.setTransformMode(Project.current!.settings.mapEditorCurrentActionIndex);
			}
			this.scene.add(this.transformControls.getHelper());
			this.selectedMesh = new THREE.Mesh(new CustomGeometry(), this.materialTilesetHover);
			this.selectedMesh.receiveShadow = true;
			this.selectedMesh.castShadow = true;
			this.hoveredMesh = new THREE.Mesh(new CustomGeometry(), this.materialTilesetHover);
			this.hoveredMesh.customDepthMaterial = this.materialTilesetHover.userData.customDepthMaterial;
			this.hoveredMesh.receiveShadow = true;
			this.hoveredMesh.castShadow = true;
		}

		// Start position
		const isStartInMap = this.id === Project.current!.systems.heroMapID;
		this.cursorStartPosition = new Cursor(
			isStartInMap ? Project.current!.systems.heroMapPosition : new Position(),
			this,
		);
		this.cursorStartPosition.initialize(Map.materialStartPosition, 1, isStartInMap);
		this.cursorStartPosition.updateMeshPosition();

		// Load portions
		this.currentPortion = this.cursor.position.getGlobalPortion();
		await this.initializePortions();

		this.loading = false;
		this.initialized = true;
	}

	async loadBattlers() {
		for (let i = 0, l = Project.current!.systems.initialPartyMembers.length; i < l; i++) {
			await Battler.addToScene(this.cursor.position, i);
		}
		await this.loadMonstersBattlers();
	}

	async loadMonstersBattlers() {
		for (let i = 0, l = Battler.monsters.length; i < l; i++) {
			await Battler.addToScene(this.cursor.position, i, false);
		}
	}

	async loadTileset() {
		const picture = Project.current!.pictures.getByID(
			PICTURE_KIND.TILESETS,
			Project.current!.tilesets.getTilesetByID(this.model.tilesetID)?.pictureID ?? 1,
		);
		this.materialTileset = picture
			? await Manager.GL.loadTexture(await picture.getPathOrBase64())
			: Manager.GL.loadTextureEmpty();
		this.materialTilesetHover = Manager.GL.createMaterial({ texture: this.materialTileset.map, hovered: true });
	}

	async reloadTextures(kind?: PICTURE_KIND) {
		if (kind === undefined || kind === PICTURE_KIND.AUTOTILES) {
			this.texturesAutotiles = [];
		}
		if (kind === undefined || kind === PICTURE_KIND.WALLS) {
			this.texturesWalls = [];
		}
		if (kind === undefined || kind === PICTURE_KIND.OBJECTS_3D) {
			this.texturesObjects3D = [];
			this.texturesObjects3DHover = [];
		}
		if (kind === undefined || kind === PICTURE_KIND.MOUNTAINS) {
			this.texturesMountains = new globalThis.Map();
		}
		if (kind === undefined || kind === PICTURE_KIND.CHARACTERS) {
			this.texturesCharacters = [];
		}
		if (kind === undefined || kind === PICTURE_KIND.SKYBOXES) {
			await this.updateBackground();
		}
		if (kind === undefined || kind === PICTURE_KIND.TILESETS) {
			await this.loadTileset();
		}
		if (kind !== PICTURE_KIND.SKYBOXES) {
			for (const mapPortion of this.mapPortions) {
				if (mapPortion) {
					await mapPortion.loadTexturesAndUpdateGeometries();
				}
			}
		}
	}

	async save() {
		this.loading = true;
		await this.model.save();
		const filesPaths = await getFiles(Paths.join(this.model.getPath(), Paths.TEMP));
		for (const path of filesPaths) {
			const list = path.split('/');
			await copyFile(path, Paths.join(this.model.getPath(), list[list.length - 1]));
			await removeFile(path);
		}
		this.loading = false;
	}

	async savePortionsTemp() {
		if (this.portionsSaving.size > 0) {
			for (const mapPortion of this.portionsSaving) {
				await mapPortion.model.save(true);
			}
		}
		this.portionsSaving.clear();
		if (this.tag?.saved) {
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
		const ambient = new THREE.AmbientLight(0xffffff, this.model.isSunlight ? 1.2 : 2.0);
		this.scene.add(ambient);
		if (this.model.isSunlight) {
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
	}

	async updateBackground() {
		if (this.model.isSkyColor) {
			this.updateBackgroundColor();
		} else if (this.model.isSkyImage) {
			this.updateBackgroundImage();
		} else {
			await this.updateBackgroundSkybox();
		}
	}

	updateBackgroundColor() {
		this.scene.background = (
			Model.Base.getByIDOrFirst(
				Project.current!.systems.colors,
				this.model.skyColorID.getFixNumberValue(),
			) as Model.Color
		).getTHREEColor();
	}

	updateBackgroundImage() {
		const texture = Manager.GL.textureLoader.load(
			Project.current!.pictures.getByID(PICTURE_KIND.PICTURES, this.model.skyImageID).getPath(),
		);
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		this.scene.background = texture;
	}

	async updateBackgroundSkybox() {
		const size = 3;
		const skyboxGeometry = new THREE.BoxGeometry(size, size, size);
		this.skyboxMesh = new THREE.Mesh(
			skyboxGeometry,
			await (
				Model.Base.getByIDOrFirst(
					Project.current!.systems.skyboxes,
					this.model.skyboxID.getFixNumberValue(),
				) as Model.Skybox
			)?.createTextures(),
		);
		this.scene.add(this.skyboxMesh);
	}

	updateDetectionGrid(left: number, right: number, top: number, bot: number) {
		this.grid.updateDetectionGrid(this, left, right, top, bot);
		this.detectionFieldLeft = left;
		this.detectionFieldRight = right;
		this.detectionFieldTop = top;
		this.detectionFieldBot = bot;
		this.syncCursorGrid();
		if (this.detectionBoxes) {
			const entries = this.detectionBoxes.entries();
			for (const [positionKey] of entries) {
				const position = Position.fromKey(positionKey);
				if (position.x < -left || position.x > right || position.z < -top || position.z > bot) {
					this.detectionBoxes.delete(positionKey);
				}
			}
			this.updateDetectionBoxes(this.detectionBoxes);
		}
	}

	initializeDetectionBoxes(boxes: globalThis.Map<string, MapElement.Object3DBox>) {
		this.detectionBoxes = boxes;
		const geometry = new CustomGeometry();
		let count = 0;
		for (const [positionKey, box] of boxes) {
			const position = Position.fromKey(positionKey);
			count = box.updateGeometry(geometry, position, count);
		}
		geometry.updateAttributes();
		this.detectionBoxesMesh = new THREE.Mesh(geometry, Map.materialDetectionBox);
		this.detectionBoxesMesh.layers.enable(RAYCASTING_LAYER.OBJECTS3D);
		this.detectionBoxesMesh.renderOrder = 999;
		this.scene.add(this.detectionBoxesMesh);
	}

	updateDetectionBoxes(boxes: globalThis.Map<string, MapElement.Object3DBox>) {
		const geometry = new CustomGeometry();
		let count = 0;
		for (const [positionKey, box] of boxes) {
			const position = Position.fromKey(positionKey);
			count = box.updateGeometry(geometry, position, count);
		}
		geometry.updateAttributes();
		this.detectionBoxesMesh!.geometry = geometry;
	}

	async initializePortions() {
		this.updateCurrentPortion();
		await this.loadPortions();
	}

	updateCurrentPortion(): boolean {
		if (!this.camera) {
			return false;
		}
		this.previousPortion = this.currentPortion;
		this.currentPortion = this.cursor.position.getGlobalPortion();
		return !this.previousPortion.equals(this.currentPortion);
	}

	async loadPortions(update: boolean = false) {
		if (!update) {
			this.mapPortions = new Array(this.getMapPortionTotalSize());
		}
		const offsetX = this.currentPortion.x - this.previousPortion.x;
		const offsetY = this.currentPortion.y - this.previousPortion.y;
		const offsetZ = this.currentPortion.z - this.previousPortion.z;
		const limit = Project.current!.systems.PORTIONS_RAY;
		if (!update) {
			for (let i = -limit; i <= limit; i++) {
				for (let j = -limit; j <= limit; j++) {
					for (let k = -limit; k <= limit; k++) {
						await this.loadPortion(
							this.currentPortion.x + i,
							this.currentPortion.y + j,
							this.currentPortion.z + k,
							i,
							j,
							k,
						);
					}
				}
			}
			return;
		}

		// Make a temp copy for moving stuff correctly
		const temp = new Array(this.mapPortions.length);
		for (let i = 0, l = this.mapPortions.length; i < l; i++) {
			temp[i] = this.mapPortions[i];
		}

		// Remove existing portions
		for (let i = -limit; i <= limit; i++) {
			for (let j = -limit; j <= limit; j++) {
				for (let k = -limit; k <= limit; k++) {
					const oi = i - offsetX;
					const oj = j - offsetY;
					const ok = k - offsetZ;
					// If with negative offset, out of ray boundaries, remove
					if (oi < -limit || oi > limit || oj < -limit || oj > limit || ok < -limit || ok > limit) {
						this.removePortion(i, j, k);
					}
				}
			}
		}
		// Move / Load
		for (let i = -limit; i <= limit; i++) {
			for (let j = -limit; j <= limit; j++) {
				for (let k = -limit; k <= limit; k++) {
					const x = this.currentPortion.x + i;
					const y = this.currentPortion.y + j;
					const z = this.currentPortion.z + k;
					let oi = i - offsetX;
					let oj = j - offsetY;
					let ok = k - offsetZ;
					// If with negative offset, in ray boundaries, move
					if (oi >= -limit && oi <= limit && oj >= -limit && oj <= limit && ok >= -limit && ok <= limit) {
						const previousIndex = this.getPortionIndex(i, j, k);
						const newIndex = this.getPortionIndex(oi, oj, ok);
						this.mapPortions[newIndex] = temp[previousIndex];
					}
					oi = i + offsetX;
					oj = j + offsetY;
					ok = k + offsetZ;
					// If with positive offset, out of ray boundaries, load
					if (oi < -limit || oi > limit || oj < -limit || oj > limit || ok < -limit || ok > limit) {
						await this.loadPortion(x, y, z, i, j, k, true);
					}
				}
			}
		}
		if (Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.OBJECT) {
			this.needsUpdateComponent = true;
		}
		this.loading = false;
	}

	async loadPortion(
		realX: number,
		realY: number,
		realZ: number,
		x: number,
		y: number,
		z: number,
		move: boolean = false,
	) {
		const lx = Math.ceil(this.model.length / Constants.PORTION_SIZE);
		const lz = Math.ceil(this.model.width / Constants.PORTION_SIZE);
		const ld = Math.ceil(this.model.depth / Constants.PORTION_SIZE);
		const lh = Math.ceil(this.model.height / Constants.PORTION_SIZE);
		if (realX >= 0 && realX < lx && realY >= -ld && realY < lh && realZ >= 0 && realZ < lz) {
			const portion = new Portion(realX, realY, realZ);
			const modelMapPortion = new Model.MapPortion(portion);
			let json = await readJSON(modelMapPortion.getPath(true));
			if (json === null) {
				json = await readJSON(modelMapPortion.getPath(false));
			}
			const mapPortion = new MapPortion();
			mapPortion.initialize(portion, this);
			this.setMapPortion(x, y, z, mapPortion, move);
			if (json?.['lands']) {
				mapPortion.model.read(json);
				await mapPortion.loadTexturesAndUpdateGeometries(false);
			}
		} else {
			this.setMapPortion(x, y, z, null, move);
		}
	}

	async loadPortionFromPortion(portion: Portion, x: number, y: number, z: number, move: boolean) {
		await this.loadPortion(portion.x + x, portion.y + y, portion.z + z, x, y, z, move);
	}

	removePortion(x: number, y: number, z: number) {
		const index = this.getPortionIndex(x, y, z);
		const mapPortion = this.mapPortions[index];
		if (mapPortion !== null) {
			mapPortion.cleanAll();
			this.mapPortions[index] = null;
		}
	}

	setPortion(i: number, j: number, k: number, m: number, n: number, o: number) {
		this.setMapPortion(i, j, k, this.getMapPortion(m, n, o), true);
	}

	setMapPortion(x: number, y: number, z: number, mapPortion: MapPortion | null, move: boolean) {
		const index = this.getPortionIndex(x, y, z);
		const currentMapPortion = this.mapPortions[index];
		if (currentMapPortion && !move) {
			currentMapPortion.cleanAll();
		}
		this.mapPortions[index] = mapPortion;
	}

	getMapPortion(x: number, y: number, z: number): MapPortion | null {
		return this.getBrutMapPortion(this.getPortionIndex(x, y, z));
	}

	getMapPortionFromPortion(portion: Portion): MapPortion | null {
		return this.getMapPortion(portion.x, portion.y, portion.z);
	}

	getMapPortionFromGlobalPortion(globalPortion: Portion): MapPortion | null {
		const portion = this.getLocalPortionFromGlobal(globalPortion);
		return this.getMapPortion(portion.x, portion.y, portion.z);
	}

	getMapPortionByPosition(position: Position): MapPortion | null {
		return this.getMapPortionFromGlobalPortion(position.getGlobalPortion());
	}

	getMapPortionByPositionWall(position: Position): MapPortion | null {
		const portion = position.getGlobalPortion();
		if (position.x === this.model.length) {
			portion.x = Math.ceil(this.model.length / Constants.PORTION_SIZE) - 1;
		}
		if (position.z === this.model.width) {
			portion.z = Math.ceil(this.model.width / Constants.PORTION_SIZE) - 1;
		}
		return this.getMapPortionFromGlobalPortion(portion);
	}

	getBrutMapPortion(index: number): MapPortion | null {
		return this.mapPortions[index];
	}

	getPortionIndex(x: number, y: number, z: number): number {
		const size = this.getMapPortionSize();
		const limit = Project.current!.systems.PORTIONS_RAY;
		return (x + limit) * size * size + (y + limit) * size + (z + limit);
	}

	getPortionIndexFromPortion(portion: Portion): number {
		return this.getPortionIndex(portion.x, portion.y, portion.z);
	}

	getLocalPortion(position: Position): Portion {
		return new Portion(
			Math.floor(position.x / Constants.PORTION_SIZE) -
				Math.floor(this.cursor.position.x / Constants.PORTION_SIZE),
			Math.floor(position.y / Constants.PORTION_SIZE) -
				Math.floor(this.cursor.position.y / Constants.PORTION_SIZE),
			Math.floor(position.z / Constants.PORTION_SIZE) -
				Math.floor(this.cursor.position.z / Constants.PORTION_SIZE),
		);
	}

	getLocalPortionFromGlobal(globalPortion: Portion): Portion {
		return new Portion(
			globalPortion.x - Math.floor(this.cursor.position.x / Constants.PORTION_SIZE),
			globalPortion.y - Math.floor(this.cursor.position.y / Constants.PORTION_SIZE),
			globalPortion.z - Math.floor(this.cursor.position.z / Constants.PORTION_SIZE),
		);
	}

	isInPortion(portion: Portion, offset = 0): boolean {
		return (
			portion.x <= Project.current!.systems.PORTIONS_RAY + offset &&
			portion.x >= -(Project.current!.systems.PORTIONS_RAY + offset) &&
			portion.y <= Project.current!.systems.PORTIONS_RAY + offset &&
			portion.y >= -(Project.current!.systems.PORTIONS_RAY + offset) &&
			portion.z <= Project.current!.systems.PORTIONS_RAY + offset &&
			portion.z >= -(Project.current!.systems.PORTIONS_RAY + offset)
		);
	}

	getMapPortionSize(): number {
		return Project.current!.systems.PORTIONS_RAY * 2 + 1;
	}

	getMapPortionTotalSize(): number {
		const size = this.getMapPortionSize();
		const limit = Project.current!.systems.PORTIONS_RAY;
		return limit * 2 * size * size + limit * 2 * size + limit * 2;
	}

	forEachMapPortions(callback: (mapPortion: MapPortion) => void) {
		for (let i = 0; i < this.mapPortions.length; i++) {
			const mapPortion = this.mapPortions[i];
			if (mapPortion) {
				callback(mapPortion);
			}
		}
	}

	add(position: Position, preview = false, removePreview = true, updateAutotiles = true) {
		const spriteLayer =
			Project.current!.settings.mapEditorCurrentLayerIndex === LAYER_KIND.ON &&
			Map.currentSelectedMapElementKind >= ELEMENT_MAP_KIND.SPRITE_FACE &&
			Map.currentSelectedMapElementKind <= ELEMENT_MAP_KIND.SPRITE_QUADRA;
		const allowBorders = Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.SPRITE_WALL || spriteLayer;
		switch (Map.currentSelectedMapElementKind) {
			case ELEMENT_MAP_KIND.SPRITE_WALL:
				this.updateWallFromCursor(true, preview, removePreview);
				break;
			case ELEMENT_MAP_KIND.OBJECT: {
				const previousPosition = this.cursorObject.position.clone();
				position.layer = 0;
				this.updateObjectCursor(preview, position);
				this.moveObject(previousPosition, position);
				break;
			}
			default: {
				if (!preview) {
					const positions = spriteLayer ? [position] : Mathf.traceLine(this.lastPosition, position);
					for (const p of positions) {
						this.getMapPortionByPosition(p)?.add(p, preview, removePreview, allowBorders, updateAutotiles);
					}
					this.lastTransformPosition = position.clone();
					this.lastTransformKind = Map.currentSelectedMapElementKind;
				} else {
					this.getMapPortionByPosition(position)?.add(
						position,
						preview,
						removePreview,
						allowBorders,
						updateAutotiles,
					);
				}
				break;
			}
		}
	}

	remove(position: Position, preview = false, removePreview = true, updateAutotiles = true) {
		switch (Map.currentSelectedMapElementKind) {
			case ELEMENT_MAP_KIND.SPRITE_WALL:
				this.updateWallFromCursor(false, preview, removePreview);
				break;
			case ELEMENT_MAP_KIND.OBJECT:
				this.updateObjectCursor(preview, position);
				break;
			default: {
				if (!preview) {
					const positions = Mathf.traceLine(this.lastPosition, position);
					for (const p of positions) {
						this.getMapPortionByPosition(p)?.remove(p, preview, removePreview, updateAutotiles);
					}
				} else {
					this.getMapPortionByPosition(position)?.remove(position, preview, removePreview, updateAutotiles);
				}
				break;
			}
		}
	}

	isPositionDetectionInField(position: Position): boolean {
		return (
			position.x >= -this.detectionFieldLeft! &&
			position.x <= this.detectionFieldRight! &&
			position.z >= -this.detectionFieldTop! &&
			position.z <= this.detectionFieldBot!
		);
	}

	addDetection(position: Position, preview = false) {
		if (this.detectionBoxes && this.detectionBoxesMesh && this.detectionCurrentData) {
			const newBoxes = preview ? new globalThis.Map(this.detectionBoxes) : this.detectionBoxes;
			if (!this.detectionCurrentData.isZeroSize() && this.isPositionDetectionInField(position)) {
				let newPosition: Position;
				if (!Map.currentpositionSelector!.detectionSquare) {
					newPosition = position.clone();
					newPosition.centerX += 50;
					newPosition.x += Math.floor(newPosition.centerX / 100);
					newPosition.centerX = Mathf.mod(newPosition.centerX, 100);
					newPosition.centerZ += 50;
					newPosition.z += Math.floor(newPosition.centerZ / 100);
					newPosition.centerZ = Mathf.mod(newPosition.centerZ, 100);
				} else {
					newPosition = position;
				}
				newBoxes.set(newPosition.toKey(), MapElement.Object3DBox.create(this.detectionCurrentData!.clone()));
			}
			this.updateDetectionBoxes(newBoxes);
		}
	}

	removeDetection(position: Position) {
		if (this.detectionBoxes && this.detectionBoxesMesh) {
			this.detectionBoxes.delete(position.toKey());
			this.updateDetectionBoxes(this.detectionBoxes);
		}
	}

	generateDetectionCircle(radius: number) {
		if (this.detectionBoxes && this.detectionCurrentData && !this.detectionCurrentData.isZeroSize()) {
			for (let z = -radius; z <= radius; z++) {
				for (let x = -radius; x <= radius; x++) {
					if (x * x + z * z <= radius * radius) {
						this.generateDetectionXZ(x, z);
					}
				}
			}
			this.updateDetectionBoxes(this.detectionBoxes);
		}
	}

	generateDetectionRectangle(length: number, width: number) {
		if (this.detectionBoxes && this.detectionCurrentData && !this.detectionCurrentData.isZeroSize()) {
			for (let z = -width; z <= width; z++) {
				for (let x = -length; x <= length; x++) {
					this.generateDetectionXZ(x, z);
				}
			}
			this.updateDetectionBoxes(this.detectionBoxes);
		}
	}

	generateDetectionXZ(x: number, z: number) {
		const position = new Position(
			this.cursor.position.x + x,
			this.cursor.position.y,
			this.cursor.position.yPixels,
			this.cursor.position.z + z,
		);
		if (this.isPositionDetectionInField(position)) {
			this.detectionBoxes!.set(
				position.toKey(),
				MapElement.Object3DBox.create(this.detectionCurrentData!.clone()),
			);
		}
	}

	updateWallFromCursor(add = true, preview = false, removePreview = true) {
		const positions = this.cursorWall.getPositions();
		if (removePreview) {
			this.forEachMapPortions((mapPortion) => {
				mapPortion.removeLastPreview();
			});
		}
		for (const position of positions) {
			this.getMapPortionByPositionWall(position)?.updateWall(
				position,
				add
					? MapElement.SpriteWall.create(
							Project.current!.settings.mapEditorCurrentWallID,
							SPRITE_WALL_TYPE.MIDDLE,
						)
					: null,
				preview,
			);
		}
		for (const position of positions) {
			MapElement.SpriteWall.updateAround(Map.current!, position, !preview);
		}
	}

	updateObjectCursor(preview: boolean, position: Position) {
		if (!preview && position.isInMap(this.model)) {
			this.cursorObject.position.setCoords(position.x, position.y, position.yPixels, position.z);
			this.needsUpdateComponent = true;
			this.cursorObject.updateMeshPosition();
		}
	}

	moveObject(previousPosition: Position, position: Position) {
		if (this.movingObject !== null) {
			const previousPortion = this.getMapPortionByPosition(previousPosition);
			const newPortion = this.getMapPortionByPosition(position);
			if (previousPortion && newPortion) {
				previousPortion.model.objects.delete(previousPosition.toKey());
				if (this.previewDeletedMovingObject && this.previewDeletedMovingObject !== this.movingObject) {
					previousPortion.model.objects.set(previousPosition.toKey(), this.previewDeletedMovingObject);
				}
				this.previewDeletedMovingObject = newPortion.model.objects.get(position.toKey()) ?? null;
				newPortion.model.objects.set(position.toKey(), this.movingObject);
				this.model.moveObject(previousPosition, position);
				this.portionsToUpdate.add(previousPortion);
				this.portionsToUpdate.add(newPortion);
			}
		}
	}

	async updateObject(object: Model.CommonObject | null) {
		const position = this.cursorObject.position.clone();
		const mapPortion = this.getMapPortionByPosition(position);
		await this.model.updateObject(position, object);
		mapPortion?.updateObject(position, object);
		this.needsUpdateComponent = true;
	}

	getSelectedObject(): Model.CommonObject | null {
		const position = this.cursorObject.position.clone();
		const mapPortion = this.getMapPortionByPosition(position);
		if (mapPortion) {
			return mapPortion.model.objects.get(position.toKey()) ?? null;
		}
		return null;
	}

	enableView(b: boolean) {
		this.showGrid(!b && Project.current!.settings.showGrid);
		this.cursorStartPosition.mesh.visible = !b;
		this.cursorObject.mesh.visible = !b;
		this.forEachMapPortions((mapPortion) => {
			if (mapPortion.objectsMesh) {
				mapPortion.objectsMesh.visible = !b;
			}
		});
		this.cursor.mesh.visible = !b;
		this.showSquareCoordinates(!b && Project.current!.settings.showSquareInformation);
	}

	showGrid(b: boolean) {
		this.grid.line.visible = b;
	}

	showSquareCoordinates(b: boolean) {
		this.showCoordinates = b;
		this.requestPaintHUD = true;
	}

	paintPin(p: Position, kindAfter: ELEMENT_MAP_KIND, autotileID: number, textureAfter: Rectangle) {
		const up = this.camera.getUp();
		this.forEachMapPortions((mapPortion) => {
			mapPortion.removeLastPreview();
		});
		if (p.isInMap(this.model)) {
			let portion = this.getLocalPortion(p);
			if (this.isInPortion(portion)) {
				const mapPortionBefore = this.getMapPortionFromPortion(portion);
				const landBefore = mapPortionBefore?.model.lands.get(p.toKey()) || null;
				const autotileBefore =
					landBefore && landBefore instanceof MapElement.Autotile ? landBefore.autotileID : 0;
				const textureBefore = landBefore ? landBefore.texture.clone() : new Rectangle();
				const kindBefore = landBefore ? landBefore.kind : ELEMENT_MAP_KIND.NONE;
				let textureAfterReduced = MapElement.Floor.getTextureReduced(textureAfter, 0, 0);
				// If the texture is different, start the algorithm
				if (!MapElement.Land.areLandsEquals(landBefore, autotileID, textureAfterReduced, kindAfter)) {
					const array = [p];
					if (kindAfter === ELEMENT_MAP_KIND.NONE) {
						this.remove(p);
					} else {
						if (kindAfter === ELEMENT_MAP_KIND.FLOOR) {
							mapPortionBefore?.updateFloor(p, MapElement.Floor.create(textureAfterReduced, up));
						} else {
							mapPortionBefore?.updateAutotile(
								p,
								MapElement.Autotile.create(autotileID, 0, textureAfter, up),
							);
						}
					}
					while (array.length > 0) {
						const adjacent: Position[] = [];
						const firstPosition = array[0];
						const x = firstPosition.x;
						const y = firstPosition.y;
						const yPlus = firstPosition.yPixels;
						const z = firstPosition.z;
						const layer = firstPosition.layer;

						// Getting all the adjacent squares
						adjacent.push(new Position(x - 1, y, yPlus, z, layer));
						adjacent.push(new Position(x + 1, y, yPlus, z, layer));
						adjacent.push(new Position(x, y, yPlus, z + 1, layer));
						adjacent.push(new Position(x, y, yPlus, z - 1, layer));

						ArrayUtils.removeAt(array, 0);
						for (const adjacentPosition of adjacent) {
							const localX = adjacentPosition.x - p.x;
							const localZ = adjacentPosition.z - p.z;
							textureAfterReduced = MapElement.Floor.getTextureReduced(textureAfter, localX, localZ);
							if (adjacentPosition.isInMap(this.model)) {
								portion = this.getLocalPortion(adjacentPosition);
								if (this.isInPortion(portion)) {
									const mapPortionHere = this.getMapPortionFromPortion(portion);
									const landHere = mapPortionHere?.model.lands.get(adjacentPosition.toKey()) || null;
									if (
										MapElement.Land.areLandsEquals(
											landHere,
											autotileBefore,
											textureBefore,
											kindBefore,
										)
									) {
										if (kindAfter === ELEMENT_MAP_KIND.NONE && landHere) {
											if (landHere.kind === ELEMENT_MAP_KIND.FLOOR) {
												mapPortionHere?.updateFloor(adjacentPosition, null);
											} else {
												mapPortionHere?.updateAutotile(adjacentPosition, null);
											}
										} else {
											if (kindAfter === ELEMENT_MAP_KIND.FLOOR) {
												mapPortionHere?.updateFloor(
													adjacentPosition,
													MapElement.Floor.create(textureAfterReduced, up),
												);
											} else {
												mapPortionHere?.updateAutotile(
													adjacentPosition,
													MapElement.Autotile.create(autotileID, 0, textureAfter, up),
												);
											}
										}
										array.push(adjacentPosition);
									}
								}
							}
						}
					}
				}
			}
		}
	}

	syncCursorGrid() {
		if (
			this.isDetection &&
			this.detectionFieldLeft !== undefined &&
			this.detectionFieldRight !== undefined &&
			this.detectionFieldTop !== undefined &&
			this.detectionFieldBot !== undefined
		) {
			this.cursor.position.x = Math.min(
				this.detectionFieldRight,
				Math.max(-this.detectionFieldLeft, this.cursor.position.x),
			);
			this.cursor.position.z = Math.min(
				this.detectionFieldBot,
				Math.max(-this.detectionFieldTop, this.cursor.position.z),
			);
		}
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
			if (newY >= -this.model.depth && newY < this.model.height) {
				this.cursor.position.y = newY;
			}
		} else {
			this.cursor.position.updateYPixels(this.cursor.position.getTotalYPixels() + addition);
		}
		this.syncCursorGrid();
		this.requestPaintHUD = true;
		if (this.tag) {
			this.tag.cursorPosition = this.cursor.position;
			if (this.canEdit) {
				await Project.current!.treeMaps.save();
			}
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
		this.forEachMapPortions((mapPortion) => {
			mapPortion?.updatePositionLayers();
		});
	}

	zoomIn(coef = 1) {
		this.zoom(true, coef);
	}

	zoomOut(coef = 1) {
		this.zoom(false, coef);
	}

	updateMoveTransformDragging() {
		if (this.isDraggingTransforming) {
			if (this.selectedElement && this.selectedPosition) {
				this.updateTransformPosition();
				this.needsUpdateSelectedPosition = this.selectedElement.getPositionFromVec3(
					this.selectedMesh.position,
					this.selectedMesh.rotation,
					this.selectedMesh.scale,
				);
				this.needsUpdateSelectedPosition.layer = this.selectedPosition.layer;
			}
		}
	}

	updateTransform() {
		this.updateTransformPosition();
		if (this.selectedPosition && this.selectedElement) {
			this.getMapPortionByPosition(this.selectedPosition)?.removeSelected();
			this.getMapPortionByPosition(Position.createFromVector3(this.selectedMesh.position))?.addSelected();
		}
	}

	updateTransformPosition() {
		if (
			this.selectedElement &&
			Project.current!.settings.mapEditorCurrentElementPositionIndex === ELEMENT_POSITION_KIND.SQUARE
		) {
			this.selectedMesh.position.setX(
				this.selectedMesh.position.x -
					(this.selectedMesh.position.x % Project.SQUARE_SIZE) +
					this.selectedElement.getAdditionalX(),
			);
			this.selectedMesh.position.setY(
				this.selectedMesh.position.y -
					(this.selectedMesh.position.y % Project.SQUARE_SIZE) +
					this.selectedElement.getAdditionalY(),
			);
			this.selectedMesh.position.setZ(
				this.selectedMesh.position.z -
					(this.selectedMesh.position.z % Project.SQUARE_SIZE) +
					this.selectedElement.getAdditionalZ(),
			);
			this.selectedMesh.scale.setX(Math.max(1, this.selectedMesh.scale.x - (this.selectedMesh.scale.x % 1)));
			this.selectedMesh.scale.setY(Math.max(1, this.selectedMesh.scale.y - (this.selectedMesh.scale.y % 1)));
			this.selectedMesh.scale.setZ(Math.max(1, this.selectedMesh.scale.z - (this.selectedMesh.scale.z % 1)));
		}
		if (this.selectedMesh.position.x < 0) {
			this.selectedMesh.position.setX(
				Project.current!.settings.mapEditorCurrentElementPositionIndex === ELEMENT_POSITION_KIND.SQUARE
					? Project.SQUARE_SIZE / 2
					: 0,
			);
		} else if (Math.floor(this.selectedMesh.position.x / Project.SQUARE_SIZE) > this.model.length - 1) {
			this.selectedMesh.position.setX(
				this.model.length * Project.SQUARE_SIZE -
					(Project.current!.settings.mapEditorCurrentElementPositionIndex === ELEMENT_POSITION_KIND.SQUARE
						? Project.SQUARE_SIZE / 2
						: 1),
			);
		}
		if (this.selectedMesh.position.y < -this.model.depth * Project.SQUARE_SIZE) {
			this.selectedMesh.position.setY(-this.model.depth * Project.SQUARE_SIZE);
		} else if (Math.floor(this.selectedMesh.position.y / Project.SQUARE_SIZE) > this.model.height - 1) {
			this.selectedMesh.position.setY(
				(this.model.height - 1) * Project.SQUARE_SIZE +
					(Project.current!.settings.mapEditorCurrentElementPositionIndex === ELEMENT_POSITION_KIND.SQUARE
						? 0
						: Project.SQUARE_SIZE - 1),
			);
		}
		if (this.selectedMesh.position.z < 0) {
			this.selectedMesh.position.setZ(
				Project.current!.settings.mapEditorCurrentElementPositionIndex === ELEMENT_POSITION_KIND.SQUARE
					? Project.SQUARE_SIZE / 2
					: 0,
			);
		} else if (Math.floor(this.selectedMesh.position.z / Project.SQUARE_SIZE) > this.model.width - 1) {
			this.selectedMesh.position.setZ(
				this.model.width * Project.SQUARE_SIZE -
					(Project.current!.settings.mapEditorCurrentElementPositionIndex === ELEMENT_POSITION_KIND.SQUARE
						? Project.SQUARE_SIZE / 2
						: 1),
			);
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
			const mapPortion = this.getMapPortionByPosition(Position.createFromVector3(this.selectedMesh.position));
			if (mapPortion) {
				this.portionsToUpdate.add(mapPortion);
			}
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
		this.updateRotationSnap(action);
		if (this.selectedElement === null && this.lastTransformPosition !== null && this.lastTransformKind !== null) {
			const mapPortion = this.getMapPortionByPosition(this.lastTransformPosition);
			if (mapPortion) {
				const element = mapPortion.model.getMapElement(this.lastTransformPosition, this.lastTransformKind);
				if (element && !(action === ACTION_KIND.ROTATE && element.kind === ELEMENT_MAP_KIND.SPRITE_FACE)) {
					this.selectedElement = element as MapElement.Base;
					this.selectedPosition = this.lastTransformPosition.clone();
					this.portionsToUpdate.add(mapPortion);
					this.needsUpdateSelectedPosition = this.selectedPosition;
					this.needsUpdateSelectedMapElement = true;
				}
			}
		}
	}

	updateRotationSnap(action = Project.current!.settings.mapEditorCurrentActionIndex as ACTION_KIND) {
		const isSquare =
			Project.current!.settings.mapEditorCurrentElementPositionIndex === ELEMENT_POSITION_KIND.SQUARE;
		this.transformControls.setRotationSnap(
			action === ACTION_KIND.ROTATE && isSquare ? Mathf.degreesToRadians(45) : null,
		);
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
			this.lockedLayer = position.layer;
		}
	}

	updateStartPosition(position: Position) {
		if (position.isInMap(this.model)) {
			Project.current!.systems.heroMapID = this.id;
			Project.current!.systems.heroMapPosition = position;
			this.cursorStartPosition.position = position;
			this.cursorStartPosition.updateMeshPosition();
			this.scene.add(this.cursorStartPosition.mesh);
			this.needsSaveSystems = true;
		}
	}

	updateRaycasting() {
		const isLayerOn = this.canEdit && Project.current!.settings.mapEditorCurrentLayerIndex === LAYER_KIND.ON;
		const isSpriteOptionSelected =
			this.canEdit &&
			Map.currentSelectedMapElementKind >= ELEMENT_MAP_KIND.SPRITE_FACE &&
			Map.currentSelectedMapElementKind <= ELEMENT_MAP_KIND.SPRITE_WALL;
		const pointer = new THREE.Vector2(
			(Inputs.getPositionX() / this.canvas!.clientWidth) * 2 - 1,
			-(Inputs.getPositionY() / this.canvas!.clientHeight) * 2 + 1,
		);
		Manager.GL.raycaster.setFromCamera(pointer, this.camera.getThreeCamera());
		let layer = RAYCASTING_LAYER.LANDS;
		if (this.canEdit && Map.isRemoving() && this.rectangleStartPosition === null) {
			switch (Map.currentSelectedMapElementKind) {
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
		if (this.isDetection && Map.isRemoving()) {
			layer = RAYCASTING_LAYER.OBJECTS3D;
		}
		if (isLayerOn && isSpriteOptionSelected) {
			Manager.GL.raycaster.layers.enable(layer);
			Manager.GL.raycaster.layers.enable(RAYCASTING_LAYER.SPRITES);
			Manager.GL.raycaster.layers.enable(RAYCASTING_LAYER.WALLS);
		} else {
			Manager.GL.raycaster.layers.set(layer);
		}
		const previousPointedMapElementPosition = this.pointedMapElementPosition;
		const previousPointedMapElement = this.pointedMapElement;
		const previousPointedObjectLabel = this.pointedObjectLabel;
		const previousPlaneY = this.meshPlane!.position.y;
		if (this.lockedY !== null && this.lockedYPixels !== null) {
			this.meshPlane!.position.setY(
				this.lockedY * Project.SQUARE_SIZE + Math.floor((this.lockedYPixels * Project.SQUARE_SIZE) / 100),
			);
			this.meshPlane!.updateMatrixWorld();
		}
		let intersects = Manager.GL.raycaster.intersectObjects(this.scene.children);
		Manager.GL.raycaster.layers.set(RAYCASTING_LAYER.PLANE);
		const intersectsPlane = Manager.GL.raycaster.intersectObjects(this.scene.children);
		const dist = intersects.length > 0 ? intersects[0].distance : Number.POSITIVE_INFINITY;
		const distPlane = intersectsPlane.length > 0 ? intersectsPlane[0].distance : Number.POSITIVE_INFINITY;
		const isPlane = distPlane <= dist - 0.01 || this.rectangleStartPosition !== null; // -0.01 to avoid z-fighting issues
		if (isPlane) {
			intersects = intersectsPlane;
			layer = RAYCASTING_LAYER.PLANE;
		}
		// Intersection for deleting or adding stuff
		for (const obj of intersects) {
			let position = new Position(
				obj.point.x > 0
					? Math.floor(obj.point.x / Project.SQUARE_SIZE)
					: Math.ceil((obj.point.x - 1) / Project.SQUARE_SIZE),
				this.lockedY === null ? this.cursor.position.y : this.lockedY,
				this.lockedYPixels === null ? this.cursor.position.yPixels : this.lockedYPixels,
				obj.point.z > 0
					? Math.floor(obj.point.z / Project.SQUARE_SIZE)
					: Math.ceil((obj.point.z - 1) / Project.SQUARE_SIZE),
			);
			if (
				obj.faceIndex !== undefined &&
				(Map.isRemoving() ||
					(this.lockedY === null && this.lockedYPixels === null && this.lockedLayer === null))
			) {
				const newPositionKey = ((obj.object as THREE.Mesh).geometry as CustomGeometry)?.facePositions?.[
					obj.faceIndex ?? 0
				];
				if (newPositionKey && (Map.isRemoving() || layer === RAYCASTING_LAYER.LANDS)) {
					const newPosition = Position.fromKey(newPositionKey);
					if (this.isDetection) {
						if (Map.isRemoving() && !this.detectionBoxes?.has(newPositionKey)) {
							continue;
						}
					} else {
						if (Map.isRemoving() || isLayerOn) {
							const element = this.getMapPortionByPosition(newPosition)?.model.getMapElement(
								newPosition,
								Map.currentSelectedMapElementKind,
							);
							if (element && element.isPreview) {
								continue;
							}
						}
						if (layer === RAYCASTING_LAYER.LANDS) {
							const element = this.getMapPortionByPosition(newPosition)?.model.getMapElement(
								newPosition,
								ELEMENT_MAP_KIND.FLOOR,
							);
							if (element && element.isPreview) {
								continue;
							}
						} else if (
							this.lockedY !== null &&
							this.lockedYPixels !== null &&
							this.lockedLayer !== null &&
							Map.isRemoving() &&
							(newPosition.y !== this.lockedY ||
								newPosition.yPixels !== this.lockedYPixels ||
								newPosition.layer !== this.lockedLayer)
						) {
							continue;
						}
					}
					if (Map.currentSelectedMapElementKind !== ELEMENT_MAP_KIND.SPRITE_WALL) {
						position = newPosition;
					}
				}
			}
			if ((this.canEdit || this.isDetection) && !Map.isRemoving()) {
				if (
					(this.isDetection && !this.detectionSquare) ||
					(!this.isDetection &&
						Project.current!.settings.mapEditorCurrentElementPositionIndex === ELEMENT_POSITION_KIND.PIXEL)
				) {
					position.centerX = ((Math.floor(obj.point.x) % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100;
					position.centerZ = ((Math.floor(obj.point.z) % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100;
				}
				if (isLayerOn) {
					position.layer =
						(isSpriteOptionSelected
							? this.getMapPortionByPosition(position)?.model.getLastSpriteLayerAt(position) || 0
							: position.layer) + 1;
				} else {
					if (!Map.isRotateDisabled()) {
						position.angleX = Project.current!.settings.mapEditorDefaultRotateX;
						position.angleY = Project.current!.settings.mapEditorDefaultRotateY;
						position.angleZ = Project.current!.settings.mapEditorDefaultRotateZ;
					}
					if (!Map.isScaleDisabled()) {
						position.scaleX = Project.current!.settings.mapEditorDefaultScaleX;
						position.scaleY = Project.current!.settings.mapEditorDefaultScaleY;
						position.scaleZ = Project.current!.settings.mapEditorDefaultScaleZ;
					}
				}
			}
			if (this.lockedLayer !== null) {
				position.layer = this.lockedLayer;
				if (isLayerOn && isSpriteOptionSelected && this.lastPosition) {
					position.angleX = this.lastPosition.angleX;
					position.angleY = this.lastPosition.angleY;
					position.angleZ = this.lastPosition.angleZ;
					position.centerX = this.lastPosition.centerX;
					position.centerZ = this.lastPosition.centerZ;
				}
			}
			const zPlus = position.layer * this.camera.getYOffsetDepth();
			const newLayerRayPosition = new Portion(
				Math.floor((obj.point.x + Constants.PRECISION_POSITION + zPlus) / Project.SQUARE_SIZE),
				Math.floor((obj.point.y + Constants.PRECISION_POSITION) / Project.SQUARE_SIZE),
				Math.floor((obj.point.z + Constants.PRECISION_POSITION + zPlus) / Project.SQUARE_SIZE),
			);
			if (
				this.canEdit &&
				(this.lastPosition === null ||
					!this.lastPosition.equals(position) ||
					(isLayerOn &&
						(this.layerRayPosition === null || !newLayerRayPosition.equals(this.layerRayPosition))))
			) {
				if (
					Project.current!.settings.mapEditorCurrentActionIndex === ACTION_KIND.RECTANGLE &&
					this.rectangleStartPosition === null &&
					Map.isRemoving() &&
					this.lastPosition === null
				) {
					this.rectangleStartPosition = position.clone();
					this.lastRectangleEndPosition = position.clone();
				}
				this.layerRayPosition = isLayerOn ? newLayerRayPosition : null;
				if (Map.isDrawing()) {
					switch (Map.currentSelectedMapElementKind) {
						case ELEMENT_MAP_KIND.START_POSITION:
							if (Map.isAdding()) {
								this.updateStartPosition(position);
							}
							break;
						case ELEMENT_MAP_KIND.SPRITE_WALL:
							if (Map.isAdding()) {
								this.updateLockedY(position);
								this.cursorWall.update(position);
								this.add(position, true);
							} else if (Map.isRemoving()) {
								this.updateLockedY(position);
								this.cursorWall.update(position);
								this.remove(position, true);
							}
							break;
						default:
							if (!Inputs.isPointerPressed && !Inputs.isMouseRightPressed) {
								this.add(position, true);
							} else if (this.rectangleStartPosition && this.lastRectangleEndPosition) {
								this.updateLockedY(position);
								const positions = this.rectangleStartPosition.getPositionsRectangle(position);
								this.forEachMapPortions((mapPortion) => {
									mapPortion.removeLastPreview();
								});
								const adding = Map.isAdding();
								for (const rectanglePosition of positions) {
									if (adding) {
										this.add(rectanglePosition, true, false, false);
									} else {
										this.remove(rectanglePosition, true, false, false);
									}
								}
								this.rectangleStartPosition.addPositionRectOutline(positions, position);
								for (const rectanglePosition of positions) {
									const land = this.getMapPortionByPosition(rectanglePosition)?.model.lands.get(
										rectanglePosition.toKey(),
									);
									if (land instanceof MapElement.Autotile) {
										land.update(this, rectanglePosition);
									}
								}
							} else if (
								Map.isAdding() &&
								(!Constants.IS_MOBILE ||
									Project.current!.settings.mapEditorCurrentActionIndex !== ACTION_KIND.PIN)
							) {
								this.updateLockedY(position);
								this.add(position);
							} else if (
								Map.isRemoving() &&
								(!Constants.IS_MOBILE ||
									Project.current!.settings.mapEditorCurrentActionIndex !== ACTION_KIND.PIN)
							) {
								this.updateLockedY(position);
								this.remove(position);
							}
							break;
					}
				}
			}
			if (this.isDetection) {
				if (Map.isAdding()) {
					this.addDetection(position, false);
				} else if (Map.isRemoving()) {
					this.removeDetection(position);
				} else {
					this.addDetection(position, true);
				}
			}
			this.lastPosition = position;
			this.pointedMapElementPosition = position;
			this.pointedMapElement = null;
			this.pointedObjectLabel = null;
			if (this.rectangleStartPosition) {
				this.lastRectangleEndPosition = position.clone();
			}
			break;
		}
		if (intersects.length === 0) {
			this.forEachMapPortions((mapPortion) => {
				mapPortion.removeLastPreview();
			});
			this.lastPosition = null;
			this.layerRayPosition = null;
			this.pointedMapElementPosition = null;
			this.pointedMapElement = null;
			this.pointedObjectLabel = null;
		}

		// For displaying information on left bottom corner
		if (!isPlane || Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.OBJECT) {
			switch (Map.currentSelectedMapElementKind) {
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
				case ELEMENT_MAP_KIND.OBJECT:
					layer = RAYCASTING_LAYER.OBJECTS;
					break;
				default:
					layer = RAYCASTING_LAYER.PLANE;
					break;
			}
			if (isLayerOn && isSpriteOptionSelected) {
				Manager.GL.raycaster.layers.enable(layer);
				Manager.GL.raycaster.layers.enable(RAYCASTING_LAYER.SPRITES);
				Manager.GL.raycaster.layers.enable(RAYCASTING_LAYER.WALLS);
			} else {
				Manager.GL.raycaster.layers.set(layer);
			}
			intersects = Manager.GL.raycaster.intersectObjects(this.scene.children);
		}
		for (const obj of intersects) {
			if (obj.faceIndex !== undefined) {
				const newPositionKey = ((obj.object as THREE.Mesh).geometry as CustomGeometry)?.facePositions?.[
					obj.faceIndex ?? 0
				];
				if (newPositionKey) {
					const newPosition = Position.fromKey(newPositionKey);
					const mapPortion = this.getMapPortionByPosition(newPosition);
					if (Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.OBJECT) {
						const object = mapPortion?.model.objects.get(newPositionKey);
						if (object) {
							const state = object.getFirstState();
							if (state) {
								newPosition.centerX = state.centerX.getFixNumberValue();
								newPosition.centerZ = state.centerZ.getFixNumberValue();
								newPosition.angleX = state.angleX.getFixNumberValue();
								newPosition.angleY = state.angleY.getFixNumberValue();
								newPosition.angleZ = state.angleZ.getFixNumberValue();
								newPosition.scaleX = state.scaleX.getFixNumberValue();
								newPosition.scaleY = state.scaleY.getFixNumberValue();
								newPosition.scaleZ = state.scaleZ.getFixNumberValue();
							}
							this.pointedMapElementPosition = newPosition;
							this.pointedObjectLabel = `${t('object')} ID: ${Utils.formatNumberID(object.id)} - ${object.name}`;
						} else {
							continue;
						}
					} else {
						let element = mapPortion?.model.getMapElement(newPosition, Map.currentSelectedMapElementKind);
						if (isLayerOn && isSpriteOptionSelected && (!element || element.isPreview)) {
							element = mapPortion?.model.getMapElement(newPosition, ELEMENT_MAP_KIND.SPRITE_WALL);
						}
						if (element && !element.isPreview) {
							this.pointedMapElement = element;
							this.pointedMapElementPosition = newPosition;
						} else {
							continue;
						}
					}
				}
			}
			break;
		}
		if (
			Map.isDrawing() &&
			this.lastPosition !== null &&
			this.pointedMapElementPosition !== null &&
			this.lastPosition.equals(this.pointedMapElementPosition)
		) {
			this.pointedMapElement = this.lastMapElement;
		}
		if (
			previousPointedMapElement !== this.pointedMapElement ||
			previousPointedObjectLabel !== this.pointedObjectLabel ||
			(previousPointedMapElementPosition === null && this.pointedMapElementPosition !== null) ||
			(previousPointedMapElementPosition !== null && this.pointedMapElementPosition === null) ||
			(previousPointedMapElementPosition !== null &&
				this.pointedMapElementPosition !== null &&
				!previousPointedMapElementPosition.equals(this.pointedMapElementPosition))
		) {
			this.requestPaintHUD = true;
			if (Map.isTransforming()) {
				if (this.pointedMapElementPosition !== null || previousPointedMapElementPosition !== null) {
					if (previousPointedMapElementPosition) {
						const mapPortion = this.getMapPortionByPosition(previousPointedMapElementPosition);
						if (mapPortion) {
							this.portionsToUpdate.add(mapPortion);
						}
					}
					if (this.pointedMapElementPosition) {
						const mapPortion = this.getMapPortionByPosition(this.pointedMapElementPosition);
						if (mapPortion) {
							this.portionsToUpdate.add(mapPortion);
						}
					}
				}
			}
		}
		this.meshPlane!.position.setY(previousPlaneY);
		if (this.needsMouseDown) {
			this.onMouseDown();
			this.needsMouseDown = false;
		}
		if (
			!Inputs.isPointerPressed &&
			!Inputs.isMouseRightPressed &&
			(!this.pointedMapElementPosition || !this.pointedMapElementPosition.isInMap(this.model))
		) {
			this.forEachMapPortions((mapPortion) => {
				mapPortion.removeLastPreview();
			});
		}
	}

	addMobileKeyMove() {
		const offset =
			((Constants.CURSOR_MOVE_MOBILE_PERCENT / 100) * (this.canvas!.clientWidth + this.canvas!.clientHeight)) / 2;
		if (Inputs.getPositionX() < offset) {
			Inputs.keys.push('a');
		}
		if (Inputs.getPositionX() > this.canvas!.clientWidth - offset) {
			Inputs.keys.push('d');
		}
		if (Inputs.getPositionY() < offset) {
			Inputs.keys.push('w');
		}
		if (Inputs.getPositionY() > this.canvas!.clientHeight - offset) {
			Inputs.keys.push('s');
		}
	}

	onKeyDown() {}

	onKeyDownImmediate() {
		if (this.rectangleStartPosition === null && this.movingObject === null) {
			this.needsUpdateCursor = true;
		}
	}

	onKeyUp() {
		this.cursor.onKeyUp();
		if (this.canEdit && this.tag) {
			this.tag.cursorPosition = this.cursor.position;
			Project.current!.treeMaps.save().catch(console.error);
		}
	}

	onMouseDown() {
		if (Inputs.isSHIFT) {
			this.camera.onMouseWheelUpdate(this === Map.current);
		} else if (
			!Inputs.isMouseWheelPressed &&
			(Inputs.isCTRL || (!this.canEdit && !this.isDetection)) &&
			this.lastPosition &&
			this.lastPosition.isInMap(this.model)
		) {
			this.cursor.position = this.lastPosition.clone();
			this.syncCursorGrid();
		} else {
			if ((this.canEdit && Map.isDrawing()) || this.isDetection) {
				if (this.isDetection) {
					if (Map.isAdding() && this.lastPosition) {
						this.addDetection(this.lastPosition);
					} else if (Map.isRemoving()) {
						this.needsUpdateRaycasting = true;
					}
				} else {
					if (Map.isAdding() && this.lastPosition) {
						switch (Map.currentSelectedMapElementKind) {
							case ELEMENT_MAP_KIND.START_POSITION:
								this.updateStartPosition(this.lastPosition);
								break;
							case ELEMENT_MAP_KIND.SPRITE_WALL:
								this.cursorWall.onMouseDown(this.lastPosition);
								break;
							default:
								this.updateLockedY(this.lastPosition);
								switch (Project.current!.settings.mapEditorCurrentActionIndex) {
									case ACTION_KIND.PENCIL:
										this.add(this.lastPosition);
										break;
									case ACTION_KIND.RECTANGLE:
										this.rectangleStartPosition = this.lastPosition.clone();
										this.lastRectangleEndPosition = this.lastPosition.clone();
										break;
									case ACTION_KIND.PIN:
										this.paintPin(
											this.lastPosition,
											Map.currentSelectedMapElementKind,
											Project.current!.settings.mapEditorCurrentAutotileID,
											Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.FLOOR
												? Project.current!.settings.mapEditorCurrentTilesetFloorSpriteTexture
												: Project.current!.settings.mapEditorCurrentAutotileTexture,
										);
										break;
								}
								if (Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.OBJECT) {
									this.movingObject = this.getSelectedObject();
									this.movingObjectInitialPosition = this.lastPosition;
								}
								break;
						}
					} else if (Map.isRemoving()) {
						if (Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.SPRITE_WALL && this.lastPosition) {
							this.cursorWall.onMouseDown(this.lastPosition);
						} else {
							switch (Project.current!.settings.mapEditorCurrentActionIndex) {
								case ACTION_KIND.PIN:
									if (this.lastPosition) {
										this.paintPin(this.lastPosition, ELEMENT_MAP_KIND.NONE, -1, new Rectangle());
									}
									break;
							}
							this.lastPosition = null;
							this.needsUpdateRaycasting = true;
						}
					}
				}
			} else if (this.canEdit && !this.transformControls.dragging && Inputs.isPointerPressed) {
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
				if (this.selectedElement !== null && this.selectedPosition !== null) {
					this.lastTransformPosition = this.selectedPosition.clone();
					this.lastTransformKind = this.selectedElement.kind;
				}
				this.transformControls.detach();
				const mapPortion = this.selectedPosition ? this.getMapPortionByPosition(this.selectedPosition) : null;
				if (mapPortion) {
					this.portionsToUpdate.add(mapPortion);
				}
				this.needsUpdateSelectedPosition = this.selectedPosition;
				this.needsUpdateSelectedMapElement = true;
			}
			if (this.canEdit && this.transformControls.dragging && Inputs.isPointerPressed) {
				this.isDraggingTransforming = true;
			}
		}
		if (this.canEdit && Map.isTransforming()) {
			const mapPortion = this.getMapPortionByPosition(Position.createFromVector3(this.selectedMesh.position));
			if (mapPortion) {
				mapPortion.updateGeometriesWithoutCheck();
			}
		}
	}

	onPointerDown() {
		if (Inputs.previousTouchDistance === 0 && this.rectangleStartPosition === null) {
			this.addMobileKeyMove();
			if (Inputs.keys.length > 0) {
				this.cursor.onKeyDownImmediate();
				this.isMobileMovingCursor = true;
			} else {
				if (Map.currentSelectedMobileAction !== MOBILE_ACTION.MOVE) {
					this.needsUpdateRaycasting = true;
					this.needsMouseDown = true;
				}
			}
		}
	}

	onMouseMove() {
		if (Project.current!.settings.mapEditorCurrentLayerIndex === LAYER_KIND.ON) {
			this.requestPaintHUD = true;
		}
		if (Inputs.isMouseWheelPressed || (Inputs.isPointerPressed && Inputs.isSHIFT)) {
			this.camera.onMouseWheelUpdate(this === Map.current);
		} else {
			// Avoid to draw undesired new preview
			if (!this.mouseUp) {
				this.needsUpdateRaycasting = true;
			}
			this.updateMoveTransformDragging();
		}
	}

	onPointerMove() {
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
				if (Map.currentSelectedMobileAction !== MOBILE_ACTION.MOVE) {
					this.needsUpdateRaycasting = true;
					this.updateMoveTransformDragging();
				} else {
					this.camera.onMouseWheelUpdate(this === Map.current);
				}
			}
		}
	}

	onTouchMove() {
		// TODO
	}

	async onMouseUp() {
		this.mouseUp = true;
		this.needsUpdateRaycasting = false;
		this.lockedY = null;
		this.lockedYPixels = null;
		this.lockedLayer = null;
		if (
			this.movingObject &&
			this.movingObjectInitialPosition &&
			!this.cursorObject.position.equals(this.movingObjectInitialPosition)
		) {
			const previousPortion = this.getMapPortionByPosition(this.movingObjectInitialPosition);
			const newPortion = this.getMapPortionByPosition(this.cursorObject.position);
			if (previousPortion && newPortion) {
				this.portionsToSave.add(previousPortion);
				this.portionsToSave.add(newPortion);
				this.undoRedoStates.push(
					UndoRedoState.create(
						this.movingObjectInitialPosition,
						this.movingObject,
						ELEMENT_MAP_KIND.OBJECT,
						null,
						ELEMENT_MAP_KIND.OBJECT,
					),
				);
				this.undoRedoStates.push(
					UndoRedoState.create(
						this.cursorObject.position,
						this.previewDeletedMovingObject,
						ELEMENT_MAP_KIND.OBJECT,
						this.movingObject,
						ELEMENT_MAP_KIND.OBJECT,
					),
				);
				await this.model.save(true);
			}
		}
		this.movingObjectInitialPosition = null;
		this.movingObject = null;
		this.previewDeletedMovingObject = null;
		this.cursorWall.onMouseUp();
		if (this.isDraggingTransforming) {
			this.updateTransform();
		}
		this.isDraggingTransforming = false;
		if (this.rectangleStartPosition && this.lastPosition) {
			this.forEachMapPortions((mapPortion) => {
				for (const [position, previous, kind] of mapPortion.lastPreviewRemove) {
					const element = mapPortion.model.getMapElement(position, kind);
					if (element) {
						element.isPreview = false;
					}
					this.undoRedoStates.push(
						UndoRedoState.create(
							position,
							previous,
							previous === null ? kind : previous.kind,
							element,
							element?.kind || kind,
						),
					);
				}
				mapPortion.lastPreviewRemove = [];
				this.portionsToSave.add(mapPortion);
			});
		}
		this.rectangleStartPosition = null;
		this.lastRectangleEndPosition = null;
		if (this.canEdit) {
			this.updateUndoRedoSave();
			await Project.current!.treeMaps.save();
			if (this.needsSaveSystems) {
				this.needsSaveSystems = false;
				await Project.current!.systems.save();
				if (Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.START_POSITION && Map.onStartPositionSet) {
					Map.onStartPositionSet();
				}
			}
		}
		this.mouseUp = false;
	}

	async onTouchEnd() {
		await this.onMouseUp();
		this.lastPosition = null;
		Inputs.keys = [];
		this.isMobileMovingCursor = false;
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
			if (this.canEdit) {
				await Project.current!.treeMaps.save();
			}
		}
	}

	update(force = false): boolean {
		if (force || super.update()) {
			if (this.needsUpdateCursor) {
				this.cursor.onKeyDownImmediate();
				this.requestPaintHUD = true;
				this.needsUpdateCursor = false;
			}

			this.camera.update(this);

			if (this.needsUpdateRaycasting) {
				this.updateRaycasting();
				this.needsUpdateRaycasting = false;
			}

			// Skybox
			if (this.skyboxMesh) {
				this.skyboxMesh.position.copy(this.camera.getThreeCamera().position);
				const distance = Math.max(
					1000,
					this.camera.getThreeCamera().position.distanceTo(this.camera.targetPosition),
				);
				this.skyboxMesh.scale.set(distance, distance, distance);
			}

			// Cursors
			this.cursor.update();
			if (this.canEdit) {
				if (Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.SPRITE_WALL) {
					if (
						this.lastPosition !== null &&
						this.lastPosition.isInMap(this.model, false, true) &&
						this.cursorWall.needsUpdate(this.lastPosition)
					) {
						this.cursorWall.update(this.lastPosition);
					}
				} else {
					this.cursorWall.remove();
				}
			}

			// Update portions
			if (this.canEdit && !this.isDetection) {
				for (const mapPortion of this.portionsToUpdate) {
					mapPortion.updateGeometries();
				}
				this.portionsToUpdate.clear();
				if (this.portionsSaving.size === 0 && this.portionsToSave.size > 0) {
					this.portionsSaving = new Set([...this.portionsToSave]);
					this.savePortionsTemp().catch(console.error);
					this.portionsToSave.clear();
				}
			}

			// Update face sprites
			const vector = new THREE.Vector3();
			this.camera.getThreeCamera().getWorldDirection(vector);
			const angle = Math.atan2(vector.x, vector.z) + Math.PI;
			this.forEachMapPortions((mapPortion) => {
				mapPortion.updateFaceSprites(angle);
			});
			if (this.canEdit) {
				if (this.selectedMesh.geometry instanceof CustomGeometryFace) {
					this.selectedMesh.geometry.rotate(angle, MapElement.Base.Y_AXIS, this.selectedMesh.scale);
				}
				if (this.hoveredMesh.geometry instanceof CustomGeometryFace) {
					this.hoveredMesh.geometry.rotate(angle, MapElement.Base.Y_AXIS, this.hoveredMesh.scale);
				}
			}

			// Update autotiles animated
			if (this.autotileFrame.update()) {
				this.autotilesOffset.setY(
					(this.autotileFrame.value * MapElement.Autotiles.COUNT_LIST * 2 * Project.SQUARE_SIZE) /
						Constants.MAX_PICTURE_SIZE,
				);
			}

			// Update portions
			if (this.updateCurrentPortion()) {
				this.loadPortions(true).catch(console.error);
				this.loading = true;
			}

			Map.elapsedTime = new Date().getTime() - Map.lastUpdateTime;
			Map.averageElapsedTime = (Map.averageElapsedTime + Map.elapsedTime) / 2;
			Map.lastUpdateTime = new Date().getTime();
			return true;
		}
		return false;
	}

	draw3D(GL = Manager.GL.mainContext) {
		if (this.needsClose) {
			this.scene.background = new THREE.Color(0x2e324a);
		}
		super.draw3D(GL);
	}

	drawCursorCoords() {
		const space = 18;
		const padding = 10;
		const lines = this.cursor.position.toStringCoords().split('\n');
		Map.ctxHUD!.textBaseline = 'top';
		for (const [index, line] of lines.entries()) {
			Utils.drawStrokedText(Map.ctxHUD!, line, padding, padding + index * space);
		}
	}

	drawPointedCoords() {
		if (this.pointedMapElementPosition && this.pointedMapElementPosition.isInMap(this.model)) {
			const lines = this.pointedMapElementPosition.toString().split('\n');
			let label: string;
			if (this.pointedMapElement !== null) {
				label = this.pointedMapElement.toString();
			} else if (this.pointedObjectLabel !== null) {
				label = this.pointedObjectLabel;
			} else {
				label = i18n.t('none').toUpperCase();
			}
			ArrayUtils.insertFirst(lines, label);
			Map.ctxHUD!.textBaseline = 'bottom';
			const space = 18;
			const padding = 10;
			const y = this.canvas!.clientHeight - (lines.length - 1) * space - padding;
			for (const [index, line] of lines.entries()) {
				Utils.drawStrokedText(Map.ctxHUD!, line, padding, y + index * space);
			}
		}
	}

	drawLayersOnCursor() {
		if (Project.current!.settings.mapEditorCurrentLayerIndex === LAYER_KIND.ON) {
			Map.ctxHUD!.drawImage(Map.pictureLayersOnCursor, Inputs.mouseX + 20, Inputs.mouseY - 20);
		}
	}

	drawHUD() {
		if (this.requestPaintHUD) {
			this.clearHUD();
			if (this.showCoordinates) {
				this.drawCursorCoords();
				this.drawPointedCoords();
				this.drawLayersOnCursor();
			}
			this.requestPaintHUD = false;
		}
	}

	close() {
		super.close();
		if (this.isBattle) {
			Battler.clearScene();
		}
	}

	clearHUD() {
		Map.ctxHUD!.clearRect(
			0,
			0,
			Map.canvasHUD!.width / window.devicePixelRatio,
			Map.canvasHUD!.height / window.devicePixelRatio,
		);
		Map.ctxHUD!.imageSmoothingEnabled = false;
		Map.ctxHUD!.font = 'bold 12px sans-serif';
		Map.ctxHUD!.fillStyle = 'white';
		Map.ctxHUD!.strokeStyle = '#29273d';
		Map.ctxHUD!.lineJoin = 'round';
		Map.ctxHUD!.lineWidth = 3;
	}
}

export { Map };
