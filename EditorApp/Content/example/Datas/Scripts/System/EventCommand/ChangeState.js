/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { System, EventCommand, Scene } from "../index.js";
import { MapObject, Game } from "../Core/index.js";
/** @class
 *  An event command for changing an object state.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeState extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.mapID = System.DynamicValue.createValueCommand(command, iterator);
        this.objectID = System.DynamicValue.createValueCommand(command, iterator);
        this.idState = System.DynamicValue.createValueCommand(command, iterator);
        this.operationKind = command[iterator.i++];
    }
    /**
     *  Add a state to an object.
     *  @static
     *  @param {Record<string, any>} - portionDatas Datas inside a portion
     *  @param {number} index - Index in the portion datas
     *  @param {number} state - ID of the state
     */
    static addState(portionDatas, index, state) {
        let states = portionDatas.s[index];
        if (states.indexOf(state) === -1) {
            states.push(state);
        }
        EventCommand.ChangeState.removeFromDatas(portionDatas, index, states);
    }
    /**
     *  Remove a state from an object.
     *  @static
     *  @param {Record<string, any>} - portionDatas Datas inside a portion
     *  @param {number} index - Index in the portion datas
     *  @param {number} state - ID of the state
     */
    static removeState(portionDatas, index, state) {
        let states = portionDatas.s[index];
        let indexState = states.indexOf(state);
        if (states.indexOf(state) !== -1) {
            states.splice(indexState, 1);
        }
        EventCommand.ChangeState.removeFromDatas(portionDatas, index, states);
    }
    /**
     *  Remove all the states from an object.
     *  @static
     *  @param {Record<string, any>} - portionDatas Datas inside a portion
     *  @param {number} index - Index in the portion datas
     */
    static removeAll(portionDatas, index) {
        portionDatas.s[index] = [];
    }
    /**
     *  Remove states from datas.
     *  @static
     *  @param {Record<string, any>} - portionDatas Datas inside a portion
     *  @param {number} index - Index in the portion datas
     *  @param {number[]} states
     */
    static removeFromDatas(portionDatas, index, states) {
        if (states.length === 1 && states[0] === 1) {
            portionDatas.si.splice(index, 1);
            portionDatas.s.splice(index, 1);
        }
    }
    /**
     *  Add state in ID's list.
     *  @static
     *  @param {number[]} states - The states IDs
     *  @param {number} state - ID of the state
     */
    static addStateSpecial(states, state) {
        if (states.indexOf(state) === -1) {
            states.push(state);
        }
    }
    /**
     *  Remove state in ID's list.
     *  @static
     *  @param {number[]} states - The states IDs
     *  @param {number} state - ID of the state
     */
    static removeStateSpecial(states, state) {
        let indexState = states.indexOf(state);
        if (indexState !== -1) {
            states.splice(indexState, 1);
        }
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            map: null,
            object: null,
            mapID: this.mapID.getValue(),
            objectID: this.objectID.getValue()
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
        if (!currentState.waitingObject) {
            if (currentState.map === null) {
                if (currentState.mapID === -1 || currentState.mapID === Scene
                    .Map.current.id || currentState.objectID === -1) {
                    currentState.map = Scene.Map.current;
                }
                else {
                    currentState.map = new Scene.Map(currentState.mapID, false, true);
                    (async () => {
                        await currentState.map.readMapProperties(true);
                        await currentState.map.initializeObjects();
                        currentState.map.initializePortionsObjects();
                    })();
                }
            }
            if (currentState.map.allObjects && currentState.map
                .portionsObjectsUpdated) {
                if (currentState.map === Scene.Map.current) {
                    MapObject.search(currentState.objectID, (result) => {
                        currentState.object = result.object;
                    }, object);
                }
                else {
                    currentState.object = {};
                }
                currentState.waitingObject = true;
            }
        }
        if (currentState.waitingObject && currentState.object !== null) {
            if (currentState.object.isHero || currentState.object.isStartup) {
                let states = currentState.object.isHero ? Game.current
                    .heroStates : Game.current.startupStates[Scene.Map.current.id];
                switch (this.operationKind) {
                    case 0: // Replacing
                        if (currentState.object.isHero) {
                            Game.current.heroStates = [];
                        }
                        else {
                            Game.current.startupStates[Scene.Map.current.id] = [];
                        }
                        states = currentState.object.isHero ? Game.current
                            .heroStates : Game.current.startupStates[Scene.Map.current.id];
                        EventCommand.ChangeState.addStateSpecial(states, this
                            .idState.getValue());
                        break;
                    case 1: // Adding
                        EventCommand.ChangeState.addStateSpecial(states, this
                            .idState.getValue());
                        break;
                    case 2: // Deleting
                        EventCommand.ChangeState.removeStateSpecial(states, this
                            .idState.getValue());
                        break;
                }
            }
            else {
                let objectID = currentState.objectID === -1 ? object.system.id :
                    currentState.objectID;
                let portion = currentState.map.allObjects[objectID]
                    .getGlobalPortion();
                let portionDatas = Game.current.getPortionDatas(currentState.map.id, portion);
                let indexState = portionDatas.si.indexOf(objectID);
                if (indexState === -1) {
                    indexState = portionDatas.si.length;
                    portionDatas.si.push(objectID);
                    portionDatas.s.push([1]);
                }
                switch (this.operationKind) {
                    case 0: // Replacing
                        EventCommand.ChangeState.removeAll(portionDatas, indexState);
                        EventCommand.ChangeState.addState(portionDatas, indexState, this.idState.getValue());
                        break;
                    case 1: // Adding
                        EventCommand.ChangeState.addState(portionDatas, indexState, this.idState.getValue());
                        break;
                    case 2: // Deleting
                        EventCommand.ChangeState.removeState(portionDatas, indexState, this.idState.getValue());
                        break;
                }
            }
            if (currentState.map === Scene.Map.current) {
                currentState.object.changeState();
            }
            return 1;
        }
        return 0;
    }
}
export { ChangeState };
