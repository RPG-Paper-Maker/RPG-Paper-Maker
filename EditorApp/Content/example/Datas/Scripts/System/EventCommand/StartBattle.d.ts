import { Base } from "./Base.js";
import { System } from "../index.js";
import { MapObject } from "../Core/index.js";
/** @class
 *  An event command for battle processing.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class StartBattle extends Base {
    battleMapID: System.DynamicValue;
    mapID: System.DynamicValue;
    x: System.DynamicValue;
    y: System.DynamicValue;
    yPlus: System.DynamicValue;
    z: System.DynamicValue;
    canEscape: boolean;
    canGameOver: boolean;
    troopID: System.DynamicValue;
    transitionStart: number;
    transitionStartColor: System.DynamicValue;
    transitionEnd: number;
    transitionEndColor: System.DynamicValue;
    battleMapType: number;
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
export { StartBattle };
