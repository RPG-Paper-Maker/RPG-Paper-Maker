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
//  Abstract class for the game stack.
//
//  @reactionInterpreters  -> The reaction interpreters for parallel reactions
//  @parallelCommands      -> Commands that are still running without blocking
//                                    any other command
//
// -------------------------------------------------------

/** @class
*   Class
*   @property {String}   source path
*/
function SceneGame(){
    this.reactionInterpreters = new Array;
    this.parallelCommands = new Array;
}

SceneGame.prototype = {

    /**
    * Create an array of all the right files in the source dir
    */
    update: function() {
        var i, l;

        // Parallel reactions
        SceneGame.prototype.updateInterpreters.call(this);

        // Parallel comands
        SceneGame.prototype.updateParallelCommands.call(this);
    },

    // -------------------------------------------------------

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

    addReaction: function(sender, reaction, object, state){
        if (reaction.getFirstCommand() !== null){
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

    onKeyPressed: function(key) {
        var i, l;

        for (i = 0, l = this.reactionInterpreters.length; i < l; i++){
            this.reactionInterpreters[i].onKeyPressed(key);
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(key){
        var i, l;

        for (i = 0, l = this.reactionInterpreters.length; i < l; i++){
            this.reactionInterpreters[i].onKeyReleased(key);
        }
    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){
        var i, l;

        for (i = 0, l = this.reactionInterpreters.length; i < l; i++){
            this.reactionInterpreters[i].onKeyPressedRepeat(key);
        }

        return true;
    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        var i, l;

        for (i = 0, l = this.reactionInterpreters.length; i < l; i++){
            this.reactionInterpreters[i].onKeyPressedAndRepeat(key);
        }
    },

    // -------------------------------------------------------

    draw3D: function(canvas) {},

    // -------------------------------------------------------

    drawHUD: function(context) {
        var i, l;

        for (i = 0, l = this.reactionInterpreters.length; i < l; i++){
            this.reactionInterpreters[i].drawHUD(context);
        }
    }
}
