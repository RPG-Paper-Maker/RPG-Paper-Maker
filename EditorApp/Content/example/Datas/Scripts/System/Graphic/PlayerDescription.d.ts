import { Base } from "./Base.js";
import { Player, Picture2D, Frame } from "../Core/index.js";
import { Graphic } from "../index.js";
/** @class
 *  The graphic displaying all the stats in the player description state menu.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 */
declare class PlayerDescription extends Base {
    player: Player;
    graphicNameCenter: Graphic.Text;
    graphicName: Graphic.Text;
    graphicDescription: Graphic.Text;
    graphicClass: Graphic.Text;
    graphicLevelName: Graphic.Text;
    graphicLevel: Graphic.Text;
    graphicExpName: Graphic.Text;
    graphicExp: Graphic.Text;
    listStatsNames: Graphic.Text[];
    listStats: Graphic.Text[];
    listLength: number[];
    battler: Picture2D;
    battlerFrame: Frame;
    listStatsProgression: Graphic.Text[];
    maxLength: number;
    constructor(player: Player);
    /**
     *  Initialize the statistic progression
     */
    initializeStatisticProgression(): void;
    /**
     *  Update the statistic progression.
     */
    updateStatisticProgression(): void;
    /**
     *  Update the battler frame.
     */
    updateBattler(): void;
    /**
     *  Drawing the statistic progression.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawStatisticProgression(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the player in choice box
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the player description
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number): void;
}
export { PlayerDescription };
