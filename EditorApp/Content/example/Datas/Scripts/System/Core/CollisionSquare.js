/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "../index.js";
import { Utils } from "../Common/index.js";
/** @class
 *  A collision settings in a texture square.
*/
class CollisionSquare {
    constructor() {
        this.rect = [0, 0, Datas.Systems.SQUARE_SIZE, Datas.Systems.SQUARE_SIZE];
        this.left = true;
        this.right = true;
        this.top = true;
        this.bot = true;
        this.terrain = 0;
    }
    /**
     *  Union of the collision squares.
     *  @static
     *  @param {number[][]} squares - All the squares and their corresponding
     *  rects
     *  @param {number} l - The squares numbers
     *  @param {number} w - The number of squares width
     *  @param {number} h - The number of squares height
     *  @returns {number[][]}
     */
    static unionSquares(squares, l, w, h) {
        let boolGrid = new Array(l);
        let result = new Array;
        let i, j, k, square;
        for (j = 0; j < h; j++) {
            k = j * w;
            for (i = 0; i < w; i++) {
                square = squares[i + k];
                if (square !== null) {
                    if (square[0] === 0 || square[1] === 0 || square[0] +
                        square[2] === Datas.Systems.SQUARE_SIZE || square[1] +
                        square[3] === Datas.Systems.SQUARE_SIZE) {
                        boolGrid[i + k] = true;
                    }
                    else {
                        square[0] = square[0] + Datas.Systems.SQUARE_SIZE * i;
                        square[1] = square[1] + Datas.Systems.SQUARE_SIZE * j;
                        result.push(square);
                        boolGrid[i + k] = false;
                    }
                }
                else {
                    boolGrid[i + k] = false;
                }
            }
        }
        let s, a, b, c, tempW, tempH, kk, m, temp, tempArray;
        for (j = 0; j < h; j++) {
            k = j * w;
            for (i = 0; i < w; i++) {
                if (boolGrid[i + k]) {
                    s = squares[i + k];
                    square = [s[0], s[1], s[2], s[3]];
                    square[0] = square[0] + Datas.Systems.SQUARE_SIZE * i;
                    square[1] = square[1] + Datas.Systems.SQUARE_SIZE * j;
                    boolGrid[i + k] = false;
                    tempW = -1;
                    for (a = i + 1; a < w && tempW === -1; a++) {
                        c = false;
                        if (boolGrid[a + k]) {
                            if (squares[a + k - 1][0] + squares[a + k - 1][2]
                                === Datas.Systems.SQUARE_SIZE && squares[a + k][0] === 0) {
                                if (squares[a + k][1] === squares[a + k - 1][1]
                                    && squares[a + k][3] === squares[a + k - 1][3]) {
                                    c = true;
                                    boolGrid[a + k] = false;
                                    square[2] = square[2] + squares[a + k][2];
                                }
                            }
                        }
                        if (!c || a + 1 >= w) {
                            tempW = a - i + (c ? 1 : 0);
                        }
                    }
                    tempH = -1;
                    for (b = j + 1; b < h && tempH === -1; b++) {
                        kk = b * w;
                        c = true;
                        for (a = i; a < i + tempW; a++) {
                            if (!(boolGrid[a + kk] && squares[a + kk - w][1] +
                                squares[a + kk - w][3] === Datas.Systems
                                .SQUARE_SIZE && squares[a + kk][1] === 0 &&
                                squares[a + kk][0] === squares[a + kk - w][0] &&
                                squares[a + kk][2] === squares[a + kk - w][2])) {
                                c = false;
                            }
                        }
                        if (c) {
                            for (m = i; m < i + tempW; m++) {
                                boolGrid[m + kk] = false;
                            }
                            tempArray = squares[i + kk];
                            if (tempArray === null) {
                                temp = 0;
                            }
                            else {
                                temp = tempArray[3];
                            }
                            square[3] = square[3] + temp;
                            boolGrid[i + kk] = false;
                        }
                        if (!c || b + 1 >= h) {
                            tempH = b - j + (c ? 1 : 0);
                        }
                    }
                    result.push(square);
                }
            }
        }
        return result;
    }
    /**
     *  Get the BB according to rect and size.
     *  @static
     *  @param {number[]} rect - The rect
     *  @param {number} w - The number of squares width
     *  @param {number} h - The number of squares height
     */
    static getBB(rect, w, h) {
        return [(rect[0] - ((w * Datas.Systems.SQUARE_SIZE) - rect[0] - rect[2])) / 2, (h * Datas.Systems.SQUARE_SIZE) - rect[1] - (rect[3] / 2), 0,
            rect[2], rect[3], 1, 0, 0, 0];
    }
    /**
     * Read the JSON associated to the collision square.
     *
     * @param {Record<string, any>} json  - Json object describing the collision square
     * @memberof CollisionSquare
     */
    read(json) {
        let rect = json.rec;
        this.left = Utils.defaultValue(json.l, true);
        this.right = Utils.defaultValue(json.r, true);
        this.top = Utils.defaultValue(json.t, true);
        this.bot = Utils.defaultValue(json.b, true);
        this.terrain = Utils.defaultValue(json.terrain, 0);
        if (!Utils.isUndefined(rect)) {
            this.rect = rect === null ? null : [Math.round(rect[0] * Datas
                    .Systems.SQUARE_SIZE / 100), Math.round(rect[1] * Datas.Systems
                    .SQUARE_SIZE / 100), Math.round(rect[2] * Datas.Systems
                    .SQUARE_SIZE / 100), Math.round(rect[3] * Datas.Systems
                    .SQUARE_SIZE / 100)];
        }
    }
    /**
     *  Indicate if all the direction are OK.
     *  @returns {boolean}
     */
    hasAllDirections() {
        return this.left && this.right && this.top && this.bot;
    }
}
export { CollisionSquare };
