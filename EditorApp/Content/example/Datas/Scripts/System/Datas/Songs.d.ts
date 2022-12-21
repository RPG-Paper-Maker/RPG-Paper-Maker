import { Enum } from "../Common/index.js";
import SongKind = Enum.SongKind;
import { System } from "../index.js";
/** @class
*   All the songs datas
*   @static
*/
declare class Songs {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to songs
     */
    static read(): Promise<void>;
    /**
     *  Get the corresponding song.
     *  @param {SongKind} kind - The song kind
     *  @param {number} id - The song id
     *  @returns {System.Song}
     */
    static get(kind: SongKind, id: number): System.Song;
}
export { Songs };
