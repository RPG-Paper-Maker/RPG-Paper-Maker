import { Base } from "./Base.js";
import { Graphic, System } from "../index.js";
import { Player } from "../Core/index.js";
/** @class
 *  The graphic displaying a skill or an item use.
 *  @extends Graphic.Base
 */
declare class UseSkillItem extends Base {
    skillItem: System.CommonSkillItem;
    graphicCharacters: Graphic.Player[];
    all: boolean;
    indexArrow: number;
    hideArrow: boolean;
    constructor({ hideArrow }?: {
        hideArrow?: boolean;
    });
    /**
     *  Get the selected player.
     *  @returns {Core.Player}
     */
    getSelectedPlayer(): Player;
    /**
     *  Set skill item.
     *  @param {System.CommonSkillItem} skillItem
     */
    setSkillItem(skillItem: System.CommonSkillItem): void;
    /**
     *  Set if all targets are selected or not.
     *  @param {boolean} b - Indicate if all the targets are selected
     */
    setAll(b: boolean): void;
    /**
     *  Udpate the battler.
     */
    updateStats(): void;
    /**
     *  Move arrow left.
     */
    goLeft(): void;
    /**
     *  Move arrow right.
     */
    goRight(): void;
    /**
     *  Move an arrow according to index.
     *  @param {number} index - The corresponding index
     */
    moveArrow(index: number): void;
    /**
     *  Update stat short.
     *  @param {number} equipmentID
     *  @param {System.CommonSkillItem} weaponArmor
     */
    updateStatShort(weaponArmor: System.CommonSkillItem): void;
    /**
     *  Update stat short to none.
     */
    updateStatShortNone(): void;
    /**
     *  A widget move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  Update the battler frame.
     */
    update(): void;
    /**
     *  Key pressed repeat handle, but with a small wait after the first
     *  pressure.
     *  @param {number} key - The key ID pressed
     */
    onKeyPressedAndRepeat(key: number): void;
    /**
     *  Mouse move handle for the current stack.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseMove(x: number, y: number): void;
    /**
     *  Draw an arrow at a specific index.
     *  @param {number} index - The corresponding index
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     *  @param {number} h - The h size
     */
    drawArrowAtIndex(index: number, x: number, y: number, h: number): void;
    /**
     *  Drawing the skill or item use informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the skill or item use informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number): void;
}
export { UseSkillItem };
