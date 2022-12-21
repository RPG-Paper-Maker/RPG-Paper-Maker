/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { System, Datas, Manager } from "../index.js";
import { Utils, Enum } from "../Common/index.js";
var DynamicValueKind = Enum.DynamicValueKind;
/** @class
 *  An event command for sending an event.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class SendEvent extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        // Target
        let l = command.length;
        this.targetKind = command[iterator.i++];
        this.senderNoReceiver = false;
        switch (this.targetKind) {
            case 1:
                this.targetID = System.DynamicValue.createValueCommand(command, iterator);
                this.senderNoReceiver = Utils.numToBool(command[iterator.i++]);
                this.onlyTheClosest = Utils.numToBool(command[iterator.i++]);
                break;
            case 2:
                this.targetID = System.DynamicValue.createValueCommand(command, iterator);
                break;
        }
        this.isSystem = !Utils.numToBool(command[iterator.i++]);
        this.eventID = command[iterator.i++];
        // Parameters
        let parameters = (this.isSystem ? Datas.CommonEvents.getEventSystem(this
            .eventID) : Datas.CommonEvents.getEventUser(this.eventID))
            .parameters;
        this.parameters = [];
        let parameter, paramID, k;
        while (iterator.i < l) {
            paramID = command[iterator.i++];
            k = command[iterator.i++];
            if (k > DynamicValueKind.Unknown && k <= DynamicValueKind.Default) {
                // If default value
                parameter = k === DynamicValueKind.Default ? parameters[paramID].value : System.DynamicValue.create(k, null);
            }
            else {
                parameter = System.DynamicValue.create(k, command[iterator.i++]);
            }
            this.parameters[paramID] = parameter;
        }
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        Manager.Events.sendEvent(object, this.targetKind, this.targetID ? this
            .targetID.getValue() : -1, this.isSystem, this.eventID, System
            .DynamicValue.mapWithParametersProperties(this
            .parameters), this.senderNoReceiver, this.onlyTheClosest);
        return 1;
    }
}
export { SendEvent };
