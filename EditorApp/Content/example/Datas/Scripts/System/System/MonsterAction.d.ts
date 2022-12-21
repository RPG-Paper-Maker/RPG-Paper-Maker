import { Base } from "./Base.js";
import { DynamicValue } from "./DynamicValue.js";
import { Monster } from "./Monster.js";
/** @class
 *  A monster action of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  monster action
 */
declare class MonsterAction extends Base {
    actionKind: number;
    skillID: DynamicValue;
    itemID: DynamicValue;
    itemNumberMax: DynamicValue;
    priority: DynamicValue;
    targetKind: number;
    isConditionTurn: boolean;
    operationKindTurn: number;
    turnValueCompare: DynamicValue;
    isConditionStatistic: boolean;
    statisticID: DynamicValue;
    operationKindStatistic: number;
    statisticValueCompare: DynamicValue;
    isConditionVariable: boolean;
    variableID: number;
    operationKindVariable: number;
    variableValueCompare: DynamicValue;
    isConditionStatus: boolean;
    statusID: DynamicValue;
    isConditionScript: boolean;
    script: DynamicValue;
    monster: Monster;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the monster action.
     *  @param {Record<string, any>} - json Json object describing the monster
     *  action
     */
    read(json: Record<string, any>): void;
}
export { MonsterAction };
