/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { System, Scene, Graphic } from '../index.js';
import { Enum } from '../Common/index.js';
import { Battler, Game } from '../Core/index.js';
/** @class
 *  An event command for changing a battler graphics.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class ChangeBattlerGraphics extends Base {
    constructor(command) {
        super();
        this.facesetID = null;
        this.facesetIndexX = 0;
        this.facesetIndexY = 0;
        this.battlerID = null;
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
        if (command[iterator.i++]) {
            this.facesetID = System.DynamicValue.createValueCommand(command, iterator);
            iterator.i++;
            this.facesetIndexX = command[iterator.i++];
            this.facesetIndexY = command[iterator.i++];
        }
        if (command[iterator.i++]) {
            this.battlerID = System.DynamicValue.createValueCommand(command, iterator);
        }
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
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
        let map = Scene.Map.current;
        let player = null;
        let battler = null;
        let index = 0;
        let side = Enum.CharacterKind.Hero;
        switch (this.battlerKind) {
            case 0: // Enemy
                if (Scene.Map.current.isBattleMap) {
                    battler = map.battlers[Enum.CharacterKind.Monster][this.battlerEnemyIndex];
                    player = battler.player;
                    index = this.battlerEnemyIndex;
                    side = Enum.CharacterKind.Monster;
                }
                break;
            case 1: // Hero instance ID
                let id = this.battlerHeroEnemyInstanceID.getValue();
                if (Scene.Map.current.isBattleMap) {
                    for (let [i, b] of map.battlers[Enum.CharacterKind.Hero].entries()) {
                        if (b.player.instid === id) {
                            battler = b;
                            player = b.player;
                            index = i;
                            side = Enum.CharacterKind.Hero;
                            break;
                        }
                    }
                    for (let [i, b] of map.battlers[Enum.CharacterKind.Monster].entries()) {
                        if (b.player.instid === id) {
                            battler = b;
                            player = b.player;
                            index = i;
                            side = Enum.CharacterKind.Monster;
                            break;
                        }
                    }
                }
                else {
                    for (let [i, p] of Game.current.teamHeroes.entries()) {
                        if (p.instid === id) {
                            player = p;
                            index = i;
                            side = Enum.CharacterKind.Hero;
                            break;
                        }
                    }
                }
                break;
        }
        if (player) {
            if (this.battlerID) {
                player.battlerID = this.battlerID.getValue();
            }
            if (this.facesetID) {
                player.facesetID = this.facesetID.getValue();
                player.facesetIndexX = this.facesetIndexX;
                player.facesetIndexY = this.facesetIndexY;
            }
            if (Scene.Map.current.isBattleMap) {
                let newBattler = new Battler(player, battler.isEnemy, battler
                    .initialPosition, battler.position, map.camera);
                map.battlers[side][index].removeFromScene();
                newBattler.addToScene();
                map.battlers[side][index] = newBattler;
                map.players[side][index] = player;
                map.graphicPlayers[side][index] = new Graphic.Player(player);
                player.battler = newBattler;
            }
        }
        return 1;
    }
}
export { ChangeBattlerGraphics };
