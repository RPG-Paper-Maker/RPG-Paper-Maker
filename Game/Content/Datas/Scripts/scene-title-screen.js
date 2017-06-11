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
//  CLASS SceneTitleScreen : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene for the title screen.
*   @extends SceneGame
*   @property {WindowChoices} windowChoicesCommands A window choices for
*   choosing a command.
*/
function SceneTitleScreen() {
    SceneGame.call(this);

    var commands, commandsActions;

    // Initializing commands (texts and actions)
    commands = [
        new GraphicText("New game"),
        new GraphicText("Load game"),
        new GraphicText("Exit")
    ];
    commandsActions = [
        SceneTitleScreen.prototype.startNewGame,
        SceneTitleScreen.prototype.loadGame,
        SceneTitleScreen.prototype.exit
    ];

    // Windows
    this.windowChoicesCommands =
         new WindowChoices(OrientationWindow.Vertical, $SCREEN_X/2 - 100, 200,
                           200, 50, 3, commands, commandsActions);
}

SceneTitleScreen.prototype = {

    /** Callback function for starting a new game.
    */
    startNewGame: function(){

        // Create a new game
        $game = new Game();
        $game.initializeDefault();

        // Add local map to stack
        $gameStack.replace(
                    new SceneMap($datasGame.system.idMapStartHero.getValue()));
    },

    // -------------------------------------------------------

    /** Callback function for loading an existing game.
    */
    loadGame: function(){
        $gameStack.push(new SceneLoadGame());
    },

    // -------------------------------------------------------

    /** Callback function for closing the window.
    */
    exit: function(){
        quit();
    },

    // -------------------------------------------------------

    update: function(){

    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        this.windowChoicesCommands.onKeyPressed(key);
    },

    // -------------------------------------------------------

    onKeyReleased: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        this.windowChoicesCommands.onKeyPressedAndRepeat(key);
    },

    // -------------------------------------------------------

    draw3D: function(canvas){

    },

    // -------------------------------------------------------

    drawHUD: function(context){
        this.windowChoicesCommands.draw(context);
    }
}
