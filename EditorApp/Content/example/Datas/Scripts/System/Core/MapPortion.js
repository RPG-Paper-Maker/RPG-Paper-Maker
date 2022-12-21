/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from "../Globals.js";
import { MapObject } from "./MapObject.js";
import { Position } from "./Position.js";
import { System, Datas, Manager, Scene } from "../index.js";
import { Constants, Enum, Platform, Utils } from "../Common/index.js";
import { Floor } from "./Floor.js";
import { Autotiles } from "./Autotiles.js";
import { Autotile } from "./Autotile.js";
import { Sprite } from "./Sprite.js";
var ElementMapKind = Enum.ElementMapKind;
var ShapeKind = Enum.ShapeKind;
import { SpriteWall } from "./SpriteWall.js";
import { Mountains } from "./Mountains.js";
import { Mountain } from "./Mountain.js";
import { Object3DBox } from "./Object3DBox.js";
import { Object3DCustom } from "./Object3DCustom.js";
import { Game } from "./Game.js";
import { CustomGeometry } from "./CustomGeometry.js";
import { CustomGeometryFace } from "./CustomGeometryFace.js";
/** @class
 *  A portion of the map.
 *  @param {Portion} portion
*/
class MapPortion {
    constructor(portion) {
        this.portion = portion;
        this.staticFloorsMesh = null;
        this.staticSpritesMesh = null;
        this.faceSpritesMesh = null;
        this.squareNonEmpty = new Array(Constants.PORTION_SIZE * Constants
            .PORTION_SIZE);
        let i, j;
        for (i = 0; i < Constants.PORTION_SIZE; i++) {
            this.squareNonEmpty[i] = new Array(Constants.PORTION_SIZE);
            for (j = 0; j < Constants.PORTION_SIZE; j++) {
                this.squareNonEmpty[i][j] = new Array;
            }
        }
        let l = Constants.PORTION_SIZE * Constants.PORTION_SIZE * Constants
            .PORTION_SIZE;
        this.boundingBoxesLands = new Array(l);
        this.boundingBoxesSprites = new Array(l);
        this.boundingBoxesMountains = new Array(l);
        this.boundingBoxesObjects3D = new Array(l);
        for (i = 0; i < l; i++) {
            this.boundingBoxesLands[i] = new Array;
            this.boundingBoxesSprites[i] = new Array;
            this.boundingBoxesMountains[i] = new Array;
            this.boundingBoxesObjects3D[i] = new Array;
        }
        this.staticAutotilesList = new Array;
        this.staticMountainsList = new Array;
        this.objectsList = new Array;
        this.staticWallsList = new Array;
        this.staticObjects3DList = new Array;
        this.overflowMountains = new Array;
        this.heroID = -1;
    }
    /**
     *  Read the JSON associated to the map portion.
     *  @param {Record<string, any>} json - object describing the map portion
     *  @param {boolean} isMapHero - Indicates if this map is where the hero is
     *  at the beginning of the game.
     */
    read(json, isMapHero) {
        this.readLands(json.lands);
        this.readSprites(json.sprites);
        if (json.moun) {
            this.readMountains(json.moun);
        }
        if (json.objs3d) {
            this.readObjects3D(json.objs3d);
        }
        this.readObjects(json.objs.list, isMapHero);
    }
    /**
     *  Read the JSON associated to the lands in the portion.
     *  @param {Record<string, any>} json - object describing the lands
     */
    readLands(json) {
        this.readFloors(json.floors);
        this.readAutotiles(json.autotiles);
    }
    /**
     *  Read the JSON associated to the floors in the portion.
     *  @param {Record<string, any>} json - Json object describing the floors
     */
    readFloors(json) {
        let material = Scene.Map.current.textureTileset;
        let texture = Manager.GL.getMaterialTexture(material);
        let width = texture ? texture.image.width : 0;
        let height = texture ? texture.image.height : 0;
        let geometry = new CustomGeometry();
        let layers = [];
        let count = 0;
        let i, j, l, m, jsonFloor, position, layer, floor, objCollision, index;
        for (i = 0, l = json.length; i < l; i++) {
            jsonFloor = json[i];
            position = Position.createFromArray(jsonFloor.k);
            layer = position.layer;
            floor = new Floor(jsonFloor.v);
            if (layer > 0) {
                for (j = 0, m = layers.length; j < m; j++) {
                    if (layer <= layers[j][0].layer) {
                        layers.splice(j, 0, [position, floor]);
                        break;
                    }
                }
                if (j === m) {
                    layers.push([position, floor]);
                }
            }
            else {
                objCollision = floor.updateGeometry(geometry, position, width, height, count);
                index = position.toIndex();
                this.boundingBoxesLands[index].push(objCollision);
                this.addToNonEmpty(position);
                count++;
            }
        }
        // Draw layers separatly
        for (i = 0, l = layers.length; i < l; i++) {
            position = layers[i][0];
            floor = layers[i][1];
            objCollision = floor.updateGeometry(geometry, position, width, height, count);
            index = position.toIndex();
            if (objCollision !== null) {
                this.boundingBoxesLands[index].push(objCollision);
            }
            this.addToNonEmpty(position);
            count++;
        }
        // Creating the plane
        geometry.updateAttributes();
        this.staticFloorsMesh = new THREE.Mesh(geometry, material);
        this.staticFloorsMesh.renderOrder = 0;
        Scene.Map.current.scene.add(this.staticFloorsMesh);
    }
    /**
     *  Read the JSON associated to the autotiles in the portion.
     *  @param {Record<string, any>} json - Json object describing the autotiles
     */
    readAutotiles(json) {
        if (!json) {
            return;
        }
        let texture = null;
        // Create autotiles according to the textures
        let i, l, texturesAutotile;
        for (i = 0, l = Scene.Map.current.texturesAutotiles.length; i < l; i++) {
            texturesAutotile = Scene.Map.current.texturesAutotiles[i];
            if (texturesAutotile) {
                for (let textureAutotile of texturesAutotile) {
                    if (!this.staticAutotilesList[i]) {
                        this.staticAutotilesList[i] = new Array;
                    }
                    this.staticAutotilesList[i].push(new Autotiles(textureAutotile));
                }
            }
        }
        // Read and update geometry
        let j, m, jsonAutotile, position, autotile, indexPos, textureAutotile, autotiles, objCollision;
        for (i = 0, l = json.length; i < l; i++) {
            jsonAutotile = json[i];
            position = Position.createFromArray(jsonAutotile.k);
            autotile = new Autotile(jsonAutotile.v);
            indexPos = position.toIndex();
            texture = null;
            texturesAutotile = Scene.Map.current.texturesAutotiles[autotile.autotileID];
            for (j = 0, m = texturesAutotile.length; j < m; j++) {
                textureAutotile = texturesAutotile[j];
                if (textureAutotile.isInTexture(autotile.autotileID, autotile
                    .texture)) {
                    texture = textureAutotile;
                    autotiles = this.staticAutotilesList[autotile.autotileID][j];
                    break;
                }
            }
            if (texture !== null && texture.material !== null) {
                objCollision = autotiles.updateGeometry(position, autotile);
                if (objCollision !== null) {
                    this.boundingBoxesLands[indexPos].push(objCollision);
                }
            }
            this.addToNonEmpty(position);
        }
        // Update all the geometry uvs and put it in the scene
        for (let list of this.staticAutotilesList) {
            if (list) {
                for (autotiles of list) {
                    autotiles.createMesh();
                    Scene.Map.current.scene.add(autotiles.mesh);
                }
            }
        }
    }
    /**
     *  Read the JSON associated to the sprites in the portion.
     *  @param {Record<string, any>} json - Json object describing the sprites
     */
    readSprites(json) {
        this.readSpritesWalls(json.walls);
        this.readSpritesGlobals(json.list);
    }
    /** Read the JSON associated to the sprites globals in the portion.
     *  @param {Record<string, any>} json - Json object describing the sprites globals
    */
    readSpritesGlobals(json) {
        let staticMaterial = Scene.Map.current.textureTileset;
        let faceMaterial = Scene.Map.current.textureTilesetFace;
        let staticGeometry = new CustomGeometry();
        let faceGeometry = new CustomGeometryFace();
        let staticCount = 0, faceCount = 0;
        let texture = Manager.GL.getMaterialTexture(staticMaterial);
        if (texture) {
            let s, position, sprite, localPosition, collisions, resultUpdate;
            for (let i = 0, l = json.length; i < l; i++) {
                s = json[i];
                position = Position.createFromArray(s.k);
                sprite = new Sprite(s.v);
                localPosition = position.toVector3();
                if (sprite.kind === ElementMapKind.SpritesFace) {
                    resultUpdate = sprite.updateGeometry(faceGeometry, texture.image
                        .width, texture.image.height, position, faceCount, true, localPosition);
                    faceCount = resultUpdate[0];
                    collisions = resultUpdate[1];
                }
                else {
                    resultUpdate = sprite.updateGeometry(staticGeometry, texture
                        .image.width, texture.image.height, position, staticCount, true, localPosition);
                    staticCount = resultUpdate[0];
                    collisions = resultUpdate[1];
                }
                this.updateCollisionSprite(collisions, position);
            }
        }
        staticGeometry.updateAttributes();
        faceGeometry.updateAttributes();
        this.staticSpritesMesh = new THREE.Mesh(staticGeometry, staticMaterial);
        this.staticSpritesMesh.renderOrder = 999;
        Scene.Map.current.scene.add(this.staticSpritesMesh);
        this.faceSpritesMesh = new THREE.Mesh(faceGeometry, faceMaterial);
        this.faceSpritesMesh.renderOrder = 999;
        this.faceSpritesMesh.frustumCulled = false;
        Scene.Map.current.scene.add(this.faceSpritesMesh);
    }
    /**
     *  Read the JSON associated to the sprites walls in the portion.
     *  @param {Record<string, any>} json - Json object describing the sprites
     *  walls
     */
    readSpritesWalls(json) {
        let wallsIds = Scene.Map.current.texturesWalls.length;
        let hash = new Array(wallsIds);
        // Initialize all walls to null
        let i;
        for (i = 0; i < wallsIds; i++) {
            hash[i] = null;
        }
        let l, s, position, sprite, obj, geometry, material, count, result;
        for (i = 0, l = json.length; i < l; i++) {
            // Getting sprite
            s = json[i];
            position = Position.createFromArray(s.k);
            sprite = new SpriteWall(s.v);
            // Constructing the geometry
            obj = hash[sprite.id];
            // If ID exists in this tileset
            if (!Utils.isUndefined(obj)) {
                if (obj === null) {
                    geometry = new CustomGeometry();
                    material = Scene.Map.current.texturesWalls[sprite.id];
                    count = 0;
                    obj = {
                        geometry: geometry,
                        material: material,
                        c: count
                    };
                    hash[sprite.id] = obj;
                }
                else {
                    geometry = obj.geometry;
                    material = obj.material;
                    count = obj.c;
                }
                let texture = Manager.GL.getMaterialTexture(material);
                if (texture) {
                    result = sprite.updateGeometry(geometry, position, texture
                        .image.width, texture.image.height, count);
                    obj.c = result[0];
                    this.updateCollisionSprite(result[1], position);
                }
            }
        }
        // Add to scene
        let mesh;
        for (i = 0; i < wallsIds; i++) {
            obj = hash[i];
            if (obj !== null) {
                geometry = obj.geometry;
                geometry.updateAttributes();
                mesh = new THREE.Mesh(geometry, obj.material);
                this.staticWallsList.push(mesh);
                Scene.Map.current.scene.add(mesh);
            }
        }
    }
    /**
     *  Read the JSON associated to the mountains in the portion.
     *  @param {Record<string, any>} json - Json object describing the mountains
     */
    readMountains(json) {
        if (!json) {
            return;
        }
        let texture = null;
        let mountainsLength = Scene.Map.current.texturesMountains.length;
        // Create mountains according to the textures
        let i;
        for (i = 0; i < mountainsLength; i++) {
            this.staticMountainsList.push(new Mountains(Scene.Map.current
                .texturesMountains[i]));
        }
        // Read and update geometry
        let jsonAll = json.a;
        let l, jsonMountain, position, mountain, indexPos, index, textureMountain, mountains, objCollision;
        for (i = 0, l = jsonAll.length; i < l; i++) {
            jsonMountain = jsonAll[i];
            position = Position.createFromArray(jsonMountain.k);
            mountain = new Mountain;
            mountain.read(jsonMountain.v);
            indexPos = position.toIndex();
            for (index = 0; index < mountainsLength; index++) {
                textureMountain = Scene.Map.current.texturesMountains[index];
                if (textureMountain.isInTexture(mountain.mountainID)) {
                    texture = textureMountain;
                    mountains = this.staticMountainsList[index];
                    break;
                }
            }
            if (texture !== null && texture.material !== null) {
                objCollision = mountains.updateGeometry(position, mountain);
                this.updateCollision(this.boundingBoxesMountains, objCollision, position, true);
            }
        }
        // Update all the geometry uvs and put it in the scene
        for (i = 0, l = this.staticMountainsList.length; i < l; i++) {
            mountains = this.staticMountainsList[i];
            mountains.createMesh();
            Scene.Map.current.scene.add(mountains.mesh);
        }
        // Handle overflow
        jsonMountain = json.o;
        for (i = 0, l = jsonMountain.length; i < l; i++) {
            this.overflowMountains.push(Position.createFromArray(jsonMountain[i]));
        }
    }
    /**
     *  Read the JSON associated to the objects 3D in the portion.
     *  @param {Record<string, any>} json - Json object describing the objects 3D
    */
    readObjects3D(json) {
        // Initialize
        let nbTextures = Scene.Map.current.texturesObjects3D.length;
        let hash = new Array(nbTextures);
        let i;
        for (i = 1; i <= nbTextures; i++) {
            hash[i] = null;
        }
        // Read all
        let jsonAll = json.a;
        let l = jsonAll.length;
        let o, position, v, datas, obj3D, obj, geometry, material, count, result;
        for (i = 0; i < l; i++) {
            // Getting object 3D
            o = jsonAll[i];
            position = Position.createFromArray(o.k);
            v = o.v;
            datas = Datas.SpecialElements.getObject3D(v.did);
            if (datas) {
                switch (datas.shapeKind) {
                    case ShapeKind.Box:
                        obj3D = new Object3DBox(v, datas);
                        break;
                    case ShapeKind.Sphere:
                        break;
                    case ShapeKind.Cylinder:
                        break;
                    case ShapeKind.Cone:
                        break;
                    case ShapeKind.Capsule:
                        break;
                    case ShapeKind.Custom:
                        obj3D = new Object3DCustom(v, datas);
                        break;
                }
                // Constructing the geometry
                obj = hash[obj3D.datas.pictureID];
                if (!Utils.isUndefined(obj)) {
                    if (obj === null) {
                        geometry = new CustomGeometry();
                        material = Scene.Map.current.texturesObjects3D[obj3D.datas.pictureID];
                        count = 0;
                        obj = {
                            geometry: geometry,
                            material: material,
                            c: count
                        };
                        hash[obj3D.datas.pictureID] = obj;
                    }
                    else {
                        geometry = obj.geometry;
                        material = obj.material;
                        count = obj.c;
                    }
                    if (Manager.GL.getMaterialTexture(material)) {
                        result = obj3D.updateGeometry(geometry, position, count);
                        obj.c = result[0];
                        this.updateCollision(this.boundingBoxesObjects3D, result[1], position, datas.shapeKind === ShapeKind.Custom);
                    }
                }
            }
        }
        // Add meshes
        let mesh;
        for (i = 1; i <= nbTextures; i++) {
            obj = hash[i];
            if (obj !== null) {
                geometry = obj.geometry;
                geometry.updateAttributes();
                mesh = new THREE.Mesh(geometry, obj.material);
                this.staticObjects3DList.push(mesh);
                mesh.renderOrder = 999;
                Scene.Map.current.scene.add(mesh);
            }
        }
    }
    /**
     *  Read the JSON associated to the objects in the portion.
     *  @param {Record<string, any>} json - Json object describing the objects
     *  @param {boolean} isMapHero - Indicates if this map is where the hero is
     *  at the beginning of the game
    */
    readObjects(json, isMapHero) {
        let datas = Scene.Map.current.getObjectsAtPortion(this.portion);
        let objectsM = datas.m;
        let objectsR = datas.r;
        let m = objectsM.length;
        let n = objectsR.length;
        // Read
        let i, j, l, jsonObject, position, object, id, index, localPosition, mapObject;
        for (i = 0, l = json.length; i < l; i++) {
            jsonObject = json[i];
            position = Position.createFromArray(jsonObject.k);
            object = new System.MapObject(jsonObject.v);
            id = object.id;
            // Check if the object is moving (so no need to add it to the scene)
            index = -1;
            for (j = 0; j < m; j++) {
                if (objectsM[j].system.id === id) {
                    index = j;
                    break;
                }
            }
            for (j = 0; j < n; j++) {
                if (objectsR[j] === id) {
                    index = j;
                    break;
                }
            }
            /* If it is the hero, you should not add it to the list of
            objects to display */
            if ((!isMapHero || Datas.Systems.ID_OBJECT_START_HERO !== object.id)
                && index === -1) {
                localPosition = position.toVector3();
                mapObject = new MapObject(object, localPosition);
                mapObject.changeState();
                this.objectsList.push(mapObject);
            }
            else {
                this.heroID = object.id;
            }
        }
        // Add moved objects to the scene
        let objects = datas.min;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].changeState();
            objects[i].addToScene();
        }
        objects = datas.mout;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].changeState();
            objects[i].addToScene();
        }
    }
    /**
     *  Remove all the objects from the scene.
     */
    cleanAll() {
        // Static stuff
        if (this.staticFloorsMesh !== null) {
            Scene.Map.current.scene.remove(this.staticFloorsMesh);
        }
        if (this.staticSpritesMesh !== null) {
            Scene.Map.current.scene.remove(this.staticSpritesMesh);
        }
        if (this.faceSpritesMesh !== null) {
            Scene.Map.current.scene.remove(this.faceSpritesMesh);
        }
        let i, l;
        for (i = 0, l = this.staticWallsList.length; i < l; i++) {
            Scene.Map.current.scene.remove(this.staticWallsList[i]);
        }
        for (let list of this.staticAutotilesList) {
            if (list) {
                for (let autotiles of list) {
                    Scene.Map.current.scene.remove(autotiles.mesh);
                }
            }
        }
        for (i = 0, l = this.staticMountainsList.length; i < l; i++) {
            Scene.Map.current.scene.remove(this.staticMountainsList[i]
                .mesh);
        }
        for (i = 0, l = this.staticObjects3DList.length; i < l; i++) {
            Scene.Map.current.scene.remove(this.staticObjects3DList[i]);
        }
        // Objects
        for (i = 0, l = this.objectsList.length; i < l; i++) {
            this.objectsList[i].removeFromScene();
        }
        // Remove moved objects from the scene
        let datas = Game.current.getPortionDatas(Scene.Map.current.id, this.portion);
        let objects = datas.min;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].removeFromScene();
        }
        objects = datas.mout;
        for (i = 0, l = objects.length; i < l; i++) {
            objects[i].removeFromScene();
        }
    }
    /**
     *  Search for the object with the ID.
     *  @param {Record<string, any>} json - Json object describing the objects
     *  @param {number} id - The ID of the object
     *  @returns {MapObject}
    */
    getObjFromID(json, id) {
        if (json.objs && json.objs.list) {
            json = json.objs.list;
        }
        else {
            return null;
        }
        let jsonObject, position, jsonObjectValue, object, localPosition, mapObject;
        for (let i = 0, l = json.length; i < l; i++) {
            jsonObject = json[i];
            position = Position.createFromArray(jsonObject.k);
            jsonObjectValue = jsonObject.v;
            object = new System.MapObject;
            if (jsonObjectValue.id === id) {
                object.read(jsonObjectValue);
                localPosition = position.toVector3();
                mapObject = new MapObject(object, localPosition);
                mapObject.changeState();
                return mapObject;
            }
        }
        return null;
    }
    /**
     *  Get hero model.
     *  @param {Record<string, any>} json - Json object describing the objects
     *  @returns {MapObject}
     */
    getHeroModel(json) {
        let obj = json.objs;
        if (!obj) {
            Platform.showErrorMessage("Your hero object seems to be in a non existing map. Please use define as hero in a map to correct it.");
        }
        json = json.objs.list;
        let jsonObject, position, jsonObjectValue, object;
        for (let i = 0, l = json.length; i < l; i++) {
            jsonObject = json[i];
            position = Position.createFromArray(jsonObject.k);
            jsonObjectValue = jsonObject.v;
            if (Datas.Systems.ID_OBJECT_START_HERO === jsonObjectValue.id) {
                object = new System.MapObject(jsonObjectValue);
                return new MapObject(object, position.toVector3(), true);
            }
        }
        throw "Impossible to get the hero. Please delete your hero from the map and define it again.";
    }
    /**
     *  Update the face sprites orientation.
     *  @param {number} angle - The angle on the Y axis
     */
    updateFaceSprites(angle) {
        let i, l;
        for (i = 0, l = this.objectsList.length; i < l; i++) {
            this.objectsList[i].update(angle);
        }
    }
    /**
     *  Update the collision sprite.
     *  @param {StructMapElementCollision[]} collisions - The collisions objects
     *  @param {Position} position - The json position of the sprite
     */
    updateCollisionSprite(collisions, position) {
        let i, l, a, b, c, z, objCollision, positionPlus;
        for (i = 0, l = collisions.length; i < l; i++) {
            objCollision = collisions[i];
            for (a = -objCollision.w; a <= objCollision.w; a++) {
                for (b = -objCollision.h; b <= objCollision.h; b++) {
                    z = objCollision.k ? 0 : objCollision.w;
                    for (c = -z; c <= z; c++) {
                        positionPlus = new Position(position.x + a, position.y +
                            b, position.z + c);
                        if (Scene.Map.current.isInMap(positionPlus) && this
                            .isPositionIn(positionPlus)) {
                            this.boundingBoxesSprites[positionPlus.toIndex()]
                                .push(objCollision);
                        }
                    }
                }
            }
        }
    }
    /** Update the collision sprite
     *  @param {Record<string, any>[]} boundingBoxes - The bounding boxes list to update
     *  @param {StructMapElementCollision[]} collisions - The collisions objects
     *  @param {Position} position - The json position of the sprite
     *  @param {boolean} side - Indicate if collision side
    */
    updateCollision(boundingBoxes, collisions, position, side) {
        let i, l, objCollision, centeredPosition, minW, maxW, minH, maxH, minD, maxD, a, b, c, positionPlus, objCollisionPlus;
        for (i = 0, l = collisions.length; i < l; i++) {
            objCollision = collisions[i];
            centeredPosition = objCollision.c ? new Position(position.x + Math
                .ceil(objCollision.c.x / Datas.Systems.SQUARE_SIZE), position.y
                + Math.ceil(objCollision.c.y / Datas.Systems.SQUARE_SIZE), position.z + Math.ceil(objCollision.c.z / Datas.Systems
                .SQUARE_SIZE)) : new Position(position.x, position.y, position.z);
            minW = -objCollision.m;
            maxW = objCollision.m;
            minH = -objCollision.m;
            maxH = objCollision.m;
            minD = -objCollision.m;
            maxD = objCollision.m;
            for (a = minW; a <= maxW; a++) {
                for (b = minH; b <= maxH; b++) {
                    for (c = minD; c <= maxD; c++) {
                        positionPlus = new Position(centeredPosition.x + a, centeredPosition.y + b, centeredPosition.z + c);
                        if (Scene.Map.current.isInMap(positionPlus) &&
                            this.isPositionIn(positionPlus)) {
                            if (side) {
                                objCollisionPlus = {};
                                objCollisionPlus = Object.assign(objCollisionPlus, objCollision);
                                objCollisionPlus.left = a < 0;
                                objCollisionPlus.right = a > 0;
                                objCollisionPlus.top = c < 0;
                                objCollisionPlus.bot = c > 0;
                            }
                            else {
                                objCollisionPlus = objCollision;
                            }
                            boundingBoxes[positionPlus.toIndex()].push(objCollisionPlus);
                        }
                    }
                }
            }
        }
    }
    /**
     *  Get the object collision according to position.
     *  @param {Position} positionSource - The source json position
     *  @param {Position} positionTarget - The target json position
     *  @param {ElementMapKind} kind - The element map kind
     *  @returns {StructMapElementCollision[]}
     */
    getObjectCollisionAt(positionSource, positionTarget, kind) {
        let result = new Array;
        switch (kind) {
            case ElementMapKind.Mountains:
                let a = positionTarget.x - positionSource.x;
                let c = positionTarget.z - positionSource.z;
                let collisions = this.boundingBoxesMountains[positionSource
                    .toIndex()];
                let w, objCollision;
                for (let i = 0, l = collisions.length; i < l; i++) {
                    w = collisions[i].w;
                    if (a >= -w && a <= w && c >= -w && c <= w) {
                        objCollision = {};
                        objCollision = Object.assign(objCollision, collisions[i]);
                        objCollision.left = a < 0;
                        objCollision.right = a > 0;
                        objCollision.top = c < 0;
                        objCollision.bot = c > 0;
                        objCollision.a = a;
                        result.push(objCollision);
                    }
                }
                break;
            default:
                break;
        }
        return result;
    }
    /**
     *  Add a position to non empty.
     *  @param {Position} position - The position to add
     */
    addToNonEmpty(position) {
        this.squareNonEmpty[position.x % Constants.PORTION_SIZE][position.z %
            Constants.PORTION_SIZE].push(position.getTotalY());
    }
    /**
     *  Check if position if in this map portion.
     *  @param {Position} position - The position to check
     *  @returns {boolean}
    */
    isPositionIn(position) {
        return this.portion.x === Math.floor(position.x / Constants.PORTION_SIZE) && this.portion.y === Math.floor(position.y / Constants
            .PORTION_SIZE) && this.portion.z === Math.floor(position.z /
            Constants.PORTION_SIZE);
    }
}
export { MapPortion };
