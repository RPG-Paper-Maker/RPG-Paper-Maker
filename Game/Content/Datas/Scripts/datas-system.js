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
//  CLASS DatasSystem
//
// -------------------------------------------------------

/** @class
*   All the system datas.
*   @property {string[]} itemsTypes List of all the possible types of items of
*   the game according to ID.
*   @property {number} idMapStartHero Id of the map where the hero is in the
*   beginning of a game.
*   @property {number} idObjectStartHero Id of the object where the hero is in
*   the beginning of a game.
*/
function DatasSystem(){
    this.read();
}

DatasSystem.prototype = {

    /** Read the JSON file associated to system.
    */
    read: function(){
        Wanok.openFile(this, Wanok.FILE_SYSTEM, true, function(res){
            var json = JSON.parse(res);
            var jsonItemsTypes = json.itemsTypes;
            var i, l = jsonItemsTypes.length;
            this.itemsTypes = new Array(l+1);
            for (i = 0; i < l; i++)
                this.itemsTypes[jsonItemsTypes[i].id] = jsonItemsTypes[i].name;

            $SQUARE_SIZE = json.ss;
            $PORTIONS_RAY_NEAR = json.pr;

            // Hero beginning
            this.idMapStartHero = json.idMapHero;
            this.idObjectStartHero = json.idObjHero;

            this.getModelHero();
        });
    },

    // -------------------------------------------------------

    /** Update the $modelHero global variable by loading the hero model.
    */
    getModelHero: function(){
        var mapName = Wanok.generateMapName(this.idMapStartHero);
        Wanok.openFile(null, Wanok.FILE_MAPS + mapName + Wanok.FILE_MAP_OBJECTS,
                       true, function(res)
        {
            var json = JSON.parse(res).objs;
            var i, l;

            var jsonObject;
            l = json.length;
            var id = $datasGame.system.idObjectStartHero;
            var portion;
            for (i = 0; i < l; i++){
                jsonObject = json[i];
                if (jsonObject.id === id){
                    portion = jsonObject.p;
                    break;
                }
            }

            var fileName = SceneMap.getPortionName(portion[0], portion[1],
                                                   portion[2]);

            Wanok.openFile(null, Wanok.FILE_MAPS + mapName + "/" + fileName,
                           false, function(res){
                var json = JSON.parse(res);
                var mapPortion = new MapPortion(portion[0], portion[1],
                                                portion[2]);

                // Update the hero model
                $modelHero = mapPortion.getHeroModel(json);
            });
        });
    }
}
