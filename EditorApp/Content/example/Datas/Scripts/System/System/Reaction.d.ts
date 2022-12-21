import { Base } from "./Base.js";
import { Tree, Node } from "../Core/index.js";
import { System } from "../index.js";
/** @class
 *  A reaction to an event.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  object reaction
 */
declare class Reaction extends Base {
    labels: [System.DynamicValue, Node][];
    idEvent: number;
    blockingHero: boolean;
    commands: Tree;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the object reaction.
     *  @param {Record<string, any>} - json Json object describing the object
     *  reaction
     */
    read(json: Record<string, any>): void;
    /**
     *  Read the JSON children associated to the object reaction.
     *  @param {Record<string, any>} - jsonCommands Json object describing the
     *  object
     *  @param {Node} commands - All the commands (final result)
     */
    readChildrenJSON(jsonCommands: Record<string, any>, commands: Node): void;
    /**
     *  Get the first node command of the reaction.
     *  @returns {Node}
     */
    getFirstCommand(): Node;
}
export { Reaction };
