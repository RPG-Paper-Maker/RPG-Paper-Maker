import { MapObject, Node } from "./index.js";
import { System } from "../index.js";
/** @class
 *  A reaction command interpreter.
 *  @param {MapObject} sender - Current event sender (null for System events)
 *  @param {System.Reaction} reaction - Current reaction excecuted (only one per
 *  state)
 *  @param {MapObject} object - Current map object
 *  @param {number} state - Current state of map object reaction
 *  @param {System.DynamicValue[]} parameters - All the parameters coming with
 *  this reaction
 *  @param {[System.Event, number]} - event The current time events
 *  @param {Node} [command=reaction.getFirstCommand()] - The current command (by
 *  default the first reaction command)
 */
declare class ReactionInterpreter {
    static currentObject: MapObject;
    static currentParameters: System.DynamicValue[];
    static currentReaction: ReactionInterpreter;
    static blockingHero: boolean;
    currentSender: MapObject;
    currentReaction: System.Reaction;
    currentMapObject: MapObject;
    currentState: number;
    currentParameters: System.DynamicValue[];
    currentCommand: Node;
    currentCommandState: Record<string, any>;
    currentTimeState: [System.Event, number];
    isInMainMenu: boolean;
    constructor(sender: MapObject, reaction: System.Reaction, object: MapObject, state: number, parameters?: System.DynamicValue[], event?: [
        System.Event,
        number
    ], command?: Node);
    /**
     *  Check if the current reaction is finished (no more commands to excecute).
     *  @returns {boolean}
     */
    isFinished(): boolean;
    /**
     *  Check if the command can be executed.
     *  @returns {boolean}
     */
    canExecute(): boolean;
    /**
     *  Update current object and parameters (for variables).
     */
    updateObjectParameters(): void;
    /**
     *  Update if finished.
     */
    updateFinish(): void;
    /**
     *  Update the current commands
     */
    update(): void;
    /**
     *  Update a command and return the next command to excecute (if finished)
     *  @returns {Node}
     */
    updateCommand(): Node;
    /**
     *  Update a command that corresponds to the end of a block and return the
     *  next command to excecute (if finished).
     *  @param {Node} command - The command before updating
     *  @param {Node} value - The next command after updating
     *  @returns {Node}
     */
    endOfBlock(command: Node, value: Node): Node;
    /**
     *  After the end of a block, go to the next command.
     *  @param {Node} command - The command before updating
     *  @returns {Node}
     */
    goToNextCommand(node: Node): Node;
    /**
     *  First key press handle for the current command
     *  @param {number} key - The key ID pressed
     */
    onKeyPressed(key: number): void;
    /**
     *  First key release handle for the current command.
     *  @param {number} key - The key ID released
     */
    onKeyReleased(key: number): void;
    /**
     *  Key pressed repeat handle for the current command.
     *  @param {number} key - The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
     */
    onKeyPressedRepeat(key: number): boolean;
    /**
     *  Key pressed repeat handle for the current command, but with a small
     *  wait after the first pressure (generally used for menus).
     *  @param {number} key - The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
    */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  Mouse down handle for the current command.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseDown(x: number, y: number): any;
    /**
     *  Mouse move handle for the current command.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseMove(x: number, y: number): any;
    /**
     *  Mouse up handle for the current command.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseUp(x: number, y: number): any;
    /**
     *  Draw HUD for the current command
     */
    drawHUD(): void;
}
export { ReactionInterpreter };
