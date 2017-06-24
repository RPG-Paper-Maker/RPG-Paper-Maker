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

/**
*   Enum for the different items kind.
*   @enum {number}
*   @readonly
*/
var ItemKind = {
     Item: 0,
     Weapon: 1,
     Armor: 2
};
Object.freeze(ItemKind);

/**
*   Enum for the different players kind.
*   @enum {number}
*   @readonly
*/
var CharacterKind = {
    Hero: 0,
    Monster: 1
}

Object.freeze(CharacterKind);

/**
*   Enum for the different groups kind.
*   @enum {number}
*   @readonly
*/
var GroupKind = {
    Team: 0,
    Reserve: 1,
    Hidden: 2
}
Object.freeze(GroupKind);

// -------------------------------------------------------
//
//  CLASS Game
//
// -------------------------------------------------------

/** @class
*   All the global informations of a particular game.
*   @property {number} playTime The current time played since the beginning of
*   the game in seconds.
*   @property {number} teamHeroes List of all the heroes in the team.
*   @property {number} reserveHeroes List of all the heroes in the reserve.
*   @property {number} hiddenHeroes List of all the hidden heroes.
*   @property {number} items List of all the items, weapons, and armors in the
*   inventory.
*   @property {number} charactersInstances IDs of the last instance character.
*   @property {number} hero Hero informations.
*   @property {number} mapsDatas All the informations for each maps.
*/
function Game(){
    this.currentSlot = -1;
    this.hero = $modelHero;
}

Game.prototype = {

    /** Initialize a default game.
    */
    initializeDefault: function(){
        this.playTime = 0;
        this.teamHeroes = [];
        this.reserveHeroes = [];
        this.hiddenHeroes = [];
        this.items = [];
        this.charactersInstances = 0;
        this.initializeVariables();
        this.currentMapId = $datasGame.system.idMapStartHero;
        this.heroStates = [1];
        EventCommandModifyTeam.instanciateTeam(GroupKind.Team,
                                               CharacterKind.Hero, 1, 1, 1);
        this.mapsDatas = {};
    },

    // -------------------------------------------------------

    /** Initialize the default variables.
    */
    initializeVariables: function(){
        this.variables = new Array($datasGame.variablesNumbers);
        for (var i = 0; i < $datasGame.variablesNumbers; i++)
            this.variables[i] = null;
    },

    // -------------------------------------------------------

    /** Read a game file.
    *   @param {number} slot The number of the slot to load.
    *   @param {Object} json json Json object describing the object.
    */
    read: function(slot, json){
        this.currentSlot = slot;
        this.playTime = json.t;
        this.charactersInstances = json.inst;
        this.variables = json.vars;

        // Items
        var itemsJson = json.itm;
        var i, l = itemsJson.length;
        this.items = new Array(l);
        for (i = 0; i < l; i++){
            var itemJson = itemsJson[i];
            this.items[i] = new Item(itemJson.k, itemJson.id, itemJson.nb);
        }

        // Heroes
        var heroesJson = json.th;
        l = heroesJson.length
        this.teamHeroes = new Array(l);
        var heroJson, character;
        for (i = 0; i < l; i++){
            heroJson = heroesJson[i];
            character = new GamePlayer(heroJson.k, heroJson.id, heroJson.instid,
                                       heroJson.sk);
            character.readJSON(heroJson, this.items);
            this.teamHeroes[i] = character;
        }
        heroesJson = json.sh;
        l = heroesJson.length
        this.reserveHeroes = new Array(l);
        for (i = 0; i < l; i++){
            heroJson = heroesJson[i];
            character = new GamePlayer(heroJson.k, heroJson.id, heroJson.instid,
                                       heroJson.sk);
            character.readJSON(heroJson, this.items);
            this.reserveHeroes[i] = character;
        }
        heroesJson = json.hh;
        l = heroesJson.length
        this.hiddenHeroes = new Array(l);
        for (i = 0; i < l; i++){
            heroJson = heroesJson[i];
            character = new GamePlayer(heroJson.k, heroJson.id, heroJson.instid,
                                       heroJson.sk);
            character.readJSON(heroJson, this.items);
            this.hiddenHeroes[i] = character;
        }

        // Map infos
        this.currentMapId = json.currentMapId;
        var positionHero = json.heroPosition;
        this.hero.mesh.position.set(positionHero[0], positionHero[1],
                                    positionHero[2]);
        this.heroStates = json.heroStates;
        this.readMapsDatas(json.mapsDatas);
    },

    /** Read all the maps datas.
    *   @param {Object} json Json object describing the maps datas.
    */
    readMapsDatas: function(json){
        this.mapsDatas = json;
    },

    /** Save a game file.
    *   @param {number} slot The number of the slot to save.
    */
    write: function(slot){
        this.currentSlot = slot;
        var i, l = this.teamHeroes.length;
        var teamHeroes = new Array(l);
        for (i = 0; i < l; i++)
            teamHeroes[i] = this.teamHeroes[i].getSaveCharacter();
        l = this.reserveHeroes.length;
        var reserveHeroes = new Array(l);
        for (i = 0; i < l; i++)
            reserveHeroes[i] = this.reserveHeroes[i].getSaveCharacter();
        l = this.hiddenHeroes.length;
        var hiddenHeroes = new Array(l);
        for (i = 0; i < l; i++)
            hiddenHeroes[i] = this.hiddenHeroes[i].getSaveCharacter();

        Wanok.openFile(this, Wanok.FILE_SAVE, true, function(res){
            var jsonList = JSON.parse(res);
            jsonList[slot - 1] =
            {
                t: this.playTime,
                th: teamHeroes,
                sh: reserveHeroes,
                hh: hiddenHeroes,
                itm: this.items,
                inst: this.charactersInstances,
                vars: this.variables,
                currentMapId: this.currentMapId,
                heroPosition: [this.hero.mesh.position.x,
                               this.hero.mesh.position.y,
                               this.hero.mesh.position.z],
                heroStates: this.heroStates,
                mapsDatas : this.getCompressedMapsDatas()
            };
            Wanok.saveFile(Wanok.FILE_SAVE, jsonList);
        });
    },

    /** Get a compressed version of mapsDatas (don't retain meshs).
    *   @returns {Object}
    */
    getCompressedMapsDatas: function(){
        var obj = {};

        return obj;
    }
}
