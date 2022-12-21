import { Base } from "./Base.js";
import { Graphic } from "../index.js";
/** @class
 *  The graphic displaying all currencies when in shop menu.
 *  @extends Graphic.Base
 */
declare class ShopCurrencies extends Base {
    currencies: Graphic.TextIcon[];
    constructor();
    getWidth(): number;
    /**
     *  Update the currencies.
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
export { ShopCurrencies };
