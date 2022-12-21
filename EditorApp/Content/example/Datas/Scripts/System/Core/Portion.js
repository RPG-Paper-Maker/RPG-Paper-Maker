/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Constants } from "../Common/index.js";
import { Datas } from "../index.js";
/** @class
 *  The data class for portion.
 *  @param {number} x
 *  @param {number} y
 *  @param {number} z
 */
class Portion {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     *  Create a portion from an array.
     *  @static
     *  @param {number[]} array
     *  @returns {Portion}
     */
    static createFromArray(array) {
        return new Portion(array[0], array[1], array[2]);
    }
    /**
     *  Create a portion from a three.js Vector3.
     *   @static
     *   @param {number[]} p - The array position
     *   @returns {number[]}
     */
    static createFromVector3(position) {
        return new Portion(Math.floor(position.x / Datas.Systems.SQUARE_SIZE /
            Constants.PORTION_SIZE), Math.floor(position.y / Datas.Systems
            .SQUARE_SIZE / Constants.PORTION_SIZE), Math.floor(position.z /
            Datas.Systems.SQUARE_SIZE / Constants.PORTION_SIZE));
    }
    /**
     *  Test if a portion is equal to another.
     *  @returns {boolean}
     */
    equals(portion) {
        return this.x === portion.x && this.y === portion.y && this.z ===
            portion.z;
    }
    /**
     *  Get the portion file name.
     *  @returns {string}
     */
    getFileName() {
        return (this.x + "_" + this.y + "_" + this.z + Constants.EXTENSION_JSON);
    }
}
export { Portion };
