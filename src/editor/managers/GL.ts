/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Paths, Utils } from '../common';
import { readPublicFile } from '../common/Platform';

class GL {
	public static SHADER_DEFAULT_VERTEX: string;
	public static SHADER_DEFAULT_FRAGMENT: string;
	public static textureLoader = new THREE.TextureLoader();
	public static raycaster = new THREE.Raycaster();
	public static mainContext: GL;
	public static dialogContext: GL;
	public static MATERIAL_EMPTY = this.loadTextureEmpty();
	public static screenTone = new THREE.Vector4(0, 0, 0, 1);
	public parent!: HTMLElement;
	public renderer!: THREE.WebGLRenderer;
	public canvasWidth: number = 0;
	public canvasHeight: number = 0;

	static async loadTexture(path: string): Promise<THREE.MeshPhongMaterial> {
		const texture: THREE.Texture = await new Promise((resolve) => {
			this.textureLoader.load(
				path,
				(t: THREE.Texture) => {
					const maxSize = GL.mainContext?.renderer?.capabilities?.maxTextureSize ?? 4096;
					const img = t.image as HTMLImageElement;
					if (img && (img.width > maxSize || img.height > maxSize)) {
						console.warn(
							`Texture "${path}" (${img.width}×${img.height}) exceeds the GPU maximum texture size of ${maxSize}px, loading empty texture instead.`,
						);
						t.dispose();
						const empty = new THREE.Texture();
						empty.image = new Image();
						resolve(empty);
						return;
					}
					resolve(t);
				},
				() => {
					// Nothing to do on progress
				},
				() => {
					const t = new THREE.Texture();
					t.image = new Image();
					if (path !== '') {
						console.warn('Could not load ' + path);
					}
					resolve(t);
				},
			);
		});
		return this.createMaterial({ texture });
	}

	static loadTextureEmpty(): THREE.MeshPhongMaterial {
		const material = new THREE.MeshPhongMaterial({ opacity: 0, transparent: true });
		material.userData.uniforms = {
			t: { value: undefined },
		};
		return material;
	}

	static async initializeShaders() {
		this.SHADER_DEFAULT_VERTEX = await readPublicFile(Paths.join('Scripts', 'Shaders', 'default.vert'));
		this.SHADER_DEFAULT_FRAGMENT = await readPublicFile(Paths.join('Scripts', 'Shaders', 'default.frag'));
	}

	static renderToDataURL(
		renders: { scene: THREE.Scene; camera: THREE.Camera; clearDepth?: boolean }[],
		width: number,
		height: number,
	): string {
		const renderer = GL.dialogContext?.renderer;
		if (!renderer) return '';
		const target = new THREE.WebGLRenderTarget(width, height);
		const prevScissorTest = renderer.getScissorTest();
		const prevAutoClear = renderer.autoClear;
		const prevShadowMap = renderer.shadowMap.enabled;
		renderer.setScissorTest(false);
		renderer.autoClear = false;
		renderer.shadowMap.enabled = true;
		renderer.setRenderTarget(target);
		renderer.clear(true, true, true);
		for (const { scene, camera, clearDepth } of renders) {
			if (clearDepth) renderer.clearDepth();
			renderer.render(scene, camera);
		}
		const pixels = new Uint8Array(width * height * 4);
		renderer.readRenderTargetPixels(target, 0, 0, width, height, pixels);
		renderer.setRenderTarget(null);
		renderer.setScissorTest(prevScissorTest);
		renderer.autoClear = prevAutoClear;
		renderer.shadowMap.enabled = prevShadowMap;
		target.dispose();
		const canvas2d = document.createElement('canvas');
		canvas2d.width = width;
		canvas2d.height = height;
		const ctx = canvas2d.getContext('2d')!;
		const imageData = ctx.createImageData(width, height);
		for (let y = 0; y < height; y++) {
			const srcRow = (height - 1 - y) * width * 4;
			const dstRow = y * width * 4;
			for (let x = 0; x < width; x++) {
				const s = srcRow + x * 4;
				const d = dstRow + x * 4;
				for (let c = 0; c < 3; c++) {
					const linear = pixels[s + c] / 255;
					const srgb = linear <= 0.0031308 ? linear * 12.92 : 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
					imageData.data[d + c] = Math.round(Math.min(1, srgb) * 255);
				}
				imageData.data[d + 3] = pixels[s + 3]; // alpha unchanged
			}
		}
		ctx.putImageData(imageData, 0, 0);
		return canvas2d.toDataURL('image/png');
	}

