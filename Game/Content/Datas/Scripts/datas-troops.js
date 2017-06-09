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
//  CLASS DatasTroops
//
// -------------------------------------------------------

/** @class
*   All the troops datas.
*   @property {SystemTroop[]} list List of all the troops of the game according
*   to ID.
*/
function DatasTroops(){
    this.read();
}

DatasTroops.prototype = {

    /**
    *   Read the JSON file associated to troops.
    */
    read: function(){
        Wanok.openFile(this, Wanok.FILE_TROOPS, true, function(res){
            var json = JSON.parse(res).troops;
            var i, l = json.length;
            this.list = new Array(l+1);

            // Sorting all the troops according to the ID
            for (i = 0; i < l; i++){
                var jsonTroop = json[i];
                var id = jsonTroop.id;
                var troop = new SystemTroop();
                troop.readJSON(jsonTroop);
                this.list[id] = troop;
            }
        });
    }
}
