import { Translatable } from "./Translatable.js";
/** @class
 *  A weapon/armor kind of the game.
 *  @extends System.Translatable
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  weapon / armor kind
 */
declare class WeaponArmorKind extends Translatable {
    equipments: boolean[];
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the weapon / armor kind.
     *  @param {Record<string, any>} - json Json object describing the weapon /
     *  armor kind
     */
    read(json: Record<string, any>): void;
}
export { WeaponArmorKind };
