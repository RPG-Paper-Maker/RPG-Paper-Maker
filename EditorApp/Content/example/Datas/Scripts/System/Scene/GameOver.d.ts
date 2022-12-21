import { Picture2D, WindowChoices } from "../Core/index.js";
import { Base } from "./Base.js";
/**
 *  The scene displaying the game over screen.
 *  @class GameOver
 *  @extends {Scene.Base}
 */
declare class GameOver extends Base {
    /**
     *  The game over background image.
     *  @type {Picture2D}
     */
    pictureBackground: Picture2D;
    /**
     *  The title screen command window.
     *  @type {WindowChoices}
     */
    windowChoicesCommands: WindowChoices;
    constructor();
    /**
     *  @inheritdoc
     */
    create(): void;
    /**
     *  @inheritdoc
     */
    load(): Promise<void>;
    /**
     *  Continue the game.
     */
    continue(): Promise<void>;
    /**
     *  @inheritdoc
     */
    update(): void;
    /**
     *  @inheritdoc
     *  @param {number} key - the key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  @inheritdoc
     *  @param {number} key - the key ID
     *  @return {*}  {boolean}
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
     *  @inheritdoc
     */
    drawHUD(): void;
}
export { GameOver };
