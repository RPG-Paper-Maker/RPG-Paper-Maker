/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { System, Scene } from '../index.js';
import { Enum } from '../Common/index.js';
/** @class
 *  An event command for displaying or hidding a battler.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class DisplayHideABattler extends Base {
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
        this.hidden = System.DynamicValue.createValueCommand(command, iterator);
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
            switch (this.battlerKind) {
                case 0: // Enemy
                    battler = map.battlers[Enum.CharacterKind.Monster][this.battlerEnemyIndex];
                    break;
                case 1: // Hero instance ID
                    let id = this.battlerHeroEnemyInstanceID.getValue();
                    for (let b of map.battlers[Enum.CharacterKind.Hero]) {
                        if (b.player.instid === id) {
                            battler = b;
                            break;
                        }
                    }
                    for (let b of map.battlers[Enum.CharacterKind.Monster]) {
                        if (b.player.instid === id) {
                            battler = b;
                            break;
                        }
                    }
                    break;
            }
            if (battler) {
                battler.updateHidden(this.hidden.getValue());
            }
        }
        return 1;
    }
}
export { DisplayHideABattler };
