/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas, Scene } from "../index.js";
import { Enum, Mathf } from "../Common/index.js";
import { Animation, ReactionInterpreter } from "../Core/index.js";
// -------------------------------------------------------
//
//  CLASS BattleStartTurn
//
//      SubStep 0 : Random attacks
//      SubStep 1 : Status effect
//
// -------------------------------------------------------
class BattleStartTurn {
    constructor(battle) {
        this.step = 0;
        this.active = false;
        this.statusHealed = [];
        this.statusStill = [];
        this.indexTroopReaction = 0;
        this.interpreter = null;
        this.battle = battle;
    }
    /**
     *  Initialize step.
     */
    initialize() {
        this.active = true;
        this.battle.time = new Date().getTime() - Scene.Battle.TIME_ACTION_ANIMATION;
        // One time troop reaction or each begin turn
        let i, l, battler;
        if (this.step === 0) {
            let reactions = this.battle.troop.reactions;
            let reaction;
            for (l = reactions.length; this.indexTroopReaction < l; this
                .indexTroopReaction++) {
                reaction = reactions[this.indexTroopReaction];
                if (reaction.frequency === Enum.TroopReactionFrequencyKind
                    .EachTurnBegin) {
                    // Check conditions
                    if (!reaction.conditions.isValid()) {
                        continue;
                    }
                    this.interpreter = new ReactionInterpreter(null, reaction, null, null);
                    return;
                }
            }
            this.interpreter = null;
            this.step++;
        }
        // Check status releases
        let s;
        if (this.step === 1) {
            let listStill, listHealed;
            for (i = 0, l = this.battle.battlers[this.battle.attackingGroup]
                .length; i < l; i++) {
                battler = this.battle.battlers[this.battle.attackingGroup][i];
                if (!battler.player.isDead()) {
                    s = battler.player.status[0];
                    listStill = [];
                    listHealed = battler.player.removeStartTurnStatus(listStill);
                    battler.updateStatusStep();
                    battler.updateAnimationStatus(s);
                    if (listHealed.length > 0) {
                        this.statusHealed.push([battler, listHealed]);
                    }
                    if (listStill.length > 0) {
                        this.statusStill.push([battler, listStill]);
                    }
                }
            }
            if (this.statusHealed.length > 0 || this.statusStill.length > 0) {
                this.step++;
                return;
            }
            this.step = 4;
        }
        // Status effects
        if (this.step === 4) {
            this.step++;
        }
        // Check status restrictions (force attacks)
        if (this.step === 5) {
            for (i = 0, l = this.battle.battlers[this.battle.attackingGroup]
                .length; i < l; i++) {
                battler = this.battle.battlers[this.battle.attackingGroup][i];
                if (battler.active) {
                    if (battler.containsRestriction(Enum.StatusRestrictionsKind
                        .CantDoAnything)) {
                        continue;
                    }
                    if (battler.containsRestriction(Enum.StatusRestrictionsKind
                        .AttackRandomAlly)) {
                        this.defineRandom(battler, Enum.StatusRestrictionsKind
                            .AttackRandomAlly);
                        return;
                    }
                    if (battler.containsRestriction(Enum.StatusRestrictionsKind
                        .AttackRandomEnemy)) {
                        this.defineRandom(battler, Enum.StatusRestrictionsKind
                            .AttackRandomEnemy);
                        return;
                    }
                    if (battler.containsRestriction(Enum.StatusRestrictionsKind
                        .AttackRandomTarget)) {
                        this.defineRandom(battler, Enum.StatusRestrictionsKind
                            .AttackRandomTarget);
                        return;
                    }
                }
            }
            this.startSelectionEnemyAttack();
        }
    }
    startSelectionEnemyAttack() {
        this.active = false;
        this.step = 0;
        this.indexTroopReaction = 0;
        if (this.battle.attackingGroup === Enum.CharacterKind.Hero) {
            this.battle.changeStep(Enum.BattleStep.Selection); // Attack of heroes
        }
        else {
            this.battle.changeStep(Enum.BattleStep.EnemyAttack); // Attack of ennemies
        }
    }
    defineRandom(user, restriction) {
        this.battle.user = user;
        if (this.battle.attackingGroup === Enum.CharacterKind.Hero) {
            this.battle.battleCommandKind = Enum.EffectSpecialActionKind.OpenSkills;
            this.battle.currentEffectIndex = 0;
            let skills = [];
            let skill;
            for (let i = 0, l = user.player.skills.length; i < l; i++) {
                skill = Datas.Skills.get(user.player.skills[i].id);
                if (!skill.isPossible()) {
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
                skills.push(skill);
            }
            if (skills.length === 0) {
                this.battle.battleCommandKind = Enum.EffectSpecialActionKind.DoNothing;
                return;
            }
            skill = skills[Mathf.random(0, skills.length - 1)];
            this.battle.currentSkill = skill;
            this.battle.animationUser = new Animation(skill.animationUserID.getValue());
            this.battle.animationTarget = new Animation(skill.animationTargetID.getValue());
            let side;
            switch (restriction) {
                case Enum.StatusRestrictionsKind.AttackRandomAlly:
                    side = Enum.CharacterKind.Hero;
                    break;
                case Enum.StatusRestrictionsKind.AttackRandomEnemy:
                    side = Enum.CharacterKind.Monster;
                    break;
                case Enum.StatusRestrictionsKind.AttackRandomTarget:
                    side = Mathf.random(0, 1) === 0 ? Enum.CharacterKind
                        .Hero : Enum.CharacterKind.Monster;
                    break;
            }
            switch (skill.targetKind) {
                case Enum.TargetKind.AllEnemies: {
                    this.battle.targets = this.battle.battlers[side];
                    break;
                }
                case Enum.TargetKind.Enemy: {
                    this.battle.targets = [this.battle.battlers[side][Mathf
                            .random(0, this.battle.battlers[side].length - 1)]];
                    break;
                }
            }
        }
        else {
            this.battle.battleEnemyAttack.defineAction(restriction);
            this.battle.battleEnemyAttack.defineTargets(restriction);
        }
        this.battle.changeStep(Enum.BattleStep.Animation);
    }
    /**
     *  Update the battle.
     */
    update() {
        // Troop reactions
        if (this.step === 0) {
            this.interpreter.update();
            if (this.interpreter.isFinished()) {
                this.indexTroopReaction++;
                this.initialize();
                return;
            }
        }
        if ((new Date().getTime() - this.battle.time) >= Scene.Battle.TIME_ACTION_ANIMATION) {
            // Healed status
            if (this.step === 2) {
                if (this.statusHealed.length > 0) {
                    let tab = this.statusHealed[0];
                    let battler = tab[0];
                    let status = tab[1];
                    let s = status[0];
                    this.battle.windowTopInformations.content
                        .setText(s.getMessageHealed(battler));
                    this.battle.time = new Date().getTime() - (Scene.Battle
                        .TIME_ACTION_ANIMATION / 2);
                    status.splice(0, 1);
                    if (status.length === 0) {
                        this.statusHealed.splice(0, 1);
                    }
                    return;
                }
                this.step++;
            }
            // Still status + effects
            if (this.step === 3) {
                if (this.statusStill.length > 0) {
                    let tab = this.statusStill[0];
                    let battler = tab[0];
                    let status = tab[1];
                    let s = status[0];
                    this.battle.windowTopInformations.content
                        .setText(s.getMessageStillAffected(battler));
                    status.splice(0, 1);
                    if (status.length === 0) {
                        this.statusStill.splice(0, 1);
                    }
                    this.battle.time = new Date().getTime() - (Scene.Battle
                        .TIME_ACTION_ANIMATION / 2);
                    // If effects, apply animation only for those
                    let effects = s.system.getEffects();
                    if (effects.length > 0) {
                        this.battle.effects = effects;
                        this.battle.user = null;
                        this.battle.targets = [battler];
                        this.battle.currentEffectIndex = -1;
                        this.battle.currentTargetIndex = null;
                        this.battle.animationUser = null;
                        this.battle.animationTarget = null;
                        this.battle.step = Enum.BattleStep.Animation;
                        this.battle.subStep = 2;
                    }
                    return;
                }
                this.step++;
                this.initialize();
            }
        }
    }
    /**
     *  Handle key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressedStep(key) {
        if (this.interpreter) {
            this.interpreter.onKeyPressed(key);
        }
    }
    /**
     *  Handle key released.
     *  @param {number} key - The key ID
     */
    onKeyReleasedStep(key) {
        if (this.interpreter) {
            this.interpreter.onKeyReleased(key);
        }
    }
    /**
     *  Handle key repeat pressed.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeatStep(key) {
        if (this.interpreter) {
            return this.interpreter.onKeyPressedRepeat(key);
        }
        return true;
    }
    /**
     *  Handle key pressed and repeat.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeatStep(key) {
        if (this.interpreter) {
            return this.interpreter.onKeyPressedAndRepeat(key);
        }
        return true;
    }
    /**
     *  @inheritdoc
     */
    onMouseDownStep(x, y) {
        if (this.interpreter) {
            this.interpreter.onMouseDown(x, y);
        }
    }
    /**
     *  @inheritdoc
     */
    onMouseMoveStep(x, y) {
        if (this.interpreter) {
            this.interpreter.onMouseMove(x, y);
        }
    }
    /**
     *  @inheritdoc
     */
    onMouseUpStep(x, y) {
        if (this.interpreter) {
            this.interpreter.onMouseUp(x, y);
        }
    }
    /**
     *  Draw the battle HUD.
     */
    drawHUDStep() {
        this.battle.windowTopInformations.draw();
        if (this.interpreter) {
            this.interpreter.drawHUD();
        }
    }
}
export { BattleStartTurn };
