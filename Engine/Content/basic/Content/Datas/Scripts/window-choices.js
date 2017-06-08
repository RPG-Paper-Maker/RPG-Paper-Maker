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

var OrientationWindow = Object.freeze(
  {
     Vertical: 0,
     Horizontal: 1
  }
)

// -------------------------------------------------------
//
//  CLASS WindowChoices
//
//  A class for window choices.
//  @orientation                 -> The orientation of the window (horizontal or vertical)
//  @dimension                   -> The dimension of one choice box
//  @listCallbacks              -> List of all the callback functions to excecute when pressed
//  @listWindows                 -> List of all the windows to display
//  @currentSelectedIndex        -> The current selected index
//  @unselectedBackgroundColor   -> The backgorund color of unselected item
//  @selectedBackgroundColor     -> The backgorund color of selected item
//
// -------------------------------------------------------

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

    setY: function(y){
        Bitmap.prototype.setY.call(this, y);
    },

    setW: function(w){
        Bitmap.prototype.setW.call(this, w);
    },

    setH: function(h){
        Bitmap.prototype.setH.call(this, h);
    },

    getCurrentContent: function(){
        return this.getContent(this.currentSelectedIndex);
    },

    // -------------------------------------------------------

    getContent: function(i){
        return this.listWindows[i].content;
    },

    // -------------------------------------------------------

    setContent: function(i, content){
         this.listWindows[i].content = content;
    },

    // -------------------------------------------------------

    setContents: function(contents){
        for (var i = 0, l = this.listWindows.length; i < l; i++)
            this.setContent(i, contents[i]);
    },

    // -------------------------------------------------------

    unselect: function(){
        if (this.currentSelectedIndex !== -1){
            this.listWindows[this.currentSelectedIndex].backgroundColor
                 = this.unselectedBackgroundColor;
            this.currentSelectedIndex = -1;
        }
    },

    // -------------------------------------------------------

    select: function(i){
        this.currentSelectedIndex = i;
        this.listWindows[this.currentSelectedIndex].backgroundColor
             = this.selectedBackgroundColor;
    },

    // -------------------------------------------------------

    goUp: function(){
        if (this.currentSelectedIndex > 0)
            this.currentSelectedIndex--;
        else if (this.currentSelectedIndex === 0)
            this.currentSelectedIndex = this.listWindows.length - 1;
    },

    // -------------------------------------------------------

    goDown: function(){
        if (this.currentSelectedIndex < this.listWindows.length - 1)
            this.currentSelectedIndex++;
        else if (this.currentSelectedIndex === this.listWindows.length - 1)
            this.currentSelectedIndex = 0;
    },

    // -------------------------------------------------------

    onKeyPressed: function(key, base){
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Action))
        {
            var callback = this.listCallBacks[this.currentSelectedIndex];
            if (callback !== null) callback.call(base);
        }
    },

    // -------------------------------------------------------

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

        this.select(this.currentSelectedIndex);
    },

    // -------------------------------------------------------

    draw: function(context){
        for (var i = 0, l = this.listWindows.length; i < l; i++)
            this.listWindows[i].draw(context, true);
    }
}
