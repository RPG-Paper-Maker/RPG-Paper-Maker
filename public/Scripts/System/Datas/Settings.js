/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "../index.js";
import { IO, Platform, Paths, Utils, Enum } from '../Common/index.js';
var TitleSettingKind = Enum.TitleSettingKind;
/** @class
 *  All the settings datas.
 *  @static
 */
class Settings {
    constructor() {
        throw new Error('This is a static class!');
    }
    /**
     *  Read the settings file.
     *  @static
     */
    static async read() {
        // Settings
        let json = await Platform.parseFileJSON(Paths.FILE_SETTINGS);
        this.kb = [];
        let jsonObjs = json[Utils.numToString(TitleSettingKind.KeyboardAssigment)];
        for (let id in jsonObjs) {
            this.kb[id] = jsonObjs[id];
        }
        this.currentLanguage = Utils.defaultValue(json[Utils.numToString(TitleSettingKind.Language)], Datas.Languages.getMainLanguageID());
    }
    /**
     *  Write the settings file.
     *  @static
     */
    static write() {
        let json = {};
        let jsonObjs = {};
        for (let id in this.kb) {
            jsonObjs[id] = this.kb[id];
        }
        json[Utils.numToString(TitleSettingKind.KeyboardAssigment)] = jsonObjs;
        json[Utils.numToString(TitleSettingKind.Language)] = this.currentLanguage;
        IO.saveFile(Paths.FILE_SETTINGS, json);
    }
    /**
     *  Check if the app is in dev mode
     *  @static
     */
    static async checkIsProtected() {
        this.isProtected = await Platform.fileExists(Paths.FILE_PROTECT);
    }
    /**
     *  Update Keyboard settings.
     *  @param {number} id
     *  @param {number[][]} sc -
     *  @static
     */
    static updateKeyboard(id, sc) {
        this.kb[id] = sc;
        this.write();
    }
    /**
     *  Update current language setting.
     *  @param {number} id
     */
    static updateCurrentLanguage(id) {
        this.currentLanguage = id;
        this.write();
    }
}
export { Settings };
