import { System, Graphic } from "../index.js";
import { Base } from "./Base.js";
/** @class
 *  A class for all keyboard assign to display in screen.
 *  @param {System.Keyboard} kb
 */
declare class Keyboard extends Base {
    kb: System.Keyboard;
    graphicTextName: Graphic.Text;
    graphicTextShort: Graphic.Text;
    graphicTextInformation: Graphic.Text;
    constructor(kb: System.Keyboard);
    /**
     *  Update short sc.
     *  @param {number[][]} sh - The short list
     */
    updateShort(sh: number[][]): void;
    /**
     *  Drawing the keyboard in choice box.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the keyboard description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number): void;
}
export { Keyboard };
