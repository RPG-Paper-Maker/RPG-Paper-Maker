/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { CUSTOM_SHAPE_KIND, ELEMENT_MAP_KIND, MAP_OBJECT_LIGHT_KIND, PICTURE_KIND, SHAPE_KIND } from '../../common';
import { Manager, MapElement, Model } from '../../Editor';
import { getMapObjectLightIntensity } from '../../models/MapObjectLight';
import type { Map as SceneMap } from '../../scenes/Map';
import { CustomGeometry } from '../CustomGeometry';
import { CustomGeometryFace } from '../CustomGeometryFace';
import { Position } from '../Position';
import { Project } from '../Project';
import { Rectangle } from '../Rectangle';

export enum SIM_ORIENTATION {
	SOUTH,
	WEST,
	NORTH,
	EAST,
}

export const SIM_ORIENTATION_VECTORS: ReadonlyArray<THREE.Vector3> = [
	new THREE.Vector3(0, 0, 1),
	new THREE.Vector3(-1, 0, 0),
	new THREE.Vector3(0, 0, -1),
	new THREE.Vector3(1, 0, 0),
];

class SimulationObject {
	public mesh: THREE.Object3D | null = null;
	public worldPosition: THREE.Vector3;
	public orientation!: SIM_ORIENTATION;
	public frame = 0;
	public moving = false;
	public speedValue = 1;
	public moveAnimation!: boolean;
	public stopAnimation!: boolean;
	public directionFix!: boolean;
	public climbAnimation!: boolean;
	public through!: boolean;
	public setWithCamera!: boolean;
	public pixelOffset!: boolean;
	public keepPosition!: boolean;
	public frequencyValue = 0;
	public moveFrequencyTick = 0;
	public state!: Model.MapObjectState;

	private meshIsFace = false;
	private frameTick = 0;
	private baseRow!: number;
	private basePosition: Position;
	private baseVector: THREE.Vector3;
	private lastBuildKey = '';
	private pendingTextureKey: string | null = null;
	private disposed = false;
	private previewMaterial: THREE.Material | null = null;
	private previewMaterialSource: THREE.Material | null = null;
	private previewFrameBounds = new THREE.Vector4(0, 0, 1, 1);
	private gltfAnimationMixer: THREE.AnimationMixer | null = null;
	private gltfAnimationElapsedTime = 0;
	private lights: { light: THREE.Light; settings: Model.MapObjectLight }[] = [];
	private standaloneLights: THREE.Group | null = null;
	private standaloneLightsBasePosition: THREE.Vector3 | null = null;
	private lightsStartTime = performance.now();

	private static outlineFragment: string | null = null;

	constructor(
		private map: SceneMap,
		public object: Model.CommonObject,
		stateID: number,
		position: Position,
		private opacity = 1,
		private previewOutline = false,
		private render = true,
	) {
		this.basePosition = position.clone();
		this.baseVector = position.toVector3(false);
		this.worldPosition = this.baseVector.clone();
		let state = object.states.find((s) => s.id === stateID) ?? object.states[0];
		if (!state) {
			state = new Model.MapObjectState();
			state.applyDefault();
		}
		this.applyState(state);
	}

	applyState(state: Model.MapObjectState, preserveLightAnimation = false) {
		const isSameGltf =
			this.state?.graphicsKind === ELEMENT_MAP_KIND.OBJECT3D &&
			state.graphicsKind === ELEMENT_MAP_KIND.OBJECT3D &&
			this.state.graphicsID === state.graphicsID;
		if (!isSameGltf) {
			this.gltfAnimationElapsedTime = 0;
		}
		this.state = state.clone();
		this.baseRow = this.state.graphicsIndexY - (this.state.graphicsIndexY % 4);
		this.orientation = (this.state.graphicsIndexY % 4) as SIM_ORIENTATION;
		this.frame = this.state.graphicsIndexX % Project.current!.systems.FRAMES;
		this.frameTick = 0;
		if (!preserveLightAnimation) {
			this.lightsStartTime = performance.now();
		}
		this.moveAnimation = this.state.moveAnimation;
		this.stopAnimation = this.state.stopAnimation;
		this.directionFix = this.state.directionFix;
		this.climbAnimation = this.state.climbAnimation;
		this.through = this.state.through;
		this.setWithCamera = this.state.setWithCamera;
		this.pixelOffset = this.state.pixelOffset;
		this.keepPosition = this.state.keepPosition;
		const speed = Model.Base.getByID(Project.current!.systems.speeds, this.state.speedID) as Model.Speed | null;
		this.speedValue = speed ? speed.value.getFixNumberValue() : 1;
		const frequency = Model.Base.getByID(
			Project.current!.systems.frequencies,
			this.state.frequencyID,
		) as Model.Frequency | null;
		this.frequencyValue = frequency ? frequency.value.getFixNumberValue() : 0;
		this.moveFrequencyTick = 0;
		this.lastBuildKey = '';
		this.build();
		this.updateMeshOffset();
	}

