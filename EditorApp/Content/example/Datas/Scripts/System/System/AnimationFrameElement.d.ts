import { Base } from "./Base.js";
import { Picture2D, Vector2 } from "../Core/index.js";
/** @class
 *  An animation frame element.
 *  @extends System.Base
 *  @param {Record<string, any>}
 */
declare class AnimationFrameElement extends Base {
    x: number;
    y: number;
    texRow: number;
    texCol: number;
    zoom: number;
    angle: number;
    flip: boolean;
    opacity: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the animation frame element.
     *  @param {Record<string, any>} - json Json object describing the animation
     *  frame element
     */
    read(json: Record<string, any>): void;
    /**
     *  Draw the animation element.
     *  @param {Picture2D} picture - The picture associated to the animation
     *  @param {Vector2} position - The position on screen for animation
     *  @param {number} rows - The number of rows in the animation texture
     *  @param {number} cols - The number of columns in the animation texture
     */
    draw(picture: Picture2D, position: Vector2, rows: number, cols: number): void;
}
export { AnimationFrameElement };
