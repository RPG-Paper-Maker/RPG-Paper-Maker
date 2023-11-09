/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Rectangle } from '../Core/index.js';
import { Constants } from './index.js';
import { Platform } from './Platform.js';
import { ScreenResolution } from './ScreenResolution.js';
/**
 * The static class containing all the utils functions.
 *
 * @class Utils
 */
class Utils {
    constructor() {
        throw new Error("This is a static class!");
    }
    /**
     *  Return default value if undefined, else the value.
     *  @static
     *  @param {any} value - The value
     *  @param {any} defaultValue - The default value
     *  @returns {any}
     */
    static defaultValue(value, defaultValue) {
        return this.isUndefined(value) ? defaultValue : value;
    }
    /** Check if the value is undefined
    *   @static
    *   @param {any} value - The value
    *   @returns {boolean}
    */
    static isUndefined(value) {
        return typeof value === Constants.UNDEFINED;
    }
    /** Check if the value is a number
    *   @static
    *   @param {any} value - The value
    *   @returns {boolean}
    */
    static isNumber(value) {
        return typeof value === Constants.NUMBER;
    }
    /** Check if the value is a string
     *   @static
     *   @param {any} value - The value
     *   @returns {boolean}
     */
    static isString(value) {
        return typeof value === Constants.STRING;
    }
    /** Convert a number to boolean
     *   @static
     *   @param {number} num - The number
     *   @returns {boolean}
     */
    static numToBool(num) {
        return num === Constants.NUM_BOOL_TRUE;
    }
    /** Convert a boolean to number
     *   @static
     *   @param {boolean} b - The boolean
     *   @returns {number}
     */
    static boolToNum(b) {
        return b ? Constants.NUM_BOOL_TRUE : Constants.NUM_BOOL_FALSE;
    }
    /** Convert number to string
     *   @static
     *   @param {number} n - The number
     *   @returns {string}
     */
    static numToString(n) {
        return "" + n;
    }
    /** Try catch for async functions
     *   @static
     *   @param {function} func - The async function to apply
     *   @returns {Promise<any>}
     */
    static async tryCatch(func, that) {
        try {
            return await func.call(that);
        }
        catch (e) {
            window.onerror(null, null, null, null, e);
        }
    }
    /** Return a string of the date by passing all the seconds
     *   @static
     *   @param {number} total - Total number of seconds
     *   @returns {string}
     */
    static getStringDate(total) {
        return (this.formatNumber(Math.floor(total / 3600), 4) + Constants
            .STRING_COLON + this.formatNumber(Math.floor((total % 3600) / 60), 2) + Constants.STRING_COLON + this.formatNumber(Math.floor(total % 60), 2));
    }
    /** Return the string of a number and parse with 0 according to a given size
     *  @static
     *  @param {number} num - Number
     *  @param {number} size - Max number to display
     *  @returns {string}
     */
    static formatNumber(num, size) {
        return ('000000000' + num).substr(-size);
    }
    /** Return the string of a id + name of a system element.
     *  @static
     *  @param {number} id
     *  @param {string} name
     *  @returns {string}
     */
    static getIDName(id, name) {
        return "<> " + this.formatNumber(id, 4) + ": " + name;
    }
    /** Create a new array list initialed with null everywhere
     *   @static
     *   @param {number} size - The list size
     *   @returns {any[]}
     */
    static fillNullList(size) {
        let list = new Array(size);
        for (let i = 0; i < size; i++) {
            list[i] = null;
        }
        return list;
    }
    /**
     * Read a json list and create a System list sorted by ID, index, and return max ID.
     *
     * @static
     * @param {systemJsonList} json - The json list to read
     * @return {*}  {number}
     * @memberof Utils
     */
    static readJSONSystemList(json) {
        let jsonElement;
        let maxID = 0;
        let id, element;
        for (let i = 0, l = json.list.length; i < l; i++) {
            jsonElement = json.list[i];
            id = jsonElement.id;
            if (Utils.isUndefined(json.listHash)) {
                element = Utils.isUndefined(json.cons) ? json.func.call(null, jsonElement)
                    : new json.cons(jsonElement);
                if (!Utils.isUndefined(json.listIDs)) {
                    json.listIDs[jsonElement.id] = element;
                }
                if (!Utils.isUndefined(json.listIndexes)) {
                    json.listIndexes[i] = json.indexesIDs ? id : element;
                }
            }
            else {
                json.listHash[jsonElement[Constants.JSON_KEY]] = Utils.isUndefined(json.cons) ? json.func.call(null, jsonElement) : new json.cons(jsonElement[Constants.JSON_VALUE]);
            }
            maxID = Math.max(id, maxID);
        }
        return maxID;
    }
    /**
     *  Get the number of fields of an object
     *  @static
     *  @param {Object} obj - The object to count fields
     *  @returns {number}
     */
    static countFields(obj) {
        if (obj.__count__ !== undefined) { // Old FF
            return obj.__count__;
        }
        if (Object.keys) { // ES5
            return Object.keys(obj).length;
        }
        // Everything else:
        let c = 0;
        for (let p in obj) {
            if (obj.hasOwnProperty(p)) {
                c += 1;
            }
        }
        return c;
    }
    /**
     *  Get the index of an object in a array containing a property with a
     *  specific value.
     *  @static
     *  @param {Object[]} array - The array to check
     *  @param {string} attr - The attribute of the object to check
     *  @param {any} value - The value to check on the object attribute
     *  @returns {number}
     */
    static indexOfProp(array, attr, value) {
        for (let i = 0, l = array.length; i < l; i++) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Fill the screen with the said color
     *
     * @static
     * @param {number} r - the red color
     * @param {number} g - the green color
     * @param {number} b - the blue color
     * @param {number} a - the alpha value
     * @memberof Utils
     */
    static fillScreen(r, g, b, a) {
        let color = `rgba(${r},${g},${b},${a})`;
        const rect = new Rectangle(0, 0, ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT);
        Platform.ctx.fillStyle = color;
        Platform.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
    /**
      * Remove an element from an array.
      */
    static removeFromArray(array, element) {
        let index = array.indexOf(element);
        if (index === -1) {
            return false;
        }
        else {
            array.splice(index, 1);
            return true;
        }
    }
}
/** Link the fontSize and the fontName to a string that can be used by the
*   canvasHUD
*   @static
*   @param {number} fontSize - The fontSize
*   @param {string} fontName - The fontName
*   @param {boolean} bold - Indicate if the text is bold
*   @param {boolean} italic - Indicate if the text is italic
*   @returns {string}
*/
Utils.createFont = function (fontSize, fontName, bold, italic) {
    return (bold ? "bold " : "") + (italic ? "italic " : "") + fontSize +
        "px " + "\"" + fontName + "\"";
};
export { Utils };
