/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Picture2D, Tree, Game } from '../Core/index.js';
import { Datas, System, Graphic } from '../index.js';
import { Enum, Constants, Utils, ScreenResolution } from '../Common/index.js';
var PictureKind = Enum.PictureKind;
var TagKind = Enum.TagKind;
var Align = Enum.Align;
/** @class
 *  A class for message show text command.
 *  @extends Graphic.Base
 *  @param {string} message - The complete text to parse
 *  @param {number} facesetID - The faceset picture ID
 */
class Message extends Graphic.Base {
    constructor(message, facesetID, facesetIndexX, facesetIndexY) {
        super();
        this.message = message;
        this.faceset = Datas.Pictures.getPictureCopy(PictureKind.Facesets, facesetID);
        this.facesetIndexX = facesetIndexX;
        this.facesetIndexY = facesetIndexY;
        this.graphics = [];
        this.positions = [];
        this.setMessage(this.message);
    }
    /**
     *  Set message (parse).
     *  @param {string} message - The message to parse
     */
    setMessage(message) {
        this.tree = new Tree(null);
        let root = this.tree.root;
        let currentNode = root;
        let lastC = 0;
        let notClosed = [];
        let c, l, ch, open, cr, tag, tagKind, split;
        for (c = 0, l = message.length; c < l; c++) {
            ch = message.charAt(c);
            if (ch === Constants.STRING_NEW_LINE) {
                // If text before..
                if (c > lastC) {
                    currentNode = this.updateTag(currentNode, TagKind.Text, message.substring(lastC, c), true, notClosed);
                }
                lastC = c + 1;
                currentNode = this.updateTag(currentNode, TagKind.NewLine, null, true, notClosed);
            }
            else if (ch === Constants.STRING_BRACKET_LEFT) {
                open = message.charAt(c + 1) !== Constants.STRING_SLASH;
                // If text before..
                if (c > lastC) {
                    currentNode = this.updateTag(currentNode, TagKind.Text, message.substring(lastC, c), true, notClosed);
                }
                cr = c;
                do {
                    cr++;
                    ch = message.charAt(cr);
                } while (cr < l && ch !== Constants.STRING_BRACKET_RIGHT);
                tag = message.substring(c + (open ? 1 : 2), cr);
                if (tag === Message.TAG_BOLD) {
                    tagKind = TagKind.Bold;
                }
                else if (tag === Message.TAG_ITALIC) {
                    tagKind = TagKind.Italic;
                }
                else if (tag === Message.TAG_LEFT) {
                    tagKind = TagKind.Left;
                }
                else if (tag === Message.TAG_CENTER) {
                    tagKind = TagKind.Center;
                }
                else if (tag === Message.TAG_RIGHT) {
                    tagKind = TagKind.Right;
                }
                else if (tag.includes(Message.TAG_SIZE)) {
                    tagKind = TagKind.Size;
                }
                else if (tag.includes(Message.TAG_FONT)) {
                    tagKind = TagKind.Font;
                }
                else if (tag.includes(Message.TAG_TEXT_COLOR)) {
                    tagKind = TagKind.TextColor;
                }
                else if (tag.includes(Message.TAG_BACK_COLOR)) {
                    tagKind = TagKind.BackColor;
                }
                else if (tag.includes(Message.TAG_STROKE_COLOR)) {
                    tagKind = TagKind.StrokeColor;
                }
                else if (tag.includes(Message.TAG_VARIABLE)) {
                    tagKind = TagKind.Variable;
                }
                else if (tag.includes(Message.TAG_PARAMETER)) {
                    tagKind = TagKind.Parameter;
                }
                else if (tag.includes(Message.TAG_PROPERTY)) {
                    tagKind = TagKind.Property;
                }
                else if (tag.includes(Message.TAG_HERO_NAME)) {
                    tagKind = TagKind.HeroName;
                }
                else if (tag.includes(Message.TAG_ICON)) {
                    tagKind = TagKind.Icon;
                }
                else {
                    tagKind = TagKind.Text;
                }
                if (tagKind === TagKind.Text) {
                    currentNode = this.updateTag(currentNode, TagKind.Text, message.substring(c, cr + 1), true, notClosed);
                }
                else {
                    split = tag.split(Constants.STRING_EQUAL);
                    currentNode = this.updateTag(currentNode, tagKind, open &&
                        split.length > 1 ? split[1] : null, open, notClosed);
                }
                lastC = cr + 1;
                c = cr;
            }
        }
        if (l === 0 || c > lastC) {
            currentNode = this.updateTag(currentNode, TagKind.Text, message
                .substring(lastC, c), true, notClosed);
        }
    }
    /**
     *  Update tag.
     *  @param {Node} currentNode - The current node
     *  @param {TagKind} tag - The tag kind
     *  @param {string} value - The tag value
     *  @param {boolean} open - Indicate if open tag
     *  @param {Node[]} notClosed - List of unclosed nodes
     *  @returns {Node}
     */
    updateTag(currentNode, tag, value, open, notClosed) {
        if (open) {
            for (let i = notClosed.length - 1; i >= 0; i--) {
                currentNode = currentNode.add(notClosed[i]);
                notClosed.splice(i, 1);
            }
            let nodeValue = value;
            switch (tag) {
                case TagKind.Variable:
                case TagKind.HeroName:
                    nodeValue = System.DynamicValue.createVariable(parseInt(value));
                    break;
                case TagKind.Parameter:
                    nodeValue = System.DynamicValue.createParameter(parseInt(value));
                    break;
                case TagKind.Property:
                    nodeValue = System.DynamicValue.createProperty(parseInt(value));
                    break;
            }
            currentNode.add([tag, nodeValue]);
            if (tag !== TagKind.Text && tag !== TagKind.NewLine && tag !==
                TagKind.Variable && tag !== TagKind.Icon && tag !== TagKind
                .Property && tag !== TagKind.Parameter && tag !== TagKind
                .HeroName) {
                currentNode = currentNode.lastChild;
            }
        }
        else {
            while (currentNode !== null && currentNode.data !== null &&
                currentNode.data[0] !== tag) {
                notClosed.push(currentNode.data);
                currentNode = currentNode.parent;
            }
            currentNode = currentNode.parent;
        }
        return currentNode;
    }
    /**
     *  Update all.
     */
    update() {
        this.graphics = [];
        this.positions = [];
        this.heights = [];
        this.aligns = [];
        this.heights.push(0);
        let result = {
            g: this.graphics,
            p: this.positions,
            a: this.aligns,
            h: this.heights,
            ca: Align.Left,
            cb: false,
            ci: false,
            cs: Utils.defaultValue(Datas.Systems.dbOptions.v_tSize, Constants
                .DEFAULT_FONT_SIZE),
            cf: Utils.defaultValue(Datas.Systems.dbOptions.v_tFont, Constants
                .DEFAULT_FONT_NAME),
            ctc: Utils.defaultValue(Datas.Systems.dbOptions.v_tcText, System
                .Color.WHITE),
            cbc: Utils.defaultValue(Datas.Systems.dbOptions.v_tcBackground, null),
            csc: Utils.defaultValue(Datas.Systems.dbOptions.v_tOutline, false) ?
                Utils.defaultValue(Datas.Systems.dbOptions.v_tcOutline, null) :
                null
        };
        // Update nodes
        this.updateNodes(this.tree.root.firstChild, result);
        // Calculate width of align blocks for aligns settings
        this.totalWidths = [];
        let currentAlign, c, width, align;
        for (let i = 0, l = this.graphics.length; i < l; i++) {
            currentAlign = this.aligns[i];
            c = i;
            width = 0;
            while (c < l) {
                align = this.aligns[c];
                if (align !== currentAlign) {
                    break;
                }
                width += this.positions[c];
                c++;
            }
            this.totalWidths.push(width);
            i = c - 1;
        }
    }
    /**
     *  Update the nodes.
     *  @param {Node} node - The current node
     *  @param {Record<string, any>} - result The result object
     */
    updateNodes(node, result) {
        let tag = node.data[0];
        let value = node.data[1];
        let bold, italic, align, size, font, textColor, backColor, strokeColor;
        switch (tag) {
            case TagKind.NewLine:
                result.g.push(null);
                result.p.push(0);
                result.a.push(-1);
                if (result.h[0] === 0) {
                    result.h[0] = result.cs;
                }
                result.h.unshift(0);
                break;
            case TagKind.Text:
            case TagKind.Variable:
            case TagKind.Parameter:
            case TagKind.Property:
            case TagKind.HeroName: {
                let text;
                switch (node.data[0]) {
                    case TagKind.Text:
                        text = value;
                        break;
                    case TagKind.Variable:
                        text = Utils.numToString(value.getValue());
                        break;
                    case TagKind.Parameter:
                        text = Utils.numToString(value.getValue());
                        break;
                    case TagKind.Property:
                        text = Utils.numToString(value.getValue());
                        break;
                    case TagKind.HeroName:
                        text = Game.current.getHeroByInstanceID(value.getValue())
                            .name;
                        break;
                }
                let graphic = new Graphic.Text(text, {
                    bold: result.cb,
                    italic: result.ci,
                    fontSize: result.cs,
                    fontName: result.cf,
                    color: result.ctc,
                    backColor: result.cbc,
                    strokeColor: result.csc
                });
                result.g.push(graphic);
                graphic.measureText();
                result.p.push(graphic.textWidth);
                result.a.push(result.ca);
                if (graphic.fontSize > result.h[0]) {
                    result.h[0] = graphic.fontSize;
                }
                break;
            }
            case TagKind.Icon: {
                let args = value.split(";");
                let graphic = Datas.Pictures.getPictureCopy(PictureKind.Icons, parseInt(args[0]));
                graphic.sx = parseInt(args[1]) * Datas.Systems.iconsSize;
                if (isNaN(graphic.sx)) {
                    graphic.sx = 0;
                }
                graphic.sy = parseInt(args[2]) * Datas.Systems.iconsSize;
                if (isNaN(graphic.sy)) {
                    graphic.sy = 0;
                }
                result.g.push(graphic);
                result.p.push(ScreenResolution.getScreenMinXY(Datas.Systems.iconsSize));
                result.a.push(result.ca);
                if (Constants.DEFAULT_FONT_SIZE > result.h[0]) {
                    result.h[0] = Constants.DEFAULT_FONT_SIZE;
                }
                break;
            }
            case TagKind.Bold:
                bold = result.cb;
                result.cb = true;
                break;
            case TagKind.Italic:
                italic = result.ci;
                result.ci = true;
                break;
            case TagKind.Left:
                align = result.ca;
                result.ca = Align.Left;
                break;
            case TagKind.Center:
                align = result.ca;
                result.ca = Align.Center;
                break;
            case TagKind.Right:
                align = result.ca;
                result.ca = Align.Right;
                break;
            case TagKind.Size:
                size = result.cs;
                result.cs = Datas.Systems.getFontSize(value).getValue();
                break;
            case TagKind.Font:
                font = result.cf;
                result.cf = Datas.Systems.getFontName(value).getName();
                break;
            case TagKind.TextColor:
                textColor = result.ctc;
                result.ctc = Datas.Systems.getColor(value);
                break;
            case TagKind.BackColor:
                backColor = result.cbc;
                result.cbc = Datas.Systems.getColor(value);
                break;
            case TagKind.StrokeColor:
                strokeColor = result.csc;
                result.csc = Datas.Systems.getColor(value);
                break;
        }
        if (node.firstChild !== null) {
            this.updateNodes(node.firstChild, result);
        }
        // Handle closures
        switch (node.data[0]) {
            case TagKind.Bold:
                result.cb = bold;
                break;
            case TagKind.Italic:
                result.ci = italic;
                break;
            case TagKind.Left:
            case TagKind.Center:
            case TagKind.Right:
                result.ca = align;
                break;
            case TagKind.Size:
                result.cs = size;
                break;
            case TagKind.Font:
                result.cf = font;
                break;
            case TagKind.TextColor:
                result.ctc = textColor;
                break;
            case TagKind.BackColor:
                result.cbc = backColor;
                break;
            case TagKind.StrokeColor:
                result.csc = strokeColor;
                break;
        }
        // Go next if possible
        if (node.next !== null) {
            this.updateNodes(node.next, result);
        }
    }
    /**
     *  Drawing the faceset behind.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawBehind(x, y, w, h) {
        if (!Datas.Systems.dbOptions.v_fPosAbove) {
            this.drawFaceset(x, y, w, h);
        }
    }
    /**
     *  Drawing the faceset.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawFaceset(x, y, w, h) {
        this.faceset.draw({ x: x + Utils.defaultValue(ScreenResolution
                .getScreenMinXY(Datas.Systems.dbOptions.v_fX), 0), y: y -
                ((ScreenResolution.getScreenMinXY(Datas.Systems.facesetScalingHeight)
                    - h) / 2) + Utils.defaultValue(ScreenResolution.getScreenMinXY(Datas
                .Systems.dbOptions.v_fY), 0), w: Datas.Systems.facesetScalingWidth,
            h: Datas.Systems.facesetScalingHeight, sx: this.facesetIndexX * Datas
                .Systems.facesetsSize, sy: this.facesetIndexY * Datas.Systems
                .facesetsSize, sw: Datas.Systems.facesetsSize, sh: Datas.Systems
                .facesetsSize });
    }
    /**
     *  Drawing the message box.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x = this.oX, y = this.oY, w = this.oW, h = this.oH) {
        this.draw(x, y, w, h);
    }
    /**
     *  Drawing the message.
     *  @param {number} [x=this.oX] - The x position to draw graphic
     *  @param {number} [y=this.oY] - The y position to draw graphic
     *  @param {number} [w=this.oW] - The width dimention to draw graphic
     *  @param {number} [h=this.oH] - The height dimention to draw graphic
     *  @param {boolean} [positionResize=true] - If checked, resize postion
     *  according to screen resolution
     */
    draw(x = this.oX, y = this.oY, w = this.oW, h = this.oH) {
        if (Datas.Systems.dbOptions.v_fPosAbove) {
            this.drawFaceset(x, y, w, h);
        }
        let newX = x + ScreenResolution.getScreenMinXY(Constants.HUGE_SPACE) +
            (this.faceset.empty ? 0 : ScreenResolution.getScreenMinXY(Datas
                .Systems.facesetScalingWidth));
        let newY = y + ScreenResolution.getScreenMinXY(Constants.HUGE_SPACE);
        let offsetY = 0;
        let align = Align.None;
        let c = this.heights.length - 1;
        // Draw each graphics
        let offsetX = 0;
        let graphic;
        for (let i = 0, j = 0, l = this.graphics.length; i < l; i++) {
            graphic = this.graphics[i];
            // New line
            if (graphic === null) {
                offsetY += this.heights[c--] * 2;
                align = Align.None;
                j++;
            }
            else {
                if (align !== this.aligns[i]) {
                    align = this.aligns[i];
                    switch (align) {
                        case Align.Left:
                            offsetX = 0;
                            break;
                        case Align.Center:
                            offsetX = (w - this.totalWidths[j] - newX) / 2;
                            break;
                        case Align.Right:
                            offsetX = w - this.totalWidths[j] - newX;
                            break;
                    }
                    j++;
                }
                if (graphic instanceof Picture2D) {
                    graphic.draw({ x: newX + offsetX, y: newY - (ScreenResolution
                            .getScreenMinXY(Datas.Systems.iconsSize) / 2) + offsetY,
                        sw: Datas.Systems.iconsSize, sh: Datas.Systems.iconsSize,
                        w: Datas.Systems.iconsSize, h: Datas.Systems.iconsSize });
                }
                else {
                    graphic.draw(newX + offsetX, newY + offsetY, graphic.oW, graphic.oH);
                }
                offsetX += this.positions[i];
            }
        }
    }
}
Message.TAG_BOLD = "b";
Message.TAG_ITALIC = "i";
Message.TAG_LEFT = "l";
Message.TAG_CENTER = "c";
Message.TAG_RIGHT = "r";
Message.TAG_SIZE = "size";
Message.TAG_FONT = "font";
Message.TAG_TEXT_COLOR = "textcolor";
Message.TAG_BACK_COLOR = "backcolor";
Message.TAG_STROKE_COLOR = "strokecolor";
Message.TAG_VARIABLE = "var";
Message.TAG_PARAMETER = "par";
Message.TAG_PROPERTY = "pro";
Message.TAG_HERO_NAME = "hname";
Message.TAG_ICON = "ico";
export { Message };
