import { SpecialElement } from './SpecialElement.js';
import { Enum } from '../Common/index.js';
import ShapeKind = Enum.ShapeKind;
import ObjectCollisionKind = Enum.ObjectCollisionKind;
import { System } from '../index.js';
import { Vector3 } from '../Core/index.js';
/** @class
 *  A 3D object of the game.
 *  @extends System.SpecialElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  object 3D
 */
declare class Object3D extends SpecialElement {
    id: number;
    shapeKind: ShapeKind;
    objID: number;
    mtlID: number;
    collisionKind: ObjectCollisionKind;
    collisionCustomID: number;
    scale: number;
    widthSquare: number;
    widthPixel: number;
    heightSquare: number;
    heightPixel: number;
    depthSquare: number;
    depthPixel: number;
    stretch: boolean;
    isTopLeft: boolean;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the object 3D.
     *  @param {Record<string, any>} - json Json object describing the object 3D
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the width in pixels.
     *  @returns {number}
     */
    widthPixels(): number;
    /**
     *  Get the height in pixels.
     *  @returns {number}
     */
    heightPixels(): number;
    /**
     *  Get the depth in pixels.
     *  @returns {number}
     */
    depthPixels(): number;
    /**
     *  Get the width in squares.
     *  @returns {number}
     */
    width(): number;
    /**
     *  Get the height in squares.
     *  @returns {number}
     */
    height(): number;
    /**
     *  Get the depth in squares.
     *  @returns {number}
     */
    depth(): number;
    /**
     *  Get the size vector.
     *  @returns {Vector3}
     */
    getSizeVector(): Vector3;
    /**
     *  Get the shape obj.
     *  @returns {System.Shape}
     */
    getObj(): System.Shape;
    /**
     *  Get the collision shape obj.
     *  @returns {System.Shape}
     */
    getCollisionObj(): System.Shape;
}
export { Object3D };
