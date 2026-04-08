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
	AXIS,
	CUSTOM_SHAPE_KIND,
	ELEMENT_MAP_KIND,
	ELEMENT_POSITION_KIND,
	Mathf,
	SHAPE_KIND,
	SPRITE_WALL_TYPE,
} from '../common';
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
	public isRotating: boolean = true;
	public previewMode: ACTION_KIND | null = null;
	public previewGrid: THREE.GridHelper | null = null;
	public previewTransformControls: TransformControls | null = null;
	public onTransformChange: (() => void) | null = null;
	public gltfCloneRef: THREE.Group | null = null;
	public gltfAnimations: THREE.AnimationClip[] = [];
	public previewAnimMixer: THREE.AnimationMixer | null = null;
	public previewTimer: THREE.Timer = new THREE.Timer();
	public previewRotateX: number = 0;
	public previewRotateY: number = 0;
	public previewRotateZ: number = 0;
	public previewScaleX: number = 1;
	public previewScaleY: number = 1;
	public previewScaleZ: number = 1;

	constructor(id: string) {
		super();
		this.id = id;
	}

	initializeSunLight() {
		const ambient = new THREE.AmbientLight(0xffffff, Math.PI - 14 / 9);
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

	async loadMountain(
		mountainID: number,
		topFloorIsAutotile: boolean,
		topFloorTilesetRect: Rectangle,
		topFloorAutotileID: number,
		topFloorAutotileRect: Rectangle,
		wsb: number,
		wpb: number,
		wst: number,
		wpt: number,
		wsl: number,
		wpl: number,
		wsr: number,
		wpr: number,
		hs: number,
		hp: number,
	) {
		const wall = Project.current!.specialElements.getMountainByID(mountainID);
		if (!wall) {
			this.clear();
			return;
		}
		const textureMountain = await MapElement.Mountains.loadMountainTexture(Scene.Map.current, mountainID);
		if (textureMountain) {
			const hpercent = Position3D.getPercentOfPixels(hp);
			const mountainElement = MapElement.Mountain.create(
				mountainID,
				wsb,
				Position3D.getPercentOfPixels(wpb),
				wst,
				Position3D.getPercentOfPixels(wpt),
				wsl,
				Position3D.getPercentOfPixels(wpl),
				wsr,
				Position3D.getPercentOfPixels(wpr),
				hs,
				hpercent,
			);
			let geometry = new CustomGeometry();
			mountainElement.updateGeometry(geometry, new Position(), 0);
			this.addToScene(geometry, textureMountain);
			const floorPosition = new Position(0, hs, hpercent);
			const widthLeft = wsl * Project.SQUARE_SIZE + wpl;
			const widthRight = wsr * Project.SQUARE_SIZE + wpr;
			const widthTop = wst * Project.SQUARE_SIZE + wpt;
			const widthBot = wsb * Project.SQUARE_SIZE + wpb;
			const offset = new THREE.Vector3(
				(widthLeft - widthRight) * (Project.SQUARE_SIZE / 2),
				(floorPosition.getTotalY() / 2) * Project.SQUARE_SIZE,
				(widthTop - widthBot) * (Project.SQUARE_SIZE / 2),
			);
			if (topFloorIsAutotile) {
				const texturesAutotile = await MapElement.Autotiles.loadAutotileTexture(
					Scene.Map.current,
					topFloorAutotileID,
				);
				const autotileModel = Project.current!.specialElements.getAutotileByID(topFloorAutotileID);
				if (texturesAutotile && autotileModel) {
					const pictureID = autotileModel.pictureID;
					let includedTexture: TextureBundle | null = null;
					for (const textureAutotile of texturesAutotile) {
						if (textureAutotile.isInTexture(pictureID, topFloorAutotileRect)) {
							includedTexture = textureAutotile;
							break;
						}
					}
					if (includedTexture !== null) {
						const autotiles = new MapElement.Autotiles(includedTexture);
						autotiles.updateGeometry(
							Scene.Map.current!,
							floorPosition,
							MapElement.Autotile.create(
								topFloorAutotileID,
								MapElement.Autotiles.PREVIEW_TILE,
								topFloorAutotileRect,
							),
						);
						this.addToScene(
							autotiles.meshes[0][0].geometry as CustomGeometry,
							autotiles.bundle.material,
							false,
							offset,
						);
					}
				}
			} else {
				await this.loadMaterial();
				const { width, height } = Manager.GL.getMaterialTextureSize(this.material);
				const floor = MapElement.Floor.create(
					new Rectangle(topFloorTilesetRect.x, topFloorTilesetRect.y, 1, 1),
				);
				geometry = new CustomGeometry();
				floor.updateGeometry(Scene.Map.current!, geometry, floorPosition, width, height, 0);
				this.addToScene(geometry, this.material, false, offset);
			}
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
		if (object.shapeKind === SHAPE_KIND.CUSTOM && object.gltfID !== -1 && object.pictureID === -1) {
			const shape = Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.GLTF, object.gltfID);
			if (!shape) {
				this.clear();
				return;
			}
			if (!shape.isShapeLoaded()) {
				await shape.loadShape();
			}
			if (shape.gltfScene) {
				this.addGltfScene(shape.gltfScene, object.scale, shape.gltfAnimations);
				return;
			}
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
		if (!shape.geometryData) {
			await shape.loadShape();
		}
		// GLTF shapes: use embedded materials for preview
		if (shape.kind === CUSTOM_SHAPE_KIND.GLTF && shape.gltfScene) {
			this.addGltfScene(shape.gltfScene, 1, shape.gltfAnimations);
			return;
		}
		const texture = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
		const geometry = new CustomGeometry();
		const object = new Model.Object3D();
		object.shapeKind = SHAPE_KIND.CUSTOM;
		object.scale = 1;
		const object3DElement = MapElement.Object3D.create(object) as MapElement.Object3DCustom;
		object3DElement.shape = shape;
		object3DElement.updateGeometry(geometry, new Position(), 0);
		this.addToScene(geometry, texture);
	}

	addGltfScene(gltfScene: THREE.Group, scale: number, animations: THREE.AnimationClip[] = []) {
		this.clear();
		this.gltfAnimations = animations;
		const clone = gltfScene.clone(true);
		const resize = Project.SQUARE_SIZE;
		let s = resize * scale;
		clone.scale.set(s, s, s);
		clone.rotation.y = this.currentRotation;
		const box = new THREE.Box3().setFromObject(clone);
		const center = box.getCenter(new THREE.Vector3());
		clone.position.sub(center);
		this.gltfCloneRef = clone;
		const wrapper = new THREE.Group();
		wrapper.add(clone);
		this.scene.add(wrapper);
		this.meshes.push(wrapper as unknown as THREE.Mesh);
		const size = box.getSize(new THREE.Vector3());
		this.camera.distance = Math.max(size.x, size.y, size.z) + (size.x + size.y + size.z) / 3;
		if (this.isCut) {
			s = resize * ((resize * resize * 2) / this.camera.distance);
			clone.scale.set(s, s, s);
			const cutBox = new THREE.Box3().setFromObject(clone);
			const cutCenter = cutBox.getCenter(new THREE.Vector3());
			clone.position.set(0, 0, 0);
			clone.position.sub(cutCenter);
		}
		this.camera.verticalAngle = 55;
		this.camera.targetPosition.set(0, 0, 0);
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
				const s = Project.SQUARE_SIZE;
				mesh.geometry.translate(position.x / s, position.y / s, position.z / s);
				mesh.geometry.computeBoundingBox();
			}
			this.meshes.push(mesh);
			this.scene.add(mesh);
			this.updateCamera();
		}
	}

	playGltfAnimation(index: number, onFinished: () => void) {
		if (!this.gltfCloneRef || index < 0 || index >= this.gltfAnimations.length) {
			return;
		}
		if (this.previewAnimMixer) {
			this.previewAnimMixer.stopAllAction();
		}
		this.previewAnimMixer = new THREE.AnimationMixer(this.gltfCloneRef);
		this.previewAnimMixer.addEventListener('finished', () => {
			onFinished();
		});
		this.previewTimer.reset();
		const action = this.previewAnimMixer.clipAction(this.gltfAnimations[index]);
		action.setLoop(THREE.LoopOnce, 1);
		action.clampWhenFinished = true;
		action.play();
	}

	clear() {
		if (this.previewAnimMixer) {
			this.previewAnimMixer.stopAllAction();
			this.previewAnimMixer = null;
		}
		this.gltfCloneRef = null;
		this.gltfAnimations = [];
		if (this.previewTransformControls) {
			this.previewTransformControls.detach();
			this.scene.remove(this.previewTransformControls.getHelper());
			this.previewTransformControls.dispose();
			this.previewTransformControls = null;
		}
		if (this.previewGrid) {
			this.scene.remove(this.previewGrid);
			this.previewGrid = null;
		}
		this.previewMode = null;
		this.isRotating = true;
		for (const mesh of this.meshes) {
			this.scene.remove(mesh);
			if (mesh instanceof THREE.Mesh) {
				mesh.geometry?.dispose();
			}
		}
		this.meshes = [];
	}

	close() {
		this.clear();
		super.close();
	}

	setPreviewMode(mode: ACTION_KIND | null) {
		this.previewMode = mode;
		if (this.previewTransformControls) {
			this.previewTransformControls.detach();
			this.scene.remove(this.previewTransformControls.getHelper());
			this.previewTransformControls.dispose();
			this.previewTransformControls = null;
		}
		if (this.previewGrid) {
			this.scene.remove(this.previewGrid);
			this.previewGrid = null;
		}
		if (mode === ACTION_KIND.ROTATE || mode === ACTION_KIND.SCALE) {
			this.isRotating = false;
			if (mode === ACTION_KIND.ROTATE) {
				for (const mesh of this.meshes) {
					mesh.rotation.set(0, 0, 0);
				}
			}
			if (this.meshes.length > 0) {
				const box = new THREE.Box3();
				for (const mesh of this.meshes) {
					box.expandByObject(mesh);
				}
				const size = box.getSize(new THREE.Vector3());
				const gridSize = Math.max(size.x, size.z, Project.SQUARE_SIZE) * 2;
				this.previewGrid = new THREE.GridHelper(gridSize, 10, 0x888888, 0x444444);
				const center = box.getCenter(new THREE.Vector3());
				this.previewGrid.position.set(center.x, box.min.y, center.z);
				this.scene.add(this.previewGrid);
				if (this.canvas) {
					this.previewTransformControls = new TransformControls(this.camera.getThreeCamera(), this.canvas);
					this.previewTransformControls.setMode(mode === ACTION_KIND.ROTATE ? 'rotate' : 'scale');
					this.previewTransformControls.attach(this.meshes[0]);
					this.previewTransformControls.setSize(2);
					const isSquare =
						Project.current?.settings.mapEditorCurrentElementPositionIndex === ELEMENT_POSITION_KIND.SQUARE;
					if (mode === ACTION_KIND.ROTATE) {
						this.previewTransformControls.setRotationSnap(isSquare ? Mathf.degreesToRadians(45) : null);
					}
					this.previewTransformControls.addEventListener('objectChange', () => {
						if (
							this.previewMode === ACTION_KIND.SCALE &&
							this.meshes.length > 0 &&
							Project.current?.settings.mapEditorCurrentElementPositionIndex ===
								ELEMENT_POSITION_KIND.SQUARE
						) {
							const mesh = this.meshes[0];
							const s = Project.SQUARE_SIZE;
							mesh.scale.setX(Math.max(s, mesh.scale.x - (mesh.scale.x % s)));
							mesh.scale.setY(Math.max(s, mesh.scale.y - (mesh.scale.y % s)));
							mesh.scale.setZ(Math.max(s, mesh.scale.z - (mesh.scale.z % s)));
						}
						this.syncPreviewTransform();
						this.onTransformChange?.();
					});
					this.scene.add(this.previewTransformControls.getHelper());
				}
			}
		} else {
			this.isRotating = true;
			this.camera.horizontalAngle = -90;
			for (const mesh of this.meshes) {
				mesh.rotation.set(0, this.currentRotation, 0);
				mesh.scale.set(Project.SQUARE_SIZE, Project.SQUARE_SIZE, Project.SQUARE_SIZE);
			}
		}
		this.syncPreviewTransform();
	}

	getPreviewTransformValues(): { x: number; y: number; z: number } {
		if (this.meshes.length === 0) {
			return { x: 0, y: 0, z: 0 };
		}
		const mesh = this.meshes[0];
		if (this.previewMode === ACTION_KIND.ROTATE) {
			const toDeg = (r: number) => (r * 180) / Math.PI;
			return { x: toDeg(mesh.rotation.x), y: toDeg(mesh.rotation.y), z: toDeg(mesh.rotation.z) };
		} else if (this.previewMode === ACTION_KIND.SCALE) {
			const base = Project.SQUARE_SIZE;
			return { x: mesh.scale.x / base, y: mesh.scale.y / base, z: mesh.scale.z / base };
		}
		return { x: 0, y: 0, z: 0 };
	}

	setPreviewTransformValue(axis: AXIS, value: number) {
		if (this.meshes.length === 0) {
			return;
		}
		const mesh = this.meshes[0];
		if (this.previewMode === ACTION_KIND.ROTATE) {
			mesh.rotation[axis as AXIS] = (value * Math.PI) / 180;
		} else if (this.previewMode === ACTION_KIND.SCALE) {
			mesh.scale[axis as AXIS] = value * Project.SQUARE_SIZE;
		}
		this.syncPreviewTransform();
		this.onTransformChange?.();
	}

	syncPreviewTransform() {
		if (this.previewMode === ACTION_KIND.ROTATE && this.meshes.length > 0) {
			const mesh = this.meshes[0];
			const toDeg = (r: number) => (r * 180) / Math.PI;
			this.previewRotateX = toDeg(mesh.rotation.x);
			this.previewRotateY = toDeg(mesh.rotation.y);
			this.previewRotateZ = toDeg(mesh.rotation.z);
		} else if (this.previewMode === ACTION_KIND.SCALE && this.meshes.length > 0) {
			const mesh = this.meshes[0];
			const base = Project.SQUARE_SIZE;
			this.previewScaleX = mesh.scale.x / base;
			this.previewScaleY = mesh.scale.y / base;
			this.previewScaleZ = mesh.scale.z / base;
		} else {
			this.previewRotateX = 0;
			this.previewRotateY = 0;
			this.previewRotateZ = 0;
			this.previewScaleX = 1;
			this.previewScaleY = 1;
			this.previewScaleZ = 1;
		}
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
		if (this.previewAnimMixer) {
			this.previewTimer.update();
			this.previewAnimMixer.update(this.previewTimer.getDelta());
		}
		if (super.update()) {
			if (this.isRotating) {
				this.currentRotation += 0.01;
				for (const mesh of this.meshes) {
					mesh.rotation.y = this.currentRotation;
				}
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
