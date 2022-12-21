import { Base } from "./Base.js";
import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import { MapObject } from "../Core/index.js";
/** @class
 *  An event command for modifying team.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class ModifyTeam extends Base {
    kind: number;
    instanceLevel: System.DynamicValue;
    instanceTeam: Enum.GroupKind;
    stockVariableID: System.DynamicValue;
    instanceKind: Enum.CharacterKind;
    instanceID: System.DynamicValue;
    enemyInstanceID: System.DynamicValue;
    enemyTeam: Enum.GroupKind;
    modifyKind: number;
    modifyInstanceID: System.DynamicValue;
    modifyTeam: Enum.GroupKind;
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
export { ModifyTeam };
