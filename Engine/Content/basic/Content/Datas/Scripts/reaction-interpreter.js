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
//  CLASS ReactionInterpreter
//
//  A reaction command interpreter.
//
//  @currentSender          -> Current event sender (null for system events).
//  @currentReaction        -> Current reaction excecuted (only one per state).
//  @currentMapObject       -> Current map object.
//  @currentState           -> Current state of map object reaction.
//  @currentCommand         -> A node of a command Reaction.
//  @currentCommandState    -> Current state of the current command.
//
// -------------------------------------------------------

function ReactionInterpreter(sender, reaction, object, state){
    this.setCurrentReaction(sender, reaction, object, state);
}

ReactionInterpreter.prototype = {

    setCurrentReaction: function(sender, reaction, object, state){
        this.currentSender = sender;
        this.currentReaction = reaction;
        this.currentMapObject = object;
        this.currentState = state;
        this.currentCommand = reaction.getFirstCommand();
        this.currentCommandState = this.currentCommand.data.initialize();
    },

    // -------------------------------------------------------

    isFinished: function(){
        if (this.currentCommand === null)
            return true;

        return false;
    },

    // -------------------------------------------------------

    update: function(){
        var directNode = true;

        while (directNode){
            var new_command = this.updateCommand();
            if (new_command !== this.currentCommand){
                this.currentCommand = new_command;
                if (this.currentCommand !== null){
                    this.currentCommandState =
                         this.currentCommand.data.initialize();
                    directNode = this.currentCommand.data.isDirectNode;
                }
                else
                    directNode = false;
            }
            else
                directNode = false;
        }
    },

    // -------------------------------------------------------

    updateCommand: function(i){

        // Update can return different type of values :
        var result = this.currentCommand.data.update(this.currentCommandState,
                                                     this.currentMapObject,
                                                     this.currentState);
        var value = null;

        // If the value is a string, then it can only be a label call
        if (typeof result === 'string'){
            // TODO
        }
        /* Else, that means it's a number which represents the number of nodes
        to skip */
        else{
            // If entering in a node
            if (result === -1){
                if (this.currentCommand.firstChild === null) Qt.quit();
                value = this.currentCommand.firstChild;
            }
            // If leaving last while node
            else if (result === -2){
                var whileNode = this.currentCommand.parent;
                while (whileNode !== null){
                    if (whileNode.data instanceof EventCommandWhile)
                        return this.goToNextCommand(whileNode);
                    whileNode = whileNode.parent;
                }
                /* If going here, that means there is no parent while...
                bring error */
                Wanok.show("Error : there is a breaking loop that is not inside"
                           + " a loop.");
            }
            // If positive number, then it's the number of nodes to skip
            else{
                value = this.currentCommand;
                for (var j = 1; j <= result; j++){
                    value = value.next;
                }
            }
        }

        return this.endOfBlock(this.currentCommand, value);
    },

    // -------------------------------------------------------

    endOfBlock: function(command, value){
        if (value === null){
            // If end of the event
            if (command.parent.parent === null)
                return null;

            // Else, it's only the end of a bloc of instructions
            else{
                // If while...
                if (command.parent.data instanceof EventCommandWhile){
                    return command.parent; // Redo the while command
                }
                /* If condition, choice, or other instruction bloc, leave it
                and go to next command */
                else{
                    return this.goToNextCommand(command.parent);
                }
            }
        }

        return value;
    },

    // -------------------------------------------------------

    goToNextCommand: function(node){
        var nb = node.data.goToNextCommand();
        var value = node;
        for (var i = 1; i <= nb; i++){
            value = value.next;
        }
        return this.endOfBlock(node, value);
    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        this.currentCommand.data.onKeyPressed(this.currentCommandState, key);
    },

    // -------------------------------------------------------

    onKeyReleased: function(key){
        this.currentCommand.data.onKeyReleased(this.currentCommandState, key);
    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){
        return this.currentCommand.data.onKeyPressedRepeat(
                    this.currentCommandState, key);
    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        return this.currentCommand.data.onKeyPressedAndRepeat(
                    this.currentCommandState, key);
    },

    // -------------------------------------------------------

    drawHUD: function(context){
        this.currentCommand.data.drawHUD(this.currentCommandState, context);
    }
}
