import { Anchor2D } from "./Anchor2D.js";
/** @class
 *  The data class for anchors.
 *  @property {number} x
 *  @property {number} y
 *  @property {number} width
 *  @property {number} height
 *  @property {Anchor2D} anchor
 *  @param {number} [x=0]
 *  @param {number} [y=0]
 *  @param {number} [width=1]
 *  @param {number} [height=1]
 */
declare class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    anchor: Anchor2D;
    constructor(x?: number, y?: number, width?: number, height?: number);
    /**
     *  Create a rectangle from an array.
     *  @static
     *  @param {number[]} array
     */
    static createFromArray(array: number[]): Rectangle;
    /**
     *  Move rectangle to x, y.
     *  @param {number} x
     *  @param {number} y
     */
    move(x: number, y: number): void;
    /**
     *  Resize rectangle with width and height value.
     *  @param {number} width
     *  @param {number} height
     */
    resize(width: number, height: number): void;
    /**
     *  Move and resize rectangle.
     *  @param {number} x
     *  @param {number} y
     *  @param {number} width
     *  @param {number} height
     */
    set(x: number, y: number, width: number, height: number): void;
    /**
     *  Set rectangle coords.
     *  @param {number} x
     *  @param {number} y
     *  @param {number} width
     *  @param {number} height
     */
    setCoords(x: number, y: number, width: number, height: number): void;
    /**
     *  Set the anchor x, y.
     *  @param {number} x
     *  @param {number} y
     */
    setAnchor(x: number, y: number): void;
    /**
     *  Preset anchor.
     *  @param {{ x: - number, y: number }} anchorPreset
     */
    presetAnchor(anchorPreset: {
        x: number;
        y: number;
    }): void;
    /**
     *  Check if x and y are inside the rectangle.
     *  @param {number} x
     *  @param {number} y
     *  @returns {boolean}
     */
    isInside(x: number, y: number): boolean;
}
export { Rectangle };
