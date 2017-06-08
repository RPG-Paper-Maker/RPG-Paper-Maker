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
//  CLASS SceneMenu : GameState
//
//  @windowChoicesCommands  -> A window choices for choosing a command
//  @windowChoicesTeam      -> A Window for displaying informations about team
//  @textPlayTime           -> A text for displaying play time
//  @selectedOrder          -> Index of the selected hero to order
//
// -------------------------------------------------------

function SceneMenu() {
    SceneGame.call(this);

    var menuCommands, menuCommandsActions;
    var i, nbHeroes;
    var graphicsHeroes;

    // Initializing order index
    this.selectedOrder = -1;

    // Initializing the left menu commands (texts and actions)
    menuCommands = [
        new GraphicText("Inventory"),
        new GraphicText("Skills"),
        new GraphicText("Equip"),
        new GraphicText("State"),
        new GraphicText("Order"),
        new GraphicText("Save"),
        new GraphicText("Quit")
    ];
    menuCommandsActions = [
        SceneMenu.prototype.openInventory,
        SceneMenu.prototype.openSkills,
        SceneMenu.prototype.openEquip,
        SceneMenu.prototype.openState,
        SceneMenu.prototype.openOrder,
        SceneMenu.prototype.openSave,
        SceneMenu.prototype.exit
    ];

    // Initializing graphics for displaying heroes informations
    nbHeroes = $game.teamHeroes.length;
    graphicsHeroes = new Array(nbHeroes);
    for (i = 0; i < nbHeroes; i++)
        graphicsHeroes[i] = new GraphicPlayer($game.teamHeroes[i]);

    // Initializing play time widget
    this.textPlayTime = new GraphicText("");

    // All the windows
    this.windowChoicesCommands =
         new WindowChoices(OrientationWindow.Vertical, 20, 20, 150, 50,
                           menuCommands.length, menuCommands,
                           menuCommandsActions);
    this.windowChoicesTeam =
         new WindowChoices(OrientationWindow.Vertical, 190, 20, 430, 95, 4,
                           graphicsHeroes, null, [5,5,5,5], 15, -1);

}

SceneMenu.nbItemsToDisplay = 14;

SceneMenu.prototype = {

    openInventory: function(){
        $gameStack.push(new SceneMenuInventory());
    },

    // -------------------------------------------------------

    openSkills: function(){
        $gameStack.push(new SceneMenuSkills());
    },

    // -------------------------------------------------------

    openEquip: function(){
        $gameStack.push(new SceneMenuEquip());
    },

    // -------------------------------------------------------

    openState: function(){
        $gameStack.push(new SceneDescriptionState());
    },

    // -------------------------------------------------------

    openOrder: function(){
        this.windowChoicesTeam.select(0);
    },

    // -------------------------------------------------------


    openSave: function(){
        $gameStack.push(new SceneSaveGame());
    },

    // -------------------------------------------------------

    exit: function(){
        quit();
    },

     // -------------------------------------------------------

    update: function(){
        this.textPlayTime.text = Wanok.getStringDate($game.playTime);
    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        if (this.windowChoicesTeam.currentSelectedIndex === -1){
            this.windowChoicesCommands.onKeyPressed(key, this);

            // Quit the menu if cancelling + in window command
            if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
                                         .Cancel) ||
                DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.MainMenu))
            {
                $gameStack.pop();
            }
        }
        else{

            // If in reorder team window
            if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
                                         .Cancel) ||
                DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.MainMenu))
            {
                this.windowChoicesTeam.unselect();
            }
            else if (DatasKeyBoard.isKeyEqual(key,
                                              $datasGame.keyBoard.menuControls
                                              .Action))
            {
                // If selecting the first hero to interchange
                if (this.selectedOrder === -1){
                    this.selectedOrder =
                         this.windowChoicesTeam.currentSelectedIndex;
                    this.windowChoicesTeam.listWindows[this.selectedOrder].color
                         = "#ff4d4d";
                }
                // If a hero is selected, interchange now !
                else{
                    var item1, item2;

                    // Change the current game order
                    item1 = $game.teamHeroes[this.selectedOrder];
                    item2 = $game.teamHeroes
                            [this.windowChoicesTeam.currentSelectedIndex];
                    $game.teamHeroes[this.selectedOrder] = item2;
                    $game.teamHeroes
                            [this.windowChoicesTeam.currentSelectedIndex]
                            = item1;
                    item1 =
                            this.windowChoicesTeam.getContent(
                                this.selectedOrder);
                    item2 =
                            this.windowChoicesTeam.getContent(
                                this.windowChoicesTeam.currentSelectedIndex);
                    this.windowChoicesTeam
                    .setContent(this.selectedOrder, item2);
                    this.windowChoicesTeam
                    .setContent(this.windowChoicesTeam.currentSelectedIndex,
                                item1);

                    // Change background color
                    this.windowChoicesTeam.listWindows[this.selectedOrder]
                    .backgroundColor =
                     this.windowChoicesTeam.unselectedBackgroundColor;
                    this.selectedOrder = -1;
                    this.windowChoicesTeam
                    .select(this.windowChoicesTeam.currentSelectedIndex);
                }
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
        if (this.windowChoicesTeam.currentSelectedIndex === -1)
            this.windowChoicesCommands.onKeyPressedAndRepeat(key);
        else{
            this.windowChoicesTeam.onKeyPressedAndRepeat(key);
            if (this.selectedOrder !== -1){
                this.windowChoicesTeam.listWindows[this.selectedOrder].color
                     = "#ff4d4d";
            }
        }
    },

    // -------------------------------------------------------

    draw3D: function(canvas){

    },

    // -------------------------------------------------------

    drawHUD: function(context){

        // Draw the local map behind
        $gameStack.bot().drawHUD(context);

        // Draw the windows
        this.windowChoicesCommands.draw(context);
        this.windowChoicesTeam.draw(context);

        // Draw play time
        this.textPlayTime.draw(context, 90, $SCREEN_Y -40,70,20);
    }
}
