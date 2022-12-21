import { Bitmap } from "../Core/index.js";
/**
 *  @class
 *  The abstract class who model the Structure of graphics (inside window boxes).
 */
declare abstract class Base extends Bitmap {
    datas: Object;
    /** Drawing the stuff behind the window box.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawBehind(x: number, y: number, w: number, h: number): void;
    /**
     *  Update the content.
     */
    update(): void;
    /**
     *  Drawing the graphic.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     *  @param {boolean} positionResize - If checked, resize postion
     *  according to screen resolution
     */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the graphic in box.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     *  @param {boolean} positionResize - If checked, resize postion
     *  according to screen resolution
     */
    abstract draw(x: number, y: number, w: number, h: number): void;
}
export { Base };
