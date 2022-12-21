/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Node } from "./Node.js";
/** @class
 *  Datas structure of tree.
 *  @param {any} data - The data
 */
class Tree {
    /**
     * The data of the visual tree.
     * @param {any} data
     */
    constructor(data) {
        this.root = new Node(null, data);
    }
    /**
     * Add a new child.
     * @param {Record<string, any>} - data
     * @returns {Node}
     */
    add(data) {
        return this.root.add(data);
    }
}
export { Tree };
