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
import { Battler, Game, Player } from '../Core/index.js';
/** @class
 *  An event command for transforming a battler.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class TransformABattler extends Base {
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
        this.monsterID = System.DynamicValue.createValueCommand(command, iterator);
        this.level = System.DynamicValue.createValueCommand(command, iterator);
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
        if (Scene.Map.current.isBattleMap) {
            let map = Scene.Map.current;
            let battler = null;
            let index = 0;
            let side = Enum.CharacterKind.Hero;
            switch (this.battlerKind) {
                case 0: // Enemy
                    battler = map.battlers[Enum.CharacterKind.Monster][this.battlerEnemyIndex];
                    index = this.battlerEnemyIndex;
                    side = Enum.CharacterKind.Monster;
                    break;
                case 1: // Hero instance ID
                    let id = this.battlerHeroEnemyInstanceID.getValue();
                    for (let [i, b] of map.battlers[Enum.CharacterKind.Hero].entries()) {
                        if (b.player.instid === id) {
                            battler = b;
                            index = i;
                            side = Enum.CharacterKind.Hero;
                            break;
                        }
                    }
                    for (let [i, b] of map.battlers[Enum.CharacterKind.Monster].entries()) {
                        if (b.player.instid === id) {
                            battler = b;
                            index = i;
                            side = Enum.CharacterKind.Monster;
                            break;
                        }
                    }
                    break;
            }
            if (battler) {
                let player = new Player(battler.player.kind, this.monsterID
                    .getValue(), Game.current.charactersInstances++, [], []);
                player.instanciate(this.level.getValue());
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
export { TransformABattler };
