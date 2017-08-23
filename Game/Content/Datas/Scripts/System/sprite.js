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
//  CLASS Sprite
//
// -------------------------------------------------------

/** @class
*   A sprite in the map.
*   @property {number} widthPosition (in %) position in the square in the
*   X / Z axis.
*   @property {number} angle Angle in the X / Z axis.
*   @property {number[]} textureRect Texture UV coords.
*/
function Sprite(kind, angle, widthPosition, texture) {
    this.kind = kind;
    this.angle = angle;
    this.widthPosition = widthPosition;
    this.textureRect = texture;
}

/** @static
*   Rotate a vertex around a specified center.
*   @param {THREE.Vector3} vec The vertex to rotate.
*   @param {THREE.Vector3} center The center to rotate around.
*   @param {number} angle The angle in degree.
*/
Sprite.rotateVertex = function(vec, center, angle) {
    vec.sub(center);
    vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle * Math.PI / 180.0);
    vec.add(center);
}

/** @static
*   Rotate the four vertices of a sprite around a specified center.
*   @param {THREE.Vector3} vecA The A vertex to rotate.
*   @param {THREE.Vector3} vecB The B vertex to rotate.
*   @param {THREE.Vector3} vecC The C vertex to rotate.
*   @param {THREE.Vector3} vecD The D vertex to rotate.
*   @param {THREE.Vector3} center The center to rotate around.
*   @param {number} angle The angle in degree.
*/
Sprite.rotateSprite = function(vecA, vecB, vecC, vecD, center, angle) {
    Sprite.rotateVertex(vecA, center, angle);
    Sprite.rotateVertex(vecB, center, angle);
    Sprite.rotateVertex(vecC, center, angle);
    Sprite.rotateVertex(vecD, center, angle);
}

/** @static
*   Rotate the four vertices of a sprite around a specified center.
*   @param {THREE.Vector3} vecA The A vertex to rotate.
*   @param {THREE.Vector3} vecB The B vertex to rotate.
*   @param {THREE.Vector3} vecC The C vertex to rotate.
*   @param {THREE.Vector3} vecD The D vertex to rotate.
*   @param {THREE.Vector3} center The center to rotate around.
*   @param {number} angle The angle in degree.
*   @returns {number} Offset for index buffer.
*/
Sprite.addStaticSpriteToGeometry = function(geometry, vecA, vecB, vecC, vecD,
                                            texFaceA, texFaceB, c)
{
    geometry.vertices.push(vecA);
    geometry.vertices.push(vecB);
    geometry.vertices.push(vecC);
    geometry.vertices.push(vecD);
    geometry.faces.push(new THREE.Face3(c, c + 1, c + 2));
    geometry.faces.push(new THREE.Face3(c, c + 2, c + 3));
    geometry.faceVertexUvs[0].push(texFaceA);
    geometry.faceVertexUvs[0].push(texFaceB);

    return c + 4;
}


Sprite.prototype = {

    /** Read the JSON associated to the sprite.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json) {
        this.kind = json.k;
        this.angle = json.a;
        this.widthPosition = json.p;
        this.textureRect = json.t;
    },

    /** Create the geometry associated to this sprite.
    *   @returns {THREE.Geometry}
    */
    createGeometry: function(width, height) {
        var geometry = new THREE.Geometry();
        var vecA = new THREE.Vector3(-0.5, 1.0, 0.0),
            vecB = new THREE.Vector3(0.5, 1.0, 0.0),
            vecC = new THREE.Vector3(0.5, 0.0, 0.0),
            vecD = new THREE.Vector3(-0.5, 0.0, 0.0),
            center = new THREE.Vector3(0.0, 0.5, 0.0),
            size = new THREE.Vector3(this.textureRect[2] * $SQUARE_SIZE,
                                     this.textureRect[3] * $SQUARE_SIZE, 0);
        var x, y, w, h, c = 0, coefX, coefY;
        var texFaceA, texFaceB;

        // Scale
        vecA.multiply(size);
        vecB.multiply(size);
        vecC.multiply(size);
        vecD.multiply(size);
        center.multiply(size);

        // Getting UV coordinates
        x = (this.textureRect[0] * $SQUARE_SIZE) / width;
        y = (this.textureRect[1] * $SQUARE_SIZE) / height;
        w = (this.textureRect[2] * $SQUARE_SIZE) / width;
        h = (this.textureRect[3] * $SQUARE_SIZE) / height;
        coefX = 0.1 / width;
        coefY = 0.1 / height;
        x += coefX;
        y += coefY;
        w -= (coefX * 2);
        h -= (coefY * 2);

        // Texture UV coordinates for each triangle faces
        texFaceA = [
            new THREE.Vector2(x, y),
            new THREE.Vector2(x + w, y),
            new THREE.Vector2(x + w, y + h)
        ];
        texFaceB = [
            new THREE.Vector2(x,y),
            new THREE.Vector2(x+w,y+h),
            new THREE.Vector2(x,y+h)
        ];
        geometry.faceVertexUvs[0] = [];

        // Simple sprite
        var vecSimpleA = vecA.clone(),
            vecSimpleB = vecB.clone(),
            vecSimpleC = vecC.clone(),
            vecSimpleD = vecD.clone();
        c = Sprite.addStaticSpriteToGeometry(geometry, vecSimpleA, vecSimpleB,
                                             vecSimpleC, vecSimpleD, texFaceA,
                                             texFaceB, c);

        // Double sprite
        if (this.kind === ElementMapKind.SpritesDouble ||
            this.kind === ElementMapKind.SpritesQuadra)
        {
            var vecDoubleA = vecA.clone(),
                vecDoubleB = vecB.clone(),
                vecDoubleC = vecC.clone(),
                vecDoubleD = vecD.clone();
            Sprite.rotateSprite(vecDoubleA, vecDoubleB, vecDoubleC, vecDoubleD,
                                center, 90);

            c = Sprite.addStaticSpriteToGeometry(geometry, vecDoubleA,
                                                 vecDoubleB, vecDoubleC,
                                                 vecDoubleD, texFaceA, texFaceB,
                                                 c);

            // Quadra sprite
            if (this.kind === ElementMapKind.SpritesQuadra) {
                var vecQuadra1A = vecA.clone(),
                    vecQuadra1B = vecB.clone(),
                    vecQuadra1C = vecC.clone(),
                    vecQuadra1D = vecD.clone(),
                    vecQuadra2A = vecA.clone(),
                    vecQuadra2B = vecB.clone(),
                    vecQuadra2C = vecC.clone(),
                    vecQuadra2D = vecD.clone();
                Sprite.rotateSprite(vecQuadra1A, vecQuadra1B, vecQuadra1C,
                                    vecQuadra1D, center, 45);
                Sprite.rotateSprite(vecQuadra2A, vecQuadra2B, vecQuadra2C,
                                    vecQuadra2D, center, -45);
                c = Sprite.addStaticSpriteToGeometry(geometry, vecQuadra1A,
                                                     vecQuadra1B, vecQuadra1C,
                                                     vecQuadra1D, texFaceA,
                                                     texFaceB, c);
                c = Sprite.addStaticSpriteToGeometry(geometry, vecQuadra2A,
                                                     vecQuadra2B, vecQuadra2C,
                                                     vecQuadra2D, texFaceA,
                                                     texFaceB, c);
            }
        }

        geometry.uvsNeedUpdate = true;

        return geometry;
    }
}
