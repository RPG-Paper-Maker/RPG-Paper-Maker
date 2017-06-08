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

var Align = Object.freeze(
    {
        Left: "left",
        Right: "right",
        Center: "center"
    }
)

// -------------------------------------------------------
//
//  CLASS Text : Bitmap
//
//  A class for all the texts to display in screen.
//
//  @text   -> The brut text to display
//  @align  -> Alignement of the text
//  @font          -> The font used for the text
//  @fontSize      -> The font height used for the text
//
// -------------------------------------------------------

function GraphicText(text, align, fontSize, fontName, x, y, w, h){
    Bitmap.call(this, x, y, w, h);

    // Default values
    if (typeof align === 'undefined') align = Align.Center;
    if (typeof fontSize === 'undefined') fontSize = $fontSize;
    if (typeof fontName === 'undefined') fontName = $fontName;

    this.text = text;
    this.align = align;

    // Font
    fontSize = Wanok.getScreenXY(fontSize);
    this.font = Wanok.createFont(fontSize, fontName);
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

    draw: function(context, x, y, w, h){

        // Default values
        if (typeof x === 'undefined') x = this.x;
        if (typeof y === 'undefined') y = this.y;
        if (typeof w === 'undefined') w = this.w;
        if (typeof h === 'undefined') h = this.h;

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

    drawInformations: function(context, x, y, w, h){
        this.draw(context, x, y, w, h);
    }
}
