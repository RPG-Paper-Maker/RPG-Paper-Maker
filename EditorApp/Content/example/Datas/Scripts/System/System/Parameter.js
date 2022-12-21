/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils } from "../Common/index.js";
var DynamicValueKind = Enum.DynamicValueKind;
import { Base } from "./Base.js";
import { DynamicValue } from "./DynamicValue.js";
/** @class
 *  A parameter of a reaction.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  parameter value
 */
class Parameter extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the parameters.
     *  @static
     *  @param {Record<string, any>} - json Json object describing the parameters
     *  @returns {System.Parameter[]}
     */
    static readParameters(json) {
        let list = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.p, []),
            listIDs: list, cons: Parameter });
        return list;
    }
    /**
     *  Read the parameters with default values.
     *  @param {Record<string, any>} - json Json object describing the object
     *  @param {System.Parameter[]} list - List of all the parameters default
     *  @returns {Parameter[]}
     */
    static readParametersWithDefault(json, list) {
        let jsonParameters = json.p;
        let l = jsonParameters.length;
        let parameters = new Array(l + 1);
        let jsonParameter, parameter;
        for (let i = 0, l = jsonParameters.length; i < l; i++) {
            jsonParameter = jsonParameters[i];
            parameter = new Parameter();
            parameter.readDefault(jsonParameter.v);
            if (parameter.value.kind === DynamicValueKind.Default) {
                parameter = list[i + 1];
            }
            parameters[jsonParameter.id] = parameter;
        }
        return parameters;
    }
    /**
     *  Read the JSON associated to the parameter value.
     *  @param {Record<string, any>} - json Json object describing the parameter
     *  value
     */
    read(json) {
        this.value = new DynamicValue(json.d);
    }
    /**
     *  Read the JSON associated to the parameter default value.
     *  @param {Record<string, any>} - json Json object describing the default value
     */
    readDefault(json) {
        this.value = new DynamicValue(json);
    }
    /**
     *  Check if the parameter is equal to another one
     *  @param {Parameter} parameter - The parameter to compare
     *  @returns {boolean}
     */
    isEqual(parameter) {
        return (this.value === parameter.value && this.kind === parameter.kind);
    }
}
export { Parameter };
