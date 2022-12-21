import { Game } from "../Core/index.js";
import { Graphic } from "../index.js";
import { Base } from "./Base.js";
/** @class
 *  The graphic displaying a save.
 *  @extends Graphic.Base
 *  @param {Game} game
 */
declare class Save extends Base {
    game: Game;
    graphicSlot: Graphic.Text;
    graphicEmpty: Graphic.Text;
    graphicTimer: Graphic.Text;
    graphicPlayers: Graphic.Player[];
    constructor(game: Game);
    /**
     *  Update the battler graphics.
     */
    update(): void;
    /**
     *  Drawing the save slot.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /** Drawing the save informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number): void;
}
export { Save };
