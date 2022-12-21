import { Base } from "./Base.js";
import { Vector3 } from "../Core/index.js";
/** @class
 *  The system color class.
 *  @extends {System.Base}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the color
 */
declare class Color extends Base {
    static GREEN: Color;
    static RED: Color;
    static WHITE: Color;
    static BLACK: Color;
    static GREY: Color;
    red: number;
    green: number;
    blue: number;
    alpha: number;
    rgb: string;
    color: THREE.Color;
    constructor(json?: Record<string, any>);
    /**
     *  Create a new color according to RGBA values.
     *  @static
     *  @param {number} r - The red color between 0 and 255
     *  @param {number} g - The green color between 0 and 255
     *  @param {number} b - The blue color between 0 and 255
     *  @param {number} a - The alpha value between 0 and 255
     *  @returns {Color}
     */
    static createColor(r: number, g: number, b: number, a?: number): Color;
    /**
     *  Used for mixing vectors according to alpha in getHex algorithm.
     *  @static
     *  @param {Vector3} x - The x position
     *  @param {Vector3} y - The y position
     *  @param {number} aThe - alpha value between 0 and 1
     *  @returns {Vector3}
     */
    static mix(x: Vector3, y: Vector3, a: number): Vector3;
    /**
     *  Initialize the color according to RGBA values.
     *  @param {number} r - The red color between 0 and 255
     *  @param {number} g - The green color between 0 and 255
     *  @param {number} b - The blue color between 0 and 255
     *  @param {number} a - The alpha value between 0 and 255
     */
    initialize(r: number, g: number, b: number, a?: number): void;
    /**
     *  Read the JSON associated to the color.
     *  @param {Record<string, any>} - json Json object describing the color
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the hex value of the color.
     *  @param {THREE.Vector4} tone - The tone value
     *  @returns {string}
     */
    getHex(tone?: THREE.Vector4): string;
}
export { Color };
