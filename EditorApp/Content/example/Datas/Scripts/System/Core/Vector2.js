/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from "../Globals.js";
/**
 * The data class who hold 2D coordinates.
 * It's used as an API bridge between the user and Three.js
 * @author Nio Kasgami
 */
export class Vector2 extends THREE.Vector2 {
    /**
     * The data class who hold 2D coordinates.
     * @param x the - x axis
     * @param y the - y axis
     */
    constructor(x = 0, y = 0) {
        super(x, y);
    }
    reset() {
        this.x = 0;
        this.y = 0;
    }
}
