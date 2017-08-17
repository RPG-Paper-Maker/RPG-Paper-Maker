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
//  CLASS SceneBattle
//
//  Step 1 :
//      SubStep 0 : Selection of an ally
//      SubStep 1 : Selection of a command
//      SubStep 2 : selection of an ally/enemy for a command
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep1 = function(){
    this.windowTopInformations.content = new GraphicText("Select an ally");
    this.selectedUserIndex = 0;
    this.selectedTargetIndex = 0;
    this.kindSelection = CharacterKind.Hero;
    this.attackingGroup = CharacterKind.Hero;
    this.targets = [];
    var index = this.selectedUserTargetIndex();
    while (!this.isDefined(this.kindSelection, index)){
        if (index < (this.battlers[this.kindSelection].length - 1))
            index++;
        else if (index === (this.battlers[this.kindSelection].length - 1))
            index = 0;
    }
    if (this.subStep === 0) this.selectedUserIndex = index;
    else this.selectedTargetIndex = index;
    this.moveArrow();
};

// -------------------------------------------------------

/** Return the index of the array after going up.
*   @returns {number}
*/
SceneBattle.prototype.indexArrowUp = function(){
    var index = this.selectedUserTargetIndex();
    do {
        if (index > 0)
            index--;
        else if (index === 0)
            index = this.battlers[this.kindSelection].length - 1;
    } while (!this.isDefined(this.kindSelection, index));

    return index;
};

// -------------------------------------------------------

/** Return the index of the array after going down.
*   @returns {number}
*/
SceneBattle.prototype.indexArrowDown = function(){
    var index = this.selectedUserTargetIndex();
    do {
        if (index < (this.battlers[this.kindSelection].length - 1))
            index++;
        else if (index === (this.battlers[this.kindSelection].length - 1))
            index = 0;
    } while (!this.isDefined(this.kindSelection, index));

    return index;
};

// -------------------------------------------------------

/** Move the arrow.
*/
SceneBattle.prototype.moveArrow = function(){
    var dim = this.battlers[this.kindSelection][this.selectedUserTargetIndex()]
              .rect.windowDimension;
    this.arrowSelection.windowDimension =
         [dim[0] + (dim[2]/2) - 3,dim[1] + dim[3] + 10,6,6];

    // Updating window informations
    this.windowCharacterInformations.content =
         new GraphicPlayer(this.battlers
                           [this.kindSelection]
                           [this.selectedUserTargetIndex()]
                           .character);
};

// -------------------------------------------------------

/** Return the index of the target.
*   @returns {number}
*/
SceneBattle.prototype.selectedUserTargetIndex = function(){
    return (this.subStep === 0) ? this.selectedUserIndex
                                : this.selectedTargetIndex;
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep1 = function(){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedStep1 = function(key){
    switch (this.subStep){
    case 0:
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Action))
        {
            this.subStep = 1;
        }
        break;
    case 1:
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Action))
        {
            this.user = this.battlers[CharacterKind.Hero]
                        [this.selectedUserIndex];
            this.kindSelection = CharacterKind.Monster;
            this.moveArrow();
            this.subStep = 2;
        }
        break;
    case 2:
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Action))
        {
            this.targets.push(this.battlers[this.kindSelection]
                              [this.selectedUserTargetIndex()]);
            this.changeStep(2);
        }
        break;
    }
};

// -------------------------------------------------------

SceneBattle.prototype.onKeyReleasedStep1 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedRepeatStep1 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedAndRepeatStep1 = function(key){
    var index = this.selectedUserTargetIndex();
    switch (this.subStep){
    case 0:
    case 2:
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Up) ||
            DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Left))
        {
            index = this.indexArrowUp();
        }
        else if
        (DatasKeyBoard.isKeyEqual(key,
                                  $datasGame.keyBoard.menuControls.Down) ||
         DatasKeyBoard.isKeyEqual(key,
                                  $datasGame.keyBoard.menuControls.Right))
        {
            index = this.indexArrowDown();
        }

        if (this.subStep === 0)
            this.selectedUserIndex = index;
        else
            this.selectedTargetIndex = index;
        this.moveArrow();

        break;
    case 1:
        this.windowChoicesBattleCommands.onKeyPressedAndRepeat(key);
        break;
    }
};

// -------------------------------------------------------

SceneBattle.prototype.draw3DStep1 = function(canvas){

};

// -------------------------------------------------------

SceneBattle.prototype.drawHUDStep1 = function(context){
    this.windowTopInformations.draw(context);

    // Draw battlers
    this.drawBattlers(context);
    this.windowCharacterInformations.draw(context);

    this.arrowSelection.draw(context);
    if (this.subStep === 1){
        this.windowChoicesBattleCommands.draw(context);
    }
};
