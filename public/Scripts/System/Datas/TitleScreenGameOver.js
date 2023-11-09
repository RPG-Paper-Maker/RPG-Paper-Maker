/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System, Graphic, Datas, Manager, Scene } from '../index.js';
import { Platform, Paths, Utils, Enum } from '../Common/index.js';
var SongKind = Enum.SongKind;
var Align = Enum.Align;
var TitleSettingKind = Enum.TitleSettingKind;
/** @class
 *  All the titlescreen and gameover datas.
 *  @static
 */
class TitlescreenGameover {
    constructor() {
        throw new Error('This is a static class!');
    }
    /**
     *  Read the JSON file associated to title screen and game over.
     *  @static
     *  @async
     */
    static async read() {
        let json = await Platform.parseFileJSON(Paths.FILE_TITLE_SCREEN_GAME_OVER);
        // Title screen
        this.isTitleBackgroundImage = Utils.defaultValue(json.itbi, true);
        this.titleBackgroundImageID = Utils.defaultValue(json.tb, 1);
        this.titleBackgroundVideoID = Utils.defaultValue(json.tbv, 1);
        this.titleMusic = new System.PlaySong(SongKind.Music, json.tm);
        this.titleCommands = [];
        Utils.readJSONSystemList({
            list: Utils.defaultValue(json.tc, []),
            listIndexes: this.titleCommands,
            cons: System.TitleCommand,
        });
        let jsonList = json.ts;
        let l = jsonList.length;
        this.titleSettings = [];
        let obj;
        for (let i = 0, j = 0; i < l; i++) {
            obj = jsonList[i];
            if (Utils.defaultValue(obj.checked, true)) {
                this.titleSettings[j] = obj.id;
                j++;
            }
        }
        // Game over
        this.isGameOverBackgroundImage = Utils.defaultValue(json.isGameOverBackgroundImage, true);
        this.gameOverBackgroundImageID = Utils.defaultValue(json.gameOverBackgroundImage, 1);
        this.gameOverBackgroundVideoID = Utils.defaultValue(json.gameOverBackgroundVideo, 1);
        this.gameOverMusic = new System.PlaySong(SongKind.Music, json.gameOverMusic);
        this.gameOverCommands = [];
        Utils.readJSONSystemList({
            list: Utils.defaultValue(json.gameOverCommands, []),
            listIndexes: this.gameOverCommands,
            cons: System.GameOverCommand,
        });
    }
    /**
     *  Get the title screen commands graphic names.
     *  @static
     *  @returns {Graphic.Text[]}
     */
    static getTitleCommandsNames() {
        let l = this.titleCommands.length;
        let list = new Array(l);
        let titleCommand, obj;
        for (let i = 0; i < l; i++) {
            titleCommand = this.titleCommands[i];
            obj = new Graphic.Text(titleCommand.name(), { align: Align.Center });
            obj.datas = titleCommand;
            list[i] = obj;
        }
        return list;
    }
    /**
     *  Get the title screen commands actions functions.
     *  @static
     *  @returns {function[]}
     */
    static getTitleCommandsActions() {
        let l = this.titleCommands.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = this.titleCommands[i].getAction();
        }
        return list;
    }
    /**
     *  Get the title screen commands settings content graphic.
     *  @static
     *  @returns {Graphic.Setting[]}
     */
    static getTitleSettingsCommandsContent() {
        let l = this.titleSettings.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = new Graphic.Setting(this.titleSettings[i]);
        }
        return list;
    }
    /**
     *  Get the title screen settings commands actions functions.
     *  @static
     *  @returns {function[]}
     */
    static getTitleSettingsCommandsActions() {
        let l = this.titleSettings.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = this.getTitleSettingsCommandsAction(this.titleSettings[i]);
        }
        return list;
    }
    /**
     *  Get the title screen settings commands action function according to ID.
     *  @static
     *  @param {number} id - The action ID
     *  @returns {function}
     */
    static getTitleSettingsCommandsAction(id) {
        switch (id) {
            case TitleSettingKind.KeyboardAssigment:
                return Datas.TitlescreenGameover.keyboardAssignment;
            case TitleSettingKind.Language:
                return Datas.TitlescreenGameover.language;
        }
    }
    /**
     *  Get the game over commands graphic names.
     *  @static
     *  @returns {Graphic.Text[]}
     */
    static getGameOverCommandsNames() {
        let l = this.gameOverCommands.length;
        let list = new Array(l);
        let command, obj;
        for (let i = 0; i < l; i++) {
            command = this.gameOverCommands[i];
            obj = new Graphic.Text(command.name(), { align: Align.Center });
            obj.datas = command;
            list[i] = obj;
        }
        return list;
    }
    /**
     *  Get the game over commands actions functions.
     *  @static
     *  @returns {function[]}
     */
    static getGameOverCommandsActions() {
        let l = this.gameOverCommands.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = this.gameOverCommands[i].getAction();
        }
        return list;
    }
    /**
     *  The setting action keyboard assignment.
     *  @static
     *  @returns {boolean}
     */
    static keyboardAssignment() {
        Manager.Stack.push(new Scene.KeyboardAssign());
        return true;
    }
    /**
     *  The setting action language.
     *  @static
     *  @returns {boolean}
     */
    static language() {
        Manager.Stack.push(new Scene.ChangeLanguage());
        return true;
    }
}
export { TitlescreenGameover };
