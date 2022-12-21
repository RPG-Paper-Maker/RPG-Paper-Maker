import { System } from "../index.js";
import { MapObject } from "../Core/index.js";
import { Base } from "./Base.js";
/** @class
 *  An event command for creating an object in map.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class CreateObjectInMap extends Base {
    modelID: System.DynamicValue;
    objectIDPosition: System.DynamicValue;
    mapID: System.DynamicValue;
    x: System.DynamicValue;
    y: System.DynamicValue;
    yPlus: System.DynamicValue;
    z: System.DynamicValue;
    isStockID: boolean;
    stockID: System.DynamicValue;
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
export { CreateObjectInMap };
