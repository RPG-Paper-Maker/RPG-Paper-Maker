/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas, Graphic } from '../index.js';
import { Base } from './Base.js';
import { Enum, ScreenResolution, Utils } from '../Common/index.js';
var Align = Enum.Align;
/** @class
 *  The graphic displaying a save.
 *  @extends Graphic.Base
 *  @param {Game} game
 */
class Save extends Base {
    constructor(game) {
        super();
        this.game = game;
        this.graphicSlot = new Graphic.Text(Datas.Languages.extras.slot.name() +
            " " + this.game.slot, { align: Align.Center });
        if (this.game.isEmpty) {
            this.graphicEmpty = new Graphic.Text(Datas.Languages.extras.empty
                .name(), { align: Align.Center });
        }
        else {
            this.graphicTimer = new Graphic.Text(Utils.getStringDate(this.game
                .playTime.getSeconds()), { align: Align.Right });
            let l = this.game.teamHeroes.length;
            this.graphicPlayers = new Array(l);
            let graphic;
            for (let i = 0; i < l; i++) {
                graphic = new Graphic.Player(this.game.teamHeroes[i]);
                graphic.initializeCharacter();
                this.graphicPlayers[i] = graphic;
            }
        }
    }
    /**
     *  Update the battler graphics.
     */
    update() {
        for (let i = 0, l = this.graphicPlayers.length; i < l; i++) {
            this.graphicPlayers[i].updateBattler();
        }
    }
    /**
     *  Drawing the save slot.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x, y, w, h) {
        this.graphicSlot.draw(x, y, w, h);
    }
    /** Drawing the save informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x, y, w, h) {
        if (this.game.isEmpty) {
            this.graphicEmpty.draw(x, y, w, h);
        }
        else {
            this.graphicTimer.draw(x, y, w, ScreenResolution.getScreenMinXY(20));
            for (let i = 0, l = this.graphicPlayers.length; i < l; i++) {
                this.graphicPlayers[i].drawCharacter(x + ScreenResolution
                    .getScreenMinXY(5 + (i * 115)), y + ScreenResolution
                    .getScreenMinXY(20), w, h);
            }
        }
    }
}
export { Save };
