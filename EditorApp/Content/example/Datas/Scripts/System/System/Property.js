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
 *  A property of an object.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  property
 */
class Property extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the property.
     *  @param {Record<string, any>} - json Json object describing the property
     */
    read(json) {
        this.id = json.id;
        this.initialValue = System.DynamicValue.readOrNone(json.iv);
    }
}
export { Property };
