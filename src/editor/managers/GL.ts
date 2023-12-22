/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { IO, Utils } from '../common';

class GL {
	public static SHADER_DEFAULT_VERTEX: string;
	public static SHADER_DEFAULT_FRAGMENT: string;
	public static SHADER_FACE_VERTEX: string;
	public static SHADER_FACE_FRAGMENT: string;
	public static textureLoader = new THREE.TextureLoader();
	public static OBJLoader = new OBJLoader();
	public static MTLLoader = new MTLLoader();
	public static GLTFLoader = new GLTFLoader();
	public static DRACOLoader = new DRACOLoader();
	public static GLTFExporter = new GLTFExporter();
	public static raycaster = new THREE.Raycaster();
	public static mapEditorContext: GL;
	public static mainPreviewerContext: GL;
	public static listPreviewerContext: GL;
	public static MATERIAL_EMPTY = this.loadTextureEmpty();
	public static screenTone = new THREE.Vector4(0, 0, 0, 1);
	public parent!: HTMLElement;
	public renderer!: THREE.WebGLRenderer;
	public canvasWidth: number = 0;
	public canvasHeight: number = 0;

	static async loadTexture(path: string): Promise<THREE.MeshPhongMaterial> {
		const texture: THREE.Texture = await new Promise((resolve, reject) => {
			this.textureLoader.load(
				path,
				(t: THREE.Texture) => {
					resolve(t);
				},
				() => {
					// Nothing to do on progress
				},
				() => {
					const error = 'Could not load ' + path;
					const t = new THREE.Texture();
					t.image = new Image();
					console.error(error);
					resolve(t);
				}
			);
		});
		return this.createMaterial({ texture });
	}

	static loadTextureEmpty(): THREE.MeshPhongMaterial {
		const material = new THREE.MeshPhongMaterial();
		material.userData.uniforms = {
			t: { value: undefined },
		};
		return material;
	}

	static async initializeShaders() {
		this.SHADER_DEFAULT_VERTEX = await IO.openFile('./Scripts/Shaders/default.vert');
		this.SHADER_DEFAULT_FRAGMENT = await IO.openFile('./Scripts/Shaders/default.frag');
		this.SHADER_FACE_VERTEX = await IO.openFile('./Scripts/Shaders/face.vert');
		this.SHADER_FACE_FRAGMENT = await IO.openFile('./Scripts/Shaders/face.frag');
	}

	static getMaterialTextureSize(material: THREE.MeshPhongMaterial | null): { width: number; height: number } {
		return {
			width: material?.map?.image.width || 0,
			height: material?.map?.image.height || 0,
		};
	}

	static createMaterial(opts: {
		texture?: THREE.Texture | null;
		flipX?: boolean;
		flipY?: boolean;
		uniforms?: Record<string, any>;
		side?: THREE.Side;
		repeat?: number;
		opacity?: number;
		shadows?: boolean;
		depthWrite?: boolean;
		hovered?: boolean;
	}): THREE.MeshPhongMaterial {
		if (!opts.texture) {
			opts.texture = new THREE.Texture();
		}
		opts.texture.magFilter = THREE.NearestFilter;
		opts.texture.minFilter = THREE.NearestFilter;
		opts.texture.flipY = opts.flipY ? true : false;
		const repeat = Utils.defaultValue(opts.repeat, 1.0);
		const opacity = Utils.defaultValue(opts.opacity, 1.0);
		const shadows = Utils.defaultValue(opts.shadows, true);
		const side = Utils.defaultValue(opts.side, THREE.DoubleSide);
		const hovered = Utils.defaultValue(opts.hovered, false);
		const fragment = this.SHADER_DEFAULT_FRAGMENT;
		const vertex = this.SHADER_DEFAULT_VERTEX;
		const screenTone = this.screenTone;
		const uniforms = opts.uniforms
			? opts.uniforms
			: {
					offset: { value: new THREE.Vector2() },
					colorD: { value: screenTone },
					repeat: { value: repeat },
					enableShadows: { value: shadows },
					hovered: { value: hovered },
			  };

		// Program cache key for multiple shader programs
		const key = fragment === this.SHADER_DEFAULT_FRAGMENT ? 0 : 1;

		// Create material
		const material = new THREE.MeshPhongMaterial({
			map: opts.texture,
			side,
			transparent: true,
			alphaTest: 0.5,
			depthWrite: Utils.defaultValue(opts.depthWrite, true),
			opacity,
		});
		material.userData.uniforms = uniforms;
		material.forceSinglePass = true;
		material.userData.customDepthMaterial = new THREE.MeshDepthMaterial({
			depthPacking: THREE.RGBADepthPacking,
			map: opts.texture,
			alphaTest: 0.5,
		});

		// Edit shader information before compiling shader
		material.onBeforeCompile = (shader) => {
			shader.fragmentShader = fragment;
			shader.vertexShader = vertex;
			shader.uniforms.colorD = uniforms.colorD;
			shader.uniforms.reverseH = { value: opts.flipX };
			shader.uniforms.repeat = { value: repeat };
			shader.uniforms.offset = uniforms.offset;
			shader.uniforms.enableShadows = { value: shadows };
			shader.uniforms.hovered = { value: hovered };
			material.userData.uniforms = shader.uniforms;

			// Important to run a unique shader only once and be able to use
			// multiple shader with before compile
			material.customProgramCacheKey = () => {
				return '' + key;
			};
		};

		return material;
	}

	initialize(id: string, clearColor: string = '#211d2b', colorAlpha: number = 1) {
		const parent = document.getElementById(id);
		if (parent === null) {
			throw new Error('No id ' + id + ' found in document for GL renderer.');
		}
		this.parent = parent;
		if (!this.renderer) {
			this.renderer = new THREE.WebGLRenderer({ alpha: true });
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer.autoClear = false;
			this.renderer.setSize(this.parent.clientWidth, this.parent.clientHeight);
			this.renderer.setClearColor(clearColor, colorAlpha);
			this.renderer.shadowMap.enabled = true;
		}
		this.parent.appendChild(this.renderer.domElement);
	}

	resize(scroll: boolean = false, forcedWidth = -1, forcedHeight = -1, updateStyle?: boolean) {
		if (this.renderer && this.parent) {
			this.canvasWidth = forcedWidth === -1 ? this.parent.getBoundingClientRect().width : forcedWidth;
			this.canvasHeight =
				forcedHeight === -1
					? scroll
						? this.parent.scrollHeight
						: this.parent.getBoundingClientRect().height
					: forcedHeight;
			this.renderer.setSize(this.canvasWidth, this.canvasHeight, updateStyle);
		}
	}
}

GL.DRACOLoader.setDecoderPath('/examples/js/libs/draco/');
GL.GLTFLoader.setDRACOLoader(GL.DRACOLoader);

export { GL };
