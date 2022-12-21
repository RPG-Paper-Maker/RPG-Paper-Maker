/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Player } from "./Player.js";
import { Datas, Manager, Scene, System } from "../index.js";
import { Item } from "./Item.js";
import { Chrono } from "./Chrono.js";
import { MapObject } from "./MapObject.js";
import { Paths, Constants, Utils, Enum, Platform } from "../Common/index.js";
var GroupKind = Enum.GroupKind;
var CharacterKind = Enum.CharacterKind;
import { Vector3 } from "./Vector3.js";
/** @class
 *  All the global informations of a particular game.
 *  @param {number} slot - The number of the slot to load
 */
class Game {
    constructor(slot = -1) {
        this.chronometers = [];
        this.previousWeatherOptions = null;
        this.currentWeatherOptions = null;
        this.slot = slot;
        this.hero = new MapObject(Datas.Systems.modelHero.system, Datas.Systems
            .modelHero.position.clone(), true);
        this.battleMusic = Datas.BattleSystems.battleMusic;
        this.victoryMusic = Datas.BattleSystems.battleVictory;
        this.textures = {};
        this.textures.tilesets = {};
        this.textures.autotiles = {};
        this.textures.walls = {};
        this.textures.objects3D = {};
        this.textures.mountains = {};
        this.isEmpty = true;
    }
    /**
     *  Get the hero in a tab with instance ID.
     *  @static
     *  @param {Player[]} tab - The heroes tab
     *  @param {number} id - The instance ID
     *  @returns {GamePlayer}
     */
    static getHeroInstanceInTab(tab, id) {
        let hero;
        for (let i = 0, l = tab.length; i < l; i++) {
            hero = tab[i];
            if (hero.instid === id) {
                return hero;
            }
        }
        return null;
    }
    /**
     *  Load the game file.
     *  @async
     */
    async load() {
        let path = this.getPathSave();
        let json = await Platform.loadSave(this.slot, path);
        if (json === null) {
            return;
        }
        this.playTime = new Chrono(json.t);
        this.charactersInstances = json.inst;
        this.variables = json.vars;
        this.shops = json.shops;
        this.steps = Utils.defaultValue(json.steps, 0);
        this.saves = Utils.defaultValue(json.saves, 0);
        this.battles = Utils.defaultValue(json.battles, 0);
        this.chronometers = Utils.defaultValue(json.chronos, []).map((chrono) => {
            return new Chrono(chrono.t, chrono.id, true, chrono.d);
        });
        // Items
        this.items = [];
        Utils.readJSONSystemList({ list: json.itm, listIndexes: this.items,
            func: (json) => {
                return new Item(json.kind, json.id, json.nb);
            }
        });
        // Currencies
        this.currencies = [];
        for (let id in json.cur) {
            if (json.cur[id] !== null) {
                this.currencies[id] = json.cur[id];
            }
        }
        this.currenciesEarned = [];
        for (let id in json.cure) {
            if (json.cure[id] !== null) {
                this.currenciesEarned[id] = json.cure[id];
            }
        }
        this.currenciesUsed = [];
        for (let id in json.curu) {
            if (json.curu[id] !== null) {
                this.currenciesUsed[id] = json.curu[id];
            }
        }
        // Heroes
        this.teamHeroes = [];
        Utils.readJSONSystemList({ list: json.th, listIndexes: this.teamHeroes,
            func: (json) => {
                return new Player(json.kind, json.id, json.instid, json.sk, json
                    .status, json.name, json);
            }
        });
        this.reserveHeroes = [];
        Utils.readJSONSystemList({ list: json.sh, listIndexes: this
                .reserveHeroes, func: (json) => {
                return new Player(json.kind, json.id, json.instid, json.sk, json
                    .status, json.name, json);
            }
        });
        this.hiddenHeroes = [];
        Utils.readJSONSystemList({ list: json.hh, listIndexes: this.hiddenHeroes,
            func: (json) => {
                return new Player(json.kind, json.id, json.instid, json.sk, json
                    .status, json.name, json);
            }
        });
        // Map infos
        this.currentMapID = json.currentMapId;
        var positionHero = json.heroPosition;
        this.hero.position.set(positionHero[0], positionHero[1], positionHero[2]);
        this.heroStates = json.heroStates;
        this.heroProperties = json.heroProp;
        this.heroStatesOptions = json.heroStatesOpts;
        this.startupStates = json.startS;
        this.startupProperties = json.startP;
        this.mapsProperties = Utils.defaultValue(json.mapsP, {});
        this.mapsDatas = json.mapsDatas;
        if (json.textures) {
            this.textures = json.textures;
        }
        this.isEmpty = false;
    }
    /**
     *  Save a game file.
     *  @async
     */
    async save(slot) {
        if (!Utils.isUndefined(slot)) {
            this.slot = slot;
        }
        let l = this.teamHeroes.length;
        let teamHeroes = new Array(l);
        let i;
        for (i = 0; i < l; i++) {
            teamHeroes[i] = this.teamHeroes[i].getSaveCharacter();
        }
        l = this.reserveHeroes.length;
        let reserveHeroes = new Array(l);
        for (i = 0; i < l; i++) {
            reserveHeroes[i] = this.reserveHeroes[i].getSaveCharacter();
        }
        l = this.hiddenHeroes.length;
        let hiddenHeroes = new Array(l);
        for (i = 0; i < l; i++) {
            hiddenHeroes[i] = this.hiddenHeroes[i].getSaveCharacter();
        }
        l = this.items.length;
        let items = new Array(l);
        for (i = 0; i < l; i++) {
            items[i] = this.items[i].getSave();
        }
        this.saves++;
        await Platform.registerSave(slot, this.getPathSave(slot), {
            t: this.playTime.time,
            th: teamHeroes,
            sh: reserveHeroes,
            hh: hiddenHeroes,
            itm: items,
            cur: this.currencies,
            cure: this.currenciesEarned,
            curu: this.currenciesUsed,
            inst: this.charactersInstances,
            vars: this.variables,
            currentMapId: this.currentMapID,
            heroPosition: [this.hero.position.x, this.hero.position.y, this.hero
                    .position.z],
            heroStates: this.heroStates,
            heroProp: this.heroProperties,
            heroStatesOpts: this.heroStatesOptions,
            startS: this.startupStates,
            startP: this.startupProperties,
            mapsP: this.mapsProperties,
            shops: this.shops,
            steps: this.steps,
            saves: this.saves,
            battles: this.battles,
            chronos: this.chronometers.map((chrono) => {
                return {
                    t: chrono.time,
                    id: chrono.id,
                    d: chrono.graphic !== null
                };
            }),
            textures: this.textures,
            mapsDatas: this.getCompressedMapsDatas()
        });
    }
    /**
     *  Load the positions that were kept (keep position option).
     */
    async loadPositions() {
        let i, l, jp, j, k, w, h, id, objPortion, inf, datas, map, objectMap, movedObjects, objectMapMinMout;
        objectMap = objectMap = async (t) => {
            let obj = (await MapObject.searchOutMap(t[0])).object;
            obj.position = new Vector3(t[1], t[2], t[3]);
            obj.previousPosition = obj.position;
            return obj;
        };
        for (id in this.mapsDatas) {
            l = this.mapsDatas[id].length;
            map = null;
            // First initialize all moved objects
            movedObjects = [];
            objPortion = new Array(l);
            for (i = 0; i < l; i++) {
                objPortion[i] = new Array(2);
                for (jp = 0; jp < 2; jp++) {
                    h = this.mapsDatas[id][i][jp].length;
                    objPortion[i][jp] = new Array(h);
                    for (j = (jp === 0 ? 1 : 0); j < h; j++) {
                        w = this.mapsDatas[id][i][jp][j].length;
                        objPortion[i][jp][j] = new Array(w);
                        for (k = 0; k < w; k++) {
                            inf = {};
                            datas = this.mapsDatas[id][i][jp][j][k];
                            if (datas) {
                                if (datas.m && datas.m.length) {
                                    if (!map) {
                                        map = new Scene.Map(parseInt(id), false, true);
                                        Scene.Map.current = map;
                                        await map.initializeObjects();
                                    }
                                    datas.m = await Promise.all(datas.m.map(objectMap));
                                    movedObjects = movedObjects.concat(datas.m);
                                }
                            }
                        }
                    }
                }
            }
            // Associate min and mout
            objectMapMinMout = (i) => {
                return movedObjects[Utils.indexOfProp(movedObjects, "id", i)];
            };
            for (i = 0; i < l; i++) {
                objPortion[i] = new Array(2);
                for (jp = 0; jp < 2; jp++) {
                    h = this.mapsDatas[id][i][jp].length;
                    objPortion[i][jp] = new Array(h);
                    for (j = (jp === 0 ? 1 : 0); j < h; j++) {
                        w = this.mapsDatas[id][i][jp][j].length;
                        objPortion[i][jp][j] = new Array(w);
                        for (k = 0; k < w; k++) {
                            inf = {};
                            datas = this.mapsDatas[id][i][jp][j][k];
                            if (datas) {
                                if (datas.min && datas.min.length) {
                                    datas.min = datas.min.map(objectMapMinMout);
                                }
                                if (datas.mout && datas.mout.length) {
                                    datas.mout = datas.mout.map(objectMapMinMout);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     *  Get a compressed version of mapsDatas (don't retain meshs).
     *  @returns {Object}
     */
    getCompressedMapsDatas() {
        let obj = {};
        let i, l, jp, j, k, w, h, id, objPortion, inf, datas, o, tab;
        for (id in this.mapsDatas) {
            l = this.mapsDatas[id].length;
            objPortion = new Array(l);
            for (i = 0; i < l; i++) {
                objPortion[i] = new Array(2);
                for (jp = 0; jp < 2; jp++) {
                    h = this.mapsDatas[id][i][jp].length;
                    objPortion[i][jp] = new Array(h);
                    for (j = (jp === 0 ? 1 : 0); j < h; j++) {
                        w = this.mapsDatas[id][i][jp][j].length;
                        objPortion[i][jp][j] = new Array(w);
                        for (k = 0; k < w; k++) {
                            inf = {};
                            datas = this.mapsDatas[id][i][jp][j][k];
                            if (datas) {
                                if (datas.min && datas.min.length) {
                                    tab = [];
                                    for (o of datas.min) {
                                        if (o.currentStateInstance && o
                                            .currentStateInstance.keepPosition) {
                                            tab.push(o.system.id);
                                        }
                                    }
                                    if (tab.length) {
                                        inf.min = tab;
                                    }
                                }
                                if (datas.mout && datas.mout.length) {
                                    tab = [];
                                    for (o of datas.mout) {
                                        if (o.currentStateInstance && o
                                            .currentStateInstance.keepPosition) {
                                            tab.push(o.system.id);
                                        }
                                    }
                                    if (tab.length) {
                                        inf.mout = tab;
                                    }
                                }
                                if (datas.m && datas.m.length) {
                                    tab = [];
                                    for (o of datas.m) {
                                        if (o.currentStateInstance && o
                                            .currentStateInstance.keepPosition) {
                                            tab.push([o.system.id, o.position.x,
                                                o.position.y, o.position.z]);
                                        }
                                    }
                                    if (tab.length) {
                                        inf.m = tab;
                                    }
                                }
                                if (datas.si && datas.si.length) {
                                    inf.si = datas.si;
                                }
                                if (datas.s && datas.s.length) {
                                    inf.s = datas.s;
                                }
                                if (datas.pi && datas.pi.length) {
                                    inf.pi = datas.pi;
                                }
                                if (datas.p && datas.p.length) {
                                    inf.p = datas.p;
                                }
                                if (datas.soi && datas.soi.length) {
                                    inf.soi = datas.soi;
                                }
                                if (datas.so && datas.so.length) {
                                    inf.so = datas.so;
                                }
                            }
                            objPortion[i][jp][j][k] = datas ? inf : null;
                        }
                    }
                }
            }
            obj[id] = objPortion;
        }
        return obj;
    }
    /**
     *  Initialize a default game
     */
    initializeDefault() {
        this.teamHeroes = [];
        this.reserveHeroes = [];
        this.hiddenHeroes = [];
        this.items = [];
        this.currencies = Datas.Systems.getDefaultCurrencies();
        this.currenciesEarned = Datas.Systems.getDefaultCurrencies();
        this.currenciesUsed = Datas.Systems.getDefaultCurrencies();
        this.charactersInstances = 0;
        this.initializeVariables();
        this.currentMapID = Datas.Systems.ID_MAP_START_HERO;
        this.heroStates = [1];
        this.heroProperties = [];
        this.heroStatesOptions = [];
        this.startupStates = {};
        this.startupProperties = {};
        this.mapsProperties = {};
        for (let member of Datas.Systems.initialPartyMembers) {
            this.instanciateTeam(member.teamKind, member.characterKind, member
                .heroID.getValue(), member.level.getValue(), member
                .variableInstanceID.getValue(true));
        }
        this.mapsDatas = {};
        this.hero.initializeProperties();
        this.playTime = new Chrono(0);
        this.shops = {};
        this.steps = 0;
        this.saves = 0;
        this.battles = 0;
        this.isEmpty = false;
    }
    /**
     *  Initialize the default variables.
     */
    initializeVariables() {
        this.variables = new Array(Datas.Variables.variablesNumbers);
        for (let i = 0; i < Datas.Variables.variablesNumbers; i++) {
            this.variables[i] = 0;
        }
    }
    /**
     *  Instanciate a new character in a group in the game.
     *  @param {GroupKind} groupKind - In which group we should instanciate
     *  @param {CharacterKind} type - The type of character to instanciate
     *  @param {number} id - The ID of the character to instanciate
     *  @param {number} level - The player level
     *  @param {number} stockID - The ID of the variable where we will stock the
     *  instantiate ID
     *  @returns {Player}
     */
    instanciateTeam(groupKind, type, id, level, stockID) {
        // Stock the instanciation id in a variable
        this.variables[stockID] = this.charactersInstances;
        // Adding the instanciated character in the right group
        let player = new Player(type, id, this.charactersInstances++, [], []);
        player.instanciate(level);
        this.getTeam(groupKind).push(player);
        return player;
    }
    /**
     *  Get the teams list in a list.
     *  @returns {Player[][]}
     */
    getGroups() {
        return [this.teamHeroes, this.reserveHeroes, this.hiddenHeroes];
    }
    /**
     *  Get the path save according to slot.
     *  @param {number} [slot=undefined]
     *  @returns {string}
    */
    getPathSave(slot) {
        return Paths.SAVES + Constants.STRING_SLASH + (Utils.isUndefined(slot) ?
            this.slot : slot) + Constants.EXTENSION_JSON;
    }
    /**
     *  Get the variable by ID.
     *  @param {number} id
     *  @returns {any}
     */
    getVariable(id) {
        return Datas.Base.get(id, this.variables, "variable");
    }
    /**
     *  Get the currency by ID.
     *  @param {number} id
     *  @returns {any}
     */
    getCurrency(id) {
        return Datas.Base.get(id, this.currencies, "currency");
    }
    /**
     *  Get the currency earned by ID.
     *  @param {number} id
     *  @returns {any}
     */
    getCurrencyEarned(id) {
        return Datas.Base.get(id, this.currenciesEarned, "currency earned");
    }
    /**
     *  Get the currency used by ID.
     *  @param {number} id
     *  @returns {any}
     */
    getCurrencyUsed(id) {
        return Datas.Base.get(id, this.currenciesUsed, "currency used");
    }
    /**
     *  Get the hero with instance ID.
     *  @param {number} id - The instance ID
     *  @returns {Player}
     */
    getHeroByInstanceID(id) {
        let hero = Game.getHeroInstanceInTab(this.teamHeroes, id);
        if (hero !== null) {
            return hero;
        }
        hero = Game.getHeroInstanceInTab(this.reserveHeroes, id);
        if (hero !== null) {
            return hero;
        }
        hero = Game.getHeroInstanceInTab(this.hiddenHeroes, id);
        if (hero !== null) {
            return hero;
        }
        if (Scene.Map.current.isBattleMap) {
            return Game.getHeroInstanceInTab(Scene.Map.current
                .players[Enum.CharacterKind.Monster], id);
        }
        return null;
    }
    /**
     *  Use an item and remove it from inventory.
     *  @param {Item} item - The item
    */
    useItem(item) {
        if (!item.use()) {
            this.items.splice(this.items.indexOf(item), 1);
        }
    }
    /**
     *  Get the team according to group kind.
     *  @param {GroupKind} kind - The group kind
     *  @returns {Player[]}
     */
    getTeam(kind) {
        switch (kind) {
            case GroupKind.Team:
                return this.teamHeroes;
            case GroupKind.Reserve:
                return this.reserveHeroes;
            case GroupKind.Hidden:
                return this.hiddenHeroes;
            case GroupKind.Troop:
                return Scene.Map.current.players[CharacterKind.Monster];
        }
    }
    /**
     *  Get the portions datas according to id and position.
     *  @param {number} id - The map id
     *  @param {Portion} portion - The portion
     *  @returns {Record<string, any>}
    */
    getPortionDatas(id, portion) {
        return this.getPortionPosDatas(id, portion.x, portion.y, portion.z);
    }
    /**
     *  Get the portions datas according to id and position.
     *  @param {number} id - The map id
     *  @param {number} i
     *  @param {number} j
     *  @param {number} k
     *  @returns {Record<string, any>}
    */
    getPortionPosDatas(id, i, j, k) {
        let datas = this.mapsDatas[id][i];
        if (Utils.isUndefined(datas)) {
            return {};
        }
        datas = datas[j < 0 ? 0 : 1];
        if (Utils.isUndefined(datas)) {
            return {};
        }
        datas = datas[Math.abs(j)];
        if (Utils.isUndefined(datas)) {
            return {};
        }
        datas = datas[k];
        if (Utils.isUndefined(datas)) {
            return {};
        }
        return datas;
    }
    /**
     *  Get a chrono ID.
     *  @returns {number}
    */
    getNewChronoID() {
        let id = 0;
        let test = false;
        let chrono;
        while (!test) {
            test = true;
            for (chrono of this.chronometers) {
                if (chrono.id === id) {
                    id++;
                    test = false;
                    break;
                }
            }
        }
        return id;
    }
    /**
     *  Update.
     */
    update() {
        this.playTime.update();
        for (let chrono of this.chronometers) {
            if (chrono.update()) {
                Manager.Events.sendEvent(null, 0, 1, true, 2, [null, System
                        .DynamicValue.createNumber(chrono.id)], true, false);
            }
        }
    }
    /**
     *  Draw the HUD.
     */
    drawHUD() {
        for (let chrono of this.chronometers) {
            chrono.drawHUD();
        }
    }
}
Game.current = null;
export { Game };
