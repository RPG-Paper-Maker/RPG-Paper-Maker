import { Enum } from "../Common/index.js";
import AnimationEffectConditionKind = Enum.AnimationEffectConditionKind;
import { Base } from "./Base.js";
import { AnimationFrame } from "./AnimationFrame.js";
import { Picture2D, Battler } from "../Core/index.js";
/** @class
 *  An animation of a skill / item / weapon or for display animation command.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  animation
 */
declare class Animation extends Base {
    pictureID: number;
    positionKind: number;
    frames: AnimationFrame[];
    rows: number;
    cols: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the animation
     *  @param {Record<string, any>} - json Json object describing the animation
     */
    read(json: Record<string, any>): void;
    /**
     *  Play the sounds according to frame and condition.
     *  @param {number} frame - The frame
     *  @param {AnimationEffectConditionKind} condition - The condition
     */
    playSounds(frame: number, condition: AnimationEffectConditionKind): void;
    /**
     *  Draw the animation.
     *  @param {Picture2D} picture - The picture associated to the animation
     *  @param {number} frame - The frame
     *  @param {Battler} battler - The battler target
     */
    draw(picture: Picture2D, frame: number, battler: Battler): void;
}
export { Animation };
