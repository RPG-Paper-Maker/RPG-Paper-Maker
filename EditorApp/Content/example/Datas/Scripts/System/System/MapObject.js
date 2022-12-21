/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Datas, System } from "../index.js";
import { Utils } from "../Common/index.js";
/** @class
 *  An object in the map.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  object
 */
class MapObject extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Create a system map object from a model ID.
     *  @static
     *  @param {Record<string, any>} modelID
     *  @param {Record<string, any>} id
     */
    static createFromModelID(modelID, id) {
        let mapObject = new MapObject();
        mapObject.id = id;
        mapObject.name = "";
        mapObject.addDefaultValues();
        mapObject.addInheritanceModel(modelID);
        mapObject.timeEvents = mapObject.getTimeEvents();
        return mapObject;
    }
    /**
     *  Read the JSON associated to the object
     *  @param {Record<string, any>} - json Json object describing the object
     */
    read(json) {
        this.id = json.id;
        this.name = json.name;
        this.isEventFrame = json.ooepf;
        this.canBeTriggeredAnotherObject = Utils.defaultValue(json
            .canBeTriggeredAnotherObject, true);
        this.addDefaultValues();
        this.addInheritanceModel(json.hId);
        // States
        let jsonList = Utils.defaultValue(json.states, []);
        let jsonElement, id, j, m, i, l;
        for (i = 0, l = jsonList.length; i < l; i++) {
            jsonElement = jsonList[i];
            id = jsonElement.id;
            for (j = 0, m = this.states.length; j < m; j++) {
                if (this.states[j].id === id) {
                    break;
                }
            }
            this.states[j] = new System.State(jsonElement);
        }
        // Properties
        jsonList = Utils.defaultValue(json.p, []);
        let property;
        for (i = 0, l = jsonList.length; i < l; i++) {
            jsonElement = jsonList[i];
            property = new System.Property(jsonElement);
            id = property.id;
            for (j = 0, m = this.properties.length; j < m; j++) {
                if (this.properties[j].id === id) {
                    break;
                }
            }
            this.properties[j] = property;
        }
        // Events
        jsonList = Utils.defaultValue(json.events, []);
        let event, list;
        for (i = 0, l = jsonList.length; i < l; i++) {
            jsonElement = jsonList[i];
            event = new System.Event(jsonElement);
            if (this.events.hasOwnProperty(event.idEvent)) {
                list = this.events[event.idEvent];
                for (j = 0, m = list.length; j < m; j++) {
                    if (list[j].isEqual(event)) {
                        break;
                    }
                }
                if (j < list.length) {
                    list[j].addReactions(event.reactions);
                }
                else {
                    list.push(event);
                }
            }
            else {
                this.events[event.idEvent] = [event];
            }
        }
        this.timeEvents = this.getTimeEvents();
    }
    /**
     *  Add default values.
     */
    addDefaultValues() {
        this.states = [];
        this.properties = [];
        this.events = {};
    }
    /**
     *  Add inheritance values according to a model ID.
     *  @param {number} modelID
     */
    addInheritanceModel(modelID) {
        if (modelID !== -1) {
            let inheritedObject = Datas.CommonEvents.getCommonObject(modelID);
            // Only one event per frame inheritance is a priority
            this.isEventFrame = inheritedObject.isEventFrame;
            this.canBeTriggeredAnotherObject = inheritedObject.canBeTriggeredAnotherObject;
            // States
            let states = Utils.defaultValue(inheritedObject.states, []);
            let i, l;
            for (i = 0, l = states.length; i < l; i++) {
                this.states.push(states[i]);
            }
            // Properties
            let properties = Utils.defaultValue(inheritedObject.properties, []);
            for (i = 0, l = properties.length; i < l; i++) {
                this.properties.push(properties[i]);
            }
            // Events
            let events = inheritedObject.events;
            let eventsList, realEventsList;
            for (let idEvent in events) {
                eventsList = events[idEvent];
                realEventsList = new Array;
                for (i = 0, l = eventsList.length; i < l; i++) {
                    realEventsList.push(eventsList[i]);
                }
                this.events[idEvent] = realEventsList;
            }
        }
    }
    /**
     *  Get all the time events.
     *  @returns {System.Event[]}
     */
    getTimeEvents() {
        let completeList = this.events[1];
        let list = [];
        if (completeList) {
            let event;
            for (let i = 0, l = completeList.length; i < l; i++) {
                event = completeList[i];
                if (event.isSystem) {
                    list.push(event);
                }
            }
        }
        return list;
    }
    /**
     *  Get the reactions corresponding to a given event and parameters.
     *  @param {boolean} isSystem - Boolean indicating if it is an event System
     *  @param {number} idEvent - ID of the event
     *  @param {number} state - The ID of the state
     *  @param {System.DynamicValue[]} parameters - List of all the parameters
     *  @returns {System.Reaction[]}
     */
    getReactions(isSystem, idEvent, state, parameters) {
        let events = this.events[idEvent];
        let reactions = [];
        if (!Utils.isUndefined(events)) {
            let test, event, j, m, reaction;
            for (let i = 0, l = events.length; i < l; i++) {
                test = true;
                event = events[i];
                if (event.isSystem === isSystem) {
                    for (j = 1, m = parameters.length; j < m; j++) {
                        if (!event.parameters[j].value.isEqual(parameters[j])) {
                            test = false;
                            break;
                        }
                    }
                    if (test) {
                        reaction = events[i].reactions[state];
                        if (reaction) {
                            reactions.push(reaction);
                        }
                    }
                }
            }
        }
        return reactions;
    }
}
export { MapObject };
