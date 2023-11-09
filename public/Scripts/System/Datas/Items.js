/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Platform, Paths, Utils } from '../Common/index.js';
import { System, Datas } from '../index.js';
/** @class
 *  All the items datas.
 *  @static
 */
class Items {
    constructor() {
        throw new Error('This is a static class!');
    }
    /**
     *  Read the JSON file associated to items.
     *  @static
     *  @async
     */
    static async read() {
        let json = (await Platform.parseFileJSON(Paths.FILE_ITEMS)).items;
        this.list = [];
        Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System.Item });
    }
    /**
     *  Get the item by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Item}
     */
    static get(id) {
        return Datas.Base.get(id, this.list, 'item');
    }
}
export { Items };
