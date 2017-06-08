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
//  CLASS GameStack
//
// -------------------------------------------------------

/** @class
*   Class representing a point.
*   @property {String}   source path
*/
function GameStack(){
    this.content = [];
}

GameStack.prototype = {

    push: function(scene) {
        this.content.unshift(scene);
    },

    // -------------------------------------------------------

    pop: function() {
        return this.content.shift();
    },

    // -------------------------------------------------------

    replace: function(scene) {
        var pop = this.pop();
        this.push(scene);

        return pop;
    },

    // -------------------------------------------------------

    at: function(i) {
        return this.content[i];
    },

    // -------------------------------------------------------

    top: function() {
        return this.at(0);
    },

    // -------------------------------------------------------

    bot: function() {
        return this.at(this.content.length - 1);
    },

    // -------------------------------------------------------

    isEmpty: function() {
        return this.top() == null;
    },

    // -------------------------------------------------------

    /**
    * Create an array of all the right files in the source dir
    */
    update: function() {
        if (!this.isEmpty())
            this.top().update();
        else
            this.push(new SceneTitleScreen());
    },

    // -------------------------------------------------------

    /** First key press handle for the current stack.
    */
    onKeyPressed: function(key){
        if (!this.isEmpty())
            this.top().onKeyPressed(key);
    },

    // -------------------------------------------------------

    /** First key release handle for the current stack.
    */
    onKeyReleased: function(key){
        if (!this.isEmpty())
            this.top().onKeyReleased(key);
    },

    // -------------------------------------------------------

    /** Key pressed repeat handle for the current stack.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedRepeat: function(key){
        if (!this.isEmpty())
            return this.top().onKeyPressedRepeat(key);

        return true;
    },

    // -------------------------------------------------------

    /** Key pressed repeat handle for the current stack, but with
    *   a small wait after the first pressure (generally used for menus).
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedAndRepeat: function(key){
        if (!this.isEmpty())
            return this.top().onKeyPressedAndRepeat(key);

        return true;
    },

    // -------------------------------------------------------

    /** Draw the 3D for the current stack.
    */
    draw3D: function(canvas){
        if (!this.isEmpty())
            this.top().draw3D(canvas);
    },

    // -------------------------------------------------------

    /** Draw HUD for the current stack.
    */
    drawHUD: function(context){
        if (!this.isEmpty())
            this.top().drawHUD(context);
    }
}
