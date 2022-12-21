import { Base } from "./Base.js";
import { System } from "../index.js";
import { MapObject } from "../Core/index.js";
/** @class
 *  An event command for changing an object state.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class ChangeState extends Base {
    mapID: System.DynamicValue;
    objectID: System.DynamicValue;
    idState: System.DynamicValue;
    operationKind: number;
    constructor(command: any[]);
    /**
     *  Add a state to an object.
     *  @static
     *  @param {Record<string, any>} - portionDatas Datas inside a portion
     *  @param {number} index - Index in the portion datas
     *  @param {number} state - ID of the state
     */
    static addState(portionDatas: Record<string, any>, index: number, state: number): void;
    /**
     *  Remove a state from an object.
     *  @static
     *  @param {Record<string, any>} - portionDatas Datas inside a portion
     *  @param {number} index - Index in the portion datas
     *  @param {number} state - ID of the state
     */
    static removeState(portionDatas: Record<string, any>, index: number, state: number): void;
    /**
     *  Remove all the states from an object.
     *  @static
     *  @param {Record<string, any>} - portionDatas Datas inside a portion
     *  @param {number} index - Index in the portion datas
     */
    static removeAll(portionDatas: Record<string, any>, index: number): void;
    /**
     *  Remove states from datas.
     *  @static
     *  @param {Record<string, any>} - portionDatas Datas inside a portion
     *  @param {number} index - Index in the portion datas
     *  @param {number[]} states
     */
    static removeFromDatas(portionDatas: Record<string, any>, index: number, states: number[]): void;
    /**
     *  Add state in ID's list.
     *  @static
     *  @param {number[]} states - The states IDs
     *  @param {number} state - ID of the state
     */
    static addStateSpecial(states: number[], state: number): void;
    /**
     *  Remove state in ID's list.
     *  @static
     *  @param {number[]} states - The states IDs
     *  @param {number} state - ID of the state
     */
    static removeStateSpecial(states: number[], state: number): void;
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
export { ChangeState };
