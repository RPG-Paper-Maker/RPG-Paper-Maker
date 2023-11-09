/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { System, Manager } from "../index.js";
/** @class
 *  An event command for allowing forbidding main menu.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class Plugin extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.pluginID = command[iterator.i++];
        this.commandID = command[iterator.i++];
        let l = command.length;
        this.parameters = [];
        while (iterator.i < l) {
            this.parameters.push(System.DynamicValue.createValueCommand(command, iterator));
        }
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        let parameters = [];
        for (let i = 0, l = this.parameters.length; i < l; i++) {
            parameters[i] = this.parameters[i].getValue();
        }
        Manager.Plugins.executeCommand(this.pluginID, this.commandID, parameters);
        return 1;
    }
}
export { Plugin };