	static getMaterialTextureSize(material: THREE.MeshPhongMaterial | null): { width: number; height: number } {
		return {
			width: (material?.map?.image as HTMLImageElement)?.width ?? 0,
			height: (material?.map?.image as HTMLImageElement)?.height ?? 0,
		};
	}

	static createMaterial(opts: {
		texture?: THREE.Texture | null;
		flipX?: boolean;
		flipY?: boolean;
		uniforms?: Record<string, THREE.IUniform<unknown>>;
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
		opts.texture.colorSpace = THREE.NoColorSpace;
		opts.texture.flipY = opts.flipY ? true : false;
		opts.texture.wrapS = THREE.RepeatWrapping;
		opts.texture.wrapT = THREE.RepeatWrapping;
		const repeat = Utils.defaultValue(opts.repeat, 1.0);
		const opacity = Utils.defaultValue(opts.opacity, 1.0);
		const shadows = Utils.defaultValue(opts.shadows, true);
		const side = Utils.defaultValue(opts.side, THREE.DoubleSide);
		const hovered = Utils.defaultValue(opts.hovered, false);
		const fragment = this.SHADER_DEFAULT_FRAGMENT;
		const vertex = this.SHADER_DEFAULT_VERTEX;
		const screenTone = this.screenTone;
		const uniforms = Utils.defaultValue(opts.uniforms, {
			offset: { value: new THREE.Vector2() },
			colorD: { value: screenTone },
			repeat: { value: repeat },
			enableShadows: { value: shadows },
			hovered: { value: hovered },
		});

		// Program cache key for multiple shader programs
		const key = fragment === this.SHADER_DEFAULT_FRAGMENT ? 0 : 1;

		// Create material
		const material = new THREE.MeshPhongMaterial({
			map: opts.texture,
			side,
			transparent: true,
			alphaTest: 0,
			depthWrite: Utils.defaultValue(opts.depthWrite, true),
			opacity,
			shininess: 0,
			specular: new THREE.Color(0x000000),
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
			shader.uniforms.alpha_threshold = { value: 0.01 };
			material.userData.uniforms = shader.uniforms;

			// Important to run a unique shader only once and be able to use
			// multiple shader with before compile
			material.customProgramCacheKey = () => {
				return '' + key;
			};
		};

		return material;
	}

	initialize(layer = 0) {
		if (!this.renderer) {
			const parent = document.getElementById('root');
			if (parent === null) {
				throw new Error('No root found in document for GL renderer.');
			}
			this.parent = parent;
			this.renderer = new THREE.WebGLRenderer({
				alpha: true,
				powerPreference: 'high-performance',
				// preserveDrawingBuffer is needed on the dialog context (layer 1) so that
				// toDataURL() can capture a screenshot for frozen-dialog previews.
				preserveDrawingBuffer: layer === 1,
			});
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.shadowMap.enabled = true;
			this.renderer.domElement.classList.add(`canvasRenderer${layer}`);
			this.renderer.autoClear = false;
			this.renderer.setScissorTest(false);
			this.renderer.setClearColor(0x000000, 0);
			this.renderer.clear(true, true);
			this.renderer.setScissorTest(true);
			this.renderer.debug.onShaderError = (gl, program, vertShader, fragShader) => {
				const programLog = gl.getProgramInfoLog(program)?.trim() ?? '';
				const vertLog = gl.getShaderInfoLog(vertShader)?.trim() ?? '';
				const fragLog = gl.getShaderInfoLog(fragShader)?.trim() ?? '';
				const validateStatus = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
				const glError = gl.getError();
				let msg = `THREE.WebGLProgram: Shader Error ${glError} - VALIDATE_STATUS ${validateStatus}\n\n`;
				if (programLog) msg += `Program Info Log: ${programLog}\n`;
				if (vertLog) msg += `Vertex Shader Info Log:\n${vertLog}\n`;
				if (fragLog) msg += `Fragment Shader Info Log:\n${fragLog}\n`;
				console.error(msg);
			};
			this.renderer.domElement.addEventListener('webglcontextlost', (event) => {
				event.preventDefault();
			});
			this.renderer.domElement.addEventListener('webglcontextrestored', () => {
				this.renderer.setPixelRatio(window.devicePixelRatio);
				this.renderer.setSize(this.canvasWidth || window.innerWidth, this.canvasHeight || window.innerHeight);
				this.renderer.shadowMap.enabled = true;
				this.renderer.autoClear = false;
				this.renderer.setScissorTest(true);
				this.renderer.setClearColor(0x000000, 0);
			});
		}
		this.parent.appendChild(this.renderer.domElement);
	}

	remove() {
		if (this.renderer) {
			this.parent.removeChild(this.renderer.domElement);
		}
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

export { GL };
