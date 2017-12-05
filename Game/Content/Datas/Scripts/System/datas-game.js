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
//  CLASS GameDatas
//
// -------------------------------------------------------

/** @class
*   All the global informations of the game.
*   @property {Object} settings All the general settings.
*   @property {DatasPictures} pictures Pictures datas.
*   @property {DatasCommonEvents} commonEvents Common events datas.
*   @property {DatasItems} items Items datas.
*   @property {DatasSkills} skills Skills datas.
*   @property {DatasWeapons} weapons Weapons datas.
*   @property {DatasArmors} armors Armors datas.
*   @property {DatasClasses} classes Classes datas.
*   @property {DatasSpecialElements} specialElements Special elements datas.
*   @property {DatasTilesets} tileset Tilesets datas.
*   @property {DatasHeroes} heroes Heroes datas.
*   @property {DatasMonsters} monsters Monsters datas.
*   @property {DatasTroops} troops Troops datas.
*   @property {DatasSystem} system System datas.
*   @property {DatasBattleSystem} battleSystem Battle System datas.
*   @property {DatasKeyBoard} keyBoard KeyBoard datas.
*/
function DatasGame(){
    this.pictures = new DatasPictures();
    this.commonEvents = new DatasCommonEvents();
    this.items = new DatasItems();
    this.skills = new DatasSkills();
    this.weapons = new DatasWeapons();
    this.armors = new DatasArmors();
    this.classes = new DatasClasses();
    this.specialElements = new DatasSpecialElements();
    this.tilesets = new DatasTilesets();
    this.heroes = new DatasHeroes();
    this.monsters = new DatasMonsters();
    this.troops = new DatasTroops();
    this.system = new DatasSystem();
    this.battleSystem = new DatasBattleSystem();
    this.keyBoard = new DatasKeyBoard();
    this.readSettings();
}

DatasGame.VARIABLES_PER_PAGE = 25;

DatasGame.prototype = {

    /** Read the JSON files associated to the settings.
    */
    readSettings: function(){
        this.settings = {};

        RPM.openFile(this, RPM.FILE_VARIABLES, true, function(res){
            var json = JSON.parse(res).variables;

            this.variablesNumbers =
                 json.length * DatasGame.VARIABLES_PER_PAGE + 1;
        });
    }
}
