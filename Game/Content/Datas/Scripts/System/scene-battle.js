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
//  CLASS SceneBattle : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene for battling.
*   @extends SceneGame
*   @property {boolean} winning Boolean indicating whether the player won the
*                       battle or not.
*   @property {number} troopID Current troop the allies are fighting.
*   @property {boolean} canEscape Boolean indicating if the player can escape
*                       this battle.
*   @property {boolean} canGameOver Boolean indicating if there a win/lose node
*                       or not.
*   @property {CharacterKind} kindSelection Indicating which group is currently
*                             selected.
*   @property {CharacterKind} attackingGroup Indicating which group is currently
*                             attacking.
*   @property {number} step Step of the battle.
*   @property {number} subStep Sub-step of the battle (usefull for menus or
*                              other sub-steps).
*   @property {number} selectedUserIndex Index of the selected user.
*   @property {number} distanceCenterAlly The distance between the center of map
*                      battle and ally.
*   @property {number} time A chronometer.
*   @property {Player[]} targets List of all the current targets.
*   @property {Array.<Array.<Player>>} battlers Battlers of all the
*                                      allies/enemies.
*   @property {WindowBox} windowTopInformations The window on top that shows
*   specific informations.
*   @property {WindowBox} windowCharacterInformations The window on bot that
*   shows caracteristics informations.
*   @property {WindowChoice} windowChoicesBattleCommands The window for battle
*   commands.
*   @property {WindowBox} arrowSelection The arrow used to select
*   allies/ennemies.
*   @property {GraphicText} textsDamages List of all the damages to display.
*/
function SceneBattle(troopID, canGameOver, canEscape) {
    SceneGame.call(this);
    this.step = 0;
    this.troopID = troopID;
    this.canGameOver = canGameOver;
    this.canEscape = canEscape;
    this.initialize();
}

