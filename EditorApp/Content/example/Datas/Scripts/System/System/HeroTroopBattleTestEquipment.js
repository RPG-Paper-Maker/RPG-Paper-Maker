/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils } from "../Common/index.js";
import { Item } from "../Core/index.js";
import { Base } from "./Base.js";
/** @class
 *  An hero equipment troop battle test.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  equipment
 */
class HeroTroopBattleTestEquipment extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the equipment.
     *  @param {Record<string, any>} - json Json object describing the equipment
     */
    read(json) {
        this.id = json.id;
        this.kind = Utils.defaultValue(json.kind, 0);
        this.weaponArmorID = Utils.defaultValue(json.weaponArmorID, 1);
    }
    /**
     *  Equip the equipments to a player.
     *  @param {Player} player
     */
    equip(player) {
        if (this.kind !== 0) {
            player.equip[this.id] = new Item(this.kind === 1 ? Enum.ItemKind
                .Weapon : Enum.ItemKind.Armor, this.weaponArmorID, 1);
        }
    }
}
export { HeroTroopBattleTestEquipment };
