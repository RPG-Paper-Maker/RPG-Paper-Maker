/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three/webgpu';
import { uniform, uv, Fn, vec2, vec3, vec4, mix, If, step, texture } from 'three/tsl';
import { Paths, Utils } from '../common';
import { readPublicFile } from '../common/Platform';

class GL {
	public static SHADER_DEFAULT_VERTEX: string;
	public static SHADER_DEFAULT_FRAGMENT: string;
	public static textureLoader = new THREE.TextureLoader();
	public static raycaster = new THREE.Raycaster();
	public static mainContext: GL;
	public static layerOneContext: GL;
	public static layerTwoContext: GL;
	public static layerThreeContext: GL;
	public static staticRender = new THREE.WebGPURenderer({ alpha: true });
	private static staticRenderInitialized = false;

	static async initStaticRender() {
		if (!this.staticRenderInitialized) {
			await this.staticRender.init();
			this.staticRenderInitialized = true;
		}
	}
	public static MATERIAL_EMPTY = this.loadTextureEmpty();
	public static screenTone = new THREE.Vector4(0, 0, 0, 1);
	public parent!: HTMLElement;
	public renderer!: THREE.WebGPURenderer;
	public canvasWidth: number = 0;
	public canvasHeight: number = 0;

	static async loadTexture(path: string): Promise<THREE.MeshPhongNodeMaterial> {
		const texture: THREE.Texture = await new Promise((resolve) => {
			this.textureLoader.load(
				path,
				(t: THREE.Texture) => {
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

	static loadTextureEmpty(): THREE.MeshPhongNodeMaterial {
		const material = new THREE.MeshPhongNodeMaterial({ opacity: 0, transparent: true });
		material.userData.uniforms = {
			t: { value: undefined },
		};
		return material;
	}

	static async initializeShaders() {
		this.SHADER_DEFAULT_VERTEX = await readPublicFile(Paths.join('Scripts', 'Shaders', 'default.vert'));
		this.SHADER_DEFAULT_FRAGMENT = await readPublicFile(Paths.join('Scripts', 'Shaders', 'default.frag'));
	}

	static getMaterialTextureSize(material: THREE.MeshPhongNodeMaterial | null): { width: number; height: number } {
		return {
			width: (material?.map?.image as HTMLImageElement)?.width ?? 0,
			height: (material?.map?.image as HTMLImageElement)?.height ?? 0,
		};
	}

	static createMaterial(opts: {
		texture?: THREE.Texture | null;
		flipX?: boolean;
		flipY?: boolean;
		uniforms?: Record<string, THREE.Uniform<unknown>>;
		side?: THREE.Side;
		repeat?: number;
		opacity?: number;
		shadows?: boolean;
		depthWrite?: boolean;
		hovered?: boolean;
	}): THREE.MeshPhongNodeMaterial {
		if (!opts.texture) {
			opts.texture = new THREE.Texture();
		}
		opts.texture.magFilter = THREE.NearestFilter;
		opts.texture.minFilter = THREE.NearestFilter;
		opts.texture.flipY = opts.flipY ? true : false;
		opts.texture.wrapS = THREE.RepeatWrapping;
		opts.texture.wrapT = THREE.RepeatWrapping;
		opts.texture.colorSpace = THREE.SRGBColorSpace;
		const opacity = Utils.defaultValue(opts.opacity, 1.0);
		const shadows = Utils.defaultValue(opts.shadows, true);
		const side = Utils.defaultValue(opts.side, THREE.DoubleSide);
		const hovered = Utils.defaultValue(opts.hovered, false);
		const u =
		{
			offset: uniform(new THREE.Vector2()),
			colorD: uniform(this.screenTone),
			enableShadows: uniform(shadows),
			hovered: uniform(hovered),
			reverseH: uniform(opts.flipX ? true : false),
			opacity: uniform(opacity)
		};

		// Create material
		const material = new THREE.MeshPhongNodeMaterial({
			map: opts.texture,
			side,
			transparent: true,
			alphaTest: 0.01,
			depthWrite: Utils.defaultValue(opts.depthWrite, true),
			opacity: 1,
			shininess: 0,
		});
		material.userData.uniforms = u;
		material.forceSinglePass = true;
		material.lights = shadows;
		const colorShader = Fn(() =>
		{
			const coords = vec2(uv().add(u.offset)).mul(vec2(material.map?.repeat || new THREE.Vector2(1, 1)));
			const tex = texture(material.map || new THREE.Texture(), coords);
			const color = vec3(tex.add(u.colorD));
			const intensity = vec3(color.dot(vec3(0.2125, 0.7154, 0.0721)));
			If (u.hovered, () =>
			{
				color.addAssign(vec4(0.1, 0.1, 0.1, 0));
			});
			return vec4(vec3(mix(intensity, color, u.colorD.w)), step(0.5, tex.a).mul(u.opacity));
		});
		material.colorNode = colorShader();
		return material;
	}

	async initialize(layer = 0) {
		if (!this.renderer) {
			const parent = document.getElementById('root');
			if (parent === null) {
				throw new Error('No root found in document for GL renderer.');
			}
			this.parent = parent;
			this.renderer = new THREE.WebGPURenderer({
				alpha: true,
				// Firefox has a screen flickering bug on WebGPU, remove this line once it is fixed
				forceWebGL: navigator.userAgent.search("Firefox") > -1
			});
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.shadowMap.enabled = true;
			this.renderer.domElement.classList.add(`canvasRenderer${layer}`);
			this.renderer.setClearColor(0xffffff, 0);
			await this.renderer.init();
			this.renderer.setScissorTest(true);
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
