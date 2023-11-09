import { TextureBundle } from '../Core/index.js';
import { System } from '../index.js';
/** @class
 *  All the special elements datas.
 *  @static
 */
declare class SpecialElements {
    static autotiles: System.Autotile[];
    static walls: System.SpecialElement[];
    static mountains: System.Mountain[];
    static objects: System.Object3D[];
    static texturesAutotiles: TextureBundle[][];
    static texturesWalls: THREE.MeshPhongMaterial[];
    static texturesObjects3D: THREE.MeshPhongMaterial[];
    static texturesMountains: TextureBundle[];
    constructor();
    /**
     *  Read the JSON file associated to special elements.
     */
    static read(): Promise<void>;
    /**
     *  Get the autotile by ID.
     *  @param {number} id
     *  @returns {System.Autotile}
     */
    static getAutotile(id: number): System.Autotile;
    /**
     *  Get the wall by ID.
     *  @param {number} id
     *  @returns {System.SpecialElement}
     */
    static getWall(id: number): System.SpecialElement;
    /**
     *  Get the mountain by ID.
     *  @param {number} id
     *  @returns {System.Mountain}
     */
    static getMountain(id: number): System.Mountain;
    /**
     *  Get the object 3D by ID.
     *  @param {number} id
     *  @returns {System.Object3D}
     */
    static getObject3D(id: number): System.Object3D;
    /**
     *  Get the max possible offset of an autotile texture.
     *  @returns {number}
     */
    static getMaxAutotilesOffsetTexture(): number;
    /**
     *  Get the autotile texture.
     *  @param {number} id
     *  @returns {Promise<TextureBundle>}
     */
    static loadAutotileTexture(id: number): Promise<TextureBundle[]>;
    /**
     *  Load an autotile ID and add it to context rendering.
     *  @param {TextureBundle} textureAutotile - The autotile several texture
     *  @param {THREE.Texture} texture - The texture to paint on
     *  @param {System.Picture} picture - The picture to paint
     *  @param {number} offset - The offset
     *  @param {boolean} isAnimated
     *  @returns {any[]}
     */
    static loadTextureAutotile(textureAutotile: TextureBundle, texture: THREE.Texture, picture: System.Picture, offset: number, isAnimated: boolean): Promise<any[]>;
    /**
     *  Paint the picture in texture.
     *  @param {Image} img - The image to draw
     *  @param {number} offset - The offset
     *  @param {number[]} point - The in several texture
     *  @param {number} id - The autotile id
     */
    static paintPictureAutotile(img: HTMLImageElement, offset: number, point: number[]): void;
    /**
     *  Update texture of a TextureAutotile.
     *  @param {TextureBundle} textureAutotile - The autotile several texture
     *  @param {THREE.Texture} texture - The texture to paint on
     *  @param {number} id - The autotile picture ID
     */
    static updateTextureAutotile(textureAutotile: TextureBundle, texture: THREE.Texture, id: number): Promise<void>;
    /**
     *  Get the wall texture.
     *  @param {number} id
     *  @returns {Promise<THREE.MeshPhongMaterial>}
     */
    static loadWallTexture(id: number): Promise<THREE.MeshPhongMaterial>;
    /**
     *  Load a wall texture.
     *  @param {System.Picture} picture - The picture to load
     *  @param {number} id - The picture id
     *  @returns {THREE.MeshPhongMaterial}
     */
    static loadTextureWall(picture: System.Picture, id: number): Promise<THREE.MeshPhongMaterial>;
    /**
     *  Get the max possible offset of a mountain texture.
     *  @returns {number}
     */
    static getMaxMountainOffsetTexture(): number;
    /**
     *  Get the mountain texture.
     *  @param {number} id
     *  @returns {Promise<TextureBundle>}
     */
    static loadMountainTexture(id: number): Promise<TextureBundle>;
    /**
     *  Load a mountain ID and add it to context rendering
     *  @param {TextureBundle} textureMountain - The mountain several texture
     *  @param {THREE.Texture} texture - The texture to paint on
     *  @param {System.Picture} picture - The picture to paint
     *  @param {number} offset - The offset
     *  @param {number} id - The picture id
     *  @returns {any[]}
     */
    static loadTextureMountain(textureMountain: TextureBundle, texture: THREE.Texture, picture: System.Picture, offset: number, id: number): Promise<any[]>;
    /**
     *  Paint the picture in texture.
     *  @param {HTMLImageElement} img - The image to draw
     *  @param {number} offset - The offset
     *  @param {number} id - The picture id
     */
    static paintPictureMountain(img: HTMLImageElement, offset: number, id: number): void;
    /**
     *  Update texture of a TextureSeveral.
     *  @param {TextureBundle} textureMountain - The mountain several texture
     *  @param {THREE.Texture} texture - The texture to paint on
     *  @param {number} id - The picture ID
     */
    static updateTextureMountain(textureMountain: TextureBundle, texture: THREE.Texture, id: number): Promise<void>;
    /**
     *  Get the wall texture.
     *  @param {number} id
     *  @returns {Promise<THREE.MeshPhongMaterial>}
     */
    static loadObject3DTexture(id: number): Promise<THREE.MeshPhongMaterial>;
    /**
     *  Check if a special element picture is in correct format size.
     *  @param {string} type The type of special element as a string
     *  @param {string} name The name of the picture
     *  @param {number} w The picture width
     *  @param {number} h The picture height
     *  @param {number} cw The excepted width
     *  @param {number} ch The excepted height
     */
    static checkPictureSize(type: string, name: string, w: number, h: number, cw: number, ch: number, strictw: boolean, stricth: boolean): void;
}
export { SpecialElements };
