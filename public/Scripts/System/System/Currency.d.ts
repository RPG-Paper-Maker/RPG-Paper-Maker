import { System } from "../index.js";
import { Icon } from './Icon.js';
/** @class
 *  A currency of the game.
 *  @extends {System.Icon}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  currency
 */
declare class Currency extends Icon {
    displayInMenu: System.DynamicValue;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the cost.
     *  @param {Record<string, any>} - json Json object describing the cost
     */
    read(json: Record<string, any>): void;
}
export { Currency };
