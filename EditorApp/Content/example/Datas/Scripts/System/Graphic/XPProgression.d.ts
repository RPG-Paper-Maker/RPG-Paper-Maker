import { Base } from "./Base.js";
import { Graphic } from "../index.js";
/** @class
 *  The graphic displaying all the progression for each character.
 *  @extends Graphic.Base
*/
declare class XPProgression extends Base {
    graphicCharacters: Graphic.Player[];
    constructor();
    /**
     *  Update graphics experience.
     */
    updateExperience(): void;
    /**
     *  Drawing the progression.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the progression.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    draw(x: number, y: number, w: number, h: number): void;
}
export { XPProgression };
