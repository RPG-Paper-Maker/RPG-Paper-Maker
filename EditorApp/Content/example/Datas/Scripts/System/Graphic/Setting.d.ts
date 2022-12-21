import { Base } from "./Base.js";
import { Graphic } from "../index.js";
/** @class
 *  A class for all settings to display in screen.
 *  @extends Graphic.Base
 *  @param {number} id -
 */
declare class Setting extends Base {
    graphicRight: Graphic.Text;
    graphicTextLeft: Graphic.Text;
    graphicTextInformation: Graphic.Text;
    constructor(id: number);
    /**
     *  Drawing the choice.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the settings informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    draw(x: number, y: number, w: number, h: number): void;
}
export { Setting };
