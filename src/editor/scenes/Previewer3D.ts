/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Manager, MapElement } from '../Editor';
import { Base } from './Base';
import { CustomGeometry } from '../core/CustomGeometry';
import { Position } from '../core/Position';
import { Rectangle } from '../core/Rectangle';
import { ElementMapKind } from '../common/Enum';
import { CustomGeometryFace } from '../core/CustomGeometryFace';

class Previewer3D extends Base {
	public static scenes: Record<string, Previewer3D> = {}; // id canvas => scene

	public id: string;
	public canvas!: HTMLElement;
	public material!: THREE.MeshPhongMaterial;
	public sunLight!: THREE.DirectionalLight;
	public mesh: THREE.Mesh | null = null;
	public currentRotation: number = 0;

	constructor(id: string) {
		super();
		this.id = id;
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

	async load() {
		this.loading = true;
		this.material = await Manager.GL.loadTexture('./assets/textures/plains-woods.png');
		this.initializeSunLight();
		this.loading = false;
	}

	loadFloor(GL: Manager.GL, texture: Rectangle) {
		const { width, height } = Manager.GL.getMaterialTextureSize(this.material);
		const floor = MapElement.Floor.create(texture);
		const geometry = new CustomGeometry();
		floor.updateGeometry(geometry, new Position(), width, height, 0);
		this.addToScene(GL, geometry);
	}

	loadSprite(GL: Manager.GL, texture: Rectangle, kind: ElementMapKind) {
		const { width, height } = Manager.GL.getMaterialTextureSize(this.material);
		const sprite = MapElement.Sprite.create(kind, texture);
		const geometry = new CustomGeometryFace();
		sprite.updateGeometry(geometry, width, height, new Position(), 0, true, null);
		this.addToScene(GL, geometry);
	}

	addToScene(GL: Manager.GL, geometry: CustomGeometry | CustomGeometryFace) {
		geometry.updateAttributes();
		if (this.mesh !== null) {
			this.scene.remove(this.mesh);
		}
		this.mesh = new THREE.Mesh(geometry, this.material);
		this.scene.add(this.mesh);
		this.mesh.geometry.center();
		this.updateCamera();
		this.draw3D(GL);
	}

	updateCamera() {
		if (this.mesh == null) {
			return;
		}
		const min = new THREE.Vector3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
		const max = new THREE.Vector3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
		let w = 0;
		let h = 0;
		let d = 0;
		this.mesh.scale.set(32, 32, 32);
		let bb = this.mesh.geometry.boundingBox;
		let m: THREE.Vector3;
		if (bb === null) {
			this.mesh.geometry.computeBoundingBox();
			bb = this.mesh.geometry.boundingBox;
		}
		if (bb) {
			m = bb.min.multiplyScalar(32);
			min.set(Math.min(min.x, m.x), Math.min(min.y, m.y), Math.min(min.z, m.z));
			m = bb.max.multiplyScalar(32);
			max.set(Math.max(max.x, m.x), Math.max(max.y, m.y), Math.max(max.z, m.z));
			w = max.x - min.x;
			h = max.y - min.y;
			d = max.z - min.z;
		}
		this.camera.distance = Math.max(Math.max(w, h), d) + (w + h + d) / 2;
		this.camera.verticalAngle = 55;
		this.camera.targetPosition.set(w / 2 + min.x, h / 2 + min.y, d / 2 + min.z);
	}

	update(GL: Manager.GL) {
		super.update(GL);

		if (this.mesh) {
			this.currentRotation += 0.01;
			this.mesh.rotation.y = this.currentRotation;
		}
	}

	draw3D(GL: Manager.GL) {
		super.draw3D(GL);
	}
}

export { Previewer3D };
