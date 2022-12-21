import { Battler } from "../Core/index.js";
import { CommonSkillItem } from "./CommonSkillItem.js";
/** @class
 *  A skill of the game.
 *  @extends System.CommonSkillItem
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  skill
 */
declare class Skill extends CommonSkillItem {
    constructor(json: any);
    /**
     *  Read the JSON associated to the skill.
     *  @param {Record<string, any>} - json Json object describing the skill
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the string representation of costs.
     *  @returns {string}
     */
    getCostString(): string;
    /**
     *  Get message and replace user / skill name.
     *  @param {Battler} user
     *  @returns {string}
     */
    getMessage(user: Battler): string;
}
export { Skill };