	updateGraphics(kind: ELEMENT_MAP_KIND, id: number, indexX: number, indexY: number, changeOrientation: boolean) {
		this.state.graphicsKind = kind;
		this.state.graphicsID = id;
		this.state.graphicsIndexX = indexX;
		this.state.graphicsIndexY = changeOrientation ? indexY : this.orientation;
		this.baseRow = this.state.graphicsIndexY - (this.state.graphicsIndexY % 4);
		if (changeOrientation) {
			this.orientation = (indexY % 4) as SIM_ORIENTATION;
		}
		this.build();
	}

	refreshLights() {
		this.lightsStartTime = performance.now();
		this.lastBuildKey = '';
		this.build();
	}

	show() {
		if (this.render) {
			return;
		}
		this.render = true;
		this.lastBuildKey = '';
		this.build();
	}

	setOrientation(orientation: SIM_ORIENTATION) {
		if (this.directionFix || this.orientation === orientation) {
			return;
		}
		this.orientation = orientation;
		this.build();
	}

	setWorldPosition(vector: THREE.Vector3) {
		this.worldPosition.copy(vector);
		this.updateMeshOffset();
	}

	jump(
		start: THREE.Vector3,
		end: THREE.Vector3,
		peak: number,
		currentTime: number,
		finalTime: number,
		elapsedTime: number,
	): number {
		const a = -(peak - start.y) / ((finalTime / 2) * (finalTime / 2));
		let coef = 1;
		if (start.y !== end.y) {
			const tEnd = Math.sqrt((end.y - peak) / a);
			const reduce = finalTime / 2 - tEnd;
			coef = (finalTime - reduce) / finalTime;
		}
		currentTime = Math.min(currentTime + elapsedTime, finalTime);
		const t = currentTime * coef - finalTime / 2;
		const y = a * (t * t) + peak;
		const x = (currentTime / finalTime) * (end.x - start.x) + start.x;
		const z = (currentTime / finalTime) * (end.z - start.z) + start.z;
		this.setWorldPosition(new THREE.Vector3(x, y, z));
		const dx = end.x - start.x;
		const dz = end.z - start.z;
		if (dx !== 0) {
			this.setOrientation(dx > 0 ? SIM_ORIENTATION.EAST : SIM_ORIENTATION.WEST);
		} else if (dz !== 0) {
			this.setOrientation(dz > 0 ? SIM_ORIENTATION.SOUTH : SIM_ORIENTATION.NORTH);
		}
		this.moving = true;
		return currentTime;
	}

	getCurrentColumn(): number {
		const frames = Project.current!.systems.FRAMES;
		if ((this.moving && this.moveAnimation) || (!this.moving && this.stopAnimation)) {
			return this.frame % frames;
		}
		return this.state.graphicsIndexX % frames;
	}

	getCurrentRow(): number {
		const orientation = this.setWithCamera
			? (this.orientation - this.map.camera.getMapOrientation() + 6) % 4
			: this.orientation;
		let row = this.baseRow + orientation;
		if (!this.moving && this.stopAnimation) {
			const picture = Project.current!.pictures.getByID(PICTURE_KIND.CHARACTERS, this.state.graphicsID);
			if (picture?.isStopAnimation) {
				row += 4;
			}
		}
		return row;
	}

