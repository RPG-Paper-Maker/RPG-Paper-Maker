import { Base } from "./Base.js";
import { MapObject, Position } from "../Core/index.js";
/** @class
 *  A detection of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  detection
 */
declare class Detection extends Base {
    boxes: [Position, number, number, number, number, number, number][];
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the detection.
     *  @param {Record<string, any>} - json Json object describing the detection
     */
    read(json: Record<string, any>): void;
    /**
     *  Check the collision between sender and object.
     *  @param {MapObject} sender - The object that sent test collision
     *  @param {MapObject} object - The object to test the collision
     *  @returns {boolean}
     */
    checkCollision(sender: MapObject, object: MapObject): boolean;
    /**
     *  Get the sender bounding box.
     *  @param {MapObject} sender - The object that sent test collision
     *  @returns {number[][]}
     */
    getBoundingBoxes(sender: MapObject): number[][];
}
export { Detection };
