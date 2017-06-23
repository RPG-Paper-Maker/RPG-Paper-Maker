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
//  CLASS SceneGame
//
// -------------------------------------------------------

/** @class
*   Abstract class for the game stack.
*   @property {ReactionInterpreter[]} reactionInterpreters The reaction
*   interpreters for parallel reactions.
*   @property {Node[]} parallelCommands Commands that are still running without
*   blocking any other command.
*   @property {function} [callBackAfterLoading=null] A function to call after
*   loading completed. The function should be put to null after all the stuff
*   done.
*/
function SceneGame(){
    this.reactionInterpreters = new Array;
    this.parallelCommands = new Array;
    this.callBackAfterLoading = null;
}

SceneGame.prototype = {

    /** Update the scene.
    */
    update: function() {
        var i, l;

        // Parallel reactions
        SceneGame.prototype.updateInterpreters.call(this);

        // Parallel comands
        SceneGame.prototype.updateParallelCommands.call(this);
    },

    // -------------------------------------------------------

    /** Update all the reactions.
    */
    updateInterpreters: function(){
        var i, l;
        var interpreter;
        // Index of all the finished parallel reactions
        var endingReactions = new Array;

        // Blocking hero
        $blockingHero = false;
        for (i = 0, l = this.reactionInterpreters.length; i < l; i++){
            if (this.reactionInterpreters[i].currentReaction.blockingHero){
                $blockingHero = true;
                break;
            }
        }

        // Updating all parallel events
        for (i = 0, l = this.reactionInterpreters.length; i < l; i++){
            interpreter = this.reactionInterpreters[i];
            interpreter.update();
            if (interpreter.isFinished()) {
                endingReactions.unshift(i);
            }
        }

        // Deleting finished reactions
        for (i = 0, l = endingReactions.length; i < l; i++){
            this.reactionInterpreters.splice(endingReactions[i], 1);
        }
    },

    // -------------------------------------------------------

    /** Update all the parallel commands.
    */
    updateParallelCommands: function(){
        var i, l;
        var endingCommands = new Array; // Index of all the finished commands

        for (i = 0, l = this.parallelCommands.length; i < l; i++){
            var resultCommand = this.parallelCommands[i].data.update();
            if (resultCommand !== 0)
                endingCommands.unshift(i);
        }

        for (i = 0, l = endingCommands.length; i < l; i++){
            this.parallelCommands.splice(endingCommands[i], 1);
        }
    },

    // -------------------------------------------------------

    /** Add a reaction in the interpreter list.
    *   @param {MapObject} sender The sender of this reaction.
    *   @param {SystemReaction} reaction The reaction to add.
    *   @param {MapObject} object The object reacting.
    *   @param {number} state The state ID.
    */
    addReaction: function(sender, reaction, object, state){
        if (reaction.getFirstCommand().data !== null){
            var reactionInterpreter;

            var excecuted = false;

            for (var i = 0, l = this.reactionInterpreters.length; i < l; i++){
                reactionInterpreter = this.reactionInterpreters[i];
                if (reactionInterpreter.currentMapObject === object &&
                    reactionInterpreter.currentReaction === reaction)
                {
                    excecuted = true;
                    break;
                }
            }


            if (!excecuted){
                reactionInterpreter = new ReactionInterpreter(sender,
                                                              reaction, object,
                                                              state);
                this.reactionInterpreters.push(reactionInterpreter);
            }
        }
    },

    // -------------------------------------------------------

    /** First key press handle.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed: function(key) {
        var i, l;

        for (i = 0, l = this.reactionInterpreters.length; i < l; i++){
            this.reactionInterpreters[i].onKeyPressed(key);
        }
    },

    // -------------------------------------------------------

    /** First key release handle.
    *   @param {number} key The key ID released.
    */
    onKeyReleased: function(key){
        var i, l;

        for (i = 0, l = this.reactionInterpreters.length; i < l; i++){
            this.reactionInterpreters[i].onKeyReleased(key);
        }
    },

    // -------------------------------------------------------

    /** Key pressed repeat handle.
    *   @param {number} key The key ID pressed.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedRepeat: function(key){
        var i, l;

        for (i = 0, l = this.reactionInterpreters.length; i < l; i++){
            this.reactionInterpreters[i].onKeyPressedRepeat(key);
        }

        return true;
    },

    // -------------------------------------------------------

    /** Key pressed repeat handle, but with
    *   a small wait after the first pressure (generally used for menus).
    *   @param {number} key The key ID pressed.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedAndRepeat: function(key){
        var i, l;

        for (i = 0, l = this.reactionInterpreters.length; i < l; i++){
            this.reactionInterpreters[i].onKeyPressedAndRepeat(key);
        }
    },

    // -------------------------------------------------------

    /** Draw the 3D.
    *   @param {Canvas} canvas The 3D canvas.
    */
    draw3D: function(canvas) {},

    // -------------------------------------------------------

    /** Draw HUD.
    *   @param {Canvas.Context} context The canvas context.
    */
    drawHUD: function(context) {
        var i, l;

        for (i = 0, l = this.reactionInterpreters.length; i < l; i++){
            this.reactionInterpreters[i].drawHUD(context);
        }
    }
}
