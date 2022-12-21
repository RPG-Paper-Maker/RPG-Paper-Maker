/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Graphic, Datas } from "../index.js";
import { Base } from "./Base.js";
import { Utils, Constants, Enum, ScreenResolution } from "../Common/index.js";
/** @class
 *  The graphic displaying the player minimal stats informations.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 *  @param {boolean} [reverse=false] - Indicate if the faceset should be reversed
 */
class Statistic extends Base {
    constructor(player, statistic, offsetStat) {
        super();
        this.player = player;
        this.statistic = statistic;
        this.graphicName = new Graphic.Text(statistic.name() + Constants
            .STRING_COLON);
        this.maxStatNamesLength = 0;
        if (Utils.isUndefined(offsetStat)) {
            this.graphicName.measureText();
            if (this.graphicName.textWidth > this.maxStatNamesLength) {
                this.maxStatNamesLength = this.graphicName.textWidth;
            }
        }
        else {
            this.maxStatNamesLength = offsetStat;
        }
        let txt = Utils.numToString(this.player[statistic.abbreviation]);
        if (!statistic.isFix) {
            txt += Constants.STRING_SLASH + this.player[statistic.getMaxAbbreviation()];
            this.pictureBar = Datas.Pictures.get(Enum.PictureKind.Bars, this
                .statistic.pictureBarID);
        }
        this.graphicValue = new Graphic.Text(txt);
    }
    /**
     *  Set the font size and the final font.
     *  @param {number} fontSize - The new font size
     */
    setFontSize(fontSize) {
        this.graphicName.setFontSize(fontSize);
        this.graphicValue.setFontSize(fontSize);
    }
    /**
     *  Update the graphics
     */
    update() {
        let txt = Utils.numToString(this.player[this.statistic.abbreviation]);
        if (!this.statistic.isFix) {
            txt += Constants.STRING_SLASH + this.player[this.statistic.getMaxAbbreviation()];
        }
        this.graphicValue.setText(txt);
    }
    /**
     *  Drawing statistic bar.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    drawChoice(x, y, w, h) {
        this.draw(x, y, w, h);
    }
    /**
     *  Drawing statistic bar.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    draw(x, y, w, h) {
        let height = 0;
        let offset = 0;
        if (this.pictureBar && this.pictureBar.picture) {
            this.pictureBar.picture.draw({ x: x, y: y, sw: this.pictureBar.picture
                    .oW / 2, w: this.pictureBar.picture.oW / 2 });
            let percent = this.player[this.statistic.abbreviation] / this.player[this.statistic.getMaxAbbreviation()];
            this.pictureBar.picture.draw({ x: x + ScreenResolution.getScreenMinXY(this.pictureBar.borderLeft), y: y, sx: (this.pictureBar.picture
                    .oW / 2) + this.pictureBar.borderLeft, sw: Math.ceil(((this
                    .pictureBar.picture.oW / 2) - (this.pictureBar.borderLeft + this
                    .pictureBar.borderRight)) * percent), w: Math.ceil(((this
                    .pictureBar.picture.oW / 2) - (this.pictureBar.borderLeft + this
                    .pictureBar.borderRight)) * percent) });
            height = this.pictureBar.picture.h;
            offset = ScreenResolution.getScreenY(-5);
        }
        y += (height / 2) + offset;
        this.graphicName.draw(x, y, 0, 0);
        this.graphicValue.draw(x + this.maxStatNamesLength + ScreenResolution
            .getScreenMinXY(10), y, 0, 0);
    }
}
export { Statistic };
