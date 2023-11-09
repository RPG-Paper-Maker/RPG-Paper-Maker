/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
/** @class
 *  Several textures in a single file.
 */
class TextureBundle {
    constructor() {
        this.list = [];
        this.material = null;
    }
    /**
     *  Set the begining texture.
     *  @param {number} id - The begining texture ID
     *  @param {number[]} point - The begining texture point offset
     */
    setBegin(id, point) {
        this.beginID = id;
        this.beginPoint = point;
    }
    /**
     *  Set the ending texture.
     *  @param {number} id - The ending texture ID
     *  @param {number[]} point - The ending texture point offset
     */
    setEnd(id, point) {
        this.endID = id;
        this.endPoint = point;
    }
    /**
     *  Check which point is on top.
     *  @param {number[]} rect
     *  @param {number[]} point
     *  @returns {boolean}
     */
    isSup(rect, point) {
        if (!rect) {
            return true;
        }
        if (rect[1] > point[1]) {
            return true;
        }
        else if (rect[1] === point[1]) {
            return rect[0] >= point[0];
        }
        return false;
    }
    /**
     *  Check which point is on bot.
     *  @param {number[]} rect
     *  @param {number[]} point
     *  @returns {boolean}
     */
    isInf(rect, point) {
        if (!rect) {
            return true;
        }
        if (rect[1] < point[1]) {
            return true;
        }
        else if (rect[1] === point[1]) {
            return rect[0] <= point[0];
        }
        return false;
    }
    /**
     *  Check if a couple (id, rect) is inside this texture.
     *  @param {number} id
     *  @param {number[]} rect
     *  @returns {boolean}
     */
    isInTexture(id, rect) {
        if (id >= this.beginID && id <= this.endID) {
            if (id === this.beginID) {
                return id === this.endID ? (this.isSup(rect, this.beginPoint) &&
                    this.isInf(rect, this.endPoint)) : this.isSup(rect, this
                    .beginPoint);
            }
            else if (id < this.endID) {
                return true;
            }
            else {
                return this.isInf(rect, this.endPoint);
            }
        }
        return false;
    }
    /**
     *  Add a couple (id, point) inside the list.
     *  @param {number} id
     *  @param {number[]} point
     */
    addToList(id, point) {
        this.list.push([id, point]);
    }
    /**
     *  Get the offset of couple (id, rect).
     *  @param {number} id
     *  @param {number[]} rect
     *  @returns {number}
     */
    getOffset(id, rect) {
        let pair, point;
        for (let i = 0, l = this.list.length; i < l; i++) {
            pair = this.list[i];
            point = pair[1];
            if (id === pair[0] && (rect === null || (point[0] === rect[0] &&
                point[1] === rect[1]))) {
                return i;
            }
        }
        return -1;
    }
}
export { TextureBundle };
