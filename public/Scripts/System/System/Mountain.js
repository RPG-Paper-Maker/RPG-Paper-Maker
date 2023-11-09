/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Utils } from '../Common/index.js';
var MountainCollisionKind = Enum.MountainCollisionKind;
import { SpecialElement } from './SpecialElement.js';
/** @class
 *  A mountain of the game.
 *  @extends System.SpecialElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  mountain
 */
class Mountain extends SpecialElement {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the mountain.
     *  @param {Record<string, any>} - json Json object describing the mountain
     */
    read(json) {
        super.read(json);
        this.id = json.id;
        this.collisionKind = Utils.defaultValue(json.mck, MountainCollisionKind
            .Default);
    }
    /**
     *  Check if the collision is always forced.
     *  @returns {boolean}
     */
    forceAlways() {
        return this.collisionKind === MountainCollisionKind.Always;
    }
    /**
     *  Check if the collision is never forced
     *  @returns {boolean}
     */
    forceNever() {
        return this.collisionKind === MountainCollisionKind.Never;
    }
}
export { Mountain };
