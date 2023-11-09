/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System, Datas } from '../index.js';
import { Platform, Paths, Utils } from '../Common/index.js';
/** @class
 *  All the status datas.
 *  @static
 */
class Status {
    constructor() {
        throw new Error('This is a static class!');
    }
    /**
     *  Read the JSON file associated to status.
     *  @static
     *  @async
     */
    static async read() {
        let json = (await Platform.parseFileJSON(Paths.FILE_STATUS)).status;
        this.list = [];
        Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System.Status });
    }
    /**
     *  Get the status by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Status}
     */
    static get(id) {
        return Datas.Base.get(id, this.list, 'status');
    }
}
export { Status };
