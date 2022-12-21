import { Base } from "./Base.js";
import { System } from "../index.js";
import { MapObject } from "../Core/index.js";
/** @class
 *  An event command for teleporting an object.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class TeleportObject extends Base {
    static TRANSITION_DURATION: number;
    objectID: System.DynamicValue;
    objectIDPosition: System.DynamicValue;
    mapID: System.DynamicValue;
    x: System.DynamicValue;
    y: System.DynamicValue;
    yPlus: System.DynamicValue;
    z: System.DynamicValue;
    direction: number;
    transitionStart: number;
    transitionStartColor: System.DynamicValue;
    transitionEnd: number;
    transitionEndColor: System.DynamicValue;
    constructor(command: any[]);
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any>;
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState: Record<string, any>, object: MapObject, state: number): number;
    /**
     *  Draw the HUD
     *  @param {Record<string ,any>} - currentState The current state of the event
     */
    drawHUD(currentState?: Record<string, any>): void;
}
export { TeleportObject };
