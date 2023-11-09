import { Base } from './Base.js';
import { System } from '../index.js';
import { MapObject } from '../Core/index.js';
/** @class
 *  An event command for changing battle music.
 *  @extends EventCommand.Base
 */
declare class ChangeBattleMusic extends Base {
    song: System.PlaySong;
    constructor(command: any[]);
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): number;
}
export { ChangeBattleMusic };
