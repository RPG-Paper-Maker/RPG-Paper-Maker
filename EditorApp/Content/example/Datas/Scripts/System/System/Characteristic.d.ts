import { Enum } from "../Common/index.js";
import { Base } from "./Base.js";
import { DynamicValue } from "./DynamicValue.js";
import { Player } from "../Core/index.js";
/** @class
 *  A characteristic of a common skill item.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  characteristic
 */
declare class Characteristic extends Base {
    kind: Enum.CharacteristicKind;
    isIncreaseDecrease: boolean;
    increaseDecreaseKind: number;
    statisticValueID: DynamicValue;
    elementResID: DynamicValue;
    statusResID: DynamicValue;
    currencyGainID: DynamicValue;
    skillCostID: DynamicValue;
    isAllSkillCost: boolean;
    variableID: number;
    operation: boolean;
    value: DynamicValue;
    unit: boolean;
    script: DynamicValue;
    isAllowEquip: boolean;
    isAllowEquipWeapon: boolean;
    equipWeaponTypeID: DynamicValue;
    equipArmorTypeID: DynamicValue;
    isAllowChangeEquipment: boolean;
    changeEquipmentID: DynamicValue;
    beginEquipmentID: DynamicValue;
    beginWeaponArmorID: DynamicValue;
    isBeginWeapon: boolean;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the characteristic.
     *  @param {Record<string, any>} - json Json object describing the
     *  characteristic
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the new stat value of a player with this characteristic bonus.
     *  @param {Player} gamePlayer - the player
     *  @returns {number[]}
     */
    getNewStatValue(gamePlayer: Player): number[];
    /**
     *  Set the increase decrease values for specific res.
     *  @param {Record<string, any>} res
     */
    setIncreaseDecreaseValues(res: Record<string, any>): void;
    /**
     *  Execute the characteristic script.
     *  @param {Player} user
     */
    executeScript(user: Player): void;
    /**
     *  Get the string representation of the characteristic.
     *  @returns {string}
     */
    toString(): string;
}
export { Characteristic };
