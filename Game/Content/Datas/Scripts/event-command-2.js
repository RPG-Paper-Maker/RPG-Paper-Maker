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
//  CLASS EventCommandTeleportObject
//
//  An event command for teleporting an object.
//
//  @objectID           -> The ID of the object to teleport.
//  @idMap              -> The ID of the map.
//  @x                  -> The x coordinate of the map.
//  @y                  -> The y coordinate of the map.
//  @yPlus              -> The y plys coordinate of the map.
//  @z                  -> The z coordinate of the map.
//  @objectIDPosition   -> The ID of the object to teleport on.
//
// -------------------------------------------------------

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
}

EventCommandTeleportObject.prototype = {

    initialize: function(){ return null; },

    update: function(currentState, object, state){
        var id = this.idMap.getValue();
        var objectID = this.objectID.getValue();

        // If needs teleport hero in another map
        if (objectID === 0 && $gameStack.top().id !== id){
            $gameStack.top().closeMap();
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
//  An event command for moving object.
//
//  @objectID              -> The ID of the object.
//  @isIgnore              -> Ignore a move if impossible.
//  @isWaitEnd             -> Wait then of all the moves to end the command (parallel command).
//  @isCameraOrientation   -> Take the orientation of the came in count.
//  @moves                 -> All the moves (list of functions).
//
// -------------------------------------------------------

var CommandMoveKind = Object.freeze(
    {
        MoveNorth: 0,
        MoveSouth: 1,
        MoveWest: 2,
        MoveEast: 3
    }
)

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
    while(i < l){
        var kind = command[i++];

        switch (kind){
        case CommandMoveKind.MoveNorth:
            this.moves.push(EventCommandMoveObject.moveNorth);
            break;
        case CommandMoveKind.MoveSouth:
            this.moves.push(EventCommandMoveObject.moveSouth);
            break;
        case CommandMoveKind.MoveWest:
            this.moves.push(EventCommandMoveObject.moveWest);
            break;
        case CommandMoveKind.MoveEast:
            this.moves.push(EventCommandMoveObject.moveEast);
            break;
        }
    }

    this.isDirectNode = !this.isWaitEnd;
}

EventCommandMoveObject.moveNorth = function(currentState, object, w, h){
    object.move(Orientation.North, w, h);
}

EventCommandMoveObject.moveSouth = function(currentState, object, w, h){
    object.move(Orientation.South, w, h);
}

EventCommandMoveObject.moveWest = function(currentState, object, w, h){
    object.move(Orientation.West, w, h);
}

EventCommandMoveObject.moveEast = function(currentState, object, w, h){
    object.move(Orientation.East, w, h);
}

EventCommandMoveObject.prototype = {

    initialize: function(){
        return {
            position: 0,
            left: null
        }
    },

    update: function(currentState, object, state){
        this.moves[0].call(null, currentState, object,
                           $gameStack.bot().mapInfos.length,
                           $gameStack.bot().mapInfos.width);

        return 1;
    },

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}
