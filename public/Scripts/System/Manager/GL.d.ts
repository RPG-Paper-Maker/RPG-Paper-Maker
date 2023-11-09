import { System } from '../index.js';
import { Vector3, Vector2 } from '../Core/index.js';
/** @class
 *  The GL class handling some 3D stuff.
 *  @static
 */
declare class GL {
    static SHADER_FIX_VERTEX: string;
    static SHADER_FIX_FRAGMENT: string;
    static SHADER_FACE_VERTEX: string;
    static SHADER_FACE_FRAGMENT: string;
    static renderer: THREE.WebGLRenderer;
    static textureLoader: import("three").TextureLoader;
    static raycaster: import("three").Raycaster;
    static screenTone: import("three").Vector4;
    constructor();
    /**
     *  Initialize the openGL stuff.
     *  @static
     */
    static initialize(): void;
    /**
     *  Load shaders stuff.
     *  @static
     */
    static load(): Promise<void>;
    /**
     *  Set the camera aspect while resizing the window.
     *  @static
     */
    static resize(): void;
    /**
     *  Load a texture.
     *  @param {string} path - The path of the texture
     *  @returns {Promise<THREE.Material>}
     */
    static loadTexture(path: string): Promise<THREE.MeshPhongMaterial>;
    /**
     *  Load a texture empty.
     *  @returns {THREE.Material}
     */
    static loadTextureEmpty(): THREE.MeshPhongMaterial;
    /**
     *  Create a material from texture.
     *  @returns {THREE.MeshPhongMaterial}
     */
    static createMaterial(opts: {
        texture?: THREE.Texture | null;
        flipX?: boolean;
        flipY?: boolean;
        uniforms?: Record<string, any>;
        side?: number;
        repeat?: number;
        opacity?: number;
        shadows?: boolean;
    }): THREE.MeshPhongMaterial;
    static cloneMaterial(material: THREE.MeshPhongMaterial): THREE.MeshPhongMaterial;
    /**
     *  Get material THREE.Texture (if exists).
     *  @param {THREE.MeshPhongMaterial}
     *  @returns {THREE.Texture}
     */
    static getMaterialTexture(material: THREE.MeshPhongMaterial): THREE.Texture;
    /**
     *  Update the background color
     *  @static
     *  @param {System.Color} color
     */
    static updateBackgroundColor(color: System.Color): void;
    /**
     *  Convert 3D vector to a 2D point on screen.
     *  @static
     *  @param {Vector3} vector - The 3D vector
     *  @param {THREE.Camera} camera - The three.js camera
     *  @returns {Vector2}
     */
    static toScreenPosition(vector: Vector3, camera: THREE.Camera): Vector2;
}
export { GL };
