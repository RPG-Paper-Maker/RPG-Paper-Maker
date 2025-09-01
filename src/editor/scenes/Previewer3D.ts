/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Base } from '.';
import { ELEMENT_MAP_KIND, SHAPE_KIND, SPRITE_WALL_TYPE } from '../common';
import { CustomGeometry } from '../core/CustomGeometry';
import { CustomGeometryFace } from '../core/CustomGeometryFace';
import { Position } from '../core/Position';
import { Position3D } from '../core/Position3D';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import { TextureBundle } from '../core/TextureBundle';
import { Manager, MapElement, Model, Scene } from '../Editor';
import { Object3D } from '../mapElements';

class Previewer3D extends Base {
	public static mainPreviewerScene: Scene.Previewer3D | null = null;
	public static listScenes: Map<string, Scene.Previewer3D> = new Map(); // id canvas => scene

	public id: string;
	public parentCanvas!: HTMLElement;
	public material: THREE.MeshPhongMaterial | null = null;
	public sunLight!: THREE.DirectionalLight;
	public meshes: THREE.Mesh[] = [];
	public currentRotation: number = (45 * Math.PI) / 180;
	public isCut = false;

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
		this.initialized = true;
	}

	async loadMaterial() {
		this.material = Scene.Map.current?.materialTileset ?? null;
	}

	async loadFloor(texture: Rectangle) {
		await this.loadMaterial();
		const { width, height } = Manager.GL.getMaterialTextureSize(this.material);
		const floor = MapElement.Floor.create(texture);
		const geometry = new CustomGeometry();
		floor.updateGeometry(Scene.Map.current!, geometry, new Position(), width, height, 0);
		this.addToScene(geometry);
	}

	async loadAutotile(autotileID: number, texture: Rectangle) {
		const autotile = Project.current!.specialElements.getAutotileByID(autotileID);
		if (!autotile) {
			this.clear();
			return;
		}
		const texturesAutotile = await MapElement.Autotiles.loadAutotileTexture(Scene.Map.current, autotileID);
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
				Scene.Map.current!,
				new Position(),
				MapElement.Autotile.create(autotileID, MapElement.Autotiles.PREVIEW_TILE, texture),
			);
			this.addToScene(autotiles.meshes[0][0].geometry as CustomGeometry, autotiles.bundle.material);
		}
	}

	async loadSprite(texture: Rectangle, kind: ELEMENT_MAP_KIND) {
		await this.loadMaterial();
		const { width, height } = Manager.GL.getMaterialTextureSize(this.material);
		const sprite = MapElement.Sprite.create(kind, texture);
		const geometry = new CustomGeometryFace();
		sprite.updateGeometry(Scene.Map.current!, geometry, width, height, new Position(), 0, true, null);
		this.addToScene(geometry);
	}

	async loadWall(wallID: number) {
		const wall = Project.current!.specialElements.getWallByID(wallID);
		if (!wall) {
			this.clear();
			return;
		}
		const textureWall = await MapElement.SpriteWall.loadWallTexture(Scene.Map.current, wallID);
		if (textureWall) {
			const { width, height } = Manager.GL.getMaterialTextureSize(textureWall);
			const spriteLeft = MapElement.SpriteWall.create(wallID, SPRITE_WALL_TYPE.LEFT);
			const spriteMiddle = MapElement.SpriteWall.create(wallID, SPRITE_WALL_TYPE.MIDDLE);
			const spriteRight = MapElement.SpriteWall.create(wallID, SPRITE_WALL_TYPE.RIGHT);
			const geometry = new CustomGeometry();
			let count = 0;
			count = spriteLeft.updateGeometry(geometry, new Position(), width, height, count);
			count = spriteMiddle.updateGeometry(geometry, new Position(1), width, height, count);
			spriteRight.updateGeometry(geometry, new Position(2), width, height, count);
			this.addToScene(geometry, textureWall);
		}
	}

	async loadMountain(mountainID: number, textureFloor: Rectangle, ws: number, wp: number, hs: number, hp: number) {
		const wall = Project.current!.specialElements.getMountainByID(mountainID);
		if (!wall) {
			this.clear();
			return;
		}
		const textureMountain = await MapElement.Mountains.loadMountainTexture(Scene.Map.current, mountainID);
		if (textureMountain) {
			const wpercent = Position3D.getPercentOfPixels(wp);
			const hpercent = Position3D.getPercentOfPixels(hp);
			const mountainElement = MapElement.Mountain.create(mountainID, ws, wpercent, hs, hpercent);
			let geometry = new CustomGeometry();
			mountainElement.updateGeometry(geometry, new Position(), 0);
			this.addToScene(geometry, textureMountain);
			await this.loadMaterial();
			const { width, height } = Manager.GL.getMaterialTextureSize(this.material);
			const floor = MapElement.Floor.create(new Rectangle(textureFloor.x, textureFloor.y, 1, 1));
			geometry = new CustomGeometry();
			const floorPosition = new Position(0, hs, hpercent);
			floor.updateGeometry(Scene.Map.current!, geometry, floorPosition, width, height, 0);
			this.addToScene(geometry, this.material, false, new THREE.Vector3(0, (floorPosition.getTotalY() / 2) * 16));
		}
	}

	async loadObject3D(object3DID: number) {
		const object = Project.current!.specialElements.getObject3DByID(object3DID);
		await this.loadObject3DByModel(object);
	}

	async loadObject3DByModel(object: Model.Object3D) {
		if (!object) {
			this.clear();
			return;
		}
		const texture = await Object3D.loadObject3DTexture(Scene.Map.current, object.id);
		const geometry = new CustomGeometry();
		const object3DElement = MapElement.Object3D.create(object);
		if (object.shapeKind === SHAPE_KIND.CUSTOM) {
			await (object3DElement as MapElement.Object3DCustom).loadShape();
		}
		object3DElement.updateGeometry(geometry, new Position(), 0);
		this.addToScene(geometry, texture);
	}

	async loadShape(shape: Model.Shape) {
		if (!shape) {
			this.clear();
			return;
		}
		const texture = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
		const geometry = new CustomGeometry();
		if (!shape.geometryData) {
			await shape.loadShape();
		}
		const object = new Model.Object3D();
		object.shapeKind = SHAPE_KIND.CUSTOM;
		object.scale = 1;
		const object3DElement = MapElement.Object3D.create(object) as MapElement.Object3DCustom;
		object3DElement.shape = shape;
		object3DElement.updateGeometry(geometry, new Position(), 0);
		this.addToScene(geometry, texture);
	}

	addToScene(
		geometry: CustomGeometry | CustomGeometryFace,
		material: THREE.MeshPhongMaterial | null = this.material,
		needsClear = true,
		position: THREE.Vector3 | null = null,
	) {
		if (needsClear) {
			this.clear();
		}
		if (!geometry.isEmpty() && material) {
			geometry.updateAttributes();
			const mesh = new THREE.Mesh(geometry, material);
			mesh.rotation.y = this.currentRotation;
			mesh.geometry.center();
			if (position) {
				mesh.position.set(position.x, position.y, position.z);
			}
			this.meshes.push(mesh);
			this.scene.add(mesh);
			this.updateCamera();
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
		const resize = Project.SQUARE_SIZE;
		for (const mesh of this.meshes) {
			mesh.scale.set(resize, resize, resize);
			let bb = mesh.geometry.boundingBox;
			let m: THREE.Vector3;
			if (bb === null) {
				mesh.geometry.computeBoundingBox();
				bb = mesh.geometry.boundingBox;
			}
			if (bb) {
				m = bb.min.clone().multiplyScalar(resize);
				min.set(Math.min(min.x, m.x), Math.min(min.y, m.y), Math.min(min.z, m.z));
				m = bb.max.clone().multiplyScalar(resize);
				max.set(Math.max(max.x, m.x), Math.max(max.y, m.y), Math.max(max.z, m.z));
				w = max.x - min.x;
				h = max.y - min.y;
				d = max.z - min.z;
			}
		}
		this.camera.distance = Math.max(Math.max(w, h), d) + resize + (w + h + d) / 3;
		if (this.isCut) {
			const s = resize * ((resize * resize * 2) / this.camera.distance);
			for (const mesh of this.meshes) {
				mesh.scale.set(s, s, s);
			}
		}
		this.camera.verticalAngle = 55;
		this.camera.targetPosition.set(w / 2 + min.x, h / 2 + min.y, d / 2 + min.z);
	}

	update() {
		this.camera.update();
		if (super.update()) {
			this.currentRotation += 0.01;
			for (const mesh of this.meshes) {
				mesh.rotation.y = this.currentRotation;
			}
		}
		return false;
	}

	draw3D(GL: Manager.GL) {
		if (!this.isCut) {
			GL.renderer.setClearAlpha(0);
			super.draw3D(GL);
		}
	}

	draw3DCut(GL: Manager.GL) {
		if (GL.renderer && this.canvas) {
			const { left, bottom, width, height } = this.canvas.getBoundingClientRect();
			const domRect = GL.renderer.domElement.getBoundingClientRect();
			if (this.parentCanvas) {
				const rect = this.parentCanvas.getBoundingClientRect();
				GL.renderer.setScissor(rect.left, domRect.height - rect.bottom + domRect.top, rect.width, rect.height);
			} else {
				GL.renderer.setScissor(left, domRect.height - bottom + domRect.top, width, height);
			}
			GL.renderer.setViewport(left, domRect.height - bottom + domRect.top, width, height);
			GL.renderer.render(this.scene, this.camera.getThreeCamera());
		}
	}
}

export { Previewer3D };
