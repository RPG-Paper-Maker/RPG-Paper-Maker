import { Base } from "./Base.js";
/** @class
 *  A skill to learn for a specific class.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  class skill
 */
declare class ClassSkill extends Base {
    id: number;
    level: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the class skill.
     *  @param {Record<string, any>} - json Json object describing the class skill
     */
    read(json: Record<string, any>): void;
}
export { ClassSkill };
