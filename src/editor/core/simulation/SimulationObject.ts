/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { ELEMENT_MAP_KIND, PICTURE_KIND } from '../../common';
import { Manager, MapElement, Model } from '../../Editor';
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

const FRAME_DURATION = 150;

class SimulationObject {
	public mesh: THREE.Mesh | null = null;
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

	applyState(state: Model.MapObjectState) {
		this.state = state.clone();
		this.baseRow = this.state.graphicsIndexY - (this.state.graphicsIndexY % 4);
		this.orientation = (this.state.graphicsIndexY % 4) as SIM_ORIENTATION;
		this.frame = 0;
		this.frameTick = 0;
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
	}

	updateGraphics(kind: ELEMENT_MAP_KIND, id: number, indexX: number, indexY: number, changeOrientation: boolean) {
		this.state.graphicsKind = kind;
		this.state.graphicsID = id;
		this.state.graphicsIndexX = indexX;
		this.state.graphicsIndexY = indexY;
		this.baseRow = indexY - (indexY % 4);
		if (changeOrientation) {
			this.orientation = (indexY % 4) as SIM_ORIENTATION;
		}
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
		if (this.moving && this.moveAnimation) {
			return this.frame % frames;
		}
		return this.state.graphicsIndexX % frames;
	}

	getCurrentRow(): number {
		if (this.directionFix) {
			return this.state.graphicsIndexY;
		}
		return this.baseRow + this.orientation;
	}

	build() {
		if (this.disposed || !this.render) {
			return;
		}
		const buildKey = `${this.state.graphicsKind}-${this.state.graphicsID}-${this.getCurrentColumn()}-${this.getCurrentRow()}`;
		if (this.mesh !== null && buildKey === this.lastBuildKey) {
			return;
		}
		this.lastBuildKey = buildKey;
		this.removeMesh();
		const state = this.state;
		let mesh: THREE.Mesh | null = null;
		switch (state.graphicsKind) {
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
					state.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FIX ? new CustomGeometry() : new CustomGeometryFace();
				const localPosition = position.toVector3();
				sprite.updateGeometry(this.map, geometrySprite, width, height, position, 0, false, localPosition);
				geometrySprite.updateAttributes();
				mesh = new THREE.Mesh(geometrySprite, this.applyPreviewEffect(material));
				mesh.customDepthMaterial = material.userData.customDepthMaterial;
				this.meshIsFace = state.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FACE;
				break;
			}
			case ELEMENT_MAP_KIND.OBJECT3D: {
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
			mesh.castShadow = true;
			mesh.renderOrder = 4;
			this.map.scene.add(mesh);
			this.mesh = mesh;
			this.updateMeshOffset();
		}
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

	update(elapsedTime: number, faceAngle: number) {
		if (this.moveFrequencyTick > 0) {
			this.moveFrequencyTick = Math.max(0, this.moveFrequencyTick - elapsedTime);
		}
		if (this.moving && this.moveAnimation) {
			this.frameTick += elapsedTime;
			if (this.frameTick >= FRAME_DURATION) {
				this.frame = (this.frame + 1) % Project.current!.systems.FRAMES;
				this.frameTick = 0;
				this.build();
			}
		} else if (this.frameTick !== 0 || (this.frame !== 0 && !this.moving)) {
			this.frame = 0;
			this.frameTick = 0;
			this.build();
		}
		if (this.mesh && this.meshIsFace) {
			(this.mesh.geometry as CustomGeometryFace).rotate(faceAngle, MapElement.Base.Y_AXIS);
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
		this.mesh?.position.set(
			this.worldPosition.x - this.baseVector.x,
			this.worldPosition.y - this.baseVector.y,
			this.worldPosition.z - this.baseVector.z,
		);
	}

	private removeMesh() {
		if (this.mesh) {
			this.map.scene.remove(this.mesh);
			this.mesh = null;
		}
	}

	remove() {
		this.disposed = true;
		this.pendingTextureKey = null;
		this.removeMesh();
		this.disposePreviewMaterial();
	}
}

export { SimulationObject };
