/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { CommonSkillItem } from "./CommonSkillItem.js";
import { Datas } from "../index.js";
import { Enum } from "../Common/index.js";
/** @class
 *  An armor of the game.
 *  @extends System.CommonSkillItem
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  armor
 */
class Armor extends CommonSkillItem {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the armor.
     *  @param {Record<string, any>} - json Json object describing the armor
     */
    read(json) {
        super.read(json);
    }
    /** Get the armor type.
     *  @returns {System.WeaponArmorKind}
     */
    getType() {
        return Datas.BattleSystems.getArmorKind(this.type);
    }
    /**
     *  Get the item kind.
     *  @returns {Enum.ItemKind}
     */
    getKind() {
        return Enum.ItemKind.Armor;
    }
}
export { Armor };
