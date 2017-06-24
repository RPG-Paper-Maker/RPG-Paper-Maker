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
//  All the global informations of the game.
//
//  @settings             -> Settings of the game
//  @commonEventsDatas    -> Common events datas
//  @itemsDatas           -> Items datas
//  @skillsDatas          -> Skills datas
//  @weaponsDatas         -> Weapons datas
//  @armorsDatas          -> Armors datas
//  @classesDatas         -> Classes datas
//  @heroesDatas          -> Heroes datas
//  @monstersDatas        -> Monsters datas
//  @troopsDatas          -> Troops datas
//  @systemDatas          -> System datas
//  @battleSystemDatas    -> Battle System datas
//  @keyBoardDatas        -> KeyBoard datas
//  @settings             -> All the general settings.
//
// -------------------------------------------------------

/** @class
*   All the global informations of the game.
*   @property {Object} settings All the general settings.
*   @property {DatasCommonEvents} commonEvents Common events datas.
*   @property {DatasCommonEvents} items Items datas.
*   @property {DatasCommonEvents} skills Skills datas.
*   @property {DatasCommonEvents} weapons Weapons datas.
*   @property {DatasCommonEvents} armors Armors datas.
*   @property {DatasCommonEvents} classes Classes datas.
*   @property {DatasCommonEvents} heroes Heroes datas.
*   @property {DatasCommonEvents} monsters Monsters datas.
*   @property {DatasCommonEvents} troops Troops datas.
*   @property {DatasCommonEvents} system System datas.
*   @property {DatasCommonEvents} battleSystem Battle System datas.
*   @property {DatasCommonEvents} keyBoard KeyBoard datas.
*/
function DatasGame(){
    this.commonEvents = new DatasCommonEvents();
    this.items = new DatasItems();
    this.skills = new DatasSkills();
    this.weapons = new DatasWeapons();
    this.armors = new DatasArmors();
    this.classes = new DatasClasses();
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

        Wanok.openFile(this, Wanok.FILE_VARIABLES, true, function(res){
            var json = JSON.parse(res).variables;

            this.variablesNumbers =
                 json.length * DatasGame.VARIABLES_PER_PAGE + 1;
        });
    }
}
