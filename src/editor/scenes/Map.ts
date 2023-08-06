/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Manager, Model, Scene } from '../Editor';
import { LocalFile } from '../core/LocalFile';
import { Inputs } from '../managers';
import { Project } from '../core/Project';
import { Base } from './Base';
import { MapPortion } from '../core/MapPortion';
import { Portion } from '../core/Portion';
import { Paths } from '../common/Paths';
import { Grid } from '../core/Grid';

class Map extends Base {
	public static readonly MENU_BAR_HEIGHT = 26;

	public static current: Scene.Map | null;
	public static elapsedTime = 0;
	public static averageElapsedTime = 0;
	public static lastUpdateTime = new Date().getTime();

	public id: number;
	public modelMap: Model.Map = new Model.Map();
	public grid: Grid = new Grid();
	public meshPlane: THREE.Object3D | null = null;
	public sunLight!: THREE.DirectionalLight;
	public mapPortion: MapPortion = new MapPortion(new Portion(0, 0, 0));
	public materialTileset!: THREE.MeshPhongMaterial;
	public selectionOffset: THREE.Vector2 = new THREE.Vector2();

	constructor(id: number) {
		super();

		this.id = id;
	}

	add() {
		// TODO
	}

	remove() {
		// TODO
	}

	async load() {
		this.loading = true;

		// Tileset texture material
		this.materialTileset = await Manager.GL.loadTexture('./assets/textures/plains-woods.png');
		this.materialTileset.depthWrite = false;

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
		this.meshPlane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(
				Project.getSquareSize() * this.modelMap.length,
				Project.getSquareSize() * this.modelMap.width,
				1
			),
			material
		);
		this.meshPlane.visible = false;
		this.meshPlane.rotation.set(Math.PI / -2, 0, 0);
		this.meshPlane.layers.enable(1);
		this.scene.add(this.meshPlane);

		// Light
		this.initializeSunLight();

		// Grid
		this.grid.initialize(this.modelMap);

		// Load portions
		const globalPortion = new Portion(0, 0, 0);
		const mapPortion = new MapPortion(globalPortion);
		await mapPortion.load(Paths.join(folderMap, this.mapPortion.getFileName()));
		mapPortion.updateMaterials();
		mapPortion.updateGeometries();
		mapPortion.addToScene();

		this.loading = false;
	}

	async save() {
		this.loading = true;
		if (Project.current) {
			// Save model map
			const mapName = Model.Map.generateMapName(this.id);
			const folderMap = Paths.join(Project.current!.getPathMaps(), mapName);
			await this.modelMap.save(Paths.join(folderMap, Paths.FILE_MAP_INFOS));

			// Save portions
			await this.mapPortion.save(Paths.join(folderMap, this.mapPortion.getFileName()));
		}
		this.loading = false;
	}

	initializeSunLight() {
		const ambient = new THREE.AmbientLight(0xffffff, 0.61);
		this.scene.add(ambient);
		this.sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
		this.sunLight.position.set(-1, 1.75, 1);
		this.sunLight.position.multiplyScalar(16 * 10);
		this.sunLight.target.position.set(0, 0, 0);
		this.scene.add(this.sunLight);
		this.sunLight.castShadow = true;
		this.sunLight.shadow.mapSize.width = 2048;
		this.sunLight.shadow.mapSize.height = 2048;
		const d = 16 * 10;
		this.sunLight.shadow.camera.left = -d;
		this.sunLight.shadow.camera.right = d;
		this.sunLight.shadow.camera.top = d;
		this.sunLight.shadow.camera.bottom = -d;
		this.sunLight.shadow.camera.far = 16 * 350;
		this.sunLight.shadow.bias = -0.0003;
	}

	zoomIn(coef: number = 1) {
		this.camera.zoomIn(coef);
	}

	zoomOut(coef: number = 1) {
		this.camera.zoomOut(coef);
	}

	update(GL: Manager.GL) {
		super.update(GL);
		this.mapPortion.update();
	}

	onMouseDown(x: number, y: number) {
		console.log(x, y);
	}

	onMouseDownRepeat(x: number, y: number) {
		this.remove();
		this.add();
	}

	onMouseMove(x: number, y: number) {
		if (Inputs.isMouseWheelPressed) {
			this.camera.onMouseWheelUpdate();
		}
	}

	onMouseUp(x: number, y: number) {
		// TODO
	}

	onMouseWheel(delta: number) {
		if (delta < 0) {
			this.zoomIn(0.5);
		} else {
			this.zoomOut(0.5);
		}
	}

	draw3D(GL: Manager.GL) {
		super.draw3D(GL);
	}

	close() {
		super.close();
	}
}

export { Map };
