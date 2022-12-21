import { Base } from "./Base.js";
import { Enum } from "../Common/index.js";
import SongKind = Enum.SongKind;
import { MapObject } from "../Core/index.js";
/** @class
 *  An event command for stopping the music.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class StopMusic extends Base {
    constructor(command: any[]);
    /**
     *  Parse a stop song command.
     *  @static
     *  @param {any} that - The event command to parse
     *  @param {any[]} command - Direct JSON command to parse
     */
    static parseStopSong(that: any, command: any[]): void;
    /**
     *  Stop the song.
     *  @static
     *  @param {any} that - The event command to parse
     *  @param {SongKind} kind - The song kind
     *  @param {number} time - The date seconds value in the first call of stop
     */
    static stopSong(that: any, kind: SongKind, time: number): number;
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any>;
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState: Record<string, any>, object: MapObject, state: number): number;
}
export { StopMusic };
