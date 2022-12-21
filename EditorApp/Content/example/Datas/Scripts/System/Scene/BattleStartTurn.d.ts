import { Scene } from "../index.js";
import { Enum } from "../Common/index.js";
import { Battler, ReactionInterpreter } from "../Core/index.js";
import { Status } from "../Core/Status.js";
declare class BattleStartTurn {
    battle: Scene.Battle;
    step: number;
    active: boolean;
    statusHealed: [Battler, Status[]][];
    statusStill: [Battler, Status[]][];
    indexTroopReaction: number;
    interpreter: ReactionInterpreter;
    constructor(battle: Scene.Battle);
    /**
     *  Initialize step.
     */
    initialize(): void;
    startSelectionEnemyAttack(): void;
    defineRandom(user: Battler, restriction: Enum.StatusRestrictionsKind): void;
    /**
     *  Update the battle.
     */
    update(): void;
    /**
     *  Handle key pressed.
     *  @param {number} key - The key ID
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
     *  @inheritdoc
     */
    onMouseDownStep(x: number, y: number): void;
    /**
     *  @inheritdoc
     */
    onMouseMoveStep(x: number, y: number): void;
    /**
     *  @inheritdoc
     */
    onMouseUpStep(x: number, y: number): void;
    /**
     *  Draw the battle HUD.
     */
    drawHUDStep(): void;
}
export { BattleStartTurn };
