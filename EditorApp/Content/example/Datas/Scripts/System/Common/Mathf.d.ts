import { Vector2, Vector3 } from "../Core/index.js";
/**
 * The static class for Math related function.
 *
 * @class Mathf
 */
declare class Mathf {
    static OPERATORS_COMPARE: ((a: number, b: number) => boolean)[];
    static OPERATORS_NUMBERS: ((a: number, b: number) => number)[];
    constructor();
    /**
     * Potential Hotspot/Nullipotent
     *
     * @static
     * @template T
     * @param {T[]} array1 - The 1st array to be checked against
     * @param {T[]} array2 - The 2nd array to be checked against
     * @return {*}  {boolean}
     * @memberof Mathf
     */
    static isProperSubsetOf<T>(array1: T[], array2: T[]): boolean;
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to be checked against
     * @param {T[]} array2 - The 2nd array to be checked against
     * @returns {boolean} If array1's a proper superset of array2
     */
    static isProperSupersetOf<T>(array1: T[], array2: T[]): boolean;
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to be checked against
     * @param {T[]} array2 - The 2nd array to be checked against
     * @returns {boolean} If array1's a superset of array2
     */
    static isSupersetOf<T>(array1: T[], array2: T[]): boolean;
    /**
     * Potential Hotspot/Nullipotent
     *
     * @static
     * @template T
     * @param {T[]} array1 -The 1st array to be checked against
     * @param {T[]} array2 -The 2nd array to be checked against
     * @return {*}  {boolean}
     * @memberof Mathf
     */
    static isSubsetOf<T>(array1: T[], array2: T[]): boolean;
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have symmetric difference with
     * @param {T[]} array2 - The 2nd array to have symmetric difference with
     * @returns {T[]} The symmetric difference of array1 and array2
     */
    static symmetricDifference<T>(array1: T[], array2: T[]): T[];
    /**
     * This method changes the original array
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have symmetric difference with
     * @param {T[]} array2 - The 2nd array to have symmetric difference with
     * @returns {T[]} The symmetric difference of array1 and array2
     */
    static symmetricDifferenceInPlace<T>(array1: T[], array2: T[]): T[];
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have union with
     * @param {T[]} array2 - The 2nd array to have union with
     * @returns {T[]} The union of array1 and array2
     */
    static union<T>(array1: T[], array2: T[]): T[];
    /**
     * This method changes the original array
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have union with
     * @param {T[]} array2 - The 2nd array to have union with
     * @returns {T[]} The union of array1 and array2
     */
    static unionInPlace<T>(array1: T[], array2: T[]): T[];
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have difference with
     * @param {T[]} array2 - The 2nd array to have difference with
     * @returns {T[]} The difference of array1 and array2
     */
    static difference<T>(array1: T[], array2: T[]): T[];
    /**
     * This method changes the original array
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have difference with
     * @param {T[]} array2 - The 2nd array to have difference with
     * @returns {T[]} The difference of array1 and array2
     */
    static differenceInPlace<T>(array1: T[], array2: T[]): T[];
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have intersection with
     * @param {T[]} array2 - The 2nd array to have intersection with
     * @returns {T[]} The intersection of array1 and array2
     */
    static intersection<T>(array1: T[], array2: T[]): T[];
    /**
     * This method changes the original array
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array1 - The 1st array to have intersection with
     * @param {T[]} array2 - The 2nd array to have intersection with
     * @returns {T[]} The intersection of array1 and array2
     */
    static intersectionInPlace<T>(array1: T[], array2: T[]): T[];
    /**
     * Potential Hotspot/Nullipotent
     * @author DoubleX @interface
     * @param {T[]} array - The array to be checked against
     * @param {*} elem - The element to be checked against
     * @param {index} fromI - The index in this at which to begin searching
     * @returns {boolean} If array doesn't have elem
     */
    static excludes<T>(array: T[], elem: T, fromI: number): boolean;
    /**
     * Potential Hotspot/Idempotent
     * @author DoubleX @interface
     * @param {T[]} array - The array to be cleared
     */
    static clear<T>(array: T[]): void;
    /** Check if an array is empty.
     *   @static
     *   @param {any[]} array - The array to test
     *   @returns {boolean}
     */
    static isEmpty<T>(array: T[]): boolean;
    /** Get the cos.
     *   @static
     *   @param {number} v - The value
     *   @returns {number}
     */
    static cos(v: number): number;
    /** Get the sin.
     *   @static
     *   @param {number} v - The value
     *   @returns {number}
     */
    static sin(v: number): number;
    /** Give a modulo without negative value.
     *   @static
     *   @param {number} x
     *   @param {number} m
     *   @returns {number}
     */
    static mod(x: number, m: number): number;
    /** Get the list max ID.
     *   @static
     *   @param {number[]} list - A list containing only IDs
     *   @returns {number}
     */
    static getMaxID(list: number[]): number;
    /** Create a random number between min and max.
     *   @static
     *   @param {number} min
     *   @param {number} max
     *   @returns {number}
     */
    static random(min: number, max: number): number;
    /**
     * Clamp a number between two values.
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @author Nio Kasgami
     */
    static clamp(value: number, min: number, max: number): number;
    /** Get random value according to value and variance
     *   @static
     *   @param {number} value
     *   @param {number} variance
     *   @returns {number}
     */
    static variance(value: number, variance: number): number;
    /**
     *  Indicate if a point is inside a rectangle.
     *  @static
     *  @param {Vector2} p - The point to test
     *  @param {number} x1 - The x left point of the rectangle
     *  @param {number} x2 - The x right point of the rectangle
     *  @param {number} y1 - The y top point of the rectangle
     *  @param {number} y2 - The y bottom point of the rectangle
     *  @returns {boolean}
     */
    static isPointOnRectangle(p: Vector2, x1: number, x2: number, y1: number, y2: number): boolean;
    /**
     *  Indicate if a point is inside a triangle.
     *  @static
     *  @param {Vector2} p - The point to test
     *  @param {Vector2} p0 - One of the point of the triangle
     *  @param {Vector2} p1 - One of the point of the triangle
     *  @param {Vector2} p2 - One of the point of the triangle
     *  @returns {boolean}
     */
    static isPointOnTriangle(p: Vector2, p0: Vector2, p1: Vector2, p2: Vector2): boolean;
    /**
     *  Get the orthogonal projection between two vectors.
     *  @static
     *  @param {Vector3} u
     *  @param {Vector3} v
     *  @returns {number}
     */
    static orthogonalProjection(u: Vector3, v: Vector3): number;
    /**
 * Convert a value to a percent.
 *
 * @export
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
    static percentOf(a: number, b: number, large?: boolean): number;
    /**
     * Convert a value to a rounded percent.
     *
     * @export
     * @param {number} a - The value to convert
     * @param {number} b - The target max value
     * @param {boolean} large - convert the percent to a small value (0 ~ 1) or a large value (0 ~ 100)
     * @return {number}
     */
    static roundedPercentOf(a: number, b: number, large?: boolean): number;
    /**
     * Convert a percent to a number
     *
     * @export
     * @param {number} a
     * @param {number} b
     * @param {boolean} [large=false]
     * @return {number}  {number}
     */
    static numberOf(a: number, b: number, large?: boolean): number;
    /**
     * Convert a percent to a rounded number
     *
     * @export
     * @param {number} a
     * @param {number} b
     * @param {boolean} [large=true]
     * @return {number}  {number}
     */
    static roundedNumberOf(a: number, b: number, large?: boolean): number;
    /**
     *  Test if hit.
     *  @param {number} chance
     *  @return {boolean}
     */
    static randomPercentTest(chance: number): boolean;
    /**
     *  Get the number (like currencies values) but with comas included to
     *  separate thousands.
     *  @param {number} x
     *  @return {string}
     */
    static numberWithCommas(x: number): string;
}
export { Mathf };
