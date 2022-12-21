/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Manager, Scene, System } from "../index.js";
import { Base } from "./Base.js";
/** @class
 *  An event command for entering a name menu.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class EnterANameMenu extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.heroInstanceID = System.DynamicValue.createValueCommand(command, iterator);
        this.maxCharacters = System.DynamicValue.createValueCommand(command, iterator);
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            opened: false
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
        if (!Scene.Map.allowMainMenu || currentState.opened) {
            return 1;
        }
        Manager.Stack.push(new Scene.MenuEnterAName(this.heroInstanceID.getValue(), this.maxCharacters.getValue()));
        currentState.opened = true;
        return 0;
    }
}
export { EnterANameMenu };
