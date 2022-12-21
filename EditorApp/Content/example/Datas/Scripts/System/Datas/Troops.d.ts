import { System } from "../index.js";
/** @class
 *  All the troops datas.
 *  @static
 */
declare class Troops {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to troops
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the troop by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Troop}
     */
    static get(id: number): System.Troop;
}
export { Troops };