	build() {
		if (this.disposed || !this.render) {
			return;
		}
		const objectData =
			this.state.graphicsKind === ELEMENT_MAP_KIND.OBJECT3D
				? Project.current!.specialElements.getObject3DByID(this.state.graphicsID)
				: null;
		const isGltf =
			objectData?.shapeKind === SHAPE_KIND.CUSTOM && objectData.gltfID !== -1 && objectData.pictureID === -1;
		const rect = this.state.rectTileset;
		const buildKey = isGltf
			? `${this.state.graphicsKind}-${this.state.graphicsID}`
			: `${this.state.graphicsKind}-${this.state.graphicsID}-${this.getCurrentColumn()}-${this.getCurrentRow()}-${rect?.x}-${rect?.y}-${rect?.width}-${rect?.height}-${this.state.layer.getFixNumberValue()}`;
		if (this.mesh !== null && buildKey === this.lastBuildKey) {
			return;
		}
		this.lastBuildKey = buildKey;
		this.removeMesh();
		const state = this.state;
		const hasPointLight = state.lights?.some(
			(light) => light.kind.getFixNumberValue() === MAP_OBJECT_LIGHT_KIND.POINT,
		);
		let mesh: THREE.Mesh | null = null;
		switch (state.graphicsKind) {
			case ELEMENT_MAP_KIND.AUTOTILE: {
				const autotile = Project.current!.specialElements.getAutotileByID(state.graphicsID);
				const bundles = MapElement.Autotiles.getAutotileTexture(this.map, state.graphicsID);
				const bundle = bundles?.find((entry) =>
					entry.isInTexture(autotile?.pictureID ?? -1, state.rectTileset),
				);
				if (!autotile || !bundle) {
					this.ensureAutotileTexture(state.graphicsID);
					return;
				}
				const position = this.basePosition.clone();
				position.layer += state.layer.getFixNumberValue() - 1;
				position.centerX = state.centerX.getFixNumberValue();
				position.centerZ = state.centerZ.getFixNumberValue();
				position.angleX = state.angleX.getFixNumberValue();
				position.angleY = state.angleY.getFixNumberValue();
				position.angleZ = state.angleZ.getFixNumberValue();
				position.scaleX = state.scaleX.getFixNumberValue();
				position.scaleY = state.scaleY.getFixNumberValue();
				position.scaleZ = state.scaleZ.getFixNumberValue();
				const geometryAutotile = new CustomGeometry();
				const autotileElement = MapElement.Autotile.create(
					state.graphicsID,
					this.getObjectAutotileTileID(this.basePosition),
					state.rectTileset ?? new Rectangle(),
				);
				const { width, height } = Manager.GL.getMaterialTextureSize(bundle.material);
				autotileElement.updateGeometryAutotile(this.map, geometryAutotile, bundle, position, width, height, 0);
				geometryAutotile.updateAttributes();
				mesh = new THREE.Mesh(geometryAutotile, this.applyPreviewEffect(bundle.material!));
				this.meshIsFace = false;
				break;
			}
			case ELEMENT_MAP_KIND.FLOOR: {
				const material = this.map.materialTileset;
				if (!material) {
					return;
				}
				const position = this.basePosition.clone();
				position.layer += state.layer.getFixNumberValue() - 1;
				position.centerX = state.centerX.getFixNumberValue();
				position.centerZ = state.centerZ.getFixNumberValue();
				position.angleX = state.angleX.getFixNumberValue();
				position.angleY = state.angleY.getFixNumberValue();
				position.angleZ = state.angleZ.getFixNumberValue();
				position.scaleX = state.scaleX.getFixNumberValue();
				position.scaleY = state.scaleY.getFixNumberValue();
				position.scaleZ = state.scaleZ.getFixNumberValue();
				const geometryFloor = new CustomGeometry();
				const floor = MapElement.Floor.create(state.rectTileset ?? new Rectangle());
				const { width, height } = Manager.GL.getMaterialTextureSize(material);
				floor.updateGeometry(this.map, geometryFloor, position, width, height, 0);
				geometryFloor.updateAttributes();
				mesh = new THREE.Mesh(geometryFloor, this.applyPreviewEffect(material));
				this.meshIsFace = false;
				break;
			}
			case ELEMENT_MAP_KIND.SPRITE_FIX:
			case ELEMENT_MAP_KIND.SPRITE_FACE: {
				const material =
					state.graphicsID === 0 ? this.map.materialTileset : this.map.texturesCharacters[state.graphicsID];
				if (!material) {
					this.ensureCharacterTexture(state.graphicsID);
					return;
				}
				const { width, height } = Manager.GL.getMaterialTextureSize(material);
				const characterRect = new Rectangle();
				if (state.graphicsID !== 0) {
					const picture = Project.current!.pictures.getByID(PICTURE_KIND.CHARACTERS, state.graphicsID);
					if (picture) {
						const rows = picture.getRows();
						const squareWidth = width / Project.SQUARE_SIZE / Project.current!.systems.FRAMES;
						const squareHeight = height / Project.SQUARE_SIZE / rows;
						characterRect.x = this.getCurrentColumn() * squareWidth;
						characterRect.y = this.getCurrentRow() * squareHeight;
						characterRect.width = squareWidth;
						characterRect.height = squareHeight;
						const frames = Project.current!.systems.FRAMES;
						this.previewFrameBounds.set(
							this.getCurrentColumn() / frames,
							this.getCurrentRow() / rows,
							(this.getCurrentColumn() + 1) / frames,
							(this.getCurrentRow() + 1) / rows,
						);
					}
				}
				const position = this.basePosition.clone();
				position.centerX = state.centerX.getFixNumberValue();
				position.centerZ = state.centerZ.getFixNumberValue();
				position.angleX = state.angleX.getFixNumberValue();
				position.angleY = state.angleY.getFixNumberValue();
				position.angleZ = state.angleZ.getFixNumberValue();
				position.scaleX = state.scaleX.getFixNumberValue();
				position.scaleY = state.scaleY.getFixNumberValue();
				position.scaleZ = state.scaleZ.getFixNumberValue();
				const sprite = MapElement.Sprite.create(
					state.graphicsKind,
					state.graphicsID === 0 ? (state.rectTileset ?? new Rectangle()) : characterRect,
				);
				const geometrySprite =
					state.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FIX
						? new CustomGeometry()
						: new CustomGeometryFace();
				const localPosition = position.toVector3();
				sprite.updateGeometry(this.map, geometrySprite, width, height, position, 0, false, localPosition);
				geometrySprite.updateAttributes();
				mesh = new THREE.Mesh(geometrySprite, this.applyPreviewEffect(material));
				mesh.customDepthMaterial = material.userData.customDepthMaterial;
				this.meshIsFace = state.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FACE;
				break;
			}
			case ELEMENT_MAP_KIND.OBJECT3D: {
				if (isGltf && objectData) {
					const shape = Project.current!.shapes.getByID(CUSTOM_SHAPE_KIND.GLTF, objectData.gltfID);
					if (!shape?.gltfScene) {
						this.ensureObject3DTexture(state.graphicsID);
						return;
					}
					const clone = shape.gltfScene.clone(true);
					const scale = objectData.scale;
					clone.scale.set(
						scale * this.basePosition.scaleX,
						scale * this.basePosition.scaleY,
						scale * this.basePosition.scaleZ,
					);
					clone.position.copy(MapElement.Object3D.create(objectData).getLocalPosition(this.basePosition));
					clone.rotation.set(
						(this.basePosition.angleX * Math.PI) / 180,
						(this.basePosition.angleY * Math.PI) / 180,
						(this.basePosition.angleZ * Math.PI) / 180,
					);
					clone.traverse((child) => {
						if (child instanceof THREE.Mesh) {
							const materials = Array.isArray(child.material) ? child.material : [child.material];
							for (const material of materials) {
								Manager.GL.applyScreenTone(material);
							}
							child.receiveShadow = true;
							child.castShadow = !hasPointLight;
						}
					});
					const group = new THREE.Group();
					group.add(clone);
					const stopAnimation = objectData.stopAnimationIndex;
					if (stopAnimation >= 0 && stopAnimation < shape.gltfAnimations.length) {
						this.gltfAnimationMixer = new THREE.AnimationMixer(clone);
						const action = this.gltfAnimationMixer.clipAction(shape.gltfAnimations[stopAnimation]);
						action.setLoop(THREE.LoopRepeat, Infinity);
						action.play();
						const duration = shape.gltfAnimations[stopAnimation].duration;
						action.time = duration > 0 ? this.gltfAnimationElapsedTime % duration : 0;
					}
					mesh = group as unknown as THREE.Mesh;
					this.meshIsFace = false;
					break;
				}
				const material = MapElement.Object3D.getObject3DTexture(this.map, state.graphicsID);
				if (material) {
					const geometryObject3D = new CustomGeometry();
					const object3D = MapElement.Object3D.create(
						Project.current!.specialElements.getObject3DByID(state.graphicsID),
					);
					object3D.updateGeometry(geometryObject3D, this.basePosition, 0);
					geometryObject3D.updateAttributes();
					mesh = new THREE.Mesh(geometryObject3D, this.applyPreviewEffect(material));
					this.meshIsFace = false;
				} else {
					this.ensureObject3DTexture(state.graphicsID);
					return;
				}
				break;
			}
			default:
				break;
		}
		if (mesh) {
			mesh.receiveShadow = true;
			mesh.castShadow = !hasPointLight;
			mesh.renderOrder = 4;
			this.map.scene.add(mesh);
			this.mesh = mesh;
			this.addLights(mesh);
			mesh.onBeforeRender = () => this.updateLights();
			this.updateMeshOffset();
		} else {
			this.addLights();
			this.updateMeshOffset();
		}
	}

