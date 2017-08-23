/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS GraphicEquip
//
// -------------------------------------------------------

/** @class
*   The graphic displaying all the equipment information in the equip menu.
*   @property {GraphicText} graphicEquipmentName All the equipment kind names
*   graphics.
*   @property {GraphicText} graphicEquipment All the equipment names graphics.
*   @property {number} equipmentLength The max length of the equipment names.
*   @param {GamePlayer} gamePlayer The current selected player.
*   @param {number} index Index of the equiped item.
*   @param {number} length Max length of equipment kind name.
*/
function GraphicEquip(gamePlayer, id, length){
    var character, equiped;

    character = gamePlayer.getCharacterInformations();
    equiped = gamePlayer.equip[id];
    this.equipmentLength = length;

    // All the graphics
    this.graphicEquipmentName =
         new GraphicText($datasGame.battleSystem.equipments[id], Align.Left);
    if (equiped === null)
        this.graphicEquipment = new GraphicText("-", Align.Left);
    else{
        this.graphicEquipment =
             new GraphicText(equiped.getItemInformations().name, Align.Left);
    }
}

GraphicEquip.prototype = {

    /** Drawing the equipment kind and equipment name.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(context, x, y, w, h){
        this.graphicEquipmentName.draw(context, x, y, w, h);
        this.graphicEquipment.draw(context,
                                   x + this.equipmentLength + 10,
                                   y,
                                   w,
                                   h);
    }
}
