/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils, Interpreter } from '../Common/index.js';
import { Base } from './Base.js';
import { DynamicValue } from './DynamicValue.js';
import { Player } from '../Core/index.js';
import { Datas, Scene, System } from '../index.js';
/** @class
 *  A characteristic of a common skill item.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  characteristic
 */
class Characteristic extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the characteristic.
     *  @param {Record<string, any>} - json Json object describing the
     *  characteristic
     */
    read(json) {
        this.kind = Utils.defaultValue(json.k, Enum.CharacteristicKind
            .IncreaseDecrease);
        switch (this.kind) {
            case Enum.CharacteristicKind.IncreaseDecrease:
                this.isIncreaseDecrease = Utils.defaultValue(json.iid, true);
                this.increaseDecreaseKind = Utils.defaultValue(json.idk, Enum.
                    IncreaseDecreaseKind.StatValue);
                switch (this.increaseDecreaseKind) {
                    case Enum.IncreaseDecreaseKind.StatValue:
                        this.statisticValueID = DynamicValue
                            .readOrDefaultDatabase(json.svid);
                        break;
                    case Enum.IncreaseDecreaseKind.ElementRes:
                        this.elementResID = DynamicValue.readOrDefaultDatabase(json.erid);
                        break;
                    case Enum.IncreaseDecreaseKind.StatusRes:
                        this.statusResID = DynamicValue.readOrDefaultDatabase(json.strid);
                        break;
                    case Enum.IncreaseDecreaseKind.CurrencyGain:
                        this.currencyGainID = DynamicValue.readOrDefaultDatabase(json.cgid);
                        break;
                    case Enum.IncreaseDecreaseKind.SkillCost:
                        this.skillCostID = DynamicValue.readOrDefaultDatabase(json.scid);
                        this.isAllSkillCost = Utils.defaultValue(json.iasc, true);
                        break;
                    case Enum.IncreaseDecreaseKind.Variable:
                        this.variableID = Utils.defaultValue(json.vid, 1);
                        break;
                }
                this.operation = Utils.defaultValue(json.o, true);
                this.value = DynamicValue.readOrDefaultNumber(json.v);
                this.unit = Utils.defaultValue(json.u, true);
                break;
            case Enum.CharacteristicKind.Script:
                this.script = DynamicValue.readOrDefaultMessage(json.s);
                break;
            case Enum.CharacteristicKind.AllowForbidEquip:
                this.isAllowEquip = Utils.defaultValue(json.iae, true);
                this.isAllowEquipWeapon = Utils.defaultValue(json.iaew, true);
                this.equipWeaponTypeID = DynamicValue.readOrDefaultDatabase(json
                    .ewtid);
                this.equipArmorTypeID = DynamicValue.readOrDefaultDatabase(json
                    .eatid);
                break;
            case Enum.CharacteristicKind.AllowForbidChange:
                this.isAllowChangeEquipment = Utils.defaultValue(json.iace, true);
                this.changeEquipmentID = DynamicValue.readOrDefaultDatabase(json
                    .ceid);
                break;
            case Enum.CharacteristicKind.BeginEquipment:
                this.beginEquipmentID = DynamicValue.readOrDefaultDatabase(json
                    .beid);
                this.isBeginWeapon = Utils.defaultValue(json.ibw, true);
                this.beginWeaponArmorID = DynamicValue.readOrDefaultDatabase(json.bwaid);
                break;
            case Enum.CharacteristicKind.Element:
                this.elementID = System.DynamicValue.readOrDefaultDatabase(json.eid);
                break;
        }
    }
    /**
     *  Get the new stat value of a player with this characteristic bonus.
     *  @param {Player} gamePlayer - the player
     *  @returns {number[]}
     */
    getNewStatValue(gamePlayer) {
        let statID, stat, value, baseStatValue;
        switch (this.kind) {
            case Enum.CharacteristicKind.IncreaseDecrease:
                switch (this.increaseDecreaseKind) {
                    case Enum.IncreaseDecreaseKind.StatValue:
                        statID = this.statisticValueID.getValue();
                        stat = Datas.BattleSystems.getStatistic(statID);
                        value = this.value.getValue() * (this.isIncreaseDecrease
                            ? 1 : -1);
                        baseStatValue = gamePlayer[stat.getAbbreviationNext()] -
                            gamePlayer[stat.getBonusAbbreviation()];
                        if (this.operation) { // *
                            value = this.unit ? baseStatValue * Math.round(baseStatValue * value / 100) : baseStatValue *
                                value; // % / Fix
                        }
                        else { // +
                            value = this.unit ? Math.round(baseStatValue * value
                                / 100) : value; // % / Fix
                        }
                        return [statID, value];
                    case Enum.IncreaseDecreaseKind.ElementRes:
                        statID = this.unit ? Datas.BattleSystems
                            .getStatisticElementPercent(this.elementResID
                            .getValue()) : Datas.BattleSystems
                            .getStatisticElement(this.elementResID.getValue());
                        stat = Datas.BattleSystems.getStatistic(statID);
                        value = this.value.getValue() * (this.isIncreaseDecrease
                            ? 1 : -1);
                        if (this.operation) { // *
                            value *= gamePlayer[stat.getAbbreviationNext()] -
                                gamePlayer[stat.getBonusAbbreviation()];
                        }
                        return [statID, value];
                    default:
                        return null;
                }
            default:
                return null;
        }
    }
    /**
     *  Set the increase decrease values for specific res.
     *  @param {Record<string, any>} res
     */
    setIncreaseDecreaseValues(res) {
        let propName;
        let id;
        switch (this.increaseDecreaseKind) {
            case Enum.IncreaseDecreaseKind.StatusRes:
                propName = "statusRes";
                id = this.statusResID.getValue();
                break;
            case Enum.IncreaseDecreaseKind.ExperienceGain:
                propName = "experienceGain";
                id = 0;
                break;
            case Enum.IncreaseDecreaseKind.CurrencyGain:
                propName = "currencyGain";
                id = this.currencyGainID.getValue();
                break;
            case Enum.IncreaseDecreaseKind.SkillCost:
                propName = "skillCostRes";
                id = this.isAllSkillCost ? -1 : this.skillCostID.getValue();
                break;
        }
        if (!res[propName][id]) {
            res[propName][id] = {
                multiplication: 1,
                addition: 0
            };
        }
        let value = this.value.getValue();
        if (this.operation) { // * (multiplication)
            let v = this.unit ? value / 100 : value;
            res[propName][id].multiplication *= this.isIncreaseDecrease ? v : 1 / v; // % / Fix
        }
        else { // + (addition)
            res[propName][id].addition += this.isIncreaseDecrease ? value : -value; // % / Fix
        }
    }
    /**
     *  Execute the characteristic script.
     *  @param {Player} user
     */
    executeScript(user) {
        Interpreter.evaluate(this.script.getValue(), { user: user, addReturn: false });
    }
    /**
     *  Get the string representation of the characteristic.
     *  @returns {string}
     */
    toString() {
        let user = Scene.Map.current.user ? Scene.Map.current.user.player :
            Player.getTemporaryPlayer();
        let target = Player.getTemporaryPlayer();
        let result = "";
        switch (this.kind) {
            case Enum.CharacteristicKind.IncreaseDecrease:
                switch (this.increaseDecreaseKind) {
                    case Enum.IncreaseDecreaseKind.StatValue:
                        result += Datas.BattleSystems.getStatistic(Interpreter
                            .evaluate(this.statisticValueID.getValue(), { user: user, target: target })).name();
                        break;
                    case Enum.IncreaseDecreaseKind.ElementRes:
                        result += Datas.BattleSystems.getElement(this
                            .elementResID.getValue()).name() + " res.";
                        break;
                    case Enum.IncreaseDecreaseKind.StatusRes:
                        result += Datas.Status.get(this.statusResID.getValue())
                            .name() + " res.";
                        break;
                    case Enum.IncreaseDecreaseKind.ExperienceGain:
                        result += Datas.BattleSystems.getExpStatistic().name() +
                            " gain";
                        break;
                    case Enum.IncreaseDecreaseKind.CurrencyGain:
                        result += Datas.Systems.getCurrency(this.currencyGainID
                            .getValue()).name() + " gain";
                        break;
                    case Enum.IncreaseDecreaseKind.SkillCost:
                        if (this.isAllSkillCost) {
                            result += "All skills cost";
                        }
                        else {
                            result += Datas.Skills.get(this.skillCostID
                                .getValue()).name() + " skill cost";
                        }
                        break;
                    case Enum.IncreaseDecreaseKind.Variable:
                        result += Datas.Variables.get(this.variableID);
                        break;
                }
                result += " ";
                let sign = this.isIncreaseDecrease ? 1 : -1;
                let value = this.value.getValue();
                sign *= Math.sign(value);
                if (this.operation) {
                    result += "x";
                    if (sign === -1) {
                        result += "/";
                    }
                }
                else {
                    if (sign === 1) {
                        result += "+";
                    }
                    else if (sign === -1) {
                        result += "-";
                    }
                }
                result += Math.abs(value);
                if (this.unit) {
                    result += "%";
                }
                break;
            default:
                break;
        }
        return result;
    }
}
export { Characteristic };
