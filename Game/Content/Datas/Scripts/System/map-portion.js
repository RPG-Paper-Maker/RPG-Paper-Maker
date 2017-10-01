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
//  [CLASS MapPortion]
//
//  A portion of the map.
//
//  @positionOrigin          -> The position of the origin of the portion.
//  @staticFloorsList        -> List of all the sprites in the scene.
//  @staticSpritesList       -> List of all the sprites in the scene.
//  @objectsList             -> List of all the objects in the portion.
//
// -------------------------------------------------------

/** @class
*   A portion of the map.
*   @property {THREE.Vector3} positionOrigin The position of the origin of the
*   portion.
*   @property {THREE.Mesh} staticFloorsMesh The mesh used for drawing all the
*   floors.
*   @property {THREE.Mesh[]} staticSpritesList List of all the static sprites in
*   the scene.
*   @property {MapObject[]} objectsList List of all the objects in the portion.
*   @property {THREE.Mesh[]} faceSpritesList List of all the face sprites in the
*   scene.
*   @param {number} realX The real x portion.
*   @param {number} realY The real y portion.
*   @param {number} realZ The real z portion.
*   @param {number} [spritesOffset=-0.005] In order to avoid flickerings on
*   sprites with the same X / Z, we use an offset.
*/
function MapPortion(realX, realY, realZ){
    this.realX = realX;
    this.realY = realY;
    this.realZ = realZ;
    this.staticFloorsMesh = null;
    this.staticSpritesList = new Array;
    this.objectsList = new Array;
    this.faceSpritesList = new Array;
    this.spritesOffset = -0.005;
}

/** @static
*   In order to avoid flickerings on sprites with the same X / Z, we use an
*   offset. This coef is the number to increment for the offset for each
*   sprites.
*   @default 0.0005
*   @constant
*/
MapPortion.SPRITES_OFFSET_COEF = 0.0015;

