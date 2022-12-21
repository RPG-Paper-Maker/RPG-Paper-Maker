/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { SaveLoadGame } from "./SaveLoadGame.js";
import { Graphic, Datas, Manager, Scene } from "../index.js";
import { Enum } from "../Common/index.js";
var Align = Enum.Align;
import { Game } from "../Core/index.js";
/** @class
 *  A scene in the menu for saving a game.
 *  @extends Scene.SaveLoadGame
 */
class SaveGame extends SaveLoadGame {
    constructor() {
        super();
    }
    /**
     *  Create scene.
     */
    create() {
        super.create();
    }
    /**
     *  Load async stuff.
     *  @async
     */
    async load() {
        await super.load();
        this.setContents.call(this, new Graphic.Text("Save a game", { align: Align.Center }), new Graphic.Text("Select a slot where you want to save.", { align: Align.Center }));
        this.loading = false;
    }
    /**
     *  Save current game in the selected slot.
     */
    async save() {
        await Game.current.save(this.windowChoicesSlots.currentSelectedIndex + 1);
        Manager.Stack.pop();
        Manager.Stack.requestPaintHUD = true;
        this.loading = false;
    }
    /**
     *  Slot action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey, options = {}) {
        // If action, save in the selected slot
        if (Scene.MenuBase.checkActionMenu(isKey, options)) {
            Datas.Systems.soundConfirmation.playSound();
            Manager.Stack.push(new Scene.Confirm(() => {
                this.save();
            }));
        }
    }
    /**
     *  Slot move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey, options = {}) {
        super.move(isKey, options);
    }
    /**
     *  Handle scene key pressed.
     *   @param {number} key - The key ID
     */
    onKeyPressed(key) {
        super.onKeyPressed(key);
        this.action(true, { key: key });
    }
    /**
     *  @inheritdoc
     */
    onMouseUp(x, y) {
        super.onMouseUp(x, y);
        this.action(false, { x: x, y: y });
    }
    /**
     *  Draw the HUD scene
     */
    drawHUD() {
        super.drawHUD();
    }
}
export { SaveGame };
