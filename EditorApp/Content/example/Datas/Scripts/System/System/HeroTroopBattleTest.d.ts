import { System } from "../index.js";
import { Player } from "../Core/index.js";
import { Base } from "./Base.js";
/** @class
 *  An hero troop battle test.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  hero
 */
declare class HeroTroopBattleTest extends Base {
    heroID: number;
    level: number;
    equipments: System.HeroTroopBattleTestEquipment[];
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the hero.
     *  @param {Record<string, any>} - json Json object describing the hero
     */
    read(json: Record<string, any>): void;
    /**
     *  Equip the equipments to a player.
     *  @param {Player} player
     */
    equip(player: Player): void;
}
export { HeroTroopBattleTest };
