/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { IO, Paths, Utils } from "../Common/index.js";
import { System, Datas } from "../index.js";
/** @class
 *  All the videos datas.
 *  @static
 */
class Videos {
    constructor() {
        throw new Error("This is a static class!");
    }
    /**
     *  Read the JSON file associated to videos
     */
    static async read() {
        let json = (await IO.parseFileJSON(Paths.FILE_VIDEOS)).list;
        this.list = [];
        Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System
                .Video });
    }
    /**
     *  Get the corresponding video.
     *  @param {number} id
     *  @returns {System.Video}
     */
    static get(id) {
        return id === -1 ? new System.Video() : Datas.Base.get(id, this.list, "video");
    }
}
export { Videos };
