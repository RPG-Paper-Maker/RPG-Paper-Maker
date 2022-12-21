import { Vector3 } from "./index.js";
/** @class
 *  The data class for portion.
 *  @param {number} x
 *  @param {number} y
 *  @param {number} z
 */
declare class Portion {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    /**
     *  Create a portion from an array.
     *  @static
     *  @param {number[]} array
     *  @returns {Portion}
     */
    static createFromArray(array: number[]): Portion;
    /**
     *  Create a portion from a three.js Vector3.
     *   @static
     *   @param {number[]} p - The array position
     *   @returns {number[]}
     */
    static createFromVector3(position: Vector3): Portion;
    /**
     *  Test if a portion is equal to another.
     *  @returns {boolean}
     */
    equals(portion: Portion): boolean;
    /**
     *  Get the portion file name.
     *  @returns {string}
     */
    getFileName(): string;
}
export { Portion };
