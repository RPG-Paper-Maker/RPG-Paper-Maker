import { Scene } from "../index.js";
import { Enum } from "../Common/index.js";
import AnimationEffectConditionKind = Enum.AnimationEffectConditionKind;
declare class BattleAnimation {
    battle: Scene.Battle;
    constructor(battle: Scene.Battle);
    /**
     *  Initialize step.
     */
    initialize(): void;
    /**
     *  Get the animation efect condition kind.
     *  @returns {AnimationEffectConditionKind}
     */
    getCondition(): AnimationEffectConditionKind;
    /**
     *  Update the targets attacked and check if they are dead.
     */
    updateTargetsAttacked(): void;
    /**
     *  Update the battle.
     */
    update(): void;
    /**
     *  Handle key pressed.
     *   @param {number} key - The key ID
     */
    onKeyPressedStep(key: number): void;
    /**
     *  Handle key released.
     *  @param {number} key - The key ID
     */
    onKeyReleasedStep(key: number): void;
    /**
     *  Handle key repeat pressed.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeatStep(key: number): boolean;
    /**
     *  Handle key pressed and repeat.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeatStep(key: number): boolean;
    /**
     *  Draw the battle HUD.
     */
    drawHUDStep(): void;
}
export { BattleAnimation };
