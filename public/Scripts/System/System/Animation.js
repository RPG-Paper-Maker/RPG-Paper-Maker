/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils } from '../Common/index.js';
var AnimationPositionKind = Enum.AnimationPositionKind;
import { Base } from './Base.js';
import { AnimationFrame } from './AnimationFrame.js';
import { Vector2 } from '../Core/index.js';
/** @class
 *  An animation of a skill / item / weapon or for display animation command.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  animation
 */
class Animation extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the animation
     *  @param {Record<string, any>} - json Json object describing the animation
     */
    read(json) {
        this.pictureID = Utils.defaultValue(json.pid, 1);
        this.positionKind = Utils.defaultValue(json.pk, AnimationPositionKind
            .Middle);
        this.frames = [];
        Utils.readJSONSystemList({ list: json.f, listIDs: this.frames, cons: AnimationFrame });
        this.rows = Utils.defaultValue(json.r, 5);
        this.cols = Utils.defaultValue(json.c, 5);
    }
    /**
     *  Play the sounds according to frame and condition.
     *  @param {number} frame - The frame
     *  @param {AnimationEffectConditionKind} condition - The condition
     */
    playSounds(frame, condition) {
        if (frame > 0 && frame < this.frames.length) {
            this.frames[frame].playSounds(condition);
        }
    }
    /**
     *  Draw the animation.
     *  @param {Picture2D} picture - The picture associated to the animation
     *  @param {number} frame - The frame
     *  @param {Battler} battler - The battler target
     */
    draw(picture, frame, battler) {
        if (frame > 0 && frame < this.frames.length) {
            // Change position according to kind
            let position;
            switch (this.positionKind) {
                case AnimationPositionKind.Top:
                    position = battler.topPosition;
                    break;
                case AnimationPositionKind.Middle:
                    position = battler.midPosition;
                    break;
                case AnimationPositionKind.Bottom:
                    position = battler.botPosition;
                    break;
                case AnimationPositionKind.ScreenCenter:
                    position = new Vector2(0, 0);
                    break;
            }
            // Draw
            this.frames[frame].draw(picture, position, this.rows, this.cols);
        }
    }
}
export { Animation };
