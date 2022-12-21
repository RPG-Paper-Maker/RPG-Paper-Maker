import { Graphic } from "../index.js";
import { Base } from "./Base.js";
/** @class
 *  The graphic displaying spinbox inside.
 *  @extends Graphic.Base
 */
declare class SpinBox extends Base {
    graphicTimes: Graphic.Text;
    graphicValue: Graphic.Text;
    value: number;
    times: boolean;
    constructor(value: number, times?: boolean);
    /**
     *  Update value.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    setValue(value: number): void;
    /**
     *  Drawing the skill or item use informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the skill or item use informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number): void;
}
export { SpinBox };