SceneBattle.prototype = {

    /** Make the attacking group all actives.
    */
    activeGroup: function(){
        var i, l;
        for (i = 0, l = this.battlers[this.attackingGroup].length; i < l; i++){
            this.battlers[this.attackingGroup][i].active = true;
        }
    },

    // -------------------------------------------------------

    /** Check if a player is defined (active and not dead).
    *   @param {CharacterKind} kind Kind of player.
    *   @param {number} index Index in the group.
    *   @returns {boolean}
    */
    isDefined: function(kind, index){
        return (this.battlers[kind][index].active &&
                !this.battlers[kind][index].character.isDead())
    },

    // -------------------------------------------------------

    /** Check if all the heroes or enemies are inactive.
    *   @returns {boolean}
    */
    isEndTurn: function(){
        var i, l;

        for (i = 0, l = this.battlers[this.attackingGroup].length; i < l; i++){
            if (this.isDefined(this.attackingGroup, i))
                return false;
        }

        return true;
    },

    // -------------------------------------------------------

    /** Check if all the heroes or enemies are dead.
    *   @param {CharacterKind} group Kind of player.
    *   @returns {boolean}
    */
    isGroupDead: function(group){
        var i, l;

        for (i = 0, l = this.battlers[group].length; i < l; i++){
            if (!this.battlers[group][i].character.isDead())
                return false;
        }

        return true;
    },

    // -------------------------------------------------------

    /** Check if all the enemies are dead.
    *   @returns {boolean}
    */
    isWin: function(){
        return this.isGroupDead(CharacterKind.Monster);
    },

    // -------------------------------------------------------

    /** Check if all the heroes are dead.
    *   @returns {boolean}
    */
    isLose: function(){
        return this.isGroupDead(CharacterKind.Hero);
    },

    // -------------------------------------------------------

    /** Transition to game over scene.
    */
    gameOver: function(){
        if (this.canGameOver){
            quit(); // TODO
        }
        else
            $gameStack.pop();
    },

    // -------------------------------------------------------

    /** Win the battle.
    */
    win: function(){
        this.winning = true;
        $gameStack.pop();
    },

    // -------------------------------------------------------

    /** Change the step of the battle.
    *   @param {number} i Step of the battle.
    */
    changeStep: function(i){
        this.step = i;
        this.subStep = 0;
        this.initialize();
    },

    // -------------------------------------------------------

    /** Initialize the current step.
    */
    initialize: function(){
        switch(this.step){
        case 0:
            this.initializeStep0(); break;
        case 1:
            this.initializeStep1(); break;
        case 2:
            this.initializeStep2(); break;
        case 3:
            this.initializeStep3(); break;
        case 4:
            this.initializeStep4(); break;
        }
    },

    // -------------------------------------------------------

    update: function(){
        switch(this.step){
        case 0:
            this.updateStep0(); break;
        case 1:
            this.updateStep1(); break;
        case 2:
            this.updateStep2(); break;
        case 3:
            this.updateStep3(); break;
        case 4:
            this.updateStep4(); break;
        }
    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        switch(this.step){
        case 0:
            this.onKeyPressedStep0(key); break;
        case 1:
            this.onKeyPressedStep1(key); break;
        case 2:
            this.onKeyPressedStep2(key); break;
        case 3:
            this.onKeyPressedStep3(key); break;
        case 4:
            this.onKeyPressedStep4(key); break;
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(key){
        switch(this.step){
        case 0:
            this.onKeyReleasedStep0(key); break;
        case 1:
            this.onKeyReleasedStep1(key); break;
        case 2:
            this.onKeyReleasedStep2(key); break;
        case 3:
            this.onKeyReleasedStep3(key); break;
        case 4:
            this.onKeyReleasedStep4(key); break;
        }
    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){
        switch(this.step){
        case 0:
            this.onKeyPressedRepeatStep0(key); break;
        case 1:
            this.onKeyPressedRepeatStep1(key); break;
        case 2:
            this.onKeyPressedRepeatStep2(key); break;
        case 3:
            this.onKeyPressedRepeatStep3(key); break;
        case 4:
            this.onKeyPressedRepeatStep4(key); break;
        }
    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        switch(this.step){
        case 0:
            this.onKeyPressedAndRepeatStep0(key); break;
        case 1:
            this.onKeyPressedAndRepeatStep1(key); break;
        case 2:
            this.onKeyPressedAndRepeatStep2(key); break;
        case 3:
            this.onKeyPressedAndRepeatStep3(key); break;
        case 4:
            this.onKeyPressedAndRepeatStep4(key); break;
        }
    },

    // -------------------------------------------------------

    /** Draw all the battlers.
    *   @param {Canvas.Context} context The canvas context.
    */
    drawBattlers: function(context){
        var i, l;

        for (i = 0, l = this.battlers[CharacterKind.Hero].length; i < l; i++)
        {
            if (!this.battlers[CharacterKind.Hero][i].character.isDead())
                this.battlers[CharacterKind.Hero][i].draw(context);
        }
        for (i = 0, l = this.battlers[CharacterKind.Monster].length; i < l; i++)
        {
            if (!this.battlers[CharacterKind.Monster][i].character.isDead())
                this.battlers[CharacterKind.Monster][i].draw(context);
        }
    },

    // -------------------------------------------------------

    draw3D: function(canvas){
        $currentMap.draw3D(canvas);

        switch(this.step){
        case 0:
            this.draw3DStep0(canvas); break;
        case 1:
            this.draw3DStep1(canvas); break;
        case 2:
            this.draw3DStep2(canvas); break;
        case 3:
            this.draw3DStep3(canvas); break;
        case 4:
            this.draw3DStep4(canvas); break;
        }
    },

    // -------------------------------------------------------

    drawHUD: function(context){
        switch(this.step){
        case 0:
            this.drawHUDStep0(context); break;
        case 1:
            this.drawHUDStep1(context); break;
        case 2:
            this.drawHUDStep2(context); break;
        case 3:
            this.drawHUDStep3(context); break;
        case 4:
            this.drawHUDStep4(context); break;
        }
    }
}
