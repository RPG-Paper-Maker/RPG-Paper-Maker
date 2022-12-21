import { System } from "../index.js";
import { MapObject } from "../Core/index.js";
import { Base } from "./Base.js";
/** @class
 *  An event command for sarting shop menu.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
declare class StartShopMenu extends Base {
    buyOnly: System.DynamicValue;
    shopID: System.DynamicValue;
    items: System.ShopItem[];
    isRestock: boolean;
    constructor(command: any[], isRestock?: boolean);
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any>;
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState: Record<string, any>, object: MapObject, state: number): number;
}
export { StartShopMenu };