	private addLights(parent?: THREE.Object3D) {
		if (!this.state.lights?.length) {
			return;
		}
		const lights = new THREE.Group();
		const position = this.basePosition.clone();
		position.centerX = this.state.centerX.getFixNumberValue();
		position.centerZ = this.state.centerZ.getFixNumberValue();
		lights.position.copy(position.toVector3());
		lights.rotation.set(
			THREE.MathUtils.degToRad(this.state.angleX.getFixNumberValue()),
			THREE.MathUtils.degToRad(this.state.angleY.getFixNumberValue()),
			THREE.MathUtils.degToRad(this.state.angleZ.getFixNumberValue()),
		);
		lights.scale.set(
			this.state.scaleX.getFixNumberValue(),
			this.state.scaleY.getFixNumberValue(),
			this.state.scaleZ.getFixNumberValue(),
		);
		if (parent) {
			parent.add(lights);
		} else {
			this.map.scene.add(lights);
			this.standaloneLights = lights;
			this.standaloneLightsBasePosition = lights.position.clone();
		}
		for (const settings of this.state.lights ?? []) {
			let light: THREE.Light;
			let lightParent: THREE.Object3D = lights;
			switch (settings.kind.getFixNumberValue()) {
				case 1: {
					const spotParent = new THREE.Group();
					spotParent.rotation.y = THREE.MathUtils.degToRad(
						settings.followOrientation.getFixNumberValue() === 1 ? [0, 270, 180, 90][this.orientation] : 0,
					);
					lights.add(spotParent);
					const spot = new THREE.SpotLight(
						settings.color.value as string,
						settings.intensity.getFixNumberValue(),
						settings.distance.getFixNumberValue(),
						THREE.MathUtils.degToRad(settings.angle.getFixNumberValue()),
						settings.penumbra.getFixNumberValue(),
					);
					spot.target.position.set(
						settings.targetX.getFixNumberValue() / Project.SQUARE_SIZE,
						settings.targetY.getFixNumberValue() / Project.SQUARE_SIZE,
						settings.targetZ.getFixNumberValue() / Project.SQUARE_SIZE,
					);
					spotParent.add(spot.target);
					light = spot;
					lightParent = spotParent;
					break;
				}
				case 2: {
					const directional = new THREE.DirectionalLight(
						settings.color.value as string,
						settings.intensity.getFixNumberValue(),
					);
					directional.target.position.set(0, 0, -1);
					(parent ?? lights).add(directional.target);
					light = directional;
					break;
				}
				case 3:
					light = new THREE.HemisphereLight(
						settings.color.value as string,
						settings.groundColor.value as string,
						settings.intensity.getFixNumberValue(),
					);
					break;
				default: {
					light = new THREE.PointLight(
						settings.color.value as string,
						settings.intensity.getFixNumberValue(),
						settings.distance.getFixNumberValue(),
					);
					if (settings.followOrientation.getFixNumberValue() === 1) {
						const pointParent = new THREE.Group();
						pointParent.rotation.y = THREE.MathUtils.degToRad([0, 270, 180, 90][this.orientation]);
						lights.add(pointParent);
						lightParent = pointParent;
					}
					break;
				}
			}
			if (
				light instanceof THREE.PointLight ||
				light instanceof THREE.SpotLight ||
				light instanceof THREE.DirectionalLight
			) {
				light.castShadow = true;
				if (light instanceof THREE.PointLight) {
					light.shadow.mapSize.set(256, 256);
					light.shadow.autoUpdate = false;
					light.shadow.needsUpdate = true;
				}
				if (light instanceof THREE.PointLight || light instanceof THREE.SpotLight) {
					light.shadow.camera.near = 0.01;
					light.shadow.camera.updateProjectionMatrix();
					light.shadow.bias = -0.0003;
					light.shadow.normalBias = 0.1 / Project.SQUARE_SIZE;
				}
			}
			light.position.set(
				settings.x.getFixNumberValue() / Project.SQUARE_SIZE,
				settings.y.getFixNumberValue() / Project.SQUARE_SIZE,
				settings.z.getFixNumberValue() / Project.SQUARE_SIZE,
			);
			lightParent.add(light);
			this.lights.push({ light, settings });
			light.intensity = getMapObjectLightIntensity(settings, performance.now() - this.lightsStartTime);
		}
	}

