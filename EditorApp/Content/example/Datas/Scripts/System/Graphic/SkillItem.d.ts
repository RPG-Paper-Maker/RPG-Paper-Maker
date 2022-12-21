import { Base } from "./Base.js";
import { System, Graphic } from "../index.js";
import { Picture2D } from "../Core/index.js";
/** @class
 *  The graphic for skill or item displaying.
 *  @extends Graphic.Base
 *  @param {System.CommonSkillItem} system
 */
declare class SkillItem extends Base {
    system: System.CommonSkillItem;
    graphicElements: Picture2D[];
    graphicName: Graphic.TextIcon;
    graphicType: Graphic.Text;
    graphicDescription: Graphic.Text;
    graphicTarget: Graphic.Text;
    graphicEffects: Graphic.Text[];
    graphicCharacteristics: Graphic.Text[];
    constructor(system: System.CommonSkillItem);
    /**
     *  Drawing the skill description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the skill description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number): void;
}
export { SkillItem };
