/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Manager, MapElement, Scene } from '../Editor';
import { Base } from '.';
import { CustomGeometry, CustomGeometryFace, Position, Project, Rectangle, TextureBundle } from '../core';
import { ELEMENT_MAP_KIND, SPRITE_WALL_TYPE } from '../common';

class Previewer3D extends Base {
	public static scenes: Record<string, Previewer3D> = {}; // id canvas => scene

	public id: string;
	public canvas!: HTMLElement;
	public material: THREE.MeshPhongMaterial | null = null;
	public sunLight!: THREE.DirectionalLight;
	public meshes: THREE.Mesh[] = [];
	public currentRotation: number = 0;

	constructor(id: string) {
		super();
		this.id = id;
	}

	initializeSunLight() {
		const ambient = new THREE.AmbientLight(0xffffff, 1.2);
		this.scene.add(ambient);
		this.sunLight = new THREE.DirectionalLight(0xffffff, 2);
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
		this.initializeSunLight();
		this.loading = false;
	}

	async loadMaterial() {
		if (this.material === null) {
			this.material =
				Scene.Map.current?.materialTileset || (await Manager.GL.loadTexture('./Assets/plains-woods.png'));
		}
	}

	async loadFloor(GL: Manager.GL, texture: Rectangle) {
		await this.loadMaterial();
		const { width, height } = Manager.GL.getMaterialTextureSize(this.material);
		const floor = MapElement.Floor.create(texture);
		const geometry = new CustomGeometry();
		floor.updateGeometry(geometry, new Position(), width, height, 0);
		this.addToScene(GL, geometry);
	}

	async loadAutotile(GL: Manager.GL, autotileID: number, texture: Rectangle) {
		const autotile = Project.current!.specialElements.getAutotileByID(autotileID);
		if (!autotile) {
			this.clear();
			return;
		}
		const texturesAutotile = await MapElement.Autotiles.loadAutotileTexture(autotileID);
		const pictureID = autotile.pictureID;
		let includedTexture: TextureBundle | null = null;
		if (texturesAutotile) {
			for (const textureAutotile of texturesAutotile) {
				if (textureAutotile.isInTexture(pictureID, texture)) {
					includedTexture = textureAutotile;
					break;
				}
			}
		}
		if (includedTexture !== null) {
			const autotiles = new MapElement.Autotiles(includedTexture);
			autotiles.updateGeometry(
				new Position(),
				MapElement.Autotile.create(autotileID, MapElement.Autotiles.PREVIEW_TILE, texture)
			);
			this.addToScene(GL, autotiles.geometry, autotiles.bundle.material);
		}
	}

	async loadSprite(GL: Manager.GL, texture: Rectangle, kind: ELEMENT_MAP_KIND) {
		await this.loadMaterial();
		const { width, height } = Manager.GL.getMaterialTextureSize(this.material);
		const sprite = MapElement.Sprite.create(kind, texture);
		const geometry = new CustomGeometryFace();
		sprite.updateGeometry(geometry, width, height, new Position(), 0, true, null);
		this.addToScene(GL, geometry);
	}

	async loadWall(GL: Manager.GL, wallID: number) {
		const wall = Project.current!.specialElements.getWallByID(wallID);
		if (!wall) {
			this.clear();
			return;
		}
		const textureWall = await MapElement.SpriteWall.loadWallTexture(wallID);
		if (textureWall) {
			const { width, height } = Manager.GL.getMaterialTextureSize(textureWall);
			const spriteLeft = MapElement.SpriteWall.create(wallID, SPRITE_WALL_TYPE.LEFT);
			const spriteMiddle = MapElement.SpriteWall.create(wallID, SPRITE_WALL_TYPE.MIDDLE);
			const spriteRight = MapElement.SpriteWall.create(wallID, SPRITE_WALL_TYPE.RIGHT);
			const geometry = new CustomGeometry();
			let count = 0;
			count = spriteLeft.updateGeometry(geometry, new Position(), width, height, count);
			count = spriteMiddle.updateGeometry(geometry, new Position(1), width, height, count);
			count = spriteRight.updateGeometry(geometry, new Position(2), width, height, count);
			this.addToScene(GL, geometry, textureWall);
		}
	}

	async loadMountain(GL: Manager.GL, mountainID: number, textureFloor: Rectangle) {
		const wall = Project.current!.specialElements.getMountainByID(mountainID);
		if (!wall) {
			this.clear();
			return;
		}
		const textureMountain = await MapElement.Mountains.loadMountainTexture(mountainID);
		if (textureMountain) {
			const mountainElement = MapElement.Mountain.create(mountainID, 1, 0, 1, 0);
			let geometry = new CustomGeometry();
			mountainElement.updateGeometry(geometry, new Position(), 0);
			this.addToScene(GL, geometry, textureMountain);
			await this.loadMaterial();
			const { width, height } = Manager.GL.getMaterialTextureSize(this.material);
			const floor = MapElement.Floor.create(new Rectangle(textureFloor.x, textureFloor.y, 1, 1));
			geometry = new CustomGeometry();
			floor.updateGeometry(geometry, new Position(), width, height, 0);
			this.addToScene(GL, geometry, this.material, false, new THREE.Vector3(0, Project.getSquareSize() / 2));
		}
	}

	addToScene(
		GL: Manager.GL,
		geometry: CustomGeometry | CustomGeometryFace,
		material: THREE.MeshPhongMaterial | null = this.material,
		needsClear = true,
		position: THREE.Vector3 | null = null
	) {
		if (needsClear) {
			this.clear();
		}
		if (!geometry.isEmpty() && material) {
			geometry.updateAttributes();
			const mesh = new THREE.Mesh(geometry, material);
			this.meshes.push(mesh);
			this.scene.add(mesh);
			mesh.geometry.center();
			if (position) {
				mesh.position.set(position.x, position.y, position.z);
			}
			this.updateCamera();
			this.draw3D(GL);
		}
	}

	clear() {
		for (const mesh of this.meshes) {
			this.scene.remove(mesh);
		}
		this.meshes = [];
	}

	updateCamera() {
		if (this.meshes.length === 0) {
			return;
		}
		const min = new THREE.Vector3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
		const max = new THREE.Vector3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
		let w = 0;
		let h = 0;
		let d = 0;
		for (const mesh of this.meshes) {
			//mesh.scale.set(32, 32, 32);
			let bb = mesh.geometry.boundingBox;
			let m: THREE.Vector3;
			if (bb === null) {
				mesh.geometry.computeBoundingBox();
				bb = mesh.geometry.boundingBox;
			}
			if (bb) {
				m = bb.min.clone();
				min.set(Math.min(min.x, m.x), Math.min(min.y, m.y), Math.min(min.z, m.z));
				m = bb.max.clone();
				max.set(Math.max(max.x, m.x), Math.max(max.y, m.y), Math.max(max.z, m.z));
				w = max.x - min.x;
				h = max.y - min.y;
				d = max.z - min.z;
			}
		}

		this.camera.distance = Math.max(Math.max(w, h), d) + (w + h + d) / 2;
		this.camera.verticalAngle = 55;
		this.camera.targetPosition.set(w / 2 + min.x, h / 2 + min.y, d / 2 + min.z);
	}

	update() {
		super.update();

		this.currentRotation += 0.01;
		for (const mesh of this.meshes) {
			mesh.rotation.y = this.currentRotation;
		}
	}

	draw3D(GL: Manager.GL) {
		super.draw3D(GL);
	}
}

export { Previewer3D };