	private getObjectAutotileTileID(position: Position) {
		const state = this.state;
		const sameAutotileAt = (x: number, z: number) => {
			const neighbor = position.clone();
			neighbor.x = x;
			neighbor.z = z;
			const object = this.map.getMapPortionByPosition(neighbor)?.model.objects.get(neighbor.toKey());
			const other = object?.getFirstState();
			return (
				other?.graphicsKind === ELEMENT_MAP_KIND.AUTOTILE &&
				other.graphicsID === state.graphicsID &&
				other.layer.getFixNumberValue() === state.layer.getFixNumberValue() &&
				other.rectTileset?.x === state.rectTileset?.x &&
				other.rectTileset?.y === state.rectTileset?.y
			);
		};
		const left = sameAutotileAt(position.x - 1, position.z);
		const right = sameAutotileAt(position.x + 1, position.z);
		const top = sameAutotileAt(position.x, position.z - 1);
		const bottom = sameAutotileAt(position.x, position.z + 1);
		const topLeft = sameAutotileAt(position.x - 1, position.z - 1);
		const topRight = sameAutotileAt(position.x + 1, position.z - 1);
		const bottomLeft = sameAutotileAt(position.x - 1, position.z + 1);
		const bottomRight = sameAutotileAt(position.x + 1, position.z + 1);
		const corner = (horizontal: boolean, vertical: boolean, diagonal: boolean) =>
			!horizontal && !vertical ? 1 : !vertical ? 3 : !horizontal ? 4 : diagonal ? 2 : 0;
		return (
			corner(left, top, topLeft) * 128 +
			corner(right, top, topRight) * 25 +
			corner(left, bottom, bottomLeft) * 5 +
			corner(right, bottom, bottomRight)
		);
	}

