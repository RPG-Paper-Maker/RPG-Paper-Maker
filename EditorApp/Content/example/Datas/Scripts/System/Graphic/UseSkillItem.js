/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Graphic, Manager, Datas, Scene } from "../index.js";
import { Mathf, ScreenResolution } from "../Common/index.js";
import { Battler, Game } from "../Core/index.js";
/** @class
 *  The graphic displaying a skill or an item use.
 *  @extends Graphic.Base
 */
class UseSkillItem extends Base {
    constructor({ hideArrow = false } = {}) {
        super();
        this.graphicCharacters = new Array;
        let player;
        for (let i = 0, l = Game.current.teamHeroes.length; i < l; i++) {
            player = new Graphic.Player(Game.current.teamHeroes[i]);
            player.initializeCharacter(true);
            this.graphicCharacters.push(player);
        }
        this.hideArrow = hideArrow;
    }
    /**
     *  Get the selected player.
     *  @returns {Core.Player}
     */
    getSelectedPlayer() {
        return this.graphicCharacters[this.indexArrow].player;
    }
    /**
     *  Set skill item.
     *  @param {System.CommonSkillItem} skillItem
     */
    setSkillItem(skillItem) {
        this.skillItem = skillItem;
    }
    /**
     *  Set if all targets are selected or not.
     *  @param {boolean} b - Indicate if all the targets are selected
     */
    setAll(b) {
        this.all = b;
        if (b) {
            let l = Game.current.teamHeroes.length;
            Scene.Map.current.targets = new Array(l);
            for (let i = 0; i < l; i++) {
                Scene.Map.current.targets[i] = new Battler(Game.current
                    .teamHeroes[i]);
            }
        }
        else {
            this.indexArrow = -1;
            this.goRight();
        }
    }
    /**
     *  Udpate the battler.
     */
    updateStats() {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].update();
        }
    }
    /**
     *  Move arrow left.
     */
    goLeft() {
        this.moveArrow(-1);
    }
    /**
     *  Move arrow right.
     */
    goRight() {
        this.moveArrow(1);
    }
    /**
     *  Move an arrow according to index.
     *  @param {number} index - The corresponding index
     */
    moveArrow(index) {
        if (!this.all) {
            let target;
            do {
                this.indexArrow = Mathf.mod(this.indexArrow + index, this
                    .graphicCharacters.length);
                target = Game.current.teamHeroes[this.indexArrow];
            } while (!this.skillItem.isPossible(target));
            Scene.Map.current.targets = [new Battler(target)];
            Manager.Stack.requestPaintHUD = true;
            Datas.Systems.soundCursor.playSound();
        }
    }
    /**
     *  Update stat short.
     *  @param {number} equipmentID
     *  @param {System.CommonSkillItem} weaponArmor
     */
    updateStatShort(weaponArmor) {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].updateStatShort(weaponArmor);
        }
    }
    /**
     *  Update stat short to none.
     */
    updateStatShortNone() {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].updateStatShortNone();
        }
    }
    /**
     *  A widget move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey, options = {}) {
        if (isKey) {
            this.onKeyPressedAndRepeat(options.key);
        }
        else {
            this.onMouseMove(options.x, options.y);
        }
    }
    /**
     *  Update the battler frame.
     */
    update() {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].updateBattler();
        }
    }
    /**
     *  Key pressed repeat handle, but with a small wait after the first
     *  pressure.
     *  @param {number} key - The key ID pressed
     */
    onKeyPressedAndRepeat(key) {
        if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Right)) {
            this.goRight();
        }
        else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
            .Left)) {
            this.goLeft();
        }
    }
    /**
     *  Mouse move handle for the current stack.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseMove(x, y) {
        if (!this.all) {
            let changed = false;
            let i, l;
            for (i = 0, l = this.graphicCharacters.length; i < l; i++) {
                if (this.graphicCharacters[i].battlerRect.isInside(x, y)) {
                    changed = true;
                    break;
                }
            }
            if (changed && i !== this.indexArrow) {
                let target = Game.current.teamHeroes[i];
                if (this.skillItem.isPossible(target)) {
                    this.indexArrow = i;
                    Scene.Map.current.targets = [new Battler(target)];
                    Manager.Stack.requestPaintHUD = true;
                    Datas.Systems.soundCursor.playSound();
                }
            }
        }
    }
    /**
     *  Draw an arrow at a specific index.
     *  @param {number} index - The corresponding index
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     *  @param {number} h - The h size
     */
    drawArrowAtIndex(index, x, y, h) {
        Datas.Systems.getCurrentWindowSkin().drawArrowTarget(this
            .graphicCharacters[index].battlerFrame.value, x + ScreenResolution
            .getScreenMinXY(32) + (index * 85), y + h - ScreenResolution
            .getScreenMinXY(20));
    }
    /**
     *  Drawing the skill or item use informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x, y, w, h) {
        this.draw(x, y, w, h);
    }
    /**
     *  Drawing the skill or item use informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x, y, w, h) {
        let i, l;
        for (i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].drawCharacter(x + ScreenResolution
                .getScreenMinXY(5 + (i * 85)), y - ScreenResolution
                .getScreenMinXY(32), w, h);
        }
        if (!this.hideArrow) {
            if (this.all) {
                for (i = 0; i < l; i++) {
                    this.drawArrowAtIndex(i, x, y, h);
                }
            }
            else {
                this.drawArrowAtIndex(this.indexArrow, x, y, h);
            }
        }
    }
}
export { UseSkillItem };
