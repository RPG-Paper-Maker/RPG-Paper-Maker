import { Icon } from "./Icon.js";
/** @class
 *  A currency of the game.
 *  @extends {System.Icon}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  currency
 */
declare class Currency extends Icon {
    constructor(json?: Record<string, any>);
}
export { Currency };
