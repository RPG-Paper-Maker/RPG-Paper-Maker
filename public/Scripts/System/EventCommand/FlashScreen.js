/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { System, Datas, Manager } from '../index.js';
import { Utils, Platform, ScreenResolution } from '../Common/index.js';
/** @class
 *  An event command for flashing screen.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class FlashScreen extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.colorID = System.DynamicValue.createValueCommand(command, iterator);
        this.isWaitEnd = Utils.numToBool(command[iterator.i++]);
        this.time = System.DynamicValue.createValueCommand(command, iterator);
        this.parallel = !this.isWaitEnd;
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        let time = this.time.getValue() * 1000;
        let color = Datas.Systems.getColor(this.colorID.getValue());
        return {
            parallel: this.isWaitEnd,
            time: time,
            timeLeft: time,
            color: color.getHex(),
            finalDifA: -color.alpha,
            a: color.alpha
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
        if (currentState.parallel) {
            let timeRate, dif;
            if (currentState.time === 0) {
                timeRate = 1;
            }
            else {
                dif = Manager.Stack.elapsedTime;
                currentState.timeLeft -= Manager.Stack.elapsedTime;
                if (currentState.timeLeft < 0) {
                    dif += currentState.timeLeft;
                    currentState.timeLeft = 0;
                }
                timeRate = dif / currentState.time;
            }
            // Update values
            currentState.a = currentState.a + (timeRate * currentState
                .finalDifA);
            Manager.Stack.requestPaintHUD = true;
            return currentState.timeLeft === 0 ? 1 : 0;
        }
        return 1;
    }
    /**
     *  Draw the HUD
     *  @param {Record<string, any>} - currentState The current state of the event
     */
    drawHUD(currentState) {
        Platform.ctx.fillStyle = currentState.color;
        Platform.ctx.globalAlpha = currentState.a;
        Platform.ctx.fillRect(0, 0, ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT);
        Platform.ctx.globalAlpha = 1.0;
    }
}
export { FlashScreen };
