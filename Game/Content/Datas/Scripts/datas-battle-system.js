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
//  CLASS DatasBattleSystem
//
// -------------------------------------------------------

/** @class
*   All the battle system datas.
*   @property {SystemStatistic[]} statistics List of all the statistics.
*   @property {string[]} equipments List of all the equipments name.
*   @property {SystemElement[]} elements List of all the elements.
*   @property {SystemWeaponArmorKind[]} weaponsKind List of all the weapons
*   kind.
*   @property {SystemWeaponArmorKind[]} armorsKind List of all the armors kind.
*   @property {number[]} battleCommands List of all the battle
*   commands (skill ID).
*   @property {number} idLevelStatistic Id of the level statistic.
*   @property {number} idExpStatistic Id of the experience statistic.
*/
function DatasBattleSystem(){
    this.read();
}

DatasBattleSystem.prototype = {

    /** Read the JSON file associated to battle system.
    */
    read: function(){
        Wanok.openFile(this, Wanok.FILE_BATTLE_SYSTEM, true, function(res){
            var json = JSON.parse(res);
            var id;

            // Statistics
            var jsonStatistics = json.statistics;
            var i, l = jsonStatistics.length;
            this.statistics = new Array(l+1);
            this.statisticsOrder = new Array(l);
            for (i = 0; i < l; i++){
                var jsonStatistic = jsonStatistics[i];
                id = jsonStatistic.id;
                var statistic = new SystemStatistic();
                statistic.readJSON(jsonStatistic);
                this.statistics[id] = statistic;
                this.statisticsOrder[i] = id;
            }

            // Equipments
            var jsonEquipments = json.equipments;
            l = jsonEquipments.length;
            this.equipments = new Array(l+1);
            for (i = 0; i < l; i++){
                var jsonEquipment = jsonEquipments[i];
                id = jsonEquipment.id;
                this.equipments[id] = jsonEquipment.names[1];
            }

            // Elements
            var jsonElements = json.elements;
            l = jsonElements.length;
            this.elements = new Array(l+1);
            for (i = 0; i < l; i++){
                var jsonElement = jsonElements[i];
                id = jsonElement.id;
                var element = new SystemElement();
                element.readJSON(jsonElement);
                this.elements[id] = element;
            }

            // Weapons kind
            var jsonWeaponsKind = json.weaponsKind;
            l = jsonWeaponsKind.length;
            this.weaponsKind = new Array(l+1);
            for (i = 0; i < l; i++){
                var jsonWeaponKind = jsonWeaponsKind[i];
                id = jsonWeaponKind.id;
                var weaponKind = new SystemWeaponArmorKind();
                weaponKind.readJSON(jsonWeaponKind);
                this.weaponsKind[id] = weaponKind;
            }

            // Armors kind
            var jsonArmorsKind = json.armorsKind;
            l = jsonArmorsKind.length;
            this.armorsKind = new Array(l+1);
            for (i = 0; i < l; i++){
                var jsonArmorKind = jsonArmorsKind[i];
                id = jsonArmorKind.id;
                var armorKind = new SystemWeaponArmorKind();
                armorKind.readJSON(jsonArmorKind);
                this.armorsKind[id] = armorKind;
            }

            // Battle commands
            var jsonBattleCommands = json.battleCommands;
            l = jsonBattleCommands.length;
            this.battleCommands = new Array(l+1);
            this.battleCommandsOrder = new Array(l);
            for (i = 0; i < l; i++){
                var jsonBattleCommand = jsonBattleCommands[i];
                id = jsonBattleCommand.id;
                this.battleCommands[id] = jsonBattleCommand.s;
                this.battleCommandsOrder[i] = id;
            }

            // Ids of specific statistics
            this.idLevelStatistic = json.lv;
            this.idExpStatistic = json.xp;
        });
    },

    // -------------------------------------------------------

    /** Get the statistic corresponding to the level.
    *   @returns {SystemStatistic}
    */
    getLevelStatistic: function(){
        return this.statistics[this.idLevelStatistic];
    },

    // -------------------------------------------------------

    /** Get the statistic corresponding to the experience.
    *   @returns {SystemStatistic}
    */
    getExpStatistic: function(){
        return this.statistics[this.idExpStatistic];
    }
}
