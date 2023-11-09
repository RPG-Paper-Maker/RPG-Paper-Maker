/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Interpreter, Utils } from '../Common/index.js';
var TargetKind = Enum.TargetKind;
var AvailableKind = Enum.AvailableKind;
var SongKind = Enum.SongKind;
import { Icon } from './Icon.js';
import { Translatable } from './Translatable.js';
import { DynamicValue } from './DynamicValue.js';
import { PlaySong } from './PlaySong.js';
import { Cost } from './Cost.js';
import { Characteristic } from './Characteristic.js';
import { Effect } from './Effect.js';
import { Datas, Scene, System } from '../index.js';
/** @class
 *  A common class for skills, items, weapons, armors.
 *  @extends System.Icon
 *  @param {Record<string, any>} - [json=undefined] Json object describing the common
 */
class CommonSkillItem extends Icon {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the common.
     *  @param {Record<string, any>} - json Json object describing the common
     */
    read(json) {
        super.read(json);
        this.id = json.id;
        this.type = Utils.defaultValue(json.t, 1);
        this.consumable = Utils.defaultValue(json.con, false);
        this.oneHand = Utils.defaultValue(json.oh, true);
        this.description = new Translatable(json.d);
        this.targetKind = Utils.defaultValue(json.tk, TargetKind.None);
        this.targetConditionFormula = DynamicValue.readOrNone(json.tcf);
        this.conditionFormula = DynamicValue.readOrNone(json.cf);
        this.availableKind = Utils.defaultValue(json.ak, AvailableKind.Never);
        this.sound = new PlaySong(SongKind.Sound, json.s);
        this.animationUserID = DynamicValue.readOrNone(json.auid);
        this.animationTargetID = DynamicValue.readOrNone(json.atid);
        this.canBeSold = DynamicValue.readOrDefaultSwitch(json.canBeSold);
        this.battleMessage = new System.Translatable(json.battleMessage);
        this.price = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.p, []),
            listIndexes: this.price, cons: Cost });
        this.costs = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.cos, []),
            listIndexes: this.costs, cons: Cost });
        for (let cost of this.costs) {
            cost.skillItem = this;
        }
        this.effects = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.e, []),
            listIndexes: this.effects, cons: Effect });
        for (let effect of this.effects) {
            effect.skillItem = this;
        }
        this.characteristics = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.car, []),
            listIndexes: this.characteristics, cons: Characteristic });
    }
    /**
     *  Get all the effects, including the ones with perform skill efect.
     *  @returns {System.Effect}
     */
    getEffects() {
        let effects = [];
        for (let effect of this.effects) {
            if (effect.kind === Enum.EffectKind.PerformSkill) {
                effects = effects.concat(Datas.Skills.get(effect.performSkillID
                    .getValue()).getEffects());
            }
            else {
                effects.push(effect);
            }
        }
        return effects;
    }
    /**
     *  Use the command if possible.
     *  @returns {boolean}
     */
    useCommand() {
        let possible = this.isPossible();
        if (possible) {
            this.use(false);
        }
        return possible;
    }
    /**
     *  Execute the effects and costs.
     *  @param {useCost}
     *  @returns {boolean}
     */
    use(useCost = true) {
        let isDoingSomething = false;
        for (let effect of this.getEffects()) {
            isDoingSomething = effect.execute() || isDoingSomething;
        }
        if (useCost && isDoingSomething) {
            for (let cost of this.costs) {
                cost.use();
            }
        }
        return isDoingSomething;
    }
    /**
     *  Use the costs.
     */
    cost() {
        for (let i = 0, l = this.costs.length; i < l; i++) {
            this.costs[i].use();
        }
    }
    /** Check if the costs are possible.
     *  @returns {boolean}
     */
    isPossible(target, checkCost = true) {
        let targets = Scene.Map.current.getPossibleTargets(this.targetKind);
        let user = Scene.Map.current.user ? Scene.Map.current.user.player : null;
        // Condition
        if (!Interpreter.evaluate(this.conditionFormula.getValue())) {
            return false;
        }
        // Target condition : at least one target can be selected
        let fTargetCondition = (target) => {
            return Interpreter.evaluate(this.targetConditionFormula.getValue(), { user: user, target: target });
        };
        if (target) {
            if (!fTargetCondition.call(this, target)) {
                return false;
            }
        }
        else {
            if (this.targetKind !== Enum.TargetKind.None && !targets.some(fTargetCondition)) {
                return false;
            }
        }
        // If attack skill, also test on equipped weapons
        if (this.effects.some((effect) => {
            return effect.kind === Enum
                .EffectKind.SpecialActions && effect.specialActionKind === Enum
                .EffectSpecialActionKind.ApplyWeapons;
        })) {
            if (!Scene.Map.current.user.player.equip.some(item => {
                return item
                    === null || (!item.system.isWeapon() || !Interpreter.evaluate(item
                    .system.conditionFormula.getValue()) || (target ? Interpreter
                    .evaluate(item.system.targetConditionFormula.getValue(), { user: user, target: target }) : targets.some(target => {
                    Interpreter
                        .evaluate(item.system.targetConditionFormula.getValue(), { user: user, target: target });
                })));
            })) {
                return false;
            }
        }
        // Skill cost
        if (checkCost) {
            for (let i = 0, l = this.costs.length; i < l; i++) {
                if (!this.costs[i].isPossible()) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     *  Get the target kind string.
     *  @returns {string}
     */
    getTargetKindString() {
        switch (this.targetKind) {
            case TargetKind.None:
                return "None";
            case TargetKind.User:
                return "The user";
            case TargetKind.Enemy:
                return "An enemy";
            case TargetKind.Ally:
                return "An ally";
            case TargetKind.AllEnemies:
                return "All enemies";
            case TargetKind.AllAllies:
                return "All allies";
        }
        return "";
    }
    /**
     *  Get the weapon kind.
     *  @returns {System/WeaponArmorKind}
     */
    getType() {
        return null;
    }
    /**
     *  Get the price.
     *  @returns {number}
     */
    getPrice() {
        return System.Cost.getPrice(this.price);
    }
    /**
     *  Get the item kind.
     *  @returns {Enum.ItemKind}
     */
    getKind() {
        return null;
    }
    /**
     *  Check if is weapon.
     *  @returns {boolean}
     */
    isWeapon() {
        return this.getKind() === Enum.ItemKind.Weapon;
    }
    /**
     *  Check if is armor.
     *  @returns {boolean}
     */
    isArmor() {
        return this.getKind() === Enum.ItemKind.Armor;
    }
    /**
     *  Check if is weapon or armor.
     *  @returns {boolean}
     */
    isWeaponArmor() {
        return this.isWeapon() || this.isArmor();
    }
    /**
     *  Get message and replace user / skill / item name.
     *  @param {Battler} user
     *  @returns {string}
     */
    getMessage(user) {
        return "";
    }
}
export { CommonSkillItem };
