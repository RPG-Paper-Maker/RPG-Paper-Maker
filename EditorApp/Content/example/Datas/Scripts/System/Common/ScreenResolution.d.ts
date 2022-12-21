/**
 * A static class for having a quick access to screen resolution variables and functions;
 *
 * @class ScreenResolution
 */
declare class ScreenResolution {
    static readonly SCREEN_X: number;
    static readonly SCREEN_Y: number;
    static CANVAS_WIDTH: number;
    static CANVAS_HEIGHT: number;
    static WINDOW_X: number;
    static WINDOW_Y: number;
    constructor();
    /** Get the pixel position transformation according to screen size
     *   @static
     *   @param {number} x - The position on screen
     *   @returns {number}
     */
    static getScreenX(x: number): number;
    /** Get the pixel position transformation according to screen size
     *   @static
     *   @param {number} y - The position on screen
     *   @returns {number}
     */
    static getScreenY(y: number): number;
    /** Get the pixel position transformation according to screen size (reverse)
     *   @static
     *   @param {number} x - The position on screen
     *   @returns {number}
     */
    static getScreenXReverse(x: number): number;
    /** Get the pixel position transformation according to screen size (reverse)
     *   @static
     *   @param {number} y - The position on screen
     *   @returns {number}
     */
    static getScreenYReverse(y: number): number;
    /** Get the pixel position transformation according to screen size
     *   @static
     *   @param {number} xy - The position on screen
     *   @returns {number}
     */
    static getScreenXY(xy: number): number;
    /** Get the min pixel position transformation according to screen size
     *   @static
     *   @param {number} xy - The position on screen
     *   @returns {number}
     */
    static getScreenMinXY(xy: number): number;
    /** Get the pixel position transformation according to screen size, but
     *   without rounding it
     *   @static
     *   @param {number} x - The position on screen
     *   @returns {number}
     */
    static getDoubleScreenX(x: number): number;
    /** Get the pixel position transformation according to screen size, but
     *   without rounding it
     *   @static
     *   @param {number} y - The position on screen
     *   @returns {number}
     */
    static getDoubleScreenY(y: number): number;
}
export { ScreenResolution };
