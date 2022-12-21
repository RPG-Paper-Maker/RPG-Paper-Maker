import { Base } from "./Base.js";
import { System } from "../index.js";
/** @class
 *  A property of an object.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  property
 */
declare class Property extends Base {
    id: number;
    initialValue: System.DynamicValue;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the property.
     *  @param {Record<string, any>} - json Json object describing the property
     */
    read(json: Record<string, any>): void;
}
export { Property };
