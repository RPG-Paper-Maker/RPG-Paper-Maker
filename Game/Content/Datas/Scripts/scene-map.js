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
//  CLASS SceneMap : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene for a local map.
*   @extends SceneGame
*   @property {number} id The ID of the map.
*   @property {string} mapName The map name.
*   @property {THREE.Scene} scene The 3D scene of the map.
*   @property {Camera} camera he camera of the scene.
*   @property {Object} mapInfos General map informations (real name, name,
*   width, height).
*   @property {number[][]} allObjects All the objects portions according to ID.
*   @property {MapPortion[][][]} mapPortions All the portions in the visible ray
*   of the map.
*   @param {number} id The ID of the map.
*/
function SceneMap(id){
    SceneGame.call(this);

    $currentMap = this;
    this.id = id;
    this.mapName = Wanok.generateMapName(id);
    this.scene = new THREE.Scene();
    this.camera = new Camera(240, 150);
    this.camera.update();
    this.orientation = this.camera.getMapOrientation();
    this.readMapInfos();
    this.currentPortion = Wanok.getPortion($game.hero.position);
    this.callBackAfterLoading = this.loadTextures;
}

/** Get the portion file name.
*   @static
*   @param {number} x The global x portion.
*   @param {number} y The global y portion.
*   @param {number} z The global z portion.
*   @returns {string}
*/
SceneMap.getPortionName = function(x, y, z){
    return (x + "_" + y + "_" + z + ".json");
}

// -------------------------------------------------------

SceneMap.getGlobalPortion = function(position) {
    return [
        Math.floor(position[0] / $PORTION_SIZE),
        Math.floor(position[1] / $PORTION_SIZE),
        Math.floor(position[3] / $PORTION_SIZE)
    ];
}

// -------------------------------------------------------

