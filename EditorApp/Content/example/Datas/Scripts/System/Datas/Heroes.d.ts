import { System } from "../index.js";
/** @class
 *  All the heroes datas.
 *  @static
 */
declare class Heroes {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to heroes.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the hero by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Hero}
     */
    static get(id: number): System.Hero;
}
export { Heroes };
