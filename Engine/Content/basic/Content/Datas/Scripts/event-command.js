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

var EventCommandKind = Object.freeze(
    {
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
        ChangeSwitches: 11,
        OpenMainMenu: 12,
        OpenSavesMenu: 13,
        ModifyInventory: 14,
        ModifyTeam: 15,
        StartBattle: 16,
        IfWin: 17,
        IfLose: 18,
        ChangeState: 19,
        SendEvent: 20,
        TeleportObject: 21,
        MoveObject: 22
    }
)

// -------------------------------------------------------
//
//  CLASS EventCommandShowText
//
//  An event command for displaying text.
//
//  @message -> Message to display.
//
// -------------------------------------------------------

function EventCommandShowText(command){
    this.message = command[0];
    this.isDirectNode = false;
    this.window = new WindowBox(10, $SCREEN_Y - 10 - 150, $SCREEN_X - 20, 150,
                                new GraphicText(this.message));
}

EventCommandShowText.prototype = {

    initialize: function(){
        return {
            clicked: false
        }
    },

    update: function(currentState, object, state){
        if (currentState.clicked)
            return 1;

        return 0;
    },

    onKeyPressed: function(currentState, key){
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Action))
        {
            currentState.clicked = true;
        }
    },

    onKeyReleased: function(currentState, key){},

    onKeyPressedRepeat: function(currentState, key){ return true; },

    onKeyPressedAndRepeat: function(currentState, key){},

    drawHUD: function(currentState, context){
        this.window.draw(context);
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeVariables
//
//  An event command for changing variables values.
//
//  @command -> Command.
//
// -------------------------------------------------------

function EventCommandChangeVariables(command){
    this.command = command;
    this.isDirectNode = true;
}

EventCommandChangeVariables.prototype = {

    initialize: function(){ return null; },

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
            $datasGame.listVariables[selection + i] = value;
        }

        // End of command
        return 1;
    },

    onKeyPressed: function(currentState, key){},

    onKeyReleased: function(currentState, key){},

    onKeyPressedRepeat: function(currentState, key){ return true; },

    onKeyPressedAndRepeat: function(currentState, key){},

    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeSwitches
//
//  An event command for changing switches values.
//
//  @command -> Command.
//
// -------------------------------------------------------

function EventCommandChangeSwitches(command){
    this.command = command;
    this.isDirectNode = true;
}

