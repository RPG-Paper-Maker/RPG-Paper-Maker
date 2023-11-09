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
 *  All the weapons datas
 *  @static
 */
class Weapons {
    constructor() {
        throw new Error('This is a static class!');
    }
    /**
     *  Read the JSON file associated to weapons
     *  @static
     *  @async
     */
    static async read() {
        let json = (await Platform.parseFileJSON(Paths.FILE_WEAPONS)).weapons;
        this.list = [];
        Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System.Weapon });
    }
    /**
     *  Get the weapon by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Weapon}
     */
    static get(id) {
        return Datas.Base.get(id, this.list, 'weapon');
    }
}
export { Weapons };
