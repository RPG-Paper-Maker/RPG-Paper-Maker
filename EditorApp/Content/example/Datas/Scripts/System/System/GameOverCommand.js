/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Manager, System } from "../index.js";
import { Enum, Interpreter, Platform, Utils } from "../Common/index.js";
import { Game } from "../Core/index.js";
import { Translatable } from "./Translatable.js";
/** @class
 *  A game over command of the game.
 *  @extends System.Translatable
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  game over command
 */
class GameOverCommand extends Translatable {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the game over command.
     *  @param {Record<string, any>} json - Json object describing the game
     *  over command
     */
    read(json) {
        super.read(json);
        this.kind = Utils.defaultValue(json.k, Enum.GameOverCommandKind.Continue);
        this.script = Utils.defaultValue(json.s, "");
    }
    /**
     *  Get the action function according to kind.
     *  @returns {Function}
     */
    getAction() {
        switch (this.kind) {
            case Enum.GameOverCommandKind.Continue:
                return this.continue;
            case Enum.GameOverCommandKind.TitleScreen:
                return this.titleScreen;
            case Enum.GameOverCommandKind.Exit:
                return this.exit;
            case Enum.GameOverCommandKind.Script:
                return this.executeScript;
        }
    }
    /**
     *  Callback function for continuying the game (load last save).
     *  @returns {boolean}
     */
    continue() {
        if (Game.current.slot === -1) { // If slot = -1, then run new game (no save)
            System.TitleCommand.startNewGame();
        }
        else { // Else, run the last save slot
            Manager.Stack.top.continue();
        }
        return true;
    }
    /**
     *  Callback function for going back to title screen.
     *  @returns {boolean}
     */
    titleScreen() {
        Manager.Stack.popAll();
        Manager.Stack.pushTitleScreen();
        return true;
    }
    /**
     *  Callback function for closing the window.
     *  @returns {boolean}
     */
    exit() {
        Platform.quit();
        return true;
    }
    /**
     *  Callback function for closing the window.
     *  @returns {boolean}
     */
    executeScript() {
        Interpreter.evaluate(this.script, { addReturn: false });
        return true;
    }
}
export { GameOverCommand };
