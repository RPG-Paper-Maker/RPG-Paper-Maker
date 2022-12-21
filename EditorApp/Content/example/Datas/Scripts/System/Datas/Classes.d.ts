import { System } from "../index.js";
/** @class
 *  All the classes datas.
 *  @static
 */
declare class Classes {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to classes
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the class by ID.
     *  @static
     *  @param {number} id
     *  @param {string} errorMessage
     *  @returns {System.Class}
     */
    static get(id: number, errorMessage?: string): System.Class;
}
export { Classes };
