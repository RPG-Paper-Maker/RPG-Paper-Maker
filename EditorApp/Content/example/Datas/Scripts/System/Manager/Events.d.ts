import { MapObject } from "../Core/index.js";
import { EventCommand, System } from "../index.js";
/** @class
 *  A static class for some events functions.
 *  @static
 */
declare class Events {
    constructor();
    /**
     *  Get the event command and read json.
     *  @param {Record<string, any>} - json
     *  @returns {EventCommand.Base}
     */
    static getEventCommand(json: Record<string, any>): EventCommand.Base;
    /**
     *  Send an event.
     *  @static
     *  @param {MapObject} sender - The sender of this event
     *  @param {number} targetKind - The kind of target
     *  @param {number} targetID - The target ID
     *  @param {boolean} isSystem - Boolean indicating if it is an event System
     *  @param {number} eventID - The event ID
     *  @param {Parameter[]} parameters - List of all the parameters
     *  @param {boolean} senderNoReceiver - Indicate if the sender should not
     *  receive event
     */
    static sendEvent(sender: MapObject, targetKind: number, targetID: number, isSystem: boolean, eventID: number, parameters: System.DynamicValue[], senderNoReceiver: boolean, onlyTheClosest: boolean): void;
    /**
     *  Send an event detection
     *  @static
     *  @param {MapObject} sender - The sender of this event
     *  @param {number} targetID - The target ID
     *  @param {boolean} isSystem - Boolean indicating if it is an event System
     *  @param {number} eventID - The event ID
     *  @param {Parameter[]} parameters - List of all the parameters
     *  @param {boolean} senderNoReceiver - Indicate if the sender should not
     *  receive event
     */
    static sendEventDetection(sender: MapObject, targetID: number, isSystem: boolean, eventID: number, parameters: System.DynamicValue[], senderNoReceiver?: boolean, onlyTheClosest?: boolean): void;
    /**
     *  Send an event to objects.
     *  @static
     *  @param {MapObject[]} objects - The list of objects to send event
     *  @param {MapObject} sender - The sender of this event
     *  @param {number} targetID - The target ID
     *  @param {boolean} isSystem - Boolean indicating if it is an event System
     *  @param {number} eventID - The event ID
     *  @param {Parameter[]} parameters - List of all the parameters
     *  @param {boolean} senderNoReceiver - Indicate if the sender should not
     *  receive event
     *  @param {boolean} onlyTheClosest
     *  @param {any[][]} closests
     */
    static sendEventObjects(objects: MapObject[], sender: MapObject, targetID: number, isSystem: boolean, eventID: number, parameters: System.DynamicValue[], senderNoReceiver: boolean, onlyTheClosest: boolean, closests: any[][]): void;
}
export { Events };
