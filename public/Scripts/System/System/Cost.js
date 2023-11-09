/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils, Interpreter } from '../Common/index.js';
var DamagesKind = Enum.DamagesKind;
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
import { Datas, Scene, System } from '../index.js';
import { Player, Game } from '../Core/index.js';
/** @class
 *  A cost of a common skill item.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  cost
 */
class Cost extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Get the price for several costs.
     */
    static getPrice(list) {
        let price = {};
        let cost, value;
        for (let i = 0, l = list.length; i < l; i++) {
            cost = list[i];
            value = [cost.kind, Interpreter.evaluate(cost.valueFormula.getValue())];
            switch (cost.kind) {
                case DamagesKind.Stat:
                    price[cost.statisticID.getValue()] = value;
                    break;
                case DamagesKind.Currency:
                    price[cost.currencyID.getValue()] = value;
                    break;
                case DamagesKind.Variable:
                    price[cost.variableID] = value;
                    break;
            }
        }
        return price;
    }
    /**
     *  Read the JSON associated to the cost.
     *  @param {Record<string, any>} - json Json object describing the cost
     */
    read(json) {
        this.kind = Utils.defaultValue(json.k, DamagesKind.Stat);
        switch (this.kind) {
            case DamagesKind.Stat:
                this.statisticID = DynamicValue.readOrDefaultDatabase(json.sid);
                break;
            case DamagesKind.Currency:
                this.currencyID = DynamicValue.readOrDefaultDatabase(json.cid);
                break;
            case DamagesKind.Variable:
                this.variableID = Utils.defaultValue(json.vid, 1);
                break;
        }
        this.valueFormula = DynamicValue.readOrDefaultMessage(json.vf);
    }
    /**
     *  Parse command with iterator.
     *  @param {any[]} command
     *  @param {StructIterator} iterator
     */
    parse(command, iterator) {
        this.kind = command[iterator.i++];
        switch (this.kind) {
            case Enum.DamagesKind.Stat:
                this.statisticID = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 1:
                this.currencyID = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 2:
                this.variableID = command[iterator.i++];
                break;
        }
        this.valueFormula = System.DynamicValue.createValueCommand(command, iterator);
    }
    /**
     *  Get value according to user characteristics.
     */
    getValue(user, target) {
        let value = Interpreter.evaluate(this.valueFormula.getValue(), { user: user, target: target });
        let baseValue = value;
        if (user.skillCostRes[-1]) {
            value *= user.skillCostRes[-1].multiplication;
        }
        if (user.skillCostRes[this.skillItem.id]) {
            value *= user.skillCostRes[this.skillItem.id].multiplication;
        }
        if (user.skillCostRes[-1]) {
            value += baseValue * user.skillCostRes[-1].addition / 100;
        }
        if (user.skillCostRes[this.skillItem.id]) {
            value += baseValue * user.skillCostRes[this.skillItem.id].multiplication / 100;
        }
        return Math.round(value);
    }
    /**
     *  Use the cost.
     */
    use() {
        let user = Scene.Map.current.user ? Scene.Map.current.user.player :
            Player.getTemporaryPlayer();
        let target = Player.getTemporaryPlayer();
        let value = this.getValue(user, target);
        switch (this.kind) {
            case DamagesKind.Stat:
                user[Datas.BattleSystems.getStatistic(this.statisticID
                    .getValue()).abbreviation] -= value;
                break;
            case DamagesKind.Currency:
                Game.current.currencies[this.currencyID.getValue()] -=
                    value;
                break;
            case DamagesKind.Variable:
                Game.current.variables[this.variableID] -= value;
                break;
        }
    }
    /**
     *  Check if the cost is possible.
     *  @returns {boolean}
     */
    isPossible() {
        let user = Scene.Map.current.user ? Scene.Map.current.user
            .player : Player.getTemporaryPlayer();
        let target = Player.getTemporaryPlayer();
        let value = this.getValue(user, target);
        let currentValue;
        switch (this.kind) {
            case DamagesKind.Stat:
                currentValue = user[Datas.BattleSystems.getStatistic(this
                    .statisticID.getValue()).abbreviation];
                break;
            case DamagesKind.Currency:
                currentValue = Game.current.getCurrency(this.currencyID
                    .getValue());
                break;
            case DamagesKind.Variable:
                currentValue = Game.current.getVariable(this.variableID);
                break;
        }
        return (currentValue - value >= 0);
    }
    /**
     *  Get the string representing the cost.
     *  @returns {string}
     */
    toString() {
        let user = Scene.Map.current.user ? Scene.Map.current.user
            .player : Player.getTemporaryPlayer();
        let target = Player.getTemporaryPlayer();
        let result = this.getValue(user, target) + " ";
        switch (this.kind) {
            case DamagesKind.Stat:
                result += Datas.BattleSystems.getStatistic(this.statisticID
                    .getValue()).name();
                break;
            case DamagesKind.Currency:
                result += Datas.Systems.getCurrency(this.currencyID.getValue())
                    .name();
                break;
            case DamagesKind.Variable:
                result += Datas.Variables.get(this.variableID);
                break;
        }
        return result;
    }
}
export { Cost };
