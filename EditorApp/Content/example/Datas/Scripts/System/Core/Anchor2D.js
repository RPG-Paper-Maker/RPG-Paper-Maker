/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Mathf } from "../Common/index.js";
/**
 * The data class who manage Sprite anchor in 2D
 */
class Anchor2D {
    /**
     * The data class who manage sprite anchor in 2D
     * @param x
     * @param y
     */
    constructor(x = 0.5, y = 0) {
        this.x = Mathf.clamp(x, 0, 1);
        this.y = Mathf.clamp(y, 0, 1);
    }
    /**
     * Set the anchors using object format (can also use premade).
     *
     * @param {AnchorStruct} anchors
     * @memberof Anchor2D
     */
    set(anchors) {
        this.x = Mathf.clamp(anchors.x, 0, 1);
        this.y = Mathf.clamp(anchors.y, 0, 1);
    }
}
Anchor2D.MIDDLE_TOP = { x: 0, y: 1 };
Anchor2D.MIDDLE = { x: 0.5, y: 0.5 };
Anchor2D.MIDDLE_BOTTOM = { x: 0.5, y: 0 };
Anchor2D.LEFT_TOP = { x: 0, y: 1 };
Anchor2D.LEFT_MIDDLE = { x: 0, y: 0.5 };
Anchor2D.LEFT_BOTTOM = { x: 0, y: 0 };
Anchor2D.RIGHT_TOP = { x: 1, y: 1 };
Anchor2D.RIGHT_MIDDLE = { x: 1, y: 0.5 };
Anchor2D.RIGHT_BOTTOM = { x: 1, y: 0 };
export { Anchor2D };
