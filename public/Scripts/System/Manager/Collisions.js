/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Mathf, Constants, Enum } from '../Common/index.js';
import { MapObject, Position, Portion, Vector3, Vector2, Game, CustomGeometry, Sprite } from '../Core/index.js';
import { Datas, Scene, Manager } from '../index.js';
var ElementMapKind = Enum.ElementMapKind;
import { THREE } from '../Globals.js';
/** @class
 *  The collisions manager.
 *  @static
 */
class Collisions {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Initialize necessary collisions.
     *  @static
     */
    static initialize() {
        this.BB_BOX_DETECTION.geometry.boundingBox = new THREE.Box3();
    }
    /**
     *  Create a box for bounding box.
     *  @static
     *  @returns {THREE.Mesh}
     */
    static createBox(detection = false) {
        let box = new THREE.Mesh(CustomGeometry.createBox(1, 1, 1), detection ?
            this.BB_MATERIAL_DETECTION : this.BB_MATERIAL);
        box['previousTranslate'] = [0, 0, 0];
        box['previousRotate'] = [0, 0, 0];
        box['previousScale'] = [1, 1, 1];
        box['previousIsFix'] = false;
        box['previousCenter'] = 0;
        return box;
    }
    /**
     *  Create an oriented box for bounding box.
     *  @static
     *  @returns {THREE.Mesh}
     */
    static createOrientedBox() {
        let box = new THREE.Mesh(CustomGeometry.createBox(1, 1, 1), this
            .BB_MATERIAL);
        box['previousTranslate'] = [0, 0, 0];
        box['previousScale'] = [1, 1, 1];
        box.geometry.rotateY(Math.PI / 4);
        return box;
    }
    /**
     *  Apply transform for lands bounding box.
     *  @static
     *  @param {THREE.Mesh} box - The mesh bounding box
     *  @param {number[]} boundingBox - The bounding box list parameters
     */
    static applyBoxLandTransforms(box, boundingBox) {
        // Cancel previous geometry transforms
        box.geometry.translate(-box['previousTranslate'][0], -box['previousTranslate'][1], -box['previousTranslate'][2]);
        box.geometry.rotateZ(-box['previousRotate'][2] * Math.PI / 180.0);
        box.geometry.rotateX(-box['previousRotate'][1] * Math.PI / 180.0);
        box.geometry.rotateY(-box['previousRotate'][0] * Math.PI / 180.0);
        box.geometry.scale(1 / box['previousScale'][0], 1 / box['previousScale'][1], 1 / box['previousScale'][2]);
        // Update to the new ones
        box.geometry.scale(boundingBox[3], 1, boundingBox[4]);
        box.geometry.translate(boundingBox[0], boundingBox[1], boundingBox[2]);
        // Register previous transforms to current
        box['previousTranslate'] = [boundingBox[0], boundingBox[1], boundingBox[2]];
        box['previousRotate'] = [0, 0, 0];
        box['previousScale'] = [boundingBox[3], 1, boundingBox[4]];
        // Update geometry now
        box.updateMatrixWorld();
        // Compute bounding box manually
        if (box.geometry.boundingBox === null) {
            box.geometry.computeBoundingBox();
        }
    }
    /**
     *  Apply transform for sprite bounding box.
     *  @static
     *  @param {THREE.Mesh} box - The mesh bounding box
     *  @param {number[]} boundingBox - The bounding box list parameters
     */
    static applyBoxSpriteTransforms(box, boundingBox, isFixSprite = false, center = 0) {
        // Cancel previous geometry transforms
        box.geometry.translate(-box['previousTranslate'][0], -box['previousTranslate'][1] + box['previousCenter'], -box['previousTranslate'][2]);
        let geometry = box.geometry;
        if (box['previousIsFix'] && (box['previousRotate'][1] !== 0 || box['previousRotate'][2] !== 0)) {
            geometry.rotate(-box['previousRotate'][2], Sprite.Z_AXIS, new Vector3(0, box['previousCenter'], 0));
            geometry.rotate(-box['previousRotate'][1], Sprite.X_AXIS, new Vector3(0, box['previousCenter'], 0));
            geometry.rotate(-box['previousRotate'][0], Sprite.Y_AXIS, new Vector3(0, box['previousCenter'], 0));
        }
        else {
            box.geometry.rotateZ(-box['previousRotate'][2] * Math.PI / 180.0);
            box.geometry.rotateX(-box['previousRotate'][1] * Math.PI / 180.0);
            box.geometry.rotateY(-box['previousRotate'][0] * Math.PI / 180.0);
        }
        box.geometry.scale(1 / box['previousScale'][0], 1 / box['previousScale'][1], 1 / box['previousScale'][2]);
        // Update to the new ones
        box.geometry.scale(boundingBox[3], boundingBox[4], boundingBox[5]);
        if (isFixSprite && (boundingBox[7] !== 0 || boundingBox[8] !== 0)) {
            geometry.rotate(boundingBox[6], Sprite.Y_AXIS, new Vector3(0, center, 0));
            geometry.rotate(boundingBox[7], Sprite.X_AXIS, new Vector3(0, center, 0));
            geometry.rotate(boundingBox[8], Sprite.Z_AXIS, new Vector3(0, center, 0));
        }
        else {
            box.geometry.rotateY(boundingBox[6] * Math.PI / 180.0);
            box.geometry.rotateX(boundingBox[7] * Math.PI / 180.0);
            box.geometry.rotateZ(boundingBox[8] * Math.PI / 180.0);
        }
        box.geometry.translate(boundingBox[0], boundingBox[1] - center, boundingBox[2]);
        // Register previous transforms to current
        box['previousTranslate'] = [boundingBox[0], boundingBox[1], boundingBox[2]];
        box['previousRotate'] = [boundingBox[6], boundingBox[7], boundingBox[8]];
        box['previousScale'] = [boundingBox[3], boundingBox[4], boundingBox[5]];
        box['previousIsFix'] = isFixSprite;
        box['previousCenter'] = center;
        // Update geometry now
        box.updateMatrixWorld();
        // Compute bounding box manually
        if (box.geometry.boundingBox === null) {
            box.geometry.computeBoundingBox();
        }
    }
    /**
     *  Apply transform for oriented bounding box.
     *  @static
     *  @param {THREE.Mesh} box - The mesh bounding box
     *  @param {number[]} boundingBox - The bounding box list parameters
     */
    static applyOrientedBoxTransforms(box, boundingBox) {
        let size = Math.floor(boundingBox[3] / Math.sqrt(2));
        // Cancel previous geometry transforms
        box.geometry.translate(-box['previousTranslate'][0], -box['previousTranslate'][1], -box['previousTranslate'][2]);
        box.geometry.rotateY(-Math.PI / 4);
        box.geometry.scale(1 / box['previousScale'][0], 1 / box['previousScale'][1], 1 / box['previousScale'][2]);
        // Update to the new ones
        box.geometry.scale(size, boundingBox[4], size);
        box.geometry.rotateY(Math.PI / 4);
        box.geometry.translate(boundingBox[0], boundingBox[1], boundingBox[2]);
        // Register previous transforms to current
        box['previousTranslate'] = [boundingBox[0], boundingBox[1], boundingBox[2]];
        box['previousScale'] = [size, boundingBox[4], size];
        // Update geometry now
        box.updateMatrixWorld();
        // Compute bounding box manually
        if (box.geometry.boundingBox === null) {
            box.geometry.computeBoundingBox();
        }
    }
    /**
     *  Get a bounding box mesh for detection. Keep the same existing one or
     *  force creating a new one for cases you need several.
     *  @static
     *  @param {number} [force=false]
     *  @returns {THREE.Mesh}
     */
    static getBBBoxDetection(force = false) {
        if (Datas.Systems.showBB && !force) {
            let box = Collisions.createBox(true);
            this.BB_BOX_DETECTION = box;
            box.geometry.boundingBox = new THREE.Box3();
            Scene.Map.current.scene.add(box);
            setTimeout(() => {
                Scene.Map.current.scene.remove(box);
            }, 1);
        }
        return this.BB_BOX_DETECTION;
    }
    /**
     *  Indicate if min and max are overlapping.
     *  @static
     *  @param {number} minA
     *  @param {number} maxA
     *  @param {number} minB
     *  @param {number} maxB
     *  @returns {boolean}
     */
    static isOverlapping(minA, maxA, minB, maxB) {
        let minOverlap = null;
        let maxOverlap = null;
        // If B contain in A
        if (minA <= minB && minB <= maxA) {
            if (minOverlap === null || minB < minOverlap) {
                minOverlap = minB;
            }
        }
        if (minA <= maxB && maxB <= maxA) {
            if (maxOverlap === null || maxB > minOverlap) {
                maxOverlap = maxB;
            }
        }
        // If A contain in B
        if (minB <= minA && minA <= maxB) {
            if (minOverlap === null || minA < minOverlap) {
                minOverlap = minA;
            }
        }
        if (minB <= maxA && maxA <= maxB) {
            if (maxOverlap === null || maxA > minOverlap) {
                maxOverlap = maxA;
            }
        }
        return (minOverlap !== null && maxOverlap !== null);
    }
    /**
     *  Check collision between two OBB.
     *  @static
     *  @param {Core.CustomGeometry} shapeA - First shape
     *  @param {Core.CustomGeometry} shapeB - Second shape
     *  @param {boolean} deepCheck - if false, only check bounding box
     *  @returns {boolean}
     */
    static obbVSobb(shapeA, shapeB, deepCheck = true) {
        const bbIntersect = shapeA.boundingBox.intersectsBox(shapeB.boundingBox);
        if (!deepCheck && bbIntersect) {
            return true;
        }
        if (!bbIntersect) {
            return false;
        }
        let facesA = shapeA.getNormals();
        let facesB = shapeB.getNormals();
        let verticesA = shapeA.getVertices();
        let verticesB = shapeB.getVertices();
        let lA = verticesA.length;
        let lB = verticesB.length;
        if (!this.checkNormals(facesA, verticesA, verticesB, lA, lB)) {
            return false;
        }
        if (!this.checkNormals(facesB, verticesA, verticesB, lA, lB)) {
            return false;
        }
        return true;
    }
    /**
     *  Check the fnormals for OBB collision.
     *  @static
     *  @param {ArrayLike<number>} normals - The normals to check
     *  @param {Vector3[]} verticesA - First vertices to check
     *  @param {Vector3[]} verticesB - Second vertices to check
     *  @param {number} lA - The first vertices length
     *  @param {number} lB - The second vertices length
     *  @returns {boolean}
     */
    static checkNormals(normals, verticesA, verticesB, lA, lB) {
        for (let i = 0, l = normals.length; i < l; i += 3) {
            if (!this.overlapOnThisNormal(verticesA, verticesB, lA, lB, new Vector3(normals[i], normals[i + 1], normals[i + 2]))) {
                return false;
            }
        }
        return true;
    }
    /**
     *  Check if vertices overlap on one of the faces normal.
     *  @static
     *  @param {ArrayLike<number>} verticesA - First vertices to check
     *  @param {ArrayLike<number>} verticesB - Second vertices to check
     *  @param {number} lA - The first vertices length
     *  @param {number} lB - The second vertices length
     *  @param {Core.Vector3} normal - The face normal
     *  @returns {boolean}
     */
    static overlapOnThisNormal(verticesA, verticesB, lA, lB, normal) {
        // We test each vertex of A
        let minA = null;
        let maxA = null;
        let i, vertex, buffer;
        for (i = 0; i < lA; i += 3) {
            vertex = new Vector3(verticesA[i], verticesA[i + 1], verticesA[i + 2]);
            buffer = Mathf.orthogonalProjection(vertex, normal);
            if (minA === null || buffer < minA) {
                minA = buffer;
            }
            if (maxA === null || buffer > maxA) {
                maxA = buffer;
            }
        }
        // We test each vertex of B
        let minB = null;
        let maxB = null;
        for (i = 0; i < lB; i += 3) {
            vertex = new Vector3(verticesB[i], verticesB[i + 1], verticesB[i + 2]);
            buffer = Mathf.orthogonalProjection(vertex, normal);
            if (minB === null || buffer < minB) {
                minB = buffer;
            }
            if (maxB === null || buffer > maxB) {
                maxB = buffer;
            }
        }
        // We test if there is overlaping
        return this.isOverlapping(minA, maxA, minB, maxB);
    }
    /**
     *  Check collision ray.
     *  @static
     *  @param {Vector3} positionBefore - The position before collision
     *  @param {Vector3} positionAfter - The position after collision
     *  @param {MapObject} object - The map object to test collision
     *  @returns {boolean}
     */
    static checkRay(positionBefore, positionAfter, object, bbSettings, reverseTestObjects = false) {
        let direction = new Vector3();
        direction.subVectors(positionAfter, positionBefore).normalize();
        let jpositionBefore = Position.createFromVector3(positionBefore);
        let jpositionAfter = Position.createFromVector3(positionAfter);
        let positionBeforePlus = new Vector3();
        let positionAfterPlus = new Vector3();
        let testedCollisions = [];
        let yMountain = null;
        // Squares to inspect according to the direction of the object
        let [startI, endI, startJ, endJ, startK, endK] = object.getSquaresBB();
        // Test objects
        if (reverseTestObjects) {
            let result = this.checkObjectsRay(positionAfter, object);
            if (result !== null) {
                return result;
            }
        }
        // Check collision outside
        let block = false;
        let i, j, k, i2, j2, k2, portion, mapPortion, result;
        for (i = startI; i <= endI; i++) {
            for (j = startJ; j <= endJ; j++) {
                for (k = startK; k <= endK; k++) {
                    positionAfterPlus.set(positionAfter.x + i * Datas.Systems
                        .SQUARE_SIZE, positionAfter.y + j * Datas.Systems
                        .SQUARE_SIZE, positionAfter.z + k * Datas.Systems
                        .SQUARE_SIZE);
                    portion = Scene.Map.current.getLocalPortion(Portion
                        .createFromVector3(positionAfterPlus));
                    mapPortion = Scene.Map.current.getMapPortionFromPortion(portion);
                    if (mapPortion) {
                        result = this.check(mapPortion, jpositionBefore, new Position(jpositionAfter.x + i, jpositionAfter
                            .y + j, jpositionAfter.z + k), positionAfter, object, direction, testedCollisions);
                        if (result[0] === null) {
                            // If not already climbing, be sure that the before position can colide with climbling sprite
                            if (!object.isClimbing) {
                                object.updateMeshBBPosition(object.currentBoundingBox, bbSettings, positionBefore);
                                for (i2 = startI; i2 <= endI; i2++) {
                                    for (j2 = startJ; j2 <= endJ; j2++) {
                                        for (k2 = startK; k2 <= endK; k2++) {
                                            positionBeforePlus.set(positionBefore.x + i2 * Datas.Systems
                                                .SQUARE_SIZE, positionBefore.y + j2 * Datas.Systems
                                                .SQUARE_SIZE, positionBefore.z + k2 * Datas.Systems
                                                .SQUARE_SIZE);
                                            portion = Scene.Map.current.getLocalPortion(Portion.createFromVector3(positionBeforePlus));
                                            mapPortion = Scene.Map.current.getMapPortionFromPortion(portion);
                                            if (mapPortion) {
                                                let [b, y] = this.checkSprites(mapPortion, new Position(jpositionBefore.x + i2, jpositionBefore
                                                    .y + j2, jpositionBefore.z + k2), [], object);
                                                // If before and after collides, get up!
                                                if (b === null) {
                                                    object.updateMeshBBPosition(object.currentBoundingBox, bbSettings, positionAfter);
                                                    return [null, y, result[2]];
                                                }
                                            }
                                        }
                                    }
                                }
                                object.updateMeshBBPosition(object.currentBoundingBox, bbSettings, positionAfter);
                                return [false, null, Enum.Orientation.None];
                            }
                            return [result[0], result[1], result[2]];
                        }
                        if (result[0]) {
                            block = true;
                        }
                        if (result[1] !== null) {
                            if (yMountain === null || yMountain < result[1]) {
                                yMountain = result[1];
                            }
                        }
                    }
                }
            }
        }
        if (block && (yMountain === null)) {
            return [true, null, Enum.Orientation.None];
        }
        // Test objects
        if (!reverseTestObjects) {
            let result = this.checkObjectsRay(positionAfter, object);
            if (result !== null) {
                return result;
            }
        }
        // Check empty square or square mountain height possible down
        portion = Scene.Map.current.getLocalPortion(Portion.createFromVector3(positionAfter));
        mapPortion = Scene.Map.current.getMapPortionFromPortion(portion);
        let floors;
        if (mapPortion) {
            floors = mapPortion.squareNonEmpty[jpositionAfter.x % Constants
                .PORTION_SIZE][jpositionAfter.z % Constants.PORTION_SIZE];
            let otherMapPortion = Scene.Map.current.getMapPortion(portion.x, portion.y + 1, portion.z);
            if (otherMapPortion) {
                floors = floors.concat(otherMapPortion.squareNonEmpty[jpositionAfter
                    .x % Constants.PORTION_SIZE][jpositionAfter.z % Constants
                    .PORTION_SIZE]);
            }
            if (yMountain === null && floors.indexOf(positionAfter.y) === -1) {
                let l = floors.length;
                if (l === 0) {
                    return [true, null, Enum.Orientation.None];
                }
                else {
                    let maxY = null;
                    let limitY = positionAfter.y - Datas.Systems
                        .mountainCollisionHeight.getValue();
                    let temp;
                    for (i = 0; i < l; i++) {
                        temp = floors[i];
                        if (temp <= (positionAfter.y + Datas.Systems
                            .mountainCollisionHeight.getValue()) && temp >=
                            limitY) {
                            if (maxY === null) {
                                maxY = temp;
                            }
                            else {
                                if (maxY < temp) {
                                    maxY = temp;
                                }
                            }
                        }
                    }
                    if (maxY === null) {
                        // redo with before pos for going down two following height angled
                        portion = Scene.Map.current.getLocalPortion(Portion.createFromVector3(positionBefore));
                        mapPortion = Scene.Map.current.getMapPortionFromPortion(portion);
                        if (mapPortion) {
                            floors = mapPortion.squareNonEmpty[jpositionBefore.x % Constants
                                .PORTION_SIZE][jpositionBefore.z % Constants.PORTION_SIZE];
                            let otherMapPortion = Scene.Map.current.getMapPortion(portion.x, portion.y + 1, portion.z);
                            if (otherMapPortion) {
                                floors = floors.concat(otherMapPortion.squareNonEmpty[jpositionBefore.x %
                                    Constants.PORTION_SIZE][jpositionBefore.z % Constants
                                    .PORTION_SIZE]);
                            }
                            if (yMountain === null && floors.indexOf(positionBefore.y) === -1) {
                                let l = floors.length;
                                if (l === 0) {
                                    return [null, null, Enum.Orientation.None];
                                }
                                else {
                                    let maxY = null;
                                    let limitY = positionBefore.y - Datas.Systems
                                        .mountainCollisionHeight.getValue();
                                    let temp;
                                    for (i = 0; i < l; i++) {
                                        temp = floors[i];
                                        if (temp <= (positionBefore.y + Datas.Systems
                                            .mountainCollisionHeight.getValue()) && temp >=
                                            limitY) {
                                            if (maxY === null) {
                                                maxY = temp;
                                            }
                                            else {
                                                if (maxY < temp) {
                                                    maxY = temp;
                                                }
                                            }
                                        }
                                    }
                                    if (maxY === null) {
                                        if (object.orientation === object.previousOrientation) {
                                            // If non empty square on front of object, then force move front
                                            let positionFront = positionBefore.clone();
                                            switch (object.orientationEye) {
                                                case Enum.Orientation.North:
                                                    positionFront.setZ(positionFront.z - (Datas.Systems.SQUARE_SIZE / 2));
                                                    break;
                                                case Enum.Orientation.South:
                                                    positionFront.setZ(positionFront.z + (Datas.Systems.SQUARE_SIZE / 2));
                                                    break;
                                                case Enum.Orientation.West:
                                                    positionFront.setX(positionFront.x - (Datas.Systems.SQUARE_SIZE / 2));
                                                    break;
                                                case Enum.Orientation.East:
                                                    positionFront.setX(positionFront.x + (Datas.Systems.SQUARE_SIZE / 2));
                                                    break;
                                            }
                                            portion = Scene.Map.current.getLocalPortion(Portion.createFromVector3(positionFront));
                                            mapPortion = Scene.Map.current.getMapPortionFromPortion(portion);
                                            if (mapPortion) {
                                                floors = mapPortion.squareNonEmpty[Math.floor(positionFront.x / Datas.Systems.SQUARE_SIZE) % Constants.PORTION_SIZE][Math.floor(positionFront.z / Datas.Systems.SQUARE_SIZE) % Constants.PORTION_SIZE];
                                                if (floors.length > 0) {
                                                    for (let y of floors) {
                                                        if (y === positionFront.y) {
                                                            return [false, null, Enum.Orientation.None];
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        // Check if climbing stuff in 1 px bottom
                                        const positionBottom = positionBefore.clone();
                                        positionBottom.setY(positionBottom.y - 1);
                                        for (i = startI; i <= endI; i++) {
                                            for (j = startJ; j <= endJ; j++) {
                                                for (k = startK; k <= endK; k++) {
                                                    positionBeforePlus.set(positionBefore.x + i * Datas.Systems
                                                        .SQUARE_SIZE, (positionBefore.y + j * Datas.Systems
                                                        .SQUARE_SIZE) - 1, positionBefore.z + k * Datas.Systems
                                                        .SQUARE_SIZE);
                                                    portion = Scene.Map.current.getLocalPortion(Portion.createFromVector3(positionBeforePlus));
                                                    mapPortion = Scene.Map.current.getMapPortionFromPortion(portion);
                                                    if (mapPortion) {
                                                        const jpositionBottom = Position.createFromVector3(positionBeforePlus);
                                                        const climbingUp = object.isClimbingUp;
                                                        object.isClimbingUp = false;
                                                        object.updateMeshBBPosition(object.currentBoundingBox, bbSettings, positionBottom);
                                                        let [b, y, o] = this.checkSprites(mapPortion, jpositionBottom, [], object);
                                                        if (b === null) {
                                                            // Check if after moving the collision still occurs. If not, go down
                                                            const positionBottomAfter = positionAfter.clone();
                                                            positionBottomAfter.setY(positionBottomAfter.y - 1);
                                                            for (i2 = startI; i2 <= endI; i2++) {
                                                                for (j2 = startJ; j2 <= endJ; j2++) {
                                                                    for (k2 = startK; k2 <= endK; k2++) {
                                                                        positionAfterPlus.set(positionAfter.x + i2 * Datas.Systems
                                                                            .SQUARE_SIZE, (positionAfter.y + j2 * Datas.Systems
                                                                            .SQUARE_SIZE) - 1, positionAfter.z + k2 * Datas.Systems
                                                                            .SQUARE_SIZE);
                                                                        portion = Scene.Map.current.getLocalPortion(Portion.createFromVector3(positionAfterPlus));
                                                                        mapPortion = Scene.Map.current.getMapPortionFromPortion(portion);
                                                                        if (mapPortion) {
                                                                            const jpositionBottomAfter = Position.createFromVector3(positionAfterPlus);
                                                                            object.updateMeshBBPosition(object.currentBoundingBox, bbSettings, positionBottomAfter);
                                                                            b = this.checkSprites(mapPortion, jpositionBottomAfter, [], object)[0];
                                                                            if (b === null) {
                                                                                object.updateMeshBBPosition(object.currentBoundingBox, bbSettings, positionAfter);
                                                                                object.isClimbingUp = climbingUp;
                                                                                return [null, null, Enum.Orientation.None];
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            object.updateMeshBBPosition(object.currentBoundingBox, bbSettings, positionAfter);
                                                            object.isClimbingUp = climbingUp;
                                                            return [null, y, o];
                                                        }
                                                        object.updateMeshBBPosition(object.currentBoundingBox, bbSettings, positionAfter);
                                                        object.isClimbingUp = climbingUp;
                                                    }
                                                }
                                            }
                                        }
                                        return [true, null, Enum.Orientation.None];
                                    }
                                    else {
                                        yMountain = maxY;
                                    }
                                }
                            }
                        }
                    }
                    else {
                        yMountain = maxY;
                    }
                }
            }
            // Check lands inside collisions
            portion = Scene.Map.current.getLocalPortion(Portion.createFromVector3(positionBefore));
            mapPortion = Scene.Map.current.getMapPortionFromPortion(portion);
            return [this.checkLandsInside(mapPortion, jpositionBefore, jpositionAfter, direction), yMountain, Enum.Orientation.None];
        }
        return [true, null, Enum.Orientation.None];
    }
    static checkObjectsRay(positionAfter, object) {
        // Check collision inside & with other objects
        if (object !== Game.current.hero && object.checkCollisionObject(Game
            .current.hero)) {
            return [true, null, Enum.Orientation.None];
        }
        // Check objects collisions
        let portion = Scene.Map.current.getLocalPortion(Portion.createFromVector3(positionAfter));
        let i, j, mapPortion;
        for (i = 0; i < 2; i++) {
            for (j = 0; j < 2; j++) {
                mapPortion = Scene.Map.current.getMapPortion(portion.x + i, portion.y, portion.z + j);
                if (mapPortion && this.checkObjects(mapPortion, object)) {
                    return [true, null, Enum.Orientation.None];
                }
            }
        }
        return null;
    }
    /**
     *  Check if there is a collision at this position.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionBefore - The json position before collision
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {Vector3} positionAfter - The position after collision
     *  @param {MapObject} object - The map object collision test
     *  @param {Vector3} direction - The direction collision
     *  @param {StructMapElementCollision[]} testedCollisions - The object
     *  collisions that were already tested
     *  @returns {boolean}
     */
    static check(mapPortion, jpositionBefore, jpositionAfter, positionAfter, object, direction, testedCollisions) {
        // Check sprites and climbing
        let [isCollision, yMountain, o] = this.checkSprites(mapPortion, jpositionAfter, testedCollisions, object);
        // Climbing
        if (isCollision || yMountain !== null) {
            return [isCollision, yMountain, o];
        }
        // Check mountain collision first for elevation
        [isCollision, yMountain] = this.checkMountains(mapPortion, jpositionAfter, positionAfter, testedCollisions, object);
        if (isCollision) {
            return [isCollision, yMountain, Enum.Orientation.None];
        }
        // Check other tests
        return [(this.checkLands(mapPortion, jpositionBefore, jpositionAfter, object, direction, testedCollisions) || this.checkObjects3D(mapPortion, jpositionAfter, positionAfter, testedCollisions, object)),
            yMountain, Enum.Orientation.None];
    }
    /**
     *  Check if there is a collision with lands at this position.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionBefore - The json position before collision
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {MapObject} object - The map object collision test
     *  @param {Vector3} direction - The direction collision
     *  @param {StructMapElementCollision[]} testedCollisions - The object
     *  collisions that were already tested
     *  @returns {boolean}
     */
    static checkLands(mapPortion, jpositionBefore, jpositionAfter, object, direction, testedCollisions) {
        let index = jpositionAfter.toIndex();
        let lands = mapPortion.boundingBoxesLands[index];
        if (lands !== null) {
            let objCollision, boundingBox, collision;
            for (let i = 0, l = lands.length; i < l; i++) {
                objCollision = lands[i];
                if (testedCollisions.indexOf(objCollision) === -1) {
                    testedCollisions.push(objCollision);
                    if (objCollision !== null) {
                        boundingBox = objCollision.b;
                        collision = objCollision.cs;
                        if (this.checkIntersectionLand(collision, boundingBox, object) || this.checkDirections(jpositionBefore, jpositionAfter, collision, boundingBox, direction, object)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    /**
     *  Check if there is a collision with lands with directions.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionBefore - The json position before collision
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {Vector3} direction - The direction collision
     *  @returns {boolean}
    */
    static checkLandsInside(mapPortion, jpositionBefore, jpositionAfter, direction) {
        let lands = mapPortion.boundingBoxesLands[jpositionBefore.toIndex()];
        if (lands !== null) {
            let objCollision, collision;
            for (let i = 0, l = lands.length; i < l; i++) {
                objCollision = lands[i];
                if (objCollision !== null) {
                    collision = objCollision.cs;
                    if (this.checkDirectionsInside(jpositionBefore, jpositionAfter, collision, direction)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     *  Check intersection between ray and an object.
     *  @static
     *  @param {StructMapElementCollision} collision - The collision object
     *  @param {number[]} boundingBox - The bounding box values
     *  @param {MapObject} object - The map object to check
     *  @returns {boolean}
    */
    static checkIntersectionLand(collision, boundingBox, object) {
        if (collision !== null) {
            return false;
        }
        this.applyBoxLandTransforms(this.BB_BOX, boundingBox);
        return this.obbVSobb(object.currentBoundingBox.geometry, this.BB_BOX.geometry);
    }
    /**
     *  Check directions
     *  @static
     *  @param {Position} jpositionBefore - The json position before collision
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {StructMapElementCollision} collision - The collision object
     *  @param {number[]} boundingBox - The bounding box values
     *  @param {Vector3} direction - The direction collision
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
    */
    static checkDirections(jpositionBefore, jpositionAfter, collision, boundingBox, direction, object) {
        if (collision === null) {
            return false;
        }
        if (!jpositionBefore.equals(jpositionAfter)) {
            if (this.checkIntersectionLand(null, boundingBox, object)) {
                if (direction.x > 0) {
                    return !collision.left;
                }
                if (direction.x < 0) {
                    return !collision.right;
                }
                if (direction.z > 0) {
                    return !collision.top;
                }
                if (direction.z < 0) {
                    return !collision.bot;
                }
            }
        }
        return false;
    }
    /**
     *  Check directions inside.
     *  @static
     *  @param {Position} jpositionBefore - The json position before collision
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {StructMapElementCollision} collision - The collision object
     *  @param {Vector3} direction - The direction collision
     *  @returns {boolean}
    */
    static checkDirectionsInside(jpositionBefore, jpositionAfter, collision, direction) {
        if (collision === null) {
            return false;
        }
        if (!jpositionBefore.equals(jpositionAfter)) {
            if (direction.x > 0) {
                return !collision.right;
            }
            if (direction.x < 0) {
                return !collision.left;
            }
            if (direction.z > 0) {
                return !collision.bot;
            }
            if (direction.z < 0) {
                return !collision.top;
            }
        }
        return false;
    }
    /**
     *  Check if there is a collision with sprites at this position.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {StructMapElementCollision[]} testedCollisions - The object
     *  collisions that were already tested
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
    */
    static checkSprites(mapPortion, jpositionAfter, testedCollisions, object) {
        let sprites = mapPortion.boundingBoxesSprites[jpositionAfter.toIndex()];
        let tested = false;
        if (sprites !== null) {
            let objCollision;
            for (let i = 0, l = sprites.length; i < l; i++) {
                objCollision = sprites[i];
                if (testedCollisions.indexOf(objCollision) === -1) {
                    testedCollisions.push(objCollision);
                    if (this.checkIntersectionSprite(objCollision.b, objCollision.k, object)) {
                        if (objCollision.cl) {
                            const speed = object.speed.getValue() * MapObject
                                .SPEED_NORMAL * Manager.Stack.averageElapsedTime *
                                Datas.Systems.SQUARE_SIZE * Datas.Systems.climbingSpeed.getValue();
                            const limitTop = objCollision.b[1] + Math.ceil(objCollision.b[4] / 2);
                            const limitBot = objCollision.b[1] - Math.ceil(objCollision.b[4] / 2);
                            const y = object.isClimbingUp ? Math.min(object.position.y + speed, limitTop) : Math.max(object.position.y - speed, limitBot);
                            if (y === object.position.y) {
                                continue;
                            }
                            let angle = objCollision.b[6];
                            let force = false, front = false;
                            if (angle === 0 || angle === 180) {
                                force = true;
                                front = true;
                            }
                            else if (angle === 90 || angle === 270) {
                                force = true;
                            }
                            return [null, y, object.getOrientationBetweenPosition(objCollision.l, force, front)];
                        }
                        if (!object.isClimbing) {
                            tested = true;
                        }
                    }
                }
            }
        }
        return [tested, null, Enum.Orientation.None];
    }
    /**
     *  Check intersection between ray and an object.
     *  @static
     *  @param {number[]} boundingBox - The bounding box values
     *  @param {boolean} fix - Indicate if the sprite is fix or not
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
    */
    static checkIntersectionSprite(boundingBox, fix, object) {
        if (boundingBox === null) {
            return false;
        }
        if (fix) {
            this.applyBoxSpriteTransforms(this.BB_BOX, boundingBox, true);
            return this.obbVSobb(object.currentBoundingBox
                .geometry, this.BB_BOX.geometry);
        }
        else {
            this.applyOrientedBoxTransforms(this.BB_ORIENTED_BOX, boundingBox);
            return this.obbVSobb(object.currentBoundingBox
                .geometry, this.BB_ORIENTED_BOX.geometry);
        }
    }
    /**
     *  Check if there is a collision with sprites at this position.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {THREE.Vector3} positionAfter - The position after collision
     *  @param {StructMapElementCollision[]} testedCollisions - The object
     *  collisions that were already tested
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
    */
    static checkObjects3D(mapPortion, jpositionAfter, positionAfter, testedCollisions, object) {
        let objects3D = mapPortion.boundingBoxesObjects3D[jpositionAfter.toIndex()];
        if (objects3D !== null) {
            let objCollision;
            for (let i = 0, l = objects3D.length; i < l; i++) {
                objCollision = objects3D[i];
                if (testedCollisions.indexOf(objCollision) === -1) {
                    testedCollisions.push(objCollision);
                    if (objCollision.id) {
                        if (this.checkCustomObject3D(objCollision, object, positionAfter)) {
                            return true;
                        }
                    }
                    else {
                        if (this.checkIntersectionSprite(objCollision.b, objCollision.k, object)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    /**
     *  Check if there is a collision with custom object 3D collision.
     *  @static
     *  @param {StructMapElementCollision} objCollision - The object colision
     *  info to test
     *  @param {MapObject} object - The map object collision test
     *  @param {THREE.Vector3} positionAfter - The position after collision
     *  @returns {boolean}
    */
    static checkCustomObject3D(objCollision, object, positionAfter) {
        // Remove previous
        let mesh = Datas.Shapes.get(Enum.CustomShapeKind.Collisions, objCollision.id).mesh;
        if (mesh !== this.currentCustomObject3D) {
            Scene.Map.current.scene.remove(this.currentCustomObject3D);
            this.currentCustomObject3D = mesh;
        }
        if (this.currentCustomObject3D) {
            this.currentCustomObject3D.position.set(objCollision.l.x, objCollision.l.y, objCollision.l.z);
            this.currentCustomObject3D.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), objCollision.b[6]);
            this.currentCustomObject3D.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), objCollision.b[7]);
            this.currentCustomObject3D.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), objCollision.b[8]);
            Scene.Map.current.scene.add(this.currentCustomObject3D);
            if (Datas.Systems.showBB) {
                this.currentCustomObject3D.material = this.BB_MATERIAL;
            }
            else {
                this.currentCustomObject3D.material = this.BB_EMPTY_MATERIAL;
            }
            let direction = positionAfter.clone().sub(object.position).normalize();
            if (this.checkIntersectionMeshes(object.currentBoundingBox, this
                .currentCustomObject3D, direction)) {
                return true;
            }
        }
        return false;
    }
    /**
     *  Check intersection between two complex meshes.
     *  @static
     *  @param {THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>} meshA - The first mesh
     *  @param {THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>} meshB - The second mesh
     *  @param {THREE.Vector3} direction - The meshA direction to mesh B
     *  @returns {boolean}
    */
    static checkIntersectionMeshes(meshA, meshB, direction) {
        let vertices = meshA.geometry.getVerticesVectors();
        let raycaster = new THREE.Raycaster();
        let directionNegate = direction.clone().negate();
        let collisionResults;
        for (let vertex of vertices) {
            raycaster.set(vertex, direction);
            collisionResults = raycaster.intersectObject(meshB);
            if (collisionResults.length === 0) {
                raycaster.set(vertex, directionNegate);
                collisionResults = raycaster.intersectObject(meshB);
            }
            if (collisionResults.length > 0) {
                raycaster.set(collisionResults[0].point, new THREE.Vector3(1, 1, 1));
                const intersects = raycaster.intersectObject(meshA);
                if (intersects.length > 0) { // Points is in objet
                    return true;
                }
            }
        }
        return false;
    }
    /**
     *  Check if there is a collision with mountains at this position.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {Vector3} positionAfter - The position after collision
     *  @param {StructMapElementCollision[]} testedCollisions - The object collisions that were
     *  already tested
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
    */
    static checkMountains(mapPortion, jpositionAfter, positionAfter, testedCollisions, object) {
        let yMountain = null;
        let mountains = mapPortion.boundingBoxesMountains[jpositionAfter.toIndex()];
        let block = false;
        let i, l, result;
        if (mountains !== null) {
            for (i = 0, l = mountains.length; i < l; i++) {
                result = this.checkMountain(mapPortion, jpositionAfter, positionAfter, testedCollisions, object, mountains[i], yMountain, block);
                if (result[0]) {
                    return [result[1], result[2]];
                }
                else {
                    block = result[1];
                    yMountain = result[2];
                }
            }
        }
        let j, m, objCollision, position, mapPortionOverflow;
        for (i = 0, l = mapPortion.overflowMountains.length; i < l; i++) {
            position = mapPortion.overflowMountains[i];
            mapPortionOverflow = Scene.Map.current.getMapPortionFromPortion(Scene
                .Map.current.getLocalPortion(position.getGlobalPortion()));
            if (!mapPortionOverflow) {
                continue;
            }
            objCollision = mapPortionOverflow.getObjectCollisionAt(position, jpositionAfter, ElementMapKind.Mountains);
            for (j = 0, m = objCollision.length; j < m; j++) {
                result = this.checkMountain(mapPortion, jpositionAfter, positionAfter, testedCollisions, object, objCollision[j], yMountain, block);
                if (result[0]) {
                    return [result[1], result[2]];
                }
                else {
                    block = result[1];
                    yMountain = result[2];
                }
            }
        }
        return [block && (yMountain === null), yMountain];
    }
    /**
     *  Check if there is a collision with mountains at this position.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {Vector3} positionAfter - The position after collision
     *  @param {StructMapElementCollision[]} testedCollisions - The object
     *  collisions that were already tested
     *  @param {MapObject} object - The map object collision test
     *  @param {StructMapElementCollision} objCollision - The object collision
     *  @param {number} yMountain - The y mountain collision
     *  @param {boolean} block - The block mountain collision
     *  @returns {[boolean, boolean, number]}
    */
    static checkMountain(mapPortion, jpositionAfter, positionAfter, testedCollisions, object, objCollision, yMountain, block) {
        if (testedCollisions.indexOf(objCollision) === -1) {
            testedCollisions.push(objCollision);
            let result = this.checkIntersectionMountain(mapPortion, jpositionAfter, positionAfter, objCollision, object);
            if (result[0]) {
                if (result[1] === null) {
                    return [true, result[0], result[1]];
                }
                else {
                    block = true;
                }
            }
            else if (result[1] !== null) {
                if (yMountain === null || yMountain < result[1]) {
                    yMountain = result[1];
                }
            }
        }
        return [false, block, yMountain];
    }
    /**
     *  Check intersection with a mountain.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {Vector3} positionAfter - The position after collision
     *  @param {StructMapElementCollision} objCollision - The object collision
     *  @param {MapObject} object - The map object collision test
     *  @returns {[boolean, number]}
    */
    static checkIntersectionMountain(mapPortion, jpositionAfter, positionAfter, objCollision, object) {
        let mountain = objCollision.t;
        let forceAlways = mountain.getSystem().forceAlways();
        let forceNever = mountain.getSystem().forceNever();
        let point = new Vector2(positionAfter.x, positionAfter.z);
        let x = objCollision.l.x;
        let y = objCollision.l.y;
        let z = objCollision.l.z;
        let w = objCollision.rw;
        let h = objCollision.rh;
        // If not in the height, no test
        if (positionAfter.y < y || positionAfter.y > y + h) {
            return [false, null];
        }
        // if w = 0, check height
        if (objCollision.rw === 0) {
            let pass = forceNever || -(!forceAlways && ((y + h) <= (positionAfter
                .y + Datas.Systems.mountainCollisionHeight.getValue())));
            if (Mathf.isPointOnRectangle(point, x, x + Datas.Systems.SQUARE_SIZE, z, z + Datas.Systems.SQUARE_SIZE)) {
                return pass ? [false, (positionAfter.y - y - h) === 0 ? null : y + h] : [true, null];
            }
            else {
                if (!pass) {
                    // Collide with BB (avoiding use of checkIntersectionSprite here for perfs issues)
                    let vertices = object.currentBoundingBox.geometry.getVertices();
                    let vy = 0;
                    for (let i = 0, l = vertices.length; i < l; i += 3) {
                        vy = vertices[i + 1];
                        if (vy >= y && vy <= y + h) {
                            point = new Vector2(vertices[i], vertices[i + 2]);
                            if (Mathf.isPointOnRectangle(point, x, x + Datas.Systems
                                .SQUARE_SIZE, z, z + Datas.Systems.SQUARE_SIZE)) {
                                return [true, null];
                            }
                        }
                    }
                }
            }
        }
        else {
            // if w > 0, go like a slope
            // Get coplanar points according to side
            let ptA, ptB, ptC, pA, pB, pC;
            if (objCollision.left && !mountain.left) {
                if (objCollision.top && !mountain.top) {
                    ptA = new Vector2(x - w, z);
                    ptB = new Vector2(x, z);
                    ptC = new Vector2(x, z - w);
                    if (Mathf.isPointOnTriangle(point, ptA, ptB, ptC)) {
                        pA = new Vector3(ptA.x, y, ptA.y);
                        pB = new Vector3(ptB.x, y + h, ptB.y);
                        pC = new Vector3(ptC.x, y, ptC.y);
                    }
                    else {
                        return [false, null];
                    }
                }
                else if (objCollision.bot && !mountain.bot) {
                    ptA = new Vector2(x - w, z + Datas.Systems.SQUARE_SIZE);
                    ptB = new Vector2(x, z + Datas.Systems.SQUARE_SIZE);
                    ptC = new Vector2(x, z + Datas.Systems.SQUARE_SIZE + w);
                    if (Mathf.isPointOnTriangle(point, ptA, ptB, ptC)) {
                        pA = new Vector3(ptA.x, y, ptA.y);
                        pB = new Vector3(ptB.x, y + h, ptB.y);
                        pC = new Vector3(ptC.x, y, ptC.y);
                    }
                    else {
                        return [false, null];
                    }
                }
                else {
                    if (Mathf.isPointOnRectangle(point, x - w, x, z, z + Datas
                        .Systems.SQUARE_SIZE)) {
                        pA = new Vector3(x - w, y, z);
                        pB = new Vector3(x, y + h, z);
                        pC = new Vector3(x, y + h, z + Datas.Systems.SQUARE_SIZE);
                    }
                    else {
                        return [false, null];
                    }
                }
            }
            else if (objCollision.right && !mountain.right) {
                if (objCollision.top && !mountain.top) {
                    ptA = new Vector2(x + Datas.Systems.SQUARE_SIZE, z - w);
                    ptB = new Vector2(x + Datas.Systems.SQUARE_SIZE, z);
                    ptC = new Vector2(x + Datas.Systems.SQUARE_SIZE + w, z);
                    if (Mathf.isPointOnTriangle(point, ptA, ptB, ptC)) {
                        pA = new Vector3(ptA.x, y, ptA.y);
                        pB = new Vector3(ptB.x, y + h, ptB.y);
                        pC = new Vector3(ptC.x, y, ptC.y);
                    }
                    else {
                        return [false, null];
                    }
                }
                else if (objCollision.bot && !mountain.bot) {
                    ptA = new Vector2(x + Datas.Systems.SQUARE_SIZE, z +
                        Datas.Systems.SQUARE_SIZE + w);
                    ptB = new Vector2(x + Datas.Systems.SQUARE_SIZE, z +
                        Datas.Systems.SQUARE_SIZE);
                    ptC = new Vector2(x + Datas.Systems.SQUARE_SIZE + w, z
                        + Datas.Systems.SQUARE_SIZE);
                    if (Mathf.isPointOnTriangle(point, ptA, ptB, ptC)) {
                        pA = new Vector3(ptA.x, y, ptA.y);
                        pB = new Vector3(ptB.x, y + h, ptB.y);
                        pC = new Vector3(ptC.x, y, ptC.y);
                    }
                    else {
                        return [false, null];
                    }
                }
                else {
                    if (Mathf.isPointOnRectangle(point, x + Datas.Systems
                        .SQUARE_SIZE, x + Datas.Systems.SQUARE_SIZE + w, z, z +
                        Datas.Systems.SQUARE_SIZE)) {
                        pA = new Vector3(x + Datas.Systems.SQUARE_SIZE, y
                            + h, z + Datas.Systems.SQUARE_SIZE);
                        pB = new Vector3(x + Datas.Systems.SQUARE_SIZE, y
                            + h, z);
                        pC = new Vector3(x + Datas.Systems.SQUARE_SIZE + w, y, z);
                    }
                    else {
                        return [false, null];
                    }
                }
            }
            else {
                if (objCollision.top && !mountain.top) {
                    if (Mathf.isPointOnRectangle(point, x, x + Datas.Systems
                        .SQUARE_SIZE, z - w, z)) {
                        pA = new Vector3(x, y + h, z);
                        pB = new Vector3(x, y, z - w);
                        pC = new Vector3(x + Datas.Systems.SQUARE_SIZE, y, z - w);
                    }
                    else {
                        return [false, null];
                    }
                }
                else if (objCollision.bot && !mountain.bot) {
                    if (Mathf.isPointOnRectangle(point, x, x + Datas.Systems
                        .SQUARE_SIZE, z + Datas.Systems.SQUARE_SIZE, z + Datas
                        .Systems.SQUARE_SIZE + w)) {
                        pA = new Vector3(x + Datas.Systems.SQUARE_SIZE, y, z + Datas.Systems.SQUARE_SIZE + w);
                        pB = new Vector3(x, y, z + Datas.Systems
                            .SQUARE_SIZE + w);
                        pC = new Vector3(x, y + h, z + Datas.Systems
                            .SQUARE_SIZE);
                    }
                    else {
                        return [false, null];
                    }
                }
                else {
                    return [false, null];
                }
            }
            // Get the intersection point for updating mountain y
            let plane = new THREE.Plane();
            let ray = new THREE.Ray(new Vector3(positionAfter.x, y, positionAfter.z), new Vector3(0, 1, 0));
            let newPosition = new Vector3();
            plane.setFromCoplanarPoints(pA, pB, pC);
            ray.intersectPlane(plane, newPosition);
            // If going down, check if there's a blocking floor
            let jposition = (newPosition.y - positionAfter.y) < 0 ? new Position(Math.floor(positionAfter.x / Datas.Systems.SQUARE_SIZE), Math
                .ceil(positionAfter.y / Datas.Systems.SQUARE_SIZE), Math.floor(positionAfter.z / Datas.Systems.SQUARE_SIZE)) : jpositionAfter;
            mapPortion = Scene.Map.current.getMapPortionFromPortion(Scene.Map
                .current.getLocalPortion(jposition.getGlobalPortion()));
            let isFloor = mapPortion.boundingBoxesLands[jposition.toIndex()]
                .length > 0;
            if (isFloor && (newPosition.y - positionAfter.y) < 0) {
                return [false, null];
            }
            // If angle limit, block
            if (forceAlways || (!forceNever && mountain.angle > Datas.Systems
                .mountainCollisionAngle.getValue())) {
                // Check if floor existing on top of the mountain angle
                isFloor = jposition.y === jpositionAfter.y ? false :
                    mapPortion.boundingBoxesLands[jpositionAfter.toIndex()]
                        .length > 0;
                return [!isFloor, null];
            }
            return [!forceNever && (Math.abs(newPosition.y - positionAfter.y) >
                    Datas.Systems.mountainCollisionHeight.getValue()), newPosition.y];
        }
        return [false, null];
    }
    /**
     *  Check collision with objects.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
     */
    static checkObjects(mapPortion, object) {
        let datas = Scene.Map.current.getObjectsAtPortion(mapPortion.portion);
        return this.checkObjectsList(mapPortion.objectsList, object) || this
            .checkObjectsList(datas.min, object) || this.checkObjectsList(datas
            .mout, object);
    }
    /**
     *  Check collision with objects.
     *  @static
     *  @param {MapObject[]} list - The map objects list to test
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
    */
    static checkObjectsList(list, object) {
        let obj;
        for (let i = 0, l = list.length; i < l; i++) {
            obj = list[i];
            if (obj !== object) {
                if (object.checkCollisionObject(obj)) {
                    return true;
                }
            }
        }
        return false;
    }
}
Collisions.BB_MATERIAL = new THREE.MeshBasicMaterial();
Collisions.BB_MATERIAL_DETECTION = new THREE.MeshBasicMaterial();
Collisions.BB_EMPTY_MATERIAL = new THREE.MeshBasicMaterial({ visible: false });
Collisions.BB_BOX = Collisions.createBox();
Collisions.BB_ORIENTED_BOX = Collisions.createOrientedBox();
Collisions.BB_BOX_DETECTION = Collisions.createBox(true);
Collisions.BB_BOX_DEFAULT_DETECTION = Collisions.createBox(true);
Collisions.currentCustomObject3D = null;
export { Collisions };
