/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from '../Globals.js';
import { MapObject } from './MapObject.js';
import { Position } from './Position.js';
import { System, Datas, Manager, Scene } from '../index.js';
import { Constants, Enum, Platform, Utils } from '../Common/index.js';
import { Floor } from './Floor.js';
import { Autotiles } from './Autotiles.js';
import { Autotile } from './Autotile.js';
import { Sprite } from './Sprite.js';
var ElementMapKind = Enum.ElementMapKind;
var ShapeKind = Enum.ShapeKind;
import { SpriteWall } from './SpriteWall.js';
import { Mountains } from './Mountains.js';
import { Mountain } from './Mountain.js';
import { Object3DBox } from './Object3DBox.js';
import { Object3DCustom } from './Object3DCustom.js';
import { Game } from './Game.js';
import { CustomGeometry } from './CustomGeometry.js';
import { CustomGeometryFace } from './CustomGeometryFace.js';
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
        this.squareNonEmpty = new Array(Constants.PORTION_SIZE * Constants.PORTION_SIZE);
        let i, j;
        for (i = 0; i < Constants.PORTION_SIZE; i++) {
            this.squareNonEmpty[i] = new Array(Constants.PORTION_SIZE);
            for (j = 0; j < Constants.PORTION_SIZE; j++) {
                this.squareNonEmpty[i][j] = new Array();
            }
        }
        let l = Constants.PORTION_SIZE * Constants.PORTION_SIZE * Constants.PORTION_SIZE;
        this.boundingBoxesLands = new Array(l);
        this.boundingBoxesSprites = new Array(l);
        this.boundingBoxesMountains = new Array(l);
        this.boundingBoxesObjects3D = new Array(l);
        for (i = 0; i < l; i++) {
            this.boundingBoxesLands[i] = new Array();
            this.boundingBoxesSprites[i] = new Array();
            this.boundingBoxesMountains[i] = new Array();
            this.boundingBoxesObjects3D[i] = new Array();
        }
        this.staticAutotilesList = new Array();
        this.staticMountainsList = new Map();
        this.objectsList = new Array();
        this.staticWallsList = new Array();
        this.staticObjects3DList = new Array();
        this.overflowMountains = new Array();
        this.heroID = -1;
    }
    /**
     *  Read the JSON associated to the map portion.
     *  @param {Record<string, any>} json - object describing the map portion
     *  @param {boolean} isMapHero - Indicates if this map is where the hero is
     *  at the beginning of the game.
     */
    async read(json, isMapHero) {
        await this.readStatic(json);
        await this.readObjects(json.objs, isMapHero);
    }
    /**
     *  Read the JSON associated to the map portion, but only the static part.
     *  @param {Record<string, any>} json - object describing the map portion
     */
    async readStatic(json) {
        await this.readLands(json.lands);
        await this.readSprites(json);
        if (json.moun) {
            await this.readMountains(json.moun);
        }
        if (json.objs3d) {
            await this.readObjects3D(json.objs3d);
        }
    }
    /**
     *  Read the JSON associated to the lands in the portion.
     *  @param {Record<string, any>} json - object describing the lands
     */
    async readLands(json) {
        if (!json) {
            return;
        }
        const material = Scene.Map.current.textureTileset;
        let texture = Manager.GL.getMaterialTexture(material);
        let width = texture ? texture.image.width : 0;
        let height = texture ? texture.image.height : 0;
        let geometry = new CustomGeometry();
        let layers = [];
        let count = 0;
        for (const { k, v } of json) {
            const position = Position.createFromArray(k);
            const layer = position.layer;
            switch (v.k) {
                case Enum.ElementMapKind.Floors:
                    const floor = new Floor(v);
                    if (layer > 0) {
                        let j = 0;
                        let m = layers.length;
                        for (; j < m; j++) {
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
                        const objCollision = floor.updateGeometry(geometry, position, width, height, count);
                        this.boundingBoxesLands[position.toIndex()].push(objCollision);
                        this.addToNonEmpty(position);
                        count++;
                    }
                    break;
                case Enum.ElementMapKind.Autotiles:
                    const autotile = new Autotile(v);
                    let pictureID = Game.current.textures.autotiles[autotile.autotileID];
                    if (pictureID === undefined) {
                        pictureID = Datas.SpecialElements.getAutotile(autotile.autotileID).pictureID;
                    }
                    const indexPos = position.toIndex();
                    let texture = null;
                    const texturesAutotile = await Datas.SpecialElements.loadAutotileTexture(autotile.autotileID);
                    let autotiles;
                    if (texturesAutotile) {
                        for (let j = 0, m = texturesAutotile.length; j < m; j++) {
                            const textureAutotile = texturesAutotile[j];
                            if (textureAutotile.isInTexture(pictureID, autotile.texture)) {
                                texture = textureAutotile;
                                if (!this.staticAutotilesList[autotile.autotileID]) {
                                    this.staticAutotilesList[autotile.autotileID] = [];
                                }
                                if (!this.staticAutotilesList[autotile.autotileID][j]) {
                                    this.staticAutotilesList[autotile.autotileID][j] = new Autotiles(textureAutotile);
                                }
                                autotiles = this.staticAutotilesList[autotile.autotileID][j];
                                break;
                            }
                        }
                    }
                    if (texture !== null && texture.material !== null) {
                        const objCollision = autotiles.updateGeometry(position, autotile, pictureID);
                        if (objCollision !== null) {
                            this.boundingBoxesLands[indexPos].push(objCollision);
                        }
                    }
                    this.addToNonEmpty(position);
                    break;
            }
        }
        // Draw layers separatly
        for (let i = 0, l = layers.length; i < l; i++) {
            const position = layers[i][0];
            const floor = layers[i][1];
            const objCollision = floor.updateGeometry(geometry, position, width, height, count);
            const index = position.toIndex();
            if (objCollision !== null) {
                this.boundingBoxesLands[index].push(objCollision);
            }
            this.addToNonEmpty(position);
            count++;
        }
        // Creating the plane
        if (!geometry.isEmpty()) {
            geometry.updateAttributes();
            this.staticFloorsMesh = new THREE.Mesh(geometry, material);
            this.staticFloorsMesh.renderOrder = 0;
            if (Scene.Map.current.mapProperties.isSunLight) {
                this.staticFloorsMesh.receiveShadow = true;
                this.staticFloorsMesh.castShadow = true;
                this.staticFloorsMesh.customDepthMaterial = material.userData.customDepthMaterial;
            }
            Scene.Map.current.scene.add(this.staticFloorsMesh);
        }
        for (let list of this.staticAutotilesList) {
            if (list) {
                for (const autotiles of list) {
                    if (autotiles && autotiles.createMesh()) {
                        if (Scene.Map.current.mapProperties.isSunLight) {
                            autotiles.mesh.receiveShadow = true;
                            autotiles.mesh.castShadow = true;
                            autotiles.mesh.customDepthMaterial = autotiles.bundle.material.userData.customDepthMaterial;
                        }
                        Scene.Map.current.scene.add(autotiles.mesh);
                    }
                }
            }
        }
    }
    /**
     *  Read the JSON associated to the sprites in the portion.
     *  @param {Record<string, any>} json - Json object describing the sprites
     */
    async readSprites(json) {
        await this.readSpritesWalls(json.walls);
        this.readSpritesGlobals(json.sprites);
    }
    /** Read the JSON associated to the sprites globals in the portion.
     *  @param {Record<string, any>} json - Json object describing the sprites globals
     */
    readSpritesGlobals(json) {
        const material = Scene.Map.current.textureTileset;
        let staticGeometry = new CustomGeometry();
        let faceGeometry = new CustomGeometryFace();
        let staticCount = 0, faceCount = 0;
        let texture = Manager.GL.getMaterialTexture(material);
        if (texture) {
            let s, position, sprite, localPosition, collisions, resultUpdate;
            for (let i = 0, l = json.length; i < l; i++) {
                s = json[i];
                position = Position.createFromArray(s.k);
                sprite = new Sprite(s.v);
                localPosition = position.toVector3();
                if (sprite.kind === ElementMapKind.SpritesFace) {
                    resultUpdate = sprite.updateGeometry(faceGeometry, texture.image.width, texture.image.height, position, faceCount, true, localPosition);
                    faceCount = resultUpdate[0];
                    collisions = resultUpdate[1];
                }
                else {
                    resultUpdate = sprite.updateGeometry(staticGeometry, texture.image.width, texture.image.height, position, staticCount, true, localPosition);
                    staticCount = resultUpdate[0];
                    collisions = resultUpdate[1];
                }
                position.x += sprite.xOffset;
                position.y += sprite.yOffset;
                position.z += sprite.zOffset;
                this.updateCollisionSprite(collisions, position);
            }
        }
        if (!staticGeometry.isEmpty()) {
            staticGeometry.updateAttributes();
            this.staticSpritesMesh = new THREE.Mesh(staticGeometry, material);
            this.staticSpritesMesh.renderOrder = 999;
            if (Scene.Map.current.mapProperties.isSunLight) {
                this.staticSpritesMesh.receiveShadow = true;
                this.staticSpritesMesh.castShadow = true;
                this.staticSpritesMesh.customDepthMaterial = material.userData.customDepthMaterial;
            }
            Scene.Map.current.scene.add(this.staticSpritesMesh);
        }
        if (!faceGeometry.isEmpty()) {
            faceGeometry.updateAttributes();
            this.faceSpritesMesh = new THREE.Mesh(faceGeometry, material);
            this.faceSpritesMesh.renderOrder = 999;
            if (Scene.Map.current.mapProperties.isSunLight) {
                this.faceSpritesMesh.castShadow = true;
                this.faceSpritesMesh.receiveShadow = true;
                this.faceSpritesMesh.customDepthMaterial = material.userData.customDepthMaterial;
            }
            Scene.Map.current.scene.add(this.faceSpritesMesh);
        }
    }
    /**
     *  Read the JSON associated to the sprites walls in the portion.
     *  @param {Record<string, any>} json - Json object describing the sprites
     *  walls
     */
    async readSpritesWalls(json) {
        let hash = new Map();
        for (const { k, v } of json) {
            const position = Position.createFromArray(k);
            const sprite = new SpriteWall(v);
            let pictureID = Game.current.textures.walls[sprite.id];
            if (pictureID === undefined) {
                pictureID = Datas.SpecialElements.getWall(sprite.id).pictureID;
            }
            // Constructing the geometry
            let obj = hash[sprite.id];
            // If ID exists in this tileset
            if (obj !== undefined) {
                let material;
                let geometry;
                let count;
                if (obj === null) {
                    material = await Datas.SpecialElements.loadWallTexture(sprite.id);
                    if (material) {
                        geometry = new CustomGeometry();
                        count = 0;
                        obj = {
                            geometry: geometry,
                            material: material,
                            c: count,
                        };
                        hash[sprite.id] = obj;
                    }
                }
                else {
                    geometry = obj.geometry;
                    material = obj.material;
                    count = obj.c;
                }
                const texture = Manager.GL.getMaterialTexture(material);
                if (texture) {
                    const result = sprite.updateGeometry(geometry, position, texture.image.width, texture.image.height, pictureID, count);
                    obj.c = result[0];
                    this.updateCollisionSprite(result[1], position);
                }
            }
        }
        // Add to scene
        for (const [, obj] of hash) {
            if (obj !== null) {
                const geometry = obj.geometry;
                if (!geometry.isEmpty()) {
                    geometry.updateAttributes();
                    const mesh = new THREE.Mesh(geometry, obj.material);
                    if (Scene.Map.current.mapProperties.isSunLight) {
                        mesh.receiveShadow = true;
                        mesh.castShadow = true;
                        mesh.customDepthMaterial = obj.material.userData.customDepthMaterial;
                    }
                    mesh.layers.enable(1);
                    this.staticWallsList.push(mesh);
                    Scene.Map.current.scene.add(mesh);
                }
            }
        }
    }
    /**
     *  Read the JSON associated to the mountains in the portion.
     *  @param {Record<string, any>} json - Json object describing the mountains
     */
    async readMountains(json) {
        if (!json) {
            return;
        }
        for (const { k, v } of json) {
            const position = Position.createFromArray(k);
            const mountain = new Mountain();
            mountain.read(v);
            let pictureID = Game.current.textures.mountains[mountain.mountainID];
            if (pictureID === undefined) {
                pictureID = Datas.SpecialElements.getMountain(mountain.mountainID).pictureID;
            }
            const textureMountain = await Datas.SpecialElements.loadMountainTexture(mountain.mountainID);
            let mountains;
            let texture = null;
            if (textureMountain) {
                if (textureMountain.isInTexture(pictureID)) {
                    texture = textureMountain;
                    if (!this.staticMountainsList[mountain.mountainID]) {
                        this.staticMountainsList[mountain.mountainID] = new Mountains(textureMountain);
                    }
                    mountains = this.staticMountainsList[mountain.mountainID];
                    break;
                }
            }
            if (texture !== null && texture.material !== null) {
                const objCollision = mountains.updateGeometry(position, mountain, pictureID);
                this.updateCollision(this.boundingBoxesMountains, objCollision, position, true);
            }
        }
        // Update all the geometry uvs and put it in the scene
        for (const [, mountains] of this.staticMountainsList) {
            if (mountains.createMesh()) {
                if (Scene.Map.current.mapProperties.isSunLight) {
                    mountains.mesh.receiveShadow = true;
                    mountains.mesh.castShadow = true;
                    mountains.mesh.customDepthMaterial = mountains.bundle.material.userData.customDepthMaterial;
                }
                mountains.mesh.layers.enable(1);
                Scene.Map.current.scene.add(mountains.mesh);
            }
        }
    }
    /**
     *  Read the JSON associated to the objects 3D in the portion.
     *  @param {Record<string, any>} json - Json object describing the objects 3D
     */
    async readObjects3D(json) {
        const hash = new Map();
        for (const { k, v } of json) {
            const position = Position.createFromArray(k);
            const datas = Datas.SpecialElements.getObject3D(v.did);
            let pictureID = Game.current.textures.objects3D[datas.id];
            if (pictureID === undefined) {
                pictureID = Datas.SpecialElements.getObject3D(datas.id).pictureID;
            }
            if (datas) {
                let obj3D;
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
                let obj = hash[datas.id];
                if (!Utils.isUndefined(obj)) {
                    let material;
                    let geometry;
                    let count;
                    if (obj === null) {
                        material = await Datas.SpecialElements.loadObject3DTexture(datas.id);
                        if (material) {
                            geometry = new CustomGeometry();
                            count = 0;
                            obj = {
                                geometry: geometry,
                                material: material,
                                c: count,
                            };
                            hash[datas.id] = obj;
                        }
                    }
                    else {
                        geometry = obj.geometry;
                        material = obj.material;
                        count = obj.c;
                    }
                    if (Manager.GL.getMaterialTexture(material)) {
                        const result = obj3D.updateGeometry(geometry, position, count);
                        obj.c = result[0];
                        this.updateCollision(this.boundingBoxesObjects3D, result[1], position, datas.shapeKind === ShapeKind.Custom);
                    }
                }
            }
        }
        // Add meshes
        for (const [, obj] of hash) {
            if (obj !== null) {
                const geometry = obj.geometry;
                if (!geometry.isEmpty()) {
                    geometry.updateAttributes();
                    const mesh = new THREE.Mesh(geometry, obj.material);
                    this.staticObjects3DList.push(mesh);
                    mesh.renderOrder = 999;
                    if (Scene.Map.current.mapProperties.isSunLight) {
                        mesh.receiveShadow = true;
                        mesh.castShadow = true;
                        mesh.customDepthMaterial = obj.material.userData.customDepthMaterial;
                    }
                    mesh.layers.enable(1);
                    Scene.Map.current.scene.add(mesh);
                }
            }
        }
    }
    /**
     *  Read the JSON associated to the objects in the portion.
     *  @param {Record<string, any>} json - Json object describing the objects
     *  @param {boolean} isMapHero - Indicates if this map is where the hero is
     *  at the beginning of the game
     */
    async readObjects(json, isMapHero) {
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
            if ((!isMapHero || Datas.Systems.ID_OBJECT_START_HERO !== object.id) && index === -1) {
                localPosition = position.toVector3();
                mapObject = new MapObject(object, localPosition);
                await mapObject.changeState();
                this.objectsList.push(mapObject);
            }
            else {
                this.heroID = object.id;
            }
        }
        // Add moved objects to the scene
        if (!Scene.Map.current.isBattleMap) {
            // Not in battle to avoid issues if same map as current map
            let objects = datas.min;
            for (i = 0, l = objects.length; i < l; i++) {
                await objects[i].changeState();
                objects[i].addToScene();
            }
            objects = datas.mout;
            for (i = 0, l = objects.length; i < l; i++) {
                await objects[i].changeState();
                objects[i].addToScene();
            }
        }
    }
    /**
     *  Remove all the static stuff from the scene.
     */
    cleanStatic() {
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
        this.staticWallsList = [];
        for (let list of this.staticAutotilesList) {
            if (list) {
                for (let autotiles of list) {
                    Scene.Map.current.scene.remove(autotiles.mesh);
                }
            }
        }
        this.staticAutotilesList = [];
        for (const [, mountains] of this.staticMountainsList) {
            Scene.Map.current.scene.remove(mountains.mesh);
        }
        this.staticMountainsList.clear();
        for (i = 0, l = this.staticObjects3DList.length; i < l; i++) {
            Scene.Map.current.scene.remove(this.staticObjects3DList[i]);
        }
        this.staticObjects3DList = [];
    }
    /**
     *  Remove all the objects from the scene.
     */
    cleanAll() {
        // Static stuff
        this.cleanStatic();
        // Objects
        let i, l;
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
        if (json.objs) {
            json = json.objs;
        }
        else {
            return null;
        }
        let jsonObject, position, jsonObjectValue, object, localPosition, mapObject;
        for (let i = 0, l = json.length; i < l; i++) {
            jsonObject = json[i];
            position = Position.createFromArray(jsonObject.k);
            jsonObjectValue = jsonObject.v;
            object = new System.MapObject();
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
        json = json.objs;
        if (!json) {
            Platform.showErrorMessage('Your hero object seems to be in a non existing map. Please use define as hero in a map to correct it.');
        }
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
        throw 'Impossible to get the hero. Please delete your hero from the map and define it again.';
    }
    /**
     *  Update the face sprites orientation.
     *  @param {number} angle - The angle on the Y axis
     */
    updateFaceSprites(angle) {
        if (this.faceSpritesMesh) {
            this.faceSpritesMesh.geometry.rotate(angle, Sprite.Y_AXIS);
        }
        for (let object of this.objectsList) {
            object.update(angle);
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
                        positionPlus = new Position(position.x + a, position.y + b, position.z + c);
                        if (Scene.Map.current.isInMap(positionPlus) && this.isPositionIn(positionPlus)) {
                            this.boundingBoxesSprites[positionPlus.toIndex()].push(objCollision);
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
            centeredPosition = objCollision.c
                ? new Position(position.x + Math.ceil(objCollision.c.x / Datas.Systems.SQUARE_SIZE), position.y + Math.ceil(objCollision.c.y / Datas.Systems.SQUARE_SIZE), position.z + Math.ceil(objCollision.c.z / Datas.Systems.SQUARE_SIZE))
                : new Position(position.x, position.y, position.z);
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
                        if (Scene.Map.current.isInMap(positionPlus) && this.isPositionIn(positionPlus)) {
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
        let result = new Array();
        switch (kind) {
            case ElementMapKind.Mountains:
                let a = positionTarget.x - positionSource.x;
                let c = positionTarget.z - positionSource.z;
                let collisions = this.boundingBoxesMountains[positionSource.toIndex()];
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
        this.squareNonEmpty[position.x % Constants.PORTION_SIZE][position.z % Constants.PORTION_SIZE].push(position.getTotalY());
    }
    /**
     *  Check if position if in this map portion.
     *  @param {Position} position - The position to check
     *  @returns {boolean}
     */
    isPositionIn(position) {
        return (this.portion.x === Math.floor(position.x / Constants.PORTION_SIZE) &&
            this.portion.y === Math.floor(position.y / Constants.PORTION_SIZE) &&
            this.portion.z === Math.floor(position.z / Constants.PORTION_SIZE));
    }
}
export { MapPortion };
