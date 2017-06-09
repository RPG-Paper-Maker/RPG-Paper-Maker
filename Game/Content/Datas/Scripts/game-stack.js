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
*   The game stack that is organizing the game scenes.
*   @property {SceneGame[]} content The stack content.
*/
function GameStack(){
    this.content = [];
}

GameStack.prototype = {

    /** Push a new scene in the stack.
    *   @param {SceneGame} scene The scene to push.
    */
    push: function(scene) {
        this.content.unshift(scene);
    },

    // -------------------------------------------------------

    /** Pop (remove) the last scene in the stack.
    *   @returns {SceneGame} The last scene that is removed.
    */
    pop: function() {
        return this.content.shift();
    },

    // -------------------------------------------------------

    /** Replace the last scene in the stack by a new scene.
    *   @param {SceneGame} scene The scene to replace.
    *   @returns {SceneGame} The last scene that is replaced.
    */
    replace: function(scene) {
        var pop = this.pop();
        this.push(scene);

        return pop;
    },

    // -------------------------------------------------------

    /** Get the scene at a specific index in the stack. 0 is the bottom of the
    *   stack.
    *   @param {number} i Index in the stack.
    *   @returns {SceneGame} The scene in the index of the stack.
    */
    at: function(i) {
        return this.content[i];
    },

    // -------------------------------------------------------

    /** Get the scene on the top of the stack.
    *   @returns {SceneGame}
    */
    top: function() {
        return this.at(0);
    },

    // -------------------------------------------------------

    /** Get the scene on the bottom of the stack.
    *   @returns {SceneGame}
    */
    bot: function() {
        return this.at(this.content.length - 1);
    },

    // -------------------------------------------------------

    /** Check if the stack is empty.
    *   @returns {boolean}
    */
    isEmpty: function() {
        return this.top() == null;
    },

    // -------------------------------------------------------

    /** Update the stack
    */
    update: function() {
        if (!this.isEmpty())
            this.top().update();
        else
            this.push(new SceneTitleScreen());
    },

    // -------------------------------------------------------

    /** First key press handle for the current stack.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed: function(key){
        if (!this.isEmpty())
            this.top().onKeyPressed(key);
    },

    // -------------------------------------------------------

    /** First key release handle for the current stack.
    *   @param {number} key The key ID released.
    */
    onKeyReleased: function(key){
        if (!this.isEmpty())
            this.top().onKeyReleased(key);
    },

    // -------------------------------------------------------

    /** Key pressed repeat handle for the current stack.
    *   @param {number} key The key ID pressed.
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
    *   @param {number} key The key ID pressed.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedAndRepeat: function(key){
        if (!this.isEmpty())
            return this.top().onKeyPressedAndRepeat(key);

        return true;
    },

    // -------------------------------------------------------

    /** Draw the 3D for the current stack.
    *   @param {Canvas} canvas The 3D canvas.
    */
    draw3D: function(canvas){
        if (!this.isEmpty())
            this.top().draw3D(canvas);
    },

    // -------------------------------------------------------

    /** Draw HUD for the current stack.
    *   @param {Canvas.Context} context The canvas context.
    */
    drawHUD: function(context){
        if (!this.isEmpty())
            this.top().drawHUD(context);
    }
}
