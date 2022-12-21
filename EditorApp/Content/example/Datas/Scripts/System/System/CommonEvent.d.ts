import { Base } from "./Base.js";
import { Parameter } from "./Parameter.js";
/** @class
 *   An event that can be called.
 *   @param {Record<string, any>} - [json] json object describing the event
 */
declare class CommonEvent extends Base {
    parameters: Parameter[];
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the event.
     *  @param {Record<string, any>} - json Json object describing the event
     */
    read(json: Record<string, any>): void;
}
export { CommonEvent };
