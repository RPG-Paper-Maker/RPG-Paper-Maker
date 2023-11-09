/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from '../Common/index.js';
import { SpecialElement } from './SpecialElement.js';
/** @class
 *  Abn autotile of the game.
 *  @extends System.SpecialElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  autotile
 */
class Autotile extends SpecialElement {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the autotile.
     *  @param {Record<string, any>} - json Json object describing the mountain
     */
    read(json) {
        super.read(json);
        this.isAnimated = Utils.defaultValue(json.isAnimated, false);
    }
}
export { Autotile };
