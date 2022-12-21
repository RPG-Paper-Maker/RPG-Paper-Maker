import { System } from "../index.js";
/** @class
 *  All the armors datas.
 *  @static
 */
declare class Armors {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to armors.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the armor by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Armor}
     */
    static get(id: number): System.Armor;
}
export { Armors };
