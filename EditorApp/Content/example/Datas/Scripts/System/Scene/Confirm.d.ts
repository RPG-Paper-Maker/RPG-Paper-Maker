import { WindowBox, WindowChoices } from "../Core/index.js";
import { Base } from "./Base.js";
/**
 * @class
 * A class for displaying a confirmation box and choice yes / no.
 */
declare class Confirm extends Base {
    windowBoxConfirm: WindowBox;
    windowChoicesConfirm: WindowChoices;
    callback: () => void;
    constructor(callback: () => void);
    /**
     *  Create scene.
     */
    create(): void;
    /**
     *  Create all the windows in the scene.
     */
    createAllWindows(): void;
    /**
     *  Create the window confirmation.
     */
    createWindowBoxConfirm(): void;
    /**
     *  Create the window information on top.
     */
    createWindowChoicesConfirm(): void;
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
     *  Draw the HUD scene
     */
    drawHUD(): void;
}
export { Confirm };
