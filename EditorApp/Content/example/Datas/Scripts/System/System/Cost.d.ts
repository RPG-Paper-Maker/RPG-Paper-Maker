import { Base } from "./Base.js";
import { System } from "../index.js";
import { Player } from "../Core/index.js";
import { StructIterator } from "../EventCommand/index.js";
/** @class
 *  A cost of a common skill item.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  cost
 */
declare class Cost extends Base {
    kind: number;
    statisticID: System.DynamicValue;
    currencyID: System.DynamicValue;
    variableID: number;
    valueFormula: System.DynamicValue;
    skillItem: System.CommonSkillItem;
    constructor(json?: Record<string, any>);
    /**
     *  Get the price for several costs.
     */
    static getPrice(list: System.Cost[]): Record<string, number>;
    /**
     *  Read the JSON associated to the cost.
     *  @param {Record<string, any>} - json Json object describing the cost
     */
    read(json: Record<string, any>): void;
    /**
     *  Parse command with iterator.
     *  @param {any[]} command
     *  @param {StructIterator} iterator
     */
    parse(command: any[], iterator: StructIterator): void;
    /**
     *  Get value according to user characteristics.
     */
    getValue(user: Player, target: Player): number;
    /**
     *  Use the cost.
     */
    use(): void;
    /**
     *  Check if the cost is possible.
     *  @returns {boolean}
     */
    isPossible(): boolean;
    /**
     *  Get the string representing the cost.
     *  @returns {string}
     */
    toString(): string;
}
export { Cost };
