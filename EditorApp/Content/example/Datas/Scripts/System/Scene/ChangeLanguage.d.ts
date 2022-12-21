import { Picture2D, WindowBox, WindowChoices } from "../Core/index.js";
import { Base } from "./Base.js";
/** @class
 *  A scene for the language setting.
 *  @extends Scene.Base
 */
declare class ChangeLanguage extends Base {
    pictureBackground: Picture2D;
    windowBoxLanguage: WindowBox;
    windowBoxTop: WindowBox;
    windowChoicesMain: WindowChoices;
    windowBoxConfirm: WindowBox;
    windowChoicesConfirm: WindowChoices;
    step: number;
    constructor();
    /**
     *  Create scene.
     */
    create(): void;
    /**
     *  Create all the windows in the scene.
     */
    createAllWindows(): void;
    /**
     *  Create the window language on top.
     */
    createWindowBoxLanguage(): void;
    /**
     *  Create the window information on top.
     */
    createWindowBoxTop(): void;
    /**
     *  Create the window information on top.
     */
    createWindowChoicesMain(): void;
    /**
     *  Create the window confirmation.
     */
    createWindowBoxConfirm(): void;
    /**
     *  Create the window information on top.
     */
    createWindowChoicesConfirm(): void;
    /**
     *  Load async stuff.
     */
    load(): Promise<void>;
    /**
     *  Create background stuff.
     */
    createBackground(): Promise<void>;
    /**
     *  Action the scene.
     */
    action(): void;
    /**
     *  Cancel the scene.
     */
    cancel(): void;
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
export { ChangeLanguage };
