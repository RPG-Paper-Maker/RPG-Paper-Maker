import { Base } from "./Base.js";
import { Graphic } from "../index.js";
import { Item } from "../Core/index.js";
/** @class
 *  The graphic displaying all the items dropped at the end of a battle.
 *  @extends Graphic.Base
 */
declare class Loots extends Base {
    graphicsLoots: Graphic.Item[];
    constructor(loots: Record<string, Item>[], nb: number);
    /**
     *  Drawing the loots.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x?: number, y?: number, w?: number, h?: number): void;
    /**
     *  Drawing the loots.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number): void;
}
export { Loots };
