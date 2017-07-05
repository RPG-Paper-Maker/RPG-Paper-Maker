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
function MapObject(system, position) {
    this.system = system;
    this.position = position;
    this.mesh = null;
    this.speed = 1.0;
    this.frame = 0;
    this.orientationEye = Orientation.South;
    this.width = 1;
    this.height = 1;
    this.frameDuration = 150;
    this.moving = false;
    this.frameTick = 0;
    this.isHero = false;
}

/** Normal speed coef.
*   @constant
*   @static
*   @default 0.004666
*/
MapObject.SPEED_NORMAL = 0.004666;

MapObject.getSpriteGeometry = function(width, height, x, y, w, h){
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-0.5, 1.0, 0.0));
    geometry.vertices.push(new THREE.Vector3(0.5, 1.0, 0.0));
    geometry.vertices.push(new THREE.Vector3(0.5, 0.0, 0.0));
    geometry.vertices.push(new THREE.Vector3(-0.5, 0.0, 0.0));
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(0, 2, 3));
    geometry.scale(width * $SQUARE_SIZE, height * $SQUARE_SIZE, 1.0);
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

    return geometry;
}

/** Update the object with a particular ID.
*   @static
*   @param {MapObject} object This object.
*   @param {number} objectID The object ID searched.
*   @param {Object} base The base module for the callback.
*   @param {function} callback The function to call after having found the
*   object.
*/
MapObject.updateObjectWithID = function(object, objectID, base, callback){
    switch (objectID){

    case -1: // This object
        callback.call(base, object);
        break;

    case 0: // Hero
        callback.call(base, $game.hero);
        break;

    default: // Particular object
        var globalPortion = $currentMap.allObjects[objectID];
        var localPortion = $currentMap.getLocalPortion(globalPortion);
        var i, l, moved, mapsDatas, movedObjects, mapPortion, objects;

        // First search in the moved objects
        mapsDatas = $game.mapsDatas[$currentMap.id]
                         [globalPortion[0]][globalPortion[1]][globalPortion[2]];
        movedObjects = mapsDatas.m;
        moved = null;
        for (i = 0, l = movedObjects.length; i < l; i++){
            if (movedObjects[i].system.id === objectID){
                moved = movedObjects[i];
                break;
            }
        }
        if (moved !== null){
            callback.call(base, moved);
            break;
        }

        // If not moving, search directly in portion
        if ($currentMap.isInPortionRay(localPortion)){
            mapPortion = $currentMap.mapPortions[localPortion[0]]
                                                [localPortion[1]]
                                                [localPortion[2]];
            objects = mapPortion.objectsList;
            for (i = 0, l = objects.length; i < l; i++){
                if (objects[i].system.id === objectID){
                    moved = objects[i];
                    break;
                }
            }

            callback.call(base, moved);
        }
        // Load the file if not already in temp
        else{
            var fileName = SceneMap.getPortionName(realX, realY, realZ);
            Wanok.openFile(this, Wanok.FILE_MAPS + this.mapName + "/" +
                           fileName, false, function(res)
            {
                var json = JSON.parse(res);
                mapPortion = new MapPortion(globalPortion[0],
                                            globalPortion[1],
                                            globalPortion[2]);
                moved = mapPortion.getObjFromID(json.objs.sprites, objectID);
                callback.call(base, moved);
            });
        }
        break;
    }
}

