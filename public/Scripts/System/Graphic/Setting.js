/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { Enum } from '../Common/index.js';
var TitleSettingKind = Enum.TitleSettingKind;
var Align = Enum.Align;
import { Datas, Graphic } from '../index.js';
/** @class
 *  A class for all settings to display in screen.
 *  @extends Graphic.Base
 *  @param {number} id -
 */
class Setting extends Base {
    constructor(id) {
        super();
        let textLeft, textInformation;
        switch (id) {
            case TitleSettingKind.KeyboardAssigment:
                textLeft = Datas.Languages.extras.keyboardAssignment.name();
                textInformation = Datas.Languages.extras.keyboardAssignmentDescription.name();
                this.graphicRight = new Graphic.Text("...", { align: Align
                        .Center });
                break;
            case TitleSettingKind.Language:
                textLeft = Datas.Languages.extras.language.name();
                textInformation = Datas.Languages.extras.languageDescription.name();
                this.graphicRight = new Graphic.Text("...", { align: Align
                        .Center });
                break;
        }
        this.graphicTextLeft = new Graphic.Text(textLeft);
        this.graphicTextInformation = new Graphic.Text(textInformation, { align: Align.Center });
    }
    /**
     *  Drawing the choice.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    drawChoice(x, y, w, h) {
        this.graphicTextLeft.draw(x, y, w, h);
        this.graphicRight.draw(x + (w / 2), y, w / 2, h);
    }
    /**
     *  Drawing the settings informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    draw(x, y, w, h) {
        this.graphicTextInformation.draw(x, y, w, h);
    }
}
export { Setting };
