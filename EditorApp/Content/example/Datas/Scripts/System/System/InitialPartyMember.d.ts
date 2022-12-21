import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import { Base } from "./Base.js";
/** @class
 *  An initial party member of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  initial party member
 */
declare class InitialPartyMember extends Base {
    level: System.DynamicValue;
    teamKind: Enum.GroupKind;
    characterKind: Enum.CharacterKind;
    heroID: System.DynamicValue;
    variableInstanceID: System.DynamicValue;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the initial party member.
     *  @param {Record<string, any>} - json Json object describing the initial
     *  party member
     */
    read(json: Record<string, any>): void;
}
export { InitialPartyMember };
