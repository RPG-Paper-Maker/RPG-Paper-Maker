/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils } from "../Common/index.js";
var SongKind = Enum.SongKind;
var AnimationEffectConditionKind = Enum.AnimationEffectConditionKind;
import { Base } from "./Base.js";
import { PlaySong } from "./PlaySong.js";
/** @class
 *  An animation frame effect.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  animation frame effect
 */
class AnimationFrameEffect extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the animation frame effect.
     *  @param {Record<string, any>} - json Json object describing the animation
     *  frame effect
     */
    read(json) {
        this.isSE = Utils.defaultValue(json.ise, true);
        if (this.isSE) {
            this.se = new PlaySong(SongKind.Sound, json.se);
        }
        this.condition = Utils.defaultValue(json.c, AnimationEffectConditionKind
            .None);
    }
    /**
     *  Play the sound effect according to a condition.
     *  @param {AnimationEffectConditionKind} condition - The animation effect
     *  condition kind
     */
    playSE(condition) {
        if (this.isSE && (this.condition === AnimationEffectConditionKind.None
            || this.condition === condition)) {
            this.se.playSound();
        }
    }
}
export { AnimationFrameEffect };
