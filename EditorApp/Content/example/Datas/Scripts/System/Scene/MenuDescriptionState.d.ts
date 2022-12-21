import { MenuBase } from "./MenuBase.js";
import { WindowBox, WindowChoices } from "../Core/index.js";
/**
 * The scene menu describing players statistics.
 *
 * @class MenuDescriptionState
 * @extends {Base}
 */
declare class MenuDescriptionState extends MenuBase {
    /**
     * the top window
     *
     * @type {WindowBox}
     * @memberof MenuDescriptionState
     */
    windowTop: WindowBox;
    /**
     * the choices tabs window
     *
     * @type {WindowChoices}
     * @memberof MenuDescriptionState
     */
    windowChoicesTabs: WindowChoices;
    /**
     * the information window
     *
     * @type {WindowBox}
     * @memberof MenuDescriptionState
     */
    windowInformation: WindowBox;
    /**
     * Creates an instance of MenuDescriptionState.
     * @memberof MenuDescriptionState
     */
    constructor();
    /**
     * @inheritdoc
     *
     * @memberof MenuDescriptionState
     */
    create(): void;
    /**
     * create all the windows in the scene.
     *
     * @memberof MenuDescriptionState
     */
    createAllWindows(): void;
    /**
     * create the top window.
     *
     * @memberof MenuDescriptionState
     */
    createWindowTop(): void;
    /**
     * create the tab window containing the heros.
     *
     * @memberof MenuDescriptionState
     */
    createWindowTabs(): void;
    /**
     * create the information window
     *
     * @memberof MenuDescriptionState
     */
    createWindowInformation(): void;
    /**
     * Synchronize information's with the selected hero.
     *
     * @memberof MenuDescriptionState
     */
    synchronize(): void;
    /**
     *  A scene action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  A scene move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     * @inheritdoc
     *
     * @memberof MenuDescriptionState
     */
    update(): void;
    /**
     * @inheritdoc
     *
     * @param {number} key - the key ID
     * @memberof MenuDescriptionState
     */
    onKeyPressed(key: number): void;
    /**
     * @inheritdoc
     *
     * @param {number} key - the key id
     * @memberof MenuDescriptionState
     */
    onKeyReleased(key: number): void;
    /**
     * @inheritdoc
     *
     * @param {number} key - the key id
     * @return {*}  {boolean}
     * @memberof MenuDescriptionState
     */
    onKeyPressedRepeat(key: number): boolean;
    /**
     * @inheritdoc
     *
     * @param {number} key - the key id
     * @return {*}  {boolean}
     * @memberof MenuDescriptionState
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
     * @inheritdoc
     *
     * @memberof MenuDescriptionState
     */
    drawHUD(): void;
}
export { MenuDescriptionState };
