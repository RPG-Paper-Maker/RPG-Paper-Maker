import { Enum } from "../Common/index.js";
import ItemKind = Enum.ItemKind;
import { System } from "../index.js";
/** @class
 *  An item in the inventory.
 *  @param {ItemKind} kind - Kind of item (item, weapon, or armor)
 *  @param {number} id - The ID of the item
 *  @param {number} nb - The occurence of the item in the inventory
 */
declare class Item {
    kind: ItemKind;
    system: System.CommonSkillItem;
    nb: number;
    shop: System.ShopItem;
    constructor(kind: ItemKind, id: number, nb: number, shop?: System.ShopItem);
    /**
     *  Find an item in the inventory.
     *  @static
     *  @param {ItemKind} kind - The kind of item
     *  @param {number} id - The item ID
     *  @returns {Item}
     */
    static findItem(kind: ItemKind, id: number): Item;
    /**
     *  The json save.
     */
    getSave(): Record<string, any>;
    /**
     *  Remove item from inventory.
     *  @param {number} nb - Number of item to remove
     *  @returns {boolean}
     */
    remove(nb: number): boolean;
    /**
     *  Add item in inventory.
     *  @param {number} nb - Number of item to add
     */
    add(nb: number): void;
    /**
     *  Modify items only if already in inventory.
     *  @param {Function} callback - callback function for action
     *  @returns {boolean} Indicates if the item is already inside the
     *  inventory
     */
    modifyItems(callback: Function): boolean;
    /**
     *  Modify the number of the item
     */
    equalItems(): void;
    /**
     *  Add the number of the item
     */
    addItems(): void;
    /**
     *  Remove the number of the item
     */
    removeItems(): void;
    /**
     *  Multiply the number of the item
     */
    multItems(): void;
    /**
     *  Modify the number of the item
     */
    divItems(): void;
    /**
     *  Modulo the number of the item
     */
    moduloItems(): void;
    /**
     *  Use one item and check if there is at least one item left
     * @returns {boolean}
     */
    use(): boolean;
    /**
     *  Get the max value you could buy from this item shop.
     *  @returns {number}
     */
    getMaxBuy(): number;
    /**
     *  Use the currencies to buy this shop item and indicates if the shop item
     *  need to be removed.
     *  @param {number} shopID The item shop ID
     *  @param {number} times The number of items to buy
     *  @returns {boolean}
     */
    buy(shopID: number, times: number): boolean;
    /**
     *  Get the currencies to sell this item and indicates if the item need to
     *  be removed from list.
     *  @param {number} shopID The item shop ID
     *  @param {number} times The number of items to buy
     *  @returns {boolean}
     */
    sell(times: number): boolean;
}
export { Item };
