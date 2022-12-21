/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "../index.js";
import { Enum, Mathf, Interpreter, Utils } from "../Common/index.js";
var CharacterKind = Enum.CharacterKind;
var EffectSpecialActionKind = Enum.EffectSpecialActionKind;
var EffectKind = Enum.EffectKind;
var MonsterActionKind = Enum.MonsterActionKind;
var TargetKind = Enum.TargetKind;
var MonsterActionTargetKind = Enum.MonsterActionTargetKind;
import { Game } from "../Core/index.js";
// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//  Enemy attack (IA)
//
// -------------------------------------------------------
class BattleEnemyAttack {
    constructor(battle) {
        this.battle = battle;
    }
    /**
     *  Initialize step.
     */
    initialize() {
        this.battle.windowTopInformations.content.setText("");
        // Define which monster will attack
        let exists = false;
        let i, l;
        for (i = 0, l = this.battle.battlers[Enum.CharacterKind.Monster].length; i < l; i++) {
            if (this.battle.isDefined(Enum.CharacterKind.Monster, i)) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            this.battle.changeStep(Enum.BattleStep.EndTurn);
            return;
        }
        i = 0;
        do {
            this.battle.user = this.battle.battlers[CharacterKind.Monster][i];
            i++;
        } while (!this.battle.isDefined(CharacterKind.Monster, i - 1));
        // Define action
        this.defineAction();
        // Define targets
        this.defineTargets();
        this.battle.time = new Date().getTime();
        this.battle.timeEnemyAttack = new Date().getTime();
    }
    /**
     *  Define the possible action to do.
     */
    definePossibleActions(actions, restriction) {
        let priorities = 0;
        let player = this.battle.user.player;
        let monster = player.system;
        let systemActions = monster.actions;
        // If status can't do anything, do nothing
        if (this.battle.user.containsRestriction(Enum.StatusRestrictionsKind
            .CantDoAnything)) {
            return;
        }
        // List every possible actions
        let i, l, action, stat, number;
        for (i = 0, l = systemActions.length; i < l; i++) {
            action = systemActions[i];
            if (action.isConditionTurn && !Mathf.OPERATORS_COMPARE[action
                .operationKindTurn](this.battle.turn, action.turnValueCompare
                .getValue())) {
                continue;
            }
            if (action.isConditionStatistic) {
                stat = Datas.BattleSystems.getStatistic(action.statisticID
                    .getValue());
                if (!Mathf.OPERATORS_COMPARE[action.operationKindStatistic](player[stat.abbreviation] / player[stat.getMaxAbbreviation()]
                    * 100, action.statisticValueCompare.getValue())) {
                    continue;
                }
            }
            if (action.isConditionVariable && !Mathf.OPERATORS_COMPARE[action
                .operationKindVariable](Game.current.variables[action
                .variableID], action.variableValueCompare.getValue())) {
                continue;
            }
            if (action.isConditionStatus) {
                // TODO
            }
            if (action.isConditionScript && !Interpreter.evaluate(action.script
                .getValue())) {
                continue;
            }
            if (action.actionKind === MonsterActionKind.UseSkill) {
                let skill = Datas.Skills.get(action.skillID.getValue());
                if (!skill.isPossible() ||
                    this.battle.user.containsRestriction(Enum.StatusRestrictionsKind
                        .CantUseSkills)) {
                    continue;
                }
                if (restriction === Enum.StatusRestrictionsKind.AttackRandomAlly &&
                    skill.targetKind !== Enum.TargetKind.AllEnemies && skill
                    .targetKind !== Enum.TargetKind.Enemy) {
                    continue;
                }
                if (restriction === Enum.StatusRestrictionsKind.AttackRandomEnemy &&
                    skill.targetKind !== Enum.TargetKind.AllEnemies && skill
                    .targetKind !== Enum.TargetKind.Enemy) {
                    continue;
                }
                if (restriction === Enum.StatusRestrictionsKind.AttackRandomTarget &&
                    skill.targetKind !== Enum.TargetKind.AllEnemies && skill
                    .targetKind !== Enum.TargetKind.Enemy) {
                    continue;
                }
            }
            if (action.actionKind === MonsterActionKind.UseItem) {
                number = this.battle.user.itemsNumbers[action.itemID.getValue()];
                if ((!Utils.isUndefined(number) && number === 0) || this.battle
                    .user.containsRestriction(Enum.StatusRestrictionsKind.CantUseItems)) {
                    continue;
                }
            }
            // Push to possible actions if passing every conditions
            actions.push(action);
            priorities += action.priority.getValue();
        }
        return priorities;
    }
    /**
     *  Define the action to do.
     */
    defineAction(restriction = Enum
        .StatusRestrictionsKind.None) {
        let actions = [];
        this.battle.action = this.battle.actionDoNothing;
        this.battle.battleCommandKind = EffectSpecialActionKind.DoNothing;
        let priorities = this.definePossibleActions(actions, restriction);
        // If no action
        if (priorities <= 0) {
            return;
        }
        // Random
        let random = Mathf.random(0, 100);
        let step = 0;
        let value, action;
        for (let i = 0, l = actions.length; i < l; i++) {
            action = actions[i];
            value = (action.priority.getValue() / priorities) * 100;
            if (random >= step && random <= (value + step)) {
                this.battle.action = action;
                break;
            }
            step += value;
        }
        // Define battle command kind
        switch (this.battle.action.actionKind) {
            case MonsterActionKind.UseSkill:
                let effect = Datas.Skills.get(this.battle.action.skillID
                    .getValue()).getEffects()[0];
                if (effect) {
                    this.battle.battleCommandKind = effect.kind === EffectKind
                        .SpecialActions ? effect.specialActionKind :
                        EffectSpecialActionKind.OpenSkills;
                }
                else {
                    this.battle.battleCommandKind = EffectSpecialActionKind
                        .OpenSkills;
                }
                this.battle.attackSkill = Datas.Skills.get(this.battle.action
                    .skillID.getValue());
                break;
            case MonsterActionKind.UseItem:
                this.battle.battleCommandKind = EffectSpecialActionKind
                    .OpenItems;
                // If item, use one
                let id = this.battle.action.itemID.getValue();
                this.battle.user.itemsNumbers[id] = (this.battle.user
                    .itemsNumbers[id] ? this.battle.user.itemsNumbers[id] : this
                    .battle.action.itemNumberMax.getValue()) - 1;
                break;
            case MonsterActionKind.DoNothing:
                this.battle.battleCommandKind = EffectSpecialActionKind.DoNothing;
                break;
        }
    }
    /**
     *  Define the targets
     */
    defineTargets(restriction = Enum
        .StatusRestrictionsKind.None) {
        if (!this.battle.action) {
            this.battle.targets = [];
            return;
        }
        // Verify if the target is not all allies or all enemies and define side
        let targetKind, side;
        switch (this.battle.action.actionKind) {
            case MonsterActionKind.UseSkill:
                this.battle.skill = Datas.Skills.get(this.battle.action.skillID
                    .getValue());
                targetKind = this.battle.skill.targetKind;
                break;
            case MonsterActionKind.UseItem:
                this.battle.skill = Datas.Items.get(this.battle.action.itemID
                    .getValue());
                targetKind = this.battle.skill.targetKind;
                break;
            case MonsterActionKind.DoNothing:
                this.battle.skill = null;
                this.battle.targets = [];
                return;
        }
        switch (targetKind) {
            case TargetKind.None:
                this.battle.targets = [];
                return;
            case TargetKind.User:
                this.battle.targets = [this.battle.user];
                return;
            case TargetKind.Enemy:
                switch (restriction) {
                    case Enum.StatusRestrictionsKind.AttackRandomAlly:
                        side = CharacterKind.Monster;
                        break;
                    case Enum.StatusRestrictionsKind.AttackRandomEnemy:
                        side = CharacterKind.Hero;
                        break;
                    case Enum.StatusRestrictionsKind.AttackRandomTarget:
                        side = Mathf.random(0, 1) === 0 ? CharacterKind.Monster :
                            CharacterKind.Hero;
                        break;
                    default:
                        side = CharacterKind.Hero;
                        break;
                }
                break;
            case TargetKind.Ally:
                side = CharacterKind.Monster;
                break;
            case TargetKind.AllEnemies:
                switch (restriction) {
                    case Enum.StatusRestrictionsKind.AttackRandomAlly:
                        this.battle.targets = this.battle.battlers[CharacterKind
                            .Monster];
                        break;
                    case Enum.StatusRestrictionsKind.AttackRandomEnemy:
                        this.battle.targets = this.battle.battlers[CharacterKind
                            .Hero];
                        break;
                    case Enum.StatusRestrictionsKind.AttackRandomTarget:
                        this.battle.targets = Mathf.random(0, 1) === 0 ? this
                            .battle.battlers[CharacterKind.Monster] : this
                            .battle.battlers[CharacterKind.Hero];
                        break;
                }
                return;
            case TargetKind.AllAllies:
                this.battle.targets = this.battle.battlers[CharacterKind.Monster];
                return;
        }
        // Select one enemy / ally according to target kind
        let l = this.battle.battlers[side].length;
        let targetKindAction = restriction === Enum.StatusRestrictionsKind.None ?
            this.battle.action.targetKind : MonsterActionTargetKind.Random;
        let i, target;
        switch (targetKindAction) {
            case MonsterActionTargetKind.Random:
                i = Mathf.random(0, l - 1);
                while (!this.battle.isDefined(side, i, true)) {
                    i++;
                    i = i % l;
                }
                target = this.battle.battlers[side][i];
                break;
            case MonsterActionTargetKind.WeakEnemies:
                i = 0;
                while (!this.battle.isDefined(side, i, true)) {
                    i++;
                    i = i % l;
                }
                target = this.battle.battlers[side][i];
                let minHP = target.player['hp'];
                let tempTarget, tempHP;
                while (i < l) {
                    tempTarget = this.battle.battlers[side][i];
                    if (this.battle.isDefined(side, i, true)) {
                        tempHP = tempTarget.player['hp'];
                        if (tempHP < minHP) {
                            target = tempTarget;
                        }
                    }
                    i++;
                }
                break;
        }
        this.battle.targets = [target];
    }
    /**
     *  Update the battle
     */
    update() {
        if (new Date().getTime() - this.battle.time >= 500) {
            if (this.battle.action.actionKind !== MonsterActionKind.DoNothing) {
                this.battle.user.setSelected(true);
            }
            if (new Date().getTime() - this.battle.timeEnemyAttack >= 1000) {
                this.battle.changeStep(Enum.BattleStep.Animation);
            }
        }
    }
    /**
     *  Handle key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressedStep(key) {
    }
    /**
     *  Handle key released.
     *   @param {number} key - The key ID
     */
    onKeyReleasedStep(key) {
    }
    /**
     *  Handle key repeat pressed.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeatStep(key) {
        return true;
    }
    /**
     *  Handle key pressed and repeat.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeatStep(key) {
        return true;
    }
    /**
     *  Draw the battle HUD.
     */
    drawHUDStep() {
        this.battle.windowTopInformations.draw();
    }
}
export { BattleEnemyAttack };
