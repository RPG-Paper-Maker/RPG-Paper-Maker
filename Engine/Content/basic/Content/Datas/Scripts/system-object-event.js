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
//  CLASS SystemObjectEvent
//
// -------------------------------------------------------

/** @class
*   An event that an object can react on.
*   @property {boolean} isSystem Boolean indicating if it is an event system.
*   @property {number} idEvent ID of the event.
*   @property {SystemValue[]} parameters All the parameters values.
*   @property {SystemReaction[]} reactions List of all the reactions according
*   to states id.
*/
function SystemObjectEvent(){

}

SystemObjectEvent.prototype = {

    /** Read the JSON associated to the object event.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        var i, l, id, idState;

        this.isSystem = json.sys;
        this.idEvent = json.id;

        // Parameters
        var listEvents = this.isSystem ?
                    $datasGame.commonEvents.eventsSystem
                  : $datasGame.commonEvents.eventsUser;
        this.parameters =
             SystemParameter.readParametersWithDefault(
                 json, listEvents[this.idEvent].parameters);

        // Reactions
        var jsonReactions = json["r"];
        this.reactions = {};
        for (idState in jsonReactions){
            var jsonReaction = jsonReactions[idState];
            var reaction = new SystemObjectReaction();
            reaction.readJSON(jsonReaction);
            this.reactions[idState] = reaction;
        }
    },

    // -------------------------------------------------------

    /** Check if this event is equal to another.
    *   @param {SystemObjectEvent} event The event to compare.
    *   @returns {boolean}
    */
    isEqual: function(event){
        if (this.isSystem !== event.isSystem || this.idEvent !== event.idEvent)
            return false;

        for (var i = 1, l = this.parameters.length; i < l; i++){
            if (!this.parameters[i].isEqual(event.parameters[i]))
                return false;
        }

        return true;
    },

    // -------------------------------------------------------

    /** Add reactions to the event.
    *   @param {Object} reactions The reactions to add.
    */
    addReactions: function(reactions){
        for (var idState in reactions){
            this.reactions[idState] = reactions[idState];
        }
    }
}
