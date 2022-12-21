import { Base } from "./index.js";
import { Graphic } from "../index.js";
import { Player } from "../Core/index.js";
import { Enum } from "../Common/index.js";
import Align = Enum.Align;
/**
 * The menu commands structure
 */
interface MenuCommands {
    command: {
        name: string;
        align: Align;
    };
    action: Function;
}
/**
 * The superclass who handle menu related scenes
 *
 * @abstract
 * @class MenuBase
 * @extends {Base}
 */
declare abstract class MenuBase extends Base {
    /**
     * the slots to display in a menu.
     *
     * @static
     * @type {number}
     * @memberof MenuBase
     */
    static SLOTS_TO_DISPLAY: number;
    /**
     * The active hero id
     *
     * @protected
     * @type {number}
     * @memberof MenuBase
     */
    protected _activeHero: number;
    constructor(...args: any[]);
    /**
     *  Check is actioning menu input (for keyboard and mouse).
     *  @static
     */
    static checkActionMenu(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): boolean;
    /**
     *  Check is canceling menu input (for keyboard and mouse).
     *  @static
     */
    static checkCancelMenu(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): boolean;
    /**
     *  Check is canceling input (for keyboard and mouse).
     *  @static
     */
    static checkCancel(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): boolean;
    /**
     * Return the whole party array.
     *
     * @example
     * var size = this.party().length;
     *
     * @return {*}
     * @memberof MenuBase
     */
    party(): Player[];
    /**
     * Return the current active hero.
     *
     * @example
     * let level = this.hero().getCurrentLevel();
     *
     * @return {*}
     * @memberof MenuBase
     */
    hero(): Player;
    /**
     * Return the current active hero index.
     *
     * @example
     * let id = this.heroID();
     * this.sprite = "Hero_" + id;
     *
     * @return {*}
     * @memberof MenuBase
     */
    heroID(): number;
    /**
     * set the active hero index.
     *
     * @param {number} id - the hero index
     * @memberof MenuBase
     */
    setActiveHero(id: number): void;
    /**
     * Return a array of the party graphics
     *
     * @todo maybe move that to the future new Party class once done?
     *
     * @example
     *  var hero_Battler1 = this.partyGraphics()[0].battler;
     *
     * @return {Graphic.Player[]}
     * @memberof MenuBase
     */
    partyGraphics(): Graphic.Player[];
    /**
     * Return the active hero graphics.
     *
     * @example
     * var hero_battler = this.heroGraphics().battler;
     *
     * @return {Graphic.Player}
     * @memberof MenuBase
     */
    heroGraphics(): Graphic.Player;
    /**
     * @inheritdoc
     *
     * @memberof MenuBase
     */
    update(): void;
    onKeyPressed(key: number): void;
    onKeyPressedAndRepeat(key: number): any;
    onKeyReleased(key: number): void;
}
export { MenuBase, MenuCommands };
