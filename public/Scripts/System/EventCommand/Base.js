/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
/**
 *  @class
 *  An abstract event command.
 */
class Base {
    constructor() {
        this.parallel = false;
    }
    /**
     * Initialize the current state.
     * @returns {Object} The current state
     */
    initialize() {
        return null;
    }
    /**
     * Update and check if the event is finished.
     * @param {Record<string, any>} - currentState The current state of the event
     * @param {MapObject} object - The current object reacting
     * @param {number} state - The state ID
     * @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        return 1;
    }
    /**
     *  First key press handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
     */
    onKeyPressed(currentState, key) { }
    /**
     *  First key release handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
    */
    onKeyReleased(currentState, key) { }
    /**
     *  Key pressed repeat handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedRepeat(currentState, key) {
        return true;
    }
    /**
     *  Key pressed repeat handle for the current stack, but with
     *  a small wait after the first pressure (generally used for menus).
     *  @param {Object} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(currentState, key) {
        return true;
    }
    /**
     *  Mouse down handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseDown(currentState, x, y) { }
    /**
     *  Mouse move handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseMove(currentState, x, y) { }
    /**
     *  Mouse up handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseUp(currentState, x, y) { }
    /**
     *  Draw the HUD.
     *  @param {Object} currentState - The current state of the event
     */
    drawHUD(currentState) {
    }
}
export { Base };
