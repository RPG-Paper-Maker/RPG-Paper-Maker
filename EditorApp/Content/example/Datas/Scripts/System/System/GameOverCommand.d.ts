import { Enum } from "../Common/index.js";
import { Translatable } from "./Translatable.js";
/** @class
 *  A game over command of the game.
 *  @extends System.Translatable
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  game over command
 */
declare class GameOverCommand extends Translatable {
    kind: Enum.GameOverCommandKind;
    script: string;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the game over command.
     *  @param {Record<string, any>} json - Json object describing the game
     *  over command
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the action function according to kind.
     *  @returns {Function}
     */
    getAction(): Function;
    /**
     *  Callback function for continuying the game (load last save).
     *  @returns {boolean}
     */
    continue(): boolean;
    /**
     *  Callback function for going back to title screen.
     *  @returns {boolean}
     */
    titleScreen(): boolean;
    /**
     *  Callback function for closing the window.
     *  @returns {boolean}
     */
    exit(): boolean;
    /**
     *  Callback function for closing the window.
     *  @returns {boolean}
     */
    executeScript(): boolean;
}
export { GameOverCommand };
