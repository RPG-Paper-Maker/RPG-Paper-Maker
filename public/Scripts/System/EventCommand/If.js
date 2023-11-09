/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { System, Datas, Scene } from '../index.js';
import { Utils, Enum, Mathf, Interpreter, Inputs } from '../Common/index.js';
var ConditionHeroesKind = Enum.ConditionHeroesKind;
var ItemKind = Enum.ItemKind;
import { Player, MapObject, Game } from '../Core/index.js';
/** @class
 *  An event command for condition event command block.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class If extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.hasElse = Utils.numToBool(command[iterator.i++]);
        this.kind = command[iterator.i++];
        switch (this.kind) {
            case 0: // Variable / Param / Prop
                this.variableParamProp = System.DynamicValue.createValueCommand(command, iterator);
                this.variableParamPropOperationKind = command[iterator.i++];
                this.variableParamPropValue = System.DynamicValue
                    .createValueCommand(command, iterator);
                break;
            case 1: // Heroes
                this.heroesSelection = command[iterator.i++];
                if (this.heroesSelection === ConditionHeroesKind.TheHeroeWithInstanceID) {
                    this.heroInstanceID = System.DynamicValue.createValueCommand(command, iterator);
                }
                this.heroesInTeam = Utils.numToBool(command[iterator.i++]);
                if (this.heroesInTeam) {
                    this.heroesInTeamSelection = command[iterator.i++];
                }
                this.heroesKind = command[iterator.i++];
                switch (this.heroesKind) {
                    case 0:
                        this.heroesNamed = System.DynamicValue
                            .createValueCommand(command, iterator);
                        break;
                    case 1:
                        this.heroesInTeamValue = command[iterator.i++];
                        break;
                    case 2:
                        this.heroesSkillID = System.DynamicValue
                            .createValueCommand(command, iterator);
                        break;
                    case 3:
                        this.heroesEquipedKind = command[iterator.i++];
                        switch (this.heroesEquipedKind) {
                            case 0:
                                this.heroesEquipedWeaponID = System.DynamicValue
                                    .createValueCommand(command, iterator);
                                break;
                            case 1:
                                this.heroesEquipedArmorID = System.DynamicValue
                                    .createValueCommand(command, iterator);
                                break;
                        }
                        break;
                    case 4:
                        this.heroesStatusID = System.DynamicValue
                            .createValueCommand(command, iterator);
                        break;
                    case 5:
                        this.heroesStatisticID = System.DynamicValue
                            .createValueCommand(command, iterator);
                        this.heroesStatisticOperation = command[iterator.i++];
                        this.heroesStatisticValue = System.DynamicValue
                            .createValueCommand(command, iterator);
                        break;
                }
                break;
            case 2:
                this.currencyID = System.DynamicValue.createValueCommand(command, iterator);
                this.operationCurrency = command[iterator.i++];
                this.currencyValue = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 3:
                this.itemID = System.DynamicValue.createValueCommand(command, iterator);
                this.operationItem = command[iterator.i++];
                this.itemValue = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 4:
                this.weaponID = System.DynamicValue.createValueCommand(command, iterator);
                this.operationWeapon = command[iterator.i++];
                this.weaponValue = System.DynamicValue.createValueCommand(command, iterator);
                this.weaponEquiped = Utils.numToBool(command[iterator.i++]);
                break;
            case 5:
                this.armorID = System.DynamicValue.createValueCommand(command, iterator);
                this.operationArmor = command[iterator.i++];
                this.armorValue = System.DynamicValue.createValueCommand(command, iterator);
                this.armorEquiped = Utils.numToBool(command[iterator.i++]);
                break;
            case 6:
                this.keyID = System.DynamicValue.createValueCommand(command, iterator);
                this.keyValue = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 7:
                this.script = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 9:
                this.objectIDLookingAt = System.DynamicValue.createValueCommand(command, iterator);
                this.orientationLookingAt = command[iterator.i++];
                break;
            case 10:
                this.chronometerID = System.DynamicValue.createValueCommand(command, iterator);
                this.chronometerOperation = command[iterator.i++];
                this.chronometerSeconds = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 11:
                this.objectIDClimbing = System.DynamicValue.createValueCommand(command, iterator);
                break;
        }
    }
    /**
     *  Get the hero instance ID.
     *  @returns {number}
     */
    getHeroInstanceID() {
        return this.heroInstanceID ? this.heroInstanceID.getValue() : 0;
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            waitingObject: false,
            object: null
        };
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        let i, j, l, m, result, heroesSelection, id, equip, stat, item, value, nb;
        switch (this.kind) {
            case 0: // Variable / Param / Prop
                result = Mathf.OPERATORS_COMPARE[this
                    .variableParamPropOperationKind](this.variableParamProp
                    .getValue(), this.variableParamPropValue.getValue());
                break;
            case 1:
                if (this.heroesInTeam) {
                    heroesSelection = Game.current.getTeam(this
                        .heroesInTeamSelection);
                }
                else {
                    heroesSelection = Game.current.teamHeroes.concat(Game.current.reserveHeroes);
                    heroesSelection.concat(Game.current.hiddenHeroes);
                }
                switch (this.heroesKind) {
                    case 0:
                        let name = this.heroesNamed.getValue();
                        result = Player.applySelection(this.heroesSelection, heroesSelection, this.getHeroInstanceID(), (hero) => {
                            return hero.name === name;
                        });
                        break;
                    case 1:
                        let tab = Game.current.getTeam(this
                            .heroesInTeamValue);
                        result = Player.applySelection(this.heroesSelection, heroesSelection, this.getHeroInstanceID(), (hero) => {
                            id = hero.instid;
                            for (i = 0, l = tab.length; i < l; i++) {
                                if (tab[i].instid === id) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        break;
                    case 2:
                        id = this.heroesSkillID.getValue();
                        result = Player.applySelection(this.heroesSelection, heroesSelection, this.getHeroInstanceID(), (hero) => {
                            for (i = 0, l = hero.skills.length; i < l; i++) {
                                if (hero.skills[i].id === id) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        break;
                    case 3:
                        switch (this.heroesEquipedKind) {
                            case 0:
                                id = this.heroesEquipedWeaponID.getValue();
                                result = Player.applySelection(this.heroesSelection, heroesSelection, this.getHeroInstanceID(), (hero) => {
                                    for (i = 0, l = hero.equip.length; i < l; i++) {
                                        equip = hero.equip[i];
                                        if (equip && equip.kind === ItemKind.Weapon
                                            && equip.system.id === id) {
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                                break;
                            case 1:
                                id = this.heroesEquipedArmorID.getValue();
                                result = Player.applySelection(this.heroesSelection, heroesSelection, this.getHeroInstanceID(), (hero) => {
                                    for (i = 0, l = hero.equip.length; i < l; i++) {
                                        equip = hero.equip[i];
                                        if (equip && equip.kind === ItemKind.Armor
                                            && equip.system.id === id) {
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                                break;
                        }
                        break;
                    case 4:
                        id = this.heroesStatusID.getValue();
                        result = Player.applySelection(this.heroesSelection, heroesSelection, this.getHeroInstanceID(), (hero) => {
                            for (i = 0, l = hero.status.length; i < l; i++) {
                                if (id === hero.status[i].system.id) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        break;
                    case 5:
                        stat = Datas.BattleSystems.getStatistic(this
                            .heroesStatisticID.getValue());
                        value = this.heroesStatisticValue.getValue();
                        result = Player.applySelection(this.heroesSelection, heroesSelection, this.getHeroInstanceID(), (hero) => {
                            return Mathf.OPERATORS_COMPARE[this
                                .heroesStatisticOperation](hero[stat
                                .abbreviation], value);
                        });
                        break;
                }
                break;
            case 2:
                result = Mathf.OPERATORS_COMPARE[this.operationCurrency](Game
                    .current.currencies[this.currencyID.getValue()], this
                    .currencyValue.getValue());
                break;
            case 3:
                nb = 0;
                id = this.itemID.getValue();
                for (i = 0, l = Game.current.items.length; i < l; i++) {
                    item = Game.current.items[i];
                    if (item.kind === ItemKind.Item && item.system.id === id) {
                        nb = item.nb;
                        break;
                    }
                }
                result = Mathf.OPERATORS_COMPARE[this.operationItem](nb, this
                    .itemValue.getValue());
                break;
            case 4:
                nb = 0;
                id = this.weaponID.getValue();
                for (i = 0, l = Game.current.items.length; i < l; i++) {
                    item = Game.current.items[i];
                    if (item.kind === ItemKind.Weapon && item.system.id === id) {
                        nb = item.nb;
                        break;
                    }
                }
                if (this.weaponEquiped) {
                    heroesSelection = Game.current.teamHeroes.concat(Game.current.reserveHeroes);
                    heroesSelection.concat(Game.current.hiddenHeroes);
                    let h;
                    for (i = 0, l = heroesSelection.length; i < l; i++) {
                        h = heroesSelection[i];
                        for (j = 0, m = h.equip.length; j < m; j++) {
                            equip = h.equip[j];
                            if (equip && equip.kind === ItemKind.Weapon && equip
                                .system.id === id) {
                                nb += 1;
                            }
                        }
                    }
                }
                result = Mathf.OPERATORS_COMPARE[this.operationWeapon](nb, this
                    .weaponValue.getValue());
                break;
            case 5:
                nb = 0;
                id = this.armorID.getValue();
                for (i = 0, l = Game.current.items.length; i < l; i++) {
                    item = Game.current.items[i];
                    if (item.kind === ItemKind.Armor && item.system.id === id) {
                        nb = item.nb;
                        break;
                    }
                }
                if (this.armorEquiped) {
                    heroesSelection = Game.current.teamHeroes.concat(Game.current.reserveHeroes);
                    heroesSelection.concat(Game.current.hiddenHeroes);
                    let h;
                    for (i = 0, l = heroesSelection.length; i < l; i++) {
                        h = heroesSelection[i];
                        for (j = 0, m = h.equip.length; j < m; j++) {
                            equip = h.equip[j];
                            if (equip && equip.kind === ItemKind.Armor && equip
                                .system.id === id) {
                                nb += 1;
                            }
                        }
                    }
                }
                result = Mathf.OPERATORS_COMPARE[this.operationArmor](nb, this
                    .armorValue.getValue());
                break;
            case 6:
                let key = Datas.Keyboards.get(this.keyID.getValue());
                let b = this.keyValue.getValue();
                result = !b;
                for (i = 0, l = Inputs.keysPressed.length; i < l; i++) {
                    if (Datas.Keyboards.isKeyEqual(Inputs.keysPressed[i], key)) {
                        result = b;
                        break;
                    }
                }
                break;
            case 7:
                result = Interpreter.evaluate(this.script.getValue(), {
                    thisObject: object
                });
                break;
            case 8:
                result = Scene.Battle.escapedLastBattle;
                break;
            case 9: {
                if (!currentState.waitingObject) {
                    let objectID = this.objectIDLookingAt.getValue();
                    MapObject.search(objectID, (result) => {
                        currentState.object = result.object;
                    }, object);
                    currentState.waitingObject = true;
                }
                if (currentState.object === null) {
                    return 0;
                }
                else {
                    result = currentState.object.orientationEye === this
                        .orientationLookingAt;
                    break;
                }
            }
            case 10:
                let index = Utils.indexOfProp(Game.current.chronometers, "id", this.chronometerID.getValue());
                if (index === -1) {
                    result = false;
                    break;
                }
                else {
                    let chrono = Game.current.chronometers[index];
                    result = Mathf.OPERATORS_COMPARE[this.chronometerOperation](chrono.getSeconds(), this.chronometerSeconds.getValue());
                }
                break;
            case 11: {
                if (!currentState.waitingObject) {
                    let objectID = this.objectIDClimbing.getValue();
                    MapObject.search(objectID, (result) => {
                        currentState.object = result.object;
                    }, object);
                    currentState.waitingObject = true;
                }
                if (currentState.object === null) {
                    return 0;
                }
                else {
                    result = currentState.object.isClimbing;
                    break;
                }
            }
            default:
                break;
        }
        if (result) {
            return -1;
        }
        else {
            return 1 + (this.hasElse ? 0 : 1);
        }
    }
    /**
     *  Returns the number of node to pass.
     *  @returns {number}
     */
    goToNextCommand() {
        return 2 + (this.hasElse ? 1 : 0);
    }
}
export { If };
