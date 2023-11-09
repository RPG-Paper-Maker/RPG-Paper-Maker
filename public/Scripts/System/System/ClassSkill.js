/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
/** @class
 *  A skill to learn for a specific class.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  class skill
 */
class ClassSkill extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the class skill.
     *  @param {Record<string, any>} - json Json object describing the class skill
     */
    read(json) {
        this.id = json.id;
        this.level = json.l;
    }
}
export { ClassSkill };
