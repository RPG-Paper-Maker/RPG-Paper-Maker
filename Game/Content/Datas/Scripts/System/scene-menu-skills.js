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
//  CLASS SceneMenuSkills : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene in the menu for describing players skills.
*   @extends SceneGame
*   @property {WindowBox} windowTop Window on top with "Skills" text.
*   @property {WindowTabs} windowChoicesTabs Window for each tabs.
*   @property {WindowBox} windowInformations Window for skill informations.
*   @property {WindowChoices} windowChoicesList Window for each skill.
*/
function SceneMenuSkills() {
    SceneGame.call(this);

    var nbHeroes, i;
    var listHeroes;

    // Tab heroes
    nbHeroes = $game.teamHeroes.length;
    listHeroes = new Array(nbHeroes);
    for (i = 0; i < nbHeroes; i++)
        listHeroes[i] = new GraphicPlayerDescription($game.teamHeroes[i]);

    // All the windows
    this.windowTop = new WindowBox(20, 20, 200, 30, new GraphicText("Skills"));
    this.windowChoicesTabs =
         new WindowTabs(OrientationWindow.Horizontal, 50, 60, 110, 25, 4,
                        listHeroes, null);
    this.windowChoicesList =
         new WindowChoices(OrientationWindow.Vertical, 20,100, 200, 25,
                           SceneMenu.nbItemsToDisplay,
                           new Array(SceneMenu.nbItemsToDisplay),
                           null, [5,5,5,5]);
    this.windowInformations = new WindowBox(240,100,360,200);

    // Update for changing tab
    this.updateForTab();

    this.synchronize();
}

SceneMenuSkills.prototype = {

    /** Synchronize informations with selected hero.
    */
    synchronize: function(){
        this.windowInformations.content =
             this.windowChoicesList.getCurrentContent();
    },

    // -------------------------------------------------------

    /** Update tab.
    */
    updateForTab: function(){
        var i, j, list = new Array(SceneMenu.nbItemsToDisplay);
        var indexTab = this.windowChoicesTabs.currentSelectedIndex;
        var skills = $game.teamHeroes[indexTab].sk;
        var l = skills.length;

        // Get the first skills of the hero
        for (i = 0, j = 0; i < l && j < SceneMenu.nbItemsToDisplay; i++){
            var ownedSkill = skills[i];
            list[j] = new GraphicSkill(ownedSkill);
            j++;
        }

        for (; j < SceneMenu.nbItemsToDisplay; j++)
            list[j] = new GraphicText("");

        // Update the list
        this.windowChoicesList.setContents(list);
    },

    // -------------------------------------------------------

    update: function(){

    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Cancel) ||
            DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.MainMenu))
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

        // Tab
        var indexTab = this.windowChoicesTabs.currentSelectedIndex;
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        if (indexTab !== this.windowChoicesTabs.currentSelectedIndex)
            this.updateForTab();

        // List
        this.windowChoicesList.onKeyPressedAndRepeat(key);

        this.synchronize();
    },

    // -------------------------------------------------------

    draw3D: function(canvas){
        $currentMap.draw3D(canvas);
    },

    // -------------------------------------------------------

    drawHUD: function(context){
        // Draw the local map behind
        $currentMap.drawHUD(context);

        // Draw the menu
        this.windowTop.draw(context);
        this.windowChoicesTabs.draw(context);
        this.windowChoicesList.draw(context);
        this.windowInformations.draw(context);
    }
}
