/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from "../Globals.js";
import { Datas } from "../index.js";
import { ScreenResolution, Platform, Utils, IO, Paths } from "../Common/index.js";
import { Stack } from "./Stack.js";
import { Vector2 } from "../Core/index.js";
/** @class
 *  The GL class handling some 3D stuff.
 *  @static
 */
class GL {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Initialize the openGL stuff.
     *  @static
     */
    static initialize() {
        this.renderer = new THREE.WebGLRenderer({ antialias: Datas.Systems
                .antialias, alpha: true });
        this.renderer.autoClear = false;
        this.renderer.setSize(ScreenResolution.CANVAS_WIDTH, ScreenResolution
            .CANVAS_HEIGHT, true);
        if (Datas.Systems.antialias) {
            this.renderer.setPixelRatio(2);
        }
        document.body.appendChild(this.renderer.domElement);
    }
    /**
     *  Load shaders stuff.
     *  @static
     */
    static async load() {
        // Shaders
        let json = await IO.openFile(Paths.SHADERS + "fix.vert");
        this.SHADER_FIX_VERTEX = json;
        json = await IO.openFile(Paths.SHADERS + "fix.frag");
        this.SHADER_FIX_FRAGMENT = json;
        json = await IO.openFile(Paths.SHADERS + "face.vert");
        this.SHADER_FACE_VERTEX = json;
        json = await IO.openFile(Paths.SHADERS + "face.frag");
        this.SHADER_FACE_FRAGMENT = json;
    }
    /**
     *  Set the camera aspect while resizing the window.
     *  @static
     */
    static resize() {
        this.renderer.setSize(ScreenResolution.CANVAS_WIDTH, ScreenResolution
            .CANVAS_HEIGHT, true);
        let camera;
        for (let i = 0, l = Stack.content.length; i < l; i++) {
            camera = Stack.content[i].camera;
            if (!Utils.isUndefined(camera)) {
                camera.resizeGL();
            }
        }
    }
    /**
     *  Load a texture.
     *  @param {string} path - The path of the texture
     *  @returns {Promise<THREE.Material>}
     */
    static async loadTexture(path) {
        let texture = await (new Promise((resolve, reject) => {
            this.textureLoader.load(path, (t) => {
                resolve(t);
            }, () => { }, () => {
                let error = "Could not load " + path;
                if (Datas.Systems.ignoreAssetsLoadingErrors) {
                    let t = new THREE.Texture();
                    t.image = new Image();
                    console.log(error);
                    resolve(t);
                }
                else {
                    Platform.showErrorMessage(error);
                }
            });
        }));
        return this.createMaterial(texture);
    }
    /**
     *  Load a texture empty.
     *  @returns {THREE.Material}
     */
    static loadTextureEmpty() {
        return new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            alphaTest: 0.5,
            uniforms: {
                t: { value: undefined }
            }
        });
    }
    /**
     *  Create a material from texture.
     *  @returns {THREE.ShaderMaterial}
     */
    static createMaterial(texture, opts = {}) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.flipY = opts.flipY;
        if (!opts.uniforms) {
            opts.uniforms = {
                t: { type: "t", value: texture },
                colorD: { type: "v4", value: this.screenTone },
                reverseH: { type: "b", value: opts.flipX },
                offset: { type: "v2", value: new Vector2() }
            };
        }
        let material = new THREE.ShaderMaterial({
            uniforms: opts.uniforms,
            vertexShader: opts.isFaceSprite ? this.SHADER_FACE_VERTEX : this.SHADER_FIX_VERTEX,
            fragmentShader: opts.isFaceSprite ? this.SHADER_FACE_FRAGMENT : this.SHADER_FIX_FRAGMENT,
            side: opts.isFaceSprite ? THREE.BackSide : THREE.DoubleSide,
            transparent: true
        });
        return material;
    }
    /**
     *  Get material THREE.Texture (if exists).
     *  @param {THREE.ShaderMaterial}
     *  @returns {THREE.Texture}
     */
    static getMaterialTexture(material) {
        return material && material.uniforms.t.value ? material.uniforms.t.value
            : null;
    }
    /**
     *  Update the background color
     *  @static
     *  @param {System.Color} color
     */
    static updateBackgroundColor(color) {
        this.renderer.setClearColor(color.getHex(this.screenTone), color.alpha);
    }
    /**
     *  Convert 3D vector to a 2D point on screen.
     *  @static
     *  @param {Vector3} vector - The 3D vector
     *  @param {THREE.Camera} camera - The three.js camera
     *  @returns {Vector2}
     */
    static toScreenPosition(vector, camera) {
        let widthHalf = ScreenResolution.CANVAS_WIDTH / 2;
        let heightHalf = ScreenResolution.CANVAS_HEIGHT / 2;
        let position = vector.clone();
        camera.updateMatrixWorld(true);
        position.project(camera);
        return new Vector2((position.x * widthHalf) + widthHalf, -(position.y * heightHalf) + heightHalf);
    }
}
GL.textureLoader = new THREE.TextureLoader();
GL.screenTone = new THREE.Vector4(0, 0, 0, 1);
export { GL };
