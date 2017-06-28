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
*   Enum for the different orientations kind.
*   @enum {string}
*   @readonly
*/
var Orientation = {
    South: 0,
    West: 1,
    North: 2,
    East: 3
}
Object.freeze(Orientation);

// -------------------------------------------------------
//
//  CLASS MapObject
//
// -------------------------------------------------------

/** @class
*   Element movable in local map.
*   @property {SystemObject} system System infos.
*   @property {number} speed Speed coef.
*   @property {Orientation} orientationEye Where the character is looking.
*   @property {THREE.Mesh} mesh The current mesh used for this object.
*   @param {THREE.Mesh} mesh The current mesh used for this object.
*   @param {SystemObject} system System infos.
*/
function MapObject(mesh, system, w, h) {
    this.mesh = mesh;
    this.system = system;
    this.speed = 1.0;
    this.frame = 0;
    this.orientationEye = Orientation.South;
    this.width = w;
    this.height = h;
    this.frameDuration = 150;
    this.frameNumber = 4;
    this.moving = false;
    this.frameTick = 0;
    this.position = new THREE.Vector3(this.mesh.position.x,
                                      this.mesh.position.y,
                                      this.mesh.position.z);

    // Current state
    if (Wanok.isEmpty(system.states))
        this.currentState = null;
    else
        this.currentState = system.states[0];
}

/** Normal speed coef.
*   @constant
*   @static
*   @default 0.004666
*/
MapObject.SPEED_NORMAL = 0.004666;

