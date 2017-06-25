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

// -------------------------------------------------------
//
//  CLASS WindowChoices : WindowTabs
//
// -------------------------------------------------------

/** @class
*   A class for window choices.
*   @extends WindowTabs
*   @property {WindowBox} windowMain The main window for the choices.
*   @param {OrientationWindow} orientation The orientation of the window.
*   @param {number} x The x coords.
*   @param {number} y The y coords.
*   @param {number} w The w coords.
*   @param {number} h The h coords.
*   @param {number} nbItemsMax Max number of items to display on screen.
*   @param {Object[]} listContents List of all the contents to display.
*   @param {function[]} listCallbacks List of all the callback functions to
*   excecute when pressed.
*   @param {number[]} [padding=[0,0,0,0]] - Padding of the boxes.
*   @param {number} [space=0] - Space between each choice.
*   @param {number} [currentSelectedIndex=[0,0,0,0]] - The current selected
*   index.
*/
function WindowChoices(orientation, x, y, w, h, nbItemsMax, listContents,
                       listCallBacks, padding, space, currentSelectedIndex)
{
    WindowTabs.call(this, orientation, x, y, w, h, nbItemsMax, listContents,
                    listCallBacks, padding, space, currentSelectedIndex);

    var i, l;

    // Set all the windows borders opacity to 0
    for (i = 0, l = this.listWindows.length; i < l; i++)
        this.listWindows[i].bordersOpacity = 0;

    // Create a main window containing all this sub-windows choices
    this.windowMain = new WindowBox(this.x, this.y, this.w, this.h);
}

WindowChoices.prototype = {

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

    getCurrentContent: function(){
        return WindowTabs.prototype.getCurrentContent.call(this);
    },

    // -------------------------------------------------------

    getContent: function(i){
        return WindowTabs.prototype.getContent.call(this, i);
    },

    // -------------------------------------------------------

    setContent: function(i, content){
        WindowTabs.prototype.setContent.call(this, i, content);
    },

    // -------------------------------------------------------

    setContents: function(contents){
        WindowTabs.prototype.setContents.call(this, contents);
    },

    // -------------------------------------------------------

    unselect: function(){
        WindowTabs.prototype.unselect.call(this);
    },

    // -------------------------------------------------------

    select: function(i){
        WindowTabs.prototype.select.call(this, i);
    },

    // -------------------------------------------------------

    selectCurrent: function(){
        WindowTabs.prototype.selectCurrent.call(this);
    },

    // -------------------------------------------------------

    onKeyPressed: function(key, base){
        WindowTabs.prototype.onKeyPressed.call(this, key, base);
    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        WindowTabs.prototype.onKeyPressedAndRepeat.call(this, key);
    },

    // -------------------------------------------------------

    /** Draw the windows
    *   @param {Canvas.Context} context The canvas context.
    */
    draw: function(context){
        this.windowMain.draw(context);

        WindowTabs.prototype.draw.call(this, context);
    }
}
