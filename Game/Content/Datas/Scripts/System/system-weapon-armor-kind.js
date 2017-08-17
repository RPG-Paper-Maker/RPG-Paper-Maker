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
//  CLASS SystemWeaponArmorKind
//
// -------------------------------------------------------

/** @class
*   A weapon/armor kind of the game.
*   @property {string} name The name of the weapon / armor kind.
*   @property {boolean[]} equipments List of booleans indicating which equipment
*   is ok.
*/
function SystemWeaponArmorKind(){

}

SystemWeaponArmorKind.prototype = {

    /** Read the JSON associated to the weapon / armor kind.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.name = json.names[1];
        this.equipments = json.equipment;
        this.equipments.unshift(false);
    }
}
