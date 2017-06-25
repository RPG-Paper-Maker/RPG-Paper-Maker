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
//  CLASS SceneMenuEquip : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene in the menu for describing players equipments.
*   @extends SceneGame
*   @property {WindowBox} windowTop Window on top with "Equip" text.
*   @property {WindowTabs} windowChoicesTabs Window for each tabs.
*   @property {WindowBox} windowInformations Window for equip stats
*   informations.
*   @property {WindowChoices} windowChoicesEquipment Window for each equipment
*   slot.
*   @property {WindowChoices} windowChoicesList Window for each weapon/armor.
*   @property {number} selectedEquipment Index of selected equipment.
*/
function SceneMenuEquip() {
    SceneGame.call(this);

    var nbHeroes, nbEquipments, nbEquipChoice, i;
    var listHeroes;

    // Tab heroes
    nbHeroes = $game.teamHeroes.length;
    listHeroes = new Array(nbHeroes);
    for (i = 0; i < nbHeroes; i++)
        listHeroes[i] = new GraphicPlayerDescription($game.teamHeroes[i]);

    // Equipment
    nbEquipments = $datasGame.battleSystem.equipments.length - 1;
    nbEquipChoice = SceneMenu.nbItemsToDisplay - nbEquipments - 1;

    // All the windows
    this.windowTop = new WindowBox(20, 20, 200, 30, new GraphicText("Equip"));
    this.windowChoicesTabs =
         new WindowTabs(OrientationWindow.Horizontal, 50, 60, 110, 25, 4,
                        listHeroes, null);
    this.windowChoicesEquipment =
         new WindowChoices(OrientationWindow.Vertical, 20, 100, 290, 25,
                           nbEquipments, new Array(nbEquipments), null,
                           [5,5,5,5]);
    this.windowChoicesList =
         new WindowChoices(OrientationWindow.Vertical, 20, 300, 290, 25,
                           nbEquipChoice, new Array(nbEquipChoice), null,
                           [5,5,5,5], 0, -1);
    this.windowInformations = new WindowBox(330,100,285,350);

    // Updates
    this.updateForTab();
    this.updateEquipmentList();
    this.updateInformations();
}

