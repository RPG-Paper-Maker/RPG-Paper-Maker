import { Base } from "./Base.js";
/** @class
 *  A video of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  video
 */
declare class Video extends Base {
    id: number;
    name: string;
    isBR: boolean;
    dlc: string;
    constructor(json?: Record<string, any>);
    /**
     *  Get the folder associated to videos.
     *  @static
     *  @param {boolean} isBR - Indicate if the video is a BR
     *  @param {string} dlc - The dlc name
     *  @returns {string}
     */
    static getFolder(isBR: boolean, dlc: string): string;
    /**
     *  Get the local folder associated to videos.
     *  @static
     *  @returns {string}
     */
    static getLocalFolder(): string;
    /**
     *  Read the JSON associated to the video.
     *  @param {Record<string, any>} - json Json object describing the video
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the absolute path associated to this video.
     *  @returns {string}
     */
    getPath(): string;
}
export { Video };
