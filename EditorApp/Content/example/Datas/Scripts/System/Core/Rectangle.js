/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Anchor2D } from "./Anchor2D.js";
/** @class
 *  The data class for anchors.
 *  @property {number} x
 *  @property {number} y
 *  @property {number} width
 *  @property {number} height
 *  @property {Anchor2D} anchor
 *  @param {number} [x=0]
 *  @param {number} [y=0]
 *  @param {number} [width=1]
 *  @param {number} [height=1]
 */
class Rectangle {
    constructor(x = 0, y = 0, width = 1, height = 1) {
        this.setCoords(x, y, width, height);
        const anchorX = Anchor2D.MIDDLE_BOTTOM.x;
        const anchorY = Anchor2D.MIDDLE_BOTTOM.y;
        this.anchor = new Anchor2D(anchorX, anchorY);
    }
    /**
     *  Create a rectangle from an array.
     *  @static
     *  @param {number[]} array
     */
    static createFromArray(array) {
        return new Rectangle(array[0], array[1], array[2], array[3]);
    }
    /**
     *  Move rectangle to x, y.
     *  @param {number} x
     *  @param {number} y
     */
    move(x, y) {
        this.x = x + (this.width * this.anchor.x);
        this.y = y + (this.height * this.anchor.y);
    }
    /**
     *  Resize rectangle with width and height value.
     *  @param {number} width
     *  @param {number} height
     */
    resize(width, height) {
        this.width = width;
        this.height = height;
    }
    /**
     *  Move and resize rectangle.
     *  @param {number} x
     *  @param {number} y
     *  @param {number} width
     *  @param {number} height
     */
    set(x, y, width, height) {
        this.move(x, y);
        this.resize(width, height);
    }
    /**
     *  Set rectangle coords.
     *  @param {number} x
     *  @param {number} y
     *  @param {number} width
     *  @param {number} height
     */
    setCoords(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**
     *  Set the anchor x, y.
     *  @param {number} x
     *  @param {number} y
     */
    setAnchor(x, y) {
        this.anchor.set({ x, y });
    }
    /**
     *  Preset anchor.
     *  @param {{ x: - number, y: number }} anchorPreset
     */
    presetAnchor(anchorPreset) {
        this.anchor.set(anchorPreset);
    }
    /**
     *  Check if x and y are inside the rectangle.
     *  @param {number} x
     *  @param {number} y
     *  @returns {boolean}
     */
    isInside(x, y) {
        return x >= this.x && x <= (this.x + this.width) && y >= this.y && (y <=
            this.y + this.height);
    }
}
export { Rectangle };
