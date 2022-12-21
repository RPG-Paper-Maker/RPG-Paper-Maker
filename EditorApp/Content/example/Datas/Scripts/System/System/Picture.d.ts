import { Enum } from "../Common/index.js";
import PictureKind = Enum.PictureKind;
import { Picture2D, CollisionSquare } from "../Core/index.js";
import { Base } from "./Base.js";
/** @class
 *  A picture of the game.
 *  @extends {System.Base}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  picture
 *  @param {PictureKind} [kind=PictureKind.Pictures] - The kind of picture
 */
declare class Picture extends Base {
    id: number;
    kind: PictureKind;
    name: string;
    isBR: boolean;
    dlc: string;
    base64: string;
    jsonCollisions: Record<string, any>[];
    collisionsRepeat: boolean;
    collisions: CollisionSquare[];
    picture: Picture2D;
    width: number;
    height: number;
    isStopAnimation: boolean;
    borderLeft: number;
    borderRight: number;
    constructor(json?: Record<string, any>, kind?: PictureKind);
    /**
     *  Assign the default members.
     *  @param {any[]} args
     */
    setup(args: any[]): void;
    /**
     *  Get string of picture kind.
     *  @param {PictureKind} kind - The picture kind
     *  @returns {string}
     */
    static pictureKindToString(kind: PictureKind): string;
    /**
     *  Get the folder associated to a kind of picture.
     *  @static
     *  @param {PictureKind} kind - The kind of picture
     *  @param {boolean} isBR - Indicate if the picture is a BR
     *  @param {string} dlc - The picture DLC name (if exists)
     *  @returns {string}
     */
    static getFolder(kind: PictureKind, isBR: boolean, dlc: string): string;
    /**
     *  Get the local folder associated to a kind of picture.
     *  @static
     *  @param {PictureKind} kind - The kind of picture
     *  @returns {string}
     */
    static getLocalFolder(kind: PictureKind): string;
    /**
     *  Read the JSON associated to the picture.
     *  @param {Object} json - Json object describing the picture
     */
    read(json: Record<string, any>): void;
    /**
     *  Read the JSON associated to the picture.
     *  @async
     */
    load(): Promise<void>;
    /**
     *  Get the number of rows for the picture (used for characters).
     *  @returns {number}
     */
    getRows(): number;
    /**
     *  Get the absolute path associated to this picture.
     *  @returns {string}
     */
    getPath(): string;
    /**
     *  Read collisions according to image size.
     *  @param {HTMLImageElement} image - The image texture
     */
    readCollisionsImage(image: HTMLImageElement): void;
    /**
     *  Read collisions, we assume that this.width and this.height had been
     *  edited.
     */
    readCollisions(): void;
    /**
     *  Get a specific collision square according to texture.
     *  @param {number[]} pos - Texture position
     *  @returns {CollisionSquare}
     */
    getCollisionAt(pos: number[]): CollisionSquare;
    /**
     *  Get a specific collision square according to texture.
     *  @param {number} x - Texture x position
     *  @param {number} y - Texture y position
     *  @returns {CollisionSquare}
     */
    getCollisionAtPos(x: number, y: number): CollisionSquare;
    /**
     *  Get a specific collision square according to index.
     *  @param {number} index - The index positions
     *  @returns {CollisionSquare}
     */
    getCollisionAtIndex(index: number): CollisionSquare;
    /**
     *  Get a specific collision for wall.
     *  @param {number[]} texture - Texture position
     *  @returns {number[][]}
     */
    getSquaresForWall(texture: number[]): number[][];
    /**
     *  Get a specific collision square according to texture.
     *  @param {number[]} texture - Texture position
     *  @returns {number[][]}
     */
    getSquaresForTexture(texture: number[]): number[][];
    /**
     *  Get a specific collision square according to texture
     *  @param {THREE.Image} image - The image texture
     *  @returns {number[][][]}
     */
    getSquaresForStates(image: any): number[][];
    /**
     *  Check the borders to cut for filled bar.
     */
    checkBarBorder(): void;
}
export { Picture };
