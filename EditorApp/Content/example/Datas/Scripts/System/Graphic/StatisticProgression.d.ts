import { Player } from "../Core/index.js";
import { Graphic } from "../index.js";
import { Base } from "./Base.js";
/** @class
 *  The graphic displaying all the stats in the player description state menu.
 *  @param {GamePlayer} gamePlayer - The current selected player
 */
declare class StatisticProgression extends Base {
    player: Player;
    listStatsProgression: Graphic.Text[];
    listStatsNames: Graphic.Text[];
    listStats: Graphic.Text[];
    maxLength: number;
    maxProgressionLength: number;
    constructor(player: Player);
    /**
     *  Update the statistic progression graphics.
     */
    updateStatisticProgression(): void;
    /**
     *  Get the stat names list height.
     *  @returns {number}
     */
    getHeight(): number;
    /**
     *  Drawing the player description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the player description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number): void;
}
export { StatisticProgression };
