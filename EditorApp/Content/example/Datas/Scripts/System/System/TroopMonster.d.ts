import { System } from "../index.js";
import { Base } from "./Base.js";
/** @class
 *  A troop monster.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  troop monster
 */
declare class TroopMonster extends Base {
    id: number;
    level: System.DynamicValue;
    isSpecificPosition: boolean;
    specificPosition: System.DynamicValue;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the troop monster.
     *  @param {Record<string, any>} - json Json object describing the troop
     *  monster
     */
    read(json: Record<string, any>): void;
}
export { TroopMonster };
