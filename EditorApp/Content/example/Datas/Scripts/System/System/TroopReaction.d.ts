import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import { Reaction } from "./Reaction.js";
/** @class
 *  A troop reaction conditions of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  troop reaction conditions
 */
declare class TroopReaction extends Reaction {
    id: number;
    conditions: System.TroopReactionConditions;
    frequency: Enum.TroopReactionFrequencyKind;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the troop reaction conditions.
     *  @param {Record<string, any>} - json Json object describing the troop
     *  reaction conditions
     */
    read(json: Record<string, any>): void;
}
export { TroopReaction };
