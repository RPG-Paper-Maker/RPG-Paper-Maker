import { Base } from "./Base.js";
import { MapObject } from "../Core/index.js";
/** @class
 *  An event command representing one of the choice.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class Choice extends Base {
    index: number;
    constructor(command: any[]);
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState: Record<string, any>, object: MapObject, state: number): number;
    /**
     *  Returns the number of node to pass.
     *  @returns {number}
     */
    goToNextCommand(): number;
}
export { Choice };
