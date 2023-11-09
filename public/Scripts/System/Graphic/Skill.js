/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { Graphic, Datas } from '../index.js';
import { Enum } from '../Common/index.js';
var Align = Enum.Align;
/** @class
 *  The graphic displaying the player skills informations in skill menu.
 *  @extends Graphic.Base
 *  @param {Skill} skill - The current selected skill
 */
class Skill extends Base {
    constructor(skill) {
        super();
        this.system = Datas.Skills.get(skill.id);
        this.graphicName = Graphic.TextIcon.createFromSystem(this.system.name(), this.system);
        this.graphicCost = new Graphic.Text(this.system.getCostString(), { align: Align.Right });
        this.graphicInformations = new Graphic.SkillItem(this.system);
    }
    /**
     *  Drawing the skill in choice box.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x, y, w, h) {
        this.graphicName.draw(x, y, w, h);
        this.graphicCost.draw(x, y, w, h);
    }
    /**
     *  Drawing the skill description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x, y, w, h) {
        this.graphicInformations.draw(x, y, w, h);
        this.graphicCost.draw(x, y, w, 0);
    }
}
export { Skill };
