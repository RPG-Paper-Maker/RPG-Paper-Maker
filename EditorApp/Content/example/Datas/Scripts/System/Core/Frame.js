/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Manager, Datas } from "../index.js";
/** @class
 *  A frame for updating animations (characters, battlers, etc.).
 *  @param {number} duration - The frame duration
 *  @param {number} [tick=0] - The frame tick (= time spent since current frame)
 *  @param {number} [value=0] - The current frame value
 */
class Frame {
    constructor(duration, { loop = true, tick = 0, value = 0, frames = Datas.Systems.FRAMES } = {}) {
        this.duration = duration;
        this.loop = loop;
        this.tick = tick;
        this.value = value;
        this.frames = frames;
    }
    /**
     *  Reset the frame.
     */
    reset() {
        this.tick = 0;
        this.value = 0;
    }
    /**
     *  Update frame according to tick and duration, return true if frame is
     *  different.
     *  @param {number} [duration=this.duration] - The frame duration
     *  @returns {boolean}
     */
    update(duration = this.duration) {
        if (!this.loop && this.value === this.frames - 1) {
            return false;
        }
        let frame = this.value;
        this.tick += Manager.Stack.elapsedTime;
        if (this.tick >= duration) {
            this.value = (this.value + 1) % this.frames;
            this.tick = 0;
        }
        return (frame !== this.value);
    }
}
export { Frame };
