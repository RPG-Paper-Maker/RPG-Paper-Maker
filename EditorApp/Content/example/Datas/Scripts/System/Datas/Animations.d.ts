import { System } from "../index.js";
/** @class
 *  All the animations datas.
 *  @static
 */
declare class Animations {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to status.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the animation by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Animation}
     */
    static get(id: number): System.Animation;
}
export { Animations };
