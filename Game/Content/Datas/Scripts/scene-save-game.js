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
//  CLASS SceneSaveGame : SceneSaveLoadGame
//
// -------------------------------------------------------

/** @class
*   @extends SceneSaveLoadGame
*   A scene in the menu for saving a game.
*/
function SceneSaveGame() {
    SceneSaveLoadGame.call(this);

    SceneSaveLoadGame.prototype.setContents.call(
                this,
                new GraphicText("Save a game"),
                new GraphicText("Select a slot where you want to save.")
                );
}

SceneSaveGame.prototype = {

    update: function(){

    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        var slot;

        SceneSaveLoadGame.prototype.onKeyPressed.call(this, key);

        // If action, save in the selected slot
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Action))
        {
            slot = this.windowChoicesSlots.currentSelectedIndex + 1;
            $game.write(slot);

            // Pop to return in the precedent state
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
        SceneSaveLoadGame.prototype.onKeyPressedAndRepeat.call(this, key);
    },

    // -------------------------------------------------------

    draw3D: function(canvas){

    },

    // -------------------------------------------------------

    drawHUD: function(context){
        SceneSaveLoadGame.prototype.drawHUD.call(this, context);
    }
}
