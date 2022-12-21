/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Utils } from "../Common/index.js";
/** @class
 *  An animation frame element.
 *  @extends System.Base
 *  @param {Record<string, any>}
 */
class AnimationFrameElement extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the animation frame element.
     *  @param {Record<string, any>} - json Json object describing the animation
     *  frame element
     */
    read(json) {
        this.x = Utils.defaultValue(json.x, 0);
        this.y = Utils.defaultValue(json.y, 0);
        this.texRow = Utils.defaultValue(json.tr, 0);
        this.texCol = Utils.defaultValue(json.tc, 0);
        this.zoom = Utils.defaultValue(json.z, 100) / 100;
        this.angle = Utils.defaultValue(json.a, 0);
        this.flip = Utils.defaultValue(json.fv, false);
        this.opacity = Utils.defaultValue(json.o, 100) / 100;
    }
    /**
     *  Draw the animation element.
     *  @param {Picture2D} picture - The picture associated to the animation
     *  @param {Vector2} position - The position on screen for animation
     *  @param {number} rows - The number of rows in the animation texture
     *  @param {number} cols - The number of columns in the animation texture
     */
    draw(picture, position, rows, cols) {
        picture.zoom = this.zoom;
        picture.opacity = this.opacity;
        picture.angle = this.angle;
        picture.centered = true;
        picture.reverse = this.flip;
        let w = picture.oW / cols;
        let h = picture.oH / rows;
        picture.draw({ x: position.x + this.x, y: position.y + this.y, w: w *
                this.zoom, h: h * this.zoom, sx: w * this.texCol, sy: h * this.texRow,
            sw: w, sh: h });
    }
}
export { AnimationFrameElement };
