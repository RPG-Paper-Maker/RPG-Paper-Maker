/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System, Datas, Graphic, Scene } from '../index.js';
import { Platform, Paths } from '../Common/index.js';
/** @class
 *  All the keyBoards datas.
 *  @static
 */
class Keyboards {
    constructor() {
        throw new Error('This is a static class!');
    }
    /**
     *  Test if a key id can be equal to a keyboard System object.
     *  @static
     *  @param {number} key - The key id that needs to be compared
     *  @param {System.KeyBoard} abr - The keyBoard to compare to the key
     *  @returns {boolean}
     */
    static isKeyEqual(key, abr) {
        if (abr) {
            let sc = abr.sc;
            let m;
            for (let i = 0, l = sc.length; i < l; i++) {
                m = sc[i].length;
                if (m === 1) {
                    if (sc[i][0] === key) {
                        return true;
                    }
                }
                else {
                    return false;
                }
            }
        }
        return false;
    }
    /**
     *  Read the JSON file associated to keyboard.
     *  @static
     *  @async
     */
    static async read() {
        let json = await Platform.parseFileJSON(Paths.FILE_KEYBOARD);
        // Shortcuts
        let jsonList = json.list;
        let l = jsonList.length;
        this.list = new Array(l + 1);
        this.listOrdered = new Array(l);
        let jsonKey, id, abbreviation, key, sc;
        for (let i = 0; i < l; i++) {
            jsonKey = jsonList[i];
            id = jsonKey.id;
            abbreviation = jsonKey.abr;
            key = new System.Keyboard(jsonKey);
            sc = Datas.Settings.kb[id];
            if (sc) {
                key.sc = sc;
            }
            this.list[id] = key;
            this.listOrdered[i] = key;
            this.controls[abbreviation] = key;
        }
        // Menu controls
        this.menuControls['Action'] = this.list[json['a']];
        this.menuControls['Cancel'] = this.list[json['c']];
        this.menuControls['Up'] = this.list[json['u']];
        this.menuControls['Down'] = this.list[json['d']];
        this.menuControls['Left'] = this.list[json['l']];
        this.menuControls['Right'] = this.list[json['r']];
    }
    /**
     *  Get the keyboard by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Keyboard}
     */
    static get(id) {
        return Datas.Base.get(id, this.list, 'keyboard');
    }
    /**
     *  Get the graphics commands.
     *  @static
     *  @returns {GraphicKeyboard[]}
     */
    static getCommandsGraphics() {
        let l = this.listOrdered.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = new Graphic.Keyboard(this.listOrdered[i]);
        }
        return list;
    }
    /**
     *  Get the actions commands.
     *  @static
     *  @returns {Function[]}
     */
    static getCommandsActions() {
        let l = this.listOrdered.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = Scene.KeyboardAssign.prototype.updateKey;
        }
        return list;
    }
    /**
     *  Check if key is cancelling menu.
     *  @static
     *  @returns {boolean}
     */
    static checkCancelMenu(key) {
        return (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Cancel) ||
            Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.controls.MainMenu));
    }
    /**
     *  Check if key is cancelling.
     *  @static
     *  @returns {boolean}
     */
    static checkCancel(key) {
        return Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Cancel);
    }
    /**
     *  Check if key is action menu.
     *  @static
     *  @returns {boolean}
     */
    static checkActionMenu(key) {
        return Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Action);
    }
}
Keyboards.menuControls = {};
Keyboards.controls = {};
export { Keyboards };
