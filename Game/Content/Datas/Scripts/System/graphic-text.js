/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
*   Enum for the different aligns kind.
*   @enum {string}
*   @readonly
*/
var Align = {
    Left: "left",
    Right: "right",
    Center: "center"
}
Object.freeze(Align);

// -------------------------------------------------------
//
//  CLASS GraphicText : Bitmap
//
// -------------------------------------------------------

/** @class
*   A class for all the texts to display in screen.
*   @extends Bitmap
*   @property {string} text The brut text to display.
*   @property {Align} align Alignement of the text.
*   @property {string} font The font used for the text.
*   @property {number} fontSize The font height used for the text.
*   @param {string} text The brut text to display.
*   @param {Align} [align=Align.Center] - Alignement of the text.
*   @param {number} [fontSize=$fontSize] - The font height used for the text.
*   @param {string} [fontName=$fontName] - The font name used for the text.
*   @param {number} x The x coords of the text.
*   @param {number} y The y coords of the text.
*   @param {number} w The w coords of the text.
*   @param {number} h The h coords of the text.
*/
function GraphicText(text, align, fontSize, fontName, x, y, w, h){
    Bitmap.call(this, x, y, w, h);

    // Default values
    if (typeof align === 'undefined') align = Align.Center;
    if (typeof fontSize === 'undefined') fontSize = $fontSize;
    if (typeof fontName === 'undefined') fontName = $fontName;

    this.text = text;
    this.align = align;

    // Font
    this.fontWithoutResize = RPM.createFont(fontSize, fontName);
    fontSize = RPM.getScreenXY(fontSize);
    this.font = RPM.createFont(fontSize, fontName);
    this.fontSize = fontSize;
}

GraphicText.prototype = {

    setX: function(x){
        Bitmap.prototype.setX.call(this, x);
    },

    // -------------------------------------------------------

    setY: function(y){
        Bitmap.prototype.setY.call(this, y);
    },

    // -------------------------------------------------------

    setW: function(w){
        Bitmap.prototype.setW.call(this, w);
    },

    // -------------------------------------------------------

    setH: function(h){
        Bitmap.prototype.setH.call(this, h);
    },

    // -------------------------------------------------------

    setCoords: function(x, y, w, h){
        Bitmap.prototype.setCoords.call(this, x, y, w, h);
    },

    /** Update the context font (without window resizing). This function is
    *   used before a context.measureText.
    *   @param {Canvas.Context} context The canvas context.
    */
    updateContextFont: function(context){
        context.font = this.fontWithoutResize;
    },

    // -------------------------------------------------------

    /** Drawing the text in choice box.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(context, x, y, w, h){

        // Default values
        if (typeof x === 'undefined') x = this.x;
        if (typeof y === 'undefined') y = this.y;
        if (typeof w === 'undefined') w = this.w;
        if (typeof h === 'undefined') h = this.h;

        x = RPM.getScreenX(x);
        y = RPM.getScreenY(y);
        w = RPM.getScreenX(w);
        h = RPM.getScreenY(h);

        // Set context options
        context.fillStyle = "white";
        context.font = this.font;
        context.textAlign = this.align;

        // Correcting x and y according to alignment
        y += (h / 2) + (this.fontSize / 3);
        switch(this.align){
        case Align.Right:
            x += w; break;
        case Align.Center:
            x += (w / 2); break;
        }

        // Drawinf the text
        context.fillText(this.text, x, y);
    },

    // -------------------------------------------------------

    /** Drawing the text in choice box.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(context, x, y, w, h){
        this.draw(context, x, y, w, h);
    }
}
