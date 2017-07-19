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
*   Enum for the different map elements kind.
*   @enum {number}
*   @readonly
*/
var ElementMapKind = {
    None: 0,
    Floors: 1,
    Autotiles: 2,
    Water: 3,
    SpritesFace: 4,
    SpritesFix: 5,
    SpritesDouble: 6,
    SpritesQuadra: 7,
    SpritesWall: 8,
    Object: 9
};
Object.freeze(ElementMapKind);

// -------------------------------------------------------
//
//  CLASS SystemState
//
// -------------------------------------------------------

/** @class
*   A possible state of an object.
*   @property {number} id ID.
*   @property {number} graphicID ID of the graphic texture.
*   @property {MapEditorSubSelectionKind} graphicKind The kind of graphic.
*   @property {number} indexX
*   @property {number} indexY
*   @property {boolean} moveAnimation Indicate if the abject is animated when
*   moving.
*   @property {boolean} stopAnimation Indicate if the abject is animated when
*   not moving.
*   @property {boolean} climbAnimation Indicate if the abject is animated when
*   climbing.
*   @property {boolean} directionFix Indicate if the abject is looking the
*   object sending reaction to him.
*   @property {boolean} through Indicate if the abject can be passed through.
*   @property {boolean} setWithAnimation Indicate if the abject orientation is
*   updated according to the camera.
*   @property {boolean} pixelOffset Indicate if there is a pixel offset for
*   impair frames when moving.
*   @property {boolean} keepPosition Indicate if the object should keep the
*   position after moving (after changing map / save).
*/
function SystemObjectState(){

}

SystemObjectState.prototype = {

    /** Read the JSON associated to the object state.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.id = json.id;
        this.graphicID = json.gid;
        this.graphicKind = json.gk;
        this.indexX = json.x;
        this.indexY = json.y;
        this.moveAnimation = json.move;
        this.stopAnimation = json.stop;
        this.climbAnimation = json.climb;
        this.directionFix = json.dir;
        this.through = json.through;
        this.setWithCamera = json.cam;
        this.pixelOffset = json.pix;
        this.keepPosition = json.pos;
    }
}
