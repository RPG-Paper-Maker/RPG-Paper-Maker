import { System } from "../index.js";
/** @class
 *  All the videos datas.
 *  @static
 */
declare class Videos {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to videos
     */
    static read(): Promise<void>;
    /**
     *  Get the corresponding video.
     *  @param {number} id
     *  @returns {System.Video}
     */
    static get(id: number): System.Video;
}
export { Videos };
