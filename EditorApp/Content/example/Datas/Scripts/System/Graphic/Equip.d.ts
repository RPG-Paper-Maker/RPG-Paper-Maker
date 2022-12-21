import { Base } from "./Base.js";
import { Player } from "../Core/index.js";
import { Graphic } from "../index.js";
/** @class
 *  The graphic displaying all the equipment information in the equip menu.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 *  @param {number} id - The equipment ID
 *  @param {number} length - Max length of equipment kind name
 */
declare class Equip extends Base {
    length: number;
    isPossible: boolean;
    graphicEquipmentName: Graphic.Text;
    graphicEquipment: Graphic.Text;
    constructor(player: Player, id: number, length: number, isPossible: boolean);
    /**
     *  Drawing the equipment kind and equipment name.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the equipment kind and equipment name.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number): void;
}
export { Equip };
