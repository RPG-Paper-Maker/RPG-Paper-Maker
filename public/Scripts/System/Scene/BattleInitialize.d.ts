import { Scene } from "../index.js";
declare class BattleInitialize {
    battle: Scene.Battle;
    constructor(battle: Scene.Battle);
    /**
     *  Initialize step.
     */
    initialize(): void;
    /**
     *  Initialize allies battlers.
     */
    initializeAlliesBattlers(): void;
    /**
     *  Initialize enemies battlers.
     */
    initializeEnemiesBattlers(): void;
    /**
     *  Initialize informations (boxes).
     */
    initializeInformation(): void;
    /**
     *  Initialize window commands.
     */
    initializeWindowCommands(): void;
    /** Initialize windows end
    */
    initializeWindowsEnd(): void;
    /**
     *  Initialize musics.
     */
    initializeMusic(): void;
    /**
     *  Update the battle.
     */
    update(): void;
    /**
     * Update transtion start fade.
     */
    updateTransitionStartFade(): void;
    /**
     *  Update transition start zoom.
     */
    updateTransitionStartZoom(): void;
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
     *  Draw the battle HUD
    */
    drawHUDStep(): void;
}
export { BattleInitialize };
