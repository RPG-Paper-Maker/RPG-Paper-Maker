import { Base } from "./Base.js";
import { DynamicValue } from "./DynamicValue.js";
import { System } from "../index.js";
/** @class
 *  A progression table.
 *  @extends System.Base
 *  @param {number} [id=undefined] - The ID
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  progression table
 */
declare class ProgressionTable extends Base {
    id: number;
    initialValue: DynamicValue;
    finalValue: DynamicValue;
    equation: number;
    table: Record<string, any>;
    start: number;
    change: number;
    duration: number;
    constructor(id?: number, json?: Record<string, any>);
    /**
     *  Assign the default members.
     *  @param {number} id
     */
    setup(id: number): void;
    /**
     *  Create a new System progression table.
     *  @static
     *  @param {System.DynamicValue} i - The initial value
     *  @param {System.DynamicValue} f - The final value
     *  @param {number} equation - The equation kind
     *  @returns {ProgressionTable}
     */
    static create(i: System.DynamicValue, f: System.DynamicValue, equation: number): ProgressionTable;
    /**
     *  Create a new System progression table from numbers values.
     *  @static
     *  @param {number} i - The initial value
     *  @param {number} f - The final value
     *  @param {number} equation - The equation kind
     *  @returns {ProgressionTable}
     */
    static createFromNumbers(i: number, f: number, equation: number): ProgressionTable;
    /**
     *  Read the JSON associated to the progression table.
     *  @param {Record<string, any>} - json Json object describing the progression table
     */
    read(json: Record<string, any>): void;
    /**
     *  Initialize this progression table.
     *  @param {System.DynamicValue} i - The initial value
     *  @param {System.DynamicValue} f - The final value
     *  @param {number} equation - The equation kind
     */
    initialize(i: System.DynamicValue, f: System.DynamicValue, equation: number): void;
    /**
     *  Get the progression at a current value.
     *  @param {number} current - The current value
     *  @param {number} f - The final value
     *  @param {boolean} [decimal=false] - Indicate if the return should have
     *  decimal or not
     *  @returns {number}
     */
    getProgressionAt(current: number, f: number, decimal?: boolean): number;
    /**
     *  The easing linear function
     *  @param {number} x
     *  @returns {number}
     */
    easingLinear(x: number): number;
    /**
     *  The easing quadratic in function.
     *   @param {number} x
     *   @returns {number}
     */
    easingQuadraticIn(x: number): number;
    /**
     *  The easing quadratic out function.
     *  @param {number} x
     *  @returns {number}
     */
    easingQuadraticOut(x: number): number;
    /**
     *  The easing cubic in function.
     *  @param {number} x
     *  @returns {number}
     */
    easingCubicIn(x: number): number;
    /**
     *  The easing cubic out function.
     *  @param {number} x
     *  @returns {number}
     */
    easingCubicOut(x: number): number;
    /**
     *  The easing quartic in function.
     *  @param {number} x
     *  @returns {number}
     */
    easingQuarticIn(x: number): number;
    /**
     *  The easing quartic out function.
     *  @param {number} x
     *  @returns {number}
     */
    easingQuarticOut(x: number): number;
    /**
     *  The easing quintic in function.
     *  @param {number} x
     *  @returns {number}
     */
    easingQuinticIn(x: number): number;
    /**
     *  The easing quintic out function.
     *  @param {number} x
     *  @returns {number}
     */
    easingQuinticOut(x: number): number;
}
export { ProgressionTable };
