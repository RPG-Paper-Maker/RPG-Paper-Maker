import { StructMapElementCollision } from "./MapElement.js";
import { System, Core } from "../index.js";
import { Position } from "./Position.js";
import { Object3D } from "./Object3D.js";
import { Vector3 } from "./Vector3.js";
import { CustomGeometry } from "./CustomGeometry.js";
/**
 * A 3D object box in the map.
 *
 * @class Object3DBox
 * @extends {Object3D}
 */
declare class Object3DBox extends Object3D {
    static VERTICES: Core.Vector3[];
    static NB_VERTICES: number;
    static TEXTURES: number[][];
    static TEXTURES_VALUES: number[];
    static INDEXES: number[];
    id: number;
    datas: System.Object3D;
    constructor(json?: Record<string, any>, datas?: System.Object3D);
    /**
     *  Create a new 3D object box.
     *  @static
     *  @param {System.Object3D} datas - The object datas
     *  @returns {Core.Object3DBox}
     */
    static create(datas: System.Object3D): Object3DBox;
    /**
     *  Read the JSON associated to the object 3D box.
     *  @param {Record<string, any>} json - Json object describing the object 3D
     *  box
    */
    read(json: Record<string, any>): void;
    /**
     *  Get the center vector.
     *  @returns {Vector3}
     */
    getCenterVector(): Vector3;
    /**
     *  Update the geometry of a group of object 3D with the same material.
     *  @param {Core.CustomGeometry} geometry - Geometry of the object 3D
     *  @param {Position} position - The position of object 3D
     *  @param {number} count - The faces count
     *  @return {number[]}
    */
    updateGeometry(geometry: CustomGeometry, position: Position, count: number): [number, StructMapElementCollision[]];
    /**
     *  Create a new geometry.
     *  @param {Position} position - The position of object 3D
     *  @return {[Core.CustomGeometry, [number, StructMapElementCollision[]]]}
    */
    createGeometry(position: Position): [
        CustomGeometry,
        [
            number,
            StructMapElementCollision[]
        ]
    ];
}
export { Object3DBox };
