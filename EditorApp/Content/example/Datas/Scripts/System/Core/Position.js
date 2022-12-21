/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Portion } from "./Portion.js";
import { Constants, Mathf } from "../Common/index.js";
import { Datas } from "../index.js";
import { Vector3 } from "./Vector3.js";
/** @class
 *  The data class for position.
 *  @extends Portion
 *  @param {number} x - The x position square
 *  @param {number} y - The y position square
 *  @param {number} z - The z position square
 *  @param {number} yPixels - The y position pixels to add to the square y
 *  @param {number} layer - The layer position
 *  @param {number} centerX - The center X position on the square in %
 *  @param {number} centerZ - The center Z position on the square in %
 *  @param {number} angleY - The angle on Y axis in degree
 *  @param {number} angleX - The angle on X axis in degree
 *  @param {number} angleZ - The angle on Z axis in degree
 *  @param {number} scaleX - The scale on X axis multiple
 *  @param {number} scaleY - The scale on Y axis multiple
 *  @param {number} scaleZ - The scale on Z axis multiple
 */
class Position extends Portion {
    constructor(x = 0, y = 0, z = 0, yPixels = 0, layer = 0, centerX = 50, centerZ = 50, angleY = 0, angleX = 0, angleZ = 0, scaleX = 1, scaleY = 1, scaleZ = 1) {
        super(x, y, z);
        this.yPixels = yPixels;
        this.layer = layer;
        this.centerX = centerX;
        this.centerZ = centerZ;
        this.angleY = angleY;
        this.angleX = angleX;
        this.angleZ = angleZ;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleZ = scaleZ;
    }
    /**
     *  Create a position from an array.
     *  @static
     *  @param {number[]} array
     *  @returns {Position}
     */
    static createFromArray(array) {
        return new Position(array[0], array[1], array[3], array[2], array[4], array[5], array[6], array[7], array[8], array[9], array[10], array[11], array[12]);
    }
    /**
     *  Create a position from a three.js vector3.
     *  @static
     *  @param {Vector3} position
     *  @returns {Position}
     */
    static createFromVector3(position) {
        return new Position(Math.floor(position.x / Datas.Systems.SQUARE_SIZE), Math.floor(position.y / Datas.Systems.SQUARE_SIZE), Math.floor(position.z / Datas.Systems.SQUARE_SIZE));
    }
    /**
     *  Test if a position is equal to another.
     *  @returns {boolean}
     */
    equals(position) {
        return super.equals(position) && this.yPixels === position.yPixels &&
            this.layer === position.layer && this.centerX === position.centerX
            && this.centerZ === position.centerZ && this.angleY === position
            .angleY && this.angleX === position.angleX && this.angleZ ===
            position.angleZ && this.scaleX === position.scaleX && this.scaleY ===
            position.scaleY && this.scaleZ === position.scaleZ;
    }
    /**
     *  Get the complete number of Y of a position.
     *   @returns {number}
     */
    getTotalY() {
        return (this.y * Datas.Systems.SQUARE_SIZE) + (this.yPixels * Datas
            .Systems.SQUARE_SIZE / 100);
    }
    /**
     *  Get the complete number of pixels for x center.
     *  @returns {number}
     */
    getPixelsCenterX() {
        return Math.floor(this.centerX * Datas.Systems.SQUARE_SIZE / 100);
    }
    /**
     *  Get the complete number of pixels for z center.
     *  @returns {number}
     */
    getPixelsCenterZ() {
        return Math.floor(this.centerZ * Datas.Systems.SQUARE_SIZE / 100);
    }
    /**
     *  Get the global portion of a json position.
     *  @returns {Portion}
     */
    getGlobalPortion() {
        return new Portion(Math.floor(this.x / Constants.PORTION_SIZE), Math.floor(this.y / Constants.PORTION_SIZE), Math.floor(this.z / Constants.PORTION_SIZE));
    }
    /**
     *  Transform a position to a Vector3.
     *  @returns {Vector3}
     */
    toVector3(center = true) {
        return new Vector3((this.x * Datas.Systems.SQUARE_SIZE) + (center ? (this.centerX / 100
            * Datas.Systems.SQUARE_SIZE) : 0), (this.y * Datas.Systems.SQUARE_SIZE) + (this.yPixels * Datas.Systems
            .SQUARE_SIZE / 100), (this.z * Datas.Systems.SQUARE_SIZE) + (center ? (this.centerZ / 100
            * Datas.Systems.SQUARE_SIZE) : 0));
    }
    /**
     *  Transform a position to a scaling Vector3.
     *  @returns {Vector3}
     */
    toScaleVector() {
        return new Vector3(this.scaleX, this.scaleY, this.scaleZ);
    }
    /**
     *  Transform a position to index position on X/Z axis (used for map
     *  portion bounding boxes).
     *  @returns {number}
     */
    toIndex() {
        return (this.x % Constants.PORTION_SIZE) + (Mathf.mod(this.y, Constants
            .PORTION_SIZE) * Constants.PORTION_SIZE) + ((this.z % Constants
            .PORTION_SIZE) * Constants.PORTION_SIZE * Constants.PORTION_SIZE);
    }
}
export { Position };
