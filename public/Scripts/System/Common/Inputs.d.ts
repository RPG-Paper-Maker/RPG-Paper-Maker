/**
 *  @class
 *  Handles inputs for keyboard and mouse.
 */
declare class Inputs {
    static keysPressed: number[];
    static mouseLeftPressed: boolean;
    static mouseRightPressed: boolean;
    static mouseFirstPressX: number;
    static mouseFirstPressY: number;
    static mouseX: number;
    static mouseY: number;
    constructor();
    /**
     *  Initialize all keyboard and mouse events.
     *  @static
     */
    static initialize(): void;
    /**
     *  Initialize all keyboard events.
     *  @static
     */
    static initializeKeyboard(): void;
    /**
     *  Initialize all mouse events.
     *  @static
     */
    static initializeMouse(): void;
}
export { Inputs };
