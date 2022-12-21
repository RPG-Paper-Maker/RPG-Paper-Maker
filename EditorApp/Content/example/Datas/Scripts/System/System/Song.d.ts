import { Base } from "./Base.js";
import { Enum } from "../Common/index.js";
import SongKind = Enum.SongKind;
import { Howl } from "../Globals.js";
/** @class
 *  A song of the game.
 *  @extends System.Base
 *  @param {Record<string ,any>} - [json=undefined] Json object describing the
 *  song
 *  @param {SongKind} [kind=SongKind.Music] - The kind of song
 */
declare class Song extends Base {
    id: number;
    kind: SongKind;
    name: string;
    isBR: boolean;
    dlc: string;
    base64: string;
    howl: typeof Howl;
    constructor(json?: Record<string, any>, kind?: SongKind);
    /**
     *  Assign the default members.
     *  @param {any[]} args
     */
    setup(args: any[]): void;
    /**
     *  Get string of song kind.
     *  @param {SongKind} kind - The song kind
     *  @returns {string}
     */
    static songKindToString(kind: SongKind): string;
    /**
     *  Get the folder associated to a kind of song.
     *  @static
     *  @param {SongKind} kind - The kind of song
     *  @param {boolean} isBR - Indicate if the pciture is a BR
     *  @param {string} isDLC - Indicate if the pciture is a DLC
     *  @returns {string}
     */
    static getFolder(kind: SongKind, isBR: boolean, dlc: string): string;
    /**
     *  Get the local folder associated to a kind of song.
     *  @param {SongKind} kind - The kind of song
     *  @returns {string}
     */
    static getLocalFolder(kind: SongKind): string;
    /**
     *  Read the JSON associated to the song.
     *  @param {Record<string, any>} - json Json object describing the song
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the absolute path associated to this song.
     *  @returns {string}
     */
    getPath(): string;
    /**
     *  Load the song.
     */
    load(): void;
}
export { Song };
