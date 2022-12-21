import { Enum } from "../Common/index.js";
import DynamicValueKind = Enum.DynamicValueKind;
import { System } from "../index.js";
import { StructIterator } from "../EventCommand/index.js";
interface StructJSON {
    k: DynamicValueKind;
    v: any;
    x: StructJSON;
    y: StructJSON;
    z: StructJSON;
    customStructure?: Record<string, any>;
    customList?: Record<string, any>;
}
/** @class
 *  The class who handle dynamic value.
 *  @extends {System.Base}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the value
 */
declare class DynamicValue extends System.Base {
    kind: DynamicValueKind;
    value: any;
    customStructure: Record<string, System.DynamicValue>;
    customList: System.DynamicValue[];
    x: System.DynamicValue;
    y: System.DynamicValue;
    z: System.DynamicValue;
    constructor(json?: Record<string, any>);
    /**
     *  Create a new value from kind and value.
     *  @static
     *  @param {DynamicValueKind} [k=DynamicValueKind.None] - The kind of value
     *  @param {any} [v=0] - The value
     *  @returns {SystemValue}
     */
    static create(k?: DynamicValueKind, v?: any): System.DynamicValue;
    /**
     *  Create a new value from a command and iterator.
     *  @static
     *  @param {any[]} command - The list describing the command
     *  @param {StructIterator} iterator - The iterator
     *  @returns {System.DynamicValue}
     */
    static createValueCommand(command: any[], iterator: StructIterator): System.DynamicValue;
    /**
     *  Create a none value.
     *  @static
     *  @returns {System.DynamicValue}
     */
    static createNone(): System.DynamicValue;
    /**
     *  Create a new value number.
     *  @static
     *  @param {number} n - The number
     *  @returns {System.DynamicValue}
     */
    static createNumber(n: number): System.DynamicValue;
    /**
     *  Create a new value message.
     *  @static
     *  @param {string} m - The message
     *  @returns {System.DynamicValue}
     */
    static createMessage(m: string): System.DynamicValue;
    /**
     *  Create a new value decimal number.
     *  @static
     *  @param {number} n - The number
     *  @returns {System.DynamicValue}
     */
    static createNumberDouble(n: number): System.DynamicValue;
    /**
     *  Create a new value keyBoard.
     *  @static
     *  @param {number} k - The key number
     *  @returns {System.DynamicValue}
     */
    static createKeyBoard(k: number): System.DynamicValue;
    /**
     *  Create a new value switch.
     *  @static
     *  @param {boolean} b - The value of the switch
     *  @returns {System.DynamicValue}
     */
    static createSwitch(b: boolean): System.DynamicValue;
    /**
     *  Create a new value variable.
     *  @static
     *  @param {number} id - The variable ID
     *  @returns {System.DynamicValue}
     */
    static createVariable(id: number): System.DynamicValue;
    /**
     *  Create a new value parameter.
     *  @static
     *  @param {number} id - The parameter ID
     *  @returns {System.DynamicValue}
     */
    static createParameter(id: number): System.DynamicValue;
    /**
     *  Create a new value property.
     *  @static
     *  @param {number} id - The property id
     *  @returns {System.DynamicValue}
     */
    static createProperty(id: number): System.DynamicValue;
    /**
     *  Map a list of parameters so it gets the current properties and
     *  parameters values.
     *  @static
     *  @param {System.DynamicValue[]} parameters
     *  @returns {System.DynamicValue[]}
     */
    static mapWithParametersProperties(parameters: System.DynamicValue[]): System.DynamicValue[];
    /**
     *  Try to read a variable value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @param {number} [n=0] - The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultVariable(json: StructJSON): System.DynamicValue;
    /**
     *  Try to read a number value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @param {number} [n=0] - The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultNumber(json: StructJSON, n?: number): System.DynamicValue;
    /**
     *  Try to read a double number value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @param {number} [n=0] - The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultNumberDouble(json: StructJSON, n?: number): System.DynamicValue;
    /**
     *  Try to read a database value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @param {number} [id=1] - The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultDatabase(json: StructJSON, id?: number): System.DynamicValue;
    /**
     *  Try to read a message value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @param {string} [m=""] - The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultMessage(json: StructJSON, m?: string): System.DynamicValue;
    /**
     *  Try to read a switch value, if not possible put default value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @param {boolean} [s=true] - The default value
     *  @returns {System.DynamicValue}
     */
    static readOrDefaultSwitch(json: StructJSON, s?: boolean): System.DynamicValue;
    /**
     *  Try to read a value, if not possible put none value.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @returns {System.DynamicValue}
     */
    static readOrNone(json: StructJSON): System.DynamicValue;
    /**
     *  Read a value of any kind and return it.
     *  @static
     *  @param {StructJSONDynamicValue} json - The json value
     *  @returns {System.DynamicValue}
     */
    static readFromJSON(json: StructJSON): System.DynamicValue;
    /**
     *  Read the JSON associated to the value
     *  @param {StructJSONDynamicValue} json - Json object describing the value
     */
    read(json: StructJSON): void;
    /**
     *  Get the json value.
     *  @returns {Record<string, any>}
     */
    toJson(): Record<string, any>;
    /**
     *  Get the value
     *  @returns {any}
     */
    getValue<T>(forceVariable?: boolean): any;
    /**
     *  Check if a value is equal to another one
     *  @param {System.DynamicValue} value - The value to compare
     *  @returns {boolean}
     */
    isEqual(value: System.DynamicValue): boolean;
}
export { StructJSON, DynamicValue };
