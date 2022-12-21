import { Base } from "./Base.js";
import { WindowBox, WindowChoices, Game } from "../Core/index.js";
import { Graphic } from "../index.js";
/** @class
 *  Abstract class for the game save and loading menus.
 *  @extends Scene.Base
 */
declare class SaveLoadGame extends Base {
    windowTop: WindowBox;
    windowChoicesSlots: WindowChoices;
    windowInformations: WindowBox;
    windowBot: WindowBox;
    gamesDatas: Graphic.Save[];
    constructor();
    /**
     *  Load async stuff
     */
    load(): Promise<void>;
    /**
     *  Initialize a game displaying.
     *   @param {Game} game - The game
     */
    initializeGame(game: Game): void;
    /**
     *  Set the contents in the bottom and top bars.
     *  @param {Graphic.Base} top - A graphic content for top
     *  @param {Graphic.Base} bot - A graphic content for bot
     */
    setContents(top: Graphic.Base, bot: Graphic.Base): void;
    /**
     *  Update the information to display inside the save informations.
     *  @param {number} i - The slot index
     */
    updateInformations(i: number): void;
    /**
     *  Slot cancel.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    cancel(isKey: boolean, options?: {
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
     *  Update the scene.
     */
    update(): void;
    /**
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  @inheritdoc
     */
    onMouseMove(x: number, y: number): void;
    /**
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number): void;
    /**
     *  Draw the HUD scene
     */
    drawHUD(): void;
}
export { SaveLoadGame };
