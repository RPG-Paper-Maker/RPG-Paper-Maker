import { Base } from './Base.js';
import { System } from '../index.js';
import { Enum } from '../Common/index.js';
import { MapObject } from '../Core/index.js';
/** @class
 *  An event command for changing experience curve of one or several hero.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
declare class ChangeClass extends Base {
    classID: System.DynamicValue;
    selectionKind: number;
    selectionHeroEnemyInstanceID: System.DynamicValue;
    selectionTeam: Enum.GroupKind;
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
export { ChangeClass };
