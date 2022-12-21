import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import { Battler } from "./Battler.js";
import { Picture2D } from "./Picture2D.js";
/** @class
 *  A status affected to a player.
 *  @param {number} id - The ID of the status
 */
declare class Status {
    id: number;
    system: System.Status;
    turn: number;
    picture: Picture2D;
    constructor(id: number, turn?: number);
    /**
     *  Get message and replace target name.
     *  @static
     *  @param {System.DynamicValue} message
     *  @param {Battler} target
     *  @returns {string}
     */
    static getMessage(message: System.DynamicValue, target: Battler): string;
    /**
     *  Draw the status on top of battler.
     *  @static
     *  @param {Status[]} statusList
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     *  @param {Enum.Align} [align=Enum.Align.Left]
     */
    static drawList(statusList: Status[], x: number, y: number, align?: Enum.Align): void;
    /**
     *  Get message when ally affected.
     *  @param {Battler} target
     *  @returns {string}
     */
    getMessageAllyAffected(target: Battler): string;
    /**
     *  Get message when enemy affected.
     *  @param {Battler} target
     *  @returns {string}
     */
    getMessageEnemyAffected(target: Battler): string;
    /**
     *  Get message when healed.
     *  @param {Battler} target
     *  @returns {string}
     */
    getMessageHealed(target: Battler): string;
    /**
     *  Get message when still affected.
     *  @param {Battler} target
     *  @returns {string}
     */
    getMessageStillAffected(target: Battler): string;
    /**
     *  Draw the status on top of battler.
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     */
    draw(x: number, y: number): void;
}
export { Status };
