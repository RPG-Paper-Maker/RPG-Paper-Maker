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
//  CLASS Battler
//
// -------------------------------------------------------

/** @class
*   A battler in a battle (ally or ennemy).
*   @property {WindowBox} rect (temporary)
*   @property {Player} character The character properties.
*   @property {boolean} active Indicate if the battler already attacked or not.
*   @param {Player} character The character properties.
*   @param {number} x Coords of battler.
*   @param {number} y Coords of battler.
*   @param {number} w Coords of battler.
*   @param {number} h Coords of battler.
*/
function Battler(character, x, y, w, h){
    this.character = character;
    this.rect = new WindowBox(x, y, w, h);
    this.active = true;
}

Battler.prototype = {

    /**
    *   Draw the battler.
    *   @param {Context} context The canvas context.
    */
    draw: function(context){
        this.rect.draw(context);
    }
}
