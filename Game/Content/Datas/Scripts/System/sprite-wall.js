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
*   Enum for the different sprite walls kind.
*   @enum {number}
*   @readonly
*/
var SpriteWallKind = {
    Left: 0,
    Middle: 1,
    Right: 2,
    LeftRight: 3
};
Object.freeze(SpriteWallKind);

// -------------------------------------------------------
//
//  CLASS SpriteWall
//
// -------------------------------------------------------

/** @class
*   A sprite in the map.
*   @property {number} id The picture ID of the sprite.
*   @property {SpriteWallKind} kind The kind of wall (border or not).
*/
function SpriteWall() {

}

SpriteWall.prototype = {

    /** Read the JSON associated to the sprite wall.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json) {
        this.id = json.w;
        this.kind = json.k;
    }
}
