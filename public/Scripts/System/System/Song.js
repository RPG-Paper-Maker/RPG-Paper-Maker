/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { Enum, Constants, Paths, Utils } from '../Common/index.js';
var SongKind = Enum.SongKind;
import { Datas } from '../index.js';
import { Howl } from '../Globals.js';
/** @class
 *  A song of the game.
 *  @extends System.Base
 *  @param {Record<string ,any>} - [json=undefined] Json object describing the
 *  song
 *  @param {SongKind} [kind=SongKind.Music] - The kind of song
 */
class Song extends Base {
    constructor(json, kind = SongKind.Music) {
        super(json, kind);
    }
    /**
     *  Assign the default members.
     *  @param {any[]} args
     */
    setup(args) {
        this.kind = args[0];
    }
    /**
     *  Get string of song kind.
     *  @param {SongKind} kind - The song kind
     *  @returns {string}
     */
    static songKindToString(kind) {
        switch (kind) {
            case SongKind.Music:
                return "music";
            case SongKind.BackgroundSound:
                return "background music";
            case SongKind.MusicEffect:
                return "music effect";
            case SongKind.Sound:
                return "sound";
        }
        return "";
    }
    /**
     *  Get the folder associated to a kind of song.
     *  @static
     *  @param {SongKind} kind - The kind of song
     *  @param {boolean} isBR - Indicate if the pciture is a BR
     *  @param {string} isDLC - Indicate if the pciture is a DLC
     *  @returns {string}
     */
    static getFolder(kind, isBR, dlc) {
        return (isBR ? Datas.Systems.PATH_BR : (dlc ? Datas.Systems.PATH_DLCS +
            Constants.STRING_SLASH + dlc : Paths.ROOT_DIRECTORY_LOCAL)) + this
            .getLocalFolder(kind);
    }
    /**
     *  Get the local folder associated to a kind of song.
     *  @param {SongKind} kind - The kind of song
     *  @returns {string}
     */
    static getLocalFolder(kind) {
        switch (kind) {
            case SongKind.Music:
                return Paths.MUSICS;
            case SongKind.BackgroundSound:
                return Paths.BACKGROUND_SOUNDS;
            case SongKind.Sound:
                return Paths.SOUNDS;
            case SongKind.MusicEffect:
                return Paths.MUSIC_EFFECTS;
        }
        return "";
    }
    /**
     *  Read the JSON associated to the song.
     *  @param {Record<string, any>} - json Json object describing the song
     */
    read(json) {
        this.id = json.id;
        this.name = json.name;
        this.isBR = json.br;
        this.dlc = Utils.defaultValue(json.d, "");
        this.base64 = json.base64;
    }
    /**
     *  Get the absolute path associated to this song.
     *  @returns {string}
     */
    getPath() {
        if (this.base64) {
            return this.base64;
        }
        if (this.howl) {
            return this.howl._src;
        }
        return Song.getFolder(this.kind, this.isBR, this.dlc) + Constants
            .STRING_SLASH + this.name;
    }
    /**
     *  Load the song.
     */
    load() {
        if (this.id !== -1 && !this.howl) {
            this.howl = new Howl({
                src: [this.getPath()],
                loop: this.kind !== SongKind.MusicEffect,
                html5: true
            });
            if (this.base64) {
                this.base64 = "";
            }
        }
    }
}
export { Song };
