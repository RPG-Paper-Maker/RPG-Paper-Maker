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
//  CLASS GraphicPlayer
//
// -------------------------------------------------------

function GraphicPlayer(player){
    var character, cl, levelStat;

    // Informations
    character = player.getCharacterInformations();
    cl = $datasGame.classes.list[character.idClass];
    levelStat = $datasGame.battleSystem.getLevelStatistic();

    // All the graphics
    this.graphicName = new GraphicText(character.name, Align.Left);
    this.graphicClass = new GraphicText(cl.name, Align.Left, 10);
    this.graphicLevelName = new GraphicText(levelStat.name, Align.Left);
    this.graphicLevel = new GraphicText("" + player[levelStat.abbreviation],
                                        Align.Left);
}

GraphicPlayer.prototype = {

    draw: function(context, x, y, w, h){
        var xCharacter, yName, xLevelName, xLevel, yClass;

        xCharacter = x + 80;
        yName = y + 20;
        this.graphicName.draw(context, xCharacter, yName, 0, 0);
        xLevelName = xCharacter +
                context.measureText(this.graphicName.text).width + 10;
        this.graphicLevelName.draw(context, xLevelName, yName, 0, 0);
        xLevel = xLevelName +
                context.measureText(this.graphicLevelName.text).width;
        this.graphicLevel.draw(context, xLevel, yName, 0, 0);
        yClass = yName + 20;
        this.graphicClass.draw(context, xCharacter, yClass, 0, 0);
    },

    drawInformations: function(context, x, y, w, h){
        this.draw(context, x, y, w, h);
    }
}
