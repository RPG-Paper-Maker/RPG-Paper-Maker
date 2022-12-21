/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Graphic, Datas } from "../index.js";
import { Constants, ScreenResolution, Utils } from "../Common/index.js";
/** @class
 *  The graphic displaying all the stats modifications in the equip menu.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 *  @param {number[]} newValues - The new values of statistics with the
 *  equipment we are currently trying to equip. This array is empty if we are
 *  not trying to equip something
 */
class EquipStats extends Base {
    constructor(gamePlayer, newValues, displayAll = true) {
        super();
        this.isChanging = newValues.length !== 0;
        this.displayAll = displayAll;
        // All the graphics
        this.listStatsNames = new Array;
        this.listStats = new Array;
        this.listNewStats = new Array;
        let maxLength = 0;
        let maxLengthValue = 0;
        let id, statistic, graphicName, txt, graphicValue, baseValue, newValue;
        for (let i = 0, j = 0, l = Datas.BattleSystems.statisticsOrder.length; i
            < l; i++) {
            id = Datas.BattleSystems.statisticsOrder[i];
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic) {
                statistic = Datas.BattleSystems.getStatistic(id);
                if (statistic.isRes) {
                    continue;
                }
                // Value of the stat
                baseValue = gamePlayer[statistic.abbreviation];
                txt = Utils.numToString(baseValue);
                if (!statistic.isFix) {
                    baseValue = gamePlayer[statistic.getMaxAbbreviation()];
                    txt += Constants.STRING_SLASH + baseValue;
                }
                newValue = newValues[id];
                if (this.isChanging && !this.displayAll && baseValue === newValue) {
                    continue;
                }
                // Name of the stat
                graphicName = new Graphic.Text(statistic.name() + Constants
                    .STRING_COLON);
                maxLength = Math.max(graphicName.textWidth, maxLength);
                this.listStatsNames.push(graphicName);
                // Value and new value
                graphicValue = new Graphic.Text(txt);
                maxLengthValue = Math.max(graphicValue.textWidth, maxLengthValue);
                this.listStats.push(graphicValue);
                if (this.isChanging) {
                    txt = statistic.isFix ? Utils.numToString(newValue) : Math
                        .min(gamePlayer[statistic.abbreviation], newValue) +
                        Constants.STRING_SLASH + newValue;
                    this.listNewStats.push(new Graphic.Text(txt));
                }
                j++;
            }
        }
        // Lengths
        this.nameLength = maxLength;
        this.valueLength = maxLengthValue;
        // Arrow
        this.graphicArrow = new Graphic.Text("->");
    }
    /**
     *  Drawing the statistics modifications.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    drawChoice(x, y, w, h) {
        let xStats = x + ScreenResolution.getScreenMinXY(Constants.LARGE_SPACE);
        let yStats = y + ScreenResolution.getScreenMinXY(Constants.HUGE_SPACE);
        let yStat, xStat;
        for (let i = 0, l = this.listStatsNames.length; i < l; i++) {
            yStat = yStats + (i * ScreenResolution.getScreenMinXY(Constants.HUGE_SPACE));
            this.listStatsNames[i].draw(xStats, yStat, 0, 0);
            xStat = xStats + this.nameLength + ScreenResolution.getScreenMinXY(Constants.LARGE_SPACE);
            this.listStats[i].draw(xStat, yStat, 0, 0);
            if (this.isChanging) {
                xStat += this.valueLength + ScreenResolution.getScreenMinXY(Constants.LARGE_SPACE);
                this.graphicArrow.draw(xStat, yStat, 0, 0);
                xStat += this.graphicArrow.textWidth + ScreenResolution
                    .getScreenMinXY(Constants.HUGE_SPACE);
                this.listNewStats[i].draw(xStat, yStat, 0, 0);
            }
        }
    }
    /**
     *  Drawing the statistics modifications.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    draw(x, y, w, h) {
        this.drawChoice(x, y, w, h);
    }
}
export { EquipStats };
