import { Base } from "./Base.js";
import { System } from "../index.js";
/** @class
 *  A parameter of a reaction.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  parameter value
 */
declare class Parameter extends Base {
    value: System.DynamicValue;
    kind: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the parameters.
     *  @static
     *  @param {Record<string, any>} - json Json object describing the parameters
     *  @returns {System.Parameter[]}
     */
    static readParameters(json: Record<string, any>): Parameter[];
    /**
     *  Read the parameters with default values.
     *  @param {Record<string, any>} - json Json object describing the object
     *  @param {System.Parameter[]} list - List of all the parameters default
     *  @returns {Parameter[]}
     */
    static readParametersWithDefault(json: Record<string, any>, list: Parameter[]): Parameter[];
    /**
     *  Read the JSON associated to the parameter value.
     *  @param {Record<string, any>} - json Json object describing the parameter
     *  value
     */
    read(json: Record<string, any>): void;
    /**
     *  Read the JSON associated to the parameter default value.
     *  @param {Record<string, any>} - json Json object describing the default value
     */
    readDefault(json: Record<string, any>): void;
    /**
     *  Check if the parameter is equal to another one
     *  @param {Parameter} parameter - The parameter to compare
     *  @returns {boolean}
     */
    isEqual(parameter: Parameter): boolean;
}
export { Parameter };
