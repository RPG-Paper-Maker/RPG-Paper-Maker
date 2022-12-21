import { Base } from "./Base.js";
import { Picture2D, WindowBox, WindowChoices } from "../Core/index.js";
/** @class
 *  A scene for the title screen settings.
 *  @extends Scene.Base
 */
declare class TitleSettings extends Base {
    pictureBackground: Picture2D;
    windowSettings: WindowBox;
    windowInformations: WindowBox;
    windowChoicesMain: WindowChoices;
    constructor();
    /**
     *  Load async stuff.
     */
    load(): Promise<void>;
    /**
     *  Cancel the scene.
     */
    cancel(): void;
    /**
     *  Translate the scene if possible.
     */
    translate(): void;
    /**
     *  @inheritdoc
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
     *  Draw the HUD scene.
     */
    drawHUD(): void;
}
export { TitleSettings };
