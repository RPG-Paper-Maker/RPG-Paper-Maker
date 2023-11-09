/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
/**
 * A static class for having a quick access to screen resolution variables and functions;
 *
 * @class ScreenResolution
 */
class ScreenResolution {
    constructor() {
        throw new Error("This is a static class");
    }
    /** Get the pixel position transformation according to screen size
     *   @static
     *   @param {number} x - The position on screen
     *   @returns {number}
     */
    static getScreenX(x) {
        return Math.ceil(ScreenResolution.getDoubleScreenX(x));
    }
    /** Get the pixel position transformation according to screen size
     *   @static
     *   @param {number} y - The position on screen
     *   @returns {number}
     */
    static getScreenY(y) {
        return Math.ceil(ScreenResolution.getDoubleScreenY(y));
    }
    /** Get the pixel position transformation according to screen size (reverse)
     *   @static
     *   @param {number} x - The position on screen
     *   @returns {number}
     */
    static getScreenXReverse(x) {
        return Math.floor(x / ScreenResolution.WINDOW_X);
    }
    /** Get the pixel position transformation according to screen size (reverse)
     *   @static
     *   @param {number} y - The position on screen
     *   @returns {number}
     */
    static getScreenYReverse(y) {
        return Math.floor(y / ScreenResolution.WINDOW_Y);
    }
    /** Get the pixel position transformation according to screen size
     *   @static
     *   @param {number} xy - The position on screen
     *   @returns {number}
     */
    static getScreenXY(xy) {
        return (ScreenResolution.WINDOW_X + ScreenResolution.WINDOW_Y)
            / 2 * xy;
    }
    /** Get the min pixel position transformation according to screen size
     *   @static
     *   @param {number} xy - The position on screen
     *   @returns {number}
     */
    static getScreenMinXY(xy) {
        return xy * Math.min(ScreenResolution.WINDOW_X, ScreenResolution.WINDOW_Y);
    }
    /** Get the pixel position transformation according to screen size, but
     *   without rounding it
     *   @static
     *   @param {number} x - The position on screen
     *   @returns {number}
     */
    static getDoubleScreenX(x) {
        return ScreenResolution.WINDOW_X * x;
    }
    /** Get the pixel position transformation according to screen size, but
     *   without rounding it
     *   @static
     *   @param {number} y - The position on screen
     *   @returns {number}
     */
    static getDoubleScreenY(y) {
        return ScreenResolution.WINDOW_Y * y;
    }
}
ScreenResolution.SCREEN_X = 640;
ScreenResolution.SCREEN_Y = 480;
export { ScreenResolution };
