import { Scene } from "../index.js";
import { Picture2D } from "../Core/index.js";
/** @class
 *  The game stack that is organizing the game scenes.
 *  @static
 */
declare class Stack {
    static top: Scene.Base;
    static subTop: Scene.Base;
    static bot: Scene.Base;
    static content: Scene.Base[];
    static requestPaintHUD: boolean;
    static sceneLoading: Scene.Loading;
    static loadingDelay: number;
    static elapsedTime: number;
    static averageElapsedTime: number;
    static lastUpdateTime: number;
    static displayedPictures: [number, Picture2D][];
    static isInMainMenu: boolean;
    constructor();
    /**
     *  Push a new scene in the stack.
     *  @param {Scene.Base} scene - The scene to push
     */
    static push(scene: Scene.Base): void;
    /**
     *  Pop (remove) the last scene in the stack.
     *  @returns {Scene.Base} The last scene that is removed
     */
    static pop(): Scene.Base;
    /**
     *  Pop (remove) all the scene in the stack.
     *  @returns Scene.Base
     */
    static popAll(): Scene.Base;
    /**
     *  Replace the last scene in the stack by a new scene.
     *  @param {SceneGame} scene - The scene to replace
     *  @returns {SceneGame} The last scene that is replaced
     */
    static replace(scene: Scene.Base): Scene.Base;
    /**
     *  Get the scene at a specific index in the stack. 0 is the bottom of the
     *  stack.
     *  @param {number} i - Index in the stack
     *  @returns {SceneGame} The scene in the index of the stack
     */
    static at(i: number): Scene.Base;
    /**
     *  Check if the stack is empty.
     *  @returns {boolean}
     */
    static isEmpty(): boolean;
    /**
     *  Check if top content is loading.
     *  @returns {boolean}
     */
    static isLoading(): boolean;
    /**
     *  Push the title screen when empty.
     *  @returns {Scene.TitleScreen}
     */
    static pushTitleScreen(): Scene.TitleScreen;
    /**
     *  Push the game over.
     *  @returns {Scene.GameOver}
     */
    static pushGameOver(): Scene.GameOver;
    /**
     *  Push a battle scene for testing troop.
     */
    static pushBattleTest(): Promise<void>;
    static pushShowTextPreview(): Promise<void>;
    /**
     *  Clear the HUD canvas.
     */
    static clearHUD(): void;
    /**
     *  Translate all the current scenes.
     */
    static translateAll(): void;
    /**
     *  Update the stack.
     */
    static update(): void;
    /**
     *  First key press handle for the current stack.
     *  @param {number} key - The key ID pressed
     */
    static onKeyPressed(key: number): void;
    /**
     *  First key release handle for the current stack.
     *  @param {number} key - The key ID released
     */
    static onKeyReleased(key: number): void;
    /**
     *  Key pressed repeat handle for the current stack.
     *  @param {number} key - The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
     */
    static onKeyPressedRepeat(key: number): boolean;
    /**
     *  Key pressed repeat handle for the current stack, but with
     *  a small wait after the first pressure (generally used for menus).
     *  @param {number} key - The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
     */
    static onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  Mouse down handle for the current stack.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    static onMouseDown(x: number, y: number): void;
    /**
     *  Mouse move handle for the current stack.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    static onMouseMove(x: number, y: number): void;
    /**
     *  Mouse up handle for the current stack.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    static onMouseUp(x: number, y: number): void;
    /**
     *  Draw the 3D for the current stack.
     */
    static draw3D(): void;
    /**
     *  Draw HUD for the current stack.
     */
    static drawHUD(): void;
}
export { Stack };
