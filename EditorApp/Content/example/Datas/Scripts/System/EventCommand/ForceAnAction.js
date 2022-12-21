/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { System, Datas, Scene } from "../index.js";
import { Utils, Enum, Mathf } from "../Common/index.js";
/** @class
 *  An event command for forcing an action in a battler.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class ForceAnAction extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.battlerKind = command[iterator.i++];
        switch (this.battlerKind) {
            case 0:
                this.battlerEnemyIndex = command[iterator.i++];
                break;
            case 1:
                this.battlerHeroEnemyInstanceID = System.DynamicValue
                    .createValueCommand(command, iterator);
                break;
        }
        this.actionKind = command[iterator.i++];
        if (this.actionKind !== 2) {
            this.actionID = System.DynamicValue.createValueCommand(command, iterator);
        }
        this.targetKind = command[iterator.i++];
        if (this.targetKind === 2) {
            this.targetCustomKind = command[iterator.i++];
            switch (this.targetCustomKind) {
                case 0:
                    this.targetEnemyIndex = command[iterator.i++];
                    break;
                case 1:
                    this.targetHeroEnemyInstanceID = System.DynamicValue
                        .createValueCommand(command, iterator);
                    break;
            }
        }
        this.useBattlerTurn = Utils.numToBool(command[iterator.i++]);
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        if (!Scene.Map.current.isBattleMap) {
            return {};
        }
        let map = Scene.Map.current;
        map.forceAnAction = true;
        // Battler (user)
        let side;
        switch (this.battlerKind) {
            case 0: // Enemy
                Scene.Map.current.user = map.battlers[Enum.CharacterKind.Monster][this.battlerEnemyIndex];
                side = Enum.CharacterKind.Monster;
                break;
            case 1: // Hero instance ID
                let id = this.battlerHeroEnemyInstanceID.getValue();
                Scene.Map.current.user = null;
                for (let battler of map.battlers[Enum.CharacterKind.Hero]) {
                    if (battler.player.instid === id) {
                        Scene.Map.current.user = battler;
                        side = Enum.CharacterKind.Hero;
                        break;
                    }
                }
                for (let battler of map.battlers[Enum.CharacterKind.Monster]) {
                    if (battler.player.instid === id) {
                        Scene.Map.current.user = battler;
                        side = Enum.CharacterKind.Monster;
                        break;
                    }
                }
                break;
        }
        // Action
        switch (this.actionKind) {
            case 0: // Skill
                map.battleCommandKind = Enum.EffectSpecialActionKind.OpenSkills;
                map.skill = Datas.Skills.get(this.actionID.getValue());
                break;
            case 1: // Item
                map.battleCommandKind = Enum.EffectSpecialActionKind.OpenItems;
                map.skill = Datas.Items.get(this.actionID.getValue());
                break;
            case 2: // Do nothing
                map.battleCommandKind = Enum.EffectSpecialActionKind.None;
                map.skill = null;
                break;
        }
        // Target(s)
        let targets = [];
        map.targets = [];
        switch (map.skill.targetKind) {
            case Enum.TargetKind.User:
                map.targets = [Scene.Map.current.user];
                break;
            case Enum.TargetKind.Enemy:
                targets = map.battlers[side === Enum.CharacterKind.Hero ? Enum
                    .CharacterKind.Monster : Enum.CharacterKind.Hero];
                break;
            case Enum.TargetKind.Ally:
                targets = map.battlers[side];
                break;
            case Enum.TargetKind.AllEnemies:
                map.targets = map.battlers[side === Enum.CharacterKind.Hero ?
                    Enum.CharacterKind.Monster : Enum.CharacterKind.Hero];
                break;
            case Enum.TargetKind.AllAllies:
                map.targets = map.battlers[side];
                break;
            default:
                break;
        }
        // If several possible targets, select according to target kind
        if (targets.length > 0) {
            let targetKind = this.targetKind;
            if (targetKind === 1) { // Last target
                if (map.user.lastTarget !== null && targets.indexOf(map.user
                    .lastTarget) !== -1) {
                    map.targets = [map.user.lastTarget];
                }
                else {
                    targetKind = 0;
                }
            }
            switch (targetKind) {
                case 0: // Random
                    map.targets = [targets[Mathf.random(0, targets.length - 1)]];
                    break;
                case 2: // custom
                    switch (this.targetCustomKind) {
                        case 0: // Enemy
                            map.targets = [map.battlers[Enum.CharacterKind.Monster][this.targetEnemyIndex]];
                            break;
                        case 1: // Hero instance ID
                            let id = this.targetHeroEnemyInstanceID.getValue();
                            for (let battler of map.battlers[Enum.CharacterKind
                                .Hero]) {
                                if (battler.player.instid === id) {
                                    map.targets = [battler];
                                    break;
                                }
                            }
                            for (let battler of map.battlers[Enum.CharacterKind
                                .Monster]) {
                                if (battler.player.instid === id) {
                                    map.targets = [battler];
                                    break;
                                }
                            }
                            break;
                    }
                    break;
            }
        }
        // Use battler turn or not
        map.forceAnActionUseTurn = this.useBattlerTurn;
        // Register step and substep for going back to it after action done
        map.previousStep = map.step;
        map.previousSubStep = map.subStep;
        // Start animation
        map.changeStep(Enum.BattleStep.Animation);
        return null;
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        return !Scene.Map.current.isBattleMap || !Scene.Map.current
            .forceAnAction ? 1 : 0;
    }
}
export { ForceAnAction };
