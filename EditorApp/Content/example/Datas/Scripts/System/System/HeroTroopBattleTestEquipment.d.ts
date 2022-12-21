import { Player } from "../Core/index.js";
import { Base } from "./Base.js";
/** @class
 *  An hero equipment troop battle test.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  equipment
 */
declare class HeroTroopBattleTestEquipment extends Base {
    id: number;
    kind: number;
    weaponArmorID: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the equipment.
     *  @param {Record<string, any>} - json Json object describing the equipment
     */
    read(json: Record<string, any>): void;
    /**
     *  Equip the equipments to a player.
     *  @param {Player} player
     */
    equip(player: Player): void;
}
export { HeroTroopBattleTestEquipment };
