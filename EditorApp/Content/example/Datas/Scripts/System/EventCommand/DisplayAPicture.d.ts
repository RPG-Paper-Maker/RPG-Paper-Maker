import { Base } from "./Base.js";
import { System } from "../index.js";
import { MapObject } from "../Core/index.js";
/** @class
 *  An event command for displaying a picture.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class DisplayAPicture extends Base {
    pictureID: System.DynamicValue;
    index: System.DynamicValue;
    centered: boolean;
    originX: number;
    originY: number;
    x: System.DynamicValue;
    y: System.DynamicValue;
    zoom: System.DynamicValue;
    opacity: System.DynamicValue;
    angle: System.DynamicValue;
    stretch: boolean;
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
export { DisplayAPicture };
