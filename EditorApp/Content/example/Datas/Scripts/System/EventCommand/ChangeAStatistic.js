/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { System, Datas } from "../index.js";
import { Utils, Mathf, Interpreter, Platform } from "../Common/index.js";
import { Game } from "../Core/index.js";
/** @class
 *  An event command for changing a statistic.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class ChangeAStatistic extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.statisticID = System.DynamicValue.createValueCommand(command, iterator);
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
        // Value
        this.value = command[iterator.i++];
        switch (this.value) {
            case 0:
                this.vNumber = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 1:
                this.vFormula = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 2:
                this.vMax = true;
                break;
        }
        // Option
        this.canAboveMax = !Utils.numToBool(command[iterator.i++]);
        this.isApplyToMax = Utils.numToBool(command[iterator.i++]);
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        let statisticID = this.statisticID.getValue();
        let stat = Datas.BattleSystems.getStatistic(statisticID);
        let isChangingExperience = Datas.BattleSystems.idExpStatistic === statisticID;
        let isChangingLevel = Datas.BattleSystems.idLevelStatistic === statisticID;
        let abr = this.isApplyToMax ? stat.getMaxAbbreviation() : stat.abbreviation;
        let targets;
        switch (this.selection) {
            case 0:
                let t = Game.current.getHeroByInstanceID(this.heInstanceID.getValue());
                if (t === null) {
                    Platform.showErrorMessage("Can't get any hero/enemy with instance ID "
                        + this.heInstanceID.getValue() + ". Please review your event command.");
                }
                targets = [t];
                break;
            case 1:
                targets = Game.current.getTeam(this.groupIndex);
                break;
        }
        let target, before, after;
        for (let i = 0, l = targets.length; i < l; i++) {
            target = targets[i];
            before = target[abr];
            switch (this.value) {
                case 0:
                    target[abr] = Mathf.OPERATORS_NUMBERS[this.operation](target[abr], this.vNumber.getValue());
                    break;
                case 1:
                    target[abr] = Mathf.OPERATORS_NUMBERS[this.operation](target[abr], Interpreter.evaluate(this.vFormula.getValue(), {
                        user: target
                    }));
                    break;
                case 2:
                    target[abr] = Mathf.OPERATORS_NUMBERS[this.operation](target[abr], target[stat.getMaxAbbreviation()]);
                    break;
            }
            if (!this.canAboveMax) {
                target[abr] = Math.max(target[stat.getMaxAbbreviation()], target[abr]);
            }
            after = target[abr];
            if (isChangingLevel || isChangingExperience || stat.isFix || this
                .isApplyToMax) {
                if (isChangingLevel) {
                    target[abr] = before;
                    while (target.getCurrentLevel() < after) {
                        target.levelUp();
                    }
                    target.synchronizeExperience();
                }
                else {
                    target[stat.getAddedAbbreviation()] += after - before;
                }
                if (isChangingExperience) {
                    target.synchronizeLevel();
                }
            }
            // Recalculate stats
            target.updateAllStatsValues();
        }
        return 1;
    }
}
export { ChangeAStatistic };
