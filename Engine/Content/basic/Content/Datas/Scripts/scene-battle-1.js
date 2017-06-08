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

SceneBattle.prototype.moveArrow = function(){
    var dim = this.battlers[this.kindSelection][this.selectedUserTargetIndex()]
              .rect.windowDimension;
    this.arrowSelection.windowDimension =
         [dim[0] + (dim[2]/2) - 3,dim[1] + dim[3] + 10,6,6];

    // Updating window informations
    this.windowCharacterInformations.content =
         this.battlers[this.kindSelection][this.selectedUserTargetIndex()]
         .character.createBattleDescriptionGraphics();
};

// -------------------------------------------------------

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

// -------------------------------------------------------
// createBattleDescriptionGraphics: create graphic for description state display
GamePlayer.prototype.createBattleDescriptionGraphics = function(){
    var item = this.getCharacterInformations();
    var cl = $datasGame.classes.list[item.idClass];
    var levelStat = $datasGame.battleSystem.getLevelStatistic();

    var obj = {
        textName: new GraphicText(item.name, Align.Left),
        textLevelName: new GraphicText(levelStat.name, Align.Left),
        textLevel: new GraphicText("" + this[levelStat.abbreviation],
                                   Align.Left),

        drawInformations: function(context, x, y, w, h){
            var yName = y + 10;
            this.textName.draw(context, x, yName, 0, 0);
            var xLevelName = x +
                    context.measureText(this.textName.text).width + 10;
            this.textLevelName.draw(context, xLevelName, yName, 0, 0);
            var xLevel = xLevelName +
                    context.measureText(this.textLevelName.text).width;
            this.textLevel.draw(context, xLevel, yName, 0, 0);
            var yStats = yName + 20;

            // Stats
            var i, l = this.listStatsNames.length;
            for (i = 0; i < l; i++){
                var xStat = x;
                var yStat = yStats + (i*20);
                this.listStatsNames[i].draw(context, xStat, yStat, 0, 0);
                this.listStats[i].draw(context,
                                       xStat + this.maxStatNamesLength + 10,
                                       yStat, 0, 0);
            }
        },
    };

    // Adding stats:
    var context = $canvasHUD.getContext('2d');
    obj.listStatsNames = [];
    obj.listStats = [];
    obj.maxStatNamesLength = 0;
    var i, j = 0, l = $datasGame.battleSystem.statisticsOrder.length;
    for (i = 0; i < l; i++){
        var id = $datasGame.battleSystem.statisticsOrder[i];
        if (id !== $datasGame.battleSystem.idLevelStatistic &&
            id !== $datasGame.battleSystem.idExpStatistic)
        {
            var statistic = $datasGame.battleSystem.statistics[id];

            // Only display bars
            if (!statistic.isFix){
                var textName = new GraphicText(statistic.name + ":",
                                               Align.Left);
                context.font = textName.font;
                var c = context.measureText(textName.text).width;
                if (c > obj.maxStatNamesLength) obj.maxStatNamesLength = c;
                obj.listStatsNames.push(textName);
                var txt = "" + this[statistic.abbreviation];
                if (!statistic.isFix)
                    txt += "/" + this["max" + statistic.abbreviation];
                obj.listStats.push(new GraphicText(txt, Align.Left));
                j++;
            }
        }
    }

    return obj;
};
