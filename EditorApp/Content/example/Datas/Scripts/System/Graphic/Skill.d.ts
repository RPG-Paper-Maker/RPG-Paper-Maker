import { Base } from "./Base.js";
import { Graphic, System, Core } from "../index.js";
/** @class
 *  The graphic displaying the player skills informations in skill menu.
 *  @extends Graphic.Base
 *  @param {Skill} skill - The current selected skill
 */
declare class Skill extends Base {
    system: System.Skill;
    graphicName: Graphic.TextIcon;
    graphicCost: Graphic.Text;
    graphicInformations: Graphic.SkillItem;
    constructor(skill: Core.Skill);
    /**
     *  Drawing the skill in choice box.
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
export { Skill };
