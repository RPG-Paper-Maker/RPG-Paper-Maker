/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "../index.js";
import { Enum } from "../Common/index.js";
var CustomShapeKind = Enum.CustomShapeKind;
var ObjectCollisionKind = Enum.ObjectCollisionKind;
import { Sprite } from "./Sprite.js";
import { Object3D } from "./Object3D.js";
import { Vector3 } from "./Vector3.js";
import { CustomGeometry } from "./CustomGeometry.js";
/** @class
 *  A 3D object custom in the map.
 *  @extends Object3D
 *  @param {Record<string, any>} json - Json object describing the object 3D custom
 *  @param {System.Object3D} datas - The System object 3D
 */
class Object3DCustom extends Object3D {
    constructor(json, datas) {
        super();
        this.datas = datas;
        if (json) {
            this.read(json);
        }
    }
    /**
     *  Create a new 3D object box.
     *  @static
     *  @param {System.Object3D} datas - The object datas
     *  @returns {Core.Object3DBox}
     */
    static create(datas) {
        let object = new Object3DCustom(undefined, datas);
        object.id = datas.id;
        return object;
    }
    /**
     *  Read the JSON associated to the object 3D custom.
     *  @param {Record<string, any>} json - Json object describing the object 3D
     *  custom
     */
    read(json) {
        super.read(json);
        this.id = this.datas.id;
    }
    /**
     *  Get the center vector.
     *  @returns {Vector3}
     */
    getCenterVector() {
        return Datas.Shapes.get(Enum.CustomShapeKind.OBJ, this.datas.objID)
            .geometry.center.clone();
    }
    /**
     *  Update the geometry of a group of objects 3D cutom with the same
     *  material.
     *  @param {Core.CustomGeometry} geometry - Geometry of the object 3D custom
     *  @param {Position} position - The position of the object 3D custom
     *  @param {number} count - The faces count
     *  @return {any[]}
    */
    updateGeometry(geometry, position, count) {
        let localPosition = position.toVector3();
        let modelGeometry = Datas.Shapes.get(CustomShapeKind.OBJ, this
            .datas.objID).geometry;
        let vertices = modelGeometry.vertices;
        let uvs = modelGeometry.uvs;
        let center = modelGeometry.center.clone();
        let scale = this.datas.scale;
        let scaleVec = new Vector3(scale * position.scaleX, scale * position
            .scaleY, scale * position.scaleZ);
        let angleY = position.angleY;
        let angleX = position.angleX;
        let angleZ = position.angleZ;
        let vecA, vecB, vecC;
        for (let i = 0, l = modelGeometry.vertices.length; i < l; i += 3) {
            vecA = vertices[i].clone();
            vecB = vertices[i + 1].clone();
            vecC = vertices[i + 2].clone();
            vecA.multiply(scaleVec);
            vecB.multiply(scaleVec);
            vecC.multiply(scaleVec);
            if (angleY !== 0.0) {
                Sprite.rotateVertex(vecA, center, angleY, Sprite.Y_AXIS);
                Sprite.rotateVertex(vecB, center, angleY, Sprite.Y_AXIS);
                Sprite.rotateVertex(vecC, center, angleY, Sprite.Y_AXIS);
            }
            if (angleX !== 0.0) {
                Sprite.rotateVertex(vecA, center, angleX, Sprite.X_AXIS);
                Sprite.rotateVertex(vecB, center, angleX, Sprite.X_AXIS);
                Sprite.rotateVertex(vecC, center, angleX, Sprite.X_AXIS);
            }
            if (angleZ !== 0.0) {
                Sprite.rotateVertex(vecA, center, angleZ, Sprite.Z_AXIS);
                Sprite.rotateVertex(vecB, center, angleZ, Sprite.Z_AXIS);
                Sprite.rotateVertex(vecC, center, angleZ, Sprite.Z_AXIS);
            }
            vecA.add(localPosition);
            vecB.add(localPosition);
            vecC.add(localPosition);
            geometry.pushTriangleVertices(vecA, vecB, vecC);
            geometry.pushTriangleIndices(count);
            geometry.pushTriangleUVs(uvs[i].clone(), uvs[i + 1].clone(), uvs[i
                + 2].clone());
            count += 3;
        }
        // Collisions
        let objCollision = new Array;
        if (this.datas.collisionKind === ObjectCollisionKind.Simplified) {
            let obj = this.datas.getObj().geometry;
            let w = obj.w * scale * position.scaleX;
            let h = obj.h * scale * position.scaleY;
            let d = obj.d * scale * position.scaleZ;
            let minPos = obj.minVertex.clone();
            minPos.multiply(scaleVec);
            objCollision.push({
                p: position,
                l: localPosition,
                b: [
                    localPosition.x + minPos.x + (w / 2),
                    localPosition.y + minPos.y + (h / 2),
                    localPosition.z + minPos.z + (d / 2),
                    w,
                    h,
                    d,
                    angleY,
                    angleX,
                    angleZ
                ],
                c: center,
                w: Math.ceil(w / 2 / Datas.Systems.SQUARE_SIZE),
                h: Math.ceil(h / 2 / Datas.Systems.SQUARE_SIZE),
                d: Math.ceil(d / 2 / Datas.Systems.SQUARE_SIZE),
                m: Math.max(Math.max(Math.ceil(w / 2 / Datas.Systems.SQUARE_SIZE), Math.ceil(h / 2 / Datas.Systems.SQUARE_SIZE)), Math.ceil(d / 2 / Datas.Systems.SQUARE_SIZE)),
                k: true
            });
        }
        else if (this.datas.collisionKind === ObjectCollisionKind.Custom) {
            let obj = Datas.Shapes.get(CustomShapeKind.Collisions, this.datas
                .collisionCustomID).geometry;
            let w = obj.w * scale * position.scaleX;
            let h = obj.h * scale * position.scaleY;
            let d = obj.d * scale * position.scaleZ;
            let minPos = obj.minVertex.clone();
            minPos.multiply(scaleVec);
            objCollision.push({
                id: this.datas.collisionCustomID,
                p: position,
                l: localPosition,
                b: [
                    localPosition.x + minPos.x + (w / 2),
                    localPosition.y + minPos.y + (h / 2),
                    localPosition.z + minPos.z + (d / 2),
                    w,
                    h,
                    d,
                    angleY,
                    angleX,
                    angleZ
                ],
                c: center,
                w: Math.ceil(w / 2 / Datas.Systems.SQUARE_SIZE),
                h: Math.ceil(h / 2 / Datas.Systems.SQUARE_SIZE),
                d: Math.ceil(d / 2 / Datas.Systems.SQUARE_SIZE),
                m: Math.max(Math.max(Math.ceil(w / 2 / Datas.Systems.SQUARE_SIZE), Math.ceil(h / 2 / Datas.Systems.SQUARE_SIZE)), Math.ceil(d / 2 / Datas.Systems.SQUARE_SIZE)),
                k: true
            });
        }
        return [count, objCollision];
    }
    /**
     *  Create a new geometry.
     *  @param {Position} position - The position of object 3D
     *  @return {[Core.CustomGeometry, [number, StructMapElementCollision[]]]}
     */
    createGeometry(position) {
        let geometry = new CustomGeometry();
        let collisions = this.updateGeometry(geometry, position, 0);
        geometry.updateAttributes();
        return [geometry, collisions];
    }
}
export { Object3DCustom };
