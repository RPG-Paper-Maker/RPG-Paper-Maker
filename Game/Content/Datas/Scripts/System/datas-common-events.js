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
//  CLASS CommonEventsDatas
//
//  All the common events datas.
//
//  @eventsSystem      -> List of all the events system
//  @eventsUser        -> List of all the events user
//  @commonReactions   -> List of all the common reactions
//  @commonObjects     -> List of all the common objects
//
// -------------------------------------------------------

/** @class
*   All the battle system datas.
*   @property {SystemEvent[]} eventsSystem List of all the events system.
*   @property {SystemEvent[]} eventsUser List of all the events user.
*   @property {SystemCommonReaction[]} commonReactions List of all the common
*   reactions.
*   @property {SystemObject[]} commonObjects List of all the common objects.
*/
function DatasCommonEvents(){
    this.read();
}

DatasCommonEvents.prototype = {

    /** Read the JSON file associated to common events.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_COMMON_EVENTS, true, function(res){
            var json = JSON.parse(res);
            var i, l;

            // Events
            var jsonEvents = json["eventsSystem"];
            var jsonEvent;
            var event;
            l = jsonEvents.length;
            this.eventsSystem = new Array(l+1);
            for (i = 0; i < l; i++){
                jsonEvent = jsonEvents[i];
                event = new SystemEvent();
                event.readJSON(jsonEvent);
                this.eventsSystem[jsonEvent.id] = event;
            }
            jsonEvents = json["eventsUser"];
            l = jsonEvents.length;
            this.eventsUser = new Array(l+1);
            for (i = 0; i < l; i++){
                jsonEvent = jsonEvents[i];
                event = new SystemEvent();
                event.readJSON(jsonEvent);
                this.eventsUser[jsonEvent.id] = event;
            }

            // Common reactions
            var jsonReactions = json["commonReactors"];
            l = jsonReactions.length;
            this.commonReactions = new Array(l+1);
            for (i = 0; i < l; i++){
                var jsonReaction = jsonReactions[i];
                var reaction = new SystemCommonReaction();
                reaction.readJSON(jsonReaction);
                this.commonReactions[jsonReaction.id] = reaction;
            }

            // Common objects
            var jsonObjects = json["commonObjects"];
            var jsonObject;
            l = jsonObjects.length;

            /* First, we'll need to reorder the json list according to
            inheritance */
            var reorderedList = new Array;
            for (i = 0; i < l; i++){
                jsonObject = jsonObjects[i];
                this.modelReOrder(jsonObject, reorderedList, jsonObjects, l);
            }

            // Now, we can create all the models without problem
            this.commonObjects = new Array(l+1);
            for (i = 0; i < l; i++){
                jsonObject = reorderedList[i];
                var object = new SystemObject();
                object.readJSON(jsonObject);
                this.commonObjects[jsonObject.id] = object;
            }
        });
    },

    // -------------------------------------------------------

    /** Reorder the models in the right order for inheritance.
    *   @param {JSON} jsonObject The json corresponding to the current object
    *   to analyze.
    *   @param {JSON[]} reorderedList The reordered list we are updating.
    *   @param {JSON[]} jsonObjects The brutal JSON list of objects.
    *   @param {number} objectsLength The number of objects to identify.
    */
    modelReOrder: function(jsonObject, reorderedList, jsonObjects,
                           objectsLength)
    {
        if (!jsonObject.hasOwnProperty("stocked")){

            // If id = -1, we can add to the list
            var id = jsonObject.hId;
            if (id !== -1){

                // Search id in the json list
                var inheritedObject;
                for (var j = 0; j < l; j++){
                    inheritedObject = jsonObjects[j];
                    if (inheritedObject.id === id)
                        break;
                }

                // test inheritance for this object
                this.modelReOrder(inheritedObject, reorderedList, jsonObjects,
                                  objectsLength);
            }

            jsonObject.stocked = true;
            reorderedList.push(jsonObject);
        }
    }
}
