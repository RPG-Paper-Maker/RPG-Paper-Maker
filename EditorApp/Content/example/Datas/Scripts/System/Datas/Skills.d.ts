import { System } from "../index.js";
/** @class
*   All the skills datas
*   @static
*/
declare class Skills {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to skills.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the skill by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Skill}
     */
    static get(id: number): System.Skill;
}
export { Skills };
