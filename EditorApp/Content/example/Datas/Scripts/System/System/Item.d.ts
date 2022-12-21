import { CommonSkillItem } from "./CommonSkillItem.js";
import { Enum } from "../Common/index.js";
import { Battler } from "../Core/index.js";
/** @class
 *  An item of the game.
 *  @extends CommonSkillItem
 *  @param {Record<string, any>} - [json=undefined] Json object describing the item
 */
declare class Item extends CommonSkillItem {
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the item.
     *  @param {Record<string, any>} - json Json object describing the item
     */
    read(json: Record<string, any>): void;
    /** Get the item type.
     *  @returns {string}
     */
    getStringType(): string;
    /**
     *  Get the item kind.
     *  @returns {Enum.ItemKind}
     */
    getKind(): Enum.ItemKind;
    /**
     *  Get message and replace user / item name.
     *  @param {Battler} user
     *  @returns {string}
     */
    getMessage(user: Battler): string;
}
export { Item };
