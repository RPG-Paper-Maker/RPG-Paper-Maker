/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { Utils, Enum, Constants, Interpreter, Mathf } from '../Common/index.js';
var EffectKind = Enum.EffectKind;
var DamagesKind = Enum.DamagesKind;
var EffectSpecialActionKind = Enum.EffectSpecialActionKind;
var CharacterKind = Enum.CharacterKind;
import { System, Manager, Datas, Scene } from '../index.js';
import { Player, ReactionInterpreter, Game } from '../Core/index.js';
/** @class
 *  An effect of a common skill item.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  effect
 */
class Effect extends Base {
    constructor(json) {
        super(json);
        this.canSkip = false;
    }
    /**
     *  Read the JSON associated to the effect.
     *  @param {Record<string, any>} - json Json object describing the effect
     */
    read(json) {
        this.kind = Utils.defaultValue(json.k, EffectKind.Damages);
        switch (this.kind) {
            case EffectKind.Damages: {
                this.damageKind = Utils.defaultValue(json.dk, DamagesKind.Stat);
                switch (this.damageKind) {
                    case DamagesKind.Stat:
                        this.damageStatisticID = System.DynamicValue
                            .readOrDefaultDatabase(json.dsid);
                        break;
                    case DamagesKind.Currency:
                        this.damageCurrencyID = System.DynamicValue
                            .readOrDefaultDatabase(json.dcid);
                        break;
                    case DamagesKind.Variable:
                        this.damageVariableID = Utils.defaultValue(json.dvid, 1);
                        break;
                }
                this.damageFormula = System.DynamicValue.readOrDefaultMessage(json.df);
                this.isDamagesMinimum = Utils.defaultValue(json.idmin, true);
                this.damagesMinimumFormula = System.DynamicValue
                    .readOrDefaultMessage(json.dmin, Constants.STRING_ZERO);
                this.isDamagesMaximum = Utils.defaultValue(json.idmax, false);
                this.damagesMaximumFormula = System.DynamicValue
                    .readOrDefaultMessage(json.dmax, Constants.STRING_ZERO);
                this.isDamageElement = Utils.defaultValue(json.ide, false);
                this.damageElementID = System.DynamicValue.readOrDefaultDatabase(json.deid);
                this.isDamageVariance = Utils.defaultValue(json.idv, false);
                this.damageVarianceFormula = System.DynamicValue
                    .readOrDefaultMessage(json.dvf, Constants.STRING_ZERO);
                this.isDamageCritical = Utils.defaultValue(json.idc, false);
                this.damageCriticalFormula = System.DynamicValue
                    .readOrDefaultMessage(json.dcf, Constants.STRING_ZERO);
                this.isDamagePrecision = Utils.defaultValue(json.idp, false);
                this.damagePrecisionFormula = System.DynamicValue
                    .readOrDefaultMessage(json.dpf, Utils.numToString(100));
                this.isDamageStockVariableID = Utils.defaultValue(json.idsv, false);
                this.damageStockVariableID = Utils.defaultValue(json.dsv, 1);
                this.isDamageDisplayName = Utils.defaultValue(json.iddn, false);
                break;
            }
            case EffectKind.Status:
                this.isAddStatus = Utils.defaultValue(json.iast, true);
                this.statusID = System.DynamicValue.readOrDefaultDatabase(json
                    .sid);
                this.statusPrecisionFormula = System.DynamicValue
                    .readOrDefaultMessage(json.spf, Utils.numToString(100));
                break;
            case EffectKind.AddRemoveSkill:
                this.isAddSkill = Utils.defaultValue(json.iask, true);
                this.addSkillID = System.DynamicValue.readOrDefaultDatabase(json
                    .asid);
                break;
            case EffectKind.PerformSkill:
                this.performSkillID = System.DynamicValue.readOrDefaultDatabase(json.psid);
                break;
            case EffectKind.CommonReaction:
                this.commonReaction = (Utils
                    .isUndefined(json.cr) ? null : Manager.Events
                    .getEventCommand(json.cr));
                break;
            case EffectKind.SpecialActions:
                this.specialActionKind = Utils.defaultValue(json.sak, EffectSpecialActionKind.ApplyWeapons);
                break;
            case EffectKind.Script:
                this.scriptFormula = System.DynamicValue.readOrDefaultMessage(json.sf);
                break;
        }
        this.isTemporarilyChangeTarget = Utils.defaultValue(json.itct, false);
        this.temporarilyChangeTargetFormula = System.DynamicValue
            .readOrDefaultMessage(json.tctf);
    }
    /**
     *  Get if effect is miss in battler temp variables.
     */
    getMissAndCrit() {
        let user = Scene.Map.current.user ? Scene.Map.current.user.player : Player.getTemporaryPlayer();
        Scene.Map.current.tempTargets = Scene.Map.current.targets;
        if (this.isTemporarilyChangeTarget) {
            Scene.Map.current.targets = Interpreter.evaluate(this.temporarilyChangeTargetFormula
                .getValue(), { user: user });
        }
        let targets = Scene.Map.current.targets;
        let l = targets.length;
        let target, battler, precision, critical, miss, crit;
        switch (this.kind) {
            case EffectKind.Damages: {
                let damage;
                for (let i = 0; i < l; i++) {
                    battler = targets[i];
                    target = battler.player;
                    miss = false;
                    crit = false;
                    if (this.skillItem && !this.skillItem.isPossible(target, false)) {
                        continue;
                    }
                    damage = 0;
                    if (this.isDamagePrecision) {
                        precision = Interpreter.evaluate(this
                            .damagePrecisionFormula.getValue(), { user: user,
                            target: target });
                        if (!Mathf.randomPercentTest(precision)) {
                            damage = null;
                            miss = true;
                        }
                    }
                    if (damage !== null) {
                        if (this.isDamageCritical) {
                            critical = Interpreter.evaluate(this
                                .damageCriticalFormula.getValue(), { user: user,
                                target: target });
                            if (Mathf.randomPercentTest(critical)) {
                                crit = true;
                            }
                        }
                    }
                    battler.tempIsDamagesMiss = miss;
                    battler.tempIsDamagesCritical = crit;
                }
                break;
            }
            case EffectKind.Status: {
                let precision, id;
                for (let i = 0, l = targets.length; i < l; i++) {
                    battler = targets[i];
                    target = battler.player;
                    miss = false;
                    precision = Interpreter.evaluate(this.statusPrecisionFormula
                        .getValue(), { user: user, target: battler.player });
                    id = this.statusID.getValue();
                    // Handle resistance
                    if (target.statusRes[id]) {
                        precision /= target.statusRes[id].multiplication;
                        precision -= target.statusRes[id].addition;
                    }
                    if (!Mathf.randomPercentTest(precision)) {
                        miss = true;
                    }
                    battler.tempIsDamagesMiss = miss;
                }
            }
            default: {
                for (const battler of targets) {
                    battler.tempIsDamagesMiss = null;
                    battler.tempIsDamagesCritical = null;
                }
            }
        }
    }
    /**
     *  Execute the effect.
     *  @returns {boolean}
     */
    execute(forceReaction = false) {
        let user = Scene.Map.current.user ? Scene.Map.current.user.player :
            Player.getTemporaryPlayer();
        this.canSkip = false;
        Scene.Map.current.tempTargets = Scene.Map.current.targets;
        if (this.isTemporarilyChangeTarget) {
            Scene.Map.current.targets = Interpreter.evaluate(this
                .temporarilyChangeTargetFormula.getValue(), { user: user });
        }
        let targets = Scene.Map.current.targets;
        let result = false;
        let l = targets.length;
        let target, battler;
        switch (this.kind) {
            case EffectKind.Damages: {
                let damage, damageName, miss, crit, precision, variance, fixRes, percentRes, element, critical, stat, abbreviation, max, before, currencyID, targetElement, systemElement, efficiency;
                for (let i = 0; i < l; i++) {
                    battler = targets[i];
                    target = battler.player;
                    if (this.skillItem && !this.skillItem.isPossible(target, false)) {
                        battler.tempIsDamagesMiss = null;
                        battler.tempIsDamagesCritical = null;
                        continue;
                    }
                    damage = 0;
                    damageName = "";
                    miss = false;
                    crit = false;
                    // Calculate damages
                    if (this.isDamagePrecision) {
                        precision = Interpreter.evaluate(this
                            .damagePrecisionFormula.getValue(), { user: user,
                            target: target });
                        if (battler.tempIsDamagesMiss || (battler.tempIsDamagesMiss
                            === null && !Mathf.randomPercentTest(precision))) {
                            damage = null;
                            miss = true;
                        }
                    }
                    if (damage !== null) {
                        damage = Interpreter.evaluate(this.damageFormula
                            .getValue(), { user: user, target: target });
                        if (this.isDamageVariance) {
                            variance = Math.round(damage * Interpreter.evaluate(this.damageVarianceFormula.getValue(), { user: user, target: target }) / 100);
                            damage = Mathf.random(damage - variance, damage +
                                variance);
                        }
                        if (this.isDamageElement) {
                            element = this.damageElementID.getValue();
                            systemElement = Datas.BattleSystems.getElement(element);
                            // If target also has elements
                            for (targetElement of target.elements) {
                                efficiency = systemElement.efficiency[targetElement.getValue()];
                                damage *= efficiency ? efficiency.getValue() : 1;
                            }
                            fixRes = target[Datas.BattleSystems.getStatistic(Datas.BattleSystems.getStatisticElement(element))
                                .abbreviation];
                            percentRes = target[Datas.BattleSystems.getStatistic(Datas.BattleSystems.getStatisticElementPercent(element)).abbreviation];
                            damage -= (damage * percentRes / 100);
                            damage -= fixRes;
                        }
                        if (this.isDamageCritical) {
                            critical = Interpreter.evaluate(this
                                .damageCriticalFormula.getValue(), { user: user,
                                target: target });
                            if (battler.tempIsDamagesCritical || (battler
                                .tempIsDamagesCritical === null && Mathf
                                .randomPercentTest(critical))) {
                                damage = Interpreter.evaluate(Interpreter
                                    .evaluate(Datas.BattleSystems.formulaCrit
                                    .getValue(), { user: user, target: target,
                                    damage: damage }));
                                crit = true;
                            }
                        }
                        if (this.isDamagesMinimum) {
                            damage = Math.max(damage, Interpreter.evaluate(this
                                .damagesMinimumFormula.getValue(), { user: user,
                                target: target }));
                        }
                        if (this.isDamagesMaximum) {
                            damage = Math.min(damage, Interpreter.evaluate(this
                                .damagesMaximumFormula.getValue(), { user: user,
                                target: target }));
                        }
                        damage = Math.round(damage);
                    }
                    if (this.isDamageStockVariableID) {
                        Game.current.variables[this.damageStockVariableID]
                            = damage === null ? 0 : damage;
                    }
                    if (this.isDamageDisplayName) {
                        switch (this.damageKind) {
                            case Enum.DamagesKind.Stat:
                                damageName = Datas.BattleSystems.getStatistic(this.damageStatisticID.getValue()).name();
                                break;
                            case Enum.DamagesKind.Currency:
                                damageName = Datas.Systems.getCurrency(this.damageCurrencyID.getValue()).name();
                                break;
                            default:
                                break;
                        }
                    }
                    // For diplaying result in HUD
                    if (Scene.Map.current.isBattleMap) {
                        battler.damages = damage;
                        battler.damagesName = damageName;
                        battler.isDamagesMiss = miss;
                        battler.isDamagesCritical = crit;
                    }
                    // Result accoring to damage kind
                    switch (this.damageKind) {
                        case DamagesKind.Stat:
                            stat = Datas.BattleSystems.getStatistic(this
                                .damageStatisticID.getValue());
                            abbreviation = stat.abbreviation;
                            max = target[stat.getMaxAbbreviation()];
                            before = target[abbreviation];
                            target[abbreviation] -= damage;
                            if (target[abbreviation] < 0) {
                                target[abbreviation] = 0;
                            }
                            if (!stat.isFix) {
                                target[abbreviation] = Math.min(target[abbreviation], max);
                            }
                            result = result || before !== target[abbreviation];
                            break;
                        case DamagesKind.Currency:
                            currencyID = this.damageCurrencyID.getValue();
                            if (target.kind === CharacterKind.Hero) {
                                before = Game.current.currencies[currencyID];
                                Game.current.currencies[currencyID] -=
                                    damage;
                                if (Game.current.currencies[currencyID] <
                                    0) {
                                    Game.current.currencies[currencyID] =
                                        0;
                                }
                                result = result || before !== Game.current
                                    .currencies[currencyID];
                            }
                            break;
                        case DamagesKind.Variable:
                            before = Game.current.variables[this
                                .damageVariableID];
                            Game.current.variables[this.damageVariableID]
                                -= damage;
                            result = result || before !== Game.current
                                .variables[this.damageVariableID];
                            break;
                    }
                    battler.tempIsDamagesMiss = null;
                    battler.tempIsDamagesCritical = null;
                }
                break;
            }
            case EffectKind.Status: {
                let precision, miss, id, previousFirst;
                this.canSkip = true;
                for (let i = 0, l = targets.length; i < l; i++) {
                    battler = targets[i];
                    target = battler.player;
                    id = this.statusID.getValue();
                    if (!this.isAddStatus && !target.hasStatus(id)) {
                        battler.damages = null;
                        battler.isDamagesMiss = false;
                        battler.isDamagesCritical = false;
                        battler.lastStatus = null;
                        battler.lastStatusHealed = null;
                        battler.tempIsDamagesMiss = null;
                        battler.tempIsDamagesCritical = null;
                        continue;
                    }
                    else {
                        this.canSkip = false;
                    }
                    precision = Interpreter.evaluate(this.statusPrecisionFormula
                        .getValue(), { user: user, target: battler.player });
                    // Handle resistance
                    if (target.statusRes[id]) {
                        precision /= target.statusRes[id].multiplication;
                        precision -= target.statusRes[id].addition;
                    }
                    if (battler.tempIsDamagesMiss === false || (battler.tempIsDamagesMiss
                        === null && Mathf.randomPercentTest(precision))) {
                        miss = false;
                        previousFirst = battler.player.status[0];
                        // Add or remove status
                        if (this.isAddStatus) {
                            battler.lastStatusHealed = null;
                            battler.lastStatus = target.addStatus(id);
                        }
                        else {
                            battler.lastStatusHealed = target.removeStatus(id);
                            battler.lastStatus = null;
                        }
                        // If first status changed, change animation
                        battler.updateAnimationStatus(previousFirst);
                    }
                    else {
                        miss = true;
                    }
                    // For diplaying result in HUD
                    if (Scene.Map.current.isBattleMap) {
                        battler.damages = null;
                        battler.isDamagesMiss = miss;
                        battler.isDamagesCritical = false;
                    }
                    battler.tempIsDamagesMiss = null;
                    battler.tempIsDamagesCritical = null;
                }
                result = true;
                break;
            }
            case EffectKind.AddRemoveSkill:
                for (battler of targets) {
                    let skillID = this.addSkillID.getValue();
                    if (this.isAddSkill) {
                        battler.player.addSkill(skillID);
                    }
                    else {
                        battler.player.removeSkill(skillID);
                    }
                }
                result = true;
                break;
            case EffectKind.PerformSkill:
                break;
            case EffectKind.CommonReaction:
                let reactionInterpreter = new ReactionInterpreter(null, Datas
                    .CommonEvents.getCommonReaction(this.commonReaction
                    .commonReactionID), null, null, this.commonReaction.parameters);
                Manager.Stack.top.reactionInterpretersEffects.push(reactionInterpreter);
                Manager.Stack.top.reactionInterpreters.push(reactionInterpreter);
                if (forceReaction) {
                    Manager.Stack.top.updateInterpreters();
                    if (Manager.Stack.top.reactionInterpretersEffects.length === 0) {
                        this.canSkip = true;
                    }
                }
                result = true;
                break;
            case EffectKind.SpecialActions:
                Scene.Map.current.battleCommandKind = this.specialActionKind;
                result = true;
                break;
            case EffectKind.Script:
                let script = this.scriptFormula.getValue();
                if (targets.length === 0) {
                    Interpreter.evaluate(script, { addReturn: false, user: user,
                        target: null });
                }
                for (let target of targets) {
                    Interpreter.evaluate(script, { addReturn: false, user: user,
                        target: target.player });
                }
                result = true;
                break;
        }
        Scene.Map.current.targets = Scene.Map.current.tempTargets;
        return result;
    }
    /**
     *  Check if the effect is animated.
     *  @returns {boolean}
     */
    isAnimated() {
        return this.kind === EffectKind.Damages || this.kind === EffectKind
            .Status || this.kind === EffectKind.CommonReaction;
    }
    /**
     *  Get the string representation of the effect.
     *  @returns {string}
     */
    toString() {
        let user = Scene.Map.current.user ? Scene.Map.current.user
            .player : Player.getTemporaryPlayer();
        let target = Player.getTemporaryPlayer();
        switch (this.kind) {
            case EffectKind.Damages:
                let damage = Interpreter.evaluate(this.damageFormula.getValue(), { user: user, target: target });
                damage = Math.round(damage);
                if (damage === 0) {
                    return "";
                }
                let precision = 100;
                let critical = 0;
                let variance = 0;
                if (this.isDamageVariance) {
                    variance = Math.round(damage * Interpreter.evaluate(this
                        .damageVarianceFormula.getValue(), { user: user, target: target }) / 100);
                }
                let min = damage - variance;
                let max = damage + variance;
                if (damage < 0) {
                    let temp = min;
                    min = -max;
                    max = -temp;
                }
                let options = [];
                if (this.isDamagePrecision) {
                    precision = Interpreter.evaluate(this.damagePrecisionFormula
                        .getValue(), { user: user, target: target });
                    options.push(Datas.Languages.extras.precision.name() + ": " +
                        precision + "%");
                }
                if (this.isDamageCritical) {
                    critical = Interpreter.evaluate(this.damageCriticalFormula
                        .getValue(), { user: user, target: target });
                    options.push(Datas.Languages.extras.critical.name() + ": " +
                        critical + "%");
                }
                let damageName = "";
                switch (this.damageKind) {
                    case DamagesKind.Stat:
                        damageName = Datas.BattleSystems.getStatistic(this
                            .damageStatisticID.getValue()).name();
                        break;
                    case DamagesKind.Currency:
                        damageName = Datas.Systems.getCurrency(this
                            .damageCurrencyID.getValue()).name();
                        break;
                    case DamagesKind.Variable:
                        damageName = Datas.Variables.get(this.damageVariableID);
                        break;
                }
                return (damage > 0 ? Datas.Languages.extras.damage.name() : Datas
                    .Languages.extras.heal.name()) + " " + damageName + ": " +
                    (min === max ? min : min + " - " + max) + (options.length >
                    0 ? " [" + options.join(" - ") + "]" : "");
            case EffectKind.Status:
                return (this.isAddStatus ? Datas.Languages.extras.add.name() :
                    Datas.Languages.extras.remove.name()) + " " + Datas.Status
                    .get(this.statusID.getValue()).name() + " [" + Datas.Languages
                    .extras.precision.name() + ": " + Interpreter.evaluate(this
                    .statusPrecisionFormula.getValue(), { user: user, target: target }) + "%]";
            case EffectKind.AddRemoveSkill:
                return (this.isAddSkill ? Datas.Languages.extras.add.name() :
                    Datas.Languages.extras.remove.name()) + " " + Datas.Languages
                    .extras.skill.name() + " " + Datas.Skills.get(this.addSkillID
                    .getValue()).name();
            case EffectKind.PerformSkill:
                return Datas.Languages.extras.performSkill.name() + " " + Datas
                    .Skills.get(this.performSkillID.getValue()).name();
            default:
                return "";
        }
    }
}
export { Effect };
