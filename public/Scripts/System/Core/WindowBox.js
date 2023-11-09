/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Bitmap } from './Bitmap.js';
import { Datas } from '../index.js';
import { Platform, ScreenResolution, Utils } from '../Common/index.js';
/**
 * The class for window boxes.
 *
 * @class WindowBox
 * @extends {Bitmap}
 */
class WindowBox extends Bitmap {
    /**
     *
     * @param {number} x - The x coordinates
     * @param {number} y - The y coordinates
     * @param {number} w - The width coordinates
     * @param {number} h - The height coordinates
     * @param {WindowBoxOption} [options={}] - the window options
     * @memberof WindowBox
     */
    constructor(x, y, w, h, options = {}) {
        super(x, y, w, h);
        this.content = Utils.defaultValue(options.content, null);
        this.padding = Utils.defaultValue(options.padding, [0, 0, 0, 0]);
        this.limitContent = Utils.defaultValue(options.limitContent, true);
        this.selected = Utils.defaultValue(options.selected, false);
        this.updateDimensions();
        this.bordersOpacity = 1;
        this.backgroundOpacity = 1;
        this.bordersVisible = true;
    }
    /**
     *  Set the x value.
     *  @param {number} x - The x value
     */
    setX(x) {
        super.setX(x);
        if (this.padding) {
            this.updateDimensions();
        }
    }
    /**
     *  Set the y value.
     *  @param {number} y - The y value
     */
    setY(y) {
        super.setY(y);
        if (this.padding) {
            this.updateDimensions();
        }
    }
    /**
     *  Set the w value.
     *  @param {number} w - The w value
     */
    setW(w) {
        super.setW(w);
        if (this.padding) {
            this.updateDimensions();
        }
    }
    /**
     *  Set the h value.
     *  @param {number} h - The h value
     */
    setH(h) {
        super.setH(h);
        if (this.padding) {
            this.updateDimensions();
        }
    }
    /**
     *  Update the content and window dimensions.
     */
    updateDimensions() {
        // Setting content dimensions
        this.contentDimension = [
            ScreenResolution.getScreenX(this.oX + this.padding[0]),
            ScreenResolution.getScreenY(this.oY + this.padding[1]),
            ScreenResolution.getScreenX(this.oW - (2 * this.padding[2])),
            ScreenResolution.getScreenY(this.oH - (2 * this.padding[3]))
        ];
        // Adjusting dimensions
        this.windowDimension = [
            this.oX,
            this.oY,
            this.oW,
            this.oH
        ];
    }
    /**
     *  Update the content.
     */
    update() {
        if (this.content) {
            this.content.update();
        }
    }
    /**
     *  Draw the window.
     *  @param {boolean} [isChoice=false] - Indicate if this window box is used
     *  for a window choices
     *  @param {number[]} [windowDimension - = this.windowDimension] Dimensions
     *  of the window
     *  @param {number[]} [contentDimension - = this.contentDimension] Dimension
     *  of content
     */
    draw(isChoice = false, windowDimension = this
        .windowDimension, contentDimension = this.contentDimension) {
        // Content behind
        if (this.content) {
            this.content.drawBehind(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);
        }
        // Draw box
        Datas.Systems.getCurrentWindowSkin().drawBox(windowDimension, this
            .selected, this.bordersVisible);
        // Draw content
        if (this.content) {
            if (!isChoice && this.limitContent) {
                Platform.ctx.save();
                Platform.ctx.beginPath();
                Platform.ctx.rect(contentDimension[0], contentDimension[1] -
                    ScreenResolution.getScreenY(this.padding[3] / 2), contentDimension[2], contentDimension[3] + ScreenResolution
                    .getScreenY(this.padding[3]));
                Platform.ctx.clip();
            }
            if (isChoice) {
                this.content.drawChoice(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);
            }
            else {
                this.content.draw(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);
            }
            if (!isChoice && this.limitContent) {
                Platform.ctx.restore();
            }
        }
    }
}
WindowBox.NONE_PADDING = [0, 0, 0, 0];
WindowBox.VERY_SMALL_PADDING_BOX = [5, 5, 5, 5];
WindowBox.SMALL_PADDING_BOX = [10, 10, 10, 10];
WindowBox.MEDIUM_PADDING_BOX = [20, 20, 20, 20];
WindowBox.HUGE_PADDING_BOX = [30, 30, 30, 30];
WindowBox.DIALOG_PADDING_BOX = [30, 50, 30, 50];
WindowBox.SMALL_SLOT_PADDING = [10, 5, 10, 5];
WindowBox.SMALL_SLOT_HEIGHT = 30;
WindowBox.LARGE_SLOT_WIDTH = 250;
WindowBox.MEDIUM_SLOT_WIDTH = 200;
WindowBox.SMALL_SLOT_WIDTH = 100;
WindowBox.MEDIUM_SLOT_HEIGHT = 40;
WindowBox.LARGE_SLOT_HEIGHT = 60;
export { WindowBox };
