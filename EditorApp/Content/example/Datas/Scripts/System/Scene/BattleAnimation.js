/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Scene, Datas, Manager } from "../index.js";
import { Enum } from "../Common/index.js";
var EffectSpecialActionKind = Enum.EffectSpecialActionKind;
var CharacterKind = Enum.CharacterKind;
var ItemKind = Enum.ItemKind;
var AnimationEffectConditionKind = Enum.AnimationEffectConditionKind;
var AnimationPositionKind = Enum.AnimationPositionKind;
import { Game, Animation } from "../Core/index.js";
// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//      SubStep 0 : Animation user + animation sprite
//      SubStep 1 : Animation target
//      SubStep 2 : Damages
//
// -------------------------------------------------------
class BattleAnimation {
    constructor(battle) {
        this.battle = battle;
    }
    /**
     *  Initialize step.
     */
    initialize() {
        let content;
        switch (this.battle.battleCommandKind) {
            case EffectSpecialActionKind.ApplyWeapons:
                this.battle.informationText = this.battle.attackSkill.getMessage(this.battle.user);
                break;
            case EffectSpecialActionKind.OpenSkills:
                if (this.battle.forceAnAction) {
                    content = this.battle.skill;
                }
                else {
                    content = this.battle.attackingGroup === CharacterKind.Hero ? (this.battle.battleStartTurn.active ? this.battle.currentSkill :
                        this.battle.windowChoicesSkills
                            .getCurrentContent().system) : Datas.Skills.get(this.battle
                        .action.skillID.getValue());
                }
                this.battle.informationText = content.getMessage(this.battle.user);
                break;
            case EffectSpecialActionKind.OpenItems:
                if (this.battle.forceAnAction) {
                    content = this.battle.skill;
                }
                else {
                    content = this.battle.attackingGroup === CharacterKind.Hero ? this.battle.windowChoicesItems
                        .getCurrentContent().item.system : Datas.Items.get(this
                        .battle.action.itemID.getValue());
                }
                this.battle.informationText = content.getMessage(this.battle.user);
                break;
            case EffectSpecialActionKind.None: // If command was a skill without special action
                content = this.battle
                    .windowChoicesBattleCommands.getContent(this.battle.user
                    .lastCommandIndex).system;
                this.battle.informationText = content.getMessage(this.battle.user);
                break;
            default:
                this.battle.informationText = "";
                break;
        }
        this.battle.windowTopInformations.content.setText(this
            .battle.informationText);
        this.battle.time = new Date().getTime();
        this.battle.effects = [];
        let i, l, effects;
        switch (this.battle.battleCommandKind) {
            case EffectSpecialActionKind.ApplyWeapons:
                if (this.battle.user.player.kind === CharacterKind.Hero) {
                    let equipments = this.battle.user.player.equip;
                    let j, m, gameItem, weapon;
                    for (i = 0, l = equipments.length; i < l; i++) {
                        gameItem = equipments[i];
                        if (gameItem && gameItem.kind === ItemKind.Weapon) {
                            weapon = gameItem.system;
                            this.battle.animationUser = new Animation(weapon
                                .animationUserID.getValue());
                            this.battle.animationTarget = new Animation(weapon
                                .animationTargetID.getValue());
                            effects = weapon.getEffects();
                            for (j = 0, m = effects.length; j < m; j++) {
                                this.battle.effects.push(effects[j]);
                            }
                        }
                    }
                }
                if (this.battle.effects.length === 0) {
                    this.battle.animationUser = new Animation(Datas.Skills.get(1)
                        .animationUserID.getValue());
                    this.battle.animationTarget = new Animation(Datas.Skills.get(1)
                        .animationTargetID.getValue());
                    let effects = this.battle.attackSkill.getEffects();
                    for (i = 1, l = effects.length; i < l; i++) {
                        this.battle.effects.push(effects[i]);
                    }
                }
                this.battle.user.setAttacking();
                break;
            case EffectSpecialActionKind.OpenSkills:
            case EffectSpecialActionKind.None:
                this.battle.animationUser = new Animation(content
                    .animationUserID.getValue());
                this.battle.animationTarget = new Animation(content
                    .animationTargetID.getValue());
                this.battle.effects = content.getEffects();
                content.cost();
                this.battle.user.setUsingSkill();
                break;
            case EffectSpecialActionKind.OpenItems:
                let graphic = this.battle.windowChoicesItems
                    .getCurrentContent();
                this.battle.animationUser = new Animation(content
                    .animationUserID.getValue());
                this.battle.animationTarget = new Animation(content
                    .animationTargetID.getValue());
                this.battle.effects = content.getEffects();
                if (this.battle.user.player.kind === CharacterKind.Hero) {
                    Game.current.useItem(graphic.item);
                }
                this.battle.user.setUsingItem();
                break;
            case EffectSpecialActionKind.EndTurn:
                this.battle.time -= Scene.Battle.TIME_ACTION_ANIMATION;
                let user;
                for (i = 0, l = this.battle.battlers[CharacterKind.Hero].length; i < l; i++) {
                    user = this.battle.battlers[CharacterKind.Hero][i];
                    user.setActive(false);
                    user.setSelected(false);
                }
                this.battle.subStep = 2;
                break;
            case EffectSpecialActionKind.DoNothing:
                this.battle.time -= Scene.Battle.TIME_ACTION_ANIMATION;
                this.battle.subStep = 2;
                break;
        }
        this.battle.currentEffectIndex = -1;
        this.battle.currentTargetIndex = null;
        if (this.battle.animationUser && this.battle.animationUser.system === null) {
            this.battle.animationUser = null;
        }
        if (this.battle.animationTarget && this.battle.animationTarget.system === null) {
            this.battle.animationTarget = null;
        }
    }
    /**
     *  Get the animation efect condition kind.
     *  @returns {AnimationEffectConditionKind}
     */
    getCondition() {
        if (this.battle.targets[0]) {
            if (this.battle.targets[0].isDamagesMiss) {
                return AnimationEffectConditionKind.Miss;
            }
            if (this.battle.targets[0].isDamagesCritical) {
                return AnimationEffectConditionKind.Critical;
            }
        }
        return AnimationEffectConditionKind.Hit;
    }
    /**
     *  Update the targets attacked and check if they are dead.
     */
    updateTargetsAttacked() {
        let target;
        for (let i = 0, l = this.battle.targets.length; i < l; i++) {
            target = this.battle.targets[i];
            target.updateDead((target.damages > 0 || target == null) && !target
                .isDamagesMiss, this.battle.user ? this.battle.user.player : null);
            // Release status after attacked
            target.player.removeAfterAttackedStatus();
        }
    }
    /**
     *  Update the battle.
     */
    update() {
        let i, l;
        switch (this.battle.subStep) {
            case 0: // Animation user
                // Before animation, wait for enemy moving
                if (this.battle.user.moving) {
                    return;
                }
                // User animation if exists
                if (this.battle.animationUser) {
                    this.battle.animationUser.update();
                    this.battle.animationUser.playSounds(this.getCondition());
                    Manager.Stack.requestPaintHUD = true;
                }
                // Test if animation finished
                if ((!this.battle.animationUser || this.battle.animationUser.frame >
                    this.battle.animationUser.system.frames.length) && !this.battle
                    .user.isAttacking()) {
                    if (!this.battle.animationTarget) {
                        this.battle.time = new Date().getTime() - Scene.Battle
                            .TIME_ACTION_ANIMATION + Scene.Battle.TIME_ACTION_NO_ANIMATION;
                        for (i = 0, l = this.battle.targets.length; i < l; i++) {
                            this.battle.targets[i].timeDamage = 0;
                        }
                        this.battle.subStep = 2;
                    }
                    else {
                        this.battle.subStep = 1;
                    }
                }
                break;
            case 1: // Animation target
                // Target animation if exists
                this.battle.animationTarget.update();
                this.battle.animationTarget.playSounds(this.getCondition());
                Manager.Stack.requestPaintHUD = true;
                if (this.battle.animationTarget.frame > this.battle.animationTarget
                    .system.frames.length) {
                    this.battle.time = new Date().getTime() - Scene.Battle
                        .TIME_ACTION_ANIMATION;
                    for (i = 0, l = this.battle.targets.length; i < l; i++) {
                        this.battle.targets[i].timeDamage = 0;
                    }
                    this.battle.subStep = 2;
                }
                break;
            case 2: // Damages
                // If calling a common reaction, wait for it to be finished
                if (this.battle.reactionInterpretersEffects.length > 0) {
                    for (i = 0, l = this.battle.targets.length; i < l; i++) {
                        this.battle.targets[i].timeDamage = 0;
                    }
                    return;
                }
                if ((new Date().getTime() - this.battle.time) >= Scene.Battle
                    .TIME_ACTION_ANIMATION) {
                    for (i = 0, l = this.battle.targets.length; i < l; i++) {
                        this.battle.targets[i].updateDead(false);
                    }
                    if (this.battle.user) {
                        this.battle.user.updateDead(false);
                    }
                    // Testing end of battle
                    let effect, isAnotherEffect;
                    if (this.battle.isWin()) {
                        this.battle.winning = true;
                        this.battle.activeGroup();
                        this.battle.changeStep(Enum.BattleStep.Victory);
                    }
                    else if (this.battle.isLose()) {
                        this.battle.winning = false;
                        this.battle.changeStep(Enum.BattleStep.Victory);
                    }
                    else {
                        // Apply effect
                        if (this.battle.currentTargetIndex === null) {
                            this.battle.currentEffectIndex++;
                            for (l = this.battle.effects.length; this.battle
                                .currentEffectIndex < l; this.battle.currentEffectIndex++) {
                                effect = this.battle.effects[this.battle.currentEffectIndex];
                                effect.execute();
                                if (effect.isAnimated()) {
                                    if (effect.kind === Enum.EffectKind.Status) {
                                        this.battle.currentTargetIndex = -1;
                                    }
                                    break;
                                }
                            }
                        }
                        // Status message
                        if (this.battle.currentTargetIndex !== null) {
                            let target;
                            this.battle.currentTargetIndex++;
                            for (l = this.battle.targets.length; this.battle
                                .currentTargetIndex < l; this.battle.currentTargetIndex++) {
                                target = this.battle.targets[this.battle.currentTargetIndex];
                                if (!target.isDamagesMiss) {
                                    if (target.lastStatus !== null) {
                                        this.battle.windowTopInformations
                                            .content.setText(target.player.kind ===
                                            CharacterKind.Hero ? target.lastStatus
                                            .getMessageAllyAffected(target) : target
                                            .lastStatus
                                            .getMessageEnemyAffected(target));
                                        break;
                                    }
                                    if (target.lastStatusHealed !== null) {
                                        this.battle.windowTopInformations
                                            .content.setText(target.lastStatusHealed
                                            .getMessageHealed(target));
                                        break;
                                    }
                                }
                            }
                            if (this.battle.currentTargetIndex === l) {
                                this.battle.currentTargetIndex = null;
                            }
                        }
                        // Target attacked
                        this.updateTargetsAttacked();
                        isAnotherEffect = this.battle.currentEffectIndex < this
                            .battle.effects.length || this.battle.currentTargetIndex
                            !== null;
                        if (isAnotherEffect) {
                            this.battle.time = new Date().getTime() - (Scene.Battle
                                .TIME_ACTION_ANIMATION / 2);
                            for (i = 0, l = this.battle.targets.length; i < l; i++) {
                                this.battle.targets[i].timeDamage = 0;
                            }
                            return;
                        }
                        else {
                            let target;
                            for (i = 0, l = this.battle.targets.length; i < l; i++) {
                                target = this.battle.targets[i];
                                target.updateDead(false);
                                target.damages = null;
                                target.isDamagesMiss = false;
                                target.isDamagesCritical = false;
                            }
                            if (this.battle.user) {
                                if (!this.battle.forceAnAction || this.battle
                                    .forceAnActionUseTurn) {
                                    this.battle.user.setActive(false);
                                    this.battle.user.setSelected(false);
                                }
                                if (this.battle.targets.length > 0) {
                                    this.battle.user.lastTarget = target;
                                }
                            }
                        }
                        if (this.battle.forceAnAction) {
                            this.battle.forceAnAction = false;
                            this.battle.step = this.battle.previousStep;
                            this.battle.subStep = this.battle.previousSubStep;
                            return;
                        }
                        else {
                            // Testing end of turn
                            if (this.battle.battleStartTurn.active) {
                                this.battle.changeStep(Enum.BattleStep.StartTurn);
                                return;
                            }
                            if (this.battle.isEndTurn()) {
                                this.battle.changeStep(Enum.BattleStep.EndTurn);
                            }
                            else {
                                if (this.battle.attackingGroup === CharacterKind.Hero) {
                                    this.battle.changeStep(Enum.BattleStep.Selection); // Attack of heroes
                                }
                                else {
                                    this.battle.changeStep(Enum.BattleStep.EnemyAttack); // Attack of ennemies
                                }
                            }
                        }
                    }
                }
                break;
        }
    }
    /**
     *  Handle key pressed.
     *   @param {number} key - The key ID
     */
    onKeyPressedStep(key) {
    }
    /**
     *  Handle key released.
     *  @param {number} key - The key ID
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
        // Draw animations
        if (this.battle.animationUser) {
            this.battle.animationUser.draw(this.battle.user);
        }
        let i, l;
        if (this.battle.animationTarget) {
            if (this.battle.animationTarget.system.positionKind ===
                AnimationPositionKind.ScreenCenter) {
                this.battle.animationTarget.draw(null);
            }
            else {
                for (i = 0, l = this.battle.targets.length; i < l; i++) {
                    this.battle.animationTarget.draw(this.battle.targets[i]);
                }
            }
        }
        // Draw damages
        if (this.battle.reactionInterpretersEffects.length === 0 && (this.battle
            .user === null || !this.battle.user.isAttacking()) && (!this.battle
            .animationTarget || this.battle.animationTarget.frame > this.battle
            .animationTarget.system.frames.length)) {
            for (i = 0, l = this.battle.targets.length; i < l; i++) {
                this.battle.targets[i].drawDamages();
            }
        }
    }
}
export { BattleAnimation };
