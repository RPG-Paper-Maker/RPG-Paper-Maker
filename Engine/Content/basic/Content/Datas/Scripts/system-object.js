/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS SystemObject
//
// -------------------------------------------------------

/** @class
*   An object.
*   @property {number} id The ID of the object.
*   @property {SystemObjectState[]} states List of all the possible states of
*   the object.
*   @property {SystemObjectEvent[]} events List of all the event that the object
*   can react on.
*/
function SystemObject(){

}

SystemObject.prototype = {

    /** Read the JSON associated to the object.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        var i, j, l, ll, id, hId;
        var jsonStates, jsonState, jsonEvents, jsonEvent;

        this.id = json.id;
        this.states = new Array;
        this.events = {};

        hId = json.hId;
        if (hId !== -1){
            var inheritedObject = $datasGame.commonEvents.commonObjects[hId];

            // States
            var states = inheritedObject.states;
            l = states.length;
            for (i = 0; i < l; i++){
                this.states.push(states[i]);
            }

            // Events
            var events = inheritedObject.events;
            for (var idEvent in events){
                var eventsList = events[idEvent];
                var realEventsList = new Array;
                for (i = 0, l = eventsList.length; i < l; i++){
                    realEventsList.push(eventsList[i]);
                }
                this.events[idEvent] = realEventsList;
            }
        }

        // States
        jsonStates = json.states;
        l = jsonStates.length;
        for (i = 0; i < l; i++){
            jsonState = jsonStates[i];
            id = jsonState.id;
            for (j = 0, ll = this.states.length; j < ll; j++){
                if (this.states[j].id === id)
                    break;
            }
            var state = new SystemObjectState();
            state.readJSON(jsonState);
            this.states[j] = state;
        }

        // Events
        jsonEvents = json.events;
        l = jsonEvents.length;
        for (i = 0; i < l; i++){
            jsonEvent = jsonEvents[i];
            var event = new SystemObjectEvent();
            event.readJSON(jsonEvent);

            if (this.events.hasOwnProperty(event.idEvent)){
                var list = this.events[event.idEvent];
                for (j = 0, ll = list.length; j < ll; j++){
                    if (list[j].isEqual(event))
                        break;
                }
                if (j < list.length){
                    list[j].addReactions(event.reactions);
                }
                else
                    list.push(event);
            }
            else
                this.events[event.idEvent] = [event];
        }
    },

    // -------------------------------------------------------

    /** Get the reactions corresponding to a given event and parameters.
    *   @param {boolean} isSystem Boolean indicating if it is an event system.
    *   @param {number} idEvent ID of the event.
    *   @param {number} state The ID of the state.
    *   @param {SystemValue[]} parameters List of all the parameters.
    */
    getReactions: function(isSystem, idEvent, state, parameters){
        var i, j, l, ll, test;
        var reactions = [];
        var events = this.events[idEvent];
        var event;

        for (i = 0, l = events.length; i < l; i++){
            test = true;
            event = events[i];
            for (j = 1, ll = parameters.length; j < ll; j++){
                if (!event.parameters[j].value.isEqual(parameters[j])){
                    test = false;
                    break;
                }
            }

            if (test)
                reactions.push(events[i].reactions[state]);
        }

        if (reactions.length >0){
            var a = 0;
            a = 1;
        }

        return reactions;
    }
}
