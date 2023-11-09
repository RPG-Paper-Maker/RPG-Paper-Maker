/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { System } from '../index.js';
import { Game } from '../Core/index.js';
/** @class
 *  An event command for changing status.
 *  @extends EventCommand.Base
 */
class ChangeStatus extends Base {
    constructor(command) {
        super();
        var iterator = {
            i: 0
        };
        // Selection
        this.selection = command[iterator.i++];
        switch (this.selection) {
            case 0:
                this.heInstanceID = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 1:
                this.groupIndex = command[iterator.i++];
                break;
        }
        // Operation
        this.operation = command[iterator.i++];
        // Status
        this.statusID = System.DynamicValue.createValueCommand(command, iterator);
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        let statusID = this.statusID.getValue();
        let targets;
        switch (this.selection) {
            case 0:
                targets = [Game.current.getHeroByInstanceID(this.heInstanceID
                        .getValue())];
                break;
            case 1:
                targets = Game.current.getTeam(this.groupIndex);
                break;
        }
        let target;
        for (let i = 0, l = targets.length; i < l; i++) {
            target = targets[i];
            switch (this.operation) {
                case 0:
                    target.addStatus(statusID);
                    break;
                case 1:
                    target.removeStatus(statusID);
                    break;
            }
        }
        return 1;
    }
}
export { ChangeStatus };
