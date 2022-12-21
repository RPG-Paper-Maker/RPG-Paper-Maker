/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Enum, Utils } from "../Common/index.js";
var SongKind = Enum.SongKind;
import { System, Manager } from "../index.js";
/** @class
 *  A way to play a song.
 *  @extends System.Base
 *  @param {SongKind} kind - The kind of song to play
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  play song
 */
class PlaySong extends Base {
    constructor(kind, json) {
        super();
        this.kind = kind;
        this.read(json);
    }
    /**
     *  Create a new value from a command and iterator.
     *  @static
     *  @param {any[]} command - The list describing the command
     *  @param {StructIterator} iterator - The iterator
     *  @returns {System.PlaySong}
     */
    static createValueCommand(command, iterator, kind) {
        let song = new System.PlaySong(kind);
        song.parse(command, iterator);
        return song;
    }
    /**
     *  Read the JSON associated to the play song.
     *  @param {Record<string, any>} - json Json object describing the play song
     */
    read(json) {
        if (!json) {
            this.setDefault();
            return;
        }
        this.songID = json.isbi ? new System.DynamicValue(json.vid) : System
            .DynamicValue.createNumber(json.id);
        this.volume = new System.DynamicValue(json.v);
        this.isStart = json.is;
        this.start = this.isStart ? new System.DynamicValue(json.s) : System
            .DynamicValue.createNumber(0);
        this.isEnd = json.ie;
        this.end = this.isEnd ? new System.DynamicValue(json.e) : System
            .DynamicValue.createNumber(0);
    }
    /**
     *  Parse a play song command.
     *  @static
     *  @param {any} command
     *  @param {StructIterator} iterator
     */
    parse(command, iterator) {
        let isIDprimitive = Utils.numToBool(command[iterator.i++]);
        let valueID = System.DynamicValue.createValueCommand(command, iterator);
        let id = System.DynamicValue.createNumber(command[iterator.i++]);
        let songID = isIDprimitive ? valueID : id;
        let volume = System.DynamicValue.createValueCommand(command, iterator);
        let isStart = Utils.numToBool(command[iterator.i++]);
        let start = System.DynamicValue.createValueCommand(command, iterator);
        start = isStart ? start : System.DynamicValue.createNumber(0);
        let isEnd = Utils.numToBool(command[iterator.i++]);
        let end = System.DynamicValue.createValueCommand(command, iterator);
        end = isEnd ? end : null;
        this.updateValues(songID, volume, isStart, start, isEnd, end);
    }
    /**
     *  Get the json value.
     *  @returns {Record<string, any>}
     */
    toJson() {
        let json = {};
        json.isbi = true;
        json.vid = this.songID.toJson();
        json.v = this.volume.toJson();
        json.is = this.isStart;
        if (this.isStart) {
            json.s = this.start.toJson();
        }
        json.ie = this.isEnd;
        if (this.isEnd) {
            json.e = this.end.toJson();
        }
        return json;
    }
    /**
     *  Set song play to default values.
     */
    setDefault() {
        this.songID = System.DynamicValue.createNumber(-1);
        this.volume = System.DynamicValue.createNumber(100);
        this.isStart = false;
        this.start = System.DynamicValue.createNumber(0);
        this.isEnd = false;
        this.end = null;
    }
    /**
     *  Initialize (for music effects).
     */
    initialize() {
        return this.kind === SongKind.MusicEffect ? {
            parallel: false,
            timeStop: new Date().getTime()
        } : null;
    }
    /**
     *  Update all the specified values.
     *  @param {System.DynamicValue} songID - The song ID
     *  @param {System.DynamicValue} volume - The volume to play
     *  @param {boolean} isStart - Indicate if there's a start value
     *  @param {System.DynamicValue} start - The start of the song to play
     *  @param {boolean} isEnd - Indicate if there's a end value
     *  @param {System.DynamicValue} end - The end of the song to play
     */
    updateValues(songID, volume, isStart, start, isEnd, end) {
        this.songID = songID;
        this.volume = volume;
        this.isStart = isStart;
        this.start = start;
        this.isEnd = isEnd;
        this.end = end;
    }
    /**
     *  Play the music.
     *  @param {number} [start=undefined] - The start of the song to play
     *  @param {number} [volume=undefined] - The volume to play
     */
    playMusic(start, volume) {
        if (Utils.isUndefined(start)) {
            start = this.start ? this.start.getValue() : null;
        }
        if (Utils.isUndefined(volume)) {
            volume = this.volume.getValue() / 100;
        }
        // If same music ID and same
        if (this.songID.getValue() === PlaySong.currentPlayingMusic.songID
            .getValue() && start === PlaySong.currentPlayingMusic.start.getValue()) {
            // If same, be sure to update volume anyway
            if (Manager.Songs.current[Enum.SongKind.Music]) {
                Manager.Songs.current[Enum.SongKind.Music].volume(volume);
                Manager.Songs.volumes[Enum.SongKind.Music] = volume;
            }
            return 1;
        }
        // Update current and previous played music
        if (this.kind === SongKind.Music) {
            PlaySong.previousMusic = PlaySong.currentPlayingMusic;
            PlaySong.currentPlayingMusic = this;
        }
        Manager.Songs.playMusic(this.kind, this.songID.getValue(), volume, start, this.end ? this.end.getValue() : null);
        return 1;
    }
    /**
     *  Play the sound.
     */
    playSound() {
        Manager.Songs.playSound(this.songID.getValue(), this.volume.getValue() /
            100);
    }
    /**
     *  Play the music effect and return the next node value.
     *  @param {Record<string, any>} - currentState The current state of the
     *  playing music effect
     *  @returns {number}
     */
    playMusicEffect(currentState) {
        if (currentState.parallel) {
            let played = Manager.Songs.playMusicEffect(this.songID.getValue(), this
                .volume.getValue() / 100, currentState);
            currentState.end = played;
            return played ? 1 : 0;
        }
        return 1;
    }
}
PlaySong.previousMusic = null;
PlaySong.currentPlayingMusic = null;
export { PlaySong };
