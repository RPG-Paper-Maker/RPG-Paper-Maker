/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Graphic, Datas, System, Manager } from "../index.js";
import { Frame, Rectangle } from "../Core/index.js";
import { Base } from "./Base.js";
import { Utils, Constants, Enum, ScreenResolution } from "../Common/index.js";
var PictureKind = Enum.PictureKind;
import { Status } from "../Core/Status.js";
/** @class
 *  The graphic displaying the player minimal stats informations.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 *  @param {boolean} [reverse=false] - Indicate if the faceset should be reversed
 */
class Player extends Base {
    constructor(player, { isMainMenu = false, reverse = false } = {}) {
        super();
        this.battlerRect = new Rectangle();
        this.player = player;
        this.isMainMenu = isMainMenu;
        this.reverse = reverse;
        // Informations
        let hero = this.player.system;
        let cl = this.player.getClass();
        let levelStat = Datas.BattleSystems.getLevelStatistic();
        let expStat = Datas.BattleSystems.getExpStatistic();
        // All the graphics
        this.graphicName = new Graphic.Text(this.player.name);
        this.graphicClass = new Graphic.Text(cl.name(), { fontSize: 10 });
        this.graphicLevelName = new Graphic.Text(levelStat.name());
        this.graphicLevel = new Graphic.Text(Utils.numToString(this.player[levelStat.abbreviation]));
        if (expStat === null) {
            this.graphicExpName = null;
        }
        else {
            this.graphicExpName = new Graphic.Text(expStat.name(), { fontSize: Constants.MEDIUM_FONT_SIZE });
            this.graphicExp = new Graphic.Text(this.player.getBarAbbreviation(expStat), { fontSize: Constants.MEDIUM_FONT_SIZE });
        }
        // Adding stats
        this.listStatistics = [];
        this.maxStatNamesLength = 0;
        let statistics;
        let i, l;
        if (this.isMainMenu) {
            l = Datas.Systems.heroesStatistics.length;
            statistics = new Array(l);
            for (i = 0; i < l; i++) {
                statistics[i] = Datas.Systems.heroesStatistics[i].getValue();
            }
        }
        else {
            statistics = Datas.BattleSystems.statisticsOrder;
        }
        let id, statistic, graphic;
        for (i = 0, l = statistics.length; i < l; i++) {
            id = statistics[i];
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic) {
                statistic = Datas.BattleSystems.getStatistic(id);
                // Only display bars
                if (!statistic.isFix) {
                    graphic = new Graphic.Statistic(this.player, statistic);
                    if (graphic.maxStatNamesLength > this.maxStatNamesLength) {
                        this.maxStatNamesLength = graphic.maxStatNamesLength;
                    }
                    this.listStatistics.push(graphic);
                }
            }
        }
        for (graphic of this.listStatistics) {
            graphic.maxStatNamesLength = this.maxStatNamesLength;
        }
        // Faceset
        this.faceset = Datas.Pictures.getPictureCopy(PictureKind.Facesets, hero
            .idFaceset);
        if (this.reverse) {
            this.faceset.setLeft(Datas.Systems.getCurrentWindowSkin().borderBotLeft[2]);
        }
        else {
            this.faceset.setRight(true, Datas.Systems.getCurrentWindowSkin().borderBotRight[2]);
        }
        this.faceset.setBot(true, Datas.Systems.getCurrentWindowSkin().borderBotRight[3]);
        this.faceset.reverse = this.reverse;
        // Battler
        this.battler = Datas.Pictures.getPictureCopy(PictureKind.Battlers, hero
            .idBattler);
        this.battlerFrame = new Frame(250, { frames: Datas.Systems.battlersFrames });
        // Level up
        this.graphicLevelUp = new Graphic.Text("Level up!");
        this.displayNameLevel = true;
    }
    /**
     *  Update the reverse value for faceset.
     *  @param {boolean} reverse - The reverse value
     */
    updateReverse(reverse) {
        if (reverse) {
            this.faceset.setLeft(Datas.Systems.getCurrentWindowSkin().borderBotLeft[2]);
        }
        else {
            this.faceset.setRight(true, Datas.Systems.getCurrentWindowSkin().borderBotRight[2]);
        }
        this.faceset.reverse = reverse;
        this.reverse = reverse;
    }
    /**
     *  Update the graphics
     */
    update() {
        // Informations
        let cl = this.player.getClass();
        let levelStat = Datas.BattleSystems.getLevelStatistic();
        // All the graphics
        this.graphicName.setText(this.player.name);
        this.graphicClass.setText(cl.name());
        this.graphicLevelName.setText(levelStat.name());
        this.graphicLevel.setText(Utils.numToString(this.player[levelStat
            .abbreviation]));
        for (let graphic of this.listStatistics) {
            graphic.update();
        }
    }
    /**
     *  Update experience graphics.
     */
    updateExperience() {
        this.graphicLevel.setText(Utils.numToString(this.player[Datas
            .BattleSystems.getLevelStatistic().abbreviation]));
        this.graphicExp.setText(this.player.getBarAbbreviation(Datas
            .BattleSystems.getExpStatistic()));
    }
    /**
     *  Initialize character graphics font size.
     *  @param {boolean} [noDisplayNameLevel=false] - Indicate if the level up
     *  should be displayed or not
     */
    initializeCharacter(noDisplayNameLevel = false) {
        if (noDisplayNameLevel) {
            this.displayNameLevel = false;
        }
        this.graphicName.setFontSize(Constants.MEDIUM_FONT_SIZE);
        this.graphicLevelName.setFontSize(Constants.MEDIUM_FONT_SIZE);
        this.graphicLevel.setFontSize(Constants.MEDIUM_FONT_SIZE);
        for (let graphic of this.listStatistics) {
            graphic.setFontSize(Constants.SMALL_FONT_SIZE);
        }
    }
    /**
     *  Update battler frame.
     */
    updateBattler() {
        if (this.battlerFrame.update()) {
            Manager.Stack.requestPaintHUD = true;
        }
    }
    /**
     *  Update stat short.
     *  @param {number} equipmentID
     *  @param {System.CommonSkillItem} weaponArmor
     */
    updateStatShort(weaponArmor) {
        let totalBonus = this.player.getBestWeaponArmorToReplace(weaponArmor)[0];
        if (totalBonus > 0) {
            this.graphicStatShort = new Graphic.Text("^", { color: System.Color.GREEN });
        }
        else if (totalBonus < 0) {
            this.graphicStatShort = new Graphic.Text("ˇ", { color: System.Color.RED });
        }
        else {
            this.graphicStatShort = new Graphic.Text("-", { color: System.Color.GREY });
        }
    }
    /**
     *  Update stat short to none.
     */
    updateStatShortNone() {
        this.graphicStatShort = null;
    }
    /**
     *  Drawing the character.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawCharacter(x, y, w, h) {
        // Battler
        let yOffset = ScreenResolution.getScreenMinXY(100);
        let coef = Constants.BASIC_SQUARE_SIZE / Datas.Systems.SQUARE_SIZE;
        let wBattler = this.battler.w / Datas.Systems.battlersFrames;
        let hBattler = this.battler.h / Datas.Systems.battlersColumns;
        let owBattler = this.battler.oW / Datas.Systems.battlersFrames;
        let ohBattler = this.battler.oH / Datas.Systems.battlersColumns;
        this.battlerRect.setCoords(x, y + yOffset - (hBattler * coef) -
            ScreenResolution.getScreenMinXY(15), wBattler * coef, hBattler * coef);
        this.battler.draw({ x: this.battlerRect.x, y: this.battlerRect.y, w: owBattler * coef, h: ohBattler * coef, sx: this.battlerFrame.value * owBattler,
            sy: 0, sw: owBattler, sh: ohBattler });
        // Stats
        let xOffset = this.graphicName.textWidth;
        if (this.graphicStatShort) {
            this.graphicStatShort.draw(x, y + yOffset - ScreenResolution
                .getScreenMinXY(15), 0, 0);
        }
        if (this.displayNameLevel) {
            this.graphicName.draw(x, y + yOffset, 0, 0);
            xOffset = this.graphicName.textWidth + ScreenResolution
                .getScreenMinXY(Constants.MEDIUM_SPACE);
            this.graphicLevelName.draw(x + xOffset, y + yOffset, 0, 0);
            xOffset += this.graphicLevelName.textWidth;
            this.graphicLevel.draw(x + xOffset, y + yOffset, 0, 0);
            yOffset += ScreenResolution.getScreenMinXY(15);
        }
        let yStat;
        for (let i = 0, l = this.listStatistics.length; i < l; i++) {
            yStat = yOffset + (i * ScreenResolution.getScreenMinXY(12));
            this.listStatistics[i].draw(x, y + yStat, w, h);
        }
    }
    /**
     *  Drawing the player in choice box in the main menu.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    drawChoice(x, y, w, h) {
        let xCharacter = x + ScreenResolution.getScreenMinXY(80);
        let yName = y + ScreenResolution.getScreenMinXY(20);
        let coef = Constants.BASIC_SQUARE_SIZE / Datas.Systems.SQUARE_SIZE;
        let wBattler = this.battler.w / Datas.Systems.battlersFrames;
        let owBattler = this.battler.oW / Datas.Systems.battlersFrames;
        let ohBattler = this.battler.oH / Datas.Systems.battlersColumns;
        // Battler
        this.battler.draw({ x: x + (ScreenResolution.getScreenMinXY(80) -
                (wBattler * coef)) / 2, y: y, w: owBattler * coef, h: ohBattler
                * coef, sx: this.battlerFrame.value * owBattler, sy: 0, sw: owBattler,
            sh: ohBattler });
        // Stats
        this.graphicName.draw(xCharacter, yName, 0, 0);
        let xLevelName = xCharacter + this.graphicName.textWidth + ScreenResolution
            .getScreenMinXY(Constants.MEDIUM_SPACE);
        this.graphicLevelName.draw(xLevelName, yName, 0, 0);
        let xLevel = xLevelName + this.graphicLevelName.textWidth;
        this.graphicLevel.draw(xLevel, yName, 0, 0);
        let xStatus = xLevel + this.graphicLevel.textWidth;
        if (this.player.status.length > 0) {
            Status.drawList(this.player.status, xStatus, yName);
        }
        // Right stats
        if (this.isMainMenu) {
            let xStat = x + w - ScreenResolution.getScreenMinXY(125);
            let i, l, yStat;
            for (i = 0, l = this.listStatistics.length; i < l; i++) {
                yStat = yName + ScreenResolution.getScreenMinXY(i * 20);
                this.listStatistics[i].draw(xStat, yStat, w, h);
            }
        }
        // Level up
        if (this.player.levelingUp) {
            this.graphicLevelUp.draw(xLevel + this.graphicLevel.textWidth +
                ScreenResolution.getScreenMinXY(Constants.MEDIUM_SPACE), yName, 0, 0);
        }
        let yClass = yName + ScreenResolution.getScreenMinXY(15);
        this.graphicClass.draw(xCharacter, yClass, 0, 0);
        let yExp = yClass + ScreenResolution.getScreenMinXY(29);
        if (this.graphicExpName !== null) {
            this.graphicExpName.draw(xCharacter, yExp, 0, 0);
            this.graphicExp.draw(xCharacter + this.graphicExpName.textWidth +
                ScreenResolution.getScreenMinXY(Constants.MEDIUM_SPACE), yExp, 0, 0);
        }
    }
    /**
     *  Drawing the player informations in battles.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    draw(x, y, w, h) {
        let wName = this.graphicName.textWidth;
        let wLevelName = this.graphicLevelName.textWidth;
        let xLevelName = x + wName + ScreenResolution.getScreenMinXY(Constants
            .MEDIUM_SPACE);
        let xLevel = xLevelName + wLevelName;
        let firstLineLength = xLevel + this.graphicLevel.textWidth;
        let xOffset = this.reverse ? ScreenResolution.getScreenMinXY(Datas.Systems
            .facesetScalingWidth) : 0;
        // Name, level, status
        let yName = y + ScreenResolution.getScreenMinXY(10);
        this.graphicName.draw(x + xOffset, yName, 0, 0);
        this.graphicLevelName.draw(xLevelName + xOffset, yName, 0, 0);
        this.graphicLevel.draw(xLevel + xOffset, yName, 0, 0);
        Status.drawList(this.player.status, firstLineLength, yName);
        let yStats = yName + ScreenResolution.getScreenMinXY(20);
        // Stats
        let i, l, xStat, yStat;
        for (i = 0, l = this.listStatistics.length; i < l; i++) {
            xStat = x + xOffset;
            yStat = yStats + ScreenResolution.getScreenMinXY(i * 20);
            this.listStatistics[i].draw(xStat, yStat, w, h);
        }
        // Faceset
        this.faceset.draw({ sx: this.player.system.indexXFaceset * Datas.Systems
                .facesetsSize, sy: this.player.system.indexYFaceset * Datas.Systems
                .facesetsSize, sw: Datas.Systems.facesetsSize, sh: Datas.Systems
                .facesetsSize, w: Datas.Systems.facesetScalingWidth, h: Datas.Systems
                .facesetScalingHeight });
    }
}
export { Player };
