/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { System } from "../index.js";
import { Utils, Interpreter } from "../Common/index.js";
/** @class
 *  An event command for script.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class Script extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.isDynamic = Utils.numToBool(command[iterator.i++]);
        this.script = this.isDynamic ? System.DynamicValue.createValueCommand(command, iterator) : System.DynamicValue.createMessage(Utils
            .numToString(command[iterator.i]));
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        let res = Interpreter.evaluate(this.script.getValue(), { thisObject: object, addReturn: false });
        return Utils.isUndefined(res) ? 1 : res;
    }
}
export { Script };
