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
//  CLASS GraphicEquipStats
//
// -------------------------------------------------------

function GraphicEquipStats(gamePlayer, newValues){
    var character, statistic;
    var context, graphicName, graphicValue;
    var i, j, l, id, c, maxLength, maxLengthValue, txt;

    character = gamePlayer.getCharacterInformations();
    this.isChanging = newValues.length !== 0;

    // All the graphics
    context = $canvasHUD.getContext('2d');
    this.listStatsNames = new Array;
    this.listStats = new Array;
    this.listNewStats = new Array;
    j = 0;
    l = $datasGame.battleSystem.statisticsOrder.length;
    maxLength = 0;
    maxLengthValue = 0;
    for (i = 0; i < l; i++){
        id = $datasGame.battleSystem.statisticsOrder[i];
        if (id !== $datasGame.battleSystem.idLevelStatistic &&
            id !== $datasGame.battleSystem.idExpStatistic)
        {
            statistic = $datasGame.battleSystem.statistics[id];

            // Name of the stat
            graphicName = new GraphicText(statistic.name + ":", Align.Left);
            context.font = graphicName.font;
            c = context.measureText(graphicName.text).width;
            if (c > maxLength)
                maxLength = c;
            this.listStatsNames.push(graphicName);

            // Value of the stat
            txt = statistic.isFix ? gamePlayer[statistic.abbreviation]
                                  : gamePlayer["max" + statistic.abbreviation];
            graphicValue = new GraphicText(txt, Align.Left);
            context.font = graphicValue.font;
            c = context.measureText(graphicValue.text).width;
            if (c > maxLengthValue)
                maxLengthValue = c;
            this.listStats.push(graphicValue);

            if (this.isChanging){

                // New values
                txt = statistic.isFix ? (gamePlayer[statistic.abbreviation]
                                         + newValues[id]) :
                                        (gamePlayer["max" +
                                                    statistic.abbreviation]
                                         + newValues[id]);
                this.listNewStats.push(new GraphicText(txt, Align.left));
            }

            j++;
        }
    }

    // Lengths
    this.nameLength = maxLength;
    this.valueLength = maxLengthValue;

    // Arrow
    this.graphicArrow = new GraphicText("->", Align.Left);
    context.font = this.graphicArrow.font;
    this.arrowLength = context.measureText(this.graphicArrow.text).width;
}

GraphicEquipStats.prototype = {

    drawInformations: function(context, x, y, w, h){
        var xStats, yStats, yStat, xStat;
        var i, l;

        xStats = x + 10;
        yStats = y + 20;
        l = this.listStatsNames.length;
        for (i = 0; i < l; i++){
            yStat = yStats + (i*20);
            this.listStatsNames[i].draw(context, xStats, yStat, 0, 0);
            xStat = xStats + this.nameLength + 10;
            this.listStats[i].draw(context, xStat, yStat, 0, 0);

            if (this.isChanging){
                xStat += this.valueLength + 10;
                this.graphicArrow.draw(context, xStat, yStat, 0, 0);
                xStat += this.arrowLength + 20;
                this.listNewStats[i].draw(context, xStat, yStat, 0, 0);
            }
        }
    }
}
