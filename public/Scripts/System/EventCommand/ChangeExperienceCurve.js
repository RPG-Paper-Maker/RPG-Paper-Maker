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
import { Mathf } from '../Common/index.js';
import { Game } from '../Core/index.js';
/** @class
 *  An event command for changing experience curve of one or several hero.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class ChangeExperienceCurve extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.selectionKind = command[iterator.i++];
        switch (this.selectionKind) {
            case 0:
                this.selectionHeroEnemyInstanceID = System.DynamicValue
                    .createValueCommand(command, iterator);
                break;
            case 1:
                this.selectionTeam = command[iterator.i++];
                break;
        }
        this.levelRange = System.DynamicValue.createValueCommand(command, iterator);
        this.levelRangeTo = System.DynamicValue.createValueCommand(command, iterator);
        this.operation = command[iterator.i++];
        this.totalExperience = System.DynamicValue.createValueCommand(command, iterator);
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        let targets;
        switch (this.selectionKind) {
            case 0:
                targets = [Game.current.getHeroByInstanceID(this
                        .selectionHeroEnemyInstanceID.getValue())];
                break;
            case 1:
                targets = Game.current.getTeam(this.selectionTeam);
                break;
        }
        let level = this.levelRange.getValue();
        let levelTo = this.levelRangeTo.getValue();
        let totalExperience = this.totalExperience.getValue();
        let i, value;
        for (let target of targets) {
            for (i = level; i <= levelTo; i++) {
                value = Mathf.OPERATORS_NUMBERS[this.operation](target.expList[i], totalExperience);
                target.expList[i] = value;
                target.editedExpList[i] = value;
            }
            target.synchronizeLevel();
        }
        return 1;
    }
}
export { ChangeExperienceCurve };
