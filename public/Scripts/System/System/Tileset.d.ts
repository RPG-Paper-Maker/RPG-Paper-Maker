import { Base } from './Base.js';
import { CollisionSquare, TextureBundle } from '../Core/index.js';
import { System } from '../index.js';
/** @class
 *  A tileset of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - json Json object describing the tileset
 */
declare class Tileset extends Base {
    collisions: CollisionSquare[];
    id: number;
    battleMap: System.DynamicValue;
    picture: System.Picture;
    autotiles: number[];
    walls: number[];
    mountains: number[];
    objects: number[];
    constructor(json?: Record<string, any>);
    /**
     *  Assign the default members.
     */
    setup(): void;
    /**
     *  Read the JSON associated to the tileset.
     *  @param {Record<string, any>} - json Json object describing the tileset
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the path to the picture tileset.
     *  @returns {string}
     */
    getPath(): string;
    /**
     *  Get the textures for autotiles.
     *  @returns {Promise<TextureBundle[]>}
     */
    getTexturesAutotiles(): Promise<TextureBundle[][]>;
    /**
     *  Get the textures for walls.
     *  @returns {Promise<THREE.MeshPhongMaterial[]>}
     */
    getTexturesWalls(): Promise<THREE.MeshPhongMaterial[]>;
    /**
     *  Get the textures for 3D objects.
     *  @returns {Promise<THREE.MeshPhongMaterial[]>}
     */
    getTexturesObjects3D(): Promise<THREE.MeshPhongMaterial[]>;
    /**
     *  Get the textures for mountains.
     *  @returns {Promise<TextureBundle[]>}
     */
    getTexturesMountains(): Promise<TextureBundle[]>;
}
export { Tileset };
