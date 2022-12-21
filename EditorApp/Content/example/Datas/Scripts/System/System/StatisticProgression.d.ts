import { Base } from "./Base.js";
import { DynamicValue } from "./DynamicValue.js";
import { ProgressionTable } from "./ProgressionTable.js";
import { Player } from "../Core/index.js";
/** @class
 *  A statistic progression of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  statistic progression
 */
declare class StatisticProgression extends Base {
    id: number;
    maxValue: DynamicValue;
    isFix: boolean;
    table: ProgressionTable;
    random: DynamicValue;
    formula: DynamicValue;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the statistic progression
     *  @param {Record<string, any>} - json Json object describing the statistic
     *  progression
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the value progresion at level
     *  @param {number} level - The level
     *  @param {Player} user - The user
     *  @param {number} [maxLevel=undefined] - The max level
     *  @returns {number}
     */
    getValueAtLevel(level: number, user: Player, maxLevel?: number): number;
}
export { StatisticProgression };
