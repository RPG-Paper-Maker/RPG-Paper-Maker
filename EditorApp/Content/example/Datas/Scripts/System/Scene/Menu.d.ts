import { WindowChoices, WindowBox } from "../Core/index.js";
import { MenuBase } from "./MenuBase.js";
interface StructPositionChoice {
    index: number;
    offset: number;
}
/**
 * The class who handle the scene menu in game.
 *
 * @class Menu
 * @extends {MenuBase}
 */
declare class Menu extends MenuBase {
    selectedOrder: number;
    windowChoicesCommands: WindowChoices;
    windowChoicesTeam: WindowChoices;
    windowTimeCurrencies: WindowBox;
    constructor();
    /**
     * @inheritdoc
     *
     * @memberof Menu
     */
    create(): void;
    /**
     * Create all the windows in the scene.
     *
     * @memberof Menu
     */
    createAllWindows(): void;
    /**
     * Create the commands window
     *
     * @memberof Menu
     */
    createCommandWindow(): void;
    /**
     * Create the team order window.
     *
     * @memberof Menu
     */
    createTeamOrderWindow(): void;
    /**
     * Create the time and currencies window.
     *
     * @memberof Menu
     */
    createWindowTimeCurrencies(): void;
    /**
     *  Update the scene.
     *
     * @memberof Menu
     */
    update(): void;
    /**
     * function called when quitting the menu.
     *
     * @memberof Menu
     */
    onQuitMenu(): void;
    /**
     * function called when quitting the team order selection.
     *
     * @memberof Menu
     */
    onTeamUnselect(): void;
    /**
     * swap two hero index in the active team.
     *
     * @param {number} id1
     * @param {number} id2
     * @memberof Menu
     */
    swapHeroOrder(id1: number, id2: number): void;
    /**
     * function executed when you choose the order command.
     *
     * @memberof Menu
     */
    onTeamSelect(): void;
    /**
     *  A scene action.
     */
    action(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  @inheritdoc
     *
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  @inheritdoc
     *
     *  @param {number} key - The key ID
     */
    onKeyReleased(key: number): void;
    /**
     *  @inheritdoc
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean;
    /**
     *  @inheritdoc
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
     * @inheritdoc
     *
     * @memberof Menu
     */
    drawHUD(): void;
    /**
     * @inheritdoc
     *
     * @memberof Menu
     */
    close(): void;
}
export { StructPositionChoice, Menu };