EventCommandChangeSwitches.prototype = {

    initialize: function(){ return null; },

    update: function(currentState, object, state){

        // Parsing
        var i = 2;
        var selection = this.command[1];
        var nbSelection = 1;
        if (this.command[0] === 1) nbSelection = this.command[i++] - selection;
        var operation = this.command[i++];
        var value = true;
        switch(operation){
            case 0: // ON
                value = true;
                break;
            case 1: // OFF
                value = false;
                break;
        }

        // Changing switch(es)
        for (i = 0; i < nbSelection; i++){
             // INVERT
            if(operation === 2){
                $datasGame.listSwitches[selection + i] =
                        !$datasGame.listSwitches[selection + i];
            }
            else
                $datasGame.listSwitches[selection + i] = value;
        }

        // End of command
        return 1;
    },

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
//  An event command for ending the game.
//
// -------------------------------------------------------

function EventCommandEndGame(command){
    this.isDirectNode = true;
}

EventCommandEndGame.prototype = {
    initialize: function(){ return null; },
    update: function(currentState, object, state){ quit(); },
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
//  An event command for loop event command block.
//
// -------------------------------------------------------

function EventCommandWhile(command){
    this.isDirectNode = true;
}

EventCommandWhile.prototype = {
    initialize: function(){ return null; },
    update: function(currentState, object, state){ return -1; },
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
//  An event command for leaving while event command.
//
// -------------------------------------------------------

function EventCommandWhileBreak(command){
    this.isDirectNode = true;
}

EventCommandWhileBreak.prototype = {
    initialize: function(){ return null; },
    update: function(currentState, object, state){ return -2; },
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
//  An event command for entering a number inside a variable.
//
//  @id -> Id of the variable.
//
// -------------------------------------------------------

function EventCommandInputNumber(command){
    this.id = parseInt(command[0]);
    this.isDirectNode = false;
}

EventCommandInputNumber.prototype = {

    initialize: function(){
        return {
            entered: "",
            confirmed: false
        }
    },

    update: function(currentState, object, state){
        if (currentState.confirmed){
            $datasGame.listVariables[this.id] = currentState.entered;
            return 1;
        }

        return 0;
    },

    onKeyPressed: function(currentState, key){
        if (key === KeyEvent.DOM_VK_ENTER)
            currentState.confirmed = true;
        else{
            if (KeyEvent.isKeyNumberPressed(key))
                currentState.entered += KeyEvent.getKeyChar(key);
        }
    },

    onKeyReleased: function(currentState, key){},

    onKeyPressedRepeat: function(currentState, key){ return true; },

    onKeyPressedAndRepeat: function(currentState, key){},

    drawHUD: function(currentState, context){
        context.fillText(currentState.entered, $canvasWidth / 2,
                         $canvasHeight / 2);
    }
}

// -------------------------------------------------------
//
//  CLASS EventCommandIf
//
//  An event command for condition event command block.
//
//  @hasElse  -> Boolean indicating if there an else node or not.
//  @command -> Command.
//
// -------------------------------------------------------

function EventCommandIf(command){
    this.hasElse = command[0] === 1;
    command.shift();
    this.command = command;
    this.isDirectNode = true;
}

EventCommandIf.prototype = {
    initialize: function(){ return null; },

    getBool: function(){
        // Parsing
        var i = 0;
        var page = this.command[i++];
        var type = this.command[i++];
        switch (page){
        case 0:
            switch (type){
            case 0:
                return this.getBoolSwitch(i);
            case 2:
                return this.getBoolVariable(i);
            }
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

        var value = (varConstType === 0) ? $datasGame.listVariables[compare]
                                         : compare;
        return $operators_compare[operation]($datasGame.listVariables[idVar],
                                             value);
    },

    update: function(currentState, object, state){
        var result = this.getBool();

        if (result) return -1;
        else return 1 + (this.hasElse ? 0 : 1);
    },

    goToNextCommand : function(){
        return 2 + (this.hasElse ? 1 : 0);
    },

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
//  An event command for condition else event command block.
//
// -------------------------------------------------------

function EventCommandElse(command){
    this.isDirectNode = true;
}

EventCommandElse.prototype = {
    initialize: function(){ return null; },
    update: function(currentState, object, state){ return -1; },
    goToNextCommand : function(){
        return 2;
    },
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
//  An event command for opening the main menu.
//
// -------------------------------------------------------

function EventCommandOpenMainMenu(command){
    this.isDirectNode = false;
}

EventCommandOpenMainMenu.prototype = {
    initialize: function(){
        return {
            opened: false
        }
    },

    update: function(currentState, object, state){
        if (currentState.opened) return 1;
        $gameStack.push(new SceneMenu());
        currentState.opened = true;

        return 0;
    },

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
//  An event command for opening the main menu.
//
// -------------------------------------------------------

function EventCommandOpenSavesMenu(command){
    this.isDirectNode = false;
}

EventCommandOpenSavesMenu.prototype = {
    initialize: function(){
        return {
            opened: false
        }
    },

    update: function(currentState, object, state){
        if (currentState.opened) return 1;
        $gameStack.push(new SceneSaveGame());
        currentState.opened = true;

        return 0;
    },

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
//  An event command for modifying the inventory.
//
//  @command    -> command
//
// -------------------------------------------------------

function EventCommandModifyInventory(command){
    this.command = command;
    this.isDirectNode = true;
}

EventCommandModifyInventory.prototype = {

    initialize: function(){ return null; },

    // -------------------------------------------------------

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

    equalItems: function(kind, id, nb){
        var alreadyInInventory = this.modifyItems(kind, id, nb,
                                                  function(item,index){
                                                      item.nb = nb;
                                                  });
        if (!alreadyInInventory)
            $game.items.push(new Item(kind,id,nb));
    },

    // -------------------------------------------------------

    addItems: function(kind, id, nb){
        var alreadyInInventory = this.modifyItems(kind, id, nb,
                                                  function(item,index){
                                                      item.nb += nb;
                                                  });
        if (!alreadyInInventory)
            $game.items.push(new GameItem(kind, id, nb));
    },

    // -------------------------------------------------------

    removeItems: function(kind, id, nb){
        var alreadyInInventory = this.modifyItems(kind, id, nb,
        function(item,index){
            item.nb -= nb;
            if (item.nb <= 0)
                $game.items.splice(index, 1);
        });
    },

    // -------------------------------------------------------

    multItems: function(kind, id, nb){
        this.modifyItems(kind, id, nb, function(item,index){ item.nb *= nb; });
    },

    // -------------------------------------------------------

    divItems: function(kind, id, nb){
        this.modifyItems(kind, id, nb, function(item,index){ item.nb /= nb; });
    },

    // -------------------------------------------------------

    moduloItems: function(kind, id, nb){
        this.modifyItems(kind, id, nb, function(item,index){ item.nb %= nb; });
    },

    // -------------------------------------------------------

    update: function(currentState, object, state){

        // Parsing
        var i = 0;
        var itemKind = this.command[i++];
        var itemId = this.command[i++];
        var operation = this.command[i++];
        var varConstType = this.command[i++];
        var compare = this.command[i++];
        var value = (varConstType === 0) ? $datasGame.listVariables[compare]
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
//  An event command for modifying team.
//
//  @command    -> command
//
// -------------------------------------------------------

function EventCommandModifyTeam(command){
    this.command = command;
    this.isDirectNode = true;
}

EventCommandModifyTeam.instanciateTeam = function(where, type, id, level,
                                                  stockId)
{

    // Stock the instanciation id in a variable
    $game.listVariables[stockId] = $game.charactersInstances;

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

    // -------------------------------------------------------

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
                    (varConstType === 0) ? $game.listVariables[compare]
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

// -------------------------------------------------------
//
//  CLASS EventCommandStartBattle
//
//  An event command for battle processing.
//
//  @canEscape    -> Boolean indicating if the player can escape this battle.
//  @canGameOver  -> Boolean indicating if there a win/lose node or not.
//  @command      -> Command.
//
// -------------------------------------------------------

function EventCommandStartBattle(command){
    this.canEscape = command[0] === 1;
    this.canGameOver = command[1] === 1;
    command.shift();
    command.shift();
    this.command = command;
    this.isDirectNode = false;
}

EventCommandStartBattle.prototype = {
    initialize: function(){
        return {
            sceneBattle: null
        };
    },

    update: function(currentState, object, state){

        // Initializing battle
        if (currentState.sceneBattle === null){
            var i = 0;
            var type = this.command[i++];

            // Getting the troop ID
            var troopId;
            switch(type){
            case 0: // If only selecting a troop ID with comboBox
                troopId = this.command[i++];
                break;
            case 1: // If only selecting a troop ID with variable or constant
                var varConstType = this.command[i++];
                var varConstVal = this.command[i++];
                troopId =
                        (varConstType === 0) ? $game.listVariables[varConstVal]
                                             : varConstVal;
                break;
            case 2: // If random troop in map properties
                // TODO
            }

            // Defining the battle state instance
            var sceneBattle = new SceneBattle(troopId, this.canGameOver,
                                              this.canEscape);
             // Keep instance of battle state for results
            currentState.sceneBattle = sceneBattle;
            $gameStack.push(sceneBattle);

            return 0; // Stay on this command as soon as we are in battle state
        }

        // After the battle...
        var result = 1;
        // If there are not game overs, go to win/lose nodes
        if (!this.canGameOver){
            if (!currentState.sceneBattle.winning)
                result = 2;
        }

        return result;
    },

    onKeyPressed: function(currentState, key){},

    onKeyReleased: function(currentState, key){},

    onKeyPressedRepeat: function(currentState, key){ return true; },

    onKeyPressedAndRepeat: function(currentState, key){},

    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandIfWin
//
//  An event command for after a battle winning.
//
// -------------------------------------------------------

function EventCommandIfWin(command){
    this.isDirectNode = true;
}

EventCommandIfWin.prototype = {
    initialize: function(){ return null; },
    update: function(currentState, object, state){ return -1; },
    goToNextCommand : function(){
        return 3;
    },
    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandIfLose
//
//  An event command for after a battle winning.
//
// -------------------------------------------------------

function EventCommandIfLose(command){
    this.isDirectNode = true;
}

EventCommandIfLose.prototype = {
    initialize: function(){ return null; },
    update: function(currentState, object, state){ return -1; },
    goToNextCommand : function(){
        return 2;
    },
    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandChangeState
//
//  An event command for changing an object state.
//
//  @idState        -> The ID of the state to change
//  @operationKind  -> Index of operation
//
// -------------------------------------------------------

function EventCommandChangeState(command){

    // Parsing
    var i = 1;
    this.idState = command[i++];
    this.operationKind = command[i++];

    this.isDirectNode = true;
}

EventCommandChangeState.addState = function(portionDatas, index, state){
    var states = portionDatas.s[index];

    if (states.indexOf(state) === -1)
        states.unshift(state);

    EventCommandChangeState.removeFromDatas(portionDatas, index, states);
}

EventCommandChangeState.removeState = function(portionDatas, index, state){
    var states = portionDatas.s[index];

    var indexState = states.indexOf(state);
    if (states.indexOf(state) !== -1)
        states.splice(indexState, 1);

    EventCommandChangeState.removeFromDatas(portionDatas, index, states);
}

EventCommandChangeState.removeAll = function(portionDatas, index){
    portionDatas.s[index] = [];
}

EventCommandChangeState.removeFromDatas = function(portionDatas, index, states){
    if (states.length === 1 && states[0] === 1){
        portionDatas.si.splice(index, 1);
        portionDatas.s.splice(index, 1);
    }
}

EventCommandChangeState.prototype = {
    initialize: function(){ return null; },

    update: function(currentState, object, state){
        var portion = $gameStack.top().allObjects[object.system.id];
        var portionDatas = $game.mapsDatas[$gameStack.top().id]
                [portion[0]][portion[1]][portion[2]];
        var indexState = portionDatas.si.indexOf(object.system.id);
        if (indexState === -1){
            indexState = 0;
            portionDatas.si.unshift(object.system.id);
            portionDatas.s.unshift([1]);
        }

        switch(this.operationKind){
        case 0: // Replacing
            EventCommandChangeState.removeAll(portionDatas, indexState);
            EventCommandChangeState.addState(portionDatas, indexState,
                                             this.idState);
            break;
        case 1: // Adding
            EventCommandChangeState.addState(portionDatas, indexState,
                                             this.idState);
            break;
        case 2: // Deleting
            EventCommandChangeState.removeState(portionDatas, indexState,
                                                this.idState);
            break;
        }

        return 1;
    },

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}

// -------------------------------------------------------
//
//  CLASS EventCommandSendEvent
//
//  An event command for sending an event.
//
//  @targetKind  -> Kind of target
//  @idTarget    -> ID of target
//  @isSystem    -> Boolean indicating if it is an event system.
//  @eventId     -> ID of the event
//  @parameters  -> List of all the parameters
//
// -------------------------------------------------------

function EventCommandSendEvent(command){

    // Target
    var i = 0, j = 0;
    var l = command.length;
    this.targetKind = command[i++];
    switch(this.targetKind){
    case 1:
    case 2:
        this.idTarget = command[i++];
        break;
    }

    this.isSystem = command[i++] === "1";
    this.eventId = command[i++];


    // Parameters
    var events = this.isSystem ? $datasGame.commonEvents.eventsSystem :
                                 $datasGame.commonEvents.eventsUser;
    var parameters = events[this.eventId].parameters;
    this.parameters = [];
    while (i < l){
        var paramId = command[i++];
        var k = command[i++];
        var v = command[i++];
        var parameter = SystemValue.createValue(k, v);

        // If default value
        if (parameter.kind === 2)
            parameter = parameters[j].value;

        this.parameters.push(parameter);
        i++;
        j++;
    }

    this.isDirectNode = true;
}

EventCommandSendEvent.sendEvent = function(sender, targetKind, idTarget,
                                           isSystem, idEvent, parameters)
{
    var i, j, k, l, ll, portion, objects;
    var group = $gameStack.top().mapPortions;

    switch (targetKind){
    case 0: // Send to all
        break;
    case 1: // Send to detection
        var pos = $game.hero.mesh.position;
        var length = 1;
        var width = 1;
        var height = 1;

        for (var x = 0; x < length; x++){
            for (var y = 0; y < width; y++){
                for (var z = 0; z < height; z++){
                    portion = group[x][y][z];
                    objects = portion.objectsList;
                    ll = objects.length;
                    for (j = 0; j < ll; j++){
                        var object = objects[j];
                        var posObject = object.mesh.position;
                        if (posObject.x >= pos.x - ($SQUARE_SIZE / 2) &&
                            posObject.x <= pos.x + ($SQUARE_SIZE / 2) &&
                            posObject.y >= pos.y &&
                            posObject.y <= pos.y + $SQUARE_SIZE &&
                            posObject.z >= pos.z - $SQUARE_SIZE  -
                                ($SQUARE_SIZE / 2) &&
                            posObject.z <= pos.z + ($SQUARE_SIZE / 2)
                           )
                        {
                            // Get states
                            var states = [1];
                            var portionDatas =
                                    $game.mapsDatas[$gameStack.top().id]
                                    [x][y][z];
                            var indexState =
                                    portionDatas.si.indexOf(object.system.id);
                            if (indexState !== -1)
                                states = portionDatas.s[indexState];

                            // Make the object receive the event
                            object.receiveEvent(sender, isSystem, idEvent,
                                                parameters, states);
                        }
                    }
                }
            }
        }
        break;
    case 2: // Send to a particular object
        break;
    case 3: // Send to sender
        break;
    case 4: // Send to the hero
        $game.hero.receiveEvent(sender, isSystem, idEvent, parameters,
                                $game.heroStates);
        break;
    }
}

EventCommandSendEvent.prototype = {
    initialize: function(){ return null; },

    update: function(currentState, object, state){
        EventCommandSendEvent.sendEvent(object, this.targetKind, this.idTarget,
                                        this.isSystem, this.eventId,
                                        this.parameters);

        return 1;
    },

    onKeyPressed: function(currentState, key){},
    onKeyReleased: function(currentState, key){},
    onKeyPressedRepeat: function(currentState, key){ return true; },
    onKeyPressedAndRepeat: function(currentState, key){},
    drawHUD: function(currentState, context){}
}