	private ensureCharacterTexture(id: number) {
		if (id === 0) {
			return;
		}
		const key = `character-${id}`;
		if (this.pendingTextureKey === key) {
			return;
		}
		this.pendingTextureKey = key;
		void MapElement.Sprite.loadCharacterTexture(this.map, id).then(() => {
			if (this.pendingTextureKey !== key) {
				return;
			}
			this.pendingTextureKey = null;
			if (this.disposed) {
				return;
			}
			this.lastBuildKey = '';
			this.build();
		});
	}

	private ensureObject3DTexture(id: number) {
		const key = `object3d-${id}`;
		if (this.pendingTextureKey === key) {
			return;
		}
		this.pendingTextureKey = key;
		void Promise.all([
			MapElement.Object3D.loadObject3DTexture(this.map, id),
			MapElement.Object3D.loadShapeOBJ(id),
		]).then(() => {
			if (this.pendingTextureKey !== key) {
				return;
			}
			this.pendingTextureKey = null;
			if (this.disposed) {
				return;
			}
			this.lastBuildKey = '';
			this.build();
		});
	}

	private ensureAutotileTexture(id: number) {
		const key = `autotile-${id}`;
		if (this.pendingTextureKey === key) {
			return;
		}
		this.pendingTextureKey = key;
		void MapElement.Autotiles.loadAutotileTexture(this.map, id).then(() => {
			if (this.pendingTextureKey !== key) {
				return;
			}
			this.pendingTextureKey = null;
			if (this.disposed) {
				return;
			}
			this.lastBuildKey = '';
			this.build();
		});
	}

