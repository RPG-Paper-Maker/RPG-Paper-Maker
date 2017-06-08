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
//  CLASS SceneSaveGame : SaveLoadState
//
// -------------------------------------------------------

function SceneLoadGame() {
    SceneSaveLoadGame.call(this);
    SceneSaveLoadGame.prototype.setContents.call(
                this,
                new GraphicText("Load a game"),
                new GraphicText("Select a slot you want to load.")
                );
}

SceneLoadGame.prototype = {

    loadGame: function(){

    },

    update: function(){

    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        SceneSaveLoadGame.prototype.onKeyPressed.call(this, key);

        // If action, load the selected slot
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Action))
        {
            $game = this.gamesDatas
                    [this.windowChoicesSlots.currentSelectedIndex];
            if ($game !== null){

                // Pop load and title screen from the stack
                $gameStack.pop()
                $gameStack.replace(
                            new SceneMap(
                                $datasGame.system.idMapStartHero.getValue()));
            }
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
