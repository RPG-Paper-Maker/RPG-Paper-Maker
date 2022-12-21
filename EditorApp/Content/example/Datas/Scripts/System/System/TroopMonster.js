/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System } from "../index.js";
import { Utils } from "../Common/index.js";
import { Base } from "./Base.js";
/** @class
 *  A troop monster.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  troop monster
 */
class TroopMonster extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the troop monster.
     *  @param {Record<string, any>} - json Json object describing the troop
     *  monster
     */
    read(json) {
        this.id = json.id;
        this.level = System.DynamicValue.readOrDefaultNumber(json.l, 1);
        this.isSpecificPosition = Utils.defaultValue(json.isSpecificPosition, false);
        this.specificPosition = System.DynamicValue.readOrDefaultMessage(json
            .specificPosition, "new Core.Vector3(0,0,0)");
    }
}
export { TroopMonster };
