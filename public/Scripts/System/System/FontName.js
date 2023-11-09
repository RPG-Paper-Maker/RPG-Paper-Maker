/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System } from "../index.js";
import { Constants, Utils } from '../Common/index.js';
import { Base } from './Base.js';
/** @class
 *  A font name of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  font name
 */
class FontName extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the font name.
     *  @param {Record<string, any>} - json Json object describing the font name
     */
    read(json) {
        this.name = json.name;
        this.isBasic = Utils.defaultValue(json.isBasic, true);
        this.font = System.DynamicValue.readOrDefaultMessage(json.f, Constants
            .DEFAULT_FONT_NAME);
        this.customFontID = Utils.defaultValue(json.customFontID, 1);
    }
    /**
     *  Get the font name (default or custom).
     *  @returns {string}
     */
    getName() {
        return this.isBasic ? this.font.getValue() : this.name;
    }
}
export { FontName };