	update(elapsedTime: number, faceAngle: number) {
		if (!this.render) {
			return;
		}
		this.updateLights();
		this.gltfAnimationMixer?.update(elapsedTime / 1000);
		this.gltfAnimationElapsedTime += elapsedTime / 1000;
		if (this.moveFrequencyTick > 0) {
			this.moveFrequencyTick = Math.max(0, this.moveFrequencyTick - elapsedTime);
		}
		if ((this.moving && this.moveAnimation) || (!this.moving && this.stopAnimation)) {
			this.frameTick += elapsedTime;
			const frameDuration = Project.current!.systems.mapFrameDuration.getFixNumberValue() / this.speedValue;
			if (this.frameTick >= frameDuration) {
				this.frame = (this.frame + 1) % Project.current!.systems.FRAMES;
				this.frameTick = 0;
				this.build();
			}
		} else if (this.frameTick !== 0 || (this.frame !== 0 && !this.moving)) {
			this.frame = 0;
			this.frameTick = 0;
			this.build();
		}
		if (this.setWithCamera) {
			this.build();
		}
		if (this.meshIsFace && this.mesh instanceof THREE.Mesh) {
			(this.mesh.geometry as CustomGeometryFace).rotate(faceAngle, MapElement.Base.Y_AXIS);
		}
	}

	private updateLights() {
		const lightsElapsedTime = performance.now() - this.lightsStartTime;
		for (const { light, settings } of this.lights) {
			light.intensity = getMapObjectLightIntensity(settings, lightsElapsedTime);
		}
	}

	private applyPreviewEffect(source: THREE.Material): THREE.Material {
		if (!this.previewOutline && this.opacity >= 1) {
			return source;
		}
		if (this.previewMaterialSource !== source) {
			this.disposePreviewMaterial();
			const src = source as THREE.MeshPhongMaterial;
			const material = src.clone();
			material.transparent = true;
			material.opacity = this.opacity;
			material.depthWrite = false;
			material.userData = { ...src.userData };
			const uniforms = (src.userData.uniforms ?? {}) as Record<string, THREE.IUniform<unknown>>;
			const { width, height } = Manager.GL.getMaterialTextureSize(src);
			const border = 1;
			const outlineStep = new THREE.Vector2(width > 0 ? border / width : 0, height > 0 ? border / height : 0);
			material.onBeforeCompile = (shader) => {
				shader.vertexShader = Manager.GL.SHADER_DEFAULT_VERTEX;
				shader.fragmentShader = this.previewOutline
					? SimulationObject.getOutlineFragment()
					: Manager.GL.SHADER_DEFAULT_FRAGMENT;
				shader.uniforms.colorD = uniforms.colorD ?? { value: Manager.GL.screenTone };
				shader.uniforms.offset = uniforms.offset ?? { value: new THREE.Vector2() };
				shader.uniforms.repeat = { value: (uniforms.repeat?.value as number) ?? 1 };
				shader.uniforms.enableShadows = { value: (uniforms.enableShadows?.value as boolean) ?? true };
				shader.uniforms.hovered = { value: false };
				shader.uniforms.reverseH = { value: false };
				shader.uniforms.alpha_threshold = { value: 0.01 };
				shader.uniforms.outlineStep = { value: outlineStep };
				shader.uniforms.frameBounds = { value: this.previewFrameBounds };
				material.customProgramCacheKey = () => (this.previewOutline ? 'preview-outline' : 'preview-opacity');
			};
			material.customProgramCacheKey = () => (this.previewOutline ? 'preview-outline' : 'preview-opacity');
			material.needsUpdate = true;
			this.previewMaterial = material;
			this.previewMaterialSource = source;
		}
		return this.previewMaterial!;
	}

