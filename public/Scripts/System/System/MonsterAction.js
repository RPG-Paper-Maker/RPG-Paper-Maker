/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils } from '../Common/index.js';
var MonsterActionKind = Enum.MonsterActionKind;
var OperationKind = Enum.OperationKind;
var MonsterActionTargetKind = Enum.MonsterActionTargetKind;
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
/** @class
 *  A monster action of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  monster action
 */
class MonsterAction extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the monster action.
     *  @param {Record<string, any>} - json Json object describing the monster
     *  action
     */
    read(json) {
        this.actionKind = Utils.defaultValue(json.ak, MonsterActionKind
            .DoNothing);
        switch (this.actionKind) {
            case MonsterActionKind.UseSkill:
                this.skillID = DynamicValue.readOrDefaultNumber(json.sid, 1);
                break;
            case MonsterActionKind.UseItem:
                this.itemID = DynamicValue.readOrDefaultNumber(json.iid, 1);
                this.itemNumberMax = DynamicValue.readOrDefaultNumber(json.inm, 1);
                break;
            default:
                break;
        }
        this.priority = DynamicValue.readOrDefaultNumber(json.p, 10);
        this.targetKind = Utils.defaultValue(json.tk, MonsterActionTargetKind
            .Random);
        this.isConditionTurn = Utils.defaultValue(json.ict, false);
        if (this.isConditionTurn) {
            this.operationKindTurn = Utils.defaultValue(json.okt, OperationKind
                .EqualTo);
            this.turnValueCompare = DynamicValue.readOrDefaultNumber(json.tvc, 0);
        }
        this.isConditionStatistic = Utils.defaultValue(json.ics, false);
        if (this.isConditionStatistic) {
            this.statisticID = DynamicValue.readOrDefaultDatabase(json.stid);
            this.operationKindStatistic = Utils.defaultValue(json.oks, OperationKind.EqualTo);
            this.statisticValueCompare = DynamicValue.readOrDefaultNumber(json
                .svc, 0);
        }
        this.isConditionVariable = Utils.defaultValue(json.icv, false);
        if (this.isConditionVariable) {
            this.variableID = Utils.defaultValue(json.vid, 1);
            this.operationKindVariable = Utils.defaultValue(json.okv, OperationKind.EqualTo);
            this.variableValueCompare = DynamicValue.readOrDefaultNumber(json
                .vvc, 0);
        }
        this.isConditionStatus = Utils.defaultValue(json.icst, false);
        if (this.isConditionStatus) {
            this.statusID = DynamicValue.readOrDefaultNumber(json.stsid, 0);
        }
        this.isConditionScript = Utils.defaultValue(json.icsc, false);
        if (this.isConditionScript) {
            this.script = DynamicValue.readOrDefaultMessage(json.s, "");
        }
    }
}
export { MonsterAction };
