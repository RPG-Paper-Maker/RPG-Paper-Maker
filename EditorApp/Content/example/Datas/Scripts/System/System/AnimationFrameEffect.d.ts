import { Enum } from "../Common/index.js";
import AnimationEffectConditionKind = Enum.AnimationEffectConditionKind;
import { Base } from "./Base.js";
import { PlaySong } from "./PlaySong.js";
/** @class
 *  An animation frame effect.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  animation frame effect
 */
declare class AnimationFrameEffect extends Base {
    isSE: boolean;
    se: PlaySong;
    condition: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the animation frame effect.
     *  @param {Record<string, any>} - json Json object describing the animation
     *  frame effect
     */
    read(json: Record<string, any>): void;
    /**
     *  Play the sound effect according to a condition.
     *  @param {AnimationEffectConditionKind} condition - The animation effect
     *  condition kind
     */
    playSE(condition: AnimationEffectConditionKind): void;
}
export { AnimationFrameEffect };
