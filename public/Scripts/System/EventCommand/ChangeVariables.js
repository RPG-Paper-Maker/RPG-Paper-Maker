/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { Datas, Manager, Scene, System } from '../index.js';
import { MapObject, Position, Game, Item } from '../Core/index.js';
import { Mathf, Enum, Platform } from '../Common/index.js';
/** @class
 *  An event command for changing variables values.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeVariables extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 2
        };
        // Selection
        this.selection = command[1];
        this.nbSelection = 1;
        if (command[0] === 1) {
            this.nbSelection = command[iterator.i++] - this.selection;
        }
        // Operation
        this.operation = command[iterator.i++];
        // Value
        this.valueKind = command[iterator.i++];
        switch (this.valueKind) {
            case 0: // Number
                this.valueNumber = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 1: // Random number
                this.valueRandomA = System.DynamicValue.createValueCommand(command, iterator);
                this.valueRandomB = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 2: // Message
                this.valueMessage = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 3: // Switch
                this.valueSwitch = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 4: // Map object characteristic
                this.valueMapObject = System.DynamicValue.createValueCommand(command, iterator);
                this.valueMapObjectChar = command[iterator.i++];
                break;
            case 5: // Number of weapon / armor / item in inventory
                this.valueItemKind = command[iterator.i++];
                this.valueItemID = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 6: // Total currency
                this.valueTotalCurrencyKind = command[iterator.i++];
                this.valueTotalCurrencyID = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 7: // Hero / enemy stat
                this.valueHeroEnemyInstanceID = System.DynamicValue.createValueCommand(command, iterator);
                this.valueStatisticID = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 8: // Enemy instance ID
                this.valueEnemyIndex = command[iterator.i++];
                break;
            case 9: // Other characteristics
                this.valueOtherCharacteristicKind = command[iterator.i++];
                break;
        }
    }
    /**
     *  Initialize the current.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            started: false,
        };
    }
    /**
     *  Update and check if the event is finished
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        if (!currentState.started) {
            currentState.started = true;
            currentState.valid = true;
            // Get value to set
            switch (this.valueKind) {
                case 0: // Number
                    currentState.value = this.valueNumber.getValue();
                    break;
                case 1: // Random number
                    currentState.value = Mathf.random(this.valueRandomA
                        .getValue(), this.valueRandomB.getValue());
                    break;
                case 2: // Message
                    currentState.value = this.valueMessage.getValue();
                    break;
                case 3: // Switch
                    currentState.value = this.valueSwitch.getValue();
                    break;
                case 4: // Map object characteristic
                    let objectID = this.valueMapObject.getValue();
                    currentState.valid = false;
                    MapObject.search(objectID, (result) => {
                        let obj = result.object;
                        if (!obj) {
                            Platform.showErrorMessage("Cannot find object ID " +
                                objectID + " in change variables for map object characteristics.");
                        }
                        switch (this.valueMapObjectChar) {
                            case Enum.VariableMapObjectCharacteristicKind.XSquarePosition:
                                currentState.value = Position.createFromVector3(obj.position).x;
                                break;
                            case Enum.VariableMapObjectCharacteristicKind.YSquarePosition:
                                currentState.value = Position.createFromVector3(obj.position).y;
                                break;
                            case Enum.VariableMapObjectCharacteristicKind.ZSquarePosition:
                                currentState.value = Position.createFromVector3(obj.position).z;
                                break;
                            case Enum.VariableMapObjectCharacteristicKind.XPixelPosition:
                                currentState.value = obj.position.x;
                                break;
                            case Enum.VariableMapObjectCharacteristicKind.YPixelPosition:
                                currentState.value = obj.position.y;
                                break;
                            case Enum.VariableMapObjectCharacteristicKind.ZPixelPosition:
                                currentState.value = obj.position.z;
                                break;
                            case Enum.VariableMapObjectCharacteristicKind.Orientation:
                                currentState.value = obj.orientation;
                                break;
                            case Enum.VariableMapObjectCharacteristicKind.Terrain:
                                currentState.value = obj.terrain;
                                break;
                        }
                        currentState.valid = true;
                    }, object);
                    break;
                case 5: // Number of weapon / armor / item in inventory
                    let item = Item.findItem(this.valueItemKind, this.valueItemID
                        .getValue());
                    currentState.value = item === null ? 0 : item.nb;
                    break;
                case 6: // Total currency
                    switch (this.valueTotalCurrencyKind) {
                        case 0: // Owned
                            currentState.value = Game.current.getCurrency(this
                                .valueTotalCurrencyID.getValue());
                            break;
                        case 1: // Earned
                            currentState.value = Game.current.getCurrencyEarned(this
                                .valueTotalCurrencyID.getValue());
                            break;
                        case 2: // Used
                            currentState.value = Game.current.getCurrencyUsed(this
                                .valueTotalCurrencyID.getValue());
                            break;
                    }
                    break;
                case 7: // Hero / enemy stat
                    currentState.value = 0;
                    let id = this.valueHeroEnemyInstanceID.getValue();
                    for (let player of Game.current.teamHeroes) {
                        if (player.instid === id) {
                            currentState.value = player[Datas.BattleSystems
                                .getStatistic(this.valueStatisticID.getValue())
                                .abbreviation];
                            break;
                        }
                    }
                    break;
                case 8: // Enemy instance ID
                    currentState.value = 0;
                    if (Scene.Map.current.isBattleMap) {
                        currentState.value = Scene.Map.current
                            .battlers[Enum.CharacterKind.Monster][this
                            .valueEnemyIndex].player.instid;
                    }
                    break;
                case 9: // Other characteristics
                    switch (this.valueOtherCharacteristicKind) {
                        case Enum.ChangeVariablesOtherCharacteristics.CurrentMapID:
                            currentState.value = Scene.Map.current.id;
                            break;
                        case Enum.ChangeVariablesOtherCharacteristics.NumberInTeam:
                            currentState.value = Game.current.teamHeroes.length;
                            break;
                        case Enum.ChangeVariablesOtherCharacteristics.NumberInHidden:
                            currentState.value = Game.current.hiddenHeroes.length;
                            break;
                        case Enum.ChangeVariablesOtherCharacteristics.NumberInReserve:
                            currentState.value = Game.current.reserveHeroes.length;
                            break;
                        case Enum.ChangeVariablesOtherCharacteristics.TotalNumberOfSteps:
                            currentState.value = Game.current.steps;
                            break;
                        case Enum.ChangeVariablesOtherCharacteristics.TotalNumberOfSeconds:
                            currentState.value = Game.current.playTime.getSeconds();
                            break;
                        case Enum.ChangeVariablesOtherCharacteristics.TotalNumberOfSavesDone:
                            currentState.value = Game.current.saves;
                            break;
                        case Enum.ChangeVariablesOtherCharacteristics.TotalNumberOfBattles:
                            currentState.value = Game.current.battles;
                            break;
                        case Enum.ChangeVariablesOtherCharacteristics.CameraXPosition:
                            currentState.value = Scene.Map.current.camera.getThreeCamera().position.x;
                            break;
                        case Enum.ChangeVariablesOtherCharacteristics.CameraYPosition:
                            currentState.value = Scene.Map.current.camera.getThreeCamera().position.y;
                            break;
                        case Enum.ChangeVariablesOtherCharacteristics.CameraZPosition:
                            currentState.value = Scene.Map.current.camera.getThreeCamera().position.z;
                            break;
                        case Enum.ChangeVariablesOtherCharacteristics.TotalSecondsCurrentMusic: {
                            currentState.value = 0;
                            let current = Manager.Songs.current[Enum.SongKind.Music];
                            if (current) {
                                currentState.value = current.seek();
                            }
                            break;
                        }
                        case Enum.ChangeVariablesOtherCharacteristics.TotalSecondsCurrentBackgroundMusic: {
                            currentState.value = 0;
                            let current = Manager.Songs.current[Enum.SongKind.BackgroundSound];
                            if (current) {
                                currentState.value = current.seek();
                            }
                            break;
                        }
                    }
                    break;
            }
        }
        // Apply new value to variable(s)
        if (currentState.valid) {
            for (let i = 0, l = this.nbSelection; i < l; i++) {
                Game.current.variables[this.selection + i] = Mathf
                    .OPERATORS_NUMBERS[this.operation](Game.current.variables[this.selection + i], currentState.value);
            }
            return 1;
        }
        return 0;
    }
}
export { ChangeVariables };
