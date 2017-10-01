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
//  CLASS DatasSpecialElements
//
// -------------------------------------------------------

/** @class
*   All the special elements datas.
*   @property {SystemWall[]} walls List of all the walls of the game
*   according to ID.
*/
function DatasSpecialElements(){
    this.read();
}

DatasSpecialElements.prototype = {

    /** Read the JSON file associated to pictures.
    */
    read: function(){
        Wanok.openFile(this, Wanok.FILE_SPECIAL_ELEMENTS, true, function(res){
            var json, jsonWalls, jsonWall;
            var wall;
            var i, l, id;

            json = JSON.parse(res);

            // Walls
            jsonWalls = json.walls;
            l = jsonWalls.length;
            this.walls = new Array(l+1);

            // Sorting all the weapons according to the ID
            for (i = 0; i < l; i++){
                jsonWall = jsonWalls[i];
                id = jsonWall.id;
                wall = new SystemWall();
                wall.readJSON(jsonWall);
                this.walls[id] = wall;
            }
        });
    }
}