SceneMenuEquip.prototype = {

    /** Update tab.
    */
    updateForTab: function(){
        var equipLength, i, l;
        var list;

        // update equipment
        equipLength = GamePlayer.getEquipmentLength();
        l = $datasGame.battleSystem.equipments.length - 1;
        list = new Array(l);
        for (i = 0; i < l; i++){
            list[i] =
                    new GraphicEquip(
                        $game.teamHeroes
                        [this.windowChoicesTabs.currentSelectedIndex], i+1,
                        equipLength);
        }
        this.windowChoicesEquipment.setContents(list);
        this.selectedEquipment = -1;
        this.windowChoicesList.unselect();
        this.updateEquipmentList();
        this.updateInformations();
    },

    // -------------------------------------------------------

    /** Update the equipment list.
    */
    updateEquipmentList: function(){
        var idEquipment, nb, i, j, l, c, ll, k, lll, nbItem;
        var list, type, systemItem, item, character;

        idEquipment = this.windowChoicesEquipment.currentSelectedIndex + 1;
        nb = this.windowChoicesList.listWindows.length;
        list = new Array(nb);

        // Remove
        list[0] = new GraphicText("[Remove]", Align.Left);

        j = 1;
        l = $game.items.length;
        for (i = 0; i < l; i++){
            item = $game.items[i];
            if (item.k !== ItemKind.Item){
                systemItem = item.getItemInformations();
                type = systemItem.getType();
                if (type.equipments[idEquipment]){

                    // Correct the number according to equiped items
                    nbItem = item.nb;
                    ll = $game.teamHeroes.length;
                    for (c = 0; c < ll; c++){
                        character = $game.teamHeroes[c];
                        lll = character.equip.length;
                        for (k = 0; k < lll; k++){
                            if (item === character.equip[k]) nbItem--;
                        }
                    }

                    if (nbItem > 0){
                        list[j] = new GraphicItem(item, nbItem);
                        j++;
                    }
                }
            }
        }
        for (; j < nb; j++){
            list[j] = null;
        }

        // Set contents
        this.windowChoicesList.setContents(list);
    },

    // -------------------------------------------------------

    /** Update the informations to display for equipment stats.
    */
    updateInformations: function(){
        var list;
        if (this.selectedEquipment === -1)
            list = [];
        else{
            var item = this.windowChoicesList.getCurrentContent();

            if (item === null)
                list = [];
            else{
                var i, l = $datasGame.battleSystem.statistics.length;
                list = new Array(l);
                for (i = 1; i < l; i++){
                    list[i] = 0;
                }
            }
        }

        this.windowInformations.content =
             new GraphicEquipStats(
                 $game.teamHeroes[this.windowChoicesTabs.currentSelectedIndex],
                 list);
    },

    /** Remove the equipment of the character.
    */
    remove: function(){
        var character =
                $game.teamHeroes[this.windowChoicesTabs.currentSelectedIndex];
        character.equip[this.windowChoicesEquipment.currentSelectedIndex + 1]
                = null;
    },

    // -------------------------------------------------------

    /** Equip the selected equipment.
    */
    equip: function(){
        var character =
                $game.teamHeroes[this.windowChoicesTabs.currentSelectedIndex];
        var item = this.windowChoicesList.getCurrentContent().base;
        character.equip[this.windowChoicesEquipment.currentSelectedIndex + 1]
                = item;
    },

    // -------------------------------------------------------

    update: function(){

    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        if (this.selectedEquipment === -1){
            if (DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.menuControls
                                         .Cancel) ||
                DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.MainMenu))
            {
                $gameStack.pop();
            }
            else if (DatasKeyBoard.isKeyEqual(key,
                                              $datasGame.keyBoard.menuControls
                                              .Action))
            {
                this.selectedEquipment =
                     this.windowChoicesEquipment.currentSelectedIndex;
                this.windowChoicesList.currentSelectedIndex = 0;
                this.updateInformations();
                this.windowChoicesList.selectCurrent();
            }
        }
        else{
            if (DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.menuControls
                                         .Cancel) ||
                DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.MainMenu))
            {
                this.selectedEquipment = -1;
                this.windowChoicesList.unselect();
                this.updateInformations();
            }
            else if (DatasKeyBoard.isKeyEqual(key,
                                              $datasGame.keyBoard.menuControls
                                              .Action))
            {
                if (this.windowChoicesList.currentSelectedIndex === 0)
                    this.remove();
                else
                    this.equip();
                this.selectedEquipment = -1;
                this.windowChoicesList.unselect();
                this.updateForTab();
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

        // Tab
        var indexTab = this.windowChoicesTabs.currentSelectedIndex;
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        if (indexTab !== this.windowChoicesTabs.currentSelectedIndex)
            this.updateForTab();

        // Equipment
        if (this.selectedEquipment === -1){
            var indexEquipment =
                    this.windowChoicesEquipment.currentSelectedIndex;
            this.windowChoicesEquipment.onKeyPressedAndRepeat(key);
            if (indexEquipment !==
                    this.windowChoicesEquipment.currentSelectedIndex)
                this.updateEquipmentList();
        }
        else{
            var indexList = this.windowChoicesList.currentSelectedIndex;
            this.windowChoicesList.onKeyPressedAndRepeat(key);
            if (indexList !== this.windowChoicesList.currentSelectedIndex)
                this.updateInformations();
        }
    },

    // -------------------------------------------------------

    draw3D: function(canvas){
        $gameStack.bot().draw3D(canvas);
    },

    // -------------------------------------------------------

    drawHUD: function(context){

        // Draw the local map behind
        $gameStack.bot().drawHUD(context);

        // Draw the menu
        this.windowTop.draw(context);
        this.windowChoicesTabs.draw(context);
        this.windowChoicesEquipment.draw(context);
        this.windowChoicesList.draw(context);
        this.windowInformations.draw(context);
    }
}
