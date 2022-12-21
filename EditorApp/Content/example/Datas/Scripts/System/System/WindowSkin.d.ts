import { System } from "../index.js";
import { Picture2D } from "../Core/index.js";
/** @class
 *  A window skin of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  window skin
 */
declare class WindowSkin extends System.Base {
    pictureID: number;
    borderTopLeft: number[];
    borderTopRight: number[];
    borderBotLeft: number[];
    borderBotRight: number[];
    borderLeft: number[];
    borderRight: number[];
    borderTop: number[];
    borderBot: number[];
    background: number[];
    backgroundSelection: number[];
    backgroundRepeat: number[];
    arrowEndMessage: number[];
    arrowTargetSelection: number[];
    arrowUpDown: number[];
    textNormal: number[];
    textCritical: number[];
    textHeal: number[];
    textMiss: number[];
    picture: Picture2D;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the window skin.
     *  @param {Record<string, any>} - json Json object describing the window skin
     */
    read(json: Record<string, any>): void;
    /**
     * Update the window skin picture ID.
     */
    updatePicture(): Promise<void>;
    /**
     *  Draw any element of the window skin box with the cut picture.
     *  @param {number[]} r - The rect source
     *  @param {number} x - The x target
     *  @param {number} y - The y target
     *  @param {number} [w=r[2]] - The w target
     *  @param {number} [h=r[3]] - The h target
     *  @param {number} [zoom=1.0] - The zoom to apply of target size
     */
    drawElement(r: number[], x: number, y: number, w?: number, h?: number, zoom?: number, positionResize?: boolean): void;
    /**
     *  Draw the background box.
     *  @param {number[]} background - The background source rect
     *  @param {number[]} rect - The final box rect
     */
    drawBoxBackground(background: number[], rect: number[]): void;
    /**
     *  Draw the box
     *  @param {number[]} rect - The final box rect
     *  @param {boolean} selected - Indicate if the box is selected
     *  @param {boolean} bordersVisible - Indicate if the borders of the box are visible
     */
    drawBox(rect: number[], selected: boolean, bordersVisible: boolean): void;
    /**
     *  Draw the arrow for targets.
     *  @param {number} frame - The current frame to draw
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     *  @param {boolean} positionResize - Indicate if the position picture needs
     *  to be resize (resolution)
     */
    drawArrowTarget(frame: number, x: number, y: number, positionResize?: boolean): void;
    /**
     *  Draw the arrow for end of messages.
     *  @param {number} frame - The current frame to draw
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     */
    drawArrowMessage(frame: number, x: number, y: number): void;
    /**
     *  Draw the arrow up for spinbox.
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     */
    drawArrowUp(x: number, y: number): void;
    /**
     *  Draw the arrow up for spinbox.
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     */
    drawArrowDown(x: number, y: number): void;
    /**
     *  Draw a damage number.
     *  @param {number} damage - The damage number to display
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     *  @param {number[]} rect - The source rect
     *  @param {number} zoom - The zoom to apply on damages
     */
    drawDamagesNumber(damage: number, x: number, y: number, rect: number[], zoom: number): void;
    /**
     *  Draw a damage number according to the kind of damages.
     *  @param {number} damage - The damage number to display
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     *  @param {boolean} isCrit - Indicate if the damages are a critical hit
     *  @param {boolean} isMiss - Indicate if the damages are a missed hit
     *  @param {number} zoom - The zoom to apply on damages
     */
    drawDamages(damage: number, x: number, y: number, isCrit: boolean, isMiss: boolean, zoom: number): void;
}
export { WindowSkin };
