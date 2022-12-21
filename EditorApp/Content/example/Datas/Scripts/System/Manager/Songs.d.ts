import { Enum } from "../Common/index.js";
import SongKind = Enum.SongKind;
import { Howl } from "../Globals.js";
/** @class
 *  The manager for songs.
 *  @static
 */
declare class Songs {
    static musicEffectStep: number;
    static isProgressionMusicEnd: boolean;
    static isMusicNone: boolean;
    static volumes: number[];
    static starts: number[];
    static ends: number[];
    static current: typeof Howl[];
    static progressionMusic: any;
    static progressionMusicTime: number;
    static progressionMusicEnd: number;
    static currentStateMusicEffect: Record<string, any>;
    constructor();
    /**
     *  Initialize all the lists according to SongKind.
     */
    static initialize(): void;
    /**
     *  Play a music.
     *  @param {SongKind} kind - The kind of the song
     *  @param {number} id - The id of the song
     *  @param {number} volume - The volume of the song
     *  @param {number} start - The start of the song
     *  @param {number} end - The end of the song
     */
    static playMusic(kind: SongKind, id: number, volume: number, start: number, end: number): void;
    /**
     *  Stop a song.
     *  @static
     *  @param {SongKind} kind - The kind of song to stop
     *  @param {number} time - The date seconds value in the first call of stop
     *  @param {number} seconds - The seconds needed for entirely stop the song
     *  @param {boolean} pause - Indicates if the song needs to be paused instead
     *  of stoppped
     *  @returns {boolean} Indicates if the song is stopped
     */
    static stopSong(kind: SongKind, time: number, seconds: number, pause?: boolean): boolean;
    /**
     *  Unpause a song.
     *  @static
     *  @param {SongKind} kind - The kind of song to unpause
     *  @param {number} time - The date seconds value in the first call of
     *  unpause
     *  @param {number} seconds - The seconds needed for entirely play the song
     *  @returns {boolean} Indicate if the song is played with all volume
     */
    static unpauseSong(kind: SongKind, time: number, seconds: number): boolean;
    /**
     *  Play a sound.
     *  @static
     *  @param {number} id - The id of the sound
     *  @param {number} volume - The volume of the sound
     */
    static playSound(id: number, volume: number): void;
    /**
     *  Play a music effect.
     *  @static
     *  @param {number} id - The id of the sound
     *  @param {number} volume - The volume of the sound
     *  @param {Record<string, any>} - currentState The current state command
     */
    static playMusicEffect(id: number, volume: number, currentState: Record<string, any>): boolean;
    /**
     *  Update songs positions or other stuff.
     *  @static
     *  @param {SongKind} kind - The song kind
     */
    static updateByKind(kind: SongKind): void;
    /**
     *  Update songs positions or other stuffs.
     */
    static update(): void;
    /**
     *  Stop the music (with progression).
     *  @param {number} time - The time to stop
     */
    static stopMusic(time: number): void;
    /**
     *  Initialize progression music (for stop).
     *  @param {number} i - The initial volume
     *  @param {number} f - The final volume
     *  @param {number} equation - The equation kind
     *  @param {number} end - The end of the song
     */
    static initializeProgressionMusic(i: number, f: number, equation: number, end: number): void;
    /**
     *  Update the progression music
     */
    static updateProgressionMusic(): void;
    /**
     *  Stop all the songs
     */
    static stopAll(): void;
}
export { Songs };
