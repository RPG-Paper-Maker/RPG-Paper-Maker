import { System } from "../index.js";
/** @class
 *  All the weapons datas
 *  @static
 */
declare class Weapons {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to weapons
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the weapon by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Weapon}
     */
    static get(id: number): System.Weapon;
}
export { Weapons };