SceneMap.prototype = {

    /** Read the map infos file.
    */
    readMapInfos: function(){
        Wanok.openFile(this, Wanok.FILE_MAPS + this.mapName +
                       Wanok.FILE_MAP_INFOS, true, function(res)
        {
            var json = JSON.parse(res);

            this.mapInfos = {
                name: json.name,
                length: json.l,
                width: json.w,
                height: json.h,
                depth: json.d,
                tileset : $datasGame.tilesets.list[json.tileset]
            };

            // Now that we have map dimensions, we can initialize object portion
            if (!$game.mapsDatas.hasOwnProperty(this.id))
                this.initializePortionsObjects();
        });
    },

    // -------------------------------------------------------

    /** Initialize the map portions.
    */
    initializePortions: function(){
        this.loadPortions();

        // Hero initialize
        $game.hero.changeState();

        // End callback
        this.callBackAfterLoading = null;
    },

    // -------------------------------------------------------

    loadPortions: function(){
        this.currentPortion = Wanok.getPortion($game.hero.position);

        var limit = this.getMapPortionLimit();
        this.mapPortions = new Array(this.getMapPortionTotalSize());
        for (var i = -limit; i <= limit; i++) {
            for (var j = -limit; j <= limit; j++) {
                for (var k = -limit; k <= limit; k++) {
                    this.loadPortion(this.currentPortion[0] + i,
                                     this.currentPortion[1] + j,
                                     this.currentPortion[2] + k,
                                     i, j, k, true);
                }
            }
        }
    },

    // -------------------------------------------------------

    /** Load a portion.
    *   @param {number} realX The global x portion.
    *   @param {number} realY The global y portion.
    *   @param {number} realZ The global z portion.
    *   @param {number} x The local x portion.
    *   @param {number} y The local y portion.
    *   @param {number} z The local z portion.
    */
    loadPortion: function(realX, realY, realZ, x, y, z, wait) {
        var lx = Math.floor((this.mapInfos.length - 1) / $PORTION_SIZE);
        var ly = Math.floor((this.mapInfos.depth + this.mapInfos.height - 1) /
                $PORTION_SIZE);
        var lz = Math.floor((this.mapInfos.width - 1) / $PORTION_SIZE);

        if (realX >= 0 && realX <= lx && realY >= 0 && realY <= ly &&
            realZ >= 0 && realZ <= lz)
        {
            var fileName = SceneMap.getPortionName(realX, realY, realZ);
            Wanok.openFile(this, Wanok.FILE_MAPS + this.mapName + "/" +
                           fileName, wait, function(res)
            {
                var json = JSON.parse(res);
                var mapPortion = null;

                if (json.hasOwnProperty("floors")){
                    mapPortion = new MapPortion(realX, realY, realZ);
                    mapPortion.read(
                            json, this.id === $datasGame.system.idMapStartHero);
                }
                this.setMapPortion(x, y, z, mapPortion);
            });
        }
        else
            this.setMapPortion(x, y, z, null);
    },

    // -------------------------------------------------------

    loadPortionFromPortion: function(portion, x, y, z) {
        this.loadPortion(portion[0] + x, portion[1] + y, portion[2] + z,
                         x, y, z, false);
    },

    // -------------------------------------------------------

    removePortion: function(i, j, k){
        var mapPortion = this.getMapPortion(i, j, k);

        if (mapPortion !== null)
            mapPortion.cleanAll();
    },

    // -------------------------------------------------------

    setPortion: function(i, j, k, m, n, o) {
        this.setMapPortion(i, j, k, this.getMapPortion(m, n, o));
    },

    // -------------------------------------------------------

    /** Initialize the map objects
    */
    initializeObjects: function(){
        Wanok.openFile(this, Wanok.FILE_MAPS + this.mapName +
                       Wanok.FILE_MAP_OBJECTS, true, function(res)
        {
            var json = JSON.parse(res).objs;
            var i, l;

            var jsonObject;
            l = json.length;
            this.allObjects = new Array(l+1);
            for (i = 0; i < l; i++){
                jsonObject = json[i];
                this.allObjects[jsonObject.id] = jsonObject.p;
            }
        });

        this.callBackAfterLoading = this.initializePortions;
    },

    // -------------------------------------------------------

    /** All the objects moved or/and with changed states.
    */
    initializePortionsObjects: function(){
        var l = Math.ceil(this.mapInfos.length / $PORTION_SIZE);
        var w = Math.ceil(this.mapInfos.width / $PORTION_SIZE);
        var h = Math.ceil(this.mapInfos.height / $PORTION_SIZE) +
                Math.ceil(this.mapInfos.depth / $PORTION_SIZE);

        var objectsPortions = new Array(l);
        for (var i = 0; i < l; i++){
            objectsPortions[i] = new Array(w);
            for (var j = 0; j < h; j++){
                objectsPortions[i][j] = new Array(h);
                for (var k = 0; k < w; k++){
                    objectsPortions[i][j][k] =
                    {
                        min: [], // All the moved objects that are in this
                                 // portion
                        mout: [],// All the moved objects that are from another
                                 // portion
                        m: [],   // All the moved objects that are from this
                                 // portion
                        si: [],  // Ids of the objects that have modified states
                        s: []    // States of the objects according to id
                    };
                }
            }
        }

        $game.mapsDatas[this.id] = objectsPortions;
    },

    // -------------------------------------------------------

    /** Load all the textures of the map.
    */
    loadTextures: function(){

        // Load textures
        var textureLoader = new THREE.TextureLoader();
        var path;
        var characters;
        var i, l;

        // Tileset
        path = this.mapInfos.tileset.getPath();
        this.textureTileset = this.loadTexture(textureLoader, path);

        // Characters
        characters = $datasGame.pictures.list[PictureKind.Characters];
        l = characters.length;
        this.texturesCharacters = new Array(l);
        this.texturesCharacters[0] = this.loadTextureEmpty();
        for (i = 1; i < l; i++){
            path = $datasGame.pictures.list
                    [PictureKind.Characters][i].getPath(PictureKind.Characters);
            this.texturesCharacters[i] = this.loadTexture(textureLoader, path);
        }

        this.callBackAfterLoading = this.initializeObjects;
    },

    // -------------------------------------------------------

    /** Load a texture.
    *   @param {THREE.TextureLoader} The texture loader.
    *   @param {string} The path of the texture.
    *   @retuns {THREE.MeshBasicMaterial}
    */
    loadTexture: function(textureLoader, path){
        $filesToLoad++;
        var texture = textureLoader.load(path,
            function(t){
                $loadedFiles++;
            },
            function (t) {

            },
            function (t) {
                Wanok.showErrorMessage("Could not load " + path);
            }
        );
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.flipY = false;

        return new THREE.MeshBasicMaterial(
        {
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading,
            alphaTest: 0.5,
            overdraw: 0.5
        });
    },

    // -------------------------------------------------------

    /** Load a texture empty.
    *   @retuns {THREE.MeshBasicMaterial}
    */
    loadTextureEmpty: function(){
        return new THREE.MeshBasicMaterial(
        {
            transparent: true,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading,
            alphaTest: 0.5,
            overdraw: 0.5
        });
    },

    // -------------------------------------------------------

    getMapPortion: function(x, y, z) {
        var index = this.getPortionIndex(x, y, z);

        return this.getBrutMapPortion(index);
    },

    // -------------------------------------------------------

    getMapPortionByPortion: function(portion) {
        return this.getMapPortion(portion[0], portion[1], portion[2]);
    },

    // -------------------------------------------------------

    getBrutMapPortion: function(index) {
        return this.mapPortions[index];
    },

    // -------------------------------------------------------

    getPortionIndex: function(x, y, z) {
        var size = this.getMapPortionSize();
        var limit = this.getMapPortionLimit();

        return ((x + limit) * size * size) + ((y + limit) * size) +
                (z + limit);
    },

    // -------------------------------------------------------

    setMapPortion: function(x, y, z, mapPortion) {
        var index = this.getPortionIndex(x, y, z);
        this.mapPortions[index] = mapPortion;
    },

    // -------------------------------------------------------

    getLocalPortion: function(portion){
        return [
            portion[0] - this.currentPortion[0],
            portion[1] - this.currentPortion[1],
            portion[2] - this.currentPortion[2]
        ];
    },

    // -------------------------------------------------------

    getMapPortionLimit: function(){
        return $PORTIONS_RAY_NEAR + $PORTIONS_RAY_FAR;
    },

    // -------------------------------------------------------

    getMapPortionSize: function(){
        return (this.getMapPortionLimit() * 2) + 1;
    },

    // -------------------------------------------------------

    getMapPortionTotalSize: function(){
        var size = this.getMapPortionSize();

        return size * size * size;
    },

    // -------------------------------------------------------

    isInPortion: function(portion) {
        var limit = this.getMapPortionLimit();

        return (portion[0] >= -limit && portion[0] <= limit &&
                portion[1] >= -limit && portion[1] <= limit &&
                portion[2] >= -limit && portion[2] <= limit);
    },

    // -------------------------------------------------------

    isInMap: function(position) {
        return (position[0] >= 0 && position[0] < this.mapInfos.length &&
                position[2] >= 0 && position[2] < this.mapInfos.width);
    },

    // -------------------------------------------------------

    updateMovingPortions: function() {
        var newPortion = Wanok.getPortion($game.hero.position);

        if (!Wanok.arePortionEquals(newPortion, this.currentPortion)){
            this.updateMovingPortionsEastWest(newPortion);
            this.updateMovingPortionsNorthSouth(newPortion);
            this.updateMovingPortionsUpDown(newPortion);
        }

        this.currentPortion = newPortion;
    },

    // -------------------------------------------------------

    updateMovingPortionsEastWest: function(newPortion) {
        var i, j, k;
        var r = this.getMapPortionLimit();
        if (newPortion[0] > this.currentPortion[0]) {
            k = 0;
            for (j = -r; j <= r; j++) {
                i = -r;
                this.removePortion(i, k, j);
                for (; i < r; i++)
                    this.setPortion(i, k, j, i + 1, k, j);

                this.loadPortionFromPortion(newPortion, r, k, j);
            }
        }
        else if (newPortion[0] < this.currentPortion[0]){
            k = 0;
            for (j = -r; j <= r; j++){
                i = r;
                this.removePortion(i, k, j);
                for (; i > -r; i--)
                    this.setPortion(i, k, j, i - 1, k, j);

                this.loadPortionFromPortion(newPortion, -r, k, j);
            }
        }
    },

    // -------------------------------------------------------

    updateMovingPortionsNorthSouth: function(newPortion) {
        var i, j, k;
        var r = this.getMapPortionLimit();
        if (newPortion[2] > this.currentPortion[2]){
            k = 0;
            for (i = -r; i <= r; i++){
                j = -r;
                this.removePortion(i, k, j);
                for (; j < r; j++)
                    this.setPortion(i, k, j, i, k, j + 1);

                this.loadPortionFromPortion(newPortion, i, k, r);
            }
        }
        else if (newPortion[2] < this.currentPortion[2]){
            k = 0;
            for (i = -r; i <= r; i++){
                j = r;
                this.removePortion(i, k, j);
                for (; j > -r; j--)
                    this.setPortion(i, k, j, i, k, j - 1);

                this.loadPortionFromPortion(newPortion, i, k, -r);
            }
        }
    },

    // -------------------------------------------------------

    updateMovingPortionsUpDown: function(newPortion) {
        // TODO
    },

    // -------------------------------------------------------

    /** Close the map.
    */
    closeMap: function() {
        var i, j, k;
        var l = Math.ceil(this.mapInfos.length / $PORTION_SIZE);
        var w = Math.ceil(this.mapInfos.width / $PORTION_SIZE);
        var h = Math.ceil(this.mapInfos.height / $PORTION_SIZE) +
                Math.ceil(this.mapInfos.depth / $PORTION_SIZE);

        var objectsPortions = $game.mapsDatas[this.id];
        for (i = 0; i < l; i++){
            for (j = 0; j < h; j++){
                for (k = 0; k < w; k++){
                    var portion = objectsPortions[i][j][k];
                    portion.mr = [];
                    portion.ma = [];
                    portion.m = [];
                }
            }
        }

        // Clear scene
        for (i = this.scene.children.length - 1; i >= 0; i--) {
            this.scene.remove(this.scene.children[i]);
        }

        $currentMap = null;
    },

    // -------------------------------------------------------

    update: function(){
        this.updateMovingPortions();

        // Update camera
        this.camera.update();
        this.orientation = this.camera.getMapOrientation();

        // Getting the Y angle of the camera
        var vector = new THREE.Vector3();
        this.camera.threeCamera.getWorldDirection(vector);
        var angle = Math.atan2(vector.x,vector.z) + (180 * Math.PI / 180.0);

        // Update the objects
        $game.hero.update(angle);
        this.updatePortions(this, function(x, y, z, i, j, k) {
            var objects = $game.mapsDatas[this.id][x][y][z];
            var movedObjects = objects.min;
            var movedObject;
            for (var p = 0, l = movedObjects.length; p < l; p++)
                movedObjects[p].update(angle);
            movedObjects = objects.mout;
            for (var p = 0, l = movedObjects.length; p < l; p++)
                movedObjects[p].update(angle);

            // Update face sprites
            var mapPortion = this.getMapPortion(i, j, k);

            if (mapPortion !== null)
                mapPortion.updateFaceSprites(angle);
        });

        // Update
        SceneGame.prototype.update.call(this);
    },

    // -------------------------------------------------------

    updatePortions: function(base, callback) {
        var limit = this.getMapPortionLimit();
        var i, j, k, p, l, x, y, z;
        var lx = Math.floor((this.mapInfos.length - 1) / $PORTION_SIZE);
        var ly = Math.floor((this.mapInfos.depth + this.mapInfos.height - 1) /
                $PORTION_SIZE);
        var lz = Math.floor((this.mapInfos.width - 1) / $PORTION_SIZE);
        for (i = -limit; i <= limit; i++) {
            for (j = -limit; j <= limit; j++) {
                for (k = -limit; k <= limit; k++) {
                    x = this.currentPortion[0] + i;
                    y = this.currentPortion[1] + j;
                    z = this.currentPortion[2] + k;
                    if (x >= 0 && x <= lx && y >= 0 && y <= ly && z >= 0 &&
                        z <= lz)
                    {
                        callback.call(base, x, y, z, i, j, k);
                    }
                }
            }
        }
    },

    // -------------------------------------------------------

    onKeyPressed: function(key){

        // Send keyPressEvent to all the objects
        if (!$blockingHero){
            EventCommandSendEvent.sendEvent(null, 0, 1, true, 3,
                                            [null,
                                            SystemValue.createNumber(key),
                                            SystemValue.createSwitch(false),
                                            SystemValue.createSwitch(false)]);
        }

        SceneGame.prototype.onKeyPressed.call(this, key);
    },

    // -------------------------------------------------------

    onKeyReleased: function(key){
        SceneGame.prototype.onKeyReleased.call(this, key);
    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){
        if (!$blockingHero){
            EventCommandSendEvent.sendEvent(null, 0, 1, true, 3,
                                            [null,
                                            SystemValue.createNumber(key),
                                            SystemValue.createSwitch(true),
                                            SystemValue.createSwitch(true)]);

            // Temporary camera turn
            if (DatasKeyBoard.isKeyEqual(
                        key, $datasGame.keyBoard.LeftCamera))
            {
                this.camera.updateAngle(false);
            }
            else if (DatasKeyBoard.isKeyEqual(
                         key, $datasGame.keyBoard.RightCamera))
            {
                this.camera.updateAngle(true);
            }

        }

        var block = SceneGame.prototype.onKeyPressedRepeat.call(this, key);

        return block;
    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        if (!$blockingHero){
            EventCommandSendEvent.sendEvent(null, 0, 1, true, 3,
                                            [null,
                                            SystemValue.createNumber(key),
                                            SystemValue.createSwitch(true),
                                            SystemValue.createSwitch(false)]);
        }

        SceneGame.prototype.onKeyPressedAndRepeat.call(this, key);
    },

    // -------------------------------------------------------

    draw3D: function(canvas){
        $renderer.render(this.scene, this.camera.threeCamera);
    },

    // -------------------------------------------------------

    drawHUD: function(context){
        SceneGame.prototype.drawHUD.call(this, context);
    }
}
