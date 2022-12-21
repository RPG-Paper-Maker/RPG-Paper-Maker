import { Base } from "./Base.js";
import { StructPositionChoice } from "./Menu.js";
import { WindowBox, WindowChoices } from "../Core/index.js";
/** @class
 *  A scene in the menu for describing players skills.
 *  @extends Scene.Base
 */
declare class MenuSkills extends Base {
    positionChoice: StructPositionChoice[];
    windowTop: WindowBox;
    windowChoicesTabs: WindowChoices;
    windowChoicesList: WindowChoices;
    windowBoxInformation: WindowBox;
    windowEmpty: WindowBox;
    windowBoxUseSkill: WindowBox;
    substep: number;
    constructor();
    /**
     *  Create the choice list.
     */
    createWindowChoicesList(): void;
    /**
     *  Create the information window.
     */
    createWindowBoxInformation(): void;
    /**
     *  Synchronize informations with selected hero.
     */
    synchronize(): void;
    /**
     *  Update tab
     */
    updateForTab(): void;
    /**
     *  Move tab according to key.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    moveTabKey(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
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
     *  Update the scene.
     */
    update(): void;
    /**
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  Handle scene key released.
     *  @param {number} key - The key ID
     */
    onKeyReleased(key: number): void;
    /**
     *  Handle scene pressed repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean;
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
export { MenuSkills };
