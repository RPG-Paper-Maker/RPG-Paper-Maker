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
*   @property {SystemCurrency[]} currencies List of all the currencies of the
*   game according to ID.
*/
function DatasSystem(){
    this.read();
}

DatasSystem.prototype = {

    /** Read the JSON file associated to system.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_SYSTEM, true, function(res){
            var json = JSON.parse(res);
            var jsonItemsTypes = json.itemsTypes;
            var i, l = jsonItemsTypes.length;
            this.itemsTypes = new Array(l+1);
            for (i = 0; i < l; i++)
                this.itemsTypes[jsonItemsTypes[i].id] = jsonItemsTypes[i].name;

            $SQUARE_SIZE = json.ss;
            $PORTIONS_RAY_NEAR = json.pr;
            $FRAMES = json.frames;

            // Path BR
            RPM.PATH_BR = "file:///" + json.pathBR + "/";

            // Hero beginning
            this.idMapStartHero = json.idMapHero;
            this.idObjectStartHero = json.idObjHero;
            this.getModelHero();

            // Currencies
            var jsonCurrencies = json.currencies;
            l = jsonCurrencies.length;
            this.currencies = new Array(l + 1);
            for (i = 0; i < l; i++){
                var jsonCurrency = jsonCurrencies[i];
                var id = jsonCurrency.id;
                var currency = new SystemCurrency();
                currency.readJSON(jsonCurrency);
                this.currencies[id] = currency;
            }
        });
    },

    // -------------------------------------------------------

    /** Update the $modelHero global variable by loading the hero model.
    */
    getModelHero: function(){
        var mapName = RPM.generateMapName(this.idMapStartHero);
        RPM.openFile(null, RPM.FILE_MAPS + mapName + RPM.FILE_MAP_OBJECTS,
                       true, function(res)
        {
            var json = JSON.parse(res).objs;
            var i, l;

            var jsonObject;
            l = json.length;
            var id = $datasGame.system.idObjectStartHero;
            var position;
            for (i = 0; i < l; i++){
                jsonObject = json[i];
                if (jsonObject.id === id){
                    position = jsonObject.p;
                    break;
                }
            }
            var globalPortion = SceneMap.getGlobalPortion(position);

            var fileName = SceneMap.getPortionName(globalPortion[0],
                                                   globalPortion[1],
                                                   globalPortion[2]);

            RPM.openFile(null, RPM.FILE_MAPS + mapName + "/" + fileName,
                           false, function(res){
                var json = JSON.parse(res);
                var mapPortion = new MapPortion(globalPortion[0],
                                                globalPortion[1],
                                                globalPortion[2]);

                // Update the hero model
                $modelHero = mapPortion.getHeroModel(json);
            });
        });
    },

    // -------------------------------------------------------

    /** Get the default array currencies for a default game.
    *   @returns {number[]}
    */
    getDefaultCurrencies: function(){
        var i, l = this.currencies.length;
        var list = new Array(l);

        for (i = 0; i < l; i++)
            list[i] = 0;

        return list;
    }
}
