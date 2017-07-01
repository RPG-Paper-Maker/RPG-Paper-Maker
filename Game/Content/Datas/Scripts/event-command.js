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

/**
*   Enum for the different event commands kind.
*   @enum {number}
*   @readonly
*/
var EventCommandKind = {
    None: 0,
    ShowText: 1,
    ChangeVariables: 2,
    EndGame: 3,
    While: 4,
    EndWhile: 5,
    WhileBreak: 6,
    InputNumber: 7,
    If: 8,
    Else: 9,
    EndIf: 10,
    OpenMainMenu: 11,
    OpenSavesMenu: 12,
    ModifyInventory: 13,
    ModifyTeam: 14,
    StartBattle: 15,
    IfWin: 16,
    IfLose: 17,
    ChangeState: 18,
    SendEvent: 19,
    TeleportObject: 20,
    MoveObject: 21,
    Wait: 22
};
Object.freeze(EventCommandKind);

// -------------------------------------------------------
//
//  CLASS EventCommandShowText
//
// -------------------------------------------------------

/** @class
*   An event command for displaying text.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {WindowBox} window Window containins the message to display.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandShowText(command){
    this.message = command[0];
    this.isDirectNode = false;
    this.parallel = false;
    this.window = new WindowBox(10, $SCREEN_Y - 10 - 150, $SCREEN_X - 20, 150,
                                new GraphicText(this.message));
}

EventCommandShowText.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (clicked).
    */
    initialize: function(){
        return {
            clicked: false
        }
    },

    // -------------------------------------------------------

    /** Update and check if the event is finished.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        if (currentState.clicked)
            return 1;

        return 0;
    },

    // -------------------------------------------------------

    /** Update clicked to true.
    *   @param {Object} currentState The current state of the event.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed: function(currentState, key){
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Action))
        {
            currentState.clicked = true;
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},

    /** Draw the dialog box.
    *   @param {Object} currentState The current state of the event.
    *   @param {Canvas.Context} context The context of the canvas.
    */
    drawHUD: function(currentState, context){
        this.window.draw(context);
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeVariables
//
// -------------------------------------------------------

/** @class
*   An event command for changing variables values.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {JSON} command Direct JSON command to parse.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandChangeVariables(command){
    this.command = command;
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandChangeVariables.prototype = {

    initialize: function(){ return null; },

    /** Parse command and change the variable values, and then finish.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){

        // Parsing
        var i = 2;
        var selection = this.command[1];
        var nbSelection = 1;
        if (this.command[0] === 1) nbSelection = this.command[i++] - selection;
        var operation = this.command[i++];
        var value = 0;
        var valueType = this.command[i++];
        switch(valueType){
            case 0: // Random number
                var range1 = this.command[i++];
                var range2 = this.command[i++];
                value = parseInt(Math.random() * (range2-range1+1) + range1);
                break;
        }

        // Changing variable(s)
        for (i = 0; i < nbSelection; i++){
            $game.variables[selection + i] = value;
        }

        // End of command
        return 1;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandEndGame
//
// -------------------------------------------------------

/** @class
*   An event command for ending the game.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandEndGame(command){
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandEndGame.prototype = {

    initialize: function(){ return null; },

    /** Quit the game.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        quit();
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandWhile
//
// -------------------------------------------------------

/** @class
*   An event command for loop event command block.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandWhile(command){
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandWhile.prototype = {

    initialize: function(){ return null; },

    /** Go inside the loop block.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        return -1;
    },

    // -------------------------------------------------------

    goToNextCommand : function(){ return 2; },
    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandWhileBreak
//
// -------------------------------------------------------

/** @class
*   An event command for leaving while event command.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandWhileBreak(command){
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandWhileBreak.prototype = {

    initialize: function(){ return null; },

    /** Go outside the loop block.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){ return -2; },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandInputNumber
//
// -------------------------------------------------------

/** @class
*   An event command for entering a number inside a variable.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {number} id Id of the variable.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandInputNumber(command){
    this.id = parseInt(command[0]);
    this.isDirectNode = false;
    this.parallel = false;
}

EventCommandInputNumber.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (entered, confirmed).
    */
    initialize: function(){
        return {
            entered: "",
            confirmed: false
        }
    },

    // -------------------------------------------------------

    /** Finish after confirmation.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        if (currentState.confirmed){
            $datasGame.variables[this.id] = currentState.entered;
            return 1;
        }

        return 0;
    },

    // -------------------------------------------------------

    /** Update confirmed to true, or update text entered.
    *   @param {Object} currentState The current state of the event.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed: function(currentState, key){
        if (key === KeyEvent.DOM_VK_ENTER)
            currentState.confirmed = true;
        else{
            if (KeyEvent.isKeyNumberPressed(key))
                currentState.entered += KeyEvent.getKeyChar(key);
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},

    /** Draw number entered.
    *   @param {Object} currentState The current state of the event.
    *   @param {Canvas.Context} context The context of the canvas.
    */
    drawHUD: function(currentState, context){
        context.fillText(currentState.entered, $canvasWidth / 2,
                         $canvasHeight / 2);
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandIf
//
// -------------------------------------------------------

/** @class
*   An event command for condition event command block.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {boolean} hasElse Boolean indicating if there an else node or not.
*   @property {JSON} command Direct JSON command to parse.
*/
function EventCommandIf(command){
    this.hasElse = command[0] === 1;
    command.shift();
    this.command = command;
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandIf.prototype = {

    initialize: function(){ return null; },

    getBool: function(){

        // Parsing
        var i = 0;
        var page = this.command[i++];
        switch (page){
        case 0:
            return this.getBoolVariable(i);
        }

        return false;
    },

    getBoolSwitch: function(i){
        var idSwitch = this.command[i++];
        var value = (this.command[i++] === 0);
        return $datasGame.listSwitches[idSwitch] === value;
    },

    getBoolVariable: function(i){
        var idVar = this.command[i++];
        var operation = this.command[i++];
        var varConstType = this.command[i++];
        var compare = this.command[i++];

        var value = (varConstType === 0) ? $game.variables[compare]
                                         : compare;
        return $operators_compare[operation]($game.variables[idVar],
                                             value);
    },

    /** Check where to go according to the condition.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        var result = this.getBool();

        if (result) return -1;
        else return 1 + (this.hasElse ? 0 : 1);
    },

    // -------------------------------------------------------

    /** Returns the number of node to pass.
    *   @returns {number}
    */
    goToNextCommand : function(){
        return 2 + (this.hasElse ? 1 : 0);
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandElse
//
// -------------------------------------------------------

/** @class
*   An event command for condition else event command block.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandElse(command){
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandElse.prototype = {

    initialize: function(){ return null; },

    /** Go inside the else block.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        return -1;
    },

    // -------------------------------------------------------

    /** Returns the number of node to pass.
    *   @returns {number}
    */
    goToNextCommand : function(){
        return 2;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandOpenMainMenu
//
// -------------------------------------------------------

/** @class
*   An event command for opening the main menu.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandOpenMainMenu(command){
    this.isDirectNode = false;
    this.parallel = false;
}

EventCommandOpenMainMenu.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (opened).
    */
    initialize: function(){
        return {
            opened: false
        }
    },

    // -------------------------------------------------------

    /** Open the menu.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        if (currentState.opened)
            return 1;
        $gameStack.push(new SceneMenu());
        currentState.opened = true;

        return 0;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandOpenSavesMenu
//
// -------------------------------------------------------

/** @class
*   An event command for opening the saves menu.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandOpenSavesMenu(command){
    this.isDirectNode = false;
    this.parallel = false;
}

EventCommandOpenSavesMenu.prototype = {

    /** Initialize the current state.
    *   @returns {Object} The current state (opened).
    */
    initialize: function(){
        return {
            opened: false
        }
    },

    // -------------------------------------------------------

    /** Open the menu.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){
        if (currentState.opened)
            return 1;
        $gameStack.push(new SceneSaveGame());
        currentState.opened = true;

        return 0;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandModifyInventory
//
// -------------------------------------------------------

/** @class
*   An event command for modifying the inventory.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {JSON} command Direct JSON command to parse.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandModifyInventory(command){
    this.command = command;
    this.isDirectNode = true;
    this.parallel = false;
}

EventCommandModifyInventory.prototype = {

    initialize: function(){ return null; },

    /** Modify items only if already in inventory
    *   @param {ItemKind} kind The kind of item.
    *   @param {number} id ID of the item.
    *   @param {number} nb Number of item to modify.
    *   @param {function} callback callback function for action.
    *   @returns {boolean} Indicates if the item is already inside the
    *   inventory.
    */
    modifyItems: function(kind, id, nb, callback){
        var i, l = $game.items.length;
        for (i = 0; i < l; i++){
            var item = $game.items[i];
            if (item.k === kind && item.id === id){

                // If the item already is in the inventory...
                callback.call(this, item, i);
                return true;
            }
        }

        return false;
    },

    // -------------------------------------------------------

    /** Modify the number of the item.
    *   @param {ItemKind} kind The kind of item.
    *   @param {number} id ID of the item.
    *   @param {number} nb Number of item to modify.
    */
    equalItems: function(kind, id, nb){
        var alreadyInInventory = this.modifyItems(kind, id, nb,
                                                  function(item,index){
                                                      item.nb = nb;
                                                  });
        if (!alreadyInInventory)
            $game.items.push(new Item(kind,id,nb));
    },

    // -------------------------------------------------------

    /** Add the number of the item.
    *   @param {ItemKind} kind The kind of item.
    *   @param {number} id ID of the item.
    *   @param {number} nb Number of item to modify.
    */
    addItems: function(kind, id, nb){
        var alreadyInInventory = this.modifyItems(kind, id, nb,
                                                  function(item,index){
                                                      item.nb += nb;
                                                  });
        if (!alreadyInInventory)
            $game.items.push(new GameItem(kind, id, nb));
    },

    // -------------------------------------------------------

    /** Remove the number of the item.
    *   @param {ItemKind} kind The kind of item.
    *   @param {number} id ID of the item.
    *   @param {number} nb Number of item to modify.
    */
    removeItems: function(kind, id, nb){
        var alreadyInInventory = this.modifyItems(kind, id, nb,
        function(item,index){
            item.nb -= nb;
            if (item.nb <= 0)
                $game.items.splice(index, 1);
        });
    },

    // -------------------------------------------------------

    /** Multiply the number of the item.
    *   @param {ItemKind} kind The kind of item.
    *   @param {number} id ID of the item.
    *   @param {number} nb Number of item to modify.
    */
    multItems: function(kind, id, nb){
        this.modifyItems(kind, id, nb, function(item,index){ item.nb *= nb; });
    },

    // -------------------------------------------------------

    /** Modify the number of the item.
    *   @param {ItemKind} kind The kind of item.
    *   @param {number} id ID of the item.
    *   @param {number} nb Number of item to modify.
    */
    divItems: function(kind, id, nb){
        this.modifyItems(kind, id, nb, function(item,index){ item.nb /= nb; });
    },

    /** Modulo the number of the item.
    *   @param {ItemKind} kind The kind of item.
    *   @param {number} id ID of the item.
    *   @param {number} nb Number of item to modify.
    */
    moduloItems: function(kind, id, nb){
        this.modifyItems(kind, id, nb, function(item,index){ item.nb %= nb; });
    },

    // -------------------------------------------------------

    /** Update the inventory and finish.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){

        // Parsing
        var i = 0;
        var itemKind = this.command[i++];
        var itemId = this.command[i++];
        var operation = this.command[i++];
        var varConstType = this.command[i++];
        var compare = this.command[i++];
        var value = (varConstType === 0) ? $datasGame.variables[compare]
                                         : compare;

        // Doing the coresponding operation
        switch(operation){
        case 0:
            this.equalItems(itemKind, itemId, value); break;
        case 1:
            this.addItems(itemKind, itemId, value); break;
        case 2:
            this.removeItems(itemKind, itemId, value); break;
        case 3:
            this.multItems(itemKind, itemId, value); break;
        case 4:
            this.divItems(itemKind, itemId, value); break;
        case 5:
            this.moduloItems(itemKind, itemId, value); break;
        }

        return 1;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandModifyTeam
//
// -------------------------------------------------------

/** @class
*   An event command for modifying team.
*   @property {boolean} isDirectNode Indicates if this node is directly
*   going to the next node (takes only one frame).
*   @property {JSON} command Direct JSON command to parse.
*   @param {JSON} command Direct JSON command to parse.
*/
function EventCommandModifyTeam(command){
    this.command = command;
    this.isDirectNode = true;
    this.parallel = false;
}

/** Instanciate a new character in a group.
*   @static
*   @param {GroupKind} where In which group we should instanciate.
*   @param {CharacterKind} type The type of character to instanciate.
*   @param {number} id The ID of the character to instanciate.
*   @param {number} stockId The ID of the variable where we will stock the
*   instantiate ID.
*/
EventCommandModifyTeam.instanciateTeam = function(where, type, id, level,
                                                  stockId)
{

    // Stock the instanciation id in a variable
    $game.variables[stockId] = $game.charactersInstances;

    // Adding the instanciated character in the right group
    var player = new GamePlayer(type, id, $game.charactersInstances++, []);
    player.instanciate(level);
    var group;
    switch(where){
    case 0: group = $game.teamHeroes; break;
    case 1: group = $game.reserveHeroes; break;
    case 2: group = $game.hiddenHeroes; break;
    }

    group.push(player);
};

EventCommandModifyTeam.prototype = {

    initialize: function(){ return null; },

    /** Add or remove a character in a group.
    *   @param {CharacterKind} kind The type of character to instanciate.
    *   @param {number} id The ID of the character to instanciate.
    *   @param {GroupKind} where In which group we should instanciate.
    */
    addRemove: function(kind, id, where){
        // Serching for the id
        var groups = [$game.teamHeroes, $game.reserveHeroes,
                      $game.hiddenHeroes];
        var group = null;
        var player;
        var i, j, l, ll;
        for (i = 0, l = groups.length; i < l; i++){
            var g = groups[i];
            for (j = 0, ll = g.length; j < ll; j++){
                player = g[j];
                if (player.instid === id){
                    group = g;
                    break;
                }
            }
            if (group !== null) break;
        }

        if (group !== null){
            group.splice(j, 1);
            if (kind === 0) groups[where].push(player);
        }
    },

    // -------------------------------------------------------

    /** Parsing, modifying the team and finishing.
    *   @param {Object} currentState The current state of the event.
    *   @param {MapObject} object The current object reacting.
    *   @param {number} state The state ID.
    *   @returns {number} The number of node to pass.
    */
    update: function(currentState, object, state){

        // Parsing
        var i = 0;
        var addingKind = this.command[i++];

        switch (addingKind){
        case 0: // If create new instance
            var instanceLevel = this.command[i++];
            var instanceTeam = this.command[i++];
            var stockVariableId = this.command[i++];
            var instanceKind = this.command[i++];
            var instanceId = this.command[i++];
            EventCommandModifyTeam.instanciateTeam(
                        instanceTeam, instanceKind, instanceId, instanceLevel,
                        stockVariableId);
            break;
        case 1:
            var addRemoveKind = this.command[i++];
            var varConstType = this.command[i++];
            var compare = this.command[i++];
            var addRemoveId =
                    (varConstType === 0) ? $game.variables[compare]
                                         : compare;
            var addRemoveTeam = this.command[i++];
            this.addRemove(addRemoveKind, addRemoveId, addRemoveTeam);
            break;
        }

        return 1;
    },

    // -------------------------------------------------------

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}
