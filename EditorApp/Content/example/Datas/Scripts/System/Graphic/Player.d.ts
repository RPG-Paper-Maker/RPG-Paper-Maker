import { Graphic, Core, System } from "../index.js";
import { Picture2D, Frame, Rectangle } from "../Core/index.js";
import { Base } from "./Base.js";
/** @class
 *  The graphic displaying the player minimal stats informations.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 *  @param {boolean} [reverse=false] - Indicate if the faceset should be reversed
 */
declare class Player extends Base {
    player: Core.Player;
    reverse: boolean;
    graphicName: Graphic.Text;
    graphicClass: Graphic.Text;
    graphicLevelName: Graphic.Text;
    graphicLevel: Graphic.Text;
    graphicExpName: Graphic.Text;
    graphicExp: Graphic.Text;
    listStatistics: Graphic.Statistic[];
    maxStatNamesLength: number;
    maxStatLength: number;
    faceset: Picture2D;
    battler: Picture2D;
    battlerFrame: Frame;
    graphicLevelUp: Graphic.Text;
    displayNameLevel: boolean;
    graphicStatShort: Graphic.Text;
    isMainMenu: boolean;
    battlerRect: Rectangle;
    constructor(player: Core.Player, { isMainMenu, reverse }?: {
        isMainMenu?: boolean;
        reverse?: boolean;
    });
    /**
     *  Update the reverse value for faceset.
     *  @param {boolean} reverse - The reverse value
     */
    updateReverse(reverse: boolean): void;
    /**
     *  Update the graphics
     */
    update(): void;
    /**
     *  Update experience graphics.
     */
    updateExperience(): void;
    /**
     *  Initialize character graphics font size.
     *  @param {boolean} [noDisplayNameLevel=false] - Indicate if the level up
     *  should be displayed or not
     */
    initializeCharacter(noDisplayNameLevel?: boolean): void;
    /**
     *  Update battler frame.
     */
    updateBattler(): void;
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
     *  Drawing the character.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawCharacter(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the player in choice box in the main menu.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the player informations in battles.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    draw(x: number, y: number, w: number, h: number): void;
}
export { Player };
