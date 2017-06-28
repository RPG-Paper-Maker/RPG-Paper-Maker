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
//  CLASS EventCommandStartBattle
//
// -------------------------------------------------------

/** @class
*   An event command for battle processing.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {boolean} canEscape Boolean indicating if the player can escape
*   this battle.
*   @property {boolean} canGameOver Boolean indicating if there a win/lose node
*   or not.
*   @property {JSON} command Direct JSON command to parse.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandStartBattle(command){
    this.canEscape = command[0] === 1;
    this.canGameOver = command[1] === 1;
    command.shift();
    command.shift();
    this.command = command;
    this.isDirectNode = false;
    this.parallel = false;
}

EventCommandStartBattle.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (sceneBattle).
    */
    initialize: function(){
        return {
            sceneBattle: null
        };
    },

    // -------------------------------------------------------

    /** Parsing and starting a battle scene.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){

        // Initializing battle
        if (currentState.sceneBattle === null){
            var i = 0;
            var type = this.command[i++];

            // Getting the troop ID
            var troopId;
            switch(type){
            case 0: // If only selecting a troop ID with comboBox
                troopId = this.command[i++];
                break;
            case 1: // If only selecting a troop ID with variable or constant
                var varConstType = this.command[i++];
                var varConstVal = this.command[i++];
                troopId =
                        (varConstType === 0) ? $game.listVariables[varConstVal]
                                             : varConstVal;
                break;
            case 2: // If random troop in map properties
                // TODO
            }

            // Defining the battle state instance
            var sceneBattle = new SceneBattle(troopId, this.canGameOver,
                                              this.canEscape);
             // Keep instance of battle state for results
            currentState.sceneBattle = sceneBattle;
            $gameStack.push(sceneBattle);

            return 0; // Stay on this command as soon as we are in battle state
        }

        // After the battle...
        var result = 1;
        // If there are not game overs, go to win/lose nodes
        if (!this.canGameOver){
            if (!currentState.sceneBattle.winning)
                result = 2;
        }

        return result;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandIfWin
//
// -------------------------------------------------------

/** @class
*   An event command for after a battle winning.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandIfWin(command){
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandIfWin.prototype = {
    initialize: function(){ return null; },

    /** Go inside the ifWin node.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        return -1;
    },

    // -------------------------------------------------------

    /** Returns the number of node to pass.
    *   @returns {number}
    */
    goToNextCommand : function(){
        return 3;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandIfLose
//
// -------------------------------------------------------

/** @class
*   An event command for after a battle winning.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandIfLose(command){
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandIfLose.prototype = {
    initialize: function(){ return null; },

    /** Go inside the ifLose node.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        return -1;
    },

    // -------------------------------------------------------

    /** Returns the number of node to pass.
    *   @returns {number}
    */
    goToNextCommand : function(){
        return 2;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeState
//
// -------------------------------------------------------

/** @class
*   An event command for changing an object state.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {number} idState The ID of the state to change.
*   @property {number} operationKind Index of operation.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandChangeState(command){

    // Parsing
    var i = 1;
    this.idState = command[i++];
    this.operationKind = command[i++];

    this.isDirectNode = true;
    this.parallel = false;
}

/** Add a state to an object.
*   @static
*   @param {Object} portionDatas Datas inside a portion.
*   @param {number} index Index in the portion datas.
*   @param {number} state ID of the state.
*/
EventCommandChangeState.addState = function(portionDatas, index, state){
    var states = portionDatas.s[index];

    if (states.indexOf(state) === -1)
        states.unshift(state);

    EventCommandChangeState.removeFromDatas(portionDatas, index, states);
}

// -------------------------------------------------------

/** Remove a state from an object.
*   @static
*   @param {Object} portionDatas Datas inside a portion.
*   @param {number} index Index in the portion datas.
*   @param {number} state ID of the state.
*/
EventCommandChangeState.removeState = function(portionDatas, index, state){
    var states = portionDatas.s[index];

    var indexState = states.indexOf(state);
    if (states.indexOf(state) !== -1)
        states.splice(indexState, 1);

    EventCommandChangeState.removeFromDatas(portionDatas, index, states);
}

// -------------------------------------------------------

/** Remove all the states from an object.
*   @static
*   @param {Object} portionDatas Datas inside a portion.
*   @param {number} index Index in the portion datas.
*   @param {number} state ID of the state.
*/
EventCommandChangeState.removeAll = function(portionDatas, index){
    portionDatas.s[index] = [];
}

// -------------------------------------------------------

/** Remove states from datas.
*   @static
*   @param {Object} portionDatas Datas inside a portion.
*   @param {number} index Index in the portion datas.
*   @param {number} state ID of the state.
*/
EventCommandChangeState.removeFromDatas = function(portionDatas, index, states){
    if (states.length === 1 && states[0] === 1){
        portionDatas.si.splice(index, 1);
        portionDatas.s.splice(index, 1);
    }
}

EventCommandChangeState.prototype = {

    initialize: function(){ return null; },

    /** Change the state of the object and finish.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        var portion = $currentMap.allObjects[object.system.id];
        var portionDatas = $game.mapsDatas[$currentMap.id]
                [portion[0]][portion[1]][portion[2]];
        var indexState = portionDatas.si.indexOf(object.system.id);
        if (indexState === -1){
            indexState = 0;
            portionDatas.si.unshift(object.system.id);
            portionDatas.s.unshift([1]);
        }

        switch(this.operationKind){
        case 0: // Replacing
            EventCommandChangeState.removeAll(portionDatas, indexState);
            EventCommandChangeState.addState(portionDatas, indexState,
                                             this.idState);
            break;
        case 1: // Adding
            EventCommandChangeState.addState(portionDatas, indexState,
                                             this.idState);
            break;
        case 2: // Deleting
            EventCommandChangeState.removeState(portionDatas, indexState,
                                                this.idState);
            break;
        }

        return 1;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandSendEvent
//
//  An event command for sending an event.
//
//  @targetKind  -> Kind of target
//  @idTarget    -> ID of target
//  @isSystem    -> Boolean indicating if it is an event system.
//  @eventId     -> ID of the event
//  @parameters  -> List of all the parameters
//
// -------------------------------------------------------

/** @class
*   An event command for sending an event.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {number} targetKind The kind of target.
*   @property {number} idTarget ID of target.
*   @property {boolean} isSystem Boolean indicating if it is an event system.
*   @property {number} eventId ID of the event.
*   @property {SystemParameter[]} parameters List of all the parameters.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandSendEvent(command){

    // Target
    var i = 0, j = 0;
    var l = command.length;
    this.targetKind = command[i++];
    switch(this.targetKind){
    case 1:
    case 2:
        this.idTarget = command[i++];
        break;
    }

    this.isSystem = command[i++] === "1";
    this.eventId = command[i++];


    // Parameters
    var events = this.isSystem ? $datasGame.commonEvents.eventsSystem :
                                 $datasGame.commonEvents.eventsUser;
    var parameters = events[this.eventId].parameters;
    this.parameters = [];
    while (i < l){
        var paramId = command[i++];
        var k = command[i++];
        var v = command[i++];
        var parameter = SystemValue.createValue(k, v);

        // If default value
        if (parameter.kind === 2)
            parameter = parameters[j].value;

        this.parameters.push(parameter);
        i++;
        j++;
    }

    this.isDirectNode = true;
    this.parallel = false;
}

/** Send an event.
*   @static
*   @param {MapObject} sender The sender of this event.
*   @param {number} targetKind The kind of target.
*   @param {number} idTarget ID of target.
*   @param {boolean} isSystem Boolean indicating if it is an event system.
*   @param {number} eventId ID of the event.
*   @param {SystemParameter[]} parameters List of all the parameters.
*/
EventCommandSendEvent.sendEvent = function(sender, targetKind, idTarget,
                                           isSystem, idEvent, parameters)
{
    var i, j, k, l, ll, portion, objects;
    var group = $currentMap.mapPortions;

    switch (targetKind){
    case 0: // Send to all
        break;
    case 1: // Send to detection
        var pos = $game.hero.mesh.position;
        var length = 1;
        var width = 1;
        var height = 1;

        for (var x = 0; x < length; x++){
            for (var y = 0; y < width; y++){
                for (var z = 0; z < height; z++){
                    portion = group[x][y][z];
                    objects = portion.objectsList;
                    ll = objects.length;
                    for (j = 0; j < ll; j++){
                        var object = objects[j];
                        var posObject = object.mesh.position;
                        if (posObject.x >= pos.x - ($SQUARE_SIZE / 2) &&
                            posObject.x <= pos.x + ($SQUARE_SIZE / 2) &&
                            posObject.y >= pos.y &&
                            posObject.y <= pos.y + $SQUARE_SIZE &&
                            posObject.z >= pos.z - $SQUARE_SIZE  -
                                ($SQUARE_SIZE / 2) &&
                            posObject.z <= pos.z + ($SQUARE_SIZE / 2)
                           )
                        {
                            // Get states
                            var states = [1];
                            var portionDatas =
                                    $game.mapsDatas[$currentMap.id]
                                    [x][y][z];
                            var indexState =
                                    portionDatas.si.indexOf(object.system.id);
                            if (indexState !== -1)
                                states = portionDatas.s[indexState];

                            // Make the object receive the event
                            object.receiveEvent(sender, isSystem, idEvent,
                                                parameters, states);
                        }
                    }
                }
            }
        }
        break;
    case 2: // Send to a particular object
        break;
    case 3: // Send to sender
        break;
    case 4: // Send to the hero
        $game.hero.receiveEvent(sender, isSystem, idEvent, parameters,
                                $game.heroStates);
        break;
    }
}

EventCommandSendEvent.prototype = {

    initialize: function(){ return null; },

    /** Send the event and finish.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        EventCommandSendEvent.sendEvent(object, this.targetKind, this.idTarget,
                                        this.isSystem, this.eventId,
                                        this.parameters);

        return 1;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandTeleportObject
//
// -------------------------------------------------------

/** @class
*   An event command for teleporting an object.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {number} objectID The ID of the object to teleport.
*   @property {number} idMap The ID of the map.
*   @property {number} x The x coordinate of the map.
*   @property {number} y The y coordinate of the map.
*   @property {number} yPlus The y plus coordinate of the map.
*   @property {number} z The z coordinate of the map.
*   @property {number} objectIDPosition The ID of the object to teleport on.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandTeleportObject(command){
    var i = 0, k, v;

    // Object ID
    k = command[i++];
    v = command[i++];
    this.objectID = SystemValue.createValue(k, v);

    // Position
    this.objectIDPosition = null;
    switch (command[i++]){
    case 0:
        this.idMap = SystemValue.createNumber(command[i++]);
        this.x = SystemValue.createNumber(command[i++]);
        this.y = SystemValue.createNumber(command[i++]);
        this.yPlus = SystemValue.createNumber(command[i++]);
        this.z = SystemValue.createNumber(command[i++]);
        break;
    case 1:
        k = command[i++];
        v = command[i++];
        this.idMap = SystemValue.createValue(k, v);
        k = command[i++];
        v = command[i++];
        this.x = SystemValue.createValue(k, v);
        k = command[i++];
        v = command[i++];
        this.y = SystemValue.createValue(k, v);
        k = command[i++];
        v = command[i++];
        this.yPlus = SystemValue.createValue(k, v);
        k = command[i++];
        v = command[i++];
        this.z = SystemValue.createValue(k, v);
        break;
    case 2:
        k = command[i++];
        v = command[i++];
        this.objectIDPosition = SystemValue.createValue(k, v);
        break;
    }

    // Options
    // TODO

    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandTeleportObject.prototype = {

    initialize: function(){ return null; },

    /** Teleport the object.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        var id = this.idMap.getValue();
        var objectID = this.objectID.getValue();

        // If needs teleport hero in another map
        if (objectID === 0 && $currentMap.id !== id){
            $currentMap.closeMap();
            $gameStack.replace(new SceneMap(id));
        }

        // Set object's position
        var position = new THREE.Vector3();
        if (this.objectIDPosition === null){
            position = Wanok.positionToVector3(
                [
                    this.x.getValue(),
                    this.y.getValue(),
                    this.yPlus.getValue(),
                    this.z.getValue(),
                ]
            );
        }

        switch (objectID){
        case -1: // This object
            object.mesh.position.set(position.x, position.y, position.z);
            break;
        case 0: // Hero
            $game.hero.mesh.position.set(position.x, position.y, position.z);
            break;
        default: // Particular object
            // TODO
            break;
        }

        return 1;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandMoveObject
//
// -------------------------------------------------------

/**
*   Enum for the different command moves kind.
*   @enum {number}
*   @readonly
*/
var CommandMoveKind = {
    MoveNorth: 0,
    MoveSouth: 1,
    MoveWest: 2,
    MoveEast: 3
}
Object.freeze(CommandMoveKind);

// -------------------------------------------------------

/** @class
*   An event command for moving object.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {number} objectID The ID of the object.
*   @property {boolean} isIgnore Ignore a move if impossible.
*   @property {boolean} isWaitEnd Wait then of all the moves to end the command
*   (parallel command).
*   @property {boolean} isCameraOrientation Take the orientation of the came in
*   count.
*   @property {function[]} moves All the moves callbacks.
*   @property {Object[]} parameters Parameters for ach moves callbacks.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandMoveObject(command){
    var i = 0, l = command.length;

    // Object ID
    var k = command[i++];
    var v = command[i++];
    this.objectID = SystemValue.createValue(k, v);

    // Options
    this.isIgnore = command[i++] === 1;
    this.isWaitEnd = command[i++] === 1;
    this.isCameraOrientation = command[i++] === 1;

    // List of move commands
    this.moves = [];
    this.parameters = [];
    while(i < l){
        var kind = command[i++];

        if (kind >= CommandMoveKind.MoveNorth &&
            kind <= CommandMoveKind.MoveEast)
        {
            this.parameters.push({ square: command[i++] === 0 });
            switch (kind){
            case CommandMoveKind.MoveNorth:
                this.moves.push(this.moveNorth);
                break;
            case CommandMoveKind.MoveSouth:
                this.moves.push(this.moveSouth);
                break;
            case CommandMoveKind.MoveWest:
                this.moves.push(this.moveWest);
                break;
            case CommandMoveKind.MoveEast:
                this.moves.push(this.moveEast);
                break;
            }
        }
    }

    this.isDirectNode = !this.isWaitEnd;
    this.parallel = !this.isWaitEnd;
}

EventCommandMoveObject.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (position, distance).
    */
    initialize: function(){
        return {
            parallel: this.isWaitEnd,
            index: 0,
            distance: 0,
            position: null
        }
    },

    // -------------------------------------------------------

    /** Function to move north.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {bool} square Indicate if it is a square move.
    *   @param {Orientation} orientation The orientation where to move.
    */
    move: function(currentState, object, square, orientation){

        var angle = this.isCameraOrientation ?
                    $currentMap.camera.horizontalAngle : -90.0;

        if (currentState.position === null && square)
        {
            currentState.position = object.getFuturPosition(orientation,
                                                            $SQUARE_SIZE,
                                                            angle);
        }

        currentState.distance += object.move(orientation, $SQUARE_SIZE -
                                             currentState.distance, angle);

        if (!square || (square && currentState.distance >= $SQUARE_SIZE)){
            if (square)
                object.position = currentState.position;

            return true;
        }

        return false;
    },

    // -------------------------------------------------------

    /** Function to move north.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveNorth: function(currentState, object, parameters){
        return this.move(currentState, object, parameters.square,
                         Orientation.North);
    },

    // -------------------------------------------------------

    /** Function to move south.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveSouth: function(currentState, object, parameters){
        return this.move(currentState, object, parameters.square,
                         Orientation.South);
    },

    // -------------------------------------------------------

    /** Function to move west.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveWest: function(currentState, object, parameters){
        return this.move(currentState, object, parameters.square,
                         Orientation.West);
    },

    // -------------------------------------------------------

    /** Function to move east.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The object to move.
    *   @param {Object} parameters The parameters.
    */
    moveEast: function(currentState, object, parameters){
        return this.move(currentState, object, parameters.square,
                         Orientation.East);
    },

    // -------------------------------------------------------

    /** Move the object(s).
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){

        if (currentState.parallel){
            var finished = this.moves[currentState.index].call(
                        this, currentState, object,
                        this.parameters[currentState.index]);

            if (finished){
                currentState.distance = 0;
                currentState.index = currentState.index + 1;
                currentState.position = null;
            }

            return (this.moves[currentState.index] == null) ? 1 : 0;
        }

        return 1;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}