MapPortion.prototype = {

    /** Read the JSON associated to the map portion.
    *   @param {Object} json Json object describing the object.
    *   @param {boolean} isMapHero Indicates if this map is where the hero is
    *   at the beginning of the game.
    */
    read: function(json, isMapHero){
        this.readFloors(json.floors);
        this.readSprites(json.sprites);
        this.readObjects(json.objs.list, isMapHero);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the floors in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readFloors: function(json){

        // Static floors
        var jsonFloors = json.floors;

        var material = $currentMap.textureTileset;
        var width = material.map.image.width;
        var height = material.map.image.height;
        var geometry = new THREE.Geometry();
        geometry.faceVertexUvs[0] = [];

        for (var i = 0, length = jsonFloors.length; i < length; i++){
            var jsonFloor = jsonFloors[i];
            var localPosition = Wanok.positionToVector3(jsonFloor.k);
            var jsonFloorDatas = jsonFloor.v;
            var texture = jsonFloorDatas.t;

            var x = localPosition.x;
            var y = localPosition.y;
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

            x = (texture[0] * $SQUARE_SIZE) / width;
            y = (texture[1] * $SQUARE_SIZE) / height;
            w = (texture[2] * $SQUARE_SIZE) / width;
            h = (texture[3] * $SQUARE_SIZE) / height;
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

        geometry.uvsNeedUpdate = true;

        // Creating the plane
        this.staticFloorsMesh = new THREE.Mesh(geometry, material);
        $currentMap.scene.add(this.staticFloorsMesh);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the sprites in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readSprites: function(json){
        this.readSpritesGlobals(json.list);
        this.readSpritesWalls(json.walls);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the sprites in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readSpritesGlobals: function(json){
        var material = $currentMap.textureTileset;

        for (var i = 0, l = json.length; i < l; i++){
            var s = json[i];
            var position = s.k;
            var ss = s.v;
            var sprite = new Sprite();
            sprite.read(ss);
            var plane = this.getSpriteMesh(position, material, sprite);
            if (sprite.kind === ElementMapKind.SpritesFace)
                this.faceSpritesList.push(plane);
            else
                this.staticSpritesList.push(plane);

            $gameStack.top().scene.add(plane);
        }
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the sprites in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readSpritesWalls: function(json) {
        var i, l, wallsIds, c;
        var hash, geometry, material, obj, mesh;
        wallsIds = $currentMap.texturesWalls.length;
        hash = new Array(wallsIds);
        for (i = 0; i < wallsIds; i++)
            hash[i] = null;

        for (i = 0, l = json.length; i < l; i++) {

            // Getting sprite
            var s = json[i];
            var gridPosition = s.k;
            var ss = s.v;
            var sprite = new SpriteWall();
            sprite.read(ss);

            // Constructing the geometry

            obj = hash[sprite.id];
            if (obj === null) {
                obj = {};
                geometry = new THREE.Geometry();
                geometry.faceVertexUvs[0] = [];
                material = $currentMap.texturesWalls[sprite.id];
                c = 0;
                obj.geometry = geometry;
                obj.material = material;
                obj.c = c;
                hash[sprite.id] = obj;
            }
            else {
                geometry = obj.geometry;
                material = obj.material;
                c = obj.c;
            }

            obj.c = sprite.updateGeometry(geometry, gridPosition,
                                          material.map.image.width,
                                          material.map.image.height, c);
        }

        for (i = 0; i < wallsIds; i++) {
            obj = hash[i];
            if (obj !== null) {
                geometry = obj.geometry;
                geometry.uvsNeedUpdate = true;
                mesh = new THREE.Mesh(geometry, obj.material);
                this.staticSpritesList.push(mesh);
                $gameStack.top().scene.add(mesh);
            }
        }
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the objects in the portion.
    *   @param {Object} json Json object describing the object.
    *   @param {boolean} isMapHero Indicates if this map is where the hero is
    *   at the beginning of the game.
    */
    readObjects: function(json, isMapHero){
        var datas, objects, index, i, l, j, ll;
        datas = $game.mapsDatas
                [$currentMap.id][this.realX][this.realY][this.realZ];
        objects = datas.m;
        ll = objects.length;

        for (i = 0, l = json.length; i < l; i++){
            var jsonObject = json[i];
            var position = jsonObject.k;
            var jsonObjectValue = jsonObject.v;
            var object = new SystemObject;
            object.readJSON(jsonObjectValue);

            // Check if the object is moving (so no need to add it to the scene)
            index = -1;
            for (j = 0; j < ll; j++) {
                if (objects[j].system.id === object.id) {
                    index = j;
                    break;
                }
            }

            /* If it is the hero, you should not add it to the list of
            objects to display */
            if ((!isMapHero ||
                $datasGame.system.idObjectStartHero !== object.id) &&
                index === -1)
            {
                var localPosition = Wanok.positionToVector3(position);
                localPosition.setX(localPosition.x + ($SQUARE_SIZE / 2)
                                   + this.spritesOffset);
                localPosition.setZ(localPosition.z + (50 * $SQUARE_SIZE /
                                                      100)
                                   + this.spritesOffset);
                this.spritesOffset += MapPortion.SPRITES_OFFSET_COEF;
                position = new THREE.Vector3(localPosition.x,
                                             localPosition.y,
                                             localPosition.z);
                var mapObject = new MapObject(object, position);
                mapObject.changeState();
                this.objectsList.unshift(mapObject);
            }
        }

        // Add moved objects to the scene
        objects = datas.min;
        for (i = 0, l = objects.length; i < l; i++)
            objects[i].addToScene();
        objects = datas.mout;
        for (i = 0, l = objects.length; i < l; i++)
            objects[i].addToScene();
    },

    // -------------------------------------------------------

    /** Get the THREE mesh for a sprite.
    *   @param {number[]} position The position of the mesh.
    *   @param {Three.material} material The material used for this mesh.
    *   @param {Sprite} sprite The sprite.
    */
    getSpriteMesh: function(position, material, sprite){
        var localPosition = Wanok.positionToVector3(position);
        localPosition.setX(localPosition.x + ($SQUARE_SIZE / 2)
                           + this.spritesOffset);
        localPosition.setZ(localPosition.z + (50 * $SQUARE_SIZE / 100)
                           + this.spritesOffset);
        this.spritesOffset += MapPortion.SPRITES_OFFSET_COEF;

        var geometry = sprite.createGeometry(material.map.image.width,
                                             material.map.image.height);
        var plane = new THREE.Mesh(geometry, material);
        plane.position.set(localPosition.x,
                           localPosition.y,
                           localPosition.z);

        return plane;
    },

    // -------------------------------------------------------

    /** Remove all the objects from the scene.
    */
    cleanAll: function(){
        var i, l, datas, objects, object, index;
        datas = $game.mapsDatas
                [$currentMap.id][this.realX][this.realY][this.realZ];

        // Static stuff
        $currentMap.scene.remove(this.staticFloorsMesh);
        for (i = 0, l = this.staticSpritesList.length; i < l; i++)
            $currentMap.scene.remove(this.staticSpritesList[i]);
        for (i = 0, l = this.faceSpritesList.length; i < l; i++)
            $currentMap.scene.remove(this.faceSpritesList[i]);

        // Objects
        for (i = 0, l = this.objectsList.length; i < l; i++)
            $currentMap.scene.remove(this.objectsList[i].mesh);

        // Remove moved objects from the scene
        objects = datas.min;
        for (i = 0, l = objects.length; i < l; i++)
            objects[i].removeFromScene();
        objects = datas.mout;
        for (i = 0, l = objects.length; i < l; i++)
            objects[i].removeFromScene();
    },

    // -------------------------------------------------------

    /** Search for the object with the ID.
    *   @param {number} id The ID of the object.
    *   @returns {MapObject}
    */
    getObjFromID: function(json, id){
        for (var i = 0, l = json.length; i < l; i++){
            var jsonTextures = json[i];
            var texture = jsonTextures.k;
            var jsonObjects = jsonTextures.v;
            for (var j = 0, ll = jsonObjects.length; j < ll; j++){
                var jsonObject = jsonObjects[j];
                var position = jsonObject.k;
                var jsonObjectValue = jsonObject.v;
                var object = new SystemObject;
                if (jsonObjectValue.id === id){
                    object.readJSON(jsonObjectValue);
                    var localPosition = Wanok.positionToVector3(position);
                    localPosition.setX(localPosition.x + ($SQUARE_SIZE / 2)
                                       + this.spritesOffset);
                    localPosition.setZ(localPosition.z + (50 * $SQUARE_SIZE /
                                                          100)
                                       + this.spritesOffset);
                    this.spritesOffset += MapPortion.SPRITES_OFFSET_COEF;
                    position = new THREE.Vector3(localPosition.x,
                                                 localPosition.y,
                                                 localPosition.z);
                    var mapObject = new MapObject(object, position);
                    mapObject.changeState();

                    return mapObject;
                }
            }
        }

        return null;
    },

    // -------------------------------------------------------

    /** Get hero model.
    *   @param {Object} json Json object describing the object.
    *   @returns {MapObject}
    */
    getHeroModel: function(json){
        json = json.objs.list;
        for (var i = 0, l = json.length; i < l; i++){
            var jsonObject = json[i];
            var position = jsonObject.k;
            var jsonObjectValue = jsonObject.v;

            if ($datasGame.system.idObjectStartHero === jsonObjectValue.id){
                var object = new SystemObject;
                object.readJSON(jsonObjectValue);
                var localPosition = Wanok.positionToVector3(position);
                localPosition.setX(localPosition.x + ($SQUARE_SIZE / 2)
                                   + this.spritesOffset);
                localPosition.setZ(localPosition.z + (50 * $SQUARE_SIZE
                                                      / 100)
                                   + this.spritesOffset);
                this.spritesOffset += MapPortion.SPRITES_OFFSET_COEF;
                position = new THREE.Vector3(localPosition.x,
                                             localPosition.y,
                                             localPosition.z);
                return new MapObject(object, position);
            }
        }

        return null;
    },

    // -------------------------------------------------------

    /** Update the face sprites orientation.
    *   @param {number} angle The angle on the Y axis.
    */
    updateFaceSprites: function(angle){
        var i, l;

        for (i = 0, l = this.faceSpritesList.length; i < l; i++)
            this.faceSpritesList[i].rotation.y = angle;

        for (i = 0, l = this.objectsList.length; i < l; i++)
            this.objectsList[i].update(angle);
    }
}
