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
*   @property {THREE.Mesh} staticFloorsList List of all the floors in the scene.
*   @property {THREE.Mesh} staticSpritesList List of all the sprites in the
*   scene.
*   @property {MapObject} objectsList List of all the objects in the portion.
*   @param {number} realX The real x portion.
*   @param {number} realY The real y portion.
*   @param {number} realZ The real z portion.
*   @param {number} [spritesOffset=-0.005] In order to avoid flickerings on
*   sprites with the same X / Z, we use an offset.
*/
function MapPortion(realX, realY, realZ){
    var pixPortion = $PORTION_SIZE * $SQUARE_SIZE;
    this.positionOrigin = new THREE.Vector3(realX * pixPortion,
                                            realY * pixPortion,
                                            realZ * pixPortion);
    this.staticFloorsList = new Array;
    this.staticSpritesList = new Array;
    this.objectsList = new Array;
    this.spritesOffset = -0.005;
}

/** @static
*   In order to avoid flickerings, we need to add this coef to floors scale.
*   @default 0.1
*   @constant
*/
MapPortion.SCALE_COEF = 0.1;

/** @static
*   In order to avoid flickerings on sprites with the same X / Z, we use an
*   offset. This coef is the number to increment for the offset for each
*   sprites.
*   @default 0.0005
*   @constant
*/
MapPortion.SPRITES_OFFSET_COEF = 0.0005;

