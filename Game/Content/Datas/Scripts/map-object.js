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
function MapObject(mesh, system) {
    this.mesh = mesh;
    this.system = system;
    this.speed = 1.0;
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
        this.system = new SystemObject;
        this.system.readJSON(json.v);
    },

    /** Move the object (one step).
    *   @param {Orientation} orientation Where to move.
    *   @param {number} w The width of the map.
    *   @param {number} h The height of the map.
    */
    move: function(orientation, w, h){

        // The speed depends on the time elapsed since the last update
        var speed = this.speed * ((new Date().getTime() - $elapsedTime) *
                                  MapObject.SPEED_NORMAL * $SQUARE_SIZE);
        var angle = -90;
        var x_plus, z_plus, x_s, z_s, x_f, z_f;

        x_s = Wanok.getSquare(this.mesh.position.x);
        z_s = Wanok.getSquare(this.mesh.position.z);

        switch (orientation){
        case Orientation.South:
            x_plus = speed * (Math.cos(angle * Math.PI / 180.0));
            z_plus = speed * (Math.sin(angle * Math.PI / 180.0));
            z_f = Math.floor(z_plus);

            if ((z_s < (w - 1) && z_plus < 0) || (z_s >= 0 && z_plus > 0))
                this.mesh.position.setZ(this.mesh.position.z - z_plus);
            if (z_f === 0 && ((x_s < (w - 1) && x_plus < 0) ||
                              (x_s >= 0 && x_plus > 0)))
            {
                this.mesh.position.setX(this.mesh.position.x - x_plus);
            }
            break;
        case Orientation.West:
            x_plus = speed * (Math.cos((angle - 90.0) * Math.PI / 180.0));
            z_plus = speed * (Math.sin((angle - 90.0) * Math.PI / 180.0));
            x_f = Math.floor(x_plus);

            if ((x_s >= 0 && x_plus < 0) || (x_s < (w - 1) && x_plus > 0))
                this.mesh.position.setX(this.mesh.position.x + x_plus);
            if (x_f === 0 && ((z_s >= 0 && z_plus < 0) ||
                              (z_s < (h - 1) && z_plus > 0)))
            {
                this.mesh.position.setZ(this.mesh.position.z + z_plus);
            }
            break;
        case Orientation.North:
            x_plus = speed * (Math.cos(angle * Math.PI / 180.0));
            z_plus = speed * (Math.sin(angle * Math.PI / 180.0));
            z_f = Math.floor(z_plus);

            if ((z_s >= 0 && z_plus < 0) || (z_s < (w - 1) && z_plus > 0))
                this.mesh.position.setZ(this.mesh.position.z + z_plus);
            if (z_f === 0 && ((x_s >= 0 && x_plus < 0) ||
                              (x_s < (w - 1) && x_plus > 0)))
            {
                this.mesh.position.setX(this.mesh.position.x + x_plus);
            }
            break;
        case Orientation.East:
            x_plus = speed * (Math.cos((angle - 90.0) * Math.PI / 180.0));
            z_plus = speed * (Math.sin((angle - 90.0) * Math.PI / 180.0));
            x_f = Math.floor(x_plus);

            if ((x_s < (w - 1) && x_plus < 0) || (x_s > 0 && x_plus >= 0))
                this.mesh.position.setX(this.mesh.position.x - x_plus);
            if (x_f === 0 && ((z_s < (h - 1) && z_plus < 0) ||
                              (z_s > 0 && z_plus >= 0)))
            {
                this.mesh.position.setZ(this.mesh.position.z - z_plus);
            }
            break;
        default:
            break;
        }
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

    update: function(){

    }
}
