import { SaveLoadGame } from "./SaveLoadGame.js";
import { Picture2D } from "../Core/index.js";
/** @class
 *  A scene in the menu for loading a game.
 *  @extends Scene.SaveLoadGame
 */
declare class LoadGame extends SaveLoadGame {
    pictureBackground: Picture2D;
    constructor();
    /**
     *  Load async stuff.
     */
    load(): Promise<void>;
    loadGame(): Promise<void>;
    /**
     *  Slot action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  Handle scene key pressed
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number): void;
    /**
     *  Draw the HUD scene
     */
    drawHUD(): void;
}
export { LoadGame };
