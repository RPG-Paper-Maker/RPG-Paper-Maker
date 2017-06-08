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
//  CLASS SceneDescriptionState : GameState
//
//  @windowTop          -> Window on top with "State" text
//  @windowChoicesTabs  -> Window for each tabs
//  @windowInformations -> Window for skill informations
//
// -------------------------------------------------------

function SceneDescriptionState() {
    SceneGame.call(this);

    var nbHeroes, i;
    var listHeroes;

    // Tab heroes
    nbHeroes = $game.teamHeroes.length;
    listHeroes = new Array(nbHeroes);
    for (i = 0; i < nbHeroes; i++)
        listHeroes[i] = new GraphicPlayerDescription($game.teamHeroes[i]);

    // All the windows
    this.windowTop = new WindowBox(20, 20, 200, 30, new GraphicText("State"));
    this.windowChoicesTabs = new WindowChoices(OrientationWindow.Horizontal, 50,
                                               60, 110, 25, 4, listHeroes,
                                               null);
    this.windowInformations = new WindowBox(20, 100, 600, 340, null,
                                            [30,30,30,30]);
}

SceneDescriptionState.prototype = {

     // -------------------------------------------------------

    update: function(){

    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Cancel) ||
            DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.MainMenu))
        {
            $gameStack.pop();
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        var indexTab = this.windowChoicesTabs.currentSelectedIndex;
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);

        // Synchronize informations with selected hero
        this.windowInformations.content =
             this.windowChoicesTabs.getCurrentContent();
    },

    // -------------------------------------------------------

    draw3D: function(canvas){

    },

    // -------------------------------------------------------

    drawHUD: function(context){

        // Draw the local map behind
        $gameStack.bot().drawHUD(context);

        // Draw the menu
        this.windowTop.draw(context);
        this.windowChoicesTabs.draw(context);
        this.windowInformations.draw(context);
    }
}
