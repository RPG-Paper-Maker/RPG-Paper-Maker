import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import { Base } from "./Base.js";
/** @class
 *  A troop reaction conditions of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  troop reaction conditions
 */
declare class TroopReactionConditions extends Base {
    isNumberOfTurn: boolean;
    numberOfTurnPlus: System.DynamicValue;
    numberOfTurnTimes: System.DynamicValue;
    isHeroesMonsters: boolean;
    isHeroes: boolean;
    conditionHeroesKind: Enum.ConditionHeroesKind;
    heroInstanceID: System.DynamicValue;
    isStatusID: boolean;
    statusID: System.DynamicValue;
    isStatisticID: boolean;
    statisticID: System.DynamicValue;
    statisticOperationKind: Enum.OperationKind;
    statisticCompare: System.DynamicValue;
    statisticCompareUnit: boolean;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the troop reaction conditions.
     *  @param {Record<string, any>} - json Json object describing the troop
     *  reaction conditions
     */
    read(json: Record<string, any>): void;
    /**
     *  Check if conditions are valid.
     *  @returns {boolean}
     */
    isValid(): boolean;
}
export { TroopReactionConditions };
