/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System, Datas } from "../index.js";
import { IO, Paths, Utils } from "../Common/index.js";
/** @class
 *  All the heroes datas.
 *  @static
 */
class Heroes {
    constructor() {
        throw new Error("This is a static class!");
    }
    /**
     *  Read the JSON file associated to heroes.
     *  @static
     *  @async
     */
    static async read() {
        let json = (await IO.parseFileJSON(Paths.FILE_HEROES)).heroes;
        this.list = [];
        Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System
                .Hero });
    }
    /**
     *  Get the hero by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Hero}
     */
    static get(id) {
        return Datas.Base.get(id, this.list, "hero");
    }
}
export { Heroes };
