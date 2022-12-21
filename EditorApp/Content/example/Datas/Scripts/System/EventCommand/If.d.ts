import { Base } from "./Base.js";
import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import { MapObject } from "../Core/index.js";
/** @class
 *  An event command for condition event command block.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class If extends Base {
    hasElse: boolean;
    kind: number;
    variableParamProp: System.DynamicValue;
    variableParamPropOperationKind: number;
    variableParamPropValue: System.DynamicValue;
    heroesSelection: number;
    heroInstanceID: System.DynamicValue;
    heroesInTeam: boolean;
    heroesInTeamSelection: number;
    heroesKind: number;
    heroesNamed: System.DynamicValue;
    heroesInTeamValue: number;
    heroesSkillID: System.DynamicValue;
    heroesEquipedKind: number;
    heroesEquipedWeaponID: System.DynamicValue;
    heroesEquipedArmorID: System.DynamicValue;
    heroesStatusID: System.DynamicValue;
    heroesStatisticID: System.DynamicValue;
    heroesStatisticOperation: number;
    heroesStatisticValue: System.DynamicValue;
    currencyID: System.DynamicValue;
    operationCurrency: number;
    currencyValue: System.DynamicValue;
    itemID: System.DynamicValue;
    operationItem: number;
    itemValue: System.DynamicValue;
    weaponID: System.DynamicValue;
    operationWeapon: number;
    weaponValue: System.DynamicValue;
    weaponEquiped: boolean;
    armorID: System.DynamicValue;
    operationArmor: number;
    armorValue: System.DynamicValue;
    armorEquiped: boolean;
    keyID: System.DynamicValue;
    keyValue: System.DynamicValue;
    objectIDLookingAt: System.DynamicValue;
    orientationLookingAt: Enum.Orientation;
    chronometerID: System.DynamicValue;
    chronometerOperation: number;
    chronometerSeconds: System.DynamicValue;
    script: System.DynamicValue;
    constructor(command: any[]);
    /**
     *  Get the hero instance ID.
     *  @returns {number}
     */
    getHeroInstanceID(): number;
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
    /**
     *  Returns the number of node to pass.
     *  @returns {number}
     */
    goToNextCommand(): number;
}
export { If };
