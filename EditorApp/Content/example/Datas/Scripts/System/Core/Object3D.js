/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { MapElement } from "./MapElement.js";
/** @class
 *  The abstract class who model the Structure of RPM datas.
 *  @extends MapElement
 */
class Object3D extends MapElement {
    constructor() {
        super();
    }
    /**
     *  Read the JSON associated to the object 3D.
     *  @param {Record<string, any>} json - Json object describing the object 3D
     */
    read(json) {
        super.read(json);
    }
}
export { Object3D };
