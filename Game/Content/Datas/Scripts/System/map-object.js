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
    East: 3,
    None: 4
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
    this.orientation = this.orientationEye;
    this.width = 1;
    this.height = 1;
    this.frameDuration = 150;
    this.moving = 0;
    this.frameTick = 0;
    this.isHero = false;
    this.isInScene = false;
}

/** Normal speed coef.
*   @constant
*   @static
*   @default 0.004666
*/
MapObject.SPEED_NORMAL = 0.004666;

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
        var globalPortion = SceneMap.getGlobalPortion(
                    $currentMap.allObjects[objectID]);
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
        this.removeFromScene();

        // Updating the current state
        var states;
        if (this.isHero)
            states = $game.heroStates;
        else {
            var portion = SceneMap.getGlobalPortion(
                        $currentMap.allObjects[this.system.id]);
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
            this.currentState.graphicKind !== ElementMapKind.None &&
            typeof material.map !== 'undefined')
        {
            this.frame = this.currentState.indexX;
            this.orientationEye = this.currentState.indexY;
            this.orientationEye = Wanok.mod(this.orientationEye +
                                $currentMap.camera.getMapOrientation() - 2, 4);
            this.updateOrientation();
            this.width = material.map.image.width / $SQUARE_SIZE / $FRAMES;
            this.height = material.map.image.height / $SQUARE_SIZE / $FRAMES;
            var sprite = new Sprite(this.currentState.graphicKind,
                                    [0, 0, this.width, this.height]);
            var geometry = sprite.createGeometry(this.width, this.height,
                                                 this.position);
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.set(this.position.x,
                                   this.position.y,
                                   this.position.z);
            this.updateUVs();
        }
        else
            this.mesh = null;

        // Add to the scene
        this.addToScene();
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
    move: function(orientation, limit, angle, isCameraOrientation){
        var objects, movedObjects, index;

        // Remove from move
        this.removeMoveTemp();

        // Set position
        var distance = Math.min(limit, this.speed * MapObject.SPEED_NORMAL *
                                $averageElapsedTime * $SQUARE_SIZE);
        var position = this.getFuturPosition(orientation, distance, angle);
        if (isCameraOrientation) {
            orientation = Wanok.mod(orientation +
                                $currentMap.camera.getMapOrientation() - 2, 4);
        }
        this.position.set(position.x, position.y, position.z);

        // Update orientation
        this.orientationEye = orientation;
        orientation = this.orientation;
        if (this.currentState.setWithCamera)
            this.updateOrientation();
        if (this.orientation !== orientation)
            this.updateUVs();

        //this.moving = 100;
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
        var objects, previousPortion, movedObjects, index, mapPortion,
            originalPortion, localPortion;

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
            originalPortion = SceneMap.getGlobalPortion(
                        $currentMap.allObjects[this.system.id]);
            objects = $game.mapsDatas[$currentMap.id]
                   [originalPortion[0]][originalPortion[1]][originalPortion[2]];
            movedObjects = objects.m;
            if (movedObjects.indexOf(this) === -1) {
                movedObjects.unshift(this);
                localPortion = $currentMap.getLocalPortion(originalPortion);
                mapPortion = $currentMap.getMapPortionByPortion(localPortion);
                movedObjects = mapPortion.objectsList;
                index = movedObjects.indexOf(this);
                if (index !== -1)
                    movedObjects.splice(index, 1);
            }
        }
    },

    // -------------------------------------------------------

    addMoveTemp: function(){
        var objects, afterPortion, originalPortion, localPortion;
        afterPortion = Wanok.getPortion(this.position);

        if (!this.isHero){
            objects = $game.mapsDatas[$currentMap.id]
                    [afterPortion[0]][afterPortion[1]][afterPortion[2]];
            originalPortion = SceneMap.getGlobalPortion(
                        $currentMap.allObjects[this.system.id]);

            if (originalPortion[0] !== afterPortion[0] ||
                originalPortion[1] !== afterPortion[1] ||
                originalPortion[2] !== afterPortion[2])
            {
                objects.mout.unshift(this);
            }
            else
                objects.min.unshift(this);
        }

        // Add or remove from scene
        localPortion = $currentMap.getLocalPortion(afterPortion);
        if ($currentMap.isInPortion(localPortion))
            this.addToScene();
        else
            this.removeFromScene();
    },

    // -------------------------------------------------------

    addToScene: function(){
        if (!this.isInScene && this.mesh !== null) {
            $currentMap.scene.add(this.mesh);
            this.isInScene = true;
        }
    },

    // -------------------------------------------------------

    removeFromScene: function(){
        if (this.isInScene) {
            $currentMap.scene.remove(this.mesh);
            this.isInScene = false;
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
    update: function(angle){
        if (this.mesh !== null){
            var frame = this.frame;
            var orientation = this.orientation;

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
                //this.moving -= $elapsedTime;
                this.moving = false;
            }
            else {
                this.frame = 0;
                //this.moving = 0;

                // Update angle
                if (this.currentState.setWithCamera)
                    this.updateOrientation();
            }

            this.updateAngle(angle);

            // Update mesh
            if (frame !== this.frame || orientation !== this.orientation)
                this.updateUVs();
        }
    },

    // -------------------------------------------------------

    /** Update the Y angle (for face sprites).
    *   @param {number} angle The angle on the Y axis.
    */
    updateAngle: function(angle){
        if (this.currentState.graphicKind === ElementMapKind.SpritesFace)
            this.mesh.rotation.y = angle;
    },

    // -------------------------------------------------------

    /** Update the orientation according to the camera position
    */
    updateOrientation: function(){
        this.orientation = Wanok.mod(($currentMap.orientation - 2) * 3 +
                                     this.orientationEye, 4);
    },

    // -------------------------------------------------------

    /** Update the UVs coordinates according to frame and orientation.
    */
    updateUVs: function(){
        if (this.mesh !== null &&
            this.currentState.graphicKind !== ElementMapKind.None)
        {
            var textureWidth = this.mesh.material.map.image.width;
            var textureHeight = this.mesh.material.map.image.height;
            var w = this.width * $SQUARE_SIZE / textureWidth;
            var h = this.height * $SQUARE_SIZE / textureHeight;
            var x = this.frame * w;
            var y = this.orientation * h;

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
        if (this.currentState.graphicKind !== ElementMapKind.None){
            this.mesh.material =
                 $currentMap.texturesCharacters[this.currentState.graphicID];
        }
        else{
            this.mesh = null;
        }
    }
}
