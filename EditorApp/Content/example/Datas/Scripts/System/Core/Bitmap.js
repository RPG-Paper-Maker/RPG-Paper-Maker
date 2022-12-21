/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "../index.js";
import { ScreenResolution } from "../Common/index.js";
import { Stack } from "../Manager/index.js";
/** @class
 *  A bitmap is something that can be drawn on the HUD. It can be a window,
 *  a text, an image...
 *  @param {number} [x=0] - x coord of the bitmap
 *  @param {number} [y=0] - y coord of the bitmap
 *  @param {number} [w=0] - w coord of the bitmap
 *  @param {number} [h=0] - h coord of the bitmap
 */
class Bitmap {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.setX(x);
        this.setY(y);
        this.setW(w);
        this.setH(h);
    }
    /**
     *  Set the x value.
     *  @param {number} x - The x value
     *  @param {boolean} [min=false] - If checked, transform screen value with min
     *  x y
     */
    setX(x, min = false) {
        this.oX = x;
        this.x = min ? ScreenResolution.getScreenMinXY(x) : ScreenResolution
            .getScreenX(x);
        Stack.requestPaintHUD = true;
    }
    /**
     *  Set the y value.
     *  @param {number} y - The y value
     *  @param {boolean} [min=false] - If checked, transform screen value with min
     *  x y
     */
    setY(y, min = false) {
        this.oY = y;
        this.y = min ? ScreenResolution.getScreenMinXY(y) : ScreenResolution
            .getScreenY(y);
        Stack.requestPaintHUD = true;
    }
    /**
     *  Set the w value.
     *  @param {number} w - The w value
     *  @param {boolean} [min=false] - If checked, transform screen value with min
     *  x y
     */
    setW(w, min = false) {
        this.oW = w;
        this.w = min ? ScreenResolution.getScreenMinXY(w) : ScreenResolution
            .getScreenX(w);
        Stack.requestPaintHUD = true;
    }
    /**
     *  Set the h value.
     *  @param {number} h - The h value
     *  @param {boolean} [min=false] - If checked, transform screen value with min
     *  x y
     */
    setH(h, min = false) {
        this.oH = h;
        this.h = min ? ScreenResolution.getScreenMinXY(h) : ScreenResolution
            .getScreenY(h);
        Stack.requestPaintHUD = true;
    }
    /**
     *  Set the position to the left.
     */
    setLeft(offset = 0) {
        this.setX(offset);
    }
    /**
     *  Set the position to the top.
     */
    setTop(offset = 0) {
        this.setY(offset);
    }
    /**
     *  Set the position to the right.
     */
    setRight(faceset = false, offset = 0) {
        this.oX = ScreenResolution.SCREEN_X - offset - (faceset ? Datas.Systems
            .facesetScalingWidth : this.oW);
        this.x = ScreenResolution.getScreenX(ScreenResolution.SCREEN_X - offset)
            - ScreenResolution.getScreenMinXY(faceset ? Datas.Systems
                .facesetScalingWidth : this.oW);
        Stack.requestPaintHUD = true;
    }
    /**
     *  Set the position to the bot.
     */
    setBot(faceset = false, offset = 0) {
        this.setY(ScreenResolution.SCREEN_Y - (faceset ? Datas.Systems
            .facesetScalingHeight : this.oH) - offset);
    }
    /**
     *  Set all the coords values.
     *  @param {number} x - The x value
     *  @param {number} y - The y value
     *  @param {number} w - The w value
     *  @param {number} h - The h value
     */
    setCoords(x, y, w, h) {
        this.setX(x);
        this.setY(y);
        this.setW(w);
        this.setH(h);
    }
    /**
     *  Check if x and y coords are inside.
     *  @param {number} x
     *  @param {number} y
     *  @returns {boolean}
     */
    isInside(x, y) {
        return x >= this.x && x <= (this.x + this.w) && y >= this.y && y <= (this.y + this.h);
    }
}
export { Bitmap };
