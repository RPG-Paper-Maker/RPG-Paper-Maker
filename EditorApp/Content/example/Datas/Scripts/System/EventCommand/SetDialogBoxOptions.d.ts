import { Base } from "./Base.js";
import { System } from "../index.js";
import { MapObject } from "../Core/index.js";
/** @class
 *  An event command for setting the dialog box options.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class SetDialogBoxOptions extends Base {
    windowSkinID: System.DynamicValue;
    x: System.DynamicValue;
    y: System.DynamicValue;
    w: System.DynamicValue;
    h: System.DynamicValue;
    pLeft: System.DynamicValue;
    pTop: System.DynamicValue;
    pRight: System.DynamicValue;
    pBottom: System.DynamicValue;
    fPosAbove: boolean;
    fX: System.DynamicValue;
    fY: System.DynamicValue;
    tOutline: boolean;
    tcText: System.DynamicValue;
    tcOutline: System.DynamicValue;
    tcBackground: System.DynamicValue;
    tSize: System.DynamicValue;
    tFont: System.DynamicValue;
    v_windowSkin: System.WindowSkin;
    v_x: number;
    v_y: number;
    v_w: number;
    v_h: number;
    v_pLeft: number;
    v_pTop: number;
    v_pRight: number;
    v_pBottom: number;
    v_fPosAbove: boolean;
    v_fX: number;
    v_fY: number;
    v_tOutline: boolean;
    v_tcText: System.Color;
    v_tcOutline: System.Color;
    v_tcBackground: System.Color;
    v_tSize: number;
    v_tFont: string;
    constructor(command: any[]);
    /**
     *  Update and check if the event is finished
     *  @param {Object} currentState - The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState?: Record<string, any>, object?: MapObject, state?: number): number;
}
export { SetDialogBoxOptions };
