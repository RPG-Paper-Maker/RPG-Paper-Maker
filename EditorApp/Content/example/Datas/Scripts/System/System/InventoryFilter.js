/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System } from "../index.js";
import { Enum, Interpreter, Utils } from "../Common/index.js";
import { Translatable } from "./Translatable.js";
/** @class
 *  An inventory filter used to filter inventory or shops items.
 *  @extends Translatable
 *  @param {Record<string, any>} [json=undefined] - Json object describing the item
 */
class InventoryFilter extends Translatable {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the inventory filter.
     *  @param {Record<string, any>} - json Json object describing the
     *  inventory filter
     */
    read(json) {
        super.read(json);
        this.kind = Utils.defaultValue(json.kind, Enum.InventoryFilterKind.All);
        switch (this.kind) {
            case Enum.InventoryFilterKind.Custom:
                this.itemTypeID = System.DynamicValue.readOrDefaultDatabase(json
                    .itemTypeID);
                break;
            case Enum.InventoryFilterKind.Script:
                this.script = Utils.defaultValue(json.script, "");
                break;
        }
    }
    /**
     *  Get the filter function taking the item to filter and return true if
     *  pass filter.
     *  @returns {(item: Core.Item) => boolean}
     */
    getFilter() {
        switch (this.kind) {
            case Enum.InventoryFilterKind.All:
                return (item) => {
                    return true;
                };
            case Enum.InventoryFilterKind.Consumables:
                return (item) => {
                    return item.system.consumable;
                };
            case Enum.InventoryFilterKind.Custom:
                return (item) => {
                    return !item.system.isWeaponArmor() && item.system.type ===
                        this.itemTypeID.getValue();
                };
            case Enum.InventoryFilterKind.Weapons:
                return (item) => {
                    return item.system.isWeapon();
                };
            case Enum.InventoryFilterKind.Armors:
                return (item) => {
                    return item.system.isArmor();
                };
            case Enum.InventoryFilterKind.WeaponsAndAmors:
                return (item) => {
                    return item.system.isWeaponArmor();
                };
            case Enum.InventoryFilterKind.Script:
                return (item) => {
                    return Interpreter.evaluate(this.script, { additionalName: "item", additionalValue: item });
                };
            default:
                return null;
        }
    }
}
export { InventoryFilter };
