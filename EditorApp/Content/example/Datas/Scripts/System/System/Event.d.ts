import { Base } from "./Base.js";
import { System } from "../index.js";
/** @class
 *  An event that an object can react on.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  object event
 */
declare class Event extends Base {
    isSystem: boolean;
    idEvent: number;
    parameters: System.Parameter[];
    reactions: Record<number, System.Reaction>;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the object event
     *  @param {Record<string, any>} - json Json object describing the object event
     */
    read(json: Record<string, any>): void;
    /**
     *  Check if this event is equal to another.
     *  @param {System.Event} event - The event to compare
     *  @returns {boolean}
     */
    isEqual(event: System.Event): boolean;
    /**
     *  Add reactions to the event.
     *  @param {Record<number, System.Reaction>} - reactions The reactions to add
     */
    addReactions(reactions: Record<number, System.Reaction>): void;
}
export { Event };
