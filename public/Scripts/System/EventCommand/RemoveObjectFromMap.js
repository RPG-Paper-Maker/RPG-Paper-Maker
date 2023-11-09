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
import { MapObject, Portion, Game } from '../Core/index.js';
/** @class
 *  An event command for removing a specific object from map.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class RemoveObjectFromMap extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.objectID = System.DynamicValue.createValueCommand(command, iterator);
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            started: false,
            finished: false
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
        let objectID = this.objectID.getValue();
        if (!currentState.started) {
            currentState.started = true;
            MapObject.search(objectID, (result) => {
                if (!result.object.removed) {
                    if (result.datas !== null) {
                        switch (result.kind) {
                            case 0:
                                result.datas.m.splice(result.index, 1);
                                let index = result.datas.min.indexOf(result.object);
                                if (index === -1) {
                                    result.datas = Game.current.getPortionDatas(Scene.Map.current.id, Portion
                                        .createFromVector3(result.object.position));
                                    result.datas.mout.splice(result.datas.mout
                                        .indexOf(result.object), 1);
                                }
                                else {
                                    result.datas.min.splice(index, 1);
                                }
                                break;
                            case 1:
                                if (result.index > -1) {
                                    result.list.splice(result.index, 1);
                                }
                                break;
                        }
                        if (result.datas.r.indexOf(result.id) === -1) {
                            result.datas.r.push(result.id);
                        }
                    }
                    result.object.removed = true;
                    result.object.removeFromScene();
                }
                currentState.finished = true;
            }, object);
        }
        return currentState.finished ? 1 : 0;
    }
}
export { RemoveObjectFromMap };
