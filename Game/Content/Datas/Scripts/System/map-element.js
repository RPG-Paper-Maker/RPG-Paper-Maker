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
*   Enum for the different camera up down orientation kind.
*   @enum {string}
*   @readonly
*/
var CameraUpDown = {
    None: 0,
    Up: 1,
    Down: 2
}
Object.freeze(CameraUpDown);

// -------------------------------------------------------
//
//  CLASS MapElement
//
// -------------------------------------------------------

/** @class
*   An element in the map.
*   @property {Orientation} orientation The orientation according to layer.
*   @property {CameraUpDown} upDown The camera up down orientation according to
*   layer.
*   @property {number} xOffset The offset of the object according to layer.
*   @property {number} yOffset The offset of the object according to layer.
*   @property {number} zOffset The offset of the object according to layer.
*/
function MapElement() {
    this.orientation = Orientation.South;
    this.upDown = CameraUpDown.None;
    this.xOffset = 0;
    this.yOffset = 0;
    this.zOffset = 0;
}

MapElement.prototype = {

    /** Read the JSON associated to the map element.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json) {
        var orientation = json.o;
        var upDown = json.up;
        var x = json.xOff;
        var y = json.yOff;
        var z = json.zOff;

        if (typeof(orientation) !== 'undefined')
            this.orientation = orientation;
        if (typeof(upDown) !== 'undefined')
            this.upDown = upDown;
        if (typeof(x) !== 'undefined')
            this.xOffset = x;
        if (typeof(y) !== 'undefined')
            this.yOffset = y;
        if (typeof(z) !== 'undefined')
            this.zOffset = z;
    }
}
