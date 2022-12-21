import { SaveLoadGame } from "./SaveLoadGame.js";
/** @class
 *  A scene in the menu for saving a game.
 *  @extends Scene.SaveLoadGame
 */
declare class SaveGame extends SaveLoadGame {
    constructor();
    /**
     *  Create scene.
     */
    create(): void;
    /**
     *  Load async stuff.
     *  @async
     */
    load(): Promise<void>;
    /**
     *  Save current game in the selected slot.
     */
    save(): Promise<void>;
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
     *  Slot move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  Handle scene key pressed.
     *   @param {number} key - The key ID
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
export { SaveGame };
