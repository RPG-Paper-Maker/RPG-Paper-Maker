import { Enum } from "../Common/index.js";
import ElementMapKind = Enum.ElementMapKind;
import { Position } from "./Position.js";
import { CollisionSquare } from "./CollisionSquare.js";
import { Vector3 } from "./Vector3.js";
interface StructMapElementCollision {
    b?: number[];
    p?: Position;
    l?: Vector3;
    c?: Vector3;
    cs?: CollisionSquare;
    w?: number;
    h?: number;
    d?: number;
    rw?: number;
    rh?: number;
    m?: number;
    t?: MapElement;
    k?: boolean;
    left?: boolean;
    right?: boolean;
    top?: boolean;
    bot?: boolean;
    a?: number;
    id?: number;
}
/** @class
 *  An element in the map.
 */
declare class MapElement {
    static readonly COEF_TEX = 0.2;
    xOffset: number;
    yOffset: number;
    zOffset: number;
    front: boolean;
    constructor();
    /**
     *  Read the JSON associated to the map element.
     *  @param {Record<string, any>} json - Json object describing the map element
     */
    read(json: Record<string, any>): void;
    /**
     *  Scale the vertices correctly.
     *  @param {Vector3} vecA - The A vertex to rotate
     *  @param {Vector3} vecB - The B vertex to rotate
     *  @param {Vector3} vecC - The C vertex to rotate
     *  @param {Vector3} vecD - The D vertex to rotate
     *  @param {Vector3} center - The center to rotate around
     *  @param {Position} position - The json position
     *  @param {Vector3} size - The scale size
     *  @param {ElementMapKind} kind - The element map kind
     */
    scale(vecA: Vector3, vecB: Vector3, vecC: Vector3, vecD: Vector3, center: Vector3, position: Position, size: Vector3, kind: ElementMapKind): void;
}
export { StructMapElementCollision, MapElement };
