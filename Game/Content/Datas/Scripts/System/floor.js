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
//  CLASS Floor
//
// -------------------------------------------------------

/** @class
*   A floor in the map.
*   @property {number[]} texture Texture rect of the floor.
*/
function Floor() {
    MapElement.call(this);

    this.up = true;
}

Floor.prototype = {

    /** Read the JSON associated to the floor.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json) {
        MapElement.prototype.read.call(this, json);

        var up = json.up;
        this.texture = json.t;

        if (typeof(up) !== 'undefined')
            this.up = up;
    },

    /** Update the geometry associated to this floor.
    *   @returns {THREE.Geometry}
    */
    updateGeometry: function(geometry, position, width, height, i) {
        var localPosition = RPM.positionToBorderVector3(position);
        var x = localPosition.x;
        var yLayerOffset = RPM.positionLayer(position) * 0.05;
        if (!this.up)
            yLayerOffset *= -1;
        var y = localPosition.y + yLayerOffset;
        var z = localPosition.z;
        var l = $SQUARE_SIZE;
        var w = 1.0;
        var h = $SQUARE_SIZE;

        geometry.vertices.push(new THREE.Vector3(x, y, z));
        geometry.vertices.push(new THREE.Vector3(x + l, y, z));
        geometry.vertices.push(new THREE.Vector3(x + l, y, z + h));
        geometry.vertices.push(new THREE.Vector3(x, y, z + h));
        var j = i * 4;
        geometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
        geometry.faces.push(new THREE.Face3(j, j + 2, j + 3));

        x = (this.texture[0] * $SQUARE_SIZE) / width;
        y = (this.texture[1] * $SQUARE_SIZE) / height;
        w = (this.texture[2] * $SQUARE_SIZE) / width;
        h = (this.texture[3] * $SQUARE_SIZE) / height;
        var coefX = 0.1 / width;
        var coefY = 0.1 / height;
        x += coefX;
        y += coefY;
        w -= (coefX * 2);
        h -= (coefY * 2);
        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(x, y),
            new THREE.Vector2(x + w, y),
            new THREE.Vector2(x + w, y + h)
        ]);
        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(x, y),
            new THREE.Vector2(x + w, y + h),
            new THREE.Vector2(x, y + h)
        ]);
    }
}
