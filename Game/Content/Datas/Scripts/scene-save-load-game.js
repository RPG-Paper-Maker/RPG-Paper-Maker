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
//  CLASS SceneSaveLoadGame : SceneGame
//
// -------------------------------------------------------

/** @class
*   Abstract class for the game save and loading menus.
*   @extends SceneGame
*   @property {Game[]} gamesDatas List of all games datas.
*   @property {WindowBox} windowTop A Window for displaying informations on top.
*   @property {WindowChoices} windowChoicesSlots A window choices for choosing
*   a slot.
*   @property {WindowBox} windowInformations A Window for displaying
*   informations about the selected slot.
*   @property {WindowBox} windowBot A Window for displaying informations on
*   bottom.
*/
function SceneSaveLoadGame() {
    SceneGame.call(this);

    SceneSaveLoadGame.prototype.initializeWindows.call(this);
    SceneSaveLoadGame.prototype.initializeGames.call(this);
}

SceneSaveLoadGame.prototype = {

    // -------------------------------------------------------

    /** Initialize all the windows graphics.
    */
    initializeWindows: function(){
        var commands = [
            new GraphicText("Slot 1"),
            new GraphicText("Slot 2"),
            new GraphicText("Slot 3"),
            new GraphicText("Slot 4")
        ];

        this.windowTop = new WindowBox(20, 20, $SCREEN_X - 40, 30);
        this.windowChoicesSlots =
             new WindowChoices(OrientationWindow.Vertical, 20, 100, 150, 50, 4,
                               commands, []);
        this.windowInformations = new WindowBox(190, 100, 430, 300);
        this.windowBot = new WindowBox(20, $SCREEN_Y - 50, $SCREEN_X - 40, 30);
    },

    // -------------------------------------------------------

    /** Initialize all the games.
    */
    initializeGames: function(){
        var i, l;
        var list, game;

        this.gamesDatas = [null, null, null, null];

        list = $datasGame.settings.saves;
        for (i = 0, l = list.length; i < l; i++){
            game = new Game();
            game.read(list[i], SceneSaveLoadGame.prototype.initializeNonEmpty,
                      this);
        }
    },

    // -------------------------------------------------------

    /** Initialize a non empty game displaying.
    */
    initializeNonEmpty: function(game){
        this.gamesDatas[game.currentSlot-1] = game;
        if (game.currentSlot-1 === this.windowChoicesSlots.currentSelectedIndex)
        {
            SceneSaveLoadGame.prototype.updateInformations.call(
                        this, game.currentSlot -1);
        }
    },

    // -------------------------------------------------------

    /** Set the contents in the bottom and top bars.
    */
    setContents: function(top, bot){
        this.windowTop.content = top;
        this.windowBot.content = bot;
    },

    // -------------------------------------------------------

    /** Update the information to display inside the save informations.
    */
    updateInformations: function(i){
        if (this.gamesDatas[i] === null){
            this.windowInformations.content = new GraphicText("empty");
        }
        else{
            this.windowInformations.content = new GraphicText("not empty");
        }
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

    onKeyPressedAndRepeat: function(key){
        this.windowChoicesSlots.onKeyPressedAndRepeat(key);
        SceneSaveLoadGame.prototype.updateInformations.call(
                    this, this.windowChoicesSlots.currentSelectedIndex);
    },


    // -------------------------------------------------------

    drawHUD: function(context){
        this.windowTop.draw(context);
        this.windowChoicesSlots.draw(context);
        this.windowInformations.draw(context);
        this.windowBot.draw(context);
    }
}
