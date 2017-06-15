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
*   Enum for the different window choice orientations.
*   @enum {number}
*   @readonly
*/
var OrientationWindow = {
    Vertical: 0,
    Horizontal: 1
};
Object.freeze(OrientationWindow);

// -------------------------------------------------------
//
//  CLASS WindowChoices
//
// -------------------------------------------------------

/** @class
*   A class for window choices.
*   @extends Bitmap
*   @property {OrientationWindow} orientation The orientation of the window.
*   (horizontal or vertical).
*   @property {number[]} dimension The dimension of one choice box.
*   @property {function[]} listCallbacks List of all the callback functions to
*   excecute when pressed.
*   @property {WindowBox[]} listWindows List of all the windows to display.
*   @property {number} currentSelectedIndex The current selected index.
*   @property {string} unselectedBackgroundColor The backgorund color of
*   unselected item.
*   @property {string} selectedBackgroundColor The backgorund color of selected
*   item.
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
    // Getting the main box size
    var boxWidth, boxHeight;
    var totalNb = listContents.length;
    var size = totalNb < nbItemsMax ? totalNb : nbItemsMax;
    if (orientation === OrientationWindow.Horizontal){
        boxWidth = w * size;
        boxHeight = h;
    }
    else{
        boxWidth = w;
        boxHeight = h * size;
    }
    Bitmap.call(this, x, y, boxWidth, boxHeight);

    // Default values
    if (typeof padding === 'undefined') padding = [0,0,0,0];
    if (typeof space === 'undefined') space = 0;
    if (typeof currentSelectedIndex === 'undefined') currentSelectedIndex = 0;

    this.orientation = orientation;
    this.choiceWidth = w;
    this.choiceHeight = h;
    this.currentSelectedIndex = currentSelectedIndex;
    this.unselectedBackgroundColor = "grey";
    this.selectedBackgroundColor = "silver";
    this.space = space;

    // If no callBacks, adapt by creating a null content for each box
    var i, l = listContents.length;
    if (listCallBacks === null){
        this.listCallBacks = new Array(l);
        for (i = 0; i < l; i++)
            this.listCallBacks[i] = null;
    }
    else
         this.listCallBacks = listCallBacks;

    // Create a new windowBox for each choice and according to the orientation
    this.listWindows = new Array(l);
    for (i = 0; i < l; i++){
        if (orientation === OrientationWindow.Horizontal){
            this.listWindows[i] =
                 new WindowBox(x + (i * w) + (i * space), y, w, h,
                               listContents[i], padding);
        }
        else{
            this.listWindows[i] =
                 new WindowBox(x, y + (i * h) + (i * space), w, h,
                               listContents[i], padding);
        }
    }

    if (currentSelectedIndex !== -1){
        this.listWindows[currentSelectedIndex].backgroundColor
             = this.selectedBackgroundColor;
    }
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

    /** Get the current selected content.
    *   @returns {Object}
    */
    getCurrentContent: function(){
        return this.getContent(this.currentSelectedIndex);
    },

    // -------------------------------------------------------

    /** Get the content at a specific index.
    *   @param {number} i The index.
    *   @returns {Object}
    */
    getContent: function(i){
        return this.listWindows[i].content;
    },

    // -------------------------------------------------------

    /** Set the content at a specific index.
    *   @param {number} i The index.
    *   @param {Object} content The new content.
    */
    setContent: function(i, content){
         this.listWindows[i].content = content;
    },

    // -------------------------------------------------------

    /** Set all the contents.
    *   @param {Object[]} contents All the contents.
    */
    setContents: function(contents){
        for (var i = 0, l = this.listWindows.length; i < l; i++)
            this.setContent(i, contents[i]);
    },

    // -------------------------------------------------------

    /** Unselect a choice.
    */
    unselect: function(){
        if (this.currentSelectedIndex !== -1){
            this.listWindows[this.currentSelectedIndex].backgroundColor
                 = this.unselectedBackgroundColor;
            this.currentSelectedIndex = -1;
        }
    },

    // -------------------------------------------------------

    /** Select a choice.
    *   @param {number} i The index of the choice.
    */
    select: function(i){
        this.currentSelectedIndex = i;
        this.listWindows[this.currentSelectedIndex].backgroundColor
             = this.selectedBackgroundColor;
    },

    // -------------------------------------------------------

    /** Select the current choice.
    */
    selectCurrent: function(){
        this.select(this.currentSelectedIndex);
    },

    // -------------------------------------------------------

    /** When going up.
    */
    goUp: function(){
        if (this.currentSelectedIndex > 0)
            this.currentSelectedIndex--;
        else if (this.currentSelectedIndex === 0)
            this.currentSelectedIndex = this.listWindows.length - 1;
    },

    // -------------------------------------------------------

    /** When going down.
    */
    goDown: function(){
        if (this.currentSelectedIndex < this.listWindows.length - 1)
            this.currentSelectedIndex++;
        else if (this.currentSelectedIndex === this.listWindows.length - 1)
            this.currentSelectedIndex = 0;
    },

    // -------------------------------------------------------

    /** First key press handle.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed: function(key, base){
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Action))
        {
            var callback = this.listCallBacks[this.currentSelectedIndex];
            if (callback !== null) callback.call(base);
        }
    },

    // -------------------------------------------------------

    /** Key pressed repeat handle, but with
    *   a small wait after the first pressure (generally used for menus).
    *   @param {number} key The key ID pressed.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedAndRepeat: function(key){
        this.listWindows[this.currentSelectedIndex].backgroundColor
             = this.unselectedBackgroundColor;

        if (this.orientation === OrientationWindow.Vertical){
            if (DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.menuControls.Down))
            {
                this.goDown();
            }
            else if (DatasKeyBoard.isKeyEqual(key,
                                              $datasGame.keyBoard.menuControls
                                              .Up))
            {
                this.goUp();
            }
        }
        else{
            if (DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.menuControls
                                         .Right))
            {
                this.goDown();
            }
            else if (DatasKeyBoard.isKeyEqual(key,
                                              $datasGame.keyBoard.menuControls
                                              .Left))
            {
                this.goUp();
            }
        }

        this.selectCurrent();
    },

    // -------------------------------------------------------

    /** Draw the windows
    *   @param {Canvas.Context} context The canvas context.
    */
    draw: function(context){
        for (var i = 0, l = this.listWindows.length; i < l; i++)
            this.listWindows[i].draw(context, true);
    }
}
