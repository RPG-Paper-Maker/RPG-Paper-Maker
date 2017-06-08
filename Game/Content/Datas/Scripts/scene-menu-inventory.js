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
//  CLASS SceneMenuInventory : GameState
//
//  @windowTop          -> Window on top with "Inventory" text
//  @windowChoicesTabs  -> Window for each tabs
//  @windowChoicesList  -> Window for each items
//  @windowInformations -> Window for item informations
//
// -------------------------------------------------------

function SceneMenuInventory() {
    SceneGame.call(this);

    var menuKind;

    // Initializing the top menu for item kinds
    menuKind = [
        new GraphicText("All"),
        new GraphicText("Consumables"),
        new GraphicText($datasGame.system.itemsTypes[1]),
        new GraphicText($datasGame.system.itemsTypes[2]),
        new GraphicText("Weapons"),
        new GraphicText("Armors")
    ];

    // All the windows
    this.windowTop = new WindowBox(20, 20, 200, 30,
                                   new GraphicText("Inventory"));
    this.windowChoicesTabs =
         new WindowChoices(OrientationWindow.Horizontal, 5, 60, 105, 25, 6,
                           menuKind, null);
    this.windowChoicesList =
         new WindowChoices(OrientationWindow.Vertical, 20, 100, 200, 25,
                           SceneMenu.nbItemsToDisplay,
                           new Array(SceneMenu.nbItemsToDisplay),
                           null, [5,5,5,5]);
    this.windowInformations =
         new WindowBox(240, 100, 360, 200);

    // Update for changing tab
    this.updateForTab();
}

SceneMenuInventory.prototype = {

    updateForTab: function(){
        var i, j, list = new Array(SceneMenu.nbItemsToDisplay);
        var indexTab = this.windowChoicesTabs.currentSelectedIndex;
        var nbItems = $game.items.length;

        // Get the first items of the inventory
        for (i = 0, j = 0; i < nbItems && j < SceneMenu.nbItemsToDisplay; i++){
            var ownedItem = $game.items[i];
            var item = $datasGame.items.list[ownedItem.id];
            if (indexTab === 0 ||
                (indexTab === 1 && (ownedItem.k === ItemKind.Item
                                    && item.consumable)) ||
                (indexTab === 2 && (ownedItem.k === ItemKind.Item
                                    && item.idType === 1)) ||
                (indexTab === 3 && (ownedItem.k === ItemKind.Item
                                    && item.idType === 2)) ||
                (indexTab === 4 && ownedItem.k === ItemKind.Weapon) ||
                (indexTab === 5 && ownedItem.k === ItemKind.Armor))
            {
                list[j] = new GraphicItem(ownedItem);
                j++;
            }
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

        this.windowChoicesList.onKeyPressedAndRepeat(key);

        // Update informations to display
        this.windowInformations.content =
             this.windowChoicesList.getCurrentContent();
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
        this.windowChoicesList.draw(context);
        this.windowInformations.draw(context);
    }
}
