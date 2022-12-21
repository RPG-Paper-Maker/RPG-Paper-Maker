import { Base } from "./Base.js";
import { AnimationFrameElement } from "./AnimationFrameElement.js";
import { AnimationFrameEffect } from "./AnimationFrameEffect.js";
import { Enum } from "../Common/index.js";
import AnimationEffectConditionKind = Enum.AnimationEffectConditionKind;
import { Picture2D, Vector2 } from "../Core/index.js";
/** @class
 *  An animation frame.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the animation frame
 */
declare class AnimationFrame extends Base {
    elements: AnimationFrameElement[];
    effects: AnimationFrameEffect[];
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the animation frame.
     *  @param {Record<string, any>} - json Json object describing the animation
     *  frame
     */
    read(json: Record<string, any>): void;
    /**
     *  Play the sounds according to condition.
     *  @param {AnimationEffectConditionKind} condition - The condition
     */
    playSounds(condition: AnimationEffectConditionKind): void;
    /**
     *  Draw the animation frame.
     *  @param {Picture2D} picture - The picture associated to the animation
     *  @param {Vector2} position - The position on screen for animation
     *  @param {number} rows - The number of rows in the animation texture
     *  @param {number} cols - The number of columns in the animation texture
     */
    draw(picture: Picture2D, position: Vector2, rows: number, cols: number): void;
}
export { AnimationFrame };
