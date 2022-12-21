import { CommonSkillItem } from "./CommonSkillItem.js";
import { WeaponArmorKind } from "./WeaponArmorKind.js";
import { Enum } from "../Common/index.js";
/** @class
 *  An armor of the game.
 *  @extends System.CommonSkillItem
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  armor
 */
declare class Armor extends CommonSkillItem {
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the armor.
     *  @param {Record<string, any>} - json Json object describing the armor
     */
    read(json: Record<string, any>): void;
    /** Get the armor type.
     *  @returns {System.WeaponArmorKind}
     */
    getType(): WeaponArmorKind;
    /**
     *  Get the item kind.
     *  @returns {Enum.ItemKind}
     */
    getKind(): Enum.ItemKind;
}
export { Armor };
