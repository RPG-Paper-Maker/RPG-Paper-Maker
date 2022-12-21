import { Base } from "./Base.js";
import { System } from "../index.js";
import { WindowBox, MapObject } from "../Core/index.js";
/** @class
 *  An event command for displaying text.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class ShowText extends Base {
    interlocutor: System.DynamicValue;
    facesetID: number;
    facesetIndexX: number;
    facesetIndexY: number;
    message: string;
    windowMain: WindowBox;
    windowInterlocutor: WindowBox;
    constructor(command: any[]);
    /**
     *  An event action.
     *  @param {Record<string ,any>} currentState
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(currentState: Record<string, any>, isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
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
    /**
     *  First key press handle for the current stack
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {number} key - The key ID pressed
     */
    onKeyPressed(currentState: Record<string, any>, key: number): void;
    /**
     *  @inheritdoc
     */
    onMouseUp(currentState: Record<string, any>, x: number, y: number): void;
    /**
     *  Draw the HUD
     *  @param {Record<string ,any>} - currentState The current state of the event
     */
    drawHUD(currentState?: Record<string, any>): void;
}
export { ShowText };
