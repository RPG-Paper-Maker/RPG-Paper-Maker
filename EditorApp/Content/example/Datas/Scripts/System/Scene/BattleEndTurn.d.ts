import { Scene } from "../index.js";
import { ReactionInterpreter } from "../Core/index.js";
declare class BattleEndTurn {
    battle: Scene.Battle;
    step: number;
    indexTroopReaction: number;
    interpreter: ReactionInterpreter;
    constructor(battle: Scene.Battle);
    /**
     *  Initialize step.
     */
    initialize(): void;
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
export { BattleEndTurn };
