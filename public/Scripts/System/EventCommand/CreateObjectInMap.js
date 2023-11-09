/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas, Scene, System } from "../index.js";
import { Utils } from '../Common/index.js';
import { Game, MapObject, Position } from '../Core/index.js';
import { Base } from './Base.js';
/** @class
 *  An event command for creating an object in map.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class CreateObjectInMap extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.modelID = System.DynamicValue.createValueCommand(command, iterator);
        this.objectIDPosition = null;
        this.mapID = null;
        switch (command[iterator.i++]) {
            case 0:
                this.mapID = System.DynamicValue.createNumber(command[iterator
                    .i++]);
                this.x = System.DynamicValue.createNumber(command[iterator.i++]);
                this.y = System.DynamicValue.createNumber(command[iterator.i++]);
                this.yPlus = System.DynamicValue.createNumber(command[iterator
                    .i++]);
                this.z = System.DynamicValue.createNumber(command[iterator.i++]);
                break;
            case 1:
                this.mapID = System.DynamicValue.createValueCommand(command, iterator);
                this.x = System.DynamicValue.createValueCommand(command, iterator);
                this.y = System.DynamicValue.createValueCommand(command, iterator);
                this.yPlus = System.DynamicValue.createValueCommand(command, iterator);
                this.z = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 2:
                this.objectIDPosition = System.DynamicValue.createValueCommand(command, iterator);
                break;
        }
        this.isStockID = Utils.numToBool(command[iterator.i++]);
        if (this.isStockID) {
            this.stockID = System.DynamicValue.createValueCommand(command, iterator);
        }
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            position: null,
            waitingPosition: false
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
        // Do nothing if not in the current map
        if (this.objectIDPosition === null && this.mapID.getValue() !== Scene.Map
            .current.id) {
            return 1;
        }
        if (!currentState.waitingPosition) {
            // Set object's position
            if (this.objectIDPosition === null) {
                currentState.position = new Position(this.x.getValue(), this
                    .y.getValue(), this.z.getValue(), this.yPlus.getValue()
                    * 100 / Datas.Systems.SQUARE_SIZE).toVector3();
            }
            else {
                MapObject.search(this.objectIDPosition.getValue(), (result) => {
                    currentState.position = result.object.position.clone();
                }, object);
            }
            currentState.waitingPosition = true;
        }
        if (currentState.position !== null) {
            let id = ++Scene.Map.current.maxObjectsID;
            let position = Position.createFromVector3(currentState.position);
            let globalPortion = position.getGlobalPortion();
            Scene.Map.current.allObjects[id] = position;
            let newObject = new MapObject(System.MapObject.createFromModelID(this.modelID.getValue(), id), currentState.position);
            if (this.isStockID) {
                Game.current.variables[this.stockID.getValue(true)] = id;
            }
            Game.current.getPortionDatas(Scene.Map.current.id, globalPortion).m.push(newObject);
            Game.current.getPortionDatas(Scene.Map.current.id, globalPortion).min.push(newObject);
            newObject.changeState();
        }
        return currentState.position === null ? 0 : 1;
    }
}
export { CreateObjectInMap };
