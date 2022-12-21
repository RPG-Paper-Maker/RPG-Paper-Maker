import { Base } from "./Base.js";
import { DynamicValue } from "./DynamicValue.js";
import { Item } from "../Core/index.js";
/** @class
 *  A loot of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  loot
 */
declare class Loot extends Base {
    kind: number;
    lootID: DynamicValue;
    number: DynamicValue;
    probability: DynamicValue;
    initial: DynamicValue;
    final: DynamicValue;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the loot.
     *  @param {Record<string, any>} - json Json object describing the loot
     */
    read(json: Record<string, any>): void;
    /**
     *  Check if a loot is available at a particular level.
     *  @param {number} level - The level
     *  @returns {boolean}
     */
    isAvailable(level: number): boolean;
    /**
     *  Get the current loot at a particular level.
     *  @param {number} level - The level
     *  @returns {Item}
     */
    currenLoot(level: number): Item;
}
export { Loot };
