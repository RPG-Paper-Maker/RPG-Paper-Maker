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
//  CLASS GraphicPlayerDescription
//
// -------------------------------------------------------

/** @class
*   The graphic displaying all the stats in the player description state menu.
*   @property {GraphicText} graphicNameCenter The player's name graphic (for
*   menu choices).
*   @property {GraphicText} graphicName The player's name graphic (for
*   menu description).
*   @property {GraphicText} graphicClass The player's class name graphic.
*   @property {GraphicText} graphicLevelName The player's level name graphic.
*   @property {GraphicText} graphicLevel The player's level graphic.
*   @property {GraphicText} listStatsNames All the player's stats names
*   graphics.
*   @property {GraphicText} listStats All the player's stats values
*   graphics.
*   @property {number} listLength The max length of the stats for each column.
*   @param {GamePlayer} gamePlayer The current selected player.
*/
function GraphicPlayerDescription(gamePlayer){
    var character, cl, levelStat;
    var context;
    var i, j, l, c, maxLength, txt;
    var statistic, graphicName;

    // Informations
    character = gamePlayer.getCharacterInformations();
    cl = $datasGame.classes.list[character.idClass];
    levelStat = $datasGame.battleSystem.getLevelStatistic();

    // All the graphics
    this.graphicNameCenter = new GraphicText(character.name, Align.Center);
    this.graphicName = new GraphicText(character.name, Align.Left);
    this.graphicClass = new GraphicText(cl.name, Align.Left, 10);
    this.graphicLevelName = new GraphicText(levelStat.name, Align.Left);
    this.graphicLevel = new GraphicText("" + gamePlayer[levelStat.abbreviation],
                                        Align.Left);

    // Adding stats
    context = $canvasHUD.getContext('2d');
    this.listStatsNames = new Array;
    this.listStats = new Array;
    this.listLength = new Array;
    j = 0;
    l = $datasGame.battleSystem.statisticsOrder.length;
    maxLength = 0;

    for (i = 0; i < l; i++){
        var id = $datasGame.battleSystem.statisticsOrder[i];
        if (id !== $datasGame.battleSystem.idLevelStatistic &&
            id !== $datasGame.battleSystem.idExpStatistic)
        {
            statistic = $datasGame.battleSystem.statistics[id];
            graphicName = new GraphicText(statistic.name + ":", Align.Left);
            context.font = graphicName.font;
            c = context.measureText(graphicName.text).width;
            if (c > maxLength) maxLength = c;
            if (j%7 === 6){
                this.listLength.push(maxLength);
                maxLength = 0;
            }
            this.listStatsNames.push(graphicName);
            txt = "" + gamePlayer[statistic.abbreviation];
            if (!statistic.isFix)
                txt += "/" + gamePlayer["max" + statistic.abbreviation];
            this.listStats.push(new GraphicText(txt, Align.Left));
            j++;
        }
    }

    this.listLength.push(maxLength);
}

GraphicPlayerDescription.prototype = {

    /** Drawing the player in choice box.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(context, x, y, w, h){
        this.graphicNameCenter.draw(context, x, y, w, h);
    },

    /** Drawing the player description.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(context, x, y, w, h){
        var yName, xLevelName, xLevel, yClass, yStats, xStat, yStat;
        var i, l;

        yName = y + 10;
        this.graphicName.draw(context, x, yName, 0, 0);
        xLevelName = x + context.measureText(this.graphicName.text).width + 10;
        this.graphicLevelName.draw(context, xLevelName, yName, 0, 0);
        xLevel = xLevelName +
                context.measureText(this.graphicLevelName.text).width;
        this.graphicLevel.draw(context, xLevel, yName, 0, 0);
        yClass = yName + 20;
        this.graphicClass.draw(context, x, yClass, 0, 0);
        yStats = yClass + 50;

        // Stats
        l = this.listStatsNames.length;
        for (i = 0; i < l; i++){
            xStat = x + (Math.floor(i/7)*200);
            yStat = yStats + ((i%7)*30);
            this.listStatsNames[i].draw(context, xStat, yStat, 0, 0);
            this.listStats[i].draw(context, xStat +
                                   this.listLength[Math.floor(i/7)] + 10,
                                   yStat, 0, 0);
        }
    }
}
