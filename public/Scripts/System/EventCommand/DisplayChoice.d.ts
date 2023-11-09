import { Base } from './Base.js';
import { System, Graphic } from '../index.js';
import { WindowChoices, MapObject } from '../Core/index.js';
import { ShowText } from './ShowText.js';
/** @class
 *  An event command for displaying a choice.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class DisplayChoice extends Base {
    cancelAutoIndex: System.DynamicValue;
    maxNumberChoices: System.DynamicValue;
    choices: string[];
    windowChoices: WindowChoices;
    showText: ShowText;
    graphics: Graphic.Text[];
    maxWidth: number;
    constructor(command: any[]);
    /**
     *  Set the show text property.
     *  @param {EventCommand.ShowText} showText - The show text value
     */
    setShowText(showText: ShowText): void;
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
     *  An event move.
     *  @param {Record<string ,any>} currentState
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(currentState: Record<string, any>, isKey: boolean, options?: {
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
     *  @param {Record<string, any>}} - currentState The current state of the
     *  event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState: Record<string, any>, object: MapObject, state: number): number;
    /**
     *  Returns the number of node to pass.
     *  @returns {number}
     */
    goToNextCommand(): number;
    /**
     *  First key press handle for the current stack.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {number} key - The key ID pressed
     */
    onKeyPressed(currentState: Record<string, any>, key: number): void;
    /**
     *  Key pressed repeat handle for the current stack, but with
     *  a small wait after the first pressure (generally used for menus).
     *  @param {Record<string, any>}} - currentState The current state of the event
     *  @param {number} key - The key ID pressed
     */
    onKeyPressedAndRepeat(currentState: Record<string, any>, key: number): boolean;
    /**
     *  @inheritdoc
     */
    onMouseMove(currentState: Record<string, any>, x: number, y: number): void;
    /**
     *  @inheritdoc
     */
    onMouseUp(currentState: Record<string, any>, x: number, y: number): void;
    /**
     *  Draw the HUD
     *  @param {Record<string, any>} - currentState The current state of the event
     */
    drawHUD(currentState?: Record<string, any>): void;
}
export { DisplayChoice };
