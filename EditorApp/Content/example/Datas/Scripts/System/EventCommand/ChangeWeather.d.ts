import { System } from "../index.js";
import { MapObject } from "../Core/index.js";
import { Base } from "./Base.js";
/** @class
 *  An event command for changing weather.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
declare class ChangeWeather extends Base {
    isNone: boolean;
    isColor: boolean;
    colorID: System.DynamicValue;
    imageID: System.DynamicValue;
    numberPerPortion: System.DynamicValue;
    portionsRay: System.DynamicValue;
    size: System.DynamicValue;
    depthTest: System.DynamicValue;
    depthWrite: System.DynamicValue;
    initialVelocity: System.DynamicValue;
    velocityAddition: System.DynamicValue;
    initialYRotation: System.DynamicValue;
    yRotationAddition: System.DynamicValue;
    isWaitEnd: boolean;
    time: System.DynamicValue;
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
}
export { ChangeWeather };
