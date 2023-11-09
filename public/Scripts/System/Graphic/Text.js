/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils, Constants, ScreenResolution, Platform } from '../Common/index.js';
var Align = Enum.Align;
var AlignVertical = Enum.AlignVertical;
import { Stack } from '../Manager/index.js';
import { Base } from './Base.js';
import { Datas, System } from '../index.js';
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
class Text extends Base {
    constructor(text = '', { x = 0, y = 0, w = 0, h = 0, align = Align.Left, fontSize = Utils.defaultValue(Datas.Systems.dbOptions.v_tSize, Constants
        .DEFAULT_FONT_SIZE), fontName = Utils.defaultValue(Datas.Systems
        .dbOptions.v_tFont, Constants.DEFAULT_FONT_NAME), verticalAlign = AlignVertical.Center, color = Utils.defaultValue(Datas.Systems.dbOptions
        .v_tcText, System.Color.WHITE), bold = false, italic = false, backColor = Utils.defaultValue(Datas.Systems.dbOptions.v_tcBackground, null), strokeColor = Utils.defaultValue(Datas.Systems.dbOptions.tOutline, false) ? Utils.defaultValue(Datas.Systems.dbOptions.v_tcOutline, null) : null } = {}) {
        super(x, y, w, h);
        this.lastW = 0;
        this.zoom = 1;
        this.align = align;
        this.fontName = fontName;
        this.verticalAlign = verticalAlign;
        this.color = color;
        this.bold = bold;
        this.italic = italic;
        this.backColor = backColor;
        this.strokeColor = strokeColor;
        this.setFontSize(fontSize);
        this.setText(Utils.defaultValue(text, ''));
    }
    wrapText(maxWidth) {
        let text = this.text.replace('\\n', Constants.STRING_NEW_LINE);
        let lines = text.split(Constants.STRING_NEW_LINE);
        let words = [];
        let i, j, l, m, tempWords;
        for (i = 0, l = lines.length; i < l; i++) {
            tempWords = lines[i].split(' ');
            for (j = 0, m = tempWords.length; j < m; j++) {
                words.push(tempWords[j]);
            }
            if (i < l - 1) {
                words.push(Constants.STRING_NEW_LINE);
            }
        }
        this.lines = [];
        let currentLine = words[0];
        for (let i = 1, l = words.length; i < l; i++) {
            let word = words[i];
            if (word === Constants.STRING_NEW_LINE) {
                this.lines.push(currentLine);
                currentLine = words[++i];
                continue;
            }
            let width = Platform.ctx.measureText(currentLine + ' ' + word)
                .width + (this.strokeColor === null ? 0 : 2);
            if (width < maxWidth) {
                currentLine += " " + word;
            }
            else {
                this.lines.push(currentLine);
                currentLine = word;
            }
        }
        this.lines.push(currentLine);
        this.measureText();
    }
    /**
     *  Set the font size and the final font.
     *  @param {number} fontSize - The new font size
     */
    setFontSize(fontSize) {
        this.oFontSize = fontSize;
        this.fontSize = ScreenResolution.getScreenMinXY(fontSize);
        this.updateFont();
    }
    /**
     *  Set the final font.
     */
    updateFont() {
        this.font = Utils.createFont(this.fontSize, this.fontName, this.bold, this.italic);
    }
    /**
     *  Set the current displayed text.
     *  @param {string} text - The new text
     */
    setText(text) {
        text += ""; // Be sure that it's string type
        if (this.text !== text) {
            this.text = text;
            this.lines = this.text.split(Constants.STRING_NEW_LINE);
            this.measureText();
            Stack.requestPaintHUD = true;
        }
    }
    /**
     *  Update the context font with resizing.
     */
    updateContextFont() {
        Platform.ctx.font = this.font;
    }
    /**
     *  Measure text width and stock results in the instance.
     */
    measureText() {
        this.updateContextFont();
        this.textWidth = 0;
        let l = this.lines.length;
        let size;
        for (let i = 0; i < l; i++) {
            size = Platform.ctx.measureText(this.lines[i]).width + (this
                .strokeColor === null ? 0 : ScreenResolution.getScreenMinXY(2));
            if (size > this.textWidth) {
                this.textWidth = size;
            }
        }
        this.textHeight = this.fontSize * 2 * l;
    }
    /**
     *  Drawing the text in choice box.
     *  @param {number} [x=this.x] - The x position to draw graphic
     *  @param {number} [y=this.y] - The y position to draw graphic
     *  @param {number} [w=this.w] - The width dimention to draw graphic
     *  @param {number} [h=this.h] - The height dimention to draw graphic
     */
    drawChoice(x = this.x, y = this.y, w = this.w, h = this.h) {
        // Correcting x and y according to alignment
        let xBack = x;
        if (this.zoom !== 1) {
            this.fontSize *= this.zoom;
            this.updateFont();
            this.measureText();
        }
        // Wrap text if != 0
        if (this.lastW !== w && w !== 0) {
            this.lastW = w;
            this.updateContextFont();
            this.wrapText(w);
        }
        let textWidth = this.textWidth;
        let textHeight = this.fontSize + ScreenResolution.getScreenMinXY(this
            .strokeColor === null ? 0 : 2);
        switch (this.align) {
            case Align.Left:
                x += ScreenResolution.getScreenMinXY(1);
                break;
            case Align.Right:
                x += w - ScreenResolution.getScreenMinXY(1);
                xBack = x - textWidth;
                break;
            case Align.Center:
                x += (w / 2);
                xBack = x - (textWidth / 2);
                break;
        }
        switch (this.verticalAlign) {
            case AlignVertical.Bot:
                y += (this.fontSize / 3) + h;
                break;
            case AlignVertical.Top:
                y += this.fontSize;
                break;
            case AlignVertical.Center:
                y += (this.fontSize / 3) + (h / 2);
                break;
        }
        // Draw background color
        if (this.backColor !== null) {
            Platform.ctx.fillStyle = this.backColor.rgb;
            Platform.ctx.fillRect(xBack, y - textHeight, textWidth, textHeight);
        }
        // Set context options
        Platform.ctx.font = this.font;
        Platform.ctx.textAlign = this.align;
        let lineHeight = this.fontSize * 2;
        let i, l = this.lines.length;
        // Stroke text
        let yOffset;
        if (this.strokeColor !== null) {
            Platform.ctx.strokeStyle = this.strokeColor.rgb;
            yOffset = 0;
            for (i = 0; i < l; i++) {
                Platform.ctx.strokeText(this.lines[i], x - 1, y - 1 + yOffset);
                Platform.ctx.strokeText(this.lines[i], x - 1, y + 1 + yOffset);
                Platform.ctx.strokeText(this.lines[i], x + 1, y - 1 + yOffset);
                Platform.ctx.strokeText(this.lines[i], x + 1, y + 1 + yOffset);
                yOffset += lineHeight;
            }
        }
        // Drawing the text
        Platform.ctx.fillStyle = this.color.rgb;
        yOffset = 0;
        for (i = 0; i < l; i++) {
            Platform.ctx.fillText(this.lines[i], x, y + yOffset);
            yOffset += lineHeight;
        }
        // Fix font back
        if (this.zoom !== 1) {
            this.setFontSize(this.oFontSize);
            this.measureText();
        }
    }
    /**
     *  Drawing the text in box (duplicate of drawChoice).
     *  @param {number} [x=this.oX] - The x position to draw graphic
     *  @param {number} [y=this.oY] - The y position to draw graphic
     *  @param {number} [w=this.oW] - The width dimention to draw graphic
     *  @param {number} [h=this.oH] - The height dimention to draw graphic
     */
    draw(x = this.x, y = this.y, w = this.w, h = this.h) {
        this.drawChoice(x, y, w, h);
    }
}
export { Text };
