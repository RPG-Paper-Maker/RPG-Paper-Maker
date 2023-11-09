import { Enum } from '../Common/index.js';
import { System } from '../index.js';
import PictureKind = Enum.PictureKind;
/** @class
 *  All the tilesets datas.
 *  @static
 */
declare class Tilesets {
    static PROPERTY_TEXTURES_CHARACTERS: string;
    static PROPERTY_TEXTURES_BATTLERS: string;
    private static list;
    static texturesCharacters: THREE.MeshPhongMaterial[];
    static texturesBattlers: THREE.MeshPhongMaterial[];
    constructor();
    /**
     *  Read the JSON file associated to tilesets.
     */
    static read(): Promise<void>;
    /**
     *  Get the tileset by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Tileset}
     */
    static get(id: number): System.Tileset;
    /**
     *  Load pictures.
     *  @param {PictureKind} pictureKind - The picture kind
     *  @param {string} texturesName - The field name textures
     */
    static loadPictures(pictureKind: PictureKind, texturesName: string): Promise<void>;
}
export { Tilesets };
