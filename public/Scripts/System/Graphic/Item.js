/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { System, Graphic, Datas } from '../index.js';
import { Utils, Enum, Constants, Mathf, ScreenResolution } from '../Common/index.js';
var Align = Enum.Align;
/** @class
 *  The graphic displaying all the items information in the inventory menu.
 *  @param {Item} item - The current selected item
 *  @param {number} nbItem - The number of occurence of the selected item
 */
class Item extends Base {
    constructor(item, { nbItem, possible = true, showSellPrice = false } = {}) {
        super();
        this.item = item;
        // All the graphics
        nbItem = Utils.isUndefined(nbItem) ? item.nb : nbItem;
        this.graphicName = Graphic.TextIcon.createFromSystem("", this.item.system, {}, possible ? {} : { color: System.Color.GREY });
        this.updateName(nbItem);
        if (Utils.isUndefined(item.shop)) {
            this.graphicNb = new Graphic.Text("x" + nbItem, { align: Align.Right });
        }
        this.graphicInformations = new Graphic.SkillItem(this.item.system);
        this.graphicCurrencies = [];
        if (!Utils.isUndefined(item.shop) || showSellPrice) {
            let price = showSellPrice ? item.system.getPrice() : item.shop.getPrice();
            this.graphicCurrencies = [];
            let graphic;
            for (let id in price) {
                let [kind, value] = price[id];
                graphic = Graphic.TextIcon.createFromSystem(Mathf
                    .numberWithCommas(showSellPrice ? Math.round(Datas.Systems
                    .priceSoldItem.getValue() * value / 100) : value), kind === Enum.DamagesKind.Currency ? Datas.Systems
                    .getCurrency(parseInt(id)) : null, { align: Align
                        .Right }, possible ? {} : { color: System.Color.GREY });
                this.graphicCurrencies.push(graphic);
            }
        }
    }
    /**
     *  Update the item name (+ item number if shop).
     *  @param {number} [nbItem=undefined]
     */
    updateName(nbItem) {
        nbItem = Utils.isUndefined(nbItem) ? this.item.nb : nbItem;
        this.graphicName.setText(this.item.system.name() + (!Utils.isUndefined(this.item.shop) && nbItem !== -1 ? Constants.STRING_SPACE + Constants
            .STRING_BRACKET_LEFT + nbItem + Constants.STRING_BRACKET_RIGHT : ""));
    }
    /**
     *  Update the game item number.
     */
    updateNb() {
        this.graphicNb.setText("x" + this.item.nb);
    }
    /**
     *  Drawing the item in choice box.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x, y, w, h) {
        this.graphicName.draw(x, y, w, h);
        let offset = 0;
        let graphic;
        for (let i = this.graphicCurrencies.length - 1; i >= 0; i--) {
            graphic = this.graphicCurrencies[i];
            graphic.draw(x - offset, y, w, h);
            offset += graphic.getWidth() + ScreenResolution.getScreenMinXY(Constants.MEDIUM_SPACE);
        }
        if (this.graphicNb) {
            this.graphicNb.draw(x - offset, y, w, h);
        }
    }
    /**
     *  Drawing the item description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x, y, w, h) {
        this.graphicInformations.draw(x, y, w, h);
    }
}
export { Item };
