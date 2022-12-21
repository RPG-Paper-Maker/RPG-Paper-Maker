import { Base } from "./Base.js";
import { MapObject } from "../Core/index.js";
import { System } from "../index.js";
/** @class
 *  An event command for allowing forbidding main menu.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class Plugin extends Base {
    pluginID: number;
    commandID: number;
    parameters: System.DynamicValue[];
    constructor(command: any[]);
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): number;
}
export { Plugin };
