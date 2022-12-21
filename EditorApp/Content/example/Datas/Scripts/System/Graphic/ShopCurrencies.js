/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Graphic, Datas } from "../index.js";
import { Constants, Mathf, ScreenResolution } from "../Common/index.js";
import { Game } from "../Core/index.js";
/** @class
 *  The graphic displaying all currencies when in shop menu.
 *  @extends Graphic.Base
 */
class ShopCurrencies extends Base {
    constructor() {
        super();
        this.update();
    }
    getWidth() {
        let width = 0;
        for (let i = 0, l = this.currencies.length; i < l; i++) {
            width += this.currencies[i].getWidth();
            if (i < l - 1) {
                width += ScreenResolution.getScreenMinXY(Constants.MEDIUM_SPACE);
            }
        }
        return width;
    }
    /**
     *  Update the currencies.
     */
    update() {
        this.currencies = [];
        let graphic;
        for (let id in Game.current.currencies) {
            graphic = Graphic.TextIcon.createFromSystem(Mathf.numberWithCommas(Game.current.currencies[id]), Datas.Systems.getCurrency(parseInt(id)));
            this.currencies.push(graphic);
        }
    }
    /**
     *  Drawing the content choice.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    drawChoice(x, y, w, h) {
        this.draw(x, y, w, h);
    }
    /**
     *  Drawing the content.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    draw(x, y, w, h) {
        let offset = 0;
        let currency;
        for (let i = 0, l = this.currencies.length; i < l; i++) {
            currency = this.currencies[i];
            currency.draw(x + offset, y, w, h);
            offset += currency.getWidth() + ScreenResolution.getScreenMinXY(Constants.MEDIUM_SPACE);
        }
    }
}
export { ShopCurrencies };
