/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum } from '../Common/index.js';
var SongKind = Enum.SongKind;
import { Datas, System } from '../index.js';
import { ProgressionTable } from '../System/index.js';
import { Howl } from '../Globals.js';
/** @class
 *  The manager for songs.
 *  @static
 */
class Songs {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Initialize all the lists according to SongKind.
     */
    static initialize() {
        System.PlaySong.currentPlayingMusic = new System.PlaySong(SongKind.Music);
        this.volumes[SongKind.Music] = 0;
        this.volumes[SongKind.BackgroundSound] = 0;
        this.volumes[SongKind.MusicEffect] = 0;
        this.starts[SongKind.Music] = null;
        this.starts[SongKind.BackgroundSound] = null;
        this.starts[SongKind.MusicEffect] = null;
        this.ends[SongKind.Music] = null;
        this.ends[SongKind.BackgroundSound] = null;
        this.ends[SongKind.MusicEffect] = null;
        this.current[SongKind.Music] = null;
        this.current[SongKind.BackgroundSound] = null;
        this.current[SongKind.MusicEffect] = null;
        this.currentSounds = [];
    }
    /**
     *  Play a music.
     *  @param {SongKind} kind - The kind of the song
     *  @param {number} id - The id of the song
     *  @param {number} volume - The volume of the song
     *  @param {number} start - The start of the song
     *  @param {number} end - The end of the song
     */
    static playMusic(kind, id, volume, start, end) {
        if (id < 1) {
            switch (kind) {
                case SongKind.Music:
                    this.stopMusic(0);
                    break;
                case SongKind.BackgroundSound:
                    break;
            }
            return;
        }
        switch (kind) {
            case SongKind.Music:
                this.isMusicNone = false;
                break;
            case SongKind.BackgroundSound:
                break;
        }
        if (this.current[kind] !== null) {
            this.current[kind].stop();
        }
        let song = Datas.Songs.get(kind, id);
        if (song) {
            let howl = song.howl;
            howl.volume(volume);
            howl.seek(start);
            howl.play();
            this.volumes[kind] = volume;
            this.starts[kind] = start;
            this.ends[kind] = end;
            this.current[kind] = howl;
        }
    }
    /**
     *  Stop a song.
     *  @static
     *  @param {SongKind} kind - The kind of song to stop
     *  @param {number} time - The date seconds value in the first call of stop
     *  @param {number} seconds - The seconds needed for entirely stop the song
     *  @param {number} id - For sounds only, to know which sound should be stopped
     *  @param {boolean} pause - Indicates if the song needs to be paused instead
     *  of stoppped
     *  @returns {boolean} Indicates if the song is stopped
     */
    static stopSong(kind, time, seconds, id = -1, pause = false) {
        System.PlaySong.currentPlayingMusic = new System.PlaySong(SongKind.Music);
        let current = new Date().getTime();
        let ellapsedTime = current - time;
        let currentHowl = kind === SongKind.Sound ? this.currentSounds[id] : this
            .current[kind];
        if (!currentHowl) {
            return true;
        }
        if (ellapsedTime >= (seconds * 1000)) {
            currentHowl.volume(0);
            if (pause) {
                currentHowl.pause();
            }
            else {
                currentHowl.stop();
                this.current[kind] = null;
            }
            return true;
        }
        else {
            currentHowl.volume((this.volumes[kind] * (100 - ((ellapsedTime /
                (seconds * 1000)) * 100))) / 100);
            return false;
        }
    }
    /**
     *  Unpause a song.
     *  @static
     *  @param {SongKind} kind - The kind of song to unpause
     *  @param {number} time - The date seconds value in the first call of
     *  unpause
     *  @param {number} seconds - The seconds needed for entirely play the song
     *  @returns {boolean} Indicate if the song is played with all volume
     */
    static unpauseSong(kind, time, seconds) {
        let current = new Date().getTime();
        let ellapsedTime = current - time;
        let currentHowl = this.current[kind];
        if (currentHowl === null) {
            return true;
        }
        if (ellapsedTime >= (seconds * 1000)) {
            currentHowl.volume(this.volumes[kind]);
            return true;
        }
        else {
            currentHowl.volume(this.volumes[kind] * (ellapsedTime / (seconds *
                1000)));
            return false;
        }
    }
    /**
     *  Play a sound.
     *  @static
     *  @param {number} id - The id of the sound
     *  @param {number} volume - The volume of the sound
     */
    static playSound(id, volume) {
        if (id === -1) {
            return;
        }
        let sound = Datas.Songs.get(SongKind.Sound, id);
        if (sound) {
            let howl = new Howl({
                src: [sound.getPath()],
                volume: volume
            });
            this.currentSounds[id] = howl;
            howl.play();
        }
    }
    /**
     *  Play a music effect.
     *  @static
     *  @param {number} id - The id of the sound
     *  @param {number} volume - The volume of the sound
     *  @param {Record<string, any>} - currentState The current state command
     */
    static playMusicEffect(id, volume, currentState) {
        if (id === -1 || currentState.end) {
            return true;
        }
        if (this.currentStateMusicEffect === null) {
            this.currentStateMusicEffect = currentState;
        }
        if (this.currentStateMusicEffect !== currentState) {
            return true;
        }
        if (this.musicEffectStep === 0) {
            this.playMusic(SongKind.MusicEffect, id, volume, null, null);
            this.musicEffectStep++;
        }
        if (this.musicEffectStep === 1) {
            if (this.stopSong(SongKind.Music, currentState.timeStop, 0, -1, true)) {
                this.musicEffectStep++;
            }
        }
        if (this.musicEffectStep === 2) {
            if (this.current[SongKind.MusicEffect] === null || !this.current[SongKind.MusicEffect].playing()) {
                if (this.current[SongKind.MusicEffect] !== null) {
                    this.current[SongKind.MusicEffect].stop();
                    this.current[SongKind.MusicEffect] = null;
                }
                if (this.current[SongKind.Music] !== null) {
                    this.current[SongKind.Music].play();
                }
                currentState.timePlay = new Date().getTime();
                this.musicEffectStep++;
            }
        }
        if (this.musicEffectStep === 3) {
            if (this.unpauseSong(SongKind.Music, currentState.timePlay, 0.5)) {
                this.musicEffectStep = 0;
                this.currentStateMusicEffect = null;
                return true;
            }
        }
        return false;
    }
    /**
     *  Update songs positions or other stuff.
     *  @static
     *  @param {SongKind} kind - The song kind
     */
    static updateByKind(kind) {
        let howl = this.current[kind];
        if (howl !== null && howl.playing()) {
            if (this.ends[kind] && howl.seek() >= this.ends[kind]) {
                howl.seek(this.starts[kind]);
            }
        }
    }
    /**
     *  Update songs positions or other stuffs.
     */
    static update() {
        this.updateByKind(SongKind.Music);
        this.updateByKind(SongKind.BackgroundSound);
        this.updateProgressionMusic();
    }
    /**
     *  Stop the music (with progression).
     *  @param {number} time - The time to stop
     */
    static stopMusic(time) {
        this.isMusicNone = true;
        this.stopSong(SongKind.Music, time, 0, -1, false);
        this.initializeProgressionMusic(this.current[SongKind.Music] ===
            null ? 0 : this.current[SongKind.Music].volume(), 0, 0, time);
    }
    /**
     *  Initialize progression music (for stop).
     *  @param {number} i - The initial volume
     *  @param {number} f - The final volume
     *  @param {number} equation - The equation kind
     *  @param {number} end - The end of the song
     */
    static initializeProgressionMusic(i, f, equation, end) {
        this.progressionMusic = ProgressionTable.createFromNumbers(i, f, equation);
        this.progressionMusicTime = new Date().getTime();
        this.progressionMusicEnd = end;
        this.isProgressionMusicEnd = false;
    }
    /**
     *  Update the progression music
     */
    static updateProgressionMusic() {
        if (!this.isProgressionMusicEnd) {
            let tick = new Date().getTime() - this.progressionMusicTime;
            if (tick >= this.progressionMusicEnd) {
                tick = this.progressionMusicEnd;
                this.isProgressionMusicEnd = true;
            }
            let howl = this.current[SongKind.Music];
            if (howl) {
                howl.volume(this.progressionMusic.getProgressionAt(tick, this
                    .progressionMusicEnd) / 100);
                if (howl.volume() === 0) {
                    howl.stop();
                }
                else if (!this.isMusicNone && !howl.playing()) {
                    howl.play();
                }
            }
        }
    }
    /**
     *  Stop all the songs
     */
    static stopAll() {
        if (this.current[SongKind.Music] !== null) {
            this.current[SongKind.Music].stop();
            this.current[SongKind.Music] = null;
        }
        if (this.current[SongKind.BackgroundSound] !== null) {
            this.current[SongKind.BackgroundSound].stop();
            this.current[SongKind.BackgroundSound] = null;
        }
        if (this.current[SongKind.MusicEffect] !== null) {
            this.current[SongKind.MusicEffect].stop();
            this.current[SongKind.MusicEffect] = null;
            this.musicEffectStep = 0;
        }
        for (let sound of this.currentSounds) {
            if (sound) {
                sound.stop();
            }
        }
        this.currentSounds = [];
    }
}
Songs.musicEffectStep = 0;
Songs.isProgressionMusicEnd = true;
Songs.isMusicNone = true;
Songs.volumes = [];
Songs.starts = [];
Songs.ends = [];
Songs.current = [];
Songs.progressionMusic = null;
Songs.currentStateMusicEffect = null;
export { Songs };
