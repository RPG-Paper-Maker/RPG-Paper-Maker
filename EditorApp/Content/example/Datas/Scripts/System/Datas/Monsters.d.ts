import { System } from "../index.js";
/** @class
 *  All the monsters datas.
 *  @static
 */
declare class Monsters {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to monsters.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the monster by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Monster}
     */
    static get(id: number): System.Monster;
}
export { Monsters };
