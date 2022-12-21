import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import { StructIterator } from "../EventCommand/index.js";
import { Base } from "./Base.js";
/** @class
 *  A skill learned by a player.
 *  @param {number} id - The ID of the skill
 */
declare class ShopItem extends Base {
    selectionItem: Enum.ItemKind;
    itemID: System.DynamicValue;
    weaponID: System.DynamicValue;
    armorID: System.DynamicValue;
    selectionPrice: boolean;
    specificPrice: System.Cost[];
    selectionStock: boolean;
    specificStock: System.DynamicValue;
    stock: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the shop item.
     *  @param {Record<string, any>} json - Json object describing the shop item
     */
    read(json: Record<string, any>): void;
    /**
     *  Parse command with iterator.
     *  @param {any[]} command
     *  @param {StructIterator} iterator
     */
    parse(command: any[], iterator: StructIterator): void;
    /**
     *  Get the item system.
     *  @returns {System.CommonSkillItem}
     */
    getItem(): System.CommonSkillItem;
    /**
     *  Get the price.
     *  @returns {number}
     */
    getPrice(): Record<string, number>;
    /**
     *  Get the initial stock.
     *  @returns {number}
     */
    getStock(): number;
    /**
     *  Get the initial stock.
     *  @returns {boolean}
     */
    isPossiblePrice(): boolean;
    /**
     *  Get the max possible number you can buy.
     *  @param {number} initial The initial value corresponding to stock.
     *  @returns {number}
     */
    getMax(initial: number): number;
}
export { ShopItem };
