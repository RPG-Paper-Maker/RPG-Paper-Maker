import { System } from "../index.js";
import { MapObject } from "../Core/index.js";
import { Base } from "./Base.js";
/** @class
 *  An event command for switching texture.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class SwitchTexture extends Base {
    isTilesetID: boolean;
    tilesetID: System.DynamicValue;
    tilesetPictureID: System.DynamicValue;
    isAutotileID: boolean;
    autotileID: System.DynamicValue;
    autotilePictureID: System.DynamicValue;
    isWallID: boolean;
    wallID: System.DynamicValue;
    wallPictureID: System.DynamicValue;
    isObject3DID: boolean;
    object3DID: System.DynamicValue;
    object3DPictureID: System.DynamicValue;
    isMountainID: boolean;
    mountainID: System.DynamicValue;
    mountainPictureID: System.DynamicValue;
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
export { SwitchTexture };
