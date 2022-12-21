/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Reaction } from "./Reaction.js";
import { System } from "../index.js";
/** @class
 *  A common reaction.
 *  @extends System.Reaction
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  common reaction
 */
class CommonReaction extends Reaction {
    constructor(json) {
        super(json);
    }
    /** Read the JSON associated to the common reaction.
     *  @param {Record<string, any>} - json Json object describing the common
     *  reaction
     */
    read(json) {
        super.read(json);
        this.parameters = System.Parameter.readParameters(json);
    }
}
export { CommonReaction };
