import { System } from "../index.js";
import { Base } from "./Base.js";
/** @class
 *  A random battle of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  random battle
 */
declare class RandomBattle extends Base {
    troopID: System.DynamicValue;
    priority: System.DynamicValue;
    isEntireMap: boolean;
    terrains: System.DynamicValue[];
    currentPriority: number;
    currentNumberSteps: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to random battle.
     *  @param {Record<string, any>} - json Json object describing the random
     *  battle
     */
    read(json: Record<string, any>): void;
    /**
     *  Update the current priority value.
     */
    updateCurrentPriority(): void;
    /**
     *  Update the current number of steps for this random battle.
     */
    updateCurrentNumberSteps(): void;
    /**
     *  Reset the current number of steps for this random battle.
     */
    resetCurrentNumberSteps(): void;
}
export { RandomBattle };
