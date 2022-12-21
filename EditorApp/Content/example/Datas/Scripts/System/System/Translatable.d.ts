import { EventCommand } from "../index.js";
import { Base } from "./Base.js";
/** @class
 *  A name that can have several translations.
 *  @extends {System.Base}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  name in sevaral langs
 */
declare class Translatable extends Base {
    names: string[];
    constructor(json?: Record<string, any>);
    /**
     *  Assign the default members.
     */
    setup(): void;
    /**
     *  Read the JSON associated to the name in sevaral langs.
     *  @param {Record<string, any>} - json Json object describing the name in
     *  sevaral langs
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the name according to current lang.
     *  @returns {string}
     */
    name(): string;
    /**
     *  Update lang according to a command list and iterator.
     */
    getCommand(command: string[], iterator: EventCommand.StructIterator): void;
}
export { Translatable };
