import { Base } from './Base.js';
import { System } from '../index.js';
import { MapObject } from '../Core/index.js';
/** @class
 *  An event command for transforming a battler.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
declare class TransformABattler extends Base {
    battlerKind: number;
    battlerEnemyIndex: number;
    battlerHeroEnemyInstanceID: System.DynamicValue;
    monsterID: System.DynamicValue;
    level: System.DynamicValue;
    constructor(command: any[]);
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
export { TransformABattler };
