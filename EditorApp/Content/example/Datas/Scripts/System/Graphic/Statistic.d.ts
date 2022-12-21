import { Graphic, Core, System } from "../index.js";
import { Base } from "./Base.js";
/** @class
 *  The graphic displaying the player minimal stats informations.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 *  @param {boolean} [reverse=false] - Indicate if the faceset should be reversed
 */
declare class Statistic extends Base {
    player: Core.Player;
    statistic: System.Statistic;
    graphicName: Graphic.Text;
    graphicValue: Graphic.Text;
    pictureBar: System.Picture;
    maxStatNamesLength: number;
    constructor(player: Core.Player, statistic: System.Statistic, offsetStat?: number);
    /**
     *  Set the font size and the final font.
     *  @param {number} fontSize - The new font size
     */
    setFontSize(fontSize: number): void;
    /**
     *  Update the graphics
     */
    update(): void;
    /**
     *  Drawing statistic bar.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing statistic bar.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    draw(x: number, y: number, w: number, h: number): void;
}
export { Statistic };
