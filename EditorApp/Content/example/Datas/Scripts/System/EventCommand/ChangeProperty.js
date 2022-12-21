/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { System, Scene } from "../index.js";
import { Game } from "../Core/index.js";
import { Mathf, Utils } from "../Common/index.js";
/** @class
 *  An event command for changing a property value.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeProperty extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.propertyID = System.DynamicValue.createValueCommand(command, iterator);
        this.operationKind = command[iterator.i++];
        this.newValue = System.DynamicValue.createValueCommand(command, iterator);
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        let propertyID = this.propertyID.getValue();
        let newValue = Mathf.OPERATORS_NUMBERS[this.operationKind](object
            .properties[propertyID], this.newValue.getValue());
        object.properties[propertyID] = newValue;
        let props;
        if (object.isHero) {
            props = Game.current.heroProperties;
        }
        else if (object.isStartup) {
            props = Game.current.startupProperties[Scene.Map.current.id];
            if (Utils.isUndefined(props)) {
                props = [];
                Game.current.startupProperties[Scene.Map.current.id] = props;
            }
        }
        else {
            let portion = Scene.Map.current.allObjects[object.system.id]
                .getGlobalPortion();
            let portionDatas = Game.current.getPortionDatas(Scene.Map.current.id, portion);
            let indexProp = portionDatas.pi.indexOf(object.system.id);
            if (indexProp === -1) {
                props = [];
                portionDatas.pi.push(object.system.id);
                portionDatas.p.push(props);
            }
            else {
                props = portionDatas.p[indexProp];
            }
        }
        props[propertyID - 1] = newValue;
        return 1;
    }
}
export { ChangeProperty };
