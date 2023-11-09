import { Enum } from '../Common/index.js';
import Align = Enum.Align;
import AlignVertical = Enum.AlignVertical;
import { Base } from './Base.js';
import { System } from '../index.js';
/** @class
 *  A class for all the texts to display in HUD.
 *  @extends Bitmap
 *  @param {string} [text=""] - The brut text to display
 *  @param {Object} [opts={}] - Options
 *  @param {number} [opts.x=0] - The x coords of the text
 *  @param {number} [opts.y=0] - The y coords of the text
 *  @param {number} [opts.w=0] - The w coords of the text
 *  @param {number} [opts.h=0] - The h coords of the text
 *  @param {Align} [opts.align=Align.Left] - Alignement of the text
 *  @param {number} [opts.fontSize=RPM.defaultValue(RPM.datasGame.System.dbOptions.vtSize, - RPM.fontSize)]
 *  The font height used for the text
 *  @param {string} [opts.fontName=RPM.defaultValue(RPM.datasGame.System.dbOptions.vtFont, - RPM.fontName)]
 *  The font name used for the text
 *  @param {AlignVertical} [opts.verticalAlign=AlignVertical.Center] - Vertical
 *  alignement of the text
 *  @param {SystemColor} [opts.color=RPM.defaultValue(RPM.datasGame.System.dbOptions.vtcText]
 *  The color used for the text
 *  @param {boolean} [opts.bold=false] - If checked, make the text bold
 *  @param {boolean} [opts.italic=false] - If checked, make the text italic
 *  @param {SystemColor} [opts.backColor=RPM.defaultValue(RPM.datasGame.System.dbOptions.vtcBackground, - null)]
 *  The background color behind the text
 *  @param {SystemColor} [opts.strokeColor=RPM.defaultValue(RPM.datasGame.System.dbOptions.tOutline, - false)? RPM.defaultValue(RPM.datasGame.System.dbOptions.vtcOutline, null) : null]
 *  The stroke color of the text
 */
declare class Text extends Base {
    text: string;
    lines: string[];
    align: Align;
    fontSize: number;
    oFontSize: number;
    fontName: string;
    verticalAlign: AlignVertical;
    color: System.Color;
    bold: boolean;
    italic: boolean;
    backColor: System.Color;
    strokeColor: System.Color;
    font: string;
    textWidth: number;
    textHeight: number;
    datas: any;
    lastW: number;
    zoom: number;
    constructor(text?: string, { x, y, w, h, align, fontSize, fontName, verticalAlign, color, bold, italic, backColor, strokeColor }?: {
        x?: number;
        y?: number;
        w?: number;
        h?: number;
        align?: Enum.Align;
        fontSize?: number;
        fontName?: string;
        verticalAlign?: Enum.AlignVertical;
        color?: System.Color;
        bold?: boolean;
        italic?: boolean;
        backColor?: System.Color;
        strokeColor?: System.Color;
    });
    wrapText(maxWidth: number): void;
    /**
     *  Set the font size and the final font.
     *  @param {number} fontSize - The new font size
     */
    setFontSize(fontSize: number): void;
    /**
     *  Set the final font.
     */
    updateFont(): void;
    /**
     *  Set the current displayed text.
     *  @param {string} text - The new text
     */
    setText(text: string): void;
    /**
     *  Update the context font with resizing.
     */
    updateContextFont(): void;
    /**
     *  Measure text width and stock results in the instance.
     */
    measureText(): void;
    /**
     *  Drawing the text in choice box.
     *  @param {number} [x=this.x] - The x position to draw graphic
     *  @param {number} [y=this.y] - The y position to draw graphic
     *  @param {number} [w=this.w] - The width dimention to draw graphic
     *  @param {number} [h=this.h] - The height dimention to draw graphic
     */
    drawChoice(x?: number, y?: number, w?: number, h?: number): void;
    /**
     *  Drawing the text in box (duplicate of drawChoice).
     *  @param {number} [x=this.oX] - The x position to draw graphic
     *  @param {number} [y=this.oY] - The y position to draw graphic
     *  @param {number} [w=this.oW] - The width dimention to draw graphic
     *  @param {number} [h=this.oH] - The height dimention to draw graphic
     */
    draw(x?: number, y?: number, w?: number, h?: number): void;
}
export { Text };
