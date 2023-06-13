/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Mathf } from "../common/Mathf";

interface AnchorStruct {
    x: number,
    y: number
}

class Anchor2D {

    public static readonly MIDDLE_TOP = {x: 0, y: 1};
    public static readonly MIDDLE = {x: 0.5, y: 0.5};
    public static readonly MIDDLE_BOTTOM = {x: 0.5, y: 0};
    public static readonly LEFT_TOP = {x: 0, y: 1};
    public static readonly LEFT_MIDDLE = {x: 0, y: 0.5};
    public static readonly LEFT_BOTTOM = {x: 0, y: 0};
    public static readonly RIGHT_TOP = {x: 1, y: 1};
    public static readonly RIGHT_MIDDLE = {x: 1, y: 0.5};
    public static readonly RIGHT_BOTTOM = {x: 1, y: 0};

    public x: number;
    public y: number;

    constructor(x = 0.5, y = 0) {
        this.x = Mathf.clamp(x, 0, 1);
        this.y = Mathf.clamp(y, 0, 1);
    }

    set(anchors: AnchorStruct) {
        this.x = Mathf.clamp(anchors.x, 0, 1);
        this.y = Mathf.clamp(anchors.y, 0, 1);
    }
}

export { Anchor2D }