import { Reaction } from "./Reaction.js";
import { System } from "../index.js";
/** @class
 *  A common reaction.
 *  @extends System.Reaction
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  common reaction
 */
declare class CommonReaction extends Reaction {
    parameters: System.Parameter[];
    constructor(json?: Record<string, any>);
    /** Read the JSON associated to the common reaction.
     *  @param {Record<string, any>} - json Json object describing the common
     *  reaction
     */
    read(json: Record<string, any>): void;
}
export { CommonReaction };