MapObject.prototype = {

    /** Read the JSON associated to the object.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json){
        var jsonPosition = json.k;
        this.mesh.position = Wanok.positionToVector3(jsonPosition);
        this.position = Wanok.positionToVector3(jsonPosition);
        this.system = new SystemObject;
        this.system.readJSON(json.v);
    },

    /** Simulate moving object position.
    *   @param {Orientation} orientation Where to move.
    *   @param {number} distance The distance.
    *   @returns {THREE.Vector3}
    */
    getFuturPosition: function(orientation, distance, angle){

        var position = new THREE.Vector3(this.position.x,
                                         this.position.y,
                                         this.position.z);

        // The speed depends on the time elapsed since the last update
        var xPlus, zPlus, xAbs, zAbs, res;
        var w = $currentMap.mapInfos.length * $SQUARE_SIZE;
        var h = $currentMap.mapInfos.width * $SQUARE_SIZE;

        switch (orientation){
        case Orientation.South:
            xPlus = distance * Wanok.cos(angle * Math.PI / 180.0);
            zPlus = distance * Wanok.sin(angle * Math.PI / 180.0);
            res = position.z - zPlus;
            if (res >= 0 && res < h)
                position.setZ(res);
            res = position.x - xPlus;
            if (res >= 0 && res < w)
                position.setX(res);
            break;
        case Orientation.West:
            xPlus = distance * Wanok.cos((angle - 90.0) * Math.PI / 180.0);
            zPlus = distance * Wanok.sin((angle - 90.0) * Math.PI / 180.0);
            res = position.x + xPlus;
            if (res >= 0 && res < w)
                position.setX(res);
            res = position.z + zPlus;
            if (res >= 0 && res < h)
               position.setZ(res);
            break;
        case Orientation.North:
            xPlus = distance * Wanok.cos(angle * Math.PI / 180.0);
            zPlus = distance * Wanok.sin(angle * Math.PI / 180.0);
            res = position.z + zPlus;
            if (res >= 0 && res < h)
                position.setZ(res);
            res = position.x + xPlus;
            if (res >= 0 && res < w)
                position.setX(res);
            break;
        case Orientation.East:
            xPlus = distance * Wanok.cos((angle - 90.0) * Math.PI / 180.0);
            zPlus = distance * Wanok.sin((angle - 90.0) * Math.PI / 180.0);
            res = position.x - xPlus;
            if (res >= 0 && res < w)
                position.setX(res);
            res = position.z - zPlus;
            if (res >= 0 && res < h)
                position.setZ(res);
            break;
        default:
            break;
        }

        return position;
    },

    /** Move the object (one step).
    *   @param {Orientation} orientation Where to move.
    *   @param {number} limit Max distance to go.
    *   @returns {number} Distance cross.
    */
    move: function(orientation, limit, angle){
        var objects = $game.mapsDatas[$currentMap.id][0][0][0];
        var movedObjects = objects.m;

        // Remove from move
        var index = movedObjects.indexOf(this);
        if (index !== -1)
            movedObjects.splice(index, 1);

        // Set position
        var distance = Math.min(limit, this.speed * ($elapsedTime *
                                       MapObject.SPEED_NORMAL *
                                       $SQUARE_SIZE));
        var position = this.getFuturPosition(orientation, distance, angle);
        this.position.set(position.x, position.y, position.z);

        // Update orientation
        if (this.orientationEye !== orientation){
            this.orientationEye = orientation;
            this.updateUVs();
        }

        this.moving = true;

        // Add to moving objects
        movedObjects.unshift(this);

        return distance;
    },

    // -------------------------------------------------------

    /** Receive an event.
    *   @param {MapObject} sender The sender of this event.
    *   @param {boolean} isSystem Boolean indicating if it is an event system.
    *   @param {number} eventId ID of the event.
    *   @param {SystemParameter[]} parameters List of all the parameters.
    *   @param {numbers[]} states List of all the current states of the object.
    */
    receiveEvent: function(sender, isSystem, idEvent, parameters, states){
        var i, j, l, ll;

        for (i = 0, l = states.length; i < l; i++){
            var state = states[i];
            var reactions = this.system.getReactions(isSystem, idEvent,
                                                     states[i], parameters);

            for (j = 0, ll = reactions.length; j < ll; j++)
                SceneGame.prototype.addReaction.call($gameStack.top(), sender,
                                                     reactions[j], this, state);
        }
    },

    // -------------------------------------------------------

    /** Update the object graphics.
    */
    update: function(){
        var frame = this.frame;

        if (this.moving){

            // If moving, update frame
            if (this.currentState.moveAnimation){
                this.frameTick += $elapsedTime;
                if (this.frameTick >= this.frameDuration){
                    this.frame = (this.frame + 1) % this.frameNumber;
                    this.frameTick = 0;
                }
            }

            // Update mesh position
            var offset = (this.currentState.pixelOffset &&
                          this.frame % 2 !== 0) ? 1 : 0;
            this.mesh.position.set(this.position.x,
                                   this.position.y + offset,
                                   this.position.z);
            this.moving = false;
        }
        else{
            this.frame = 0;
        }

        // Update mesh
        if (frame !== this.frame)
            this.updateUVs();
    },

    // -------------------------------------------------------

    /** Update the UVs coordinates according to frame and orientation.
    */
    updateUVs : function(){
        var textureWidth = this.mesh.material.map.image.width;
        var textureHeight = this.mesh.material.map.image.height;
        var w = this.width * $SQUARE_SIZE / textureWidth;
        var h = this.height * $SQUARE_SIZE / textureHeight;
        var x = this.frame * w;
        var y = this.orientationEye * h;

        // Update geometry
        this.mesh.geometry.faceVertexUvs[0][0][0].set(x, y);
        this.mesh.geometry.faceVertexUvs[0][0][1].set(x + w, y);
        this.mesh.geometry.faceVertexUvs[0][0][2].set(x + w, y + h);
        this.mesh.geometry.faceVertexUvs[0][1][0].set(x, y);
        this.mesh.geometry.faceVertexUvs[0][1][1].set(x + w, y + h);
        this.mesh.geometry.faceVertexUvs[0][1][2].set(x, y + h);
        this.mesh.geometry.uvsNeedUpdate = true;
    }
}
