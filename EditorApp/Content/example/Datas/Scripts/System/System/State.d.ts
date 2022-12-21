import { Base } from "./Base.js";
import { Enum } from "../Common/index.js";
import ObjectMovingKind = Enum.ObjectMovingKind;
import { System, EventCommand } from "../index.js";
/** @class
 *  A possible state of an object.
 *  @extends System.Base
 *  @param {Record<string, any>} - json Json object describing the object state
 */
declare class State extends Base {
    id: number;
    graphicID: number;
    graphicKind: number;
    rectTileset: number[];
    indexX: number;
    indexY: number;
    objectMovingKind: ObjectMovingKind;
    route: System.Reaction;
    speedID: number;
    frequencyID: number;
    moveAnimation: boolean;
    stopAnimation: boolean;
    climbAnimation: boolean;
    directionFix: boolean;
    through: boolean;
    setWithCamera: boolean;
    pixelOffset: boolean;
    keepPosition: boolean;
    detection: EventCommand.Base;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the object state.
     *  @param {Record<string, any>} - json Json object describing the object
     *  state
     */
    read(json: Record<string, any>): void;
    /**
     *  Create a new instance of the System object state.
     *  @returns {Object}
     */
    copyInstance(): Record<string, any>;
}
export { State };