MapPortion.prototype = {

    /** Read the JSON associated to the map portion.
    *   @param {Object} json Json object describing the object.
    *   @param {boolean} isMapHero Indicates if this map is where the hero is
    *   at the beginning of the game.
    */
    read: function(json, isMapHero){
        this.readFloors(json.floors);
        this.readSprites(json.sprites);
        this.readObjects(json.objs, isMapHero);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the floors in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readFloors: function(json){

        // Static floors
        var jsonFloors = json.floors;

        var material = $gameStack.top().textureTileset;
        var width = material.map.image.width;
        var height = material.map.image.height;

        for (var i = 0, l = jsonFloors.length; i < l; i++){
            var jsonFloor = jsonFloors[i];
            var localPosition = Wanok.positionToVector3(jsonFloor.k);
            var jsonFloorDatas = jsonFloor.v;
            var texture = jsonFloorDatas.t;

            // Getting geometry and UVs coords
            var x = (texture[0] * $SQUARE_SIZE) / width;
            var y = (texture[1] * $SQUARE_SIZE) / height;
            var w = (texture[2] * $SQUARE_SIZE) / width;
            var h = (texture[3] * $SQUARE_SIZE) / height;

            var geometry = new THREE.Geometry();
            geometry.dynamic = false;
            geometry.vertices.push(new THREE.Vector3(0.0, 0.0, 0.0));
            geometry.vertices.push(new THREE.Vector3(1.0, 0.0, 0.0));
            geometry.vertices.push(new THREE.Vector3(1.0, 0.0, 1.0));
            geometry.vertices.push(new THREE.Vector3(0.0, 0.0, 1.0));
            geometry.faces.push(new THREE.Face3(0, 1, 2));
            geometry.faces.push(new THREE.Face3(0, 2, 3));
            geometry.scale($SQUARE_SIZE + MapPortion.SCALE_COEF,
                           1.0,
                           $SQUARE_SIZE + MapPortion.SCALE_COEF);
            geometry.faceVertexUvs[0] = [];
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
            geometry.uvsNeedUpdate = true;

            // Creating the plane
            var plane = new THREE.Mesh(geometry, material);
            plane.position.set(this.positionOrigin.x + localPosition.x,
                               this.positionOrigin.y + localPosition.y,
                               this.positionOrigin.z + localPosition.z);
            $gameStack.top().scene.add(plane);
            this.staticFloorsList.push(plane);
        }
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the sprites in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readSprites: function(json){
        this.readSpritesStatics(json.statics);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the static sprites in the portion.
    *   @param {Object} json Json object describing the object.
    */
    readSpritesStatics: function(json){
        for (var i = 0, l = json.length; i < l; i++){
            var s = json[i];
            var position = s.k;
            var ss = s.v;

            var material = $gameStack.top().textureTileset;
            var width = material.map.image.width;
            var height = material.map.image.height;

            for (var j = 0, ll = ss.length; j < ll; j++){
                var sprite = new Sprite();
                sprite.read(ss[j]);
                var texture = sprite.textureRect;
                var x = (texture[0] * $SQUARE_SIZE) / width;
                var y = (texture[1] * $SQUARE_SIZE) / height;
                var w = (texture[2] * $SQUARE_SIZE) / width;
                var h = (texture[3] * $SQUARE_SIZE) / height;

                var plane = this.getSpriteMesh(position, material, texture,
                                               x, y, w, h);
                $gameStack.top().scene.add(plane);
                this.staticSpritesList.push(plane);
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
        this.readObjectsSprites(json.sprites, isMapHero);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the sprites objects in the portion.
    *   @param {Object} json Json object describing the object.
    *   @param {boolean} isMapHero Indicates if this map is where the hero is
    *   at the beginning of the game.
    */
    readObjectsSprites: function(json, isMapHero){
        for (var i = 0, l = json.length; i < l; i++){
            var jsonTextures = json[i];
            var texture = jsonTextures.k;
            var jsonObjects = jsonTextures.v;
            for (var j = 0, ll = jsonObjects.length; j < ll; j++){
                var jsonObject = jsonObjects[j];
                var position = jsonObject.k;
                var jsonObjectValue = jsonObject.v;
                var object = new SystemObject;
                object.readJSON(jsonObjectValue);

                // Get mesh
                var x = 0.0;
                var y = 0.0;
                var w = 32.0 / 128.0;
                var h = 32.0 / 128.0;
                var mesh = this.getSpriteMesh(position,
                                              $gameStack.top()
                                              .texturesCharacters[1],
                                              [0, 0, 2, 2],
                                              x, y, w, h);
                var mapObject = new MapObject(mesh, object);

                /* If it is the hero, you should not add it to the list of
                objects to display */
                if (!isMapHero ||
                    $datasGame.system.idObjectStartHero !== object.id)
                {
                    $gameStack.top().scene.add(mesh);
                    this.objectsList.push(mapObject);
                }
            }
        }
    },

    // -------------------------------------------------------

    /** Get the THREE mesh for a sprite.
    *   @param {number[]} position The position of the mesh.
    *   @param {Three.material} material The material used for this mesh.
    *   @param {number[]} texture The texture coords of the sprite.
    *   @param {number} x The x UV texture position.
    *   @param {number} y The y UV texture position.
    *   @param {number} w The w UV texture position.
    *   @param {number} h The h UV texture position.
    */
    getSpriteMesh: function(position, material, texture, x, y, w, h){
        var localPosition = Wanok.positionToVector3(position);
        localPosition.setX(localPosition.x + ($SQUARE_SIZE / 2)
                           + this.spritesOffset);
        localPosition.setZ(localPosition.z + (50 * $SQUARE_SIZE / 100)
                           + this.spritesOffset);
        this.spritesOffset += MapPortion.SPRITES_OFFSET_COEF;

        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-0.5, 1.0, 0.0));
        geometry.vertices.push(new THREE.Vector3(0.5, 1.0, 0.0));
        geometry.vertices.push(new THREE.Vector3(0.5, 0.0, 0.0));
        geometry.vertices.push(new THREE.Vector3(-0.5, 0.0, 0.0));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(0, 2, 3));
        geometry.scale(texture[2] * $SQUARE_SIZE, texture[3] * $SQUARE_SIZE,
                       1.0);
        geometry.faceVertexUvs[0] = [];
        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(x,y),
            new THREE.Vector2(x+w,y),
            new THREE.Vector2(x+w,y+h)
        ]);
        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(x,y),
            new THREE.Vector2(x+w,y+h),
            new THREE.Vector2(x,y+h)
        ]);
        geometry.uvsNeedUpdate = true;

        var plane = new THREE.Mesh(geometry, material);
        plane.position.set(this.positionOrigin.x + localPosition.x,
                           this.positionOrigin.y + localPosition.y,
                           this.positionOrigin.z + localPosition.z);

        return plane;
    },

    // -------------------------------------------------------

    /** Remove all the objects from the scene.
    */
    cleanAll: function(){
        var i, l;
        // TODO
        for (i = 0, l = this.staticFloorsList.length; i < l; i++){

        }

        for (i = 0, l = this.staticSpritesList.length; i < l; i++){

        }

        for (i = 0, l = this.objectsList.length; i < l; i++){

        }
    },

    // -------------------------------------------------------

    /** Search for the object with the ID.
    *   @param {number} id The ID of the object.
    *   @returns {MapObject}
    */
    getObjFromID: function(id){
        if (this.objectHero !== null && this.objectHero.id === id)
            return this.objectHero;

        for (var i = 0, l = this.objectsList.length; i < l; i++){
            var object = this.objectsList[i];
            if (object.system.id === id)
                return object;
        }

        return null;
    },

    // -------------------------------------------------------

    /** Get hero model.
    *   @param {Object} json Json object describing the object.
    *   @returns {MapObject}
    */
    getHeroModel: function(json){
        json = json.objs.sprites;
        for (var i = 0, l = json.length; i < l; i++){
            var jsonTextures = json[i];
            var texture = jsonTextures.k;
            var jsonObjects = jsonTextures.v;
            for (var j = 0, ll = jsonObjects.length; j < ll; j++){
                var jsonObject = jsonObjects[j];
                var position = jsonObject.k;
                var jsonObjectValue = jsonObject.v;

                if ($datasGame.system.idObjectStartHero === jsonObjectValue.id){
                    var object = new SystemObject;
                    object.readJSON(jsonObjectValue);

                    // Get mesh
                    var x = 0.0;
                    var y = 0.0;
                    var w = 32.0 / 128.0;
                    var h = 32.0 / 128.0;
                    var mesh =
                            this.getSpriteMesh(position,
                                               new THREE.MeshBasicMaterial({}),
                                               [0, 0, 2, 2],
                                               x, y, w, h);
                    var mapObject = new MapObject(mesh, object);
                    return mapObject;
                }
            }
        }

        return null;
    }
}
