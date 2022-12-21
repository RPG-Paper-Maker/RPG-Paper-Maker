import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import PictureKind = Enum.PictureKind;
import { Bitmap } from "./Bitmap.js";
/** @class
 *   A class for pictures drawable in HUD.
 *   @extends Bitmap
 *   @param {string} [path=""] - The path to the ressource
 *   @param {number} [x=0] - Coords of the bitmap
 *   @param {number} [y=0] - Coords of the bitmap
 *   @param {number} [w=0] - Coords of the bitmap
 *   @param {number} [h=0] - Coords of the bitmap
 */
declare class Picture2D extends Bitmap {
    zoom: number;
    opacity: number;
    angle: number;
    cover: boolean;
    stretch: boolean;
    path: string;
    loaded: boolean;
    empty: boolean;
    image: HTMLImageElement;
    centered: boolean;
    reverse: boolean;
    sx: number;
    sy: number;
    constructor(path?: string, { x, y, w, h, zoom, opacity, angle, cover, stretch, sx, sy }?: {
        x?: number;
        y?: number;
        w?: number;
        h?: number;
        zoom?: number;
        opacity?: number;
        angle?: number;
        cover?: boolean;
        stretch?: boolean;
        sx?: number;
        sy?: number;
    });
    /**
     *  Create a picture and then load it
     *  @static
     *  @param {System.Picture} picture - The picture to load
     */
    static create(picture: System.Picture, opts?: {
        x?: number;
        y?: number;
        w?: number;
        h?: number;
        zoom?: number;
        opacity?: number;
        angle?: number;
        cover?: boolean;
        stretch?: boolean;
    }): Promise<Picture2D>;
    /**
     * Create a picture from kind and id and then load it
     *
     * @static
     * @param {number} id - The picture id to load
     * @param {PictureKind} kind - The picture kind to load
     * @param {pictureOptions} [opts={}]
     * @return {*}
     * @memberof Picture2D
     */
    static createWithID(id: number, kind: PictureKind, opts?: pictureOptions): Promise<Picture2D>;
    /**
     *  Load the image.
     *  @static
     *  @param {string} path - The image path
     *  @returns {Promise<HTMLImageElement>}
     */
    static loadImage(path: string): Promise<HTMLImageElement>;
    /**
     *  Load the picture and then check.
     *  @async
     */
    load(): Promise<void>;
    /**
     *  Create a copy of a picture2D.
     *  @returns {Picture2D}
     */
    createCopy(): Picture2D;
    /**
     *  Draw the picture on HUD
     *  @param {number} [x=undefined] - The x position
     *  @param {number} [y=undefined] - The y position
     *  @param {number} [w=undefined] - The w position
     *  @param {number} [h=undefined] - The h position
     *  @param {number} [sx=0] - The source x position
     *  @param {number} [sy=0] - The source x position
     *  @param {number} [sw=this.oW] - The source width size
     *  @param {number} [sh=this.oH] - The source height size
     *  @param {boolean} [positionResize=true] - Indicate if the position resize
     *  (screen resolution)
     */
    draw({ x, y, w, h, sx, sy, sw, sh, positionResize }?: {
        x?: number;
        y?: number;
        w?: number;
        h?: number;
        sx?: number;
        sy?: number;
        sw?: number;
        sh?: number;
        positionResize?: boolean;
    }): void;
}
interface pictureOptions {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    zoom?: number;
    opacity?: number;
    angle?: number;
    cover?: boolean;
    stretch?: boolean;
}
export { Picture2D };
