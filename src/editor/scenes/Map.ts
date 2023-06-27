/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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
	public light: THREE.DirectionalLight | null = null;
	public mapPortion: MapPortion = new MapPortion(new Portion(0, 0, 0));
	public materialTileset: THREE.ShaderMaterial = Manager.GL.MATERIAL_EMPTY;
	public selectionOffset: THREE.Vector2 = new THREE.Vector2();

	constructor(id: number) {
		super();

		this.id = id;
	}

	add() {}

	remove() {}

	async load() {
		this.loading = true;

		// Tileset texture material
		const texture = await Manager.GL.loadTexture('./assets/textures/plains-woods.png');
		this.materialTileset = Manager.GL.createMaterial(texture, { depthWrite: false });

		// Load map model
		const mapName = Model.Map.generateMapName(this.id);
		const folderMap = Paths.join(Project.current!.getPathMaps(), mapName);
		let file = await LocalFile.getFile(Paths.join(folderMap, Paths.FILE_MAP_INFOS));
		if (file) {
			let json = JSON.parse(file.content);
			this.modelMap.read(json);
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
		this.light = new THREE.DirectionalLight(0xffffff, 1.0);
		this.light.position.set(200, 200, 200);
		this.light.castShadow = true;
		this.light.shadow.camera.left = -400;
		this.light.shadow.camera.right = 400;
		this.light.shadow.camera.top = 400;
		this.light.shadow.camera.bottom = -400;
		this.light.shadow.camera.far = 400;
		this.light.shadow.mapSize.width = 2048;
		this.light.shadow.mapSize.height = 2048;
		this.scene.add(this.light);

		// Grid
		this.grid.initialize(this.modelMap);

		// Load portions
		let globalPortion = new Portion(0, 0, 0);
		let mapPortion = new MapPortion(globalPortion);
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

	onPointerDown(x: number, y: number) {}

	onCanvasOnlyPointerDown(x: number, y: number) {}

	onPointerDownRepeat(x: number, y: number) {
		if (Inputs.pointerLeftPressed) {
			this.remove();
			this.add();
		}
	}

	onCanvasOnlyPointerDownRepeat(x: number, y: number) {}

	onPointerMove(x: number, y: number) {}

	onPointerUp(x: number, y: number) {}

	onMouseWheel(delta: number) {
		if (delta < 0) {
			this.zoomIn();
		} else {
			this.zoomOut();
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
