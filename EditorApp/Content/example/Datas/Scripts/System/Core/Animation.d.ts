import { Battler } from "./index.js";
import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import { Picture2D } from "./Picture2D.js";
/** @class
 *  An animation instance.
 *  @param {number} id - The ID of the status
 */
declare class Animation {
    system: System.Animation;
    picture: Picture2D;
    frame: number;
    loop: boolean;
    constructor(id: number, loop?: boolean);
    /**
     *  Update frame.
     */
    update(): void;
    /**
     *  Draw the animation on top of battler.
     */
    playSounds(conditionKind: Enum.AnimationEffectConditionKind): void;
    /**
     *  Draw the animation on top of battler.
     */
    draw(battler: Battler): void;
}
export { Animation };
