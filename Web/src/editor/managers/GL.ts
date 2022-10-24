/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { IO } from '../common/IO';
import { Utils } from '../common/Utils';

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
    public static extraContext: GL;
    public static MATERIAL_EMPTY = new THREE.ShaderMaterial();
    public static screenTone = new THREE.Vector4(0, 0, 0, 1);
    public parent: HTMLElement | null = null;
    public renderer: THREE.WebGLRenderer | null = null;
    public visible: boolean = false;
    public canvasWidth: number = 0;
    public canvasHeight: number = 0;

    static async loadTexture(path: string): Promise<THREE.Texture> {
        let texture: THREE.Texture = await (new Promise((resolve, reject) => {
            this.textureLoader.load(path,
                (t: THREE.Texture) => {
                    resolve(t);
                },
                () => {},
                () => {
                    console.error('Could not load ' + path);
                }
            );
        }));
        return texture;
    }

    static async initializeShaders() {
        this.SHADER_DEFAULT_VERTEX = await IO.openFile('/shaders/default.vert');
        this.SHADER_DEFAULT_FRAGMENT = await IO.openFile('/shaders/default.frag');
        this.SHADER_FACE_VERTEX = await IO.openFile('/shaders/face.vert');
        this.SHADER_FACE_FRAGMENT = await IO.openFile('/shaders/face.frag');
    }

    static getMaterialTexture(material: THREE.ShaderMaterial): THREE.Texture {
        return material && material.uniforms.t.value ? material.uniforms.t.value
            : null;
    }

    static createMaterial(texture: THREE.Texture, opts: { flipX?: boolean
        , flipY?: boolean, uniforms?: Record<string, any>, isFaceSprite?: boolean,
        depthWrite?: boolean } = {}): 
        THREE.ShaderMaterial {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.flipY = opts.flipY ? true : false;
        if (!opts.uniforms) {
            opts.uniforms = {
                t: { type: "t", value: texture },
                colorD: { type: "v4", value: this.screenTone },
                reverseH: { type: "b", value: opts.flipX },
                offset: { type: "v2", value: new THREE.Vector2() }
            };
        }
        let material = new THREE.ShaderMaterial({
            uniforms:       opts.uniforms,
            vertexShader:   opts.isFaceSprite ? this.SHADER_FACE_VERTEX : this.SHADER_DEFAULT_VERTEX,
            fragmentShader: opts.isFaceSprite ? this.SHADER_FACE_FRAGMENT : this.SHADER_DEFAULT_FRAGMENT,
            side: opts.isFaceSprite ? THREE.BackSide : THREE.DoubleSide,
            transparent: true,
            depthWrite: Utils.defaultValue(opts.depthWrite, true)
        });
        return material;
    }

    initialize(id: string, clearColor: string = '#8cc3ed', colorAlpha: number = 1) {
        this.parent = document.getElementById(id);
        if (this.parent === null) {
            throw new Error('No id ' + id + ' found in document for GL renderer.')
        }
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.autoClear = false;
        this.renderer.setSize(this.parent.clientWidth, this.parent.clientHeight, true);
        this.renderer.setClearColor(clearColor, colorAlpha);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.parent.appendChild(this.renderer.domElement);
    }

    resize(scroll: boolean = false) {
        if (this.renderer && this.parent) {
            this.canvasWidth = this.parent.clientWidth;
            this.canvasHeight = scroll ? this.parent.scrollHeight : this.parent
                .getBoundingClientRect().height;
            this.renderer.setSize(this.canvasWidth, this.canvasHeight, true);
        }
    }
}

GL.DRACOLoader.setDecoderPath('/examples/js/libs/draco/');
GL.GLTFLoader.setDRACOLoader(GL.DRACOLoader);

export { GL }