MapObject.prototype = {

    /** Update the current state (graphics to display). Also update the mesh.
    */
    changeState: function(){

        // Remove previous mesh
        if (this.mesh !== null)
            $currentMap.scene.remove(this.mesh);

        // Updating the current state
        var states;
        if (this.isHero)
            states = $game.heroStates;
        else{
            var portion = $currentMap.allObjects[this.system.id];
            var portionDatas = $game.mapsDatas[$currentMap.id]
                    [portion[0]][portion[1]][portion[2]];
            var indexState = portionDatas.si.indexOf(this.system.id);
            states = (indexState === -1) ? [1] : portionDatas.s[indexState];
        }
        this.currentState = null;
        for (var i = this.system.states.length - 1; i >= 0; i--){
            var state = this.system.states[i];
            if (states.indexOf(state.id) !== -1){
                this.currentState = state;
                break;
            }
        }

        // Update mesh
        var material =
                $currentMap.texturesCharacters[this.currentState.graphicID];
        if (this.currentState !== null &&
            this.currentState.graphicKind !== MapEditorSubSelectionKind.None &&
            typeof material.map !== 'undefined')
        {
            this.frame = this.currentState.indexX;
            this.orientationEye = this.currentState.indexY;
            this.width = material.map.image.width / $SQUARE_SIZE / $FRAMES;
            this.height = material.map.image.height / $SQUARE_SIZE / $FRAMES;
            var geometry = MapObject.getSpriteGeometry(this.width, this.height);
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.set(this.position.x,
                                   this.position.y,
                                   this.position.z);
            this.updateUVs();
        }
        else
            this.mesh = null;

        // Add to the scene
        $currentMap.scene.add(this.mesh);
    },

    /** Read the JSON associated to the object.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json){
        var jsonPosition = json.k;
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
        var objects, movedObjects, index;

        // Remove from move
        this.removeMoveTemp();

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
        this.addMoveTemp();


        return distance;
    },

    // -------------------------------------------------------

    /** Teleport the object.
    *   @param {THREE.Vector3} position Position to teleport.
    */
    teleport: function(position){

        // Remove from move
        this.removeMoveTemp();

        // Set position
        this.position.set(position.x, position.y, position.z);
        this.moving = true;

        // Add to moving objects
        this.addMoveTemp();
    },

    // -------------------------------------------------------

    removeMoveTemp: function(){
        var objects, previousPortion, movedObjects, index;

        if (!this.isHero){
            previousPortion = Wanok.getPortion(this.position);
            objects = $game.mapsDatas[$currentMap.id]
                   [previousPortion[0]][previousPortion[1]][previousPortion[2]];

            // Remove from the moved objects in or out of the portion
            movedObjects = objects.mout;
            index = movedObjects.indexOf(this);
            if (index !== -1)
                movedObjects.splice(index, 1);
            movedObjects = objects.min;
            index = movedObjects.indexOf(this);
            if (index !== -1)
                movedObjects.splice(index, 1);

            // Add to moved objects of the original portion if not done yet
            movedObjects = objects.m;
            if (movedObjects.indexOf(this) === -1)
                movedObjects.unshift(this);
        }
    },

    // -------------------------------------------------------

    addMoveTemp: function(){
        var objects, afterPortion, originalPortion;

        if (!this.isHero){
            afterPortion = Wanok.getPortion(this.position);
            objects = $game.mapsDatas[$currentMap.id]
                    [afterPortion[0]][afterPortion[1]][afterPortion[2]];
            originalPortion = $currentMap.allObjects[this.system.id];

            if (originalPortion[0] !== afterPortion[0] ||
                originalPortion[1] !== afterPortion[1] ||
                originalPortion[2] !== afterPortion[2])
            {
                objects.mout.unshift(this);
            }
            else
                objects.min.unshift(this);
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

    /** Update the object graphics.
    */
    update: function(){
        if (this.mesh !== null){
            var frame = this.frame;

            if (this.moving){

                // If moving, update frame
                if (this.currentState.moveAnimation){
                    this.frameTick += $elapsedTime;
                    if (this.frameTick >= this.frameDuration){
                        this.frame = (this.frame + 1) % $FRAMES;
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
        }
    },

    // -------------------------------------------------------

    /** Update the UVs coordinates according to frame and orientation.
    */
    updateUVs: function(){
        if (this.mesh !== null &&
            this.currentState.graphicKind !== MapEditorSubSelectionKind.None)
        {
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
    },

    // -------------------------------------------------------

    /** Update the material.
    */
    updateMaterial: function(){
        if (this.currentState.graphicKind !== MapEditorSubSelectionKind.None){
            this.mesh.material =
                 $currentMap.texturesCharacters[this.currentState.graphicID];
        }
        else{
            this.mesh = null;
        }
    }
}
