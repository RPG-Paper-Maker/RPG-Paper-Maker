import { Base } from "./Base.js";
import { Graphic } from "../index.js";
/** @class
 *  The graphic displaying all currencies and play time in scene menu.
 *  @extends Graphic.Base
 */
declare class TimeCurrencies extends Base {
    currencies: Graphic.TextIcon[];
    time: number;
    graphicPlayTime: Graphic.Text;
    height: number;
    offset: number;
    constructor();
    /**
     *  Update the play time
     */
    update(): void;
    /**
     *  Drawing the content choice.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the content.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    draw(x: number, y: number, w: number, h: number): void;
}
export { TimeCurrencies };
