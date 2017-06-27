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
//  CLASS SystemState
//
// -------------------------------------------------------

/** @class
*   A possible state of an object.
*   @property {number} id ID.
*   @property {boolean} moveAnimation Indicate if the abject is animated when
*   moving.
*   @property {boolean} stopAnimation Indicate if the abject is animated when
*   not moving.
*   @property {boolean} directionFix Indicate if the abject is looking the
*   object sending reaction to him.
*   @property {boolean} through Indicate if the abject can be passed through.
*   @property {boolean} setWithAnimation Indicate if the abject orientation is
*   updated according to the camera.
*   @property {boolean} pixelOffset Indicate if there is a pixel offset for
*   impair frames when moving.
*/
function SystemObjectState(){

}

SystemObjectState.prototype = {

    /** Read the JSON associated to the object state.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.id = json.id;
        this.moveAnimation = json.move;
        this.stopAnimation = json.stop;
        this.directionFix = json.dir;
        this.through = json.through;
        this.setWithCamera = json.cam;
        this.pixelOffset = json.pix;
    }
}
