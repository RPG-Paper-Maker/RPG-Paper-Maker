/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Utils } from "../Common/index.js";
import { System } from "../index.js";
/** @class
 *  A custom plugin in the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  plugin
 */
class Plugin extends Base {
    constructor(id, json) {
        super(json);
        this.id = id;
    }
    /**
     *  Read the JSON associated to the plugin.
     *  @param {Record<string, any>} - json Json object describing the plugin
     */
    read(json) {
        this.name = json.name;
        this.isOn = Utils.defaultValue(json.isOn, true);
        this.author = Utils.defaultValue(json.author, "");
        this.version = Utils.defaultValue(json.version, "1.0.0");
        this.parameters = {};
        let jsonList = Utils.defaultValue(json.parameters, []);
        let obj, jsonObj;
        let i, l;
        for (i = 0, l = jsonList.length; i < l; i++) {
            jsonObj = jsonList[i];
            obj = System.DynamicValue.readOrDefaultNumber(jsonObj.defaultValue);
            this.parameters[jsonObj.name] = obj;
        }
        this.commands = {};
        this.commandsNames = [];
        jsonList = Utils.defaultValue(json.commands, []);
        for (i = 0, l = jsonList.length; i < l; i++) {
            jsonObj = jsonList[i];
            this.commands[jsonObj.name] = null;
            this.commandsNames[jsonObj.id] = jsonObj.name;
        }
    }
}
export { Plugin };
