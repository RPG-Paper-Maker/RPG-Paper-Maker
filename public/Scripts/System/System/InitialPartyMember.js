/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System } from "../index.js";
import { Enum, Utils } from '../Common/index.js';
import { Base } from './Base.js';
/** @class
 *  An initial party member of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  initial party member
 */
class InitialPartyMember extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the initial party member.
     *  @param {Record<string, any>} - json Json object describing the initial
     *  party member
     */
    read(json) {
        this.level = System.DynamicValue.readOrDefaultNumber(json.level, 1);
        this.teamKind = Utils.defaultValue(json.teamKind, 0);
        const isHero = Utils.defaultValue(json.isHero, true);
        this.characterKind = isHero ? Enum.CharacterKind.Hero : Enum
            .CharacterKind.Monster;
        this.heroID = System.DynamicValue.readOrDefaultDatabase(isHero ? json
            .heroID : json.monsterID);
        this.variableInstanceID = System.DynamicValue.readOrDefaultVariable(json.variableInstanceID);
    }
}
export { InitialPartyMember };
