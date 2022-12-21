import { System } from "../index.js";
/** @class
 *  All the items datas.
 *  @static
 */
declare class Items {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to items.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the item by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Item}
     */
    static get(id: number): System.Item;
}
export { Items };
