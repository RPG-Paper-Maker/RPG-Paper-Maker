import { Base } from "./Base.js";
import { System } from "../index.js";
import { MapObject } from "../Core/index.js";
import { Enum } from "../Common/index.js";
/** @class
 *  An event command for changing variables values.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class ChangeVariables extends Base {
    selection: number;
    nbSelection: number;
    operation: number;
    valueKind: number;
    valueNumber: System.DynamicValue;
    valueRandomA: System.DynamicValue;
    valueRandomB: System.DynamicValue;
    valueMessage: System.DynamicValue;
    valueSwitch: System.DynamicValue;
    valueMapObject: System.DynamicValue;
    valueMapObjectChar: number;
    valueItemKind: Enum.ItemKind;
    valueItemID: System.DynamicValue;
    valueTotalCurrencyKind: number;
    valueTotalCurrencyID: System.DynamicValue;
    valueHeroEnemyInstanceID: System.DynamicValue;
    valueStatisticID: System.DynamicValue;
    valueEnemyIndex: number;
    valueOtherCharacteristicKind: Enum.ChangeVariablesOtherCharacteristics;
    constructor(command: any[]);
    /**
     *  Initialize the current.
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
export { ChangeVariables };