	private static getOutlineFragment(): string {
		if (SimulationObject.outlineFragment) {
			return SimulationObject.outlineFragment;
		}
		const base = Manager.GL.SHADER_DEFAULT_FRAGMENT;
		const withUniform = base.replace(
			'uniform bool hovered;',
			'uniform bool hovered;\nuniform vec2 outlineStep;\nuniform vec4 frameBounds;',
		);
		const withFunction = withUniform.replace(
			'void main() {',
			`float outlineSample(vec2 c) {
	if (c.x < frameBounds.x || c.x > frameBounds.z || c.y < frameBounds.y || c.y > frameBounds.w) {
		return 0.0;
	}
	return texture2D(map, c).a;
}
void main() {`,
		);
		const outlineBranch = `if (sampledDiffuseColor.a <= alpha_threshold) {
		float outlineNeighbor = 0.0;
		outlineNeighbor = max(outlineNeighbor, outlineSample(coords + vec2(outlineStep.x, 0.0)));
		outlineNeighbor = max(outlineNeighbor, outlineSample(coords - vec2(outlineStep.x, 0.0)));
		outlineNeighbor = max(outlineNeighbor, outlineSample(coords + vec2(0.0, outlineStep.y)));
		outlineNeighbor = max(outlineNeighbor, outlineSample(coords - vec2(0.0, outlineStep.y)));
		outlineNeighbor = max(outlineNeighbor, outlineSample(coords + outlineStep));
		outlineNeighbor = max(outlineNeighbor, outlineSample(coords - outlineStep));
		outlineNeighbor = max(outlineNeighbor, outlineSample(coords + vec2(outlineStep.x, -outlineStep.y)));
		outlineNeighbor = max(outlineNeighbor, outlineSample(coords + vec2(-outlineStep.x, outlineStep.y)));
		if (outlineNeighbor > alpha_threshold) {
			gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
			return;
		}
		discard;
	}`;
		SimulationObject.outlineFragment = withFunction.replace(
			/if \(sampledDiffuseColor\.a <= alpha_threshold\)\s*discard;/,
			outlineBranch,
		);
		return SimulationObject.outlineFragment;
	}

	private disposePreviewMaterial() {
		if (this.previewMaterial) {
			this.previewMaterial.dispose();
			this.previewMaterial = null;
			this.previewMaterialSource = null;
		}
	}

	private updateMeshOffset() {
		const picture = Project.current!.pictures.getByID(PICTURE_KIND.CHARACTERS, this.state.graphicsID);
		const pixelOffset =
			this.pixelOffset &&
			this.frame % 2 !== 0 &&
			(this.moving ? this.moveAnimation : this.stopAnimation && !picture?.isStopAnimation)
				? 1 / Project.SQUARE_SIZE
				: 0;
		this.mesh?.position.set(
			this.worldPosition.x - this.baseVector.x,
			this.worldPosition.y - this.baseVector.y + pixelOffset,
			this.worldPosition.z - this.baseVector.z,
		);
		if (this.standaloneLights && this.standaloneLightsBasePosition) {
			this.standaloneLights.position
				.copy(this.standaloneLightsBasePosition)
				.add(this.worldPosition)
				.sub(this.baseVector);
		}
	}

	private removeMesh() {
		this.gltfAnimationMixer?.stopAllAction();
		this.gltfAnimationMixer = null;
		if (this.mesh) {
			this.map.scene.remove(this.mesh);
			this.mesh = null;
		}
		if (this.standaloneLights) {
			this.map.scene.remove(this.standaloneLights);
			this.standaloneLights = null;
			this.standaloneLightsBasePosition = null;
		}
		for (const { light } of this.lights) {
			if (
				light instanceof THREE.PointLight ||
				light instanceof THREE.SpotLight ||
				light instanceof THREE.DirectionalLight
			) {
				light.shadow.dispose();
			}
		}
		this.lights = [];
	}

	remove() {
		this.disposed = true;
		this.pendingTextureKey = null;
		this.removeMesh();
		this.disposePreviewMaterial();
	}
}

export { SimulationObject };
