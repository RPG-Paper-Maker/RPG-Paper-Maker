/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { CommonSkillItem } from './CommonSkillItem.js';
import { Datas } from '../index.js';
import { Enum } from '../Common/index.js';
/** @class
 *  An item of the game.
 *  @extends CommonSkillItem
 *  @param {Record<string, any>} - [json=undefined] Json object describing the item
 */
class Item extends CommonSkillItem {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the item.
     *  @param {Record<string, any>} - json Json object describing the item
     */
    read(json) {
        super.read(json);
    }
    /** Get the item type.
     *  @returns {string}
     */
    getStringType() {
        return Datas.Systems.getItemType(this.type).name();
    }
    /**
     *  Get the item kind.
     *  @returns {Enum.ItemKind}
     */
    getKind() {
        return Enum.ItemKind.Item;
    }
    /**
     *  Get message and replace user / item name.
     *  @param {Battler} user
     *  @returns {string}
     */
    getMessage(user) {
        return this.battleMessage.name().replace('[user]', user.player.name)
            .replace('[item]', this.name());
    }
}
export { Item };
