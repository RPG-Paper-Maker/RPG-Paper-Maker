import { Scene, System } from "../index.js";
import { Enum } from "../Common/index.js";
declare class BattleEnemyAttack {
    battle: Scene.Battle;
    constructor(battle: Scene.Battle);
    /**
     *  Initialize step.
     */
    initialize(): void;
    /**
     *  Define the possible action to do.
     */
    definePossibleActions(actions: System.MonsterAction[], restriction: Enum.StatusRestrictionsKind): number;
    /**
     *  Define the action to do.
     */
    defineAction(restriction?: Enum.StatusRestrictionsKind): void;
    /**
     *  Define the targets
     */
    defineTargets(restriction?: Enum.StatusRestrictionsKind): void;
    /**
     *  Update the battle
     */
    update(): void;
    /**
     *  Handle key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressedStep(key: number): void;
    /**
     *  Handle key released.
     *   @param {number} key - The key ID
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
export { BattleEnemyAttack };
