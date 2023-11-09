/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { EventCommand, System, Manager } from '../index.js';
import { Enum } from '../Common/index.js';
var SongKind = Enum.SongKind;
/** @class
 *  An event command for stopping the music.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class StopMusic extends Base {
    constructor(command) {
        super();
        EventCommand.StopMusic.parseStopSong(this, command, Enum.SongKind.Music);
        this.parallel = true;
    }
    /**
     *  Parse a stop song command.
     *  @static
     *  @param {any} that - The event command to parse
     *  @param {any[]} command - Direct JSON command to parse
     */
    static parseStopSong(that, command, kind) {
        let iterator = {
            i: 0
        };
        that.seconds = System.DynamicValue.createValueCommand(command, iterator);
        if (kind === Enum.SongKind.Sound) {
            that.soundID = System.DynamicValue.createValueCommand(command, iterator);
        }
    }
    /**
     *  Stop the song.
     *  @static
     *  @param {any} that - The event command to parse
     *  @param {SongKind} kind - The song kind
     *  @param {number} time - The date seconds value in the first call of stop
     */
    static stopSong(that, kind, time) {
        return Manager.Songs.stopSong(kind, time, that.seconds.getValue(), kind
            === Enum.SongKind.Sound ? that.soundID.getValue() : -1) ? 1 : 0;
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            parallel: false,
            time: new Date().getTime()
        };
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        let stopped = EventCommand.StopMusic.stopSong(this, SongKind.Music, currentState.time);
        return currentState.parallel ? stopped : 1;
    }
}
export { StopMusic };
