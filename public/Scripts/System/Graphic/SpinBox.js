/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Graphic, Manager } from "../index.js";
import { Enum, Utils } from '../Common/index.js';
import { Base } from './Base.js';
/** @class
 *  The graphic displaying spinbox inside.
 *  @extends Graphic.Base
 */
class SpinBox extends Base {
    constructor(value, times = true) {
        super();
        this.times = times;
        this.graphicTimes = new Graphic.Text("x");
        this.setValue(value);
    }
    /**
     *  Update value.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    setValue(value) {
        if (this.value !== value) {
            this.value = value;
            this.graphicValue = new Graphic.Text(Utils.numToString(value), {
                align: this.times ? Enum.Align.Right : Enum.Align.Center
            });
            Manager.Stack.requestPaintHUD = true;
        }
    }
    /**
     *  Drawing the skill or item use informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x, y, w, h) {
        this.draw(x, y, w, h);
    }
    /**
     *  Drawing the skill or item use informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x, y, w, h) {
        if (this.times) {
            this.graphicTimes.draw(x, y, w, h);
        }
        this.graphicValue.draw(x, y, w, h);
    }
}
export { SpinBox };
