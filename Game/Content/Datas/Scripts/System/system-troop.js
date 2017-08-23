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
//  CLASS SystemTroop
//
// -------------------------------------------------------

/** @class
*   A troop of the game.
*   @property {Object[]} list of the monsters (ids,level).
*/
function SystemTroop(){

}

SystemTroop.prototype = {

    /** Read the JSON associated to the troop.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        var jsonList = json.l;
        var i, l = jsonList.length;
        this.list = new Array(l);
        for (i = 0; i < l; i++){
            var jsonMonster = jsonList[i];
            this.list[i] = {
                id: jsonMonster.id,
                level: jsonMonster.l
            };
        }
    }
}
