import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import { Translatable } from "./Translatable.js";
import { Item } from "../Core/index.js";
/** @class
 *  An inventory filter used to filter inventory or shops items.
 *  @extends Translatable
 *  @param {Record<string, any>} [json=undefined] - Json object describing the item
 */
declare class InventoryFilter extends Translatable {
    kind: Enum.InventoryFilterKind;
    itemTypeID: System.DynamicValue;
    script: string;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the inventory filter.
     *  @param {Record<string, any>} - json Json object describing the
     *  inventory filter
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the filter function taking the item to filter and return true if
     *  pass filter.
     *  @returns {(item: Core.Item) => boolean}
     */
    getFilter(): (item: Item) => boolean;
}
export { InventoryFilter };
