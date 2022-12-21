import { Icon } from "./Icon.js";
import { DynamicValue } from "./DynamicValue.js";
/** @class
 *  An element of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  element
 */
declare class Element extends Icon {
    efficiency: DynamicValue[];
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the element
     *  @param {Record<string, any>} - json Json object describing the element
     */
    read(json: Record<string, any>): void;
}
export { Element };
