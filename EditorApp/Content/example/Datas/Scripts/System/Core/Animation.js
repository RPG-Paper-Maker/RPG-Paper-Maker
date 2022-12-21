/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "../index.js";
import { Enum } from "../Common/index.js";
/** @class
 *  An animation instance.
 *  @param {number} id - The ID of the status
 */
class Animation {
    constructor(id, loop = false) {
        this.system = Datas.Animations.get(id);
        if (this.system) {
            this.picture = Datas.Pictures.getPictureCopy(Enum.PictureKind.Animations, this.system.pictureID);
            this.frame = 0;
            this.loop = loop;
        }
    }
    /**
     *  Update frame.
     */
    update() {
        this.frame++;
        if (this.loop) {
            this.frame = this.frame % this.system.frames.length;
        }
    }
    /**
     *  Draw the animation on top of battler.
     */
    playSounds(conditionKind) {
        if (this.system) {
            this.system.playSounds(this.frame, conditionKind);
        }
    }
    /**
     *  Draw the animation on top of battler.
     */
    draw(battler) {
        if (this.system) {
            this.system.draw(this.picture, this.frame, battler);
        }
    }
}
export { Animation };
