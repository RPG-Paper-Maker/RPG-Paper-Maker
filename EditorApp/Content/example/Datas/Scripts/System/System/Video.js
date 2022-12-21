/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Datas, System } from "../index.js";
import { Constants, Paths, Utils } from "../Common/index.js";
/** @class
 *  A video of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  video
 */
class Video extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Get the folder associated to videos.
     *  @static
     *  @param {boolean} isBR - Indicate if the video is a BR
     *  @param {string} dlc - The dlc name
     *  @returns {string}
     */
    static getFolder(isBR, dlc) {
        return (isBR ? Datas.Systems.PATH_BR : (dlc ? Datas.Systems.PATH_DLCS +
            Constants.STRING_SLASH + dlc : Paths.ROOT_DIRECTORY_LOCAL)) + this
            .getLocalFolder();
    }
    /**
     *  Get the local folder associated to videos.
     *  @static
     *  @returns {string}
     */
    static getLocalFolder() {
        return Paths.VIDEOS;
    }
    /**
     *  Read the JSON associated to the video.
     *  @param {Record<string, any>} - json Json object describing the video
     */
    read(json) {
        this.id = json.id;
        this.name = json.name;
        this.isBR = json.br;
        this.dlc = Utils.defaultValue(json.d, "");
    }
    /**
     *  Get the absolute path associated to this video.
     *  @returns {string}
     */
    getPath() {
        return this.id === -1 ? "" : System.Video.getFolder(this.isBR, this.dlc)
            + Constants.STRING_SLASH + this.name;
    }
}
export { Video };
