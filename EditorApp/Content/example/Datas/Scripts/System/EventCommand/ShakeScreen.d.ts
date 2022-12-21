import { Base } from "./Base.js";
import { System } from "../index.js";
import { MapObject } from "../Core/index.js";
/** @class
 *  An event command for shaking screen.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class ShakeScreen extends Base {
    offset: System.DynamicValue;
    shakeNumber: System.DynamicValue;
    isWaitEnd: boolean;
    time: System.DynamicValue;
    constructor(command: any[]);
    /**
     *  Update the target offset
     *  @static
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {number} timeRate - The time rate
     */
    static updateTargetOffset(currentState: Record<string, any>, timeRate: number): void;
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any>;
    /**
     *  Update and check if the event is finished
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): number;
}
export { ShakeScreen };
