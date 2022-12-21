import { Base } from "./Base.js";
import { Enum } from "../Common/index.js";
import Align = Enum.Align;
import { Picture2D } from "../Core/index.js";
import { Graphic, System } from "../index.js";
/** @class
 *  The graphic displaying a text and an icon.
 *  @extends Graphic.Base
 *  @param {string} text - The brut text to display
 *  @param {number} iconID - The icon ID
 *  @param {Object} [opts={}] - Options
 *  @param {Align} [opts.side=Align.Left] - The side to display icon
 *  @param {Align} [opts.align=Align.left] - The complete graphic align
 *  @param {number} [opts.space=RPM.MEDIUM_SPACE] - The space between icon and
 *  text
 */
declare class TextIcon extends Base {
    text: string;
    iconID: number;
    indexX: number;
    indexY: number;
    system: System.Base;
    side: Align;
    align: Align;
    space: number;
    graphicIcon: Picture2D;
    graphicText: Graphic.Text;
    constructor(text: string, iconID: number, indexX: number, indexY: number, { side, align, space }?: {
        side?: Enum.Align;
        align?: Enum.Align;
        space?: number;
    }, textOptions?: {});
    /**
     *  Create a graphic according to a System.Icon.
     *  @static
     *  @returns {number}
     */
    static createFromSystem(text: string, icon: System.Icon, options?: {}, textOptions?: {}): Graphic.TextIcon;
    /**
     *  Get the max possible height.
     *  @returns {number}
     */
    getMaxHeight(): number;
    /**
     *  Get the width.
     *  @returns {number}
     */
    getWidth(): number;
    /**
     *  Set the text.
     *  @param {string} text
     */
    setText(text: string): void;
    /**
     *  Drawing the content choice.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the content.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number): void;
}
export { TextIcon };
