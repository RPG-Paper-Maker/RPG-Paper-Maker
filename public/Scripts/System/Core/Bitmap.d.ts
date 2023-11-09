/** @class
 *  A bitmap is something that can be drawn on the HUD. It can be a window,
 *  a text, an image...
 *  @param {number} [x=0] - x coord of the bitmap
 *  @param {number} [y=0] - y coord of the bitmap
 *  @param {number} [w=0] - w coord of the bitmap
 *  @param {number} [h=0] - h coord of the bitmap
 */
declare class Bitmap {
    oX: number;
    oY: number;
    oW: number;
    oH: number;
    x: number;
    y: number;
    w: number;
    h: number;
    constructor(x?: number, y?: number, w?: number, h?: number);
    /**
     *  Set the x value.
     *  @param {number} x - The x value
     *  @param {boolean} [min=false] - If checked, transform screen value with min
     *  x y
     */
    setX(x: number, min?: boolean): void;
    /**
     *  Set the y value.
     *  @param {number} y - The y value
     *  @param {boolean} [min=false] - If checked, transform screen value with min
     *  x y
     */
    setY(y: number, min?: boolean): void;
    /**
     *  Set the w value.
     *  @param {number} w - The w value
     *  @param {boolean} [min=false] - If checked, transform screen value with min
     *  x y
     */
    setW(w: number, min?: boolean): void;
    /**
     *  Set the h value.
     *  @param {number} h - The h value
     *  @param {boolean} [min=false] - If checked, transform screen value with min
     *  x y
     */
    setH(h: number, min?: boolean): void;
    /**
     *  Set the position to the left.
     */
    setLeft(offset?: number): void;
    /**
     *  Set the position to the top.
     */
    setTop(offset?: number): void;
    /**
     *  Set the position to the right.
     */
    setRight(faceset?: boolean, offset?: number): void;
    /**
     *  Set the position to the bot.
     */
    setBot(faceset?: boolean, offset?: number): void;
    /**
     *  Set all the coords values.
     *  @param {number} x - The x value
     *  @param {number} y - The y value
     *  @param {number} w - The w value
     *  @param {number} h - The h value
     */
    setCoords(x: number, y: number, w: number, h: number): void;
    /**
     *  Check if x and y coords are inside.
     *  @param {number} x
     *  @param {number} y
     *  @returns {boolean}
     */
    isInside(x: number, y: number): boolean;
}
export { Bitmap };
