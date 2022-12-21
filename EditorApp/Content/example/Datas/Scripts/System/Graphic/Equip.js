/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Graphic, Datas, System } from "../index.js";
import { Constants, ScreenResolution } from "../Common/index.js";
/** @class
 *  The graphic displaying all the equipment information in the equip menu.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 *  @param {number} id - The equipment ID
 *  @param {number} length - Max length of equipment kind name
 */
class Equip extends Base {
    constructor(player, id, length, isPossible) {
        super();
        this.length = ScreenResolution.getScreenMinXY(length);
        this.isPossible = isPossible;
        let equiped = player.equip[id];
        // All the graphics
        this.graphicEquipmentName = new Graphic.Text(Datas.BattleSystems
            .getEquipment(id).name(), isPossible ? {} : { color: System.Color.GREY });
        this.graphicEquipment = new Graphic.Text(equiped === null ? "-" :
            equiped.system.name(), isPossible ? {} : { color: System.Color.GREY });
    }
    /**
     *  Drawing the equipment kind and equipment name.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x, y, w, h) {
        this.graphicEquipmentName.draw(x, y, w, h);
        this.graphicEquipment.draw(x + this.length + ScreenResolution
            .getScreenMinXY(Constants.LARGE_SPACE), y, w, h);
    }
    /**
     *  Drawing the equipment kind and equipment name.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x, y, w, h) {
        this.drawChoice(x, y, w, h);
    }
}
export { Equip };
