import { Portion } from "./Portion.js";
import { Vector3 } from "./Vector3.js";
/** @class
 *  The data class for position.
 *  @extends Portion
 *  @param {number} x - The x position square
 *  @param {number} y - The y position square
 *  @param {number} z - The z position square
 *  @param {number} yPixels - The y position pixels to add to the square y
 *  @param {number} layer - The layer position
 *  @param {number} centerX - The center X position on the square in %
 *  @param {number} centerZ - The center Z position on the square in %
 *  @param {number} angleY - The angle on Y axis in degree
 *  @param {number} angleX - The angle on X axis in degree
 *  @param {number} angleZ - The angle on Z axis in degree
 *  @param {number} scaleX - The scale on X axis multiple
 *  @param {number} scaleY - The scale on Y axis multiple
 *  @param {number} scaleZ - The scale on Z axis multiple
 */
declare class Position extends Portion {
    yPixels: number;
    layer: number;
    centerX: number;
    centerZ: number;
    angleY: number;
    angleX: number;
    angleZ: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    constructor(x?: number, y?: number, z?: number, yPixels?: number, layer?: number, centerX?: number, centerZ?: number, angleY?: number, angleX?: number, angleZ?: number, scaleX?: number, scaleY?: number, scaleZ?: number);
    /**
     *  Create a position from an array.
     *  @static
     *  @param {number[]} array
     *  @returns {Position}
     */
    static createFromArray(array: number[]): Position;
    /**
     *  Create a position from a three.js vector3.
     *  @static
     *  @param {Vector3} position
     *  @returns {Position}
     */
    static createFromVector3(position: Vector3): Position;
    /**
     *  Test if a position is equal to another.
     *  @returns {boolean}
     */
    equals(position: Position): boolean;
    /**
     *  Get the complete number of Y of a position.
     *   @returns {number}
     */
    getTotalY(): number;
    /**
     *  Get the complete number of pixels for x center.
     *  @returns {number}
     */
    getPixelsCenterX(): number;
    /**
     *  Get the complete number of pixels for z center.
     *  @returns {number}
     */
    getPixelsCenterZ(): number;
    /**
     *  Get the global portion of a json position.
     *  @returns {Portion}
     */
    getGlobalPortion(): Portion;
    /**
     *  Transform a position to a Vector3.
     *  @returns {Vector3}
     */
    toVector3(center?: boolean): Vector3;
    /**
     *  Transform a position to a scaling Vector3.
     *  @returns {Vector3}
     */
    toScaleVector(): Vector3;
    /**
     *  Transform a position to index position on X/Z axis (used for map
     *  portion bounding boxes).
     *  @returns {number}
     */
    toIndex(): number;
}
export { Position };
