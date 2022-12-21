import { Base } from "./Base.js";
import { Graphic, Core } from "../index.js";
/** @class
 *  The graphic displaying all the items information in the inventory menu.
 *  @param {Item} item - The current selected item
 *  @param {number} nbItem - The number of occurence of the selected item
 */
declare class Item extends Base {
    item: Core.Item;
    graphicName: Graphic.TextIcon;
    graphicNb: Graphic.Text;
    graphicInformations: Graphic.SkillItem;
    graphicCurrencies: Graphic.TextIcon[];
    constructor(item: Core.Item, { nbItem, possible, showSellPrice }?: {
        nbItem?: number;
        possible?: boolean;
        showSellPrice?: boolean;
    });
    /**
     *  Update the item name (+ item number if shop).
     *  @param {number} [nbItem=undefined]
     */
    updateName(nbItem?: number): void;
    /**
     *  Update the game item number.
     */
    updateNb(): void;
    /**
     *  Drawing the item in choice box.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the item description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number): void;
}
export { Item };
