/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Icon } from "./Icon.js";
/** @class
 *  A currency of the game.
 *  @extends {System.Icon}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  currency
 */
class Currency extends Icon {
    constructor(json) {
        super(json);
    }
}
export { Currency };
