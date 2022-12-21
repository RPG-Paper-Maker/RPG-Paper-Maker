import { System } from "../index.js";
/** @class
 *  All the status datas.
 *  @static
 */
declare class Status {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to status.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the status by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Status}
     */
    static get(id: number): System.Status;
}
export { Status };
