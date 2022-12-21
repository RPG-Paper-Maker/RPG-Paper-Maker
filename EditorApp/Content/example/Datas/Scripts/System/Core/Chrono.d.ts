import { Graphic } from "../index.js";
/** @class
 *  A chrono in the game.
 *  @param {number} start - The start time of the chrono (in milliseconds)
 */
declare class Chrono {
    id: number;
    time: number;
    lastTime: number;
    reverse: boolean;
    paused: boolean;
    graphic: Graphic.Text;
    finished: boolean;
    constructor(start?: number, id?: number, reverse?: boolean, displayOnScreen?: boolean);
    /**
     *  Get time time in seconds.
     *  @returns {number}
     */
    getSeconds(): number;
    /**
     *  Pause the chrono.
     */
    pause(): void;
    /**
     *  Continue the chrono (if paused).
     */
    continue(): void;
    /**
     *  Update the chrono. If reverse, return true if time reach 0.
     *  @returns {boolean}
     */
    update(): boolean;
    /**
     *  Draw the HUD chrono.
     */
    drawHUD(): void;
}
export { Chrono };
