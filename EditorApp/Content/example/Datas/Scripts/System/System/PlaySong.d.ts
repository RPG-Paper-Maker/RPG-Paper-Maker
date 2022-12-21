import { Base } from "./Base.js";
import { Enum } from "../Common/index.js";
import SongKind = Enum.SongKind;
import { System } from "../index.js";
import { StructIterator } from "../EventCommand/index.js";
/** @class
 *  A way to play a song.
 *  @extends System.Base
 *  @param {SongKind} kind - The kind of song to play
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  play song
 */
declare class PlaySong extends Base {
    static previousMusic: PlaySong;
    static currentPlayingMusic: PlaySong;
    kind: SongKind;
    songID: System.DynamicValue;
    volume: System.DynamicValue;
    isStart: boolean;
    start: System.DynamicValue;
    isEnd: boolean;
    end: System.DynamicValue;
    constructor(kind: SongKind, json?: Record<string, any>);
    /**
     *  Create a new value from a command and iterator.
     *  @static
     *  @param {any[]} command - The list describing the command
     *  @param {StructIterator} iterator - The iterator
     *  @returns {System.PlaySong}
     */
    static createValueCommand(command: any[], iterator: StructIterator, kind: Enum.SongKind): System.PlaySong;
    /**
     *  Read the JSON associated to the play song.
     *  @param {Record<string, any>} - json Json object describing the play song
     */
    read(json: Record<string, any>): void;
    /**
     *  Parse a play song command.
     *  @static
     *  @param {any} command
     *  @param {StructIterator} iterator
     */
    parse(command: any[], iterator: StructIterator): void;
    /**
     *  Get the json value.
     *  @returns {Record<string, any>}
     */
    toJson(): Record<string, any>;
    /**
     *  Set song play to default values.
     */
    setDefault(): void;
    /**
     *  Initialize (for music effects).
     */
    initialize(): {
        parallel: boolean;
        timeStop: number;
    };
    /**
     *  Update all the specified values.
     *  @param {System.DynamicValue} songID - The song ID
     *  @param {System.DynamicValue} volume - The volume to play
     *  @param {boolean} isStart - Indicate if there's a start value
     *  @param {System.DynamicValue} start - The start of the song to play
     *  @param {boolean} isEnd - Indicate if there's a end value
     *  @param {System.DynamicValue} end - The end of the song to play
     */
    updateValues(songID: System.DynamicValue, volume: System.DynamicValue, isStart: boolean, start: System.DynamicValue, isEnd: boolean, end: System.DynamicValue): void;
    /**
     *  Play the music.
     *  @param {number} [start=undefined] - The start of the song to play
     *  @param {number} [volume=undefined] - The volume to play
     */
    playMusic(start?: number, volume?: number): number;
    /**
     *  Play the sound.
     */
    playSound(): void;
    /**
     *  Play the music effect and return the next node value.
     *  @param {Record<string, any>} - currentState The current state of the
     *  playing music effect
     *  @returns {number}
     */
    playMusicEffect(currentState: Record<string, any>): number;
}
export { PlaySong };
