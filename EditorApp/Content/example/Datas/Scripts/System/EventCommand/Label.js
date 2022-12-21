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
/** @class
 *  An event command for label.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class Label extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.name = System.DynamicValue.createValueCommand(command, iterator);
    }
}
export { Label };
