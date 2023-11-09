/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "../index.js";
import { Constants, Enum, ScreenResolution } from '../Common/index.js';
/** @class
 *  A status affected to a player.
 *  @param {number} id - The ID of the status
 */
class Status {
    constructor(id, turn = 0) {
        this.id = id;
        this.system = Datas.Status.get(id);
        this.turn = turn;
        this.picture = Datas.Pictures.getPictureCopy(Enum.PictureKind.Icons, this.system.pictureID);
    }
    /**
     *  Get message and replace target name.
     *  @static
     *  @param {System.DynamicValue} message
     *  @param {Battler} target
     *  @returns {string}
     */
    static getMessage(message, target) {
        return message.getValue().replace("[target]", target.player.name);
    }
    /**
     *  Draw the status on top of battler.
     *  @static
     *  @param {Status[]} statusList
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     *  @param {Enum.Align} [align=Enum.Align.Left]
     */
    static drawList(statusList, x, y, align = Enum.Align.Left) {
        let l = statusList.length;
        let totalWidth = l * ScreenResolution.getScreenMinXY(Datas.Systems.iconsSize);
        let s;
        if (l > 1) {
            totalWidth += (l - 1) * ScreenResolution.getScreenMinXY(Constants
                .MEDIUM_SPACE);
        }
        let xOffset = 0;
        switch (align) {
            case Enum.Align.Left:
                totalWidth = 0;
                break;
            case Enum.Align.Center:
                totalWidth /= 2;
                break;
        }
        for (let i = 0, l = statusList.length; i < l; i++) {
            s = statusList[i];
            xOffset += ScreenResolution.getScreenMinXY(Datas.Systems.iconsSize);
            s.draw(x - totalWidth + xOffset + ScreenResolution.getScreenMinXY(i
                * Constants.MEDIUM_SPACE) - ScreenResolution.getScreenMinXY(Datas
                .Systems.iconsSize), y - ScreenResolution.getScreenMinXY(Datas
                .Systems.iconsSize));
        }
    }
    /**
     *  Get message when ally affected.
     *  @param {Battler} target
     *  @returns {string}
     */
    getMessageAllyAffected(target) {
        return Status.getMessage(this.system.messageAllyAffected, target);
    }
    /**
     *  Get message when enemy affected.
     *  @param {Battler} target
     *  @returns {string}
     */
    getMessageEnemyAffected(target) {
        return Status.getMessage(this.system.messageEnemyAffected, target);
    }
    /**
     *  Get message when healed.
     *  @param {Battler} target
     *  @returns {string}
     */
    getMessageHealed(target) {
        return Status.getMessage(this.system.messageStatusHealed, target);
    }
    /**
     *  Get message when still affected.
     *  @param {Battler} target
     *  @returns {string}
     */
    getMessageStillAffected(target) {
        return Status.getMessage(this.system.messageStatusStillAffected, target);
    }
    /**
     *  Draw the status on top of battler.
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     */
    draw(x, y) {
        this.picture.draw({ x: x, y: y, sx: this.system.pictureIndexX * Datas
                .Systems.iconsSize, sy: this.system.pictureIndexY * Datas.Systems
                .iconsSize, sw: Datas.Systems.iconsSize, sh: Datas.Systems.iconsSize,
            w: ScreenResolution.getScreenMinXY(Datas.Systems.iconsSize), h: ScreenResolution.getScreenMinXY(Datas.Systems.iconsSize) });
    }
}
export { Status };
