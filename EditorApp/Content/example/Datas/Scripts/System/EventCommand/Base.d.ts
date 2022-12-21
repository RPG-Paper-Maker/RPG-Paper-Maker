import { MapObject } from "../Core/index.js";
interface StructIterator {
    i: number;
}
/**
 *  @class
 *  An abstract event command.
 */
declare abstract class Base {
    parallel: boolean;
    constructor();
    /**
     * Initialize the current state.
     * @returns {Object} The current state
     */
    initialize(): Object;
    /**
     * Update and check if the event is finished.
     * @param {Record<string, any>} - currentState The current state of the event
     * @param {MapObject} object - The current object reacting
     * @param {number} state - The state ID
     * @returns {number} The number of node to pass
     */
    update(currentState?: Record<string, any>, object?: MapObject, state?: number): number;
    /**
     *  First key press handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
     */
    onKeyPressed(currentState: Object, key: number): void;
    /**
     *  First key release handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
    */
    onKeyReleased(currentState: Object, key: number): void;
    /**
     *  Key pressed repeat handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedRepeat(currentState: Object, key: number): boolean;
    /**
     *  Key pressed repeat handle for the current stack, but with
     *  a small wait after the first pressure (generally used for menus).
     *  @param {Object} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(currentState: Object, key: number): boolean;
    /**
     *  Mouse down handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseDown(currentState: Object, x: number, y: number): void;
    /**
     *  Mouse move handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseMove(currentState: Object, x: number, y: number): void;
    /**
     *  Mouse up handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseUp(currentState: Object, x: number, y: number): void;
    /**
     *  Draw the HUD.
     *  @param {Object} currentState - The current state of the event
     */
    drawHUD(currentState?: Object): void;
}
export { StructIterator, Base };
