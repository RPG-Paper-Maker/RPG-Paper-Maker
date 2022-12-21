import { Scene } from "../index.js";
import { Enum } from "../Common/index.js";
import CharacterKind = Enum.CharacterKind;
import TargetKind = Enum.TargetKind;
declare class BattleSelection {
    battle: Scene.Battle;
    constructor(battle: Scene.Battle);
    /**
     *  Initialize step.
     */
    initialize(): void;
    /**
     *  Register the last command index and offset in the user.
     */
    registerLastCommandIndex(): void;
    /**
     *  Register the laster skill index and offset in the user.
     */
    registerLastSkillIndex(): void;
    /**
     *  Register the last item index and offset in the user.
     */
    registerLastItemIndex(): void;
    /**
     *  Select a target.
     *  @param {TargetKind} targetKind - The target kind
     */
    selectTarget(targetKind: TargetKind): void;
    /**
     *  Select the first index according to target kind.
     *  @param {CharacterKind} kind - The target kind
     *  @param {number} index - The index (last registered)
     */
    selectFirstIndex(kind: CharacterKind, index: number): number;
    /**
     *  Get the index of the array after going up.
     *  @returns {number}
     */
    indexArrowUp(): number;
    /**
     *  Get the index of the array after going down.
     *  @returns {number}
     */
    indexArrowDown(): number;
    /**
     *  Move the arrow.
     */
    moveArrow(): void;
    /**
     *  Get the index of the target.
     *  @returns {number}
     */
    selectedUserTargetIndex(): number;
    /**
     *  When an ally is selected.
     */
    onAllySelected(): void;
    /**
     *  When an ally is unselected.
     */
    onAllyUnselected(): void;
    /**
     *  When a command is selected.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    onCommandSelected(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  When targets are selected.
     */
    onTargetsSelected(): void;
    /**
     *  When targets are unselected.
     */
    onTargetsUnselected(): void;
    /**
     *  A scene action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  A scene move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
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
export { BattleSelection };